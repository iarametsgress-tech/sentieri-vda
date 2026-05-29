import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/species';
const UA = 'SentieriVdA/1.0 (https://sentieri-vda.vercel.app; contact@sentieri-vda.it)';

/** id → { thumb, bg } Wikimedia URLs (1280px = size allowed by Wikimedia) */
const SPECIES_IMAGES = {
  stambecco: {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stambecchi_nel_Parco_Nazionale_del_Gran_Paradiso.jpg/1280px-Stambecchi_nel_Parco_Nazionale_del_Gran_Paradiso.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stambecchi_nel_Parco_Nazionale_del_Gran_Paradiso.jpg/1280px-Stambecchi_nel_Parco_Nazionale_del_Gran_Paradiso.jpg',
  },
  camoscio: {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/G%C3%A4mse%2C_Rupicapra_rupicapra_02.JPG/1280px-G%C3%A4mse%2C_Rupicapra_rupicapra_02.JPG',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/G%C3%A4mse%2C_Rupicapra_rupicapra_02.JPG/1280px-G%C3%A4mse%2C_Rupicapra_rupicapra_02.JPG',
  },
  marmotta: {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Marmota_Marmota_-_Alps_-_Head.jpg/1280px-Marmota_Marmota_-_Alps_-_Head.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Marmota_Marmota_-_Alps_-_Head.jpg/1280px-Marmota_Marmota_-_Alps_-_Head.jpg',
  },
  'aquila-reale': {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Steinadler_Aquila_chrysaetos_closeup2_Richard_Bartz.jpg/1280px-Steinadler_Aquila_chrysaetos_closeup2_Richard_Bartz.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Steinadler_Aquila_chrysaetos_closeup2_Richard_Bartz.jpg/1280px-Steinadler_Aquila_chrysaetos_closeup2_Richard_Bartz.jpg',
  },
  gipeto: {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/010d_Wild_Bearded_Vulture_in_flight_at_Pfyn-Finges_%28Switzerland%29_Photo_by_Giles_Laurent.jpg/1280px-010d_Wild_Bearded_Vulture_in_flight_at_Pfyn-Finges_%28Switzerland%29_Photo_by_Giles_Laurent.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/010d_Wild_Bearded_Vulture_in_flight_at_Pfyn-Finges_%28Switzerland%29_Photo_by_Giles_Laurent.jpg/1280px-010d_Wild_Bearded_Vulture_in_flight_at_Pfyn-Finges_%28Switzerland%29_Photo_by_Giles_Laurent.jpg',
  },
  'stella-alpina': {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/CH_Leontopodium_alpinum_2.jpg/1280px-CH_Leontopodium_alpinum_2.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/CH_Leontopodium_alpinum_2.jpg/1280px-CH_Leontopodium_alpinum_2.jpg',
  },
  rododendro: {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Rhododendron_ferrugineum_002.jpg/1280px-Rhododendron_ferrugineum_002.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Rhododendron_ferrugineum_002.jpg/1280px-Rhododendron_ferrugineum_002.jpg',
  },
  genepi: {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Artemisia_genipi_kz03.jpg/1280px-Artemisia_genipi_kz03.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Artemisia_genipi_kz03.jpg/1280px-Artemisia_genipi_kz03.jpg',
  },
  mirtillo: {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Vaccinium_myrtillus_001.jpg/1280px-Vaccinium_myrtillus_001.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Vaccinium_myrtillus_001.jpg/1280px-Vaccinium_myrtillus_001.jpg',
  },
  'cotone-delle-nevi': {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Eriophorum_scheuchzeri_kz03.jpg/1280px-Eriophorum_scheuchzeri_kz03.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Eriophorum_scheuchzeri_kz03.jpg/1280px-Eriophorum_scheuchzeri_kz03.jpg',
  },
  larice: {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Larix_decidua_Apennines.jpg/1280px-Larix_decidua_Apennines.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Larix_decidua_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg/1280px-Larix_decidua_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg',
  },
  'pino-silvestre': {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Pinus_sylvestris_001.jpg/1280px-Pinus_sylvestris_001.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Pinus_sylvestris_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-193.jpg/1280px-Pinus_sylvestris_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-193.jpg',
  },
  betulla: {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Betula_pendula_001.jpg/1280px-Betula_pendula_001.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Betula_pendula_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-026.jpg/1280px-Betula_pendula_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-026.jpg',
  },
  castagno: {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Castanea_sativa_001.jpg/1280px-Castanea_sativa_001.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Castanea_sativa_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-036.jpg/1280px-Castanea_sativa_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-036.jpg',
  },
  vite: {
    thumb:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Vitis_vinifera_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-258.jpg/960px-Vitis_vinifera_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-258.jpg',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Vitis_vinifera_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-258.jpg/1280px-Vitis_vinifera_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-258.jpg',
  },
};

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

fs.mkdirSync(OUT, { recursive: true });

const paths = {};
let ok = 0;
let fail = 0;

for (const [id, { thumb, bg }] of Object.entries(SPECIES_IMAGES)) {
  for (const [kind, url] of [
    ['image', thumb],
    ['backgroundImage', bg],
  ]) {
    const suffix = kind === 'image' ? '' : '-bg';
    const dest = path.join(OUT, `${id}${suffix}.jpg`);
    const publicPath = `/species/${id}${suffix}.jpg`;
    try {
      const bytes = await download(url, dest);
      paths[id] ??= {};
      paths[id][kind] = publicPath;
      console.log(`OK ${id}${suffix} (${bytes} bytes)`);
      ok++;
    } catch (e) {
      console.error(`FAIL ${id}${suffix}:`, e.message);
      fail++;
    }
    await sleep(1500);
  }
}

// Patch species.ts
let src = fs.readFileSync('src/data/species.ts', 'utf8');
for (const [id, fields] of Object.entries(paths)) {
  if (fields.image) {
    src = src.replace(
      new RegExp(`(id: '${id.replace(/-/g, '\\-')}'[\\s\\S]*?image:\\s*\\n\\s*')([^']+)(')`, 'm'),
      `$1${fields.image}$3`
    );
  }
  if (fields.backgroundImage) {
    src = src.replace(
      new RegExp(
        `(id: '${id.replace(/-/g, '\\-')}'[\\s\\S]*?backgroundImage:\\s*\\n\\s*')([^']+)(')`,
        'm'
      ),
      `$1${fields.backgroundImage}$3`
    );
  }
}
fs.writeFileSync('src/data/species.ts', src);

console.log(`\nDone: ${ok} ok, ${fail} fail`);
console.log('species.ts updated with local /species/ paths');
