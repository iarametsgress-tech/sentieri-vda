/**
 * Genera schede-scheletro Trail da sct-raw.geojson per sentieri non presenti in trails.json.
 *
 * Uso:
 *   npm run generate:skeletons          # anteprima 3 record
 *   npm run generate:skeletons -- --write # scrive src/data/trails-skeleton.json
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import {
  DifficultySchema,
  TrailSkeletonSchema,
  type Difficulty,
  type TrailSkeleton,
} from '../src/lib/types';
import trailsJson from '../src/data/trails.json';

const SCT_SOURCE = {
  name: 'Catasto Sentieri Regione Autonoma VdA',
  url: 'https://catastosentieri.regione.vda.it/',
  license: 'Open data — DGR 899/2014',
} as const;

type GeoJsonFeature = {
  type: 'Feature';
  id?: string;
  geometry?: {
    type: string;
    coordinates: unknown;
  };
  properties?: Record<string, unknown>;
};

type GeoJsonCollection = {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
};

type SctProps = {
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
  pubblicato?: number | string | null;
};

function slugifyCode(code: string): string {
  return code
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function parseDifficulty(raw: unknown): Difficulty | null {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim().toUpperCase();
  if (!s) return null;
  const parsed = DifficultySchema.safeParse(s);
  return parsed.success ? parsed.data : null;
}

function lineEndpoints(
  geometry: GeoJsonFeature['geometry']
): { start: [number, number, number?]; end: [number, number, number?] } | null {
  if (!geometry) return null;

  const flatten = (coords: unknown): [number, number, number?][] => {
    if (!Array.isArray(coords) || coords.length === 0) return [];
    if (typeof coords[0] === 'number') {
      const [lng, lat, ele] = coords as number[];
      return [[lng, lat, ele]];
    }
    return (coords as unknown[]).flatMap(flatten);
  };

  const points = flatten(geometry.coordinates);
  if (points.length < 2) return null;
  return { start: points[0], end: points[points.length - 1] };
}

function inVdaBounds(lat: number, lng: number): boolean {
  return lat >= 45 && lat <= 46 && lng >= 6.5 && lng <= 8;
}

function uniqueMunicipalityCodes(props: SctProps): string[] {
  const codes = [props.sen_cod_co, props.sen_cod__1]
    .map((c) => (c ? String(c).trim() : ''))
    .filter(Boolean);
  return [...new Set(codes)];
}

function buildSkeleton(feature: GeoJsonFeature): TrailSkeleton | null {
  const props = (feature.properties ?? {}) as SctProps;
  const code = String(props.sen_codice ?? props.CodSen ?? '').trim();
  const name = String(props.sen_nome_s ?? '').trim();
  if (!code || !name) return null;

  const endpoints = lineEndpoints(feature.geometry);
  if (!endpoints) return null;

  const [startLng, startLat, startEleGeom] = endpoints.start;
  const [endLng, endLat, endEleGeom] = endpoints.end;
  if (!inVdaBounds(startLat, startLng) || !inVdaBounds(endLat, endLng)) return null;

  const startQuota = asNumber(props.sen_quota_);
  const endQuota = asNumber(props.sen_quota1);
  const senTotale = asNumber(props.sen_totale);

  const shapeLen = asNumber(props.shape_Leng);
  const senTota1 = asNumber(props.sen_tota_1);
  const lengthM = shapeLen ?? senTota1;
  const distanceKm = lengthM !== null && lengthM > 0 ? lengthM / 1000 : null;

  let elevationGain: number | null = null;
  let elevationLoss: number | null = null;
  if (senTotale !== null && senTotale >= 0) {
    if (startQuota !== null && endQuota !== null) {
      if (endQuota >= startQuota) {
        elevationGain = senTotale;
        elevationLoss = 0;
      } else {
        elevationGain = 0;
        elevationLoss = senTotale;
      }
    } else {
      elevationGain = senTotale;
    }
  } else if (startQuota !== null && endQuota !== null) {
    elevationGain = Math.max(0, endQuota - startQuota);
    elevationLoss = Math.max(0, startQuota - endQuota);
  }

  const startEle = startQuota ?? (startEleGeom !== undefined ? asNumber(startEleGeom) : null);
  const endEle = endQuota ?? (endEleGeom !== undefined ? asNumber(endEleGeom) : null);

  const slug = slugifyCode(code);
  const today = new Date().toISOString().slice(0, 10);

  const skeleton: TrailSkeleton = {
    slug,
    sct_code: code,
    name_it: name,
    name_en: '',
    name_fr: '',
    name_de: '',
    shortDescription_it: '',
    shortDescription_en: '',
    shortDescription_fr: '',
    shortDescription_de: '',
    description_it: '',
    description_en: '',
    description_fr: '',
    description_de: '',

    distance_km: distanceKm,
    elevation_gain_m: elevationGain,
    elevation_loss_m: elevationLoss,
    duration_hours: null,
    difficulty: parseDifficulty(props.sen_diffic),
    season: [],

    start:
      startEle !== null
        ? {
            name: String(props.sen_locali ?? '').trim(),
            coords: { lat: startLat, lng: startLng },
            elevation_m: startEle,
          }
        : null,
    end:
      endEle !== null
        ? {
            name: String(props.sen_loca_1 ?? '').trim(),
            coords: { lat: endLat, lng: endLng },
            elevation_m: endEle,
          }
        : null,

    valley: '',
    municipalities: uniqueMunicipalityCodes(props),

    hero_image: '',
    image: '',
    gallery: [],
    refuges: [],
    flora: [],
    fauna: [],
    tags: [],

    source: SCT_SOURCE,
    updated_at: today,

    mobile_coverage: null,
    best_months: null,
    fitness_level: null,
  };

  return TrailSkeletonSchema.parse(skeleton);
}

function collectExistingKeys(): { slugs: Set<string>; codes: Set<string> } {
  const slugs = new Set<string>();
  const codes = new Set<string>();

  for (const trail of trailsJson as Array<{ slug?: string; sct_code?: string }>) {
    if (trail.slug) slugs.add(trail.slug);
    if (trail.sct_code) codes.add(trail.sct_code);
  }

  return { slugs, codes };
}

async function main() {
  const write = process.argv.includes('--write');
  const previewArg = process.argv.find((a) => a.startsWith('--preview='));
  const previewCount = previewArg ? Number(previewArg.split('=')[1]) : 3;

  const geoPath = path.resolve('src/data/sct-raw.geojson');
  const outPath = path.resolve('src/data/trails-skeleton.json');

  let raw: string;
  try {
    raw = await fs.readFile(geoPath, 'utf8');
  } catch {
    console.error(`✗ File non trovato: ${geoPath}`);
    console.error('  Esegui prima: npm run import:sct');
    process.exit(1);
  }

  const geo = JSON.parse(raw) as GeoJsonCollection;
  const features = geo.features ?? [];
  console.log(`→ Lette ${features.length} feature da sct-raw.geojson`);

  const { slugs, codes } = collectExistingKeys();
  console.log(`  trails.json: ${slugs.size} slug, ${codes.size} codici SCT`);

  const skeletons: TrailSkeleton[] = [];
  let skippedExisting = 0;
  let skippedInvalid = 0;

  for (const feature of features) {
    const props = (feature.properties ?? {}) as SctProps;
    const code = String(props.sen_codice ?? props.CodSen ?? '').trim();
    const slug = code ? slugifyCode(code) : '';

    if ((code && codes.has(code)) || (slug && slugs.has(slug))) {
      skippedExisting++;
      continue;
    }

    const skeleton = buildSkeleton(feature);
    if (!skeleton) {
      skippedInvalid++;
      continue;
    }

    skeletons.push(skeleton);
  }

  console.log(`  Nuovi scheletri: ${skeletons.length}`);
  console.log(`  Saltati (già in trails.json): ${skippedExisting}`);
  console.log(`  Saltati (dati insufficienti): ${skippedInvalid}`);

  const preview = skeletons.slice(0, previewCount);
  console.log(`\nAnteprima (${preview.length} record):`);
  console.log(JSON.stringify(preview, null, 2));

  if (!write) {
    console.log('\nPer scrivere il file completo: npm run generate:skeletons -- --write');
    return;
  }

  await fs.writeFile(outPath, JSON.stringify(skeletons, null, 2) + '\n');
  console.log(`\n✓ Scritto ${outPath} (${skeletons.length} record)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
