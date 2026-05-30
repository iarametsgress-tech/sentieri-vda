/**
 * Cerca foto CC su Wikimedia Commons attorno alle coordinate dei rifugi.
 *
 * Uso:
 *   npm run fetch:refuge-photos-geo -- --dry-run
 *   npm run fetch:refuge-photos-geo -- --slug=rifugio-crete-seche
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const USER_AGENT = 'SentieriVda/1.0 (https://sentieri-vda.vercel.app; editorial mountain guide)';
const RADIUS_M = 2000;
const SLEEP_MS = 500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchImages(lat: number, lng: number): Promise<any[]> {
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

async function searchImagesByName(name: string): Promise<any[]> {
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(name)}&gsrnamespace=6&gsrlimit=10` +
    `&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*`;

  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) return [];
  const data = (await res.json()) as any;
  const pages = data.query?.pages ?? {};
  return Object.values(pages);
}

function normalize(s: string) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/rifugio/g, '')
    .trim();
}

function selectBestImage(hits: any[], name: string) {
  const nameNorm = normalize(name);
  const keywords = nameNorm.split(' ').filter(k => k.length > 2);

  const scores = hits.map(hit => {
    let score = 0;
    const meta = hit.imageinfo?.[0]?.extmetadata || {};
    const title = normalize(hit.title || '');
    const categories = normalize(meta.Categories?.value || '');
    const description = normalize(meta.ImageDescription?.value || '');
    const objectName = normalize(meta.ObjectName?.value || '');
    
    if (title.includes(nameNorm)) score += 100;
    if (description.includes(nameNorm)) score += 80;
    if (objectName.includes(nameNorm)) score += 80;
    
    for (const kw of keywords) {
      if (title.includes(kw)) score += 20;
      if (description.includes(kw)) score += 15;
      if (categories.includes(kw)) score += 10;
      if (objectName.includes(kw)) score += 15;
    }
    
    // Check for CC license
    const license = meta.LicenseShortName?.value || '';
    const isCC = /cc|public domain|pd|ogl/i.test(license);
    if (!isCC) score = -1;

    // Avoid PDFs or other non-image files if possible
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
  const limit = limitArg ? Number(limitArg) : slugArg ? 1 : 10;

  const dataPath = path.resolve('src/data/refuges.json');
  const refuges = JSON.parse(await fs.readFile(dataPath, 'utf8')) as any[];

  let processed = 0;
  let successCount = 0;

  for (const refuge of refuges) {
    if (slugArg && refuge.slug !== slugArg) continue;
    if (processed >= limit) break;

    const alreadyHas = refuge.images && refuge.images.length > 0;
    if (alreadyHas && !slugArg) continue;

    const { lat, lng } = refuge.coords || {};
    if (!lat || !lng) continue;

    processed++;
    console.log(`Searching for ${refuge.name_it} (${refuge.slug})...`);
    await sleep(SLEEP_MS);

    let hits = await fetchImages(lat, lng);
    let best = selectBestImage(hits, refuge.name_it);

    if (!best) {
      console.log(`  No geolocated match found, trying keyword search...`);
      hits = await searchImagesByName(refuge.name_it);
      best = selectBestImage(hits, refuge.name_it);
    }

    if (best) {
      const info = best.imageinfo[0];
      const meta = info.extmetadata;
      const artist = meta?.Artist?.value?.replace(/<[^>]+>/g, '') ?? 'Wikimedia Commons';
      const license = meta?.LicenseShortName?.value ?? 'CC';
      const page = info.descriptionurl;

      if (dryRun) {
        console.log(`[match] ${refuge.slug}: ${best.title} by ${artist} (${license})`);
        successCount++;
        continue;
      }

      const ext = path.extname(info.url) || '.jpg';
      const localName = `${refuge.slug}${ext}`;
      const dest = path.resolve(`public/refuges/${localName}`);
      
      try {
        await downloadImage(info.url, dest);
        
        refuge.images = [{
          src: `/refuges/${localName}`,
          alt_it: `Esterno del ${refuge.name_it}`,
          alt_en: `Exterior of ${refuge.name_en || refuge.name_it}`,
          alt_fr: `Extérieur du ${refuge.name_fr || refuge.name_it}`,
          alt_de: `Außenansicht der ${refuge.name_de || refuge.name_it}`,
          credit: `${artist} (${license}) · Wikimedia Commons`,
          source: page
        }];
        
        successCount++;
        console.log(`✓ ${refuge.slug}: ${artist} (${license})`);
      } catch (e: any) {
        console.log(`✗ Error downloading for ${refuge.slug}: ${e.message}`);
      }
    } else {
      console.log(`✗ No suitable results for ${refuge.slug}`);
    }
  }

  if (!dryRun && processed > 0) {
    await fs.writeFile(dataPath, JSON.stringify(refuges, null, 2) + '\n');
    console.log('✓ refuges.json aggiornato');
  }
  
  console.log(`\nCompletati: ${successCount}/${processed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
