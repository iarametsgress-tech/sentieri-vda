import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/species';
const UA = 'SentieriVdA/1.0 (https://sentieri-vda.vercel.app)';

/** id → search query (prioritize photo, not map/chart) */
const OVERRIDES = {
  cervo: 'Cervus elaphus male portrait photo',
  lupo: 'Canis lupus wolf photo Alps',
};

async function searchThumb(query) {
  const url =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: query,
      gsrnamespace: '6',
      gsrlimit: '12',
      prop: 'imageinfo',
      iiprop: 'url|mime',
      iiurlwidth: '1280',
      format: 'json',
    });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const json = await res.json();
  const pages = json.query?.pages;
  if (!pages) return null;
  const sorted = Object.values(pages).sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
  for (const page of sorted) {
    const info = page.imageinfo?.[0];
    const title = (page.title ?? '').toLowerCase();
    if (!info?.thumburl || !info.mime?.startsWith('image/')) continue;
    if (title.includes('map') || title.includes('range') || title.includes('distribution')) continue;
    if (title.includes('habitat') || title.includes('leefgebied')) continue;
    if (info.thumbwidth && info.thumbwidth < 400) continue;
    return { thumb: info.thumburl, title: page.title };
  }
  return null;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(String(res.status));
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error('file too small');
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function collectIdsFromLists() {
  const ids = new Set();
  for (const file of ['fauna-list.ts', 'flora-list.ts']) {
    const src = fs.readFileSync(path.join('src/data/species', file), 'utf8');
    for (const m of src.matchAll(/id: '([^']+)'/g)) ids.add(m[1]);
  }
  return [...ids];
}

fs.mkdirSync(OUT, { recursive: true });

const ids = collectIdsFromLists();
let ok = 0;
let skip = 0;
let fail = 0;

for (const id of ids) {
  const dest = path.join(OUT, `${id}.jpg`);
  const force = id in OVERRIDES;
  if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 12000) {
    skip++;
    continue;
  }
  const query = OVERRIDES[id] ?? id.replace(/-/g, ' ');
  try {
    const hit = await searchThumb(query);
    if (!hit) throw new Error('no image');
    const bytes = await download(hit.thumb, dest);
    console.log('OK', id, bytes, '←', hit.title);
    ok++;
  } catch (e) {
    console.error('FAIL', id, e.message);
    fail++;
  }
  await sleep(1800);
}

console.log(`\n${ok} ok, ${skip} skip, ${fail} fail (${ids.length} total)`);
