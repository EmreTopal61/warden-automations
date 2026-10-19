import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import AutomationForm from '../components/AutomationForm';
import FaqSection from '../components/FaqSection';
import { GuillocheBand } from '../components/PrintMarks';
import { paramsFromAnswers } from '../components/rosetteParams';
import { Answers, EMPTY_ANSWERS, QUESTION_COUNT, SECTORS } from '../data/form';

const Rosette3D = lazy(() => import('../components/Rosette3D'));

const DRAFT_KEY = 'warden-form-draft';

function loadDraft(): Answers {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    // onay her seferinde bilerek yeniden verilmeli; taslaktan geri yüklenmez
    if (raw) return { ...EMPTY_ANSWERS, ...JSON.parse(raw), kvkkConsent: false };
  } catch {
    /* tarayıcı depolaması kapalı olabilir; boş formla devam */
  }
  return EMPTY_ANSWERS;
}

const STEPS = [
  {
    what: 'Formu siz doldurursunuz.',
    detail: 'İşinizi kendi kelimelerinizle anlatırsınız. Teknik bilgi gerekmez, yaklaşık dört dakika sürer.',
  },
  {
    what: 'Cevaplarınız analiz akışında okunur.',
    detail:
      'Form, n8n üzerinde kurduğumuz akışa düşer. Yapay zekâ en çok zaman ve müşteri kaybettiren noktayı bulur, onu çözebilecek otomasyon örnekleriyle eşleştirir.',
  },
  {
    what: 'Öneriyi birlikte konuşuruz.',
    detail:
      'Size görüşme bağlantısı içeren bir e-posta gönderiyoruz. 15 dakikalık görüşmede şirketinize özel otomasyonu, neye bağlanacağını, kapsamını ve fiyatını netleştiririz.',
  },
];

// Kullanıcının n8n'de kurduğu gerçek akış türlerinden türetilmiş örnekler (müşteri vakası değil).
const EXAMPLES = [
  {
    code: 'Ö-01',
    who: 'Restoran, kafe',
    problem: 'Rezervasyonlar telefonda ve WhatsApp’ta dağılıyor.',
    automation: 'WhatsApp’tan gelen masa taleplerini okur, uygunluğa bakar, onay mesajını gönderir ve rezervasyon tablosuna yazar.',
    tools: 'WhatsApp Business, Google Sheets',
  },
  {
    code: 'Ö-02',
    who: 'Üretim, depo',
    problem: 'Stok Excel’de; eksik ancak sipariş gelince fark ediliyor.',
    automation: 'Drive’daki stok dosyasını her gün tarar, kritik seviyeye düşen kalemleri raporlar, sorumluya e-posta atar.',
    tools: 'Google Drive, Excel, Gmail',
  },
  {
    code: 'Ö-03',
    who: 'B2B satış',
    problem: 'Yeni müşteri listesi elle toplanıyor.',
    automation: 'Google Haritalar’da hedef bölge ve sektörü tarar, işletme bilgilerini toplar ve tabloya düzenli aktarır.',
    tools: 'Google Haritalar, Apify, Google Sheets',
  },
  {
    code: 'Ö-04',
    who: 'Satış ekipleri',
    problem: 'Tanıtım e-postaları herkese aynı metinle gidiyor.',
    automation: 'Her firmanın web sitesini okur, ona özel bir e-posta taslağı yazar ve gönderilmeden önce onayınıza sunar.',
    tools: 'Gmail, n8n',
  },
  {
    code: 'Ö-05',
    who: 'Yöneticiler',
    problem: 'Gelen kutusu her sabah yarım saati yiyor.',
    automation: 'Okunmamış e-postaları her sabah özetler, cevap bekleyenleri ayırır ve tek bir mesajda size iletir.',
    tools: 'Gmail, n8n',
  },
  {
    code: 'Ö-06',
    who: 'Pazarlama',
    problem: 'Rakip ve sektör takibi düzensiz.',
    automation: 'Seçtiğiniz kaynakları tarar, haftalık sektör özetini hazırlar ve Telegram ya da e-postayla gönderir.',
    tools: 'RSS, Telegram, Gmail',
  },
];

const TOOL_NAMES = [
  'n8n',
  'Google Sheets',
  'Gmail',
  'WhatsApp Business',
  'HubSpot',
  'Pipedrive',
  'Calendly',
  'Apify',
  'Hunter.io',
  'Instantly',
  'ZeroBounce',
  'Vapi',
];

interface Props {
  registryNo: string;
  onNewRegistry: () => void;
}

export default function WardenHome({ registryNo, onNewRegistry }: Props) {
  const [answers, setAnswers] = useState<Answers>(loadDraft);
  const sent = useRef(false);
  const reduceMotion = useReducedMotion();
  const heroParams = useMemo(() => paramsFromAnswers(answers), [answers]);

  useEffect(() => {
    if (sent.current) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...answers, kvkkConsent: false }));
    } catch {
      /* depolama yoksa taslak tutulmaz */
    }
  }, [answers]);

  const pickSector = (value: string) => {
    setAnswers((a) => ({ ...a, sector: value }));
    // form oradan devam eder: bir sonraki cevapsız soruya git
    requestAnimationFrame(() => {
      const target = document.getElementById(value === 'diger' ? 'q-sector' : 'q-employees');
      target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      target?.querySelector<HTMLElement>(value === 'diger' ? '#in-sectorOther' : 'input')?.focus({ preventScroll: true });
    });
  };

  return (
    <main id="top">
      {/* İLK SAYFA */}
      <section aria-labelledby="hero-title" className="px-5 sm:px-8 pt-6 sm:pt-8 pb-16 sm:pb-20">
        <div className="max-w-sheet mx-auto">
          <GuillocheBand className="block w-full h-7 sm:h-9" />
          <div className="grid lg:grid-cols-12 gap-x-8 gap-y-6 pt-10 sm:pt-14">
            <div className="lg:col-span-7">
              <h1
                id="hero-title"
                className="w-semiwide text-[2.55rem] sm:text-[3.7rem] lg:text-[4.35rem] xl:text-[5rem] font-bold leading-[0.98] tracking-[-0.035em] text-ink"
              >
                Şirketinizde hangi iş kendi kendine dönebilir?
              </h1>
              <p className="pt-6 text-[18px] sm:text-[20px] leading-relaxed text-ink-soft max-w-[52ch]">
                On beş soruluk formu doldurun. Cevaplarınızı n8n üzerinde kurduğumuz analiz akışından geçirip şirketinize
                özel, kurulabilir bir otomasyon önerisi çıkaralım.
              </p>

              <div className="mt-10 border-t-2 border-ink pt-4" role="group" aria-labelledby="hero-sector">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p id="hero-sector" className="text-[17px] font-semibold text-ink">
                    <span className="tnum text-ink-faint">01</span>&ensp;Sektörünüz
                  </p>
                  <p className="text-[14px] text-ink-faint">Bir kutu işaretleyin, form oradan devam eder.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 pt-3">
                  {SECTORS.map((s) => {
                    const on = answers.sector === s.value;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        aria-pressed={on}
                        onClick={() => pickSector(s.value)}
                        className="group flex items-start gap-3 py-2 pr-2 min-h-[44px] text-left"
                      >
                        <span
                          aria-hidden="true"
                          className="relative mt-[1px] flex-none w-[22px] h-[22px] border-[1.5px] border-ink bg-paper-lift/50 group-hover:bg-paper-lift"
                        >
                          {on && (
                            <svg viewBox="0 0 28 28" className="tick-x absolute -inset-[4px] w-[28px] h-[28px] text-stamp" fill="none">
                              <path d="M5.5 5.8C10 10.4 14.6 15.2 21.8 22.4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                              <path d="M22 5.4C16.6 10.6 11.8 15.8 6 22.2" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                            </svg>
                          )}
                        </span>
                        <span className="text-[16px] leading-snug text-ink">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <Suspense fallback={<div className="aspect-square w-full" />}>
                <Rosette3D
                  params={heroParams}
                  tiltWithScroll
                  label="Ziyaretçinin cevaplarıyla şekillenen üç boyutlu güvenlik deseni"
                  className="aspect-[5/4] sm:aspect-square w-full max-w-[560px] mx-auto"
                />
              </Suspense>
              <div className="absolute right-0 top-2 sm:top-6 max-w-[17rem] text-right">
                <p className="text-[14px] leading-snug text-ink-soft">
                  Bu desen sizin. Formdaki her cevap iplikleri yeniden örer; gönderdiğinizde kaşeyle mühürlenir.
                </p>
                <svg viewBox="0 0 120 100" className="ml-auto mt-1 w-[96px] h-[80px] text-ink" fill="none" aria-hidden="true">
                  <path d="M112 2 C112 44 84 78 16 94" stroke="currentColor" strokeWidth="1" />
                  <circle cx="14" cy="94.5" r="3" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>

          <dl className="mt-12 sm:mt-14 grid grid-cols-3 border-t border-ink">
            {[
              ['Süre', 'Yaklaşık 4 dakika'],
              ['Soru', String(QUESTION_COUNT)],
              ['Ücret', 'Yok'],
            ].map(([k, v], i) => (
              <div key={k} className={`py-4 pr-4 ${i > 0 ? 'pl-4 border-l border-rule' : ''}`}>
                <dt className="label text-ink-faint">{k}</dt>
                <dd className="tnum pt-1 text-[17px] font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* SÜREÇ */}
      <section id="surec" aria-labelledby="surec-title" className="px-5 sm:px-8 py-24 sm:py-32">
        <div className="max-w-sheet mx-auto grid lg:grid-cols-12 gap-x-8 gap-y-10 border-t-2 border-ink pt-8">
          <div className="lg:col-span-4">
            <h2 id="surec-title" className="w-wide text-[2rem] sm:text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
              Form nereye gider?
            </h2>
            <p className="pt-4 text-[17px] leading-relaxed text-ink-soft max-w-[36ch]">
              Hazır paket satmıyoruz. Önce işinizi dinliyor, sonra size uyan otomasyonu öneriyoruz.
            </p>
          </div>
          <ol className="lg:col-span-8 border-t border-ink">
            {STEPS.map((s, i) => (
              <li key={s.what} className="grid grid-cols-[3.5rem_1fr] sm:grid-cols-[4.5rem_1fr] gap-x-4 py-7 border-b border-ink">
                <span
                  aria-hidden="true"
                  className="tnum flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border-[1.5px] border-ink text-[17px] font-bold text-ink"
                >
                  {i + 1}
                </span>
                <div className="pt-2 sm:pt-[10px]">
                  <p className="text-[19px] font-semibold leading-snug text-ink">{s.what}</p>
                  <p className="pt-2 text-[17px] leading-relaxed text-ink-soft max-w-[58ch]">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ÖRNEKLER */}
      <section id="ornekler" aria-labelledby="ornekler-title" className="px-5 sm:px-8 py-8 sm:py-12">
        <div className="max-w-sheet mx-auto border-t-2 border-ink pt-8">
          <div className="grid lg:grid-cols-12 gap-x-8 gap-y-4">
            <h2
              id="ornekler-title"
              className="lg:col-span-6 w-wide text-[2rem] sm:text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink"
            >
              Kurabileceğimiz otomasyonlardan örnekler
            </h2>
            <p className="lg:col-span-5 lg:col-start-8 self-end text-[17px] leading-relaxed text-ink-soft">
              Fikir vermesi için. Size önerilecek otomasyon bu listeden seçilmez; formdaki cevaplarınıza göre hazırlanır.
            </p>
          </div>

          <div className="mt-10">
            <div
              className="hidden md:grid md:grid-cols-[4.5rem_10rem_1fr_1.35fr_11rem] gap-x-5 pb-2 border-b-2 border-ink label text-ink-faint"
              aria-hidden="true"
            >
              <span>Kod</span>
              <span>Kimin için</span>
              <span>Sorun</span>
              <span>Otomasyon</span>
              <span>Araçlar</span>
            </div>
            <ul>
              {EXAMPLES.map((e) => (
                <li
                  key={e.code}
                  className="grid grid-cols-[4rem_1fr] md:grid-cols-[4.5rem_10rem_1fr_1.35fr_11rem] gap-x-5 gap-y-1.5 py-5 border-b border-rule"
                >
                  <span className="tnum row-span-4 md:row-span-1 text-[15px] font-bold text-ink">{e.code}</span>
                  <span className="text-[15px] font-semibold text-ink">{e.who}</span>
                  <span className="text-[16px] leading-snug text-ink-soft">{e.problem}</span>
                  <span className="text-[16px] leading-snug text-ink">{e.automation}</span>
                  <span className="text-[14px] leading-snug text-ink-faint">{e.tools}</span>
                </li>
              ))}
            </ul>
            <p className="pt-6 text-[15px] leading-relaxed text-ink-soft max-w-[90ch]">
              <span className="font-semibold text-ink">Bağlanabildiğimiz araçlardan bazıları:</span> {TOOL_NAMES.join(' · ')}
            </p>
          </div>
        </div>
      </section>

      <AutomationForm
        answers={answers}
        onChange={setAnswers}
        registryNo={registryNo}
        onSent={() => {
          sent.current = true;
          try {
            localStorage.removeItem(DRAFT_KEY);
          } catch {
            /* depolama yoksa silinecek taslak da yok */
          }
        }}
        onReset={() => {
          sent.current = false;
          setAnswers(EMPTY_ANSWERS);
          onNewRegistry();
        }}
      />

      <FaqSection />
    </main>
  );
}
