import trailsJson from '@/data/trails.json';
import { TrailSchema, type Trail } from './types';

const parsed = trailsJson.map((t) => TrailSchema.parse(t));

export function getAllTrails(): Trail[] {
  return parsed;
}

export function getTrailBySlug(slug: string): Trail | undefined {
  return parsed.find((t) => t.slug === slug);
}

export function getTrailsByTag(tag: string): Trail[] {
  return parsed.filter((t) => t.tags.includes(tag));
}

export function getFeaturedTrails(limit = 6): Trail[] {
  // Logic: pick a mix of difficulties + valleys
  return parsed.slice(0, limit);
}

export function getTrailsByDifficulty(difficulty: Trail['difficulty']): Trail[] {
  return parsed.filter((t) => t.difficulty === difficulty);
}

function av1StageNumber(slug: string): number {
  const m = slug.match(/alta-via-1-tappa-(\d+)/);
  return m ? parseInt(m[1], 10) : 999;
}

export function getAdjacentAV1Stages(slug: string): { prev: Trail | null; next: Trail | null } {
  const av1 = parsed
    .filter((t) => t.tags.includes('alta-via-1'))
    .sort((a, b) => av1StageNumber(a.slug) - av1StageNumber(b.slug));
  const idx = av1.findIndex((t) => t.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? av1[idx - 1] : null,
    next: idx < av1.length - 1 ? av1[idx + 1] : null,
  };
}
