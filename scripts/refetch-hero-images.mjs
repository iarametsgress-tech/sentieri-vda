/**
 * Re-scarica hero/card sotto 1600px (e file corrotti) da Wikimedia Commons a 1920px.
 * Uso: node scripts/refetch-hero-images.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const OUT = path.resolve('public/trails');
const UA = 'SentieriVda/1.0 (https://sentieri-vda.vercel.app)';
const WIDTH = 1920;

/** slug → filename Commons (fallback in ordine) */
const REFETCH = {
  'alta-via-1-tappa-2-perloz-rifugio-coda': ['PerlozAug032024 03.jpg', 'Perloz da Ponte.jpg'],
  'alta-via-1-tappa-3-rifugio-coda-rifugio-barma': [
    'Antagnod.jpg',
    'Val d Ayas.jpg',
    'Plastico villaggio walser crest ad ayas 235.jpg',
  ],
  'alta-via-1-tappa-4-rifugio-barma-niel': [
    'Rifugio Ottorino Mezzalama.jpg',
    'Colle barma da monte rosso.jpg',
  ],
  'alta-via-1-tappa-6-gressoney-saint-jean-rifugio-vieux-crest': [
    'Gressoney-Saint-Jean.jpg',
    'Lys Valley Gressoney.jpg',
    '0003 Il massiccio del Monte Rosa.jpg',
  ],
  'alta-via-1-tappa-7-rifugio-vieux-crest-rifugio-grand-tournalin': [
    'RifugioGrandTournalinAug212024 01.jpg',
    'Grand Tournalin dal colle Pinter.JPG',
    'Grand Tournalin 2022.jpg',
  ],
  'alta-via-1-tappa-9-valtournenche-rifugio-barmasse': [
    'Valtournenche e il Cervino.jpg',
    'Matterhorn from Valtournenche.jpg',
    'Breuil-Cervinia panorama.jpg',
  ],
  'alta-via-1-tappa-12-oyace-ollomont': [
    'Panorama di Valpelline 2.JPG',
    'Ollomont Val d Aosta.jpg',
    'Valpelline - Monte Emilius.jpg',
  ],
  'tour-mont-blanc-tappa-1-courmayeur-rifugio-bertone': [
    'Refuge Giorgio Bertone @ Mont de la Saxe.jpg',
    'Rif bertone vvv1.JPG',
    'Bertone1.jpg',
  ],
  'tour-monte-rosa-tappa-1-gressoney-rifugio-gabiet': [
    'Rifugio Gabiet.jpg',
    'Ghiacciaio del Lys.jpg',
    'Monte Rosa versante Champoluc.JPG',
  ],
  'tour-cervino-tappa-3-rifugio-orionde-colle-teodulo': [
    'Colle del Teodulo 001.jpg',
    'Theodulpass.JPG',
    'Passo-Teodulo.jpg',
  ],
  'tour-rutor-tappa-1-la-thuile-rifugio-deffeyes': [
    'RifugioDeffeyes20161001.jpg',
    'La Thuile-Rifugio Deffeyes 2.jpg',
    'La Thuile-Rifugio Deffeyes.jpg',
  ],
  'tour-rutor-tappa-2-rifugio-deffeyes-lago-rutor': [
    'La Thuile (Août 2025) - Le Rutor.jpg',
    'La Thuile-Rifugio Deffeyes 2.jpg',
  ],
  cervino: ['Matterhorn - Breuil-Cervinia.jpg', 'Matterhorn_-_Breuil-Cervinia.jpg'],
  courmayeur: [
    'Grandes Jorasses - Val Ferret, Courmayeur, Aosta, Italy - August 8, 2016.jpg',
    'Monte Bianco dalla Val Ferret.jpg',
  ],
  donnas: ['Donnas dal bec di nona color.jpg', 'Donnas_dal_bec_di_nona_color.jpg'],
  'gran-paradiso': [
    'The Gran Paradiso from the Pian di Nivolet (5567208979).jpg',
    'Cogne - Gran Paradiso.jpg',
  ],
  'grand-saint-bernard': ['Colle del Gran San Bernardo.jpg', 'Great St Bernard Pass.jpg'],
  gressoney: ['0003 Il massiccio del Monte Rosa.jpg', 'Monte Rosa versante Champoluc.JPG'],
  'monte-bianco': ['Monte Bianco dalla Val Ferret.jpg', 'Mont Blanc from Val Ferret.jpg'],
  'monte-rosa': ['Monte Rosa massif.jpg', '0003_Il_massiccio_del_Monte_Rosa.jpg'],
  'rifugio-bonatti': ['Rifugio Walter Bonatti Refuge.jpg'],
  valpelline: ['Valpelline 001.JPG', 'Alta Valpelline.JPG', 'Bionaz.JPG'],
};

function wikiFileUrl(filename) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${WIDTH}`;
}

function md5(buf) {
  return crypto.createHash('md5').update(buf).digest('hex');
}

async function downloadWiki(filename) {
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

async function removeOldAssets(slug) {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    await fs.rm(path.join(OUT, `${slug}.${ext}`), { force: true });
  }
}

async function main() {
  const only = process.argv.slice(2);
  const entries = Object.entries(REFETCH).filter(
    ([slug]) => only.length === 0 || only.includes(slug),
  );
  const basePath = path.resolve('src/data/trails.json');
  const routesPath = path.resolve('src/data/trails-routes.json');
  const baseTrails = JSON.parse(await fs.readFile(basePath, 'utf8'));
  const routeTrails = JSON.parse(await fs.readFile(routesPath, 'utf8'));

  const usedHashes = new Map();
  const results = [];

  for (const [slug, candidates] of entries) {
    process.stdout.write(`→ ${slug} … `);
    await removeOldAssets(slug);

    let picked = null;
    for (const filename of candidates) {
      try {
        const buf = await downloadWiki(filename);
        const hash = md5(buf);
        const owner = usedHashes.get(hash);
        if (owner && owner !== slug) continue;
        picked = { buf, filename, hash };
        break;
      } catch {
        /* next candidate */
      }
    }

    if (!picked) {
      console.log('FAIL — nessun file Commons valido');
      results.push({ slug, ok: false });
      continue;
    }

    usedHashes.set(picked.hash, slug);
    const dest = path.join(OUT, `${slug}.jpg`);
    await fs.writeFile(dest, picked.buf);

    const localPath = `/trails/${slug}.jpg`;
    const trail = findTrail(slug, baseTrails, routeTrails);
    if (trail) {
      trail.image = localPath;
      if (!String(trail.hero_image).startsWith('http')) {
        trail.hero_image = localPath;
      }
    }

    console.log(`OK (${picked.filename}, ${Math.round(picked.buf.length / 1024)} KB)`);
    results.push({ slug, ok: true, file: picked.filename });
  }

  await fs.writeFile(basePath, JSON.stringify(baseTrails, null, 2) + '\n');
  await fs.writeFile(routesPath, JSON.stringify(routeTrails, null, 2) + '\n');

  const ok = results.filter((r) => r.ok).length;
  console.log(`\n✓ ${ok}/${results.length} immagini riscaricate`);
  const fail = results.filter((r) => !r.ok);
  if (fail.length) {
    console.warn('Falliti:', fail.map((f) => f.slug).join(', '));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
