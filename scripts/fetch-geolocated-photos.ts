/**
 * Scarica foto geolocalizzate e attribuite da Wikimedia Commons per gli scheletri SCT.
 *
 * Uso:
 *   npm run fetch:geolocated-photos -- --limit=20
 *   npm run fetch:geolocated-photos -- --slug=07-s67
 *   npm run fetch:geolocated-photos -- --limit=20 --dry-run
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { buildFeatureIndex, flattenLineCoords, loadSctRaw } from './lib/sct-utils';

const USER_AGENT = 'SentieriVda/2.0 (https://sentieri-vda.vercel.app; geolocated CC photo importer)';
const PLACEHOLDER = '/trails/_placeholder.svg';
const RADII_M = [1000, 2000, 3000];
const DEFAULT_SLEEP_MS = 650;
const MIN_WIDTH = 1200;
const REJECTED_SOURCES = new Set([
  'https://commons.wikimedia.org/wiki/File:Mont_Glacier_visto_dal_Bec_Raty_orientale.jpg',
]);

type Skeleton = {
  slug: string;
  sct_code: string;
  name_it: string;
  valley?: string;
  tags?: string[];
  image?: string;
  hero_image?: string;
  image_credit?: string;
  image_source?: string;
  enriched?: boolean;
  gpx_path?: string | null;
  description_it?: string;
};

type CommonsPage = {
  title?: string;
  imageinfo?: Array<{
    url?: string;
    thumburl?: string;
    descriptionurl?: string;
    width?: number;
    height?: number;
    mime?: string;
    extmetadata?: Record<string, { value?: string }>;
  }>;
};

type Candidate = {
  title: string;
  imageUrl: string;
  source: string;
  artist: string;
  license: string;
  width: number;
  height: number;
  radius: number;
  score: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function parseNumberArg(name: string, fallback: number): number {
  const raw = process.argv.find((arg) => arg.startsWith(`--${name}=`))?.split('=')[1];
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function cleanHtml(value?: string): string {
  return (value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function isFreeLicense(license: string): boolean {
  return /^(CC0|CC BY(?:-SA)?(?:\s|$)|Public domain$|PD(?:\s|$))/i.test(license.trim());
}

function looksLikePhoto(title: string, metadata: Record<string, { value?: string }>): boolean {
  const haystack = [
    title,
    metadata.ImageDescription?.value,
    metadata.ObjectName?.value,
    metadata.Categories?.value,
  ]
    .map(cleanHtml)
    .join(' ')
    .toLowerCase();
  return !/(map|mappa|carte|diagram|schema|coat of arms|stemma|blason|logo|flag|bandiera|locator|route map|topographic|cartograph|view of earth|earth science|satellite|nasa|iss\d|recycling|waste|rifiut)/i.test(
    haystack,
  );
}

function verifiedGeoPhoto(skeleton: Skeleton): boolean {
  return (
    skeleton.image?.startsWith('/trails/geo/') === true &&
    skeleton.hero_image?.startsWith('/trails/geo/') === true &&
    Boolean(skeleton.image_credit && skeleton.image_source)
  );
}

function priority(skeleton: Skeleton): number {
  const text = [skeleton.name_it, skeleton.valley, ...(skeleton.tags ?? [])].join(' ').toLowerCase();
  let score = 0;
  if (/(monte bianco|mont blanc|valdigne|courmayeur|val ferret|val veny)/.test(text)) score += 100;
  if (/(cervino|matterhorn|valtournenche|cervinia)/.test(text)) score += 90;
  if (/(gran paradiso|cogne|valsavarenche|rh[eê]mes)/.test(text)) score += 80;
  if (/(monte rosa|ayas|gressoney|lys)/.test(text)) score += 70;
  if (/(lago|lake|lac|laghi)/.test(text)) score += 30;
  return score;
}

function distanceMeters(a: [number, number, number?], b: [number, number, number?]): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const lat1 = radians(a[1]);
  const lat2 = radians(b[1]);
  const dLat = lat2 - lat1;
  const dLng = radians(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function midpoint(coords: [number, number, number?][]): { lat: number; lng: number } | null {
  if (coords.length === 0) return null;
  if (coords.length === 1) return { lng: coords[0][0], lat: coords[0][1] };
  const lengths = coords.slice(1).map((coord, index) => distanceMeters(coords[index], coord));
  const half = lengths.reduce((sum, length) => sum + length, 0) / 2;
  let traversed = 0;
  for (let index = 0; index < lengths.length; index++) {
    const segment = lengths[index];
    if (traversed + segment >= half) {
      const ratio = segment ? (half - traversed) / segment : 0;
      return {
        lng: coords[index][0] + (coords[index + 1][0] - coords[index][0]) * ratio,
        lat: coords[index][1] + (coords[index + 1][1] - coords[index][1]) * ratio,
      };
    }
    traversed += segment;
  }
  const last = coords.at(-1)!;
  return { lng: last[0], lat: last[1] };
}

async function geosearch(lat: number, lng: number, radius: number): Promise<CommonsPage[]> {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'geosearch',
    ggscoord: `${lat}|${lng}`,
    ggsradius: String(radius),
    ggslimit: '50',
    ggsnamespace: '6',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '1600',
    format: 'json',
    origin: '*',
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!response.ok) throw new Error(`Wikimedia API HTTP ${response.status}`);
  const data = (await response.json()) as { query?: { pages?: Record<string, CommonsPage> } };
  return Object.values(data.query?.pages ?? {});
}

function candidateFromPage(page: CommonsPage, radius: number, usedSources: Set<string>): Candidate | null {
  const info = page.imageinfo?.[0];
  const metadata = info?.extmetadata ?? {};
  const artist = cleanHtml(metadata.Artist?.value);
  const license = cleanHtml(metadata.LicenseShortName?.value);
  const source = info?.descriptionurl ?? '';
  const title = page.title ?? '';
  const width = info?.width ?? 0;
  const height = info?.height ?? 0;
  if (!info?.url || !source || !artist || !license) return null;
  if (REJECTED_SOURCES.has(source)) return null;
  if (!isFreeLicense(license) || width < MIN_WIDTH || height <= 0) return null;
  if (!looksLikePhoto(title, metadata) || info.mime === 'application/pdf') return null;
  const landscape = width >= height;
  const ratio = width / height;
  const score =
    (landscape ? 60 : 0) +
    (ratio >= 1.3 && ratio <= 2.2 ? 25 : 0) +
    Math.min(width / 200, 20) -
    radius / 1000 -
    (usedSources.has(source) ? 100 : 0);
  return { title, imageUrl: info.thumburl ?? info.url, source, artist, license, width, height, radius, score };
}

async function findBestPhoto(lat: number, lng: number, usedSources: Set<string>, sleepMs: number) {
  const candidates: Candidate[] = [];
  for (const radius of RADII_M) {
    await sleep(sleepMs);
    const pages = await geosearch(lat, lng, radius);
    for (const page of pages) {
      const candidate = candidateFromPage(page, radius, usedSources);
      if (candidate) candidates.push(candidate);
    }
    if (candidates.some((candidate) => candidate.score > 0)) break;
  }
  return candidates.filter((candidate) => candidate.score > 0).sort((a, b) => b.score - a.score)[0] ?? null;
}

function resetToPlaceholder(skeleton: Skeleton) {
  skeleton.image = PLACEHOLDER;
  skeleton.hero_image = PLACEHOLDER;
  delete skeleton.image_credit;
  delete skeleton.image_source;
  skeleton.enriched = false;
}

async function saveWebp(candidate: Candidate, slug: string) {
  const response = await fetch(candidate.imageUrl, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`download HTTP ${response.status}`);
  const input = Buffer.from(await response.arrayBuffer());
  const output = path.resolve(`public/trails/geo/${slug}.webp`);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(output);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const force = process.argv.includes('--force');
  const slugArg = process.argv.find((arg) => arg.startsWith('--slug='))?.split('=')[1];
  const limit = slugArg ? 1 : parseNumberArg('limit', 20);
  const sleepMs = parseNumberArg('sleep-ms', DEFAULT_SLEEP_MS);
  const skeletonPath = path.resolve('src/data/trails-skeleton.json');
  const skeletons = JSON.parse(await fs.readFile(skeletonPath, 'utf8')) as Skeleton[];
  const featureIndex = buildFeatureIndex(loadSctRaw());
  const usedSources = new Set(skeletons.filter(verifiedGeoPhoto).map((skeleton) => skeleton.image_source!));
  const queue = skeletons
    .filter((skeleton) => (slugArg ? skeleton.slug === slugArg : force || !verifiedGeoPhoto(skeleton)))
    .sort((a, b) => priority(b) - priority(a) || a.slug.localeCompare(b.slug))
    .slice(0, limit);
  const report: Array<{ slug: string; result: string; detail?: string }> = [];

  for (const skeleton of queue) {
    const feature = featureIndex.get(skeleton.sct_code) ?? featureIndex.get(skeleton.slug);
    const mid = midpoint(flattenLineCoords(feature?.geometry?.coordinates));
    if (!mid) {
      if (!dryRun) resetToPlaceholder(skeleton);
      report.push({ slug: skeleton.slug, result: 'no-geometry' });
      continue;
    }
    const candidate = await findBestPhoto(mid.lat, mid.lng, usedSources, sleepMs);
    if (!candidate) {
      if (!dryRun) resetToPlaceholder(skeleton);
      report.push({ slug: skeleton.slug, result: 'no-match' });
      continue;
    }
    report.push({
      slug: skeleton.slug,
      result: dryRun ? 'match' : 'saved',
      detail: `${candidate.title} | ${candidate.artist} | ${candidate.license} | ${candidate.radius}m`,
    });
    usedSources.add(candidate.source);
    if (dryRun) continue;
    await saveWebp(candidate, skeleton.slug);
    skeleton.image = `/trails/geo/${skeleton.slug}.webp`;
    skeleton.hero_image = skeleton.image;
    skeleton.image_credit = `${candidate.artist} — Wikimedia Commons (${candidate.license})`;
    skeleton.image_source = candidate.source;
    skeleton.enriched = Boolean(skeleton.gpx_path && skeleton.valley && skeleton.description_it);
  }

  if (!dryRun) await fs.writeFile(skeletonPath, `${JSON.stringify(skeletons, null, 2)}\n`);
  console.table(report);
  console.log(`Processati: ${report.length}`);
  console.log(`Foto accettate: ${report.filter((item) => /^(match|saved)$/.test(item.result)).length}`);
  console.log(`Senza foto valida: ${report.filter((item) => !/^(match|saved)$/.test(item.result)).length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
