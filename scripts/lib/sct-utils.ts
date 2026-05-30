import fs from 'node:fs';
import path from 'node:path';

export type SctProps = {
  CodSen?: string;
  sen_codice?: string;
  sen_nome_s?: string;
  sen_locali?: string;
  sen_loca_1?: string;
  sen_cod_co?: string;
  sen_cod__1?: string;
  sen_quota_?: number | string | null;
  sen_quota1?: number | string | null;
  sen_totale?: number | string | null;
  sen_diffic?: string;
  shape_Leng?: number | string | null;
  sen_tota_1?: number | string | null;
  sen_period?: string;
  nuovo_segn?: number | string | null;
};

export type GeoJsonFeature = {
  type: 'Feature';
  geometry?: { type: string; coordinates: unknown };
  properties?: SctProps;
};

export type GeoJsonCollection = {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
};

export function slugifySctCode(code: string): string {
  return code
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function sctCodeFromSlug(slug: string): string {
  const m = slug.match(/^(\d+)-s(\d+)$/i);
  if (m) return `${m[1]}_S${m[2]}`;
  return slug.toUpperCase().replace(/-/g, '_');
}

export function loadSctRaw(): GeoJsonCollection {
  const geoPath = path.resolve('src/data/sct-raw.geojson');
  const raw = fs.readFileSync(geoPath, 'utf8');
  return JSON.parse(raw) as GeoJsonCollection;
}

export function buildFeatureIndex(geo: GeoJsonCollection): Map<string, GeoJsonFeature> {
  const map = new Map<string, GeoJsonFeature>();
  for (const feature of geo.features ?? []) {
    const props = feature.properties ?? {};
    const code = String(props.sen_codice ?? props.CodSen ?? '').trim();
    if (!code) continue;
    map.set(code, feature);
    map.set(slugifySctCode(code), feature);
  }
  return map;
}

export function flattenLineCoords(coords: unknown): [number, number, number?][] {
  if (!Array.isArray(coords) || coords.length === 0) return [];
  if (typeof coords[0] === 'number') {
    const [lng, lat, ele] = coords as number[];
    return [[lng, lat, ele]];
  }
  return (coords as unknown[]).flatMap(flattenLineCoords);
}

export function interpolateElevation(
  index: number,
  total: number,
  startEle: number | null,
  endEle: number | null
): number | undefined {
  if (startEle === null || endEle === null || total < 2) return undefined;
  const t = index / (total - 1);
  return Math.round(startEle + (endEle - startEle) * t);
}

export function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/** "Giugno-ottobre" → { months, seasons } */
export function parseSenPeriod(period: string | undefined | null): {
  best_months: number[];
  season: ('spring' | 'summer' | 'autumn' | 'winter')[];
} {
  if (!period?.trim()) {
    return { best_months: [6, 7, 8, 9], season: ['summer'] };
  }

  const monthMap: Record<string, number> = {
    gennaio: 1,
    febbraio: 2,
    marzo: 3,
    aprile: 4,
    maggio: 5,
    giugno: 6,
    luglio: 7,
    agosto: 8,
    settembre: 9,
    ottobre: 10,
    novembre: 11,
    dicembre: 12,
  };

  const parts = period.toLowerCase().split('-').map((p) => p.trim());
  const months: number[] = [];
  for (const part of parts) {
    const m = monthMap[part];
    if (m) months.push(m);
  }

  if (months.length === 2) {
    const [a, b] = months;
    const range: number[] = [];
    if (a <= b) {
      for (let i = a; i <= b; i++) range.push(i);
    } else {
      for (let i = a; i <= 12; i++) range.push(i);
      for (let i = 1; i <= b; i++) range.push(i);
    }
    return { best_months: range, season: monthsToSeasons(range) };
  }

  if (months.length === 1) {
    return { best_months: months, season: monthsToSeasons(months) };
  }

  return { best_months: [6, 7, 8, 9], season: ['summer'] };
}

function monthsToSeasons(months: number[]): ('spring' | 'summer' | 'autumn' | 'winter')[] {
  const seasons = new Set<'spring' | 'summer' | 'autumn' | 'winter'>();
  for (const m of months) {
    if (m >= 3 && m <= 5) seasons.add('spring');
    if (m >= 6 && m <= 8) seasons.add('summer');
    if (m >= 9 && m <= 11) seasons.add('autumn');
    if (m === 12 || m <= 2) seasons.add('winter');
  }
  return seasons.size ? [...seasons] : ['summer'];
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
