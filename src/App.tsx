import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import WardenHome from './pages/WardenHome';
import { GuillocheBand, Seal } from './components/PrintMarks';
import { makeRegistryNo } from './data/form';

const CALENDLY = 'https://calendly.com/e7555222/15-min-ai-strategy-discovery-call-warden-automations';

const LINKS = [
  { label: 'Nasıl işler', href: '#surec' },
  { label: 'Örnekler', href: '#ornekler' },
  { label: 'Sorular', href: '#sss' },
];

function Wordmark() {
  return (
    <a href="#top" className="flex items-center gap-3 text-ink" aria-label="Warden Automations, sayfanın başı">
      <Seal size={34} />
      {/* lang="en": Türkçe büyük harf kuralı "AUTOMATİONS" yazmasın */}
      <span lang="en" className="w-wide text-[14px] font-bold uppercase tracking-[0.04em] leading-none">
        Warden Automations
      </span>
    </a>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [registryNo, setRegistryNo] = useState(() => makeRegistryNo());

  return (
    <div className="min-h-screen text-ink">
      <a
        href="#form"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:text-paper focus:px-4 focus:py-2"
      >
        Doğrudan forma geç
      </a>

      <header className="sticky top-0 z-40 bg-paper border-b border-ink">
        <div className="max-w-sheet mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
          <Wordmark />

          <p className="hidden xl:block tnum text-[13px] text-ink-soft">
            Form WA-01 · Evrak no <span className="font-semibold text-registry">{registryNo}</span>
          </p>

          <nav aria-label="Ana menü" className="hidden md:flex items-center gap-7">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-[15px] font-medium text-ink hover:underline">
                {l.label}
              </a>
            ))}
            <a
              href="#form"
              className="w-wide inline-flex items-center h-10 px-4 bg-ink text-paper text-[13px] font-bold uppercase tracking-[0.06em] hover:bg-[#262d40] transition-colors"
            >
              Formu doldur
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            className="md:hidden -mr-2 p-2 text-ink"
          >
            {menuOpen ? <X className="w-6 h-6" strokeWidth={1.75} /> : <Menu className="w-6 h-6" strokeWidth={1.75} />}
          </button>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Mobil menü" className="md:hidden border-t border-ink px-5 pb-5">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 border-b border-rule text-[17px] font-medium text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#form"
              onClick={() => setMenuOpen(false)}
              className="w-wide mt-4 flex items-center justify-center h-12 bg-ink text-paper text-[14px] font-bold uppercase tracking-[0.06em]"
            >
              Formu doldur
            </a>
            <p className="pt-3 tnum text-[13px] text-ink-soft">
              Evrak no <span className="font-semibold text-registry">{registryNo}</span>
            </p>
          </nav>
        )}
      </header>

      <WardenHome registryNo={registryNo} onNewRegistry={() => setRegistryNo(makeRegistryNo())} />

      <footer className="px-5 sm:px-8 pt-4 pb-10">
        <div className="max-w-sheet mx-auto">
          <GuillocheBand className="block w-full h-7 sm:h-9" />
          <div className="grid md:grid-cols-12 gap-x-8 gap-y-10 pt-10">
            <div className="md:col-span-5 flex items-start gap-5">
              <Seal size={96} className="flex-none text-ink" />
              <div>
                <p lang="en" className="w-wide text-[15px] font-bold uppercase tracking-[0.04em]">
                  Warden Automations
                </p>
                <p className="pt-2 text-[15px] leading-relaxed text-ink-soft max-w-[30ch]">
                  Şirketlere özel, yapay zekâ destekli iş otomasyonları. İstanbul.
                </p>
              </div>
            </div>
            <div className="md:col-span-4">
              <p className="label text-ink-faint">İletişim</p>
              <ul className="pt-3 space-y-2 text-[16px]">
                <li>
                  <a href="mailto:hello@wardenautomations.com" className="font-medium text-ink hover:underline">
                    hello@wardenautomations.com
                  </a>
                </li>
                <li>
                  <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="font-medium text-ink hover:underline">
                    15 dakikalık görüşme ayarla
                  </a>
                </li>
                <li className="text-ink-soft">İstanbul, Türkiye</li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <p className="label text-ink-faint">Bu sayfada</p>
              <ul className="pt-3 space-y-2 text-[16px]">
                {[...LINKS, { label: 'Form WA-01', href: '#form' }, { label: 'KVKK aydınlatma metni', href: '/kvkk.html' }].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="font-medium text-ink hover:underline">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-4 border-t border-ink flex flex-col sm:flex-row sm:justify-between gap-2 text-[13px] text-ink-faint">
            <p>© {new Date().getFullYear()} Warden Automations. Tüm hakları saklıdır.</p>
            <p className="tnum">Form WA-01 · Rev. 10/2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
