/**
 * Corregge foto duplicate o irrilevanti con immagini Commons curate per tappa.
 * Uso: node scripts/fix-stage-images.mjs [slug...]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const OUT = path.resolve('public/trails');
const UA = 'SentieriVda/1.0 (https://sentieri-vda.vercel.app)';
const WIDTH = 1920;

/** slug → filename Commons (priorità decrescente) — solo foto pertinenti al percorso */
const FIXES = {
  'alta-via-1-tappa-9-valtournenche-rifugio-barmasse': [
    'Rifugio Barmasse - Lac de Cortinaz.jpg',
    'Rifugio Jean Barmasse.jpg',
  ],
  'alta-via-1-tappa-12-oyace-ollomont': [
    'OllomontAug262024 01.jpg',
    'OllomontAug262024 02.jpg',
    'ISS067-E-152527 - View of Alps, Valpelline valley, Lac de Place Moulin, sidevalley Val d Ollomont, glaciers (cropped).jpg',
  ],
  'tour-mont-blanc-tappa-1-courmayeur-rifugio-bertone': [
    'Bertone1.jpg',
    'Rif bertone vvv1.JPG',
    'Col Monte Della Saxe 04.JPG',
  ],
  'tour-rutor-tappa-1-la-thuile-rifugio-deffeyes': [
    'La Thuile-Rifugio Deffeyes.jpg',
    'RifugioDeffeyes20161001.jpg',
  ],
  'tour-rutor-tappa-2-rifugio-deffeyes-lago-rutor': [
    'Lac du Ruitor @ Lancebranlette.jpg',
    'Gabinio.Grand Assaly E Lago Del Rutor. Valle Di Aosta-Il Grande Assaly Visto Da Nord, Dal Lago Del Ruitor 18A20.jpg',
    'Gabinio.Lago. Valle Di Aosta-Lago Del Rutor 18A63.jpg',
  ],
  'alta-via-2-tappa-7-rhemes-notre-dame-eaux-rousses': [
    'Da Eaux Rousses a Orvieilles, Valsavarenche 02.JPG',
    'Da Eaux Rousses a Orvieilles, Valsavarenche 01.JPG',
    'Valsavarenche - Gran Paradiso.jpg',
  ],
  'alta-via-2-tappa-13-champorcher-crest-damon': [
    'Champorcher abc4.JPG',
    'Champorcher.JPG',
    'Champorcher - Comune di Champorcher - 2023-09-27 17-49-53 001.jpg',
  ],
  'tour-mont-blanc-tappa-2-rifugio-bertone-rifugio-bonatti': [
    'Rifugio Bonatti - Val Ferret, Courmayeur, Aosta, Italia - 8 Agosto 2016.jpg',
    'Dal Rifugio Bonatti - Val Ferret, Courmayeur, Aosta, Italia - 8 Agosto 2016.jpg',
    'Bertone1.jpg',
  ],
  'tour-monte-rosa-tappa-2-rifugio-gabiet-colle-teodulo': [
    'Colle del Teodulo 001.jpg',
    'Theodulpass.JPG',
    'Passo-Teodulo.jpg',
  ],
  'tour-monte-rosa-tappa-3-valtournenche-champoluc': [
    'Monte Rosa versante Champoluc.JPG',
    'Monte Rosa Champoluc face.jpg',
  ],
  'tour-cervino-tappa-2-rifugio-duca-orionde': [
    'Matterhorn from Schwarzsee.jpg',
    'Cervino da Breuil.jpg',
    'Breuil-Cervinia panorama.jpg',
  ],
  'tour-gran-combin-tappa-3-col-gran-san-bernardo-combin-tsessione': [
    'Combin de Grafeneire.jpg',
    'Gran Combin from Valpelline.jpg',
    'Aosta and mountains.jpg',
  ],
  'tour-gran-paradiso-tappa-5-rifugio-vittorio-sella-cogne': [
    'Cogne inv 1.jpg',
    'Cogne - Gran Paradiso.jpg',
    'Parco Nazionale del Gran Paradiso - Cogne.jpg',
  ],
};

/** PNG locali già verificati per tappa (priorità assoluta) */
const LOCAL_PNG = {
  'alta-via-1-tappa-2-perloz-rifugio-coda': 'alta-via-1-tappa-2-perloz-rifugio-coda.png',
  'alta-via-1-tappa-3-rifugio-coda-rifugio-barma': 'alta-via-1-tappa-3-rifugio-coda-rifugio-barma.png',
  'alta-via-1-tappa-4-rifugio-barma-niel': 'alta-via-1-tappa-4-rifugio-barma-niel.png',
};

const REJECT = /plastico|model|schema|diagram|locator|logo|icon|map flag|Mezzalama|Ottorino/i;

function wikiFileUrl(filename) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${WIDTH}`;
}

function md5(buf) {
  return crypto.createHash('md5').update(buf).digest('hex');
}

async function downloadWiki(filename) {
  if (REJECT.test(filename)) throw new Error('filename rejected');
  const res = await fetch(wikiFileUrl(filename), {
    headers: { 'User-Agent': UA, Accept: 'image/*' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 12000) throw new Error('troppo piccolo');
  return buf;
}

function findTrail(slug, base, routes) {
  return base.find((t) => t.slug === slug) ?? routes.find((t) => t.slug === slug);
}

async function removeDerived(slug) {
  for (const ext of ['jpg', 'jpeg', 'webp']) {
    await fs.rm(path.join(OUT, `${slug}.${ext}`), { force: true });
  }
}

async function main() {
  const only = process.argv.slice(2);
  const basePath = path.resolve('src/data/trails.json');
  const routesPath = path.resolve('src/data/trails-routes.json');
  const baseTrails = JSON.parse(await fs.readFile(basePath, 'utf8'));
  const routeTrails = JSON.parse(await fs.readFile(routesPath, 'utf8'));
  const allTrails = [...baseTrails, ...routeTrails];

  const usedHashes = new Map();
  for (const t of allTrails) {
    for (const ext of ['jpg', 'png', 'webp']) {
      try {
        const buf = await fs.readFile(path.join(OUT, `${t.slug}.${ext}`));
        usedHashes.set(md5(buf), t.slug);
      } catch {
        /* skip */
      }
    }
  }

  const slugsToFix = [
    ...new Set([...Object.keys(FIXES), ...Object.keys(LOCAL_PNG), 'tour-rifugio-bonatti']),
  ].filter((slug) => only.length === 0 || only.includes(slug));

  for (const slug of slugsToFix) {
    const trail = findTrail(slug, baseTrails, routeTrails);
    if (!trail) continue;

    process.stdout.write(`→ ${slug} … `);
    await removeDerived(slug);

    try {
      let buf;
      let heroUrl;
      let ext = 'jpg';
      let source;

      if (LOCAL_PNG[slug]) {
        const pngPath = path.join(OUT, LOCAL_PNG[slug]);
        buf = await fs.readFile(pngPath);
        heroUrl = `/trails/${LOCAL_PNG[slug]}`;
        ext = 'png';
        source = `local:${LOCAL_PNG[slug]}`;
      } else if (slug === 'tour-rifugio-bonatti') {
        buf = await downloadWiki('Rifugio Walter Bonatti Refuge.jpg');
        heroUrl = wikiFileUrl('Rifugio Walter Bonatti Refuge.jpg');
        source = 'curated:Rifugio Walter Bonatti Refuge.jpg';
      } else {
        const candidates = FIXES[slug] ?? [];
        let picked = null;
        for (const filename of candidates) {
          try {
            const candidate = await downloadWiki(filename);
            const hash = md5(candidate);
            const owner = usedHashes.get(hash);
            if (owner && owner !== slug) continue;
            picked = { buf: candidate, filename, hash };
            break;
          } catch {
            /* next */
          }
        }
        if (!picked) throw new Error('nessun file Commons valido');
        buf = picked.buf;
        heroUrl = wikiFileUrl(picked.filename);
        source = `curated:${picked.filename}`;
      }

      const hash = md5(buf);
      const owner = usedHashes.get(hash);
      if (owner && owner !== slug) {
        throw new Error(`duplicato di ${owner}`);
      }
      usedHashes.set(hash, slug);

      const dest = path.join(OUT, `${slug}.${ext}`);
      await fs.writeFile(dest, buf);

      const localPath = `/trails/${slug}.${ext}`;
      trail.image = localPath;
      trail.hero_image = localPath;

      console.log(`OK (${source})`);
    } catch (e) {
      console.log(`FAIL — ${e.message}`);
    }
  }

  await fs.writeFile(basePath, JSON.stringify(baseTrails, null, 2) + '\n');
  await fs.writeFile(routesPath, JSON.stringify(routeTrails, null, 2) + '\n');

  const byHash = new Map();
  for (const t of allTrails) {
    for (const ext of ['jpg', 'png', 'webp']) {
      try {
        const buf = await fs.readFile(path.join(OUT, `${t.slug}.${ext}`));
        const h = md5(buf);
        if (!byHash.has(h)) byHash.set(h, []);
        byHash.get(h).push(`${t.slug}.${ext}`);
      } catch {
        /* skip */
      }
    }
  }
  const dups = [...byHash.values()].filter((g) => g.length > 1);
  console.log(`\nUniche: ${byHash.size}/${allTrails.length}`);
  if (dups.length) {
    console.warn('Duplicati:');
    dups.forEach((g) => console.warn(' ', g.join(' | ')));
  } else {
    console.log('✓ Tutte le foto sono uniche');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
