import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/species';
const UA = 'SentieriVdA/1.0 (https://sentieri-vda.vercel.app)';

async function searchFile(query) {
  const url =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: query,
      gsrnamespace: '6',
      gsrlimit: '5',
      prop: 'imageinfo',
      iiprop: 'url|thumburl|mime',
      iiurlwidth: '1280',
      format: 'json',
    });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const json = await res.json();
  const pages = json.query?.pages;
  if (!pages) return null;
  for (const page of Object.values(pages)) {
    const info = page.imageinfo?.[0];
    if (!info?.thumburl) continue;
    if (!info.mime?.startsWith('image/')) continue;
    return { title: page.title, thumburl: info.thumburl };
  }
  return null;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** id → [photo search, plate search (optional)] */
const SPECIES = {
  rododendro: ['Rhododendron ferrugineum flower', 'Rhododendron ferrugineum Köhler'],
  genepi: ['Artemisia genipi', 'Artemisia genipi plant'],
  mirtillo: ['Vaccinium myrtillus', 'Vaccinium myrtillus berries'],
  'cotone-delle-nevi': ['Eriophorum scheuchzeri', 'Eriophorum scheuchzeri cotton'],
  larice: ['Larix decidua forest', 'Larix decidua Köhler Medizinal-Pflanzen'],
  'pino-silvestre': ['Pinus sylvestris', 'Pinus sylvestris Köhler Medizinal-Pflanzen'],
  betulla: ['Betula pendula', 'Betula pendula Köhler Medizinal-Pflanzen'],
  castagno: ['Castanea sativa', 'Castanea sativa Köhler Medizinal-Pflanzen'],
  vite: ['Vitis vinifera grapes', 'Vitis vinifera Köhler Medizinal-Pflanzen'],
};

fs.mkdirSync(OUT, { recursive: true });
let src = fs.readFileSync('src/data/species.ts', 'utf8');

for (const [id, [photoQ, bgQ]] of Object.entries(SPECIES)) {
  for (const [kind, query] of [
    ['image', photoQ],
    ['backgroundImage', bgQ],
  ]) {
    const suffix = kind === 'image' ? '' : '-bg';
    const dest = path.join(OUT, `${id}${suffix}.jpg`);
    try {
      const hit = await searchFile(query);
      if (!hit) throw new Error(`no result for ${query}`);
      await download(hit.thumburl, dest);
      const publicPath = `/species/${id}${suffix}.jpg`;
      src = src.replace(
        new RegExp(
          `(id: '${id.replace(/-/g, '\\-')}'[\\s\\S]*?${kind}:\\s*\\n\\s*')([^']+)(')`,
          'm'
        ),
        `$1${publicPath}$3`
      );
      console.log(`OK ${id}${suffix} ← ${hit.title}`);
    } catch (e) {
      console.error(`FAIL ${id}${suffix}:`, e.message);
    }
    await sleep(2500);
  }
}

fs.writeFileSync('src/data/species.ts', src);
console.log('species.ts patched');
