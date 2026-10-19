import { Answers, EMPLOYEES, HOURS, SECTORS, countAnswered } from '../data/form';

// Rozet parametreleri ayrı dosyada: sayfa bunları three.js yüklenmeden hesaplayabilsin.

export interface RosetteParams {
  lobes: number; // zarf dalgası sayısı (sektör)
  winds: number; // ipliğin tüpe sarılma sayısı (çalışan sayısı)
  depth: number; // zarfın derinliği (haftalık saat)
  swell: number; // tüp kalınlığı (kanal sayısı)
  seed: number; // faz (şirket adı)
  marked: number; // cevaplanan soru sayısı = mor iplik sayısı
}

export const DEFAULT_PARAMS: RosetteParams = { lobes: 5, winds: 11, depth: 0.35, swell: 0.45, seed: 0.62, marked: 0 };

function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 997) / 997;
}

export function paramsFromAnswers(a: Answers): RosetteParams {
  const si = SECTORS.findIndex((s) => s.value === a.sector);
  const ei = EMPLOYEES.findIndex((s) => s.value === a.employees);
  const hi = HOURS.findIndex((s) => s.value === a.weeklyHours);
  const name = a.companyName.trim().toLocaleLowerCase('tr');
  return {
    lobes: si < 0 ? DEFAULT_PARAMS.lobes : 3 + si,
    winds: ei < 0 ? DEFAULT_PARAMS.winds : 9 + ei * 2,
    depth: hi < 0 ? DEFAULT_PARAMS.depth : 0.2 + hi * 0.15,
    swell: 0.3 + Math.min(a.channels.length, 8) * 0.05,
    // isim desenin fazını belirler; uzun anlatılan iş deseni yavaşça döndürür
    seed: (name ? hash01(name) : DEFAULT_PARAMS.seed) + Math.min(a.repetitiveTask.length, 600) / 2400,
    marked: countAnswered(a),
  };
}
