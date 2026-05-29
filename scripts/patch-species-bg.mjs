import fs from 'node:fs';

const BG = {
  stambecco: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Capra_ibex_jk.jpg/1600px-Capra_ibex_jk.jpg',
    fit: 'cover',
  },
  camoscio: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Rupicapra_rupicapra_-_005.jpg/1600px-Rupicapra_rupicapra_-_005.jpg',
    fit: 'cover',
  },
  marmotta: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Marmota_marmota_002.jpg/1600px-Marmota_marmota_002.jpg',
    fit: 'cover',
  },
  'aquila-reale': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Aquila_chrysaetos_-_Golden_Eagle.jpg/1600px-Aquila_chrysaetos_-_Golden_Eagle.jpg',
    fit: 'cover',
  },
  gipeto: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/010d_Wild_Bearded_Vulture_in_flight_at_Pfyn-Finges_%28Switzerland%29_Photo_by_Giles_Laurent.jpg/1600px-010d_Wild_Bearded_Vulture_in_flight_at_Pfyn-Finges_%28Switzerland%29_Photo_by_Giles_Laurent.jpg',
    fit: 'cover',
  },
  'stella-alpina': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Leontopodium_alpinum_2_%28pis%29.jpg/1600px-Leontopodium_alpinum_2_%28pis%29.jpg',
    fit: 'contain',
  },
  rododendro: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rhododendron_ferrugineum_001.jpg/1600px-Rhododendron_ferrugineum_001.jpg',
    fit: 'contain',
  },
  genepi: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Artemisia_genipi_001.JPG/1600px-Artemisia_genipi_001.JPG',
    fit: 'contain',
  },
  mirtillo: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Vaccinium_myrtillus_002.jpg/1600px-Vaccinium_myrtillus_002.jpg',
    fit: 'contain',
  },
  'cotone-delle-nevi': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Eriophorum_scheuchzeri_001.jpg/1600px-Eriophorum_scheuchzeri_001.jpg',
    fit: 'contain',
  },
  larice: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Larix_decidua_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg/1200px-Larix_decidua_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg',
    fit: 'contain',
  },
  'pino-silvestre': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Pinus_sylvestris_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-193.jpg/1200px-Pinus_sylvestris_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-193.jpg',
    fit: 'contain',
  },
  betulla: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Betula_pendula_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-026.jpg/1200px-Betula_pendula_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-026.jpg',
    fit: 'contain',
  },
  castagno: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Castanea_sativa_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-036.jpg/1200px-Castanea_sativa_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-036.jpg',
    fit: 'contain',
  },
  vite: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Vitis_vinifera_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-258.jpg/1200px-Vitis_vinifera_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-258.jpg',
    fit: 'contain',
  },
};

const path = 'src/data/species.ts';
let src = fs.readFileSync(path, 'utf8');

for (const [id, bg] of Object.entries(BG)) {
  if (src.includes(`id: '${id}'`) && src.includes(`backgroundImage:`)) {
    // already patched — replace existing block
    const blockRe = new RegExp(
      `(id: '${id.replace(/-/g, '\\-')}'[\\s\\S]*?backgroundImage:\\s*\\n\\s*')([^']+)('\\,\\s*\\n\\s*backgroundFit: )(')(cover|contain)(' as const,)`,
      'm'
    );
    if (blockRe.test(src)) {
      src = src.replace(blockRe, `$1${bg.url}$3$4${bg.fit}$6`);
      console.log('updated', id);
      continue;
    }
  }

  const re = new RegExp(
    `(id: '${id.replace(/-/g, '\\-')}'[\\s\\S]*?image:\\s*\\n\\s*'[^']+',)(\\s*\\n)`,
    'm'
  );
  if (!re.test(src)) {
    console.log('MISS', id);
    continue;
  }
  src = src.replace(
    re,
    `$1$2    backgroundImage:$2      '${bg.url}',$2    backgroundFit: '${bg.fit}' as const,$2`
  );
  console.log('patched', id);
}

fs.writeFileSync(path, src);
