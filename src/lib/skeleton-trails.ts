import skeletonJson from '@/data/trails-skeleton.json';
import { TrailSchema, type Trail, type Difficulty } from './types';
import { roundDistanceKm, formatDistanceKm } from './format';

/**
 * I sentieri "scheletro" provengono dal Catasto Sentieri ufficiale della Regione VdA
 * (trails-skeleton.json). Hanno dati reali — nome, codice, distanza, dislivelli,
 * difficoltà, coordinate — ma campi editoriali vuoti (descrizioni, foto, valle).
 *
 * Questa normalizzazione li rende `Trail` validi SENZA inventare dati:
 * - nomi EN/FR/DE = nome IT (toponimi, lingua-neutri) finché non tradotti
 * - descrizione FATTUALE costruita dai numeri reali (non prosa inventata)
 * - durata STIMATA con formula CAI (distanza/dislivello reali)
 * - fitness/stagione derivati da difficoltà e quota reali
 * - foto = placeholder neutro condiviso (no foto specifica non verificata)
 *
 * Sono marcati col tag `skeleton`: le loro pagine restano navigabili ma
 * `noindex` finché non vengono arricchite (descrizione + foto verificate),
 * per non generare "thin content" penalizzabile da Google.
 */

export const SKELETON_TAG = 'skeleton';
const PLACEHOLDER_IMAGE = '/trails/_placeholder.svg';

const VALID_DIFF: Difficulty[] = ['T', 'E', 'EE', 'EEA', 'A'];
const FITNESS_BY_DIFF: Record<Difficulty, 1 | 2 | 3 | 4 | 5> = {
  T: 1,
  E: 2,
  EE: 3,
  EEA: 4,
  A: 5,
};

/** Stima durata con metodo CAI: piano 4 km/h, salita 400 m/h, discesa 600 m/h. */
function estimateDuration(distanceKm: number, gain: number, loss: number): number {
  const h = distanceKm / 4 + Math.max(gain, 0) / 400 + Math.max(loss, 0) / 600;
  return Math.max(0.5, Math.round(h * 2) / 2);
}

function difficultyOf(raw: unknown): Difficulty {
  return VALID_DIFF.includes(raw as Difficulty) ? (raw as Difficulty) : 'E';
}

function factualDescriptions(s: any, diff: Difficulty) {
  const km = formatDistanceKm(roundDistanceKm(s.distance_km ?? 0));
  const g = Math.round(s.elevation_gain_m ?? 0);
  const a = s.start?.name ?? '?';
  const b = s.end?.name ?? '?';
  const ea = s.start?.elevation_m;
  const eb = s.end?.elevation_m;
  const code = s.sct_code ?? s.slug;
  return {
    short_it: `${km} km · +${g} m · ${diff} — da ${a} a ${b}.`,
    short_en: `${km} km · +${g} m · ${diff} — from ${a} to ${b}.`,
    short_fr: `${km} km · +${g} m · ${diff} — de ${a} à ${b}.`,
    short_de: `${km} km · +${g} m · ${diff} — von ${a} nach ${b}.`,
    long_it: `${s.name_it}: sentiero ufficiale del Catasto Sentieri della Valle d'Aosta (${code}). Da ${a} (${ea} m) a ${b} (${eb} m), ${km} km con +${g} m di dislivello, difficoltà ${diff} (scala CAI). Tracciato e dati altimetrici dalla rete sentieristica regionale; scheda in arricchimento.`,
    long_en: `${s.name_it}: official trail from the Aosta Valley trail registry (${code}). From ${a} (${ea} m) to ${b} (${eb} m), ${km} km with +${g} m of ascent, difficulty ${diff} (CAI scale). Route and elevation data from the regional trail network; page being enriched.`,
    long_fr: `${s.name_it} : sentier officiel du cadastre des sentiers de la Vallée d'Aoste (${code}). De ${a} (${ea} m) à ${b} (${eb} m), ${km} km avec +${g} m de dénivelé, difficulté ${diff} (échelle CAI). Tracé et données altimétriques du réseau régional ; fiche en cours d'enrichissement.`,
    long_de: `${s.name_it}: offizieller Weg aus dem Wegekataster des Aostatals (${code}). Von ${a} (${ea} m) nach ${b} (${eb} m), ${km} km mit +${g} m Aufstieg, Schwierigkeit ${diff} (CAI-Skala). Strecke und Höhendaten aus dem regionalen Wegenetz; Seite wird ergänzt.`,
  };
}

function normalize(s: any): Trail | null {
  if (!s?.slug || !s?.name_it || typeof s.distance_km !== 'number') return null;

  const diff = difficultyOf(s.difficulty);
  const gain = Math.max(0, Math.round(s.elevation_gain_m ?? 0));
  const loss = Math.max(0, Math.round(s.elevation_loss_m ?? 0));
  const distance_km = roundDistanceKm(s.distance_km);
  const maxElev = Math.max(s.start?.elevation_m ?? 0, s.end?.elevation_m ?? 0);
  const highAltitude = maxElev > 2200;

  const d = factualDescriptions(s, diff);
  const name = s.name_it;

  const candidate = {
    ...s,
    name_en: s.name_en || name,
    name_fr: s.name_fr || name,
    name_de: s.name_de || name,
    shortDescription_it: s.shortDescription_it || d.short_it,
    shortDescription_en: s.shortDescription_en || d.short_en,
    shortDescription_fr: s.shortDescription_fr || d.short_fr,
    shortDescription_de: s.shortDescription_de || d.short_de,
    description_it: s.description_it || d.long_it,
    description_en: s.description_en || d.long_en,
    description_fr: s.description_fr || d.long_fr,
    description_de: s.description_de || d.long_de,
    difficulty: diff,
    distance_km,
    elevation_gain_m: gain,
    elevation_loss_m: loss,
    duration_hours: s.duration_hours ?? estimateDuration(distance_km, gain, loss),
    season:
      Array.isArray(s.season) && s.season.length
        ? s.season
        : highAltitude
          ? ['summer']
          : ['spring', 'summer', 'autumn'],
    best_months:
      Array.isArray(s.best_months) && s.best_months.length
        ? s.best_months
        : highAltitude
          ? [7, 8, 9]
          : [5, 6, 7, 8, 9, 10],
    fitness_level: s.fitness_level ?? FITNESS_BY_DIFF[diff],
    mobile_coverage: s.mobile_coverage ?? 'partial',
    valley: s.valley || '',
    gpx_path: s.gpx_path ?? null,
    enriched: s.enriched === true,
    image_credit: s.image_credit,
    image_source: s.image_source,
    hero_image: s.hero_image || PLACEHOLDER_IMAGE,
    image: s.image || PLACEHOLDER_IMAGE,
    gallery: Array.isArray(s.gallery) ? s.gallery : [],
    refuges: Array.isArray(s.refuges) ? s.refuges : [],
    flora: Array.isArray(s.flora) ? s.flora : [],
    fauna: Array.isArray(s.fauna) ? s.fauna : [],
    tags: Array.from(new Set([...(Array.isArray(s.tags) ? s.tags : []), SKELETON_TAG])),
  };

  const parsed = TrailSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

let cache: Trail[] | null = null;

/** Sentieri scheletro normalizzati e validi (escluso quanto sovrascritto dai curati a monte). */
export function getSkeletonTrails(): Trail[] {
  if (cache) return cache;
  cache = (skeletonJson as any[])
    .map(normalize)
    .filter((t): t is Trail => t !== null);
  return cache;
}

/** True se il sentiero è una scheda scheletro non ancora arricchita. */
export function isSkeletonTrail(trail: Trail): boolean {
  return trail.tags.includes(SKELETON_TAG);
}

/** True se scheletro arricchito (GPX + valle + descrizione + foto) → indicizzabile. */
export function isEnrichedTrail(trail: Trail): boolean {
  return trail.enriched === true;
}

/** True se ha una foto REALE verificata con attribuzione completa: non il
 *  placeholder, e con credito + fonte. Copre foto su Vercel Blob, /trails/geo/
 *  e i .jpg verificati committati. */
export function hasVerifiedGeolocatedPhoto(trail: Trail): boolean {
  const isReal = (s: string) => Boolean(s) && !s.includes('_placeholder');
  return (
    isReal(trail.image) &&
    isReal(trail.hero_image) &&
    Boolean(trail.image_credit && trail.image_source)
  );
}

/** Scheletri arricchiti (GPX + valle + descrizione + foto) → indicizzabili. */
export function shouldIndexTrail(trail: Trail): boolean {
  if (!isSkeletonTrail(trail)) return true;
  return isEnrichedTrail(trail) && hasVerifiedGeolocatedPhoto(trail);
}
