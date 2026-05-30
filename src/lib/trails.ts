import trailsJson from '@/data/trails.json';
import routesJson from '@/data/trails-routes.json';
import { TrailSchema, type Trail } from './types';

const parsed = [...trailsJson, ...routesJson].map((t) => TrailSchema.parse(t));

export function getAllTrails(): Trail[] {
  return parsed;
}

export function getTrailBySlug(slug: string): Trail | undefined {
  return parsed.find((t) => t.slug === slug);
}

export function getTrailsByTag(tag: string): Trail[] {
  return parsed.filter((t) => t.tags.includes(tag));
}

const FEATURED_SLUGS = [
  'alta-via-1-tappa-16-rifugio-frassati-rifugio-bonatti',
  'alta-via-1-tappa-4-rifugio-barma-niel',
  'alta-via-1-tappa-10-rifugio-barmasse-rifugio-cuney',
  'alta-via-2-tappa-1-courmayeur-rifugio-elisabetta',
  'tour-rifugio-bonatti',
  'lago-djouan-cogne',
] as const;

export function getFeaturedTrails(limit = 6): Trail[] {
  const curated = FEATURED_SLUGS.map((slug) => getTrailBySlug(slug)).filter(
    (t): t is Trail => Boolean(t)
  );
  if (curated.length >= limit) return curated.slice(0, limit);
  const slugSet = new Set<string>(FEATURED_SLUGS);
  const extras = parsed.filter((t) => !slugSet.has(t.slug));
  return [...curated, ...extras].slice(0, limit);
}

export function getTotalTrailKm(): number {
  return Math.round(parsed.reduce((sum, t) => sum + t.distance_km, 0));
}

export function getTotalAlteViaStages(): number {
  return countTrailsByTag('alta-via-1') + countTrailsByTag('alta-via-2');
}

export function getTrailsByDifficulty(difficulty: Trail['difficulty']): Trail[] {
  return parsed.filter((t) => t.difficulty === difficulty);
}

function stageNumber(slug: string, prefix: string): number {
  const re = new RegExp(`${prefix}-tappa-(\\d+)`);
  const m = slug.match(re);
  return m ? parseInt(m[1], 10) : 999;
}

function getAdjacentByTag(slug: string, tag: string, prefix: string) {
  const stages = parsed
    .filter((t) => t.tags.includes(tag))
    .sort((a, b) => stageNumber(a.slug, prefix) - stageNumber(b.slug, prefix));
  const idx = stages.findIndex((t) => t.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? stages[idx - 1] : null,
    next: idx < stages.length - 1 ? stages[idx + 1] : null,
  };
}

export function getAdjacentAV1Stages(slug: string): { prev: Trail | null; next: Trail | null } {
  return getAdjacentByTag(slug, 'alta-via-1', 'alta-via-1');
}

export function getAdjacentAV2Stages(slug: string): { prev: Trail | null; next: Trail | null } {
  return getAdjacentByTag(slug, 'alta-via-2', 'alta-via-2');
}

/** Prev/next within a tour tag (e.g. tour-mont-blanc). */
export function getAdjacentTourStages(
  slug: string,
  tourTag: string,
): { prev: Trail | null; next: Trail | null } {
  const prefix = tourTag.replace(/^tour-/, 'tour-');
  return getAdjacentByTag(slug, tourTag, prefix);
}

export function countTrailsByTag(tag: string): number {
  return parsed.filter((t) => t.tags.includes(tag)).length;
}

function valleyBase(valley: string): string {
  return valley.split(' — ')[0].trim();
}

function valleysRelated(a: string, b: string): boolean {
  if (a === b) return true;
  return valleyBase(a) === valleyBase(b);
}

function countSharedTags(a: string[], b: string[]): number {
  const setB = new Set(b);
  return a.filter((tag) => setB.has(tag)).length;
}

/** Sentieri della stessa valle o con tag in comune, escluso il corrente e slug opzionali. */
export function getRelatedTrails(
  trail: Trail,
  limit = 4,
  excludeSlugs: string[] = [],
): Trail[] {
  const exclude = new Set<string>([trail.slug, ...excludeSlugs.filter(Boolean)]);

  return getAllTrails()
    .filter((t) => !exclude.has(t.slug))
    .map((candidate) => {
      const sameValley = valleysRelated(trail.valley, candidate.valley);
      const tagsInCommon = countSharedTags(trail.tags, candidate.tags);
      const score = (sameValley ? 100 : 0) + tagsInCommon * 15;
      return { candidate, score, tagsInCommon };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.tagsInCommon !== a.tagsInCommon) return b.tagsInCommon - a.tagsInCommon;
      return a.candidate.name_it.localeCompare(b.candidate.name_it, 'it');
    })
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
