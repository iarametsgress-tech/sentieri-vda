import { getTrailsByTag } from './trails';
import type { Trail } from './types';
import {
  inferStageCountries,
  isOutsideVda,
  getTrailLocalizedName,
  getTrailLocalizedShortDesc,
  type CountryCode,
} from './stage-utils';

export const TOUR_IDS = [
  'tmb',
  'monte-rosa',
  'cervino',
  'gran-paradiso',
  'rutor',
  'gran-combin',
] as const;

export type TourId = (typeof TOUR_IDS)[number];

export const TOUR_TAGS: Record<TourId, string> = {
  tmb: 'tour-mont-blanc',
  'monte-rosa': 'tour-monte-rosa',
  cervino: 'tour-cervino',
  'gran-paradiso': 'tour-gran-paradiso',
  rutor: 'tour-rutor',
  'gran-combin': 'tour-gran-combin',
};

export const TOUR_HERO_IMAGES: Record<TourId, string> = {
  tmb: '/trails/monte-bianco.jpg',
  'monte-rosa': '/trails/monte-rosa.jpg',
  cervino: '/trails/cervino.jpg',
  'gran-paradiso': '/trails/gran-paradiso.jpg',
  rutor:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Ghiacciaio_del_Rutor%2C_Valsavarenche%2C_Valle_d%27Aosta%2C_Italia.jpg/1280px-Ghiacciaio_del_Rutor%2C_Valsavarenche%2C_Valle_d%27Aosta%2C_Italia.jpg',
  'gran-combin': '/trails/valpelline.jpg',
};

export const TOUR_ACCENTS: Record<
  TourId,
  'alpenglow' | 'ice' | 'emerald' | 'snow'
> = {
  tmb: 'alpenglow',
  'monte-rosa': 'ice',
  cervino: 'snow',
  'gran-paradiso': 'emerald',
  rutor: 'ice',
  'gran-combin': 'alpenglow',
};

export const TOUR_LINE_COLORS: Record<TourId, string> = {
  tmb: '#D4A574',
  'monte-rosa': '#5BC0EB',
  cervino: '#FAFAF7',
  'gran-paradiso': '#34D399',
  rutor: '#5BC0EB',
  'gran-combin': '#D4A574',
};

/** Legacy keys used in messages Tour.tmb etc. */
export const TOUR_MESSAGE_KEYS: Record<TourId, string> = {
  tmb: 'tmb',
  'monte-rosa': 'monteRosa',
  cervino: 'cervino',
  'gran-paradiso': 'granParadiso',
  rutor: 'rutor',
  'gran-combin': 'granCombin',
};

function stageNumber(slug: string, tag: string): number {
  const prefix = tag.replace(/^tour-/, 'tour-');
  const re = new RegExp(`${prefix}-tappa-(\\d+)`);
  const m = slug.match(re);
  return m ? parseInt(m[1], 10) : 999;
}

export function getTourStages(tag: string): Trail[] {
  const prefix = tag.replace(/^tour-/, 'tour-');
  return getTrailsByTag(tag).sort(
    (a, b) => stageNumber(a.slug, tag) - stageNumber(b.slug, tag)
  );
}

export function getTourById(id: string): TourId | undefined {
  return TOUR_IDS.find((t) => t === id);
}

export type RouteStageSummary = {
  slug: string;
  stageNum: number;
  name: string;
  shortDescription: string;
  distance_km: number;
  elevation_gain_m: number;
  difficulty: Trail['difficulty'];
  image: string;
  startName: string;
  endName: string;
  valley: string;
  countries: CountryCode[];
  outsideVda: boolean;
};

export function toRouteStageSummary(
  trail: Trail,
  tag: string,
  locale: string
): RouteStageSummary {
  return {
    slug: trail.slug,
    stageNum: stageNumber(trail.slug, tag),
    name: getTrailLocalizedName(trail, locale),
    shortDescription: getTrailLocalizedShortDesc(trail, locale),
    distance_km: trail.distance_km,
    elevation_gain_m: trail.elevation_gain_m,
    difficulty: trail.difficulty,
    image: trail.image || trail.hero_image,
    startName: trail.start.name,
    endName: trail.end.name,
    valley: trail.valley,
    countries: inferStageCountries(trail),
    outsideVda: isOutsideVda(trail),
  };
}
