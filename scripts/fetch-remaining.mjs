import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'SentieriVdA/1.0';

const FILES = [
  ['File:Fife (52688865522).jpg', 'public/cultura/fifres.jpg'],
  ['File:Formaggio zuppa 063.jpg', 'public/cultura/seupa-valpellinentze.jpg'],
  ['File:Goat cheese 01.jpg', 'public/cultura/picotin.jpg'],
  ['File:Masques du carnaval d\'Evolène.jpg', 'public/cultura/carnival.jpg'],
  ['File:Fiera di sant Orso 2013 abc4.jpg', 'public/cultura/saint-ours-fair.jpg'],
  ['File:Lardo di Arnad fiera.jpg', 'public/cultura/lardo-fiera.jpg'],
  ['File:Gnocchi di patate con rucola e Lard dArnad.jpg', 'public/cultura/lardo-plate.jpg'],
  ['File:Vigna Valle d\'Aosta.jpg', 'public/cultura/vigna-vda.jpg'],
  ['File:Walser Museum Gressoney-La-Trinité abc2.JPG', 'public/cultura/walser-costume.jpg'],
  ['File:Coumba Freida 2012 - Landzette.jpg', 'public/cultura/coumba-freida.jpg'],
  ['File:Landzette.jpg', 'public/cultura/coumba-freida-alt.jpg'],
  ['File:Fanfara di Gressoney.jpg', 'public/cultura/fifres.jpg'],
  ['File:Maschere carnevalesche di Verrès.jpg', 'public/cultura/carnival.jpg'],
  ['File:Costumi tradizionali della Valle d\'Aosta - Gressoney.jpg', 'public/cultura/traditional-costumes.jpg'],
  ['File:Costumi tradizionali della Valle d\'Aosta.jpg', 'public/cultura/traditions-divider.jpg'],
  ['File:Seupa alla valpellinentze.jpg', 'public/cultura/seupa-valpellinentze.jpg'],
  ['File:Formaggio picotin.jpg', 'public/cultura/picotin.jpg'],
  ['File:Enfer d\'Arvier.jpg', 'public/cultura/enfer-d-arvier.jpg'],
];

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function dl(title, dest) {
  await sleep(3500);
  const url =
    'https://commons.wikimedia.org/w/api.php?format=json&origin=*' +
    '&action=query&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1800' +
    '&titles=' + encodeURIComponent(title);
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const page = Object.values(data.query.pages)[0];
  if (!page?.imageinfo?.[0]) {
    console.log('MISS', title);
    return null;
  }
  const ii = page.imageinfo[0];
  const img = await fetch(ii.thumburl || ii.url, { headers: { 'User-Agent': UA } });
  const abs = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, Buffer.from(await img.arrayBuffer()));
  const artist = (ii.extmetadata?.Artist?.value || '').replace(/<[^>]*>/g, '').trim();
  const lic = (ii.extmetadata?.LicenseShortName?.value || '').replace(/<[^>]*>/g, '').trim();
  console.log('OK', dest);
  return { dest, credit: lic ? `${artist} (${lic})` : artist, source: ii.descriptionurl };
}

const meta = [];
for (const [title, dest] of FILES) {
  try {
    const m = await dl(title, dest);
    if (m) meta.push(m);
  } catch (e) {
    console.log('ERR', dest, e.message);
  }
}
fs.writeFileSync(path.join(ROOT, 'scripts', 'dl-meta.json'), JSON.stringify(meta, null, 2));
