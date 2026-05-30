/**
 * Cerca foto CC su Wikimedia Commons attorno al punto medio del tracciato.
 *
 * Uso:
 *   npm run fetch:trail-photos -- --dry-run          # conta match geolocalizzati
 *   npm run fetch:trail-photos -- --slug=01-s1       # scarica una foto
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { buildFeatureIndex, flattenLineCoords, loadSctRaw, slugifySctCode } from './lib/sct-utils';

const USER_AGENT = 'SentieriVdA/1.0 (https://sentieri-vda.vercel.app; editorial trail guide)';
const RADIUS_M = 2000;
const SLEEP_MS = 350;

const VALLEY_FALLBACK: Record<string, { local: string; credit: string; source: string }> = {
  "Valle d'Ayas": {
    // Champoluc è in Val d'Ayas (non Gressoney/Lys)
    local: 'public/trails/tour-monte-rosa-tappa-3-valtournenche-champoluc.webp',
    credit: 'Wikimedia Commons — Champoluc, Val d\'Ayas',
    source: 'https://commons.wikimedia.org/wiki/Category:Champoluc',
  },
  'Val Ferret': {
    local: 'public/trails/monte-bianco.webp',
    credit: 'Wikimedia Commons — Val Ferret / Monte Bianco',
    source: 'https://commons.wikimedia.org/wiki/Category:Val_Ferret,_Aosta_Valley',
  },
  'Valle del Lys': {
    local: 'public/trails/gressoney.webp',
    credit: 'Wikimedia Commons — Gressoney, Valle del Lys',
    source: 'https://commons.wikimedia.org/wiki/Category:Gressoney',
  },
  Valtournenche: {
    local: 'public/trails/cervino.webp',
    credit: 'Wikimedia Commons — Cervino, Valtournenche',
    source: 'https://commons.wikimedia.org/wiki/Category:Matterhorn',
  },
  'Val di Cogne': {
    local: 'public/trails/gran-paradiso.webp',
    credit: 'Wikimedia Commons — Gran Paradiso, Val di Cogne',
    source: 'https://commons.wikimedia.org/wiki/Category:Gran_Paradiso_National_Park',
  },
  'Bassa Valle': {
    local: 'public/trails/donnas.webp',
    credit: 'Wikimedia Commons — Donnas, Bassa Valle',
    source: 'https://commons.wikimedia.org/wiki/Category:Donnas',
  },
  Valpelline: {
    local: 'public/trails/valpelline.webp',
    credit: 'Wikimedia Commons — Valpelline',
    source: 'https://commons.wikimedia.org/wiki/Category:Valpelline',
  },
  'Valle del Gran San Bernardo': {
    local: 'public/trails/grand-saint-bernard.webp',
    credit: 'Wikimedia Commons — Gran San Bernardo',
    source: 'https://commons.wikimedia.org/wiki/Category:Great_St_Bernard_Pass',
  },
  Valsavarenche: {
    local: 'public/trails/alta-via-2-tappa-8-eaux-rousses-rifugio-vittorio-sella.webp',
    credit: 'Wikimedia Commons — Valsavarenche',
    source: 'https://commons.wikimedia.org/wiki/Category:Valsavarenche',
  },
  Valgrisenche: {
    local: 'public/trails/alta-via-2-tappa-4-promoud-planaval.webp',
    credit: 'Wikimedia Commons — Valgrisenche / Planaval',
    source: 'https://commons.wikimedia.org/wiki/Category:Valgrisenche',
  },
  'La Thuile': {
    local: 'public/trails/alta-via-2-tappa-3-la-thuile-promoud.webp',
    credit: 'Wikimedia Commons — La Thuile',
    source: 'https://commons.wikimedia.org/wiki/Category:La_Thuile',
  },
  'Val di Rhêmes': {
    local: 'public/trails/alta-via-2-tappa-7-rhemes-notre-dame-eaux-rousses.webp',
    credit: 'Wikimedia Commons — Val di Rhêmes',
    source: 'https://commons.wikimedia.org/wiki/Category:Rh%C3%AAmes_Valley',
  },
  'Valle di Champorcher': {
    local: 'public/trails/alta-via-2-tappa-12-rifugio-dondena-champorcher.webp',
    credit: 'Wikimedia Commons — Champorcher',
    source: 'https://commons.wikimedia.org/wiki/Category:Champorcher',
  },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function midpoint(coords: [number, number, number?][]): { lat: number; lng: number } | null {
  if (!coords.length) return null;
  const mid = coords[Math.floor(coords.length / 2)];
  return { lat: mid[1], lng: mid[0] };
}

async function geosearch(lat: number, lng: number): Promise<{ title: string; dist: number } | null> {
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&list=geosearch` +
    `&gscoord=${lat}|${lng}&gsradius=${RADIUS_M}&gslimit=5&format=json&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    query?: { geosearch?: Array<{ title: string; dist: number }> };
  };
  const hits = data.query?.geosearch ?? [];
  return hits[0] ?? null;
}

async function imageMeta(title: string): Promise<{
  url: string;
  credit: string;
  license: string;
  page: string;
} | null> {
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}` +
    `&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) return null;
  const data = (await res.json()) as any;
  const pages = data.query?.pages ?? {};
  const page = Object.values(pages)[0] as any;
  const info = page?.imageinfo?.[0];
  if (!info?.url) return null;
  const license = info.extmetadata?.LicenseShortName?.value ?? '';
  const allowed = /cc|public domain|pd/i.test(license);
  if (!allowed) return null;
  const artist = info.extmetadata?.Artist?.value?.replace(/<[^>]+>/g, '') ?? 'Wikimedia Commons';
  return {
    url: info.url as string,
    credit: artist,
    license,
    page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
  };
}

async function downloadImage(url: string, dest: string) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1];
  const limitArg = process.argv.find((a) => a.startsWith('--limit='))?.split('=')[1];
  const limit = limitArg ? Number(limitArg) : slugArg ? 1 : dryRun ? 50 : Infinity;

  const skeletonPath = path.resolve('src/data/trails-skeleton.json');
  const skeletons = JSON.parse(await fs.readFile(skeletonPath, 'utf8')) as any[];
  const geo = loadSctRaw();
  const index = buildFeatureIndex(geo);

  let geolocated = 0;
  let valleyFallback = 0;
  let none = 0;
  let processed = 0;

  for (const sk of skeletons) {
    if (slugArg && sk.slug !== slugArg) continue;
    if (processed >= limit) break;

    const force = process.argv.includes('--force');
    const alreadyHas =
      sk.image &&
      sk.image !== '' &&
      !sk.image.endsWith('_placeholder.svg') &&
      !String(sk.image).includes('_placeholder');
    if (alreadyHas && !force && !slugArg) continue;

    const feature = index.get(sk.sct_code) ?? index.get(sk.slug);
    if (!feature) {
      none++;
      continue;
    }
    const coords = flattenLineCoords(feature.geometry?.coordinates);
    const mid = midpoint(coords);
    if (!mid) {
      none++;
      continue;
    }

    processed++;
    await sleep(SLEEP_MS);

    const hit = await geosearch(mid.lat, mid.lng);
    if (hit) {
      geolocated++;
      if (dryRun) {
        console.log(`[geo] ${sk.slug}: ${hit.title} (${Math.round(hit.dist)}m)`);
        continue;
      }
      if (slugArg || !dryRun) {
        const meta = await imageMeta(hit.title);
        if (meta) {
          const dest = path.resolve(`public/trails/${sk.slug}.jpg`);
          await downloadImage(meta.url, dest);
          sk.image = `/trails/${sk.slug}.jpg`;
          sk.hero_image = sk.image;
          sk.image_credit = meta.credit;
          sk.image_source = meta.page;
          console.log(`✓ ${sk.slug}: ${meta.credit} (${meta.license})`);
          continue;
        }
      }
    }

    const fb = VALLEY_FALLBACK[sk.valley as string];
    if (fb && (slugArg || !dryRun)) {
      valleyFallback++;
      const ext = path.extname(fb.local);
      const dest = path.resolve(`public/trails/${sk.slug}${ext}`);
      await fs.copyFile(path.resolve(fb.local), dest);
      sk.image = `/trails/${sk.slug}${ext}`;
      sk.hero_image = sk.image;
      sk.image_credit = fb.credit;
      sk.image_source = fb.source;
      console.log(`~ ${sk.slug}: fallback valle «${sk.valley}»`);
    } else {
      none++;
    }
  }

  console.log('\n--- Riepilogo ---');
  console.log(`Processati: ${processed}`);
  console.log(`Geolocalizzati trovati: ${geolocated}`);
  console.log(`Fallback valle: ${valleyFallback}`);
  console.log(`Nessuna foto: ${none}`);

  if (!dryRun && (slugArg || processed > 0)) {
    await fs.writeFile(skeletonPath, JSON.stringify(skeletons, null, 2) + '\n');
    console.log('✓ trails-skeleton.json aggiornato');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
