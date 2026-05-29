import fs from 'node:fs';

const patches = {
  rododendro: '/species/rododendro-bg.jpg',
  betulla: '/species/betulla-bg.jpg',
};

let src = fs.readFileSync('src/data/species.ts', 'utf8');
for (const [id, bgPath] of Object.entries(patches)) {
  src = src.replace(
    new RegExp(
      `(id: '${id.replace(/-/g, '\\-')}'[\\s\\S]*?backgroundImage:\\s*\\n\\s*')([^']+)(')`,
      'm'
    ),
    `$1${bgPath}$3`
  );
}
fs.writeFileSync('src/data/species.ts', src);

// betulla-bg from Köhler plate
const UA = 'SentieriVdA/1.0';
const api =
  'https://commons.wikimedia.org/w/api.php?action=query&titles=File:Betula%20pendula%20-%20K%C3%B6hler%E2%80%93s%20Medizinal-Pflanzen-026.jpg&prop=imageinfo&iiprop=thumburl&iiurlwidth=1280&format=json';
const res = await fetch(api, { headers: { 'User-Agent': UA } });
const page = Object.values((await res.json()).query.pages)[0];
const thumb = page.imageinfo?.[0]?.thumburl;
if (!thumb) throw new Error('betulla plate not found');
const img = await fetch(thumb, { headers: { 'User-Agent': UA } });
fs.writeFileSync('public/species/betulla-bg.jpg', Buffer.from(await img.arrayBuffer()));
console.log('betulla-bg downloaded');
