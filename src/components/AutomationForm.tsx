import { lazy, Suspense, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Answers,
  BUDGETS,
  CHANNELS,
  Choice,
  EMPLOYEES,
  Errors,
  HOURS,
  LOSS_AREAS,
  QUESTION_COUNT,
  QuestionKey,
  SECTORS,
  TIMELINES,
  TOOLS,
  WEBHOOK_URL,
  buildPayload,
  countAnswered,
  isAnswered,
  questionNumber,
  validate,
} from '../data/form';
import { paramsFromAnswers } from './rosetteParams';
import { DoubleRule, Seal } from './PrintMarks';

const Rosette3D = lazy(() => import('./Rosette3D'));

const CALENDLY = 'https://calendly.com/e7555222/15-min-ai-strategy-discovery-call-warden-automations';

type Status = 'idle' | 'sending' | 'sent' | 'error';

// Hata olduğunda odak bu sırayla ilk hatalı soruya gider.
const ERROR_ORDER: (keyof Answers)[] = [
  'sector',
  'sectorOther',
  'employees',
  'companyName',
  'channels',
  'repetitiveTask',
  'weeklyHours',
  'lossAreas',
  'magicWand',
  'timeline',
  'fullName',
  'email',
  'kvkkConsent',
];

const SHORT_LABELS: Record<QuestionKey, string> = {
  sector: 'Sektör',
  employees: 'Çalışan',
  companyName: 'Şirket',
  website: 'Web / Instagram',
  channels: 'Kanallar',
  tools: 'Araçlar',
  repetitiveTask: 'Tekrarlanan iş',
  weeklyHours: 'Haftalık süre',
  lossAreas: 'Kayıp noktaları',
  magicWand: 'İlk otomasyon',
  budget: 'Bütçe',
  timeline: 'Başlangıç',
  fullName: 'Ad soyad',
  email: 'E-posta',
  phone: 'Telefon',
};

function summaryValue(a: Answers, k: QuestionKey): string {
  const pick = (list: Choice[], v: string) => list.find((c) => c.value === v)?.label ?? v;
  const many = (list: Choice[], vs: string[]) => vs.map((v) => pick(list, v)).join(', ');
  switch (k) {
    case 'sector':
      return a.sector === 'diger' ? a.sectorOther || 'Diğer' : pick(SECTORS, a.sector);
    case 'employees':
      return pick(EMPLOYEES, a.employees);
    case 'channels':
      return many(CHANNELS, a.channels);
    case 'tools':
      return many(TOOLS, a.tools);
    case 'weeklyHours':
      return pick(HOURS, a.weeklyHours);
    case 'lossAreas':
      return many(LOSS_AREAS, a.lossAreas);
    case 'budget':
      return pick(BUDGETS, a.budget);
    case 'timeline':
      return pick(TIMELINES, a.timeline);
    default:
      return String(a[k]);
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/* ---------- işaret kutusu: resmi formdaki gibi kare, işaret ziyaretçinin mor mürekkebi ---------- */

function Tick({
  id,
  type,
  name,
  checked,
  onChange,
  label,
  describedBy,
}: {
  id: string;
  type: 'radio' | 'checkbox';
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  describedBy?: string;
}) {
  return (
    <label htmlFor={id} className="group flex items-start gap-3 py-2 pr-3 min-h-[44px] cursor-pointer select-none">
      <input
        id={id}
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        aria-describedby={describedBy}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative mt-[1px] flex-none w-[22px] h-[22px] border-[1.5px] border-ink bg-paper-lift/50
          transition-colors group-hover:bg-paper-lift peer-focus-visible:outline peer-focus-visible:outline-2
          peer-focus-visible:outline-offset-2 peer-focus-visible:outline-stamp"
      >
        {checked && (
          <svg viewBox="0 0 28 28" className="tick-x absolute -inset-[4px] w-[28px] h-[28px] text-stamp" fill="none">
            <path d="M5.5 5.8C10 10.4 14.6 15.2 21.8 22.4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M22 5.4C16.6 10.6 11.8 15.8 6 22.2" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <span className="text-[16px] leading-snug text-ink">{label}</span>
    </label>
  );
}

/* ---------- soru satırı: numara sütunu + soru + kontrol ---------- */

function Question({
  k,
  label,
  hint,
  optional,
  error,
  group,
  children,
}: {
  k: QuestionKey;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  group?: boolean;
  children: ReactNode;
}) {
  const n = questionNumber(k);
  const errId = `err-${k}`;
  const hintId = `hint-${k}`;
  const Title = group ? 'legend' : 'label';
  const body = (
    <>
      <Title
        {...(group ? {} : { htmlFor: `in-${k}` })}
        className="float-left w-full font-semibold text-[17px] leading-snug text-ink"
      >
        {label}
        {optional && <span className="font-normal text-ink-faint"> · isteğe bağlı</span>}
      </Title>
      {hint && (
        <p id={hintId} className="clear-left pt-1 text-[15px] leading-relaxed text-ink-soft max-w-[62ch]">
          {hint}
        </p>
      )}
      <div className="clear-left pt-4">{children}</div>
      {error && (
        <p id={errId} role="alert" className="mt-2 text-[15px] font-medium text-registry">
          {error}
        </p>
      )}
    </>
  );
  return (
    <div id={`q-${k}`} className="grid grid-cols-[2.25rem_1fr] sm:grid-cols-[3rem_1fr] gap-x-2 py-7 border-b border-rule">
      <span className="tnum pt-[1px] text-[15px] font-semibold text-ink-faint" aria-hidden="true">
        {pad(n)}
      </span>
      {group ? <fieldset className="min-w-0">{body}</fieldset> : <div className="min-w-0">{body}</div>}
    </div>
  );
}

function SectionHead({ letter, title, note }: { letter: string; title: string; note: string }) {
  return (
    <div className="pt-12 first:pt-0">
      <div className="flex items-baseline gap-4 pb-3 border-b-2 border-ink">
        <span className="w-wide tnum text-[15px] font-bold text-ink">BÖLÜM {letter}</span>
        <h3 className="w-semiwide text-[22px] sm:text-[26px] font-bold leading-tight tracking-[-0.01em] text-ink">
          {title}
        </h3>
      </div>
      <p className="pt-3 text-[15px] text-ink-soft">{note}</p>
    </div>
  );
}

const lineInput =
  'w-full bg-transparent border-0 border-b border-ink/70 rounded-none px-0 py-2 text-[18px] font-medium text-stamp ' +
  'placeholder:font-normal placeholder:text-ink-faint focus:outline-none focus:border-b-2 focus:border-stamp ' +
  'aria-[invalid=true]:border-registry transition-[border-color]';

// cevap, defter çizgilerinin üstüne yazılır
const ruledArea =
  'w-full resize-y min-h-[128px] bg-transparent border-0 border-b border-ink/70 rounded-none px-0 pt-[3px] pb-0 ' +
  'text-[18px] leading-8 font-medium text-stamp placeholder:font-normal placeholder:text-ink-faint ' +
  'focus:outline-none focus:border-b-2 focus:border-stamp aria-[invalid=true]:border-registry ' +
  '[background-image:repeating-linear-gradient(to_bottom,transparent_0_31px,rgba(21,26,39,0.2)_31px_32px)] [background-attachment:local]';

/* ---------- form ---------- */

interface Props {
  answers: Answers;
  onChange: (next: Answers) => void;
  registryNo: string;
  onSent: () => void;
  onReset: () => void;
}

export default function AutomationForm({ answers, onChange, registryNo, onSent, onReset }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [trap, setTrap] = useState('');
  const sentEmail = useRef('');
  const reduceMotion = useReducedMotion();
  const today = useMemo(() => new Date().toLocaleDateString('tr-TR'), []);
  const answered = countAnswered(answers);
  const params = useMemo(() => paramsFromAnswers(answers), [answers]);
  const sealed = status === 'sent';

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    const next = { ...answers, [key]: value };
    onChange(next);
    if (tried) setErrors(validate(next));
  };

  const toggle = (key: 'channels' | 'tools' | 'lossAreas', value: string) => {
    const list = answers[key];
    let next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    // "araç yok" diğer araçlarla birlikte işaretlenemez
    if (key === 'tools') {
      if (value === 'hicbiri' && next.includes('hicbiri')) next = ['hicbiri'];
      else next = next.filter((v) => v !== 'hicbiri' || value === 'hicbiri');
    }
    set(key, next);
  };

  const described = (k: keyof Answers, hint = false) =>
    [hint ? `hint-${k}` : '', errors[k] ? `err-${k}` : ''].filter(Boolean).join(' ') || undefined;

  const single = (k: 'sector' | 'employees' | 'weeklyHours' | 'budget' | 'timeline', list: Choice[], cols = 'sm:grid-cols-2') => (
    <div className={`grid ${cols} gap-x-6`}>
      {list.map((c, i) => (
        <Tick
          key={c.value}
          id={`in-${k}${i === 0 ? '' : `-${i}`}`}
          type="radio"
          name={k}
          checked={answers[k] === c.value}
          onChange={() => set(k, c.value)}
          label={c.label}
          describedBy={described(k)}
        />
      ))}
    </div>
  );

  const multi = (k: 'channels' | 'tools' | 'lossAreas', list: Choice[]) => (
    <div className="grid sm:grid-cols-2 gap-x-6">
      {list.map((c, i) => (
        <Tick
          key={c.value}
          id={`in-${k}${i === 0 ? '' : `-${i}`}`}
          type="checkbox"
          name={k}
          checked={answers[k].includes(c.value)}
          onChange={() => toggle(k, c.value)}
          label={c.label}
          describedBy={described(k)}
        />
      ))}
    </div>
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    // botlar gizli alanı doldurur; onlara başarı gösterip hiçbir şey göndermeyiz
    if (trap) {
      setStatus('sent');
      return;
    }
    const errs = validate(answers);
    setErrors(errs);
    setTried(true);
    const first = ERROR_ORDER.find((k) => errs[k]);
    if (first) {
      const qKey = first === 'sectorOther' ? 'sector' : first === 'kvkkConsent' ? 'consent' : first;
      const box = document.getElementById(`q-${qKey}`);
      box?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      box?.querySelector<HTMLElement>('input, textarea')?.focus({ preventScroll: true });
      return;
    }

    setStatus('sending');
    const payload = buildPayload(answers, registryNo);
    try {
      if (WEBHOOK_URL) {
        const res = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else if (import.meta.env.DEV) {
        // geliştirme ortamında webhook tanımlı değilse akışı yine de gösterebilmek için
        console.info('[Form WA-01] VITE_N8N_WEBHOOK_URL tanımlı değil. Gönderilecek veri:', payload);
        await new Promise((r) => setTimeout(r, 900));
      } else {
        throw new Error('VITE_N8N_WEBHOOK_URL tanımlı değil');
      }
      sentEmail.current = payload.email;
      setStatus('sent');
      onSent();
      document.getElementById('form-sheet')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    } catch (err) {
      console.error('[Form WA-01] gönderilemedi', err);
      setStatus('error');
    }
  }

  function startOver() {
    setStatus('idle');
    setErrors({});
    setTried(false);
    onReset();
  }

  return (
    <section id="form" aria-labelledby="form-title" className="relative px-5 sm:px-8 pt-24 sm:pt-32 pb-24">
      <div id="form-sheet" className="max-w-sheet mx-auto scroll-mt-24">
        <DoubleRule />
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-6 pt-8">
          <div className="lg:col-span-7">
            <h2
              id="form-title"
              className="w-wide text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.02] tracking-[-0.02em] text-ink"
            >
              Otomasyon ihtiyaç formu
            </h2>
            <p className="pt-5 text-[18px] leading-relaxed text-ink-soft max-w-[58ch]">
              Teknik bilgi gerekmiyor. İşinizi bir çalışanınıza anlatır gibi anlatın; ne kadar somut yazarsanız öneri o
              kadar isabetli olur. Yıldızsız sorular isteğe bağlıdır.
            </p>
          </div>
          <dl className="lg:col-span-5 lg:col-start-8 self-end grid grid-cols-[max-content_max-content_1fr] sm:grid-cols-3 border-t border-l border-ink text-[14px]">
            {[
              ['Evrak no', <span className="text-registry">{registryNo}</span>],
              ['Tarih', today],
              ['Soru', String(QUESTION_COUNT)],
            ].map(([k, v], i) => (
              <div key={i} className="border-r border-b border-ink px-3 py-2.5">
                <dt className="label text-ink-faint">{k}</dt>
                <dd className="tnum pt-1 font-semibold text-ink whitespace-nowrap">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid lg:grid-cols-12 gap-x-8 pt-14">
          <div className="lg:col-span-8 relative">
            {sealed ? (
              <Receipt
                registryNo={registryNo}
                date={today}
                email={sentEmail.current}
                reduceMotion={!!reduceMotion}
                onStartOver={startOver}
              />
            ) : (
              <form noValidate onSubmit={submit} aria-describedby="form-title">
                {/* bot tuzağı: ekran okuyuculardan ve klavyeden gizli */}
                <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                  <label>
                    Faks numarası
                    <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                  </label>
                </div>

                <SectionHead letter="A" title="Şirketiniz" note="Kim olduğunuzu ve hangi alanda çalıştığınızı anlamamız için." />

                <Question k="sector" label="Sektörünüz *" error={errors.sector ?? errors.sectorOther} group>
                  {single('sector', SECTORS, 'sm:grid-cols-2 lg:grid-cols-3')}
                  {answers.sector === 'diger' && (
                    <div className="pt-3 max-w-md">
                      <label htmlFor="in-sectorOther" className="sr-only">
                        Sektörünüz
                      </label>
                      <input
                        id="in-sectorOther"
                        className={lineInput}
                        value={answers.sectorOther}
                        onChange={(e) => set('sectorOther', e.target.value)}
                        placeholder="Örn. tarım makineleri bayisi"
                        aria-invalid={!!errors.sectorOther}
                        aria-describedby={described('sectorOther')}
                      />
                    </div>
                  )}
                </Question>

                <Question k="employees" label="Kaç kişi çalışıyorsunuz? *" error={errors.employees} group>
                  {single('employees', EMPLOYEES, 'grid-cols-2 sm:grid-cols-5')}
                </Question>

                <Question k="companyName" label="Şirketinizin adı *" error={errors.companyName}>
                  <input
                    id="in-companyName"
                    className={lineInput}
                    value={answers.companyName}
                    onChange={(e) => set('companyName', e.target.value)}
                    autoComplete="organization"
                    aria-invalid={!!errors.companyName}
                    aria-describedby={described('companyName')}
                  />
                </Question>

                <Question
                  k="website"
                  label="Web siteniz ya da Instagram hesabınız"
                  hint="Varsa işinizi daha iyi tanımamıza yardımcı olur."
                  optional
                >
                  <input
                    id="in-website"
                    className={lineInput}
                    value={answers.website}
                    onChange={(e) => set('website', e.target.value)}
                    placeholder="ornek.com.tr ya da @hesabiniz"
                    inputMode="url"
                    autoComplete="url"
                    aria-describedby={described('website', true)}
                  />
                </Question>

                <SectionHead
                  letter="B"
                  title="İşiniz nasıl dönüyor?"
                  note="Otomasyon önerisinin dayanağı bu bölüm. Kısa ama somut cevaplar en iyisi."
                />

                <Question
                  k="channels"
                  label="Müşterileriniz size en çok nereden ulaşıyor? *"
                  hint="Birden fazla işaretleyebilirsiniz."
                  error={errors.channels}
                  group
                >
                  {multi('channels', CHANNELS)}
                </Question>

                <Question
                  k="tools"
                  label="Bugün hangi araçları kullanıyorsunuz?"
                  hint="Otomasyonu mevcut düzeninize bağlayabilmemiz için."
                  optional
                  group
                >
                  {multi('tools', TOOLS)}
                </Question>

                <Question
                  k="repetitiveTask"
                  label="Ekibinizin her hafta tekrar tekrar yaptığı, en çok vakit alan iş hangisi? *"
                  hint="Kim yapıyor, nereden başlıyor, nerede bitiyor? Birkaç cümle yeterli."
                  error={errors.repetitiveTask}
                >
                  <textarea
                    id="in-repetitiveTask"
                    className={ruledArea}
                    rows={4}
                    value={answers.repetitiveTask}
                    onChange={(e) => set('repetitiveTask', e.target.value)}
                    placeholder="Örn. Gelen siparişleri WhatsApp'tan okuyup Excel'e giriyoruz, sonra depoya tek tek telefonla iletiyoruz."
                    aria-invalid={!!errors.repetitiveTask}
                    aria-describedby={described('repetitiveTask', true)}
                  />
                </Question>

                <Question k="weeklyHours" label="Bu iş haftada toplam ne kadar sürüyor? *" error={errors.weeklyHours} group>
                  {single('weeklyHours', HOURS, 'sm:grid-cols-3')}
                </Question>

                <Question
                  k="lossAreas"
                  label="Sizce en çok nerede para ya da müşteri kaçırıyorsunuz? *"
                  hint="Birden fazla işaretleyebilirsiniz."
                  error={errors.lossAreas}
                  group
                >
                  {multi('lossAreas', LOSS_AREAS)}
                </Question>

                <SectionHead letter="C" title="Hedefiniz" note="Neyi ne zaman çözmek istediğinizi bilirsek öneriyi buna göre boyutlarız." />

                <Question
                  k="magicWand"
                  label="Yarın sabahtan itibaren tek bir iş kendiliğinden yapılsaydı, hangisi olurdu? *"
                  error={errors.magicWand}
                >
                  <textarea
                    id="in-magicWand"
                    className={ruledArea}
                    rows={3}
                    value={answers.magicWand}
                    onChange={(e) => set('magicWand', e.target.value)}
                    placeholder="Örn. Akşam gelen teklif taleplerine sabah beklemeden fiyat gitsin."
                    aria-invalid={!!errors.magicWand}
                    aria-describedby={described('magicWand')}
                  />
                </Question>

                <Question
                  k="budget"
                  label="Bu iş için düşündüğünüz bütçe aralığı"
                  hint="Kurulum için yaklaşık bir aralık. Bilmiyorsanız sorun değil."
                  optional
                  group
                >
                  {single('budget', BUDGETS, 'sm:grid-cols-2 lg:grid-cols-3')}
                </Question>

                <Question k="timeline" label="Ne zaman başlamak istersiniz? *" error={errors.timeline} group>
                  {single('timeline', TIMELINES, 'sm:grid-cols-3')}
                </Question>

                <SectionHead letter="D" title="İletişim" note="Size özel öneriyi göndereceğimiz yer." />

                <Question k="fullName" label="Adınız ve soyadınız *" error={errors.fullName}>
                  <input
                    id="in-fullName"
                    className={lineInput}
                    value={answers.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                    autoComplete="name"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={described('fullName')}
                  />
                </Question>

                <Question k="email" label="E-posta adresiniz *" error={errors.email}>
                  <input
                    id="in-email"
                    type="email"
                    className={lineInput}
                    value={answers.email}
                    onChange={(e) => set('email', e.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={described('email')}
                  />
                </Question>

                <Question k="phone" label="Telefon ya da WhatsApp numaranız" optional>
                  <input
                    id="in-phone"
                    type="tel"
                    className={lineInput}
                    value={answers.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="05xx xxx xx xx"
                  />
                </Question>

                <div id="q-consent" className="pt-8">
                  <Tick
                    id="in-kvkkConsent"
                    type="checkbox"
                    name="kvkkConsent"
                    checked={answers.kvkkConsent}
                    onChange={() => set('kvkkConsent', !answers.kvkkConsent)}
                    label="Bu formdaki bilgilerimin, bana otomasyon önerisi hazırlanması ve benimle iletişime geçilmesi amacıyla işlenmesini kabul ediyorum (KVKK)."
                    describedBy={errors.kvkkConsent ? 'err-kvkkConsent' : undefined}
                  />
                  {errors.kvkkConsent && (
                    <p id="err-kvkkConsent" role="alert" className="pl-[34px] text-[15px] font-medium text-registry">
                      {errors.kvkkConsent}
                    </p>
                  )}
                </div>

                {status === 'error' && (
                  <div role="alert" className="mt-8 border-t border-b border-registry py-4 text-[16px] text-registry">
                    Form gönderilemedi. Bağlantınızı kontrol edip tekrar deneyin. Sorun sürerse cevaplarınızı{' '}
                    <a href="mailto:hello@wardenautomations.com" className="underline font-semibold">
                      hello@wardenautomations.com
                    </a>{' '}
                    adresine yazabilirsiniz; evrak numaranızı ({registryNo}) eklemeyi unutmayın.
                  </div>
                )}

                {/* imza satırı: 13. sorudaki ad, ziyaretçinin mürekkebiyle */}
                <div className="mt-10 grid grid-cols-[auto_1fr] gap-x-8 max-w-xl">
                  <div>
                    <p className="label text-ink-faint">Tarih</p>
                    <p className="tnum pt-1 pb-1 min-h-[2.4rem] flex items-end border-b border-ink text-[17px] font-semibold text-ink">
                      {today}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="label text-ink-faint">İmza</p>
                    <p className="w-semiwide pt-1 pb-1 min-h-[2.4rem] flex items-end border-b border-ink text-[20px] leading-tight font-medium text-stamp">
                      <span className="truncate">{answers.fullName.trim() || ' '}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row sm:items-center gap-5">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-wide inline-flex items-center justify-center gap-3 min-h-[56px] px-8 bg-ink text-paper
                      text-[15px] font-bold uppercase tracking-[0.06em] transition-[background-color,transform]
                      hover:bg-[#262d40] active:translate-y-px disabled:cursor-wait disabled:bg-ink-soft"
                  >
                    {status === 'sending' ? 'Gönderiliyor…' : 'Formu imzala ve gönder'}
                  </button>
                  <p className="hidden lg:block text-[15px] text-ink-soft">
                    {answered} / {QUESTION_COUNT} soru cevaplandı · Evrak no{' '}
                    <span className="tnum text-registry font-semibold">{registryNo}</span>
                  </p>
                </div>

                {/* telefonda: formla birlikte kayan, gönder düğmesinde duran ilerleme şeridi + canlı desen */}
                <div className="lg:hidden sticky bottom-0 z-10 -mx-5 sm:-mx-8 mt-8 px-5 sm:px-8 py-2 bg-paper border-t border-ink">
                  <div className="flex items-center gap-3">
                    <Suspense fallback={<div className="w-14 h-14 flex-none" />}>
                      <Rosette3D
                        params={params}
                        label="Cevaplarınızla şekillenen güvenlik deseni"
                        className="w-14 h-14 flex-none"
                      />
                    </Suspense>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 text-[14px]">
                        <span className="font-semibold text-ink">
                          <span className="tnum">{answered}</span> / {QUESTION_COUNT} soru
                        </span>
                        <span className="tnum font-semibold text-registry">{registryNo}</span>
                      </div>
                      <div className="mt-2 h-[3px] bg-rule" aria-hidden="true">
                        <div
                          className="h-full bg-stamp transition-[width] duration-300"
                          style={{ width: `${(answered / QUESTION_COUNT) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
            {sealed && (
              <div className="lg:hidden pt-12">
                <Suspense fallback={<div className="aspect-square w-full max-w-[340px]" />}>
                  <Rosette3D
                    params={params}
                    sealed
                    label="Mühürlenmiş güvenlik deseniniz"
                    className="aspect-square w-full max-w-[340px]"
                  />
                </Suspense>
                <p className="pt-2 text-[14px] leading-snug text-ink-soft max-w-[34ch]">
                  Deseniniz mühürlendi. Bu desen yalnızca sizin cevaplarınızdan çıktı.
                </p>
              </div>
            )}
          </div>

          <aside className="hidden lg:block lg:col-span-4" aria-label="Evrak özeti">
            <div className="sticky top-24">
              <div>
                <Suspense fallback={<div className="aspect-square" />}>
                  <Rosette3D
                    params={params}
                    sealed={sealed}
                    label="Cevaplarınızla şekillenen güvenlik deseni"
                    className="aspect-square w-full"
                  />
                </Suspense>
                <p className="pb-4 text-[13px] leading-snug text-ink-soft">
                  {sealed
                    ? 'Deseniniz mühürlendi. Bu desen yalnızca sizin cevaplarınızdan çıktı.'
                    : 'Her cevap deseni yeniden örer. Mor iplikler sizin işaretleriniz.'}
                </p>
              </div>
              <div className="pt-4 border-t-2 border-ink">
                <div className="flex items-baseline justify-between pb-2">
                  <span className="label text-ink">Evrak özeti</span>
                  <span className="tnum text-[13px] font-semibold text-ink-soft">
                    {answered}/{QUESTION_COUNT}
                  </span>
                </div>
                <ol className="text-[13px] leading-snug">
                  {(Object.keys(SHORT_LABELS) as QuestionKey[]).map((k) => {
                    const has = isAnswered(answers, k);
                    return (
                      <li key={k} className="grid grid-cols-[1.75rem_6.75rem_1fr] gap-x-1 py-[3px] border-b border-rule/60">
                        <span className="tnum text-ink-faint">{pad(questionNumber(k))}</span>
                        <span className="text-ink-soft">{SHORT_LABELS[k]}</span>
                        <span className={`truncate ${has ? 'text-stamp font-medium' : 'text-ink-faint/70'}`}>
                          {has ? summaryValue(answers, k) : '…………'}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </section>
  );
}

/* ---------- gönderim sonrası: kaşe basılır, alındı belgesi ---------- */

function Receipt({
  registryNo,
  date,
  email,
  reduceMotion,
  onStartOver,
}: {
  registryNo: string;
  date: string;
  email: string;
  reduceMotion: boolean;
  onStartOver: () => void;
}) {
  return (
    <div className="relative min-h-[520px] pt-2" aria-live="polite">
      <motion.div
        className="text-stamp w-[220px] sm:w-[260px] origin-center"
        initial={reduceMotion ? false : { scale: 1.9, opacity: 0, y: -40, rotate: -3, filter: 'blur(6px)' }}
        animate={{ scale: 1, opacity: 1, y: 0, rotate: -9, filter: 'blur(0px)' }}
        transition={{ duration: 0.42, ease: [0.2, 0.9, 0.12, 1] }}
      >
        <Seal size={260} word="ALINDI" registryNo={registryNo} date={date} title={`Alındı kaşesi, evrak no ${registryNo}`} />
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduceMotion ? 0 : 0.55, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pt-10 max-w-[56ch]"
      >
        <h3 className="w-semiwide text-[28px] sm:text-[34px] font-bold leading-tight tracking-[-0.01em] text-ink">
          Formunuz alındı.
        </h3>
        <p className="pt-4 text-[18px] leading-relaxed text-ink-soft">
          Evrak numaranız <span className="tnum font-semibold text-registry">{registryNo}</span>. Cevaplarınızı analiz edip
          şirketinize özel otomasyon önerisini hazırlıyoruz
          {email && (
            <>
              ; <span className="font-semibold text-stamp">{email}</span> adresine görüşme bağlantısı içeren bir e-posta
              gönderiyoruz
            </>
          )}
          .
        </p>
        <p className="pt-3 text-[18px] leading-relaxed text-ink-soft">
          İsterseniz görüşme zamanını şimdi de seçebilirsiniz.
        </p>
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center gap-5">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="w-wide inline-flex items-center justify-center min-h-[56px] px-8 bg-ink text-paper text-[15px]
              font-bold uppercase tracking-[0.06em] hover:bg-[#262d40] transition-colors"
          >
            Görüşme ayarla
          </a>
          <button
            type="button"
            onClick={onStartOver}
            className="text-[16px] font-semibold text-ink underline underline-offset-4 decoration-1 hover:text-stamp"
          >
            Başka bir şirket için yeni form doldur
          </button>
        </div>
      </motion.div>
    </div>
  );
}
