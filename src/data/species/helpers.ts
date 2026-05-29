import type { DistributionZone, SpeciesLink } from '@/lib/species-types';

/** Zone ricorrenti in Valle d'Aosta */
export const Z = {
  granParadiso: (r = 18): DistributionZone => ({
    name_it: 'Gran Paradiso',
    name_en: 'Gran Paradiso',
    center: [7.27, 45.52],
    radiusKm: r,
  }),
  valsavarenche: (r = 12): DistributionZone => ({
    name_it: 'Valsavarenche',
    name_en: 'Valsavarenche',
    center: [7.21, 45.56],
    radiusKm: r,
  }),
  valpelline: (r = 14): DistributionZone => ({
    name_it: 'Valpelline',
    name_en: 'Valpelline',
    center: [7.35, 45.88],
    radiusKm: r,
  }),
  lys: (r = 14): DistributionZone => ({
    name_it: 'Valle del Lys',
    name_en: 'Lys Valley',
    center: [7.8, 45.85],
    radiusKm: r,
  }),
  valtournenche: (r = 12): DistributionZone => ({
    name_it: 'Valtournenche',
    name_en: 'Valtournenche',
    center: [7.62, 45.88],
    radiusKm: r,
  }),
  valFerret: (r = 11): DistributionZone => ({
    name_it: 'Val Ferret',
    name_en: 'Val Ferret',
    center: [7.04, 45.87],
    radiusKm: r,
  }),
  monteBianco: (r = 16): DistributionZone => ({
    name_it: 'Monte Bianco',
    name_en: 'Mont Blanc',
    center: [6.98, 45.86],
    radiusKm: r,
  }),
  bassaValle: (r = 14): DistributionZone => ({
    name_it: 'Bassa Valle',
    name_en: 'Lower valley',
    center: [7.77, 45.62],
    radiusKm: r,
  }),
  valCentrale: (r = 18): DistributionZone => ({
    name_it: 'Valle centrale',
    name_en: 'Central valley',
    center: [7.37, 45.72],
    radiusKm: r,
  }),
  montAvic: (r = 12): DistributionZone => ({
    name_it: 'Parco Mont Avic',
    name_en: 'Mont Avic Park',
    center: [7.48, 45.68],
    radiusKm: r,
  }),
  valGrisanche: (r = 10): DistributionZone => ({
    name_it: 'Valgrisenche',
    name_en: 'Valgrisenche',
    center: [7.06, 45.63],
    radiusKm: r,
  }),
};

export function wikiLinks(wikiIt: string, wikiEn: string): SpeciesLink[] {
  return [
    {
      label_it: 'Wikipedia (IT)',
      label_en: 'Wikipedia (IT)',
      url: `https://it.wikipedia.org/wiki/${wikiIt}`,
    },
    {
      label_it: 'Wikipedia (EN)',
      label_en: 'Wikipedia (EN)',
      url: `https://en.wikipedia.org/wiki/${wikiEn}`,
    },
  ];
}

export function faunaLinks(
  wikiIt: string,
  wikiEn: string,
  extra: SpeciesLink[] = []
): SpeciesLink[] {
  return [
    ...wikiLinks(wikiIt, wikiEn),
    {
      label_it: 'Parco Gran Paradiso',
      label_en: 'Gran Paradiso National Park',
      url: 'https://www.pngp.it/',
    },
    {
      label_it: 'Fauna Europaea',
      label_en: 'Fauna Europaea',
      url: 'https://fauna-eu.org/',
    },
    ...extra,
  ];
}

export function floraLinks(
  wikiIt: string,
  wikiEn: string,
  extra: SpeciesLink[] = []
): SpeciesLink[] {
  return [
    ...wikiLinks(wikiIt, wikiEn),
    {
      label_it: 'Acta Plantarum',
      label_en: 'Acta Plantarum',
      url: 'https://www.actaplantarum.org/',
    },
    {
      label_it: 'Flora Italiana',
      label_en: 'Flora Italiana',
      url: 'http://luirig.altervista.org/flora/',
    },
    ...extra,
  ];
}
