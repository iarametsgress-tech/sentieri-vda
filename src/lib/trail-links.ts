import { getRefugeBySlug, getRefugeDisplayName } from '@/lib/refuges';
import { resolvePeakIdFromName, getPeakHref } from '@/lib/environment';
import {
  getDifficultyHubHref,
  getThemeHubHref,
  getValleyHubHref,
  resolveTrailSpeciesId,
} from '@/lib/hubs';

/** Wikipedia per vette citate nelle schede */
const PEAK_WIKI: Record<string, { it: string; en: string }> = {
  'Monte Bianco': {
    it: 'https://it.wikipedia.org/wiki/Monte_Bianco',
    en: 'https://en.wikipedia.org/wiki/Mont_Blanc',
  },
  'Mont Blanc': {
    it: 'https://it.wikipedia.org/wiki/Monte_Bianco',
    en: 'https://en.wikipedia.org/wiki/Mont_Blanc',
  },
  'Monte Rosa': {
    it: 'https://it.wikipedia.org/wiki/Monte_Rosa',
    en: 'https://en.wikipedia.org/wiki/Monte_Rosa',
  },
  Cervino: {
    it: 'https://it.wikipedia.org/wiki/Cervino',
    en: 'https://en.wikipedia.org/wiki/Matterhorn',
  },
  'Gran Paradiso': {
    it: 'https://it.wikipedia.org/wiki/Gran_Paradiso',
    en: 'https://en.wikipedia.org/wiki/Gran_Paradiso',
  },
  'Grandes Jorasses': {
    it: 'https://it.wikipedia.org/wiki/Grandes_Jorasses',
    en: 'https://en.wikipedia.org/wiki/Grandes_Jorasses',
  },
  'Gran Combin': {
    it: 'https://it.wikipedia.org/wiki/Gran_Combin',
    en: 'https://en.wikipedia.org/wiki/Grand_Combin',
  },
  'Grand Combin': {
    it: 'https://it.wikipedia.org/wiki/Gran_Combin',
    en: 'https://en.wikipedia.org/wiki/Grand_Combin',
  },
  'Combin de Grafeneire': {
    it: 'https://it.wikipedia.org/wiki/Gran_Combin',
    en: 'https://en.wikipedia.org/wiki/Grand_Combin',
  },
  'Dôme de Rutor': {
    it: 'https://it.wikipedia.org/wiki/D%C3%B4me_de_Rutor',
    en: 'https://en.wikipedia.org/wiki/D%C3%B4me_de_Rutor',
  },
  Lyskamm: {
    it: 'https://it.wikipedia.org/wiki/Lyskamm',
    en: 'https://en.wikipedia.org/wiki/Lyskamm',
  },
  'Mont Mars': {
    it: 'https://it.wikipedia.org/wiki/Mont_Mars',
    en: 'https://en.wikipedia.org/wiki/Mont_Mars',
  },
  'Mont Nery': {
    it: 'https://it.wikipedia.org/wiki/Monte_Nery',
    en: 'https://en.wikipedia.org/wiki/Monte_Nery',
  },
  'Mont Barbeston': {
    it: 'https://it.wikipedia.org/wiki/Mont_Barbeston',
    en: 'https://en.wikipedia.org/wiki/Mont_Barbeston',
  },
  'Mont Vélan': {
    it: 'https://it.wikipedia.org/wiki/Monte_Velan',
    en: 'https://en.wikipedia.org/wiki/Mont_Velan',
  },
  'Grand Tournalin': {
    it: 'https://it.wikipedia.org/wiki/Grand_Tournalin',
    en: 'https://en.wikipedia.org/wiki/Grand_Tournalin',
  },
  'Becca di Nona': {
    it: 'https://it.wikipedia.org/wiki/Becca_di_Nona',
    en: 'https://en.wikipedia.org/wiki/Becca_di_Nona',
  },
  'Becca di Moncorvé': {
    it: 'https://it.wikipedia.org/wiki/Becca_di_Moncorv%C3%A9',
    en: 'https://en.wikipedia.org/wiki/Becca_di_Moncorv%C3%A9',
  },
};

export function resolveSpeciesId(slug: string): string | null {
  return resolveTrailSpeciesId(slug);
}

export function getSpeciesHref(speciesId: string): string {
  return `/ambiente?specie=${speciesId}#flora-fauna`;
}

export { getValleyHubHref, getDifficultyHubHref, getThemeHubHref };

export function getRefugeHref(refugeSlug: string): string | null {
  return getRefugeBySlug(refugeSlug) ? `/rifugi/${refugeSlug}` : null;
}

export function formatRefugeLabel(slug: string, locale = 'it'): string {
  return getRefugeDisplayName(slug, locale);
}

export function getPeakExternalUrl(peakName: string, locale: string): string | null {
  const entry = PEAK_WIKI[peakName];
  if (!entry) return null;
  return locale === 'it' ? entry.it : entry.en;
}

export function getPeakLinkHref(peakName: string, locale: string): string | null {
  const peakId = resolvePeakIdFromName(peakName);
  if (peakId) return getPeakHref(peakId);
  return getPeakExternalUrl(peakName, locale);
}

export function isPeakInternalLink(peakName: string): boolean {
  return resolvePeakIdFromName(peakName) !== null;
}

export { getMunicipalityHref, getValleyHref } from '@/lib/culture';

/** Link hub sentieri per valle (da label trail.valley) */
export function getValleyHrefFromLabel(label: string): string {
  return getValleyHubHref(label);
}
