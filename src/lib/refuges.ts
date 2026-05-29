import refugesJson from '@/data/refuges.json';
import { RefugeSchema, type Refuge } from '@/lib/types';
import { getRefugeName } from '@/lib/refuge-locale';

const parsed = (refugesJson as unknown[]).map((r) => RefugeSchema.parse(r));

const bySlug = new Map<string, Refuge>();
for (const r of parsed) {
  bySlug.set(r.slug, r);
}

/** Nome luogo → slug rifugio (per sync tappe) */
export const REFUGE_NAME_TO_SLUG: Record<string, string> = {
  'Rifugio Walter Bonatti': 'rifugio-bonatti',
  'Rifugio Bonatti': 'rifugio-bonatti',
  'Rifugio Bertone': 'rifugio-bertone',
  'Rifugio Coda': 'rifugio-coda',
  'Rifugio Barma': 'rifugio-barma',
  'Rifugio Vieux Crest': 'rifugio-vieux-crest',
  'Rifugio Grand Tournalin': 'rifugio-grand-tournalin',
  'Rifugio Jean Barmasse': 'rifugio-jean-barmasse',
  'Rifugio Oratorio di Cuney': 'rifugio-oratorio-di-cuney',
  'Rifugio Oratorio di Cunéy': 'rifugio-oratorio-di-cuney',
  'Rifugio Champillon': 'rifugio-champillon',
  'Rifugio Pier Giorgio Frassati': 'rifugio-frassati',
  'Rifugio Elisabetta Soldini': 'rifugio-elisabetta-soldini',
  'Rifugio Elisabetta': 'rifugio-elisabetta-soldini',
  'Rifugio Maison Vieille': 'rifugio-maison-vieille',
  Promoud: 'bivacco-promoud',
  'Bivacco Promoud': 'bivacco-promoud',
  "Rifugio Chalet de l'Épée": 'rifugio-chalet-de-lepee',
  'Rifugio Chalet de l Epée': 'rifugio-chalet-de-lepee',
  'Rifugio Vittorio Sella': 'rifugio-vittorio-sella',
  'Rifugio Sogno di Berdzé': 'rifugio-sogno-di-berdze',
  'Rifugio Sogno di Berdze': 'rifugio-sogno-di-berdze',
  'Rifugio Dondena': 'rifugio-dondena',
  'Rifugio Deffeyes': 'rifugio-deffeyes',
  'Rifugio Albert Deffeyes': 'rifugio-deffeyes',
  'Rifugio Elena': 'rifugio-elena',
  'Rifugio Gabiet': 'rifugio-gabiet',
  'Rifugio Duca degli Abruzzi': 'rifugio-duca-degli-abruzzi',
  'Rifugio Oriondé': 'rifugio-orionde',
  'Rifugio Orionde': 'rifugio-orionde',
  'Rifugio Verney': 'rifugio-verney',
  'Rifugio Prarayer': 'rifugio-prarayer',
};

export function getAllRefuges(): Refuge[] {
  return parsed;
}

export function getRefugeBySlug(slug: string): Refuge | undefined {
  return bySlug.get(slug);
}

export function getRefugesByType(type: Refuge['type']): Refuge[] {
  return parsed.filter((r) => r.type === type);
}

export function getRefugeDisplayName(slug: string, locale: string): string {
  const r = bySlug.get(slug);
  if (!r) {
    return slug
      .replace(/^rifugio-|^bivacco-/, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  return getRefugeName(r, locale);
}

export function resolveRefugeSlugFromName(name: string): string | null {
  return REFUGE_NAME_TO_SLUG[name] ?? null;
}

export function extractRefugeSlugsFromTrail(trail: {
  refuges: string[];
  start: { name: string };
  end: { name: string };
  waypoints?: { name: string; type?: string }[];
}): string[] {
  const slugs = new Set<string>(trail.refuges);
  for (const name of [trail.start.name, trail.end.name]) {
    const s = resolveRefugeSlugFromName(name);
    if (s) slugs.add(s);
  }
  for (const wp of trail.waypoints ?? []) {
    if (wp.type === 'rifugio' || wp.type === 'bivacco' || wp.type === 'capanna') {
      const s = resolveRefugeSlugFromName(wp.name);
      if (s) slugs.add(s);
    }
  }
  return [...slugs];
}
