import { getSpeciesById } from '@/data/species';
import { getAllTrails } from '@/lib/trails';
import { pickLocalized } from '@/lib/locale-content';
import type { Difficulty, Trail } from '@/lib/types';

/** Alias slug sentiero → id specie canonico (allineato a trail-links) */
const SPECIES_ALIASES: Record<string, string> = {
  genziana: 'gentiana',
  stambeco: 'stambecco',
};

/** Tag di percorso / sistema — esclusi dalle hub tema */
export const EXCLUDED_THEME_TAGS = new Set([
  'alta-via-1',
  'alta-via-2',
  'tour',
  'tour-mont-blanc',
  'tour-monte-rosa',
  'tour-cervino',
  'tour-gran-paradiso',
  'tour-rutor',
  'tour-gran-combin',
  'long-distance',
  'tmb',
  'discesa',
]);

/** Slug URL tema → tag originale in trails.json (se diverso) */
export const THEME_TAG_SLUG_TO_TAG: Record<string, string> = {
  famiglia: 'family-friendly',
  anello: 'loop',
};

/** Tag → slug URL (override SEO-friendly) */
export const THEME_TAG_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(THEME_TAG_SLUG_TO_TAG).map(([slug, tag]) => [tag, slug]),
);

export const DIFFICULTY_HUBS = [
  { slug: 'facili', levels: ['T'] as Difficulty[] },
  { slug: 'escursionistici', levels: ['E'] as Difficulty[] },
  { slug: 'esperti', levels: ['EE', 'EEA'] as Difficulty[] },
  { slug: 'alpinistici', levels: ['A'] as Difficulty[] },
] as const;

export type DifficultyHubSlug = (typeof DIFFICULTY_HUBS)[number]['slug'];

export type HubTrailStats = {
  count: number;
  difficulties: Difficulty[];
  minGain: number;
  maxGain: number;
  minDistance: number;
  maxDistance: number;
};

export type ValleyHub = {
  slug: string;
  label: string;
  count: number;
  trails: Trail[];
};

export type ThemeHub = {
  slug: string;
  tag: string;
  count: number;
  trails: Trail[];
};

export type SpeciesHub = {
  slug: string;
  speciesId: string;
  count: number;
  trails: Trail[];
};

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function resolveTrailSpeciesId(slug: string): string | null {
  const id = SPECIES_ALIASES[slug] ?? slug;
  return getSpeciesById(id) ? id : null;
}

export function computeTrailStats(trails: Trail[]): HubTrailStats {
  if (trails.length === 0) {
    return {
      count: 0,
      difficulties: [],
      minGain: 0,
      maxGain: 0,
      minDistance: 0,
      maxDistance: 0,
    };
  }
  const order: Difficulty[] = ['T', 'E', 'EE', 'EEA', 'A'];
  const difficulties = [...new Set(trails.map((t) => t.difficulty))].sort(
    (a, b) => order.indexOf(a) - order.indexOf(b),
  );
  const gains = trails.map((t) => t.elevation_gain_m);
  const distances = trails.map((t) => t.distance_km);
  return {
    count: trails.length,
    difficulties,
    minGain: Math.min(...gains),
    maxGain: Math.max(...gains),
    minDistance: Math.min(...distances),
    maxDistance: Math.max(...distances),
  };
}

export function getTrailsByValleySlug(slug: string): Trail[] {
  return getAllTrails().filter((t) => slugify(t.valley) === slug);
}

export function getAllValleyHubs(): ValleyHub[] {
  const map = new Map<string, { label: string; trails: Trail[] }>();
  for (const trail of getAllTrails()) {
    const slug = slugify(trail.valley);
    const entry = map.get(slug);
    if (entry) {
      entry.trails.push(trail);
    } else {
      map.set(slug, { label: trail.valley, trails: [trail] });
    }
  }
  return [...map.entries()]
    .map(([slug, { label, trails }]) => ({
      slug,
      label,
      count: trails.length,
      trails: trails.sort((a, b) => a.name_it.localeCompare(b.name_it, 'it')),
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'it'));
}

export function getValleyHubBySlug(slug: string): ValleyHub | undefined {
  const trails = getTrailsByValleySlug(slug);
  if (trails.length === 0) return undefined;
  return {
    slug,
    label: trails[0].valley,
    count: trails.length,
    trails: trails.sort((a, b) => a.name_it.localeCompare(b.name_it, 'it')),
  };
}

export function getDifficultyHubBySlug(slug: string) {
  const hub = DIFFICULTY_HUBS.find((h) => h.slug === slug);
  if (!hub) return undefined;
  const levelSet = new Set(hub.levels);
  const trails = getAllTrails()
    .filter((t) => levelSet.has(t.difficulty))
    .sort((a, b) => a.name_it.localeCompare(b.name_it, 'it'));
  if (trails.length === 0) return undefined;
  return { ...hub, trails, count: trails.length };
}

export function getAllDifficultyHubs() {
  return DIFFICULTY_HUBS.map((hub) => getDifficultyHubBySlug(hub.slug)).filter(
    (h): h is NonNullable<ReturnType<typeof getDifficultyHubBySlug>> => Boolean(h),
  );
}

export function getDifficultyHubSlugForLevel(level: Difficulty): DifficultyHubSlug {
  const hub = DIFFICULTY_HUBS.find((h) => (h.levels as readonly Difficulty[]).includes(level));
  return hub?.slug ?? 'escursionistici';
}

export function getThemeSlugForTag(tag: string): string {
  return THEME_TAG_TO_SLUG[tag] ?? tag;
}

export function getTagForThemeSlug(slug: string): string {
  return THEME_TAG_SLUG_TO_TAG[slug] ?? slug;
}

export function getTrailsByThemeTag(tag: string): Trail[] {
  return getAllTrails()
    .filter((t) => t.tags.includes(tag))
    .sort((a, b) => a.name_it.localeCompare(b.name_it, 'it'));
}

export function getAllThemeHubs(): ThemeHub[] {
  const counts = new Map<string, number>();
  for (const trail of getAllTrails()) {
    for (const tag of trail.tags) {
      if (EXCLUDED_THEME_TAGS.has(tag)) continue;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([tag, count]) => ({
      slug: getThemeSlugForTag(tag),
      tag,
      count,
      trails: getTrailsByThemeTag(tag),
    }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getThemeHubBySlug(slug: string): ThemeHub | undefined {
  const tag = getTagForThemeSlug(slug);
  const trails = getTrailsByThemeTag(tag);
  if (trails.length < 2) return undefined;
  if (EXCLUDED_THEME_TAGS.has(tag)) return undefined;
  return {
    slug: getThemeSlugForTag(tag),
    tag,
    count: trails.length,
    trails,
  };
}

export function trailHasSpecies(trail: Trail, speciesId: string): boolean {
  const slugs = [...trail.flora, ...trail.fauna];
  return slugs.some((s) => resolveTrailSpeciesId(s) === speciesId);
}

export function getTrailsBySpeciesId(speciesId: string): Trail[] {
  if (!getSpeciesById(speciesId)) return [];
  return getAllTrails()
    .filter((t) => trailHasSpecies(t, speciesId))
    .sort((a, b) => a.name_it.localeCompare(b.name_it, 'it'));
}

export function getAllSpeciesHubs(): SpeciesHub[] {
  const counts = new Map<string, number>();
  for (const trail of getAllTrails()) {
    const seen = new Set<string>();
    for (const slug of [...trail.flora, ...trail.fauna]) {
      const id = resolveTrailSpeciesId(slug);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= 1)
    .map(([speciesId, count]) => ({
      slug: speciesId,
      speciesId,
      count,
      trails: getTrailsBySpeciesId(speciesId),
    }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export function getSpeciesHubBySlug(slug: string): SpeciesHub | undefined {
  const trails = getTrailsBySpeciesId(slug);
  if (trails.length === 0) return undefined;
  return { slug, speciesId: slug, count: trails.length, trails };
}

export function getSpeciesLocalizedName(speciesId: string, locale: string): string {
  const species = getSpeciesById(speciesId);
  if (!species) return speciesId.replace(/-/g, ' ');
  return pickLocalized(locale, {
    it: species.name_it,
    en: species.name_en,
  });
}

export function getHubHeroImage(trails: Trail[]): string {
  const trail = trails[0];
  return trail.image || trail.hero_image;
}

export function getThemeTagsForTrail(trail: Trail): string[] {
  return trail.tags.filter((tag) => !EXCLUDED_THEME_TAGS.has(tag));
}

export function getLinkableThemeTagsForTrail(trail: Trail): string[] {
  return getThemeTagsForTrail(trail).filter(
    (tag) => getThemeHubBySlug(getThemeSlugForTag(tag)) !== undefined,
  );
}

export function getValleyHubHref(valleyLabel: string): string {
  return `/sentieri/valle/${slugify(valleyLabel)}`;
}

export function getDifficultyHubHref(level: Difficulty): string {
  return `/sentieri/difficolta/${getDifficultyHubSlugForLevel(level)}`;
}

export function getThemeHubHref(tag: string): string {
  return `/sentieri/tema/${getThemeSlugForTag(tag)}`;
}

export function getSpeciesHubHref(speciesId: string): string {
  return `/sentieri/dove-vedere/${speciesId}`;
}

export function formatDifficultyRange(
  difficulties: Difficulty[],
  locale: string,
  labels: Record<Difficulty, string>,
): string {
  if (difficulties.length === 0) return '';
  if (difficulties.length === 1) return `${difficulties[0]} (${labels[difficulties[0]]})`;
  const first = difficulties[0];
  const last = difficulties[difficulties.length - 1];
  return `${first}–${last}`;
}
