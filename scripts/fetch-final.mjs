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
];

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

for (const [title, dest] of FILES) {
  await sleep(6000);
  const url =
    'https://commons.wikimedia.org/w/api.php?format=json&origin=*' +
    '&action=query&prop=imageinfo&iiprop=url&iiurlwidth=1800&titles=' +
    encodeURIComponent(title);
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const ii = Object.values(data.query.pages)[0]?.imageinfo?.[0];
  if (!ii) {
    console.log('MISS', title);
    continue;
  }
  const img = await fetch(ii.thumburl, { headers: { 'User-Agent': UA } });
  const abs = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, Buffer.from(await img.arrayBuffer()));
  console.log('OK', dest);
}
