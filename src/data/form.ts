// Form WA-01 — otomasyon ihtiyaç formu.
// Sorular, seçenekler ve n8n webhook'una giden JSON burada tanımlanır; arayüz yalnızca bunu çizer.

export interface Choice {
  value: string;
  label: string;
}

export const SECTORS: Choice[] = [
  { value: 'uretim', label: 'Üretim' },
  { value: 'toptan-lojistik', label: 'Toptan, dağıtım, lojistik' },
  { value: 'perakende-eticaret', label: 'Perakende, e-ticaret' },
  { value: 'restoran-otel', label: 'Restoran, kafe, otel' },
  { value: 'saglik', label: 'Sağlık, klinik' },
  { value: 'emlak-insaat', label: 'Emlak, inşaat' },
  { value: 'ajans-danismanlik', label: 'Ajans, danışmanlık' },
  { value: 'egitim', label: 'Eğitim' },
  { value: 'diger', label: 'Diğer' },
];

export const EMPLOYEES: Choice[] = [
  { value: '1-5', label: '1–5' },
  { value: '6-20', label: '6–20' },
  { value: '21-50', label: '21–50' },
  { value: '51-200', label: '51–200' },
  { value: '200+', label: '200’den fazla' },
];

export const CHANNELS: Choice[] = [
  { value: 'telefon', label: 'Telefon' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sosyal-medya', label: 'Instagram, sosyal medya' },
  { value: 'web-formu', label: 'Web sitesi formu' },
  { value: 'eposta', label: 'E-posta' },
  { value: 'yuz-yuze', label: 'Yüz yüze, mağaza' },
  { value: 'pazaryeri', label: 'Pazaryerleri (Trendyol, Hepsiburada…)' },
  { value: 'bayi', label: 'Bayi, distribütör' },
];

export const TOOLS: Choice[] = [
  { value: 'excel-sheets', label: 'Excel, Google Sheets' },
  { value: 'erp-muhasebe', label: 'Muhasebe/ERP (Logo, Mikro, Netsis…)' },
  { value: 'crm', label: 'CRM (HubSpot, Pipedrive…)' },
  { value: 'whatsapp-business', label: 'WhatsApp Business' },
  { value: 'gmail-outlook', label: 'Gmail, Outlook' },
  { value: 'eticaret-altyapi', label: 'E-ticaret altyapısı (Shopify, İdeasoft, Ticimax…)' },
  { value: 'kagit-defter', label: 'Kâğıt, defter' },
  { value: 'hicbiri', label: 'Henüz düzenli bir araç yok' },
];

export const HOURS: Choice[] = [
  { value: '0-2', label: '2 saatten az' },
  { value: '2-5', label: '2–5 saat' },
  { value: '5-10', label: '5–10 saat' },
  { value: '10-20', label: '10–20 saat' },
  { value: '20+', label: '20 saatten fazla' },
];

export const LOSS_AREAS: Choice[] = [
  { value: 'gec-donus', label: 'Taleplere geç dönülüyor' },
  { value: 'teklif-takibi', label: 'Verilen teklifler takip edilmiyor' },
  { value: 'stok-siparis', label: 'Stok ve sipariş hataları' },
  { value: 'elle-veri', label: 'Elle veri girişinde hatalar' },
  { value: 'raporlama', label: 'Rapor hazırlamak çok vakit alıyor' },
  { value: 'yeni-musteri', label: 'Yeni müşteri bulmak zor' },
  { value: 'mesai-disi', label: 'Mesai dışında gelen talepler kaçıyor' },
  { value: 'diger', label: 'Başka bir yerde' },
];

export const BUDGETS: Choice[] = [
  { value: 'bilmiyorum', label: 'Henüz bilmiyorum' },
  { value: '0-15k', label: '15.000 ₺’ye kadar' },
  { value: '15k-50k', label: '15.000–50.000 ₺' },
  { value: '50k-150k', label: '50.000–150.000 ₺' },
  { value: '150k+', label: '150.000 ₺ üzeri' },
];

export const TIMELINES: Choice[] = [
  { value: 'hemen', label: 'Hemen' },
  { value: '1-3-ay', label: '1–3 ay içinde' },
  { value: 'arastiriyorum', label: 'Şimdilik araştırıyorum' },
];

export interface Answers {
  sector: string;
  sectorOther: string;
  employees: string;
  companyName: string;
  website: string;
  channels: string[];
  tools: string[];
  repetitiveTask: string;
  weeklyHours: string;
  lossAreas: string[];
  magicWand: string;
  budget: string;
  timeline: string;
  fullName: string;
  email: string;
  phone: string;
  kvkkConsent: boolean;
}

export const EMPTY_ANSWERS: Answers = {
  sector: '',
  sectorOther: '',
  employees: '',
  companyName: '',
  website: '',
  channels: [],
  tools: [],
  repetitiveTask: '',
  weeklyHours: '',
  lossAreas: [],
  magicWand: '',
  budget: '',
  timeline: '',
  fullName: '',
  email: '',
  phone: '',
  kvkkConsent: false,
};

/** Numaralı 15 soru; sıra formdaki sırayla aynıdır. */
export const QUESTION_KEYS = [
  'sector',
  'employees',
  'companyName',
  'website',
  'channels',
  'tools',
  'repetitiveTask',
  'weeklyHours',
  'lossAreas',
  'magicWand',
  'budget',
  'timeline',
  'fullName',
  'email',
  'phone',
] as const satisfies readonly (keyof Answers)[];

export type QuestionKey = (typeof QUESTION_KEYS)[number];

export const QUESTION_COUNT = QUESTION_KEYS.length;

export function questionNumber(key: QuestionKey): number {
  return QUESTION_KEYS.indexOf(key) + 1;
}

export function isAnswered(a: Answers, key: QuestionKey): boolean {
  const v = a[key];
  return Array.isArray(v) ? v.length > 0 : String(v).trim().length > 0;
}

export function countAnswered(a: Answers): number {
  return QUESTION_KEYS.filter((k) => isAnswered(a, k)).length;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Errors = Partial<Record<keyof Answers, string>>;

export function validate(a: Answers): Errors {
  const e: Errors = {};
  if (!a.sector) e.sector = 'Sektörünüzü işaretleyin.';
  else if (a.sector === 'diger' && !a.sectorOther.trim()) e.sectorOther = 'Sektörünüzü birkaç kelimeyle yazın.';
  if (!a.employees) e.employees = 'Çalışan sayısını işaretleyin.';
  if (!a.companyName.trim()) e.companyName = 'Şirketinizin adını yazın.';
  if (a.channels.length === 0) e.channels = 'En az bir kanal işaretleyin.';
  if (a.repetitiveTask.trim().length < 15)
    e.repetitiveTask = 'Bu işi bir iki cümleyle anlatın; öneri en çok bu cevaba dayanıyor.';
  if (!a.weeklyHours) e.weeklyHours = 'Yaklaşık bir süre işaretleyin.';
  if (a.lossAreas.length === 0) e.lossAreas = 'En az bir seçenek işaretleyin.';
  if (a.magicWand.trim().length < 5) e.magicWand = 'Kısaca da olsa yazın.';
  if (!a.timeline) e.timeline = 'Bir seçenek işaretleyin.';
  if (!a.fullName.trim()) e.fullName = 'Adınızı ve soyadınızı yazın.';
  if (!EMAIL_RE.test(a.email.trim())) e.email = 'Geçerli bir e-posta adresi yazın; sonucu buraya göndereceğiz.';
  if (!a.kvkkConsent) e.kvkkConsent = 'Formu gönderebilmek için bu onayı vermeniz gerekiyor.';
  return e;
}

/** Bir oturumda bir kez üretilen evrak numarası: WA-2026/04127 */
export function makeRegistryNo(date = new Date()): string {
  const n = Math.floor(1000 + Math.random() * 89000);
  return `WA-${date.getFullYear()}/${String(n).padStart(5, '0')}`;
}

function labelOf(list: Choice[], value: string): string {
  return list.find((c) => c.value === value)?.label ?? value;
}

function labelsOf(list: Choice[], values: string[]): string[] {
  return values.map((v) => labelOf(list, v));
}

/**
 * n8n webhook'una giden gövde. Değerler hem makine için (kod) hem de yapay zekâ için
 * okunur Türkçe etiketlerle gelir; `summary` alanı doğrudan bir LLM istemine verilebilir.
 */
export function buildPayload(a: Answers, registryNo: string) {
  const sectorLabel = a.sector === 'diger' ? a.sectorOther.trim() : labelOf(SECTORS, a.sector);
  const lines: [string, string][] = [
    ['Sektör', sectorLabel],
    ['Çalışan sayısı', labelOf(EMPLOYEES, a.employees)],
    ['Şirket', a.companyName.trim()],
    ['Web sitesi / Instagram', a.website.trim() || '—'],
    ['Müşterilerin ulaştığı kanallar', labelsOf(CHANNELS, a.channels).join(', ')],
    ['Kullanılan araçlar', labelsOf(TOOLS, a.tools).join(', ') || '—'],
    ['Her hafta tekrarlanan, en çok vakit alan iş', a.repetitiveTask.trim()],
    ['Bu işe haftada harcanan süre', labelOf(HOURS, a.weeklyHours)],
    ['Para / müşteri kaybedilen yerler', labelsOf(LOSS_AREAS, a.lossAreas).join(', ')],
    ['Yarından itibaren kendiliğinden yapılmasını istediği iş', a.magicWand.trim()],
    ['Bütçe aralığı', a.budget ? labelOf(BUDGETS, a.budget) : '—'],
    ['Başlama zamanı', labelOf(TIMELINES, a.timeline)],
  ];

  return {
    form: 'WA-01',
    registryNo,
    submittedAt: new Date().toISOString(),
    page: typeof window !== 'undefined' ? window.location.href : '',
    sector: a.sector,
    sectorLabel,
    employees: a.employees,
    companyName: a.companyName.trim(),
    website: a.website.trim(),
    channels: a.channels,
    channelLabels: labelsOf(CHANNELS, a.channels),
    tools: a.tools,
    toolLabels: labelsOf(TOOLS, a.tools),
    repetitiveTask: a.repetitiveTask.trim(),
    weeklyHours: a.weeklyHours,
    lossAreas: a.lossAreas,
    lossAreaLabels: labelsOf(LOSS_AREAS, a.lossAreas),
    magicWand: a.magicWand.trim(),
    budget: a.budget,
    timeline: a.timeline,
    fullName: a.fullName.trim(),
    email: a.email.trim(),
    phone: a.phone.trim(),
    kvkkConsent: a.kvkkConsent,
    summary: lines.map(([q, v]) => `${q}: ${v}`).join('\n'),
  };
}

export type FormPayload = ReturnType<typeof buildPayload>;

export const WEBHOOK_URL: string = import.meta.env.VITE_N8N_WEBHOOK_URL ?? '';
