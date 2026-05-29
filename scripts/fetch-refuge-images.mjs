/**
 * Scarica foto Wikimedia Commons per ogni rifugio (con alt text per esterno/interno).
 * Ogni rifugio usa file unici — nessun duplicato tra strutture diverse.
 * Uso: node scripts/fetch-refuge-images.mjs [slug...]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const OUT = path.resolve('public/refuges');
const DATA = path.resolve('src/data/refuges.json');
const UA = 'SentieriVda/1.0 (https://sentieri-vda.vercel.app)';

/** @type {Record<string, { file: string, alt_it: string, alt_en: string }[]>} */
const CURATED = {
  'rifugio-bonatti': [
    {
      file: 'Rifugio Walter Bonatti Refuge.jpg',
      alt_it: 'Esterno del Rifugio Walter Bonatti in Val Ferret',
      alt_en: 'Exterior of Walter Bonatti refuge in Val Ferret',
    },
    {
      file: 'Rifugio Bonatti - Val Ferret, Courmayeur, Aosta, Italia - 8 Agosto 2016.jpg',
      alt_it: 'Rifugio Bonatti con vista sulle Grandes Jorasses',
      alt_en: 'Bonatti refuge with Grandes Jorasses view',
    },
    {
      file: 'Refuge Walter Bonatti salle de restauration.jpg',
      alt_it: 'Sala ristorante interna del Rifugio Walter Bonatti',
      alt_en: 'Dining room inside Walter Bonatti refuge',
    },
  ],
  'rifugio-bertone': [
    {
      file: 'Bertone1.jpg',
      alt_it: 'Rifugio Bertone sopra Courmayeur',
      alt_en: 'Bertone refuge above Courmayeur',
    },
    {
      file: 'Refuge Giorgio Bertone nouveau dortoir.jpg',
      alt_it: 'Dormitorio del Rifugio Bertone',
      alt_en: 'Dormitory at Bertone refuge',
    },
  ],
  'rifugio-elisabetta-soldini': [
    {
      file: 'Rifugio Elisabetta CAI.JPG',
      alt_it: 'Rifugio Elisabetta Soldini in Val Veny',
      alt_en: 'Elisabetta Soldini refuge in Val Veny',
    },
    {
      file: 'Val Veny Rif Elisabetta.JPG',
      alt_it: 'Panorama del Rifugio Elisabetta con il Monte Bianco',
      alt_en: 'Elisabetta refuge panorama with Mont Blanc',
    },
    {
      file: 'Val Veny nei pressi del Rifugio Elisabetta.jpg',
      alt_it: 'Approccio al rifugio Elisabetta lungo la Val Veny',
      alt_en: 'Approach to Elisabetta refuge along Val Veny',
    },
  ],
  'rifugio-coda': [
    {
      file: 'Rifugio coda.jpg',
      alt_it: 'Rifugio Coda sopra Gaby in Val d’Ayas',
      alt_en: 'Coda refuge above Gaby in Ayas valley',
    },
    {
      file: 'Rifugio coda - tor geants.jpg',
      alt_it: 'Rifugio Coda con le Tor des Geants sullo sfondo',
      alt_en: 'Coda refuge with Tor des Geants in the background',
    },
  ],
  'rifugio-barma': [
    {
      file: 'Rifugio Barma tra i due laghi della Barma.jpg',
      alt_it: 'Rifugio Barma tra i Laghi della Barma',
      alt_en: 'Barma refuge between the Barma lakes',
    },
    {
      file: 'Rifugio Barma e monte Mars.jpg',
      alt_it: 'Rifugio Barma con il Monte Mars',
      alt_en: 'Barma refuge with Monte Mars',
    },
  ],
  'rifugio-vieux-crest': [
    {
      file: 'WalserhausFrantzeAug212024.jpg',
      alt_it: 'Borgata walser di Frantze, ai piedi del Rifugio Vieux Crest',
      alt_en: 'Walser hamlet of Frantze, below Vieux Crest refuge',
    },
    {
      file: 'Plastico villaggio walser crest ad ayas 235.jpg',
      alt_it: 'Villaggio walser di Crest d’Ayas',
      alt_en: 'Walser village of Crest d’Ayas',
    },
  ],
  'rifugio-grand-tournalin': [
    {
      file: 'Rifugio Grand Tournalin.jpg',
      alt_it: 'Rifugio Grand Tournalin in Val d’Ayas',
      alt_en: 'Grand Tournalin refuge in Ayas valley',
    },
    {
      file: 'RifugioGrandTournalinAug212024 01.jpg',
      alt_it: 'Esterno del Rifugio Grand Tournalin',
      alt_en: 'Exterior of Grand Tournalin refuge',
    },
  ],
  'rifugio-jean-barmasse': [
    {
      file: 'Rifugio Barmasse.JPG',
      alt_it: 'Rifugio Jean Barmasse sopra Valtournenche',
      alt_en: 'Jean Barmasse refuge above Valtournenche',
    },
    {
      file: 'Rifugio Barmasse - Lac de Cortinaz.jpg',
      alt_it: 'Rifugio Barmasse con il Lago di Cortinaz',
      alt_en: 'Barmasse refuge with Lake Cortinaz',
    },
  ],
  'rifugio-oratorio-di-cuney': [
    {
      file: 'Rifugio Oratorio di Cunéy.jpg',
      alt_it: 'Rifugio Oratorio di Cuney in Valpelline',
      alt_en: 'Oratorio di Cuney refuge in Valpelline',
    },
    {
      file: 'Oratorio e rifugio Cunéy sovrastati dalla Becca del Merlo.jpg',
      alt_it: 'Rifugio Cuney sotto la Becca del Merlo',
      alt_en: 'Cuney refuge below Becca del Merlo',
    },
    {
      file: 'Rifugio Oratorio di Cunéy 2.jpg',
      alt_it: 'Vista ravvicinata del Rifugio Oratorio di Cuney',
      alt_en: 'Close view of Oratorio di Cuney refuge',
    },
  ],
  'rifugio-champillon': [
    {
      file: 'Rifugio Letey Champillon.jpg',
      alt_it: 'Rifugio Champillon (Letey) in Valpelline',
      alt_en: 'Champillon (Letey) refuge in Valpelline',
    },
  ],
  'rifugio-frassati': [
    {
      file: 'Rifugio Frassati.jpg',
      alt_it: 'Rifugio Pier Giorgio Frassati a Valnontey',
      alt_en: 'Pier Giorgio Frassati refuge at Valnontey',
    },
    {
      file: 'Rifugio Pier Giorgio Frassati 001.jpg',
      alt_it: 'Esterno del Rifugio Frassati nel vallone di Valnontey',
      alt_en: 'Frassati refuge exterior in Valnontey valley',
    },
  ],
  'rifugio-alpenzu-grande': [
    {
      file: 'Rifugio Alpenzù.JPG',
      alt_it: 'Rifugio Alpenzù Grande a Champoluc',
      alt_en: 'Alpenzù Grande refuge at Champoluc',
    },
  ],
  'rifugio-maison-vieille': [
    {
      file: 'Refuge Maison Vieille.jpg',
      alt_it: 'Rifugio Maison Vieille in Val Veny',
      alt_en: 'Maison Vieille refuge in Val Veny',
    },
  ],
  'bivacco-promoud': [
    {
      file: 'Col de la Crosatie.jpg',
      alt_it: 'Col de la Crosatie, passo dell’Alta Via 2 sopra il Bivacco Promoud',
      alt_en: 'Col de la Crosatie pass on Alta Via 2 above Promoud bivouac',
    },
  ],
  'rifugio-chalet-de-lepee': [
    {
      file: 'Rifugio Chalet Epee July 2011.jpg',
      alt_it: 'Rifugio Chalet de l’Épée in Valgrisenche',
      alt_en: 'Chalet de l’Épée refuge in Valgrisenche',
    },
  ],
  'rifugio-vittorio-sella': [
    {
      file: 'GPRifugioVittorioSella01.jpg',
      alt_it: 'Rifugio Vittorio Sella in Valsavarenche',
      alt_en: 'Vittorio Sella refuge in Valsavarenche',
    },
    {
      file: 'VersoRifugioVittorioSella.jpg',
      alt_it: 'Sentiero verso il Rifugio Vittorio Sella',
      alt_en: 'Trail to Vittorio Sella refuge',
    },
  ],
  'rifugio-sogno-di-berdze': [
    {
      file: 'Rifugio Sogno di berzé Péradza.JPG',
      alt_it: 'Rifugio Sogno di Berdzé a Valnontey',
      alt_en: 'Sogno di Berdzé refuge at Valnontey',
    },
  ],
  'rifugio-dondena': [
    {
      file: 'Rifugio Dondena.JPG',
      alt_it: 'Rifugio Dondena in Champorcher',
      alt_en: 'Dondena refuge in Champorcher',
    },
  ],
  'rifugio-deffeyes': [
    {
      file: 'La Thuile-Rifugio Deffeyes.jpg',
      alt_it: 'Rifugio Deffeyes nel vallone del Rutor',
      alt_en: 'Deffeyes refuge in Rutor valley',
    },
    {
      file: 'La Thuile-Rifugio Deffeyes 2.jpg',
      alt_it: 'Vista sul Rifugio Deffeyes',
      alt_en: 'View of Deffeyes refuge',
    },
  ],
  'rifugio-elena': [
    {
      file: 'Refuge Elena.jpg',
      alt_it: 'Rifugio Elena in Val Ferret',
      alt_en: 'Elena refuge in Val Ferret',
    },
  ],
  'rifugio-gabiet': [
    {
      file: 'Rifugio Gabiet.jpg',
      alt_it: 'Rifugio Gabiet sopra Gressoney',
      alt_en: 'Gabiet refuge above Gressoney',
    },
  ],
  'rifugio-duca-degli-abruzzi': [
    {
      file: 'Rifugio Duca degli Abruzzi.jpg',
      alt_it: 'Rifugio Duca degli Abruzzi al Lago Goillet',
      alt_en: 'Duca degli Abruzzi refuge at Lake Goillet',
    },
  ],
  'rifugio-orionde': [
    {
      file: "Rifugio l'Oriondè.JPG",
      alt_it: 'Rifugio l’Oriondè sull’Alta Via del Cervino',
      alt_en: 'Oriondé refuge on the Matterhorn high route',
    },
  ],
  'rifugio-verney': [
    {
      file: 'Verney Lake 02.JPG',
      alt_it: 'Rifugio Verney sul Lago Verney, Valgrisenche',
      alt_en: 'Verney refuge on Lake Verney, Valgrisenche',
    },
  ],
  'rifugio-prarayer': [
    {
      file: 'Rifugio Prarayer.JPG',
      alt_it: 'Rifugio Prarayer in Valpelline',
      alt_en: 'Prarayer refuge in Valpelline',
    },
    {
      file: 'Rifugio Prarayer Place Moulin30102017-090.jpg',
      alt_it: 'Rifugio Prarayer con Place Moulin sullo sfondo',
      alt_en: 'Prarayer refuge with Place Moulin in the background',
    },
  ],
};

function wikiUrl(filename) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1600`;
}

function md5(buf) {
  return crypto.createHash('md5').update(buf).digest('hex');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function download(filename, dest) {
  const res = await fetch(wikiUrl(filename), {
    headers: { 'User-Agent': UA, Accept: 'image/*' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error('troppo piccolo');
  await fs.writeFile(dest, buf);
  return buf;
}

async function main() {
  const only = process.argv.slice(2);
  await fs.mkdir(OUT, { recursive: true });
  const refuges = JSON.parse(await fs.readFile(DATA, 'utf8'));

  const usedFiles = new Set();
  const usedHashes = new Set();

  for (const refuge of refuges) {
    if (only.length && !only.includes(refuge.slug)) continue;

    const entries = CURATED[refuge.slug];
    if (!entries?.length) {
      console.log(`⚠ ${refuge.slug} — nessun file curato`);
      continue;
    }

    const images = [];
    for (let i = 0; i < entries.length; i++) {
      const { file, alt_it, alt_en } = entries[i];

      if (usedFiles.has(file)) {
        console.log(`⊘ ${refuge.slug} — skip duplicato file: ${file}`);
        continue;
      }

      const ext = file.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
      const localName = i === 0 ? `${refuge.slug}.${ext}` : `${refuge.slug}-${images.length + 1}.${ext}`;
      const dest = path.join(OUT, localName);
      process.stdout.write(`→ ${localName} (${file}) … `);
      try {
        await sleep(600);
        const buf = await download(file, dest);
        const hash = md5(buf);
        if (usedHashes.has(hash)) {
          await fs.unlink(dest).catch(() => {});
          console.log(`SKIP hash duplicato`);
          continue;
        }
        usedFiles.add(file);
        usedHashes.add(hash);
        images.push({
          src: `/refuges/${localName}`,
          alt_it,
          alt_en,
          credit: `Wikimedia Commons · ${file}`,
        });
        console.log(`OK (${Math.round(buf.length / 1024)} KB)`);
      } catch (e) {
        console.log(`FAIL — ${e.message}`);
      }
    }

    if (images.length) refuge.images = images;
  }

  await fs.writeFile(DATA, JSON.stringify(refuges, null, 2) + '\n');
  console.log(`\n✓ refuges.json aggiornato · ${usedHashes.size} immagini uniche`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
