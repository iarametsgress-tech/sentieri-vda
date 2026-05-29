// Sourcing immagini Cultura da Wikimedia Commons.
// Cerca per query curate, scarica la migliore foto (JPEG/PNG, larga) in public/cultura/<id>.jpg
// e registra credito (autore + licenza) + URL sorgente. NESSUN dato inventato:
// autore/licenza/URL provengono dai metadati Commons.
//
// Uso:
//   node scripts/source-culture-images.mjs           # scarica i mancanti
//   node scripts/source-culture-images.mjs --force    # riscarica tutto
//   node scripts/source-culture-images.mjs --only=fontina,torrette

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'cultura');
const DATA_DIR = path.join(ROOT, 'src', 'data', 'culture');

const FORCE = process.argv.includes('--force');
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const ONLY = onlyArg ? new Set(onlyArg.split('=')[1].split(',')) : null;

// file → { id: queryCommons }
const QUERIES = {
  'valleys.json': {
    valgrisenche: 'Valgrisenche',
    'val-di-rhemes': 'Rhêmes-Notre-Dame',
    'val-ferret': 'Val Ferret Courmayeur',
  },
  'traditions.json': {
    'walser-titsch': 'Walser Gressoney-La-Trinité',
    'fontina-fair': 'Fontina cheese',
    'jambon-de-bosses': 'Saint-Rhémy-en-Bosses',
    carnival: 'Coumba Freida landzette carnaval',
    'mont-mars-march': 'Mont Mars Fontainemore',
    'coumba-freida': 'Coumba Freida landzette',
    'traditional-costumes': 'Costume traditionnel Vallée Aoste folklore',
    transhumance: 'Alpage Vallée d\'Aoste vaches',
    'saint-ours': 'Foire de Saint-Ours Aoste',
  },
  'food-wine.json': {
    fontina: 'Fontina cheese',
    'jambon-de-bosses': 'Jambon de Bosses',
    'lardo-arnad': 'Lard d\'Arnad',
    mocetta: 'Mocetta',
    'seupa-valpellinentze': 'Seupa Valpelline soupe',
    'polenta-concia': 'Polenta concia',
    carbonade: 'Carbonade',
    'caffe-valdostano': 'Coppa dell\'amicizia',
    picotin: 'Picotin fromage',
    tegole: 'Tegole valdostane',
    'blanc-de-morgex': 'Blanc de Morgex et de La Salle',
    'enfer-d-arvier': 'Arvier vignoble Vallée Aoste',
    torrette: 'Torrette Vallée d\'Aoste vin',
    'donnas-picotendro': 'Donnas Vallée d\'Aoste vigne',
  },
};

const BAD_TITLE = /\.svg|logo|coat of arms|stemma|flag|bandiera|map|mappa|carte|locator|wikidata|icon/i;

// Filtro di pertinenza per-voce: il titolo del file deve contenere una di queste parole.
// Evita match fuori tema (es. una chiesa in Georgia per "transhumance").
const MUST_MATCH = {
  carnival: /coumba|landzette|carnaval|carnival|masque|maschere/i,
  'traditional-costumes': /costume/i,
  transhumance: /alpage|vache|pâturage|mucche|mucca|estive|bétail|troupeau|bestiame|pascolo/i,
  'coumba-freida': /coumba|landzette/i,
  'jambon-de-bosses': /jambon|bosses/i,
  'seupa-valpellinentze': /seupa|soupe|zuppa|valpell/i,
  'enfer-d-arvier': /arvier|enfer/i,
  picotin: /picotin/i,
};

const UA = 'sentieri-vda-image-sourcing/1.0 (educational, contact: dev@sentierivda.local)';

async function fetchWithRetry(url, { tries = 5 } = {}) {
  let delay = 1500;
  for (let attempt = 1; attempt <= tries; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429 || res.status === 503) {
      const ra = parseInt(res.headers.get('retry-after') || '', 10);
      const wait = Number.isFinite(ra) ? ra * 1000 : delay;
      console.log(`  …rate-limit (${res.status}), attendo ${(wait / 1000).toFixed(1)}s [${attempt}/${tries}]`);
      await new Promise((r) => setTimeout(r, wait));
      delay = Math.min(delay * 2, 20000);
      continue;
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res;
  }
  throw new Error('rate-limited dopo ' + tries + ' tentativi');
}

function stripHtml(s) {
  if (!s) return '';
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function searchCandidates(query) {
  const url =
    'https://commons.wikimedia.org/w/api.php?format=json&origin=*' +
    '&action=query&generator=search&gsrnamespace=6&gsrlimit=10' +
    '&gsrsearch=' + encodeURIComponent(query) +
    '&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=1600';
  const res = await fetchWithRetry(url);
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return [];
  return Object.values(pages)
    .filter((p) => p.imageinfo && p.imageinfo[0])
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((p) => ({ title: p.title, ii: p.imageinfo[0] }));
}

function pickBest(cands, must) {
  for (const c of cands) {
    const { ii, title } = c;
    if (BAD_TITLE.test(title)) continue;
    if (!/^image\/(jpeg|png)$/.test(ii.mime || '')) continue;
    if ((ii.width || 0) < 900) continue;
    if (must && !must.test(title)) continue;
    return c;
  }
  return null;
}

async function download(urlStr, destPath) {
  const res = await fetchWithRetry(urlStr);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const report = [];

  for (const [file, map] of Object.entries(QUERIES)) {
    const filePath = path.join(DATA_DIR, file);
    const arr = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changed = false;

    for (const [id, query] of Object.entries(map)) {
      if (ONLY && !ONLY.has(id)) continue;
      const item = arr.find((x) => x.id === id);
      if (!item) {
        console.log(`! [${file}] id non trovato: ${id}`);
        continue;
      }
      const dest = path.join(OUT_DIR, `${id}.jpg`);
      const rel = `/cultura/${id}.jpg`;
      if (!FORCE && fs.existsSync(dest)) {
        console.log(`= ${id}: già presente (${rel})`);
        continue;
      }
      try {
        const cands = await searchCandidates(query);
        const best = pickBest(cands, MUST_MATCH[id]);
        if (!best) {
          console.log(`✗ ${id}: nessun candidato valido per "${query}"`);
          report.push({ file, id, query, status: 'no-match' });
          continue;
        }
        const author = stripHtml(best.ii.extmetadata?.Artist?.value) || 'Wikimedia Commons';
        const license = stripHtml(best.ii.extmetadata?.LicenseShortName?.value) || '';
        const size = await download(best.ii.thumburl, dest);
        item.image = rel;
        item.image_credit = license ? `${author} (${license})` : author;
        item.image_source = best.ii.descriptionurl;
        changed = true;
        console.log(
          `✓ ${id}: ${best.title} — ${author} [${license}] — ${(size / 1024).toFixed(0)} KB`
        );
        report.push({
          file,
          id,
          query,
          status: 'ok',
          title: best.title,
          credit: item.image_credit,
          source: item.image_source,
        });
      } catch (e) {
        console.log(`✗ ${id}: errore ${e.message}`);
        report.push({ file, id, query, status: 'error', error: e.message });
      }
      await new Promise((r) => setTimeout(r, 1500));
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(arr, null, 2) + '\n');
      console.log(`→ aggiornato ${file}`);
    }
  }

  fs.writeFileSync(
    path.join(__dirname, 'culture-image-report.json'),
    JSON.stringify(report, null, 2) + '\n'
  );
  const ok = report.filter((r) => r.status === 'ok').length;
  console.log(`\nFatto: ${ok}/${report.length} immagini scaricate.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
