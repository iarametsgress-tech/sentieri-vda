import type { Trail } from './types';
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

  const midLat = (trail.start.coords.lat + trail.end.coords.lat) / 2;
  const midLng = (trail.start.coords.lng + trail.end.coords.lng) / 2;
  const flags = new Set<CountryCode>();

  if (
    text.includes('zermatt') ||
    text.includes('svizz') ||
    text.includes('swiss') ||
    text.includes('suisse') ||
    text.includes('fouly') ||
    text.includes('champoluc') ||
    midLng < 6.82
  ) {
    flags.add('CH');
  }

  if (
    text.includes('chamonix') ||
    text.includes('seigne') ||
    text.includes('france') ||
    text.includes('francia') ||
    text.includes('montroc')
  ) {
    flags.add('FR');
  }

  const inVda =
    midLat >= 45.52 && midLat <= 46.08 && midLng >= 6.88 && midLng <= 7.92;

  if (inVda || flags.size === 0) {
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
