import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/species';
const UA = 'SentieriVdA/1.0 (https://sentieri-vda.vercel.app)';

/** id → search query on Wikimedia Commons */
const QUERIES = {
  cervo: 'Cervus elaphus Alps',
  capriolo: 'Capreolus capreolus',
  'lepre-alpina': 'Lepus timidus',
  scoiattolo: 'Sciurus vulgaris',
  volpe: 'Vulpes vulpes',
  martora: 'Martes martes',
  faina: 'Martes foina',
  ghiro: 'Glis glis',
  istricio: 'Hystrix cristata',
  donnola: 'Mustela nivalis',
  'gufo-reale': 'Bubo bubo',
  allocco: 'Strix aluco',
  'gallo-cedrone': 'Tetrao urogallus',
  coturnice: 'Alectoris graeca',
  'picchio-nero': 'Dryocopus martius',
  lupo: 'Canis lupus Alps',
  orso: 'Ursus arctos Alps',
  'abete-bianco': 'Abies alba',
  'abete-rosso': 'Picea abies',
  sorbo: 'Sorbus aucuparia',
  acero: 'Acer pseudoplatanus',
  ontano: 'Alnus alnobetula',
  pioppo: 'Populus tremula',
  'mirtillo-rosso': 'Vaccinium vitis-idaea',
  ginepro: 'Juniperus communis',
  biancospino: 'Crataegus monogyna',
  'rosa-canina': 'Rosa canina',
  'spino-cervino': 'Rhamnus alpinus',
  ribes: 'Ribes alpinum',
  'salice-herbaceo': 'Salix herbacea',
  gentiana: 'Gentiana acaulis',
  anemone: 'Anemone narcissiflora',
  primula: 'Primula hirsuta',
  ciclamino: 'Cyclamen purpurascens',
  anterica: 'Antennaria dioica',
  'ranuncolo-glaciale': 'Ranunculus glacialis',
  saussurea: 'Saussurea alpina',
  linaria: 'Linaria alpina',
  pinguicula: 'Pinguicula alpina',
  nigritella: 'Nigritella nigra',
  'genziana-maggiore': 'Gentiana lutea',
  renetta: 'Geum montanum',
};

async function searchThumb(query) {
  const url =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: query,
      gsrnamespace: '6',
      gsrlimit: '8',
      prop: 'imageinfo',
      iiprop: 'url|mime',
      iiurlwidth: '1280',
      format: 'json',
    });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const json = await res.json();
  const pages = json.query?.pages;
  if (!pages) return null;
  for (const page of Object.values(pages)) {
    const info = page.imageinfo?.[0];
    if (info?.thumburl && info.mime?.startsWith('image/')) {
      return { thumb: info.thumburl, title: page.title };
    }
  }
  return null;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(String(res.status));
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

fs.mkdirSync(OUT, { recursive: true });

let ok = 0;
let skip = 0;
let fail = 0;

for (const [id, query] of Object.entries(QUERIES)) {
  const dest = path.join(OUT, `${id}.jpg`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
    console.log('SKIP', id);
    skip++;
    continue;
  }
  try {
    const hit = await searchThumb(query);
    if (!hit) throw new Error('no image');
    await download(hit.thumb, dest);
    console.log('OK', id, '←', hit.title);
    ok++;
  } catch (e) {
    console.error('FAIL', id, e.message);
    fail++;
  }
  await sleep(2200);
}

console.log(`\n${ok} downloaded, ${skip} skipped, ${fail} failed`);
