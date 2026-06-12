import type { Trail, TrailConditions } from './types';
import {
  pickLocalized,
  pickLocalizedArray,
  pickLocalizedOptional,
} from './locale-content';

export type CountryCode = 'IT' | 'FR' | 'CH' | 'DE';

export const COUNTRY_FLAGS: Record<CountryCode, string> = {
  IT: '🇮🇹',
  FR: '🇫🇷',
  CH: '🇨🇭',
  DE: '🇩🇪',
};

const CH_WORDS = [
  'zermatt', 'svizz', 'swiss', 'suisse', 'schweiz', '(ch)', 'fouly', 'champex',
  'trient', 'saas', 'grächen', 'graechen', 'europahütte', 'europahutte',
  'st. niklaus', 'niklaus', 'randa', 'täsch', 'tasch', 'gruben', 'zinal',
  'haudères', 'hauderes', 'arolla', 'vallese', 'valais', 'wallis', 'bagnes',
  'bourg-saint-pierre', 'cabane', 'mauvoisin', 'entremont', 'hérens', 'anniviers',
  'turtmann', 'mattertal', 'saastal',
];
const FR_WORDS = [
  'chamonix', 'seigne', 'france', 'francia', '(fr)', 'montroc', 'houches',
  'contamines', 'chapieux', 'bonhomme', 'balme', 'flégère', 'flegere',
  'tré-le-champ', 'tre-le-champ', 'rosière', 'rosiere', 'sainte-foy',
  'monal', 'tarentaise', 'petit-saint-bernard', 'petit saint-bernard',
  'montvalezan', 'savoie', 'montjoie',
];

/** Infer countries touched by a stage (for cross-border tours). */
export function inferStageCountries(trail: Trail): CountryCode[] {
  const text = [
    trail.name_it,
    trail.name_en,
    trail.start.name,
    trail.end.name,
    trail.valley,
    ...(trail.municipalities ?? []),
  ]
    .join(' ')
    .toLowerCase();

  const flags = new Set<CountryCode>();
  if (CH_WORDS.some((w) => text.includes(w))) flags.add('CH');
  if (FR_WORDS.some((w) => text.includes(w))) flags.add('FR');

  // Tratto italiano se tocca la VdA o il Piemonte (testo o geografia)
  const midLat = (trail.start.coords.lat + trail.end.coords.lat) / 2;
  const midLng = (trail.start.coords.lng + trail.end.coords.lng) / 2;
  const inVda =
    midLat >= 45.52 && midLat <= 46.08 && midLng >= 6.88 && midLng <= 7.92;
  const inPiemonte = text.includes('piemonte') || text.includes('(to)') ||
    text.includes('(vc)') || text.includes('(vb)');

  if (inVda || inPiemonte || flags.size === 0) {
    flags.add('IT');
  }

  return [...flags];
}

export function isOutsideVda(trail: Trail): boolean {
  const midLat = (trail.start.coords.lat + trail.end.coords.lat) / 2;
  const midLng = (trail.start.coords.lng + trail.end.coords.lng) / 2;
  const inVda =
    midLat >= 45.52 && midLat <= 46.08 && midLng >= 6.88 && midLng <= 7.92;
  return !inVda;
}

export function getTrailLocalizedName(trail: Trail, locale: string): string {
  return pickLocalized(locale, {
    it: trail.name_it,
    en: trail.name_en,
    fr: trail.name_fr,
    de: trail.name_de,
  });
}

export function getTrailLocalizedShortDesc(trail: Trail, locale: string): string {
  return pickLocalized(locale, {
    it: trail.shortDescription_it,
    en: trail.shortDescription_en,
    fr: trail.shortDescription_fr,
    de: trail.shortDescription_de,
  });
}

export function getTrailLocalizedDescription(trail: Trail, locale: string): string {
  return pickLocalized(locale, {
    it: trail.description_it,
    en: trail.description_en,
    fr: trail.description_fr,
    de: trail.description_de,
  });
}

export function getTrailGeology(trail: Trail, locale: string): string | undefined {
  return pickLocalizedOptional(locale, {
    it: trail.geology_it,
    en: trail.geology_en,
    fr: trail.geology_fr,
    de: trail.geology_de,
  });
}

export function getTrailTransport(trail: Trail, locale: string): string | undefined {
  return pickLocalizedOptional(locale, {
    it: trail.transport_it,
    en: trail.transport_en,
    fr: trail.transport_fr,
    de: trail.transport_de,
  });
}

export function getTrailWaterSources(trail: Trail, locale: string): string | undefined {
  return pickLocalizedOptional(locale, {
    it: trail.water_sources_it,
    en: trail.water_sources_en,
    fr: trail.water_sources_fr,
    de: trail.water_sources_de,
  });
}

export function getTrailCulturalNotes(trail: Trail, locale: string): string | undefined {
  return pickLocalizedOptional(locale, {
    it: trail.cultural_notes_it,
    en: trail.cultural_notes_en,
    fr: trail.cultural_notes_fr,
    de: trail.cultural_notes_de,
  });
}

export function getTrailWarnings(trail: Trail, locale: string): string[] | undefined {
  return pickLocalizedArray(locale, {
    it: trail.warnings_it,
    en: trail.warnings_en,
    fr: trail.warnings_fr,
    de: trail.warnings_de,
  });
}

export function getTrailConditionsNote(
  conditions: TrailConditions,
  locale: string
): string {
  return pickLocalized(locale, {
    it: conditions.note_it,
    en: conditions.note_en,
    fr: conditions.note_fr,
    de: conditions.note_de,
  });
}

export function getWaypointNote(
  waypoint: { note_it?: string; note_en?: string; note_fr?: string; note_de?: string },
  locale: string
): string | undefined {
  return pickLocalizedOptional(locale, {
    it: waypoint.note_it,
    en: waypoint.note_en,
    fr: waypoint.note_fr,
    de: waypoint.note_de,
  });
}
