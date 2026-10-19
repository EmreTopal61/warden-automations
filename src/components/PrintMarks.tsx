import { useId } from 'react';

// Basılı belgenin el işçiliği: kaşe, guilloche şerit, kalın-ince çift çizgi.

function rosettePath(cx: number, cy: number, r: number, petals: number, depth: number): string {
  const pts: string[] = [];
  const n = 360;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const rr = r * (1 - depth + depth * Math.cos(petals * t));
    pts.push(`${(cx + rr * Math.cos(t)).toFixed(2)},${(cy + rr * Math.sin(t)).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

const MARK_ROSETTES = [0, 1, 2, 3, 4].map((i) => rosettePath(100, 100, 56 - i * 4, 7, 0.32 + i * 0.03));

function safeId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, '');
}

interface SealProps {
  size?: number;
  className?: string;
  /** Kaşenin ortasındaki büyük kelime; boşsa ortada rozet basılır. */
  word?: string;
  registryNo?: string;
  date?: string;
  title?: string;
}

/** Şirket kaşesi. Rengi `currentColor`'dan alır; ziyaretçiye ait olduğunda mor mürekkeple basılır. */
export function Seal({ size = 120, className, word, registryNo, date, title }: SealProps) {
  const uid = safeId(useId());
  const ring = `ring-${uid}`;
  const ink = `ink-${uid}`;
  const small = size < 64;
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <path id={ring} d="M100,100 m-73,0 a73,73 0 1,1 146,0 a73,73 0 1,1 -146,0" />
        {/* lastik kaşenin eşit dağılmayan mürekkebi */}
        <filter id={ink} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.2 2.35"
            result="speckle"
          />
          <feComposite in="SourceGraphic" in2="speckle" operator="in" />
        </filter>
      </defs>
      <g filter={small ? undefined : `url(#${ink})`}>
        <g fill="none" stroke="currentColor">
          <circle cx="100" cy="100" r="95" strokeWidth={small ? 7 : 4} />
          <circle cx="100" cy="100" r="86" strokeWidth={small ? 3 : 1.4} />
          {!small && <circle cx="100" cy="100" r="61" strokeWidth="1.4" />}
        </g>
        {!small && (
          <text fill="currentColor" fontSize="11.5" fontWeight="700" style={{ fontStretch: '112%' }}>
            <textPath href={`#${ring}`} textLength="452" lengthAdjust="spacing">
              WARDEN AUTOMATIONS · İSTANBUL · FORM WA-01 ·
            </textPath>
          </text>
        )}
        {word ? (
          <g fill="currentColor" textAnchor="middle">
            <text x="100" y="98" fontSize="23" fontWeight="800" style={{ fontStretch: '125%' }}>
              {word}
            </text>
            <line x1="56" x2="144" y1="108" y2="108" stroke="currentColor" strokeWidth="1.4" />
            {registryNo && (
              <text x="100" y="124" fontSize="11" fontWeight="600" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {registryNo}
              </text>
            )}
            {date && (
              <text x="100" y="138" fontSize="10" fontWeight="500" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {date}
              </text>
            )}
          </g>
        ) : (
          <g fill="none" stroke="currentColor" strokeWidth={small ? 3.2 : 1}>
            {(small ? MARK_ROSETTES.slice(0, 2) : MARK_ROSETTES).map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}

/** Banknot kenarlarındaki örgülü dalga şeridi. Genişliğe göre esner, çizgi kalınlığı sabit kalır. */
export function GuillocheBand({ className, strands = 6 }: { className?: string; strands?: number }) {
  const W = 1200;
  const H = 40;
  const paths: { d: string; tone: 'ink' | 'green' }[] = [];
  for (let i = 0; i < strands; i++) {
    const phase = (i / strands) * Math.PI * 2;
    const pts: string[] = [];
    for (let x = 0; x <= W; x += 4) {
      const env = 0.72 + 0.28 * Math.cos((x / W) * Math.PI * 14 + phase * 0.5);
      const y = H / 2 + (H / 2 - 3) * env * Math.sin((x / 34) * Math.PI + phase);
      pts.push(`${x},${y.toFixed(2)}`);
    }
    paths.push({ d: `M${pts.join('L')}`, tone: i % 3 === 0 ? 'ink' : 'green' });
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke={p.tone === 'ink' ? '#151A27' : '#6F8F80'}
          strokeOpacity={p.tone === 'ink' ? 0.55 : 0.8}
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/** Resmi formlardaki kalın-ince çift çizgi. */
export function DoubleRule({ className = '' }: { className?: string }) {
  return (
    <div className={`border-t-[3px] border-ink ${className}`} aria-hidden="true">
      <div className="mt-[3px] border-t border-ink" />
    </div>
  );
}
