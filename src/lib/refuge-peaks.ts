import { getAllPeaks, getPeakHref } from '@/lib/environment';
import type { Refuge } from '@/lib/types';

/**
 * Vette vicine a un rifugio, derivate dal massiccio di appartenenza
 * (mappatura geografica valle → vette del dataset Ambiente).
 * Nessun dato inventato: associa solo vette realmente appartenenti
 * al gruppo montuoso della valle del rifugio.
 */

const VALLEY_PEAKS: Array<{ match: RegExp; peakIds: string[] }> = [
  {
    match: /ferret|veny|courmayeur|bianco|blanc|la salle|morgex/i,
    peakIds: ['mont-blanc', 'grandes-jorasses'],
  },
  {
    match: /gressoney|lys|ayas|champoluc|valsesia|anzasca|macugnaga|zermatt|mattertal|saastal/i,
    peakIds: [
      'monte-rosa-dufour',
      'lyskamm',
      'gnifetti',
      'zumstein',
      'piramide-vincent',
      'mont-nery',
    ],
  },
  {
    match: /valtournenche|cervin|matterhorn|breuil/i,
    peakIds: ['cervino', 'grand-tournalin', 'dent-herens'],
  },
  {
    match: /valpelline|bionaz|ollomont|by\b|bagnes|entremont|san bernardo|saint-bernard|bosses/i,
    peakIds: ['grand-combin', 'dent-herens', 'mont-velan'],
  },
  {
    match: /cogne|valnontey|valsavarenche|rh[eê]mes|orco|ceresole|nivolet|paradiso/i,
    peakIds: ['gran-paradiso', 'grivola', 'becca-di-moncorve'],
  },
  {
    match: /la thuile|rutor|valgrisenche|tarentaise|petit[- ]saint[- ]bernard/i,
    peakIds: ['dome-rutor'],
  },
  {
    match: /pila|charvensod|gressan|comboe|aosta/i,
    peakIds: ['mont-emilius', 'becca-di-nona'],
  },
  {
    match: /saint-barth[eé]lemy|nus|clavalit[eé]|fenis|champorcher|barbeston/i,
    peakIds: ['mont-barbeston', 'mont-emilius'],
  },
  {
    match: /mont mars|fontainemore|lys basso|issime|niel|coda/i,
    peakIds: ['mont-mars', 'mont-nery'],
  },
  {
    match: /fall[eè]re|vetan|saint-pierre|verrogne/i,
    peakIds: ['mont-fallere'],
  },
];

export type NearbyPeakLink = {
  id: string;
  name_it: string;
  name_en: string;
  elevation_m: number;
  href: string;
  is4000: boolean;
};

export function getNearbyPeaksForRefuge(refuge: Refuge, limit = 4): NearbyPeakLink[] {
  const haystack = `${refuge.valley_it} ${refuge.valley_en} ${refuge.name_it}`;
  const ids = new Set<string>();
  for (const rule of VALLEY_PEAKS) {
    if (rule.match.test(haystack)) {
      rule.peakIds.forEach((id) => ids.add(id));
    }
  }
  if (!ids.size) return [];

  const all = getAllPeaks();
  return all
    .filter((p) => ids.has(p.id))
    .sort((a, b) => b.elevation_m - a.elevation_m)
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      name_it: p.name_it,
      name_en: p.name_en,
      elevation_m: p.elevation_m,
      href: getPeakHref(p.id),
      is4000: Boolean(p.is_4000),
    }));
}
