import { getTrailsByTag } from '@/lib/trails';
import type { Trail } from '@/lib/types';
import {
  inferStageCountries,
  isOutsideVda,
  getTrailLocalizedName,
  getTrailLocalizedShortDesc,
  type CountryCode,
} from '@/lib/stage-utils';

function stageNumber(slug: string, prefix: string): number {
  const re = new RegExp(`${prefix}-tappa-(\\d+)`);
  const m = slug.match(re);
  return m ? parseInt(m[1], 10) : 999;
}

export function getAlteViaStages(tag: 'alta-via-1' | 'alta-via-2'): Trail[] {
  const prefix = tag;
  return getTrailsByTag(tag).sort(
    (a, b) => stageNumber(a.slug, prefix) - stageNumber(b.slug, prefix)
  );
}

export function getStageNumber(slug: string, prefix: string): number {
  return stageNumber(slug, prefix);
}

export type AlteViaStageSummary = {
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

export function toStageSummary(
  trail: Trail,
  prefix: string,
  locale: string
): AlteViaStageSummary {
  return {
    slug: trail.slug,
    stageNum: stageNumber(trail.slug, prefix),
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
