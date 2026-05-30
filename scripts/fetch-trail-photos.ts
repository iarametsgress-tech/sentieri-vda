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

const USER_AGENT = 'SentieriVda/1.0 (https://sentieri-vda.vercel.app; editorial trail guide)';
const RADIUS_M = 2000;
const SLEEP_MS = 350;

const VALLEY_FALLBACK: Record<string, { local: string; credit: string; source: string }> = {
  "Valle d'Ayas": {
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

async function geosearchFiles(lat: number, lng: number): Promise<any[]> {
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&generator=geosearch` +
    `&ggscoord=${lat}|${lng}&ggsradius=${RADIUS_M}&ggslimit=20&ggsnamespace=6` +
    `&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) return [];
  const data = (await res.json()) as any;
  const pages = data.query?.pages ?? {};
  return Object.values(pages);
}

function selectBestTrailImage(hits: any[], name: string) {
  const nameLower = name.toLowerCase();
  
  const scores = hits.map(hit => {
    let score = 50; 
    const title = (hit.title || '').toLowerCase();
    const meta = hit.imageinfo?.[0]?.extmetadata || {};
    const description = (meta.ImageDescription?.value || '').toLowerCase();
    const license = meta.LicenseShortName?.value || '';
    const artist = (meta.Artist?.value || '').toLowerCase();
    
    if (title.includes(nameLower)) score += 50;
    if (description.includes(nameLower)) score += 30;
    
    // Filter out NASA, Earth, STS (generic satellite views)
    if (title.includes('sts') || title.includes('view of earth') || artist.includes('nasa')) {
      score = -1;
    }
    
    // Avoid non-image or PDF
    if (!/cc|public domain|pd|ogl/i.test(license)) score = -1;
    if (hit.title.toLowerCase().endsWith('.pdf')) score = -1;

    return { hit, score };
  });

  const best = scores.filter(s => s.score > 0).sort((a, b) => b.score - a.score)[0];
  return best?.hit ?? null;
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

    const hits = await geosearchFiles(mid.lat, mid.lng);
    const best = selectBestTrailImage(hits, sk.name_it);

    if (best) {
      geolocated++;
      const info = best.imageinfo[0];
      const meta = info.extmetadata;
      const artist = meta?.Artist?.value?.replace(/<[^>]+>/g, '') ?? 'Wikimedia Commons';
      const license = meta?.LicenseShortName?.value ?? 'CC';
      const page = info.descriptionurl;

      if (dryRun) {
        console.log(`[geo] ${sk.slug}: ${best.title} (${artist})`);
        continue;
      }

      const dest = path.resolve(`public/trails/${sk.slug}.jpg`);
      await downloadImage(info.url, dest);
      sk.image = `/trails/${sk.slug}.jpg`;
      sk.hero_image = sk.image;
      sk.image_credit = `${artist} (${license})`;
      sk.image_source = page;
      console.log(`✓ ${sk.slug}: ${artist} (${license})`);
      continue;
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
