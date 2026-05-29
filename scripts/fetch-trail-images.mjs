/**
 * Scarica una foto Wikimedia Commons unica per ogni tappa.
 * Uso: node scripts/fetch-trail-images.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const OUT = path.resolve('public/trails');
const UA = 'SentieriVda/1.0 (https://sentieri-vda.vercel.app)';

/** Override curati (filename Commons verificato) — priorità massima */
const CURATED = {
  'alta-via-1-tappa-1-donnas-perloz': 'Donnas_dal_bec_di_nona_color.jpg',
  'alta-via-1-tappa-16-rifugio-frassati-rifugio-bonatti':
    'Grandes_Jorasses_-_Val_Ferret,_Courmayeur,_Aosta,_Italy_-_August_8,_2016.jpg',
  'alta-via-1-tappa-17-rifugio-bonatti-courmayeur': 'Monte_Bianco_dalla_Val_Ferret.jpg',
  'tour-rifugio-bonatti': 'Rifugio Walter Bonatti Refuge.jpg',
  'lago-djouan-cogne': 'Stambecchi_nel_Parco_Nazionale_del_Gran_Paradiso.jpg',
  'alta-via-2-tappa-1-courmayeur-rifugio-elisabetta': 'Rifugio Elisabetta CAI.JPG',
  'tour-mont-blanc-tappa-2-rifugio-bertone-rifugio-bonatti':
    'Rifugio Bonatti - Val Ferret, Courmayeur, Aosta, Italia - 8 Agosto 2016.jpg',
  'alta-via-1-tappa-2-perloz-rifugio-coda': 'PerlozAug032024 03.jpg',
  'alta-via-2-tappa-7-rhemes-notre-dame-eaux-rousses':
    'Da Eaux Rousses a Orvieilles, Valsavarenche 02.JPG',
  'alta-via-2-tappa-13-champorcher-crest-damon': 'Champorcher abc4.JPG',
  'tour-monte-rosa-tappa-2-rifugio-gabiet-colle-teodulo': 'Colle del Teodulo 001.jpg',
  'tour-monte-rosa-tappa-3-valtournenche-champoluc': 'Monte Rosa versante Champoluc.JPG',
  'tour-cervino-tappa-2-rifugio-duca-orionde': 'Breuil-Cervinia panorama.jpg',
  'tour-rutor-tappa-1-la-thuile-rifugio-deffeyes': 'La Thuile-Rifugio Deffeyes.jpg',
  'tour-gran-paradiso-tappa-5-rifugio-vittorio-sella-cogne': 'Cogne - Gran Paradiso.jpg',
  'tour-cervino-tappa-1-breuil-rifugio-duca-abruzzi': 'Matterhorn_-_Breuil-Cervinia.jpg',
  'tour-gran-combin-tappa-2-rifugio-prarayer-col-gran-san-bernardo':
    'Colle_del_Gran_San_Bernardo.jpg',
};

function wikiFileUrl(filename) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1600`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function md5(buf) {
  return crypto.createHash('md5').update(buf).digest('hex');
}

function cleanPlace(name) {
  return name
    .replace(/^Rifugio\s+/i, '')
    .replace(/^Colle del?\s+/i, 'Col ')
    .replace(/^Lago\s+/i, 'Lake ')
    .trim();
}

function searchQueries(trail) {
  const end = cleanPlace(trail.end.name);
  const start = cleanPlace(trail.start.name);
  const valley = trail.valley;
  const tag = trail.tags.find((t) => t.startsWith('alta-via') || t.startsWith('tour-')) ?? '';

  const q = new Set();
  q.add(`${end} Aosta Valley`);
  q.add(`${end} Valle d'Aosta`);
  if (start !== end) q.add(`${start} ${end} hiking`);
  q.add(`${valley} Alps`);
  if (tag.includes('mont-blanc') || valley.includes('Ferret')) {
    q.add('Val Ferret Mont Blanc');
  }
  if (tag.includes('monte-rosa') || valley.includes('Lys')) {
    q.add('Gressoney Monte Rosa');
  }
  if (tag.includes('cervino')) q.add('Cervino Matterhorn');
  if (tag.includes('gran-paradiso') || valley.includes('Cogne')) {
    q.add('Gran Paradiso National Park');
  }
  if (tag.includes('rutor') || valley.includes('Thuile')) q.add('Rutor glacier La Thuile');
  if (tag.includes('gran-combin') || valley.includes('Valpelline')) q.add('Valpelline Alps');
  if (end.includes('Donnas') || start.includes('Donnas')) q.add('Donnas Aosta Valley');
  if (end.includes('Champorcher') || start.includes('Champorcher')) q.add('Champorcher valley');
  if (end.includes('Oyace') || start.includes('Oyace')) q.add('Oyace Valpelline');
  if (end.includes('Ollomont')) q.add('Ollomont Valpelline');
  if (end.includes('Cogne')) q.add('Cogne Valnontey');
  if (end.includes('Djouan') || end.includes('Lauson')) q.add('Lago Lauson Gran Paradiso');
  if (end.includes('Barmasse') || start.includes('Barmasse')) q.add('Valtournenche Barmasse');
  if (end.includes('Cuney') || start.includes('Cuney')) q.add('Oratorio di Cuney');
  if (end.includes('Tournalin')) q.add('Grand Tournalin');
  if (end.includes('Champillon')) q.add('Colle di Champillon');
  if (end.includes('Frassati')) q.add('Saint-Rhémy-en-Bosses');
  if (end.includes('Bertone')) q.add('Rifugio Bertone Val Ferret');
  if (end.includes('Elena')) q.add('Rifugio Elena Val Ferret');
  if (end.includes('Elisabetta')) q.add('Rifugio Elisabetta Val Veny');
  if (end.includes('Gabiet')) q.add('Rifugio Gabiet Gressoney');
  if (end.includes('Teodulo') || end.includes('Theodul')) q.add('Colle Teodulo');
  if (end.includes('Abruzzi') || end.includes('Oriond')) q.add('Cervino high route');
  if (end.includes('Prarayer')) q.add('Rifugio Prarayer Gran Combin');
  if (end.includes('Deffeyes') || end.includes('Rutor')) q.add('Lago Rutor');
  if (end.includes('Verney')) q.add('Rifugio Verney Rutor');
  if (end.includes('Sella') && valley.includes('Valsavarenche')) q.add('Rifugio Vittorio Sella');
  if (end.includes('Berdzé') || end.includes('Berdze')) q.add('Rifugio Sogno di Berdzé');
  if (end.includes('Dondena')) q.add('Rifugio Dondena');
  if (end.includes('Épée') || end.includes('Epee')) q.add('Rifugio Chalet de l Epée');
  if (end.includes('Promoud') || end.includes('Planaval')) q.add('Valgrisenche');
  if (end.includes('Rhêmes') || end.includes('Rhemes')) q.add('Rhêmes-Notre-Dame');
  if (end.includes('Eaux-Rousses') || end.includes('Eaux Rousses')) q.add('Valsavarenche');
  if (end.includes('Niel') || start.includes('Niel')) q.add('Niel Gressoney');
  if (end.includes('Barma') || end.includes('Coda')) q.add('Ayas valley Aosta');
  if (end.includes('Perloz') || start.includes('Perloz')) q.add('Perloz Aosta');
  if (end.includes('Breuil') || start.includes('Breuil')) q.add('Breuil-Cervinia');

  return [...q];
}

async function commonsSearch(query, usedTitles) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '12',
    prop: 'imageinfo',
    iiprop: 'url|mime|size',
    iiurlwidth: '1600',
    format: 'json',
    origin: '*',
  });

  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': UA },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data.query?.pages ?? {});

  for (const page of pages) {
    if (usedTitles.has(page.title)) continue;
    const info = page.imageinfo?.[0];
    if (!info?.thumburl) continue;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(info.mime)) continue;
    if ((info.width ?? 0) < 640) continue;
    if (/logo|icon|map|flag|coat|diagram|schema|locator/i.test(page.title)) continue;
    if (
      /stazione|train|binari|B737|aerial view|motoslitte|skiers waiting|plant in|oropa da pietra|national map|locator/i.test(
        page.title,
      )
    )
      continue;
    return { title: page.title, url: info.thumburl };
  }
  return null;
}

async function downloadUrl(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/*' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error('file troppo piccolo');
  await fs.writeFile(dest, buf);
  return buf;
}

async function downloadWikiFile(filename, dest) {
  return downloadUrl(wikiFileUrl(filename), dest);
}

async function resolveImage(trail, usedTitles, usedHashes) {
  if (CURATED[trail.slug]) {
    const buf = await downloadWikiFile(CURATED[trail.slug], path.join(OUT, `${trail.slug}.jpg.tmp`));
    const hash = md5(buf);
    if (!usedHashes.has(hash)) {
      usedTitles.add(`File:${CURATED[trail.slug]}`);
      usedHashes.add(hash);
      return {
        buf,
        source: `curated:${CURATED[trail.slug]}`,
        heroUrl: wikiFileUrl(CURATED[trail.slug]),
      };
    }
  }

  for (const query of searchQueries(trail)) {
    await sleep(350);
    const hit = await commonsSearch(query, usedTitles);
    if (!hit) continue;
    try {
      const buf = await downloadUrl(hit.url, path.join(OUT, `${trail.slug}.jpg.tmp`));
      const hash = md5(buf);
      if (usedHashes.has(hash)) continue;
      usedTitles.add(hit.title);
      usedHashes.add(hash);
      return { buf, source: `commons:${hit.title}`, heroUrl: hit.url };
    } catch {
      /* try next */
    }
  }

  return null;
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const basePath = path.resolve('src/data/trails.json');
  const routesPath = path.resolve('src/data/trails-routes.json');
  const baseTrails = JSON.parse(await fs.readFile(basePath, 'utf8'));
  const routeTrails = JSON.parse(await fs.readFile(routesPath, 'utf8'));
  const trails = [...baseTrails, ...routeTrails];

  const usedTitles = new Set();
  const usedHashes = new Set();
  let ok = 0;
  let fail = 0;

  for (const trail of trails) {
    const dest = path.join(OUT, `${trail.slug}.jpg`);
    const tmp = `${dest}.tmp`;
    process.stdout.write(`→ ${trail.slug} … `);

    try {
      const result = await resolveImage(trail, usedTitles, usedHashes);
      if (!result) throw new Error('nessuna immagine unica trovata');
      await fs.writeFile(dest, result.buf);
      await fs.rm(tmp, { force: true });
      trail.image = `/trails/${trail.slug}.jpg`;
      trail.hero_image = result.heroUrl;
      console.log(`OK (${result.source.slice(0, 50)})`);
      ok++;
    } catch (e) {
      await fs.rm(tmp, { force: true });
      console.log(`FAIL — ${e.message}`);
      fail++;
    }
  }

  await fs.writeFile(basePath, JSON.stringify(baseTrails, null, 2) + '\n');
  await fs.writeFile(routesPath, JSON.stringify(routeTrails, null, 2) + '\n');

  // Verifica unicità
  const hashes = new Map();
  for (const t of trails) {
    try {
      const buf = await fs.readFile(path.join(OUT, `${t.slug}.jpg`));
      const h = md5(buf);
      if (!hashes.has(h)) hashes.set(h, []);
      hashes.get(h).push(t.slug);
    } catch {
      /* skip */
    }
  }
  const dups = [...hashes.values()].filter((s) => s.length > 1);
  console.log(`\n✓ ${ok} foto, ${fail} errori`);
  if (dups.length) {
    console.warn(`⚠ ${dups.length} gruppi duplicati rimasti:`);
    dups.forEach((g) => console.warn(' ', g.join(', ')));
  } else {
    console.log('✓ Tutte le foto sono uniche');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
