const faqs = [
  {
    q: 'Formu doldurmak beni bir şeye bağlar mı?',
    a: 'Hayır. Form ücretsizdir ve sizi hiçbir şeye bağlamaz. Öneriyi okuyup mantıklı bulursanız devam ederiz; bulmazsanız elinizde işinizin hangi kısmının otomatikleşebileceğine dair yazılı bir not kalır.',
  },
  {
    q: 'Kurulum ne kadar sürer?',
    a: 'İhtiyaç netleştikten sonra çoğu otomasyon 1–2 hafta içinde çalışır hale gelir. Mevcut araçlarınıza (CRM, takvim, e-posta, Excel) bağlantı bu süreye dahildir; siz işinize devam ederken biz sistemi arka planda kurarız.',
  },
  {
    q: 'Mevcut CRM ve araçlarımla çalışır mı?',
    a: 'Evet. Otomasyonlarımızı n8n üzerinde kuruyoruz; HubSpot, Pipedrive, Google Sheets, Gmail, WhatsApp ve Calendly gibi yüzlerce araçla hazır bağlantısı var. Özel bir iç sisteminiz varsa API üzerinden bağlarız.',
  },
  {
    q: 'Verilerim güvende mi?',
    a: 'Veri işleme süreçlerimiz KVKK’ya uygun olacak şekilde tasarlanır. Verileriniz üçüncü taraflarla paylaşılmaz; erişim yetkileri proje başında sizinle birlikte tanımlanır.',
  },
  {
    q: 'Fiyatlandırma nasıl çalışıyor?',
    a: 'Her işletmenin ihtiyacı farklı olduğu için sabit paket yerine kapsama göre teklif hazırlıyoruz. Formdaki cevaplarınız ve ardından yapacağımız 15 dakikalık görüşme, net bir kapsam ve fiyat çıkarmamıza yeter.',
  },
  {
    q: 'Hangi sektörlerle çalışıyorsunuz?',
    a: 'Tekrarlanan işi olan her sektörle: üretim, lojistik, perakende, restoran, sağlık, emlak, ajans ve danışmanlık işletmeleri. Otomasyon sektöre göre değil, sizin iş akışınıza göre tasarlanır.',
  },
];

const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export default function FaqSection() {
  return (
    <section id="sss" aria-labelledby="sss-title" className="px-5 sm:px-8 py-24 sm:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <div className="max-w-sheet mx-auto grid lg:grid-cols-12 gap-x-8 gap-y-8 border-t-2 border-ink pt-8">
        <div className="lg:col-span-4">
          <h2 id="sss-title" className="w-wide text-[2rem] sm:text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
            Sık sorulanlar
          </h2>
          <p className="pt-4 text-[17px] leading-relaxed text-ink-soft max-w-[36ch]">
            Sorunuz burada yoksa{' '}
            <a href="mailto:hello@wardenautomations.com" className="font-semibold text-ink underline hover:text-stamp">
              hello@wardenautomations.com
            </a>{' '}
            adresine yazın.
          </p>
        </div>
        <div className="lg:col-span-8">
          {faqs.map((f, i) => (
            <details key={f.q} className="faq group border-b border-rule" open={i === 0}>
              <summary className="flex items-start gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="tnum flex-none w-8 pt-[2px] text-[15px] font-semibold text-ink-faint">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-[18px] sm:text-[19px] font-semibold leading-snug text-ink group-hover:text-ink-soft">
                  {f.q}
                </span>
                <span aria-hidden="true" className="relative flex-none mt-[6px] w-4 h-4">
                  <span className="absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-ink" />
                  <span className="absolute top-0 bottom-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-ink transition-transform duration-200 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="pl-12 pr-8 pb-6 text-[17px] leading-relaxed text-ink-soft max-w-[64ch]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
