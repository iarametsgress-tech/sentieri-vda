import refugesJson from '@/data/refuges.json';
import { RefugeSchema, type Refuge, type RefugeImage, type Trail } from '@/lib/types';
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

export type GalleryImage = { src: string; alt: string; credit?: string | null };

function pickRefugeImageAlt(img: RefugeImage, locale: string): string {
  switch (locale) {
    case 'en':
      return img.alt_en;
    case 'fr':
      return img.alt_fr;
    case 'de':
      return img.alt_de;
    default:
      return img.alt_it;
  }
}

/**
 * Galleria di una tappa: unisce le immagini esplicite in `trail.gallery`
 * alle foto reali dei rifugi presenti sul percorso (con alt localizzato e credit).
 */
export function getTrailGalleryImages(
  trail: Pick<Trail, 'gallery' | 'name_it'>,
  refugeSlugs: string[],
  locale: string,
  limit = 12
): GalleryImage[] {
  const out: GalleryImage[] = [];
  const seen = new Set<string>();
  const push = (img: GalleryImage) => {
    if (img.src && !seen.has(img.src)) {
      seen.add(img.src);
      out.push(img);
    }
  };
  for (const src of trail.gallery ?? []) {
    push({ src, alt: trail.name_it });
  }
  for (const slug of refugeSlugs) {
    const r = bySlug.get(slug);
    if (!r) continue;
    for (const img of r.images) {
      push({ src: img.src, alt: pickRefugeImageAlt(img, locale), credit: img.credit });
    }
  }
  return out.slice(0, limit);
}

function haversineM(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/**
 * Rifugi e bivacchi che si trovano SUL percorso: la cui posizione è entro
 * `maxMeters` da un punto della traccia GPX. Usato per citare i punti
 * d'appoggio reali (incl. bivacchi) sulle schede sentiero.
 */
export function getRefugesNearGeoJSON(
  geojson: GeoJSON.FeatureCollection | null,
  maxMeters = 350
): { refuge: Refuge; distance_m: number }[] {
  if (!geojson) return [];
  const pts: { lat: number; lng: number }[] = [];
  for (const f of geojson.features) {
    if (f.geometry.type === 'LineString') {
      for (const c of f.geometry.coordinates as number[][]) pts.push({ lng: c[0], lat: c[1] });
    } else if (f.geometry.type === 'MultiLineString') {
      for (const line of f.geometry.coordinates as number[][][])
        for (const c of line) pts.push({ lng: c[0], lat: c[1] });
    }
  }
  if (pts.length < 2) return [];
  // downsample per performance
  const step = Math.max(1, Math.floor(pts.length / 400));
  const sampled = pts.filter((_, i) => i % step === 0);

  const out: { refuge: Refuge; distance_m: number }[] = [];
  for (const r of parsed) {
    let best = Infinity;
    for (const p of sampled) {
      const d = haversineM(r.coords, p);
      if (d < best) best = d;
      if (best <= maxMeters) break;
    }
    if (best <= maxMeters) out.push({ refuge: r, distance_m: Math.round(best) });
  }
  return out.sort((a, b) => a.distance_m - b.distance_m);
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
