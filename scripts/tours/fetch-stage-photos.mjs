/**
 * Foto reali e geolocalizzate per ogni tappa tour da Wikimedia Commons.
 * Punto di ricerca: il punto più alto del GPX (di norma il colle) o, per le
 * tappe transfer, il punto medio. Licenze libere, credito completo, dedup.
 *
 * Uso: node scripts/tours/fetch-stage-photos.mjs [--force] [--only=slug]
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROUTES = 'src/data/trails-routes.json';
const FORCE = process.argv.includes('--force');
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];
const REDO = (process.argv.find((a) => a.startsWith('--redo='))?.split('=')[1] ?? '')
  .split(',')
  .filter(Boolean);
const BAN = (process.argv.find((a) => a.startsWith('--ban='))?.split('=')[1] ?? '')
  .toLowerCase()
  .split(',')
  .filter(Boolean);
const UA = { 'User-Agent': 'SentieriVdaBot/1.0 (https://sentierivda.it; foto tappe)' };

const trails = JSON.parse(fs.readFileSync(ROUTES, 'utf8'));
const usedPages = new Set();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function gpxHighPoint(slug) {
  const f = path.join('public/gpx', `${slug}.gpx`);
  if (!fs.existsSync(f)) return null;
  const gpx = fs.readFileSync(f, 'utf8');
  const re = /<trkpt lon="([^"]+)" lat="([^"]+)">(?:<ele>([^<]+)<\/ele>)?/g;
  let m;
  let best = null;
  let mid = null;
  const pts = [];
  while ((m = re.exec(gpx)) !== null) {
    const p = { lng: +m[1], lat: +m[2], ele: m[3] ? +m[3] : -1 };
    pts.push(p);
    if (!best || p.ele > best.ele) best = p;
  }
  if (!pts.length) return null;
  mid = pts[Math.floor(pts.length / 2)];
  return best && best.ele > 0 ? best : mid;
}

function stripHtml(s) {
  return (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

const BAD_NAME =
  /map|karte|carte|diagram|logo|plan_|scan|document|stele|plaque|targa|interno|inside|interieur|^File:360|[_ ]360[_ .]|iss0\d+-e|view of earth|bus station|bahnhof|gare |hotel|resort|wellness|apartment|appartment|spa[. ]|camera|zimmer|room/i;
const OK_LICENSE = /^(CC|Public domain|PDM|FAL|No restrictions)/i;

async function searchCommons(lat, lng, radius) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
    `&generator=geosearch&ggscoord=${lat}%7C${lng}&ggsradius=${radius}&ggslimit=50&ggsnamespace=6` +
    '&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=1800';
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000) });
  const data = await res.json();
  return Object.values(data?.query?.pages ?? {});
}

function pickCandidate(pages) {
  const cands = [];
  for (const p of pages) {
    if (usedPages.has(p.pageid)) continue;
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    if (!/\.jpe?g$/i.test(p.title)) continue;
    if (BAD_NAME.test(p.title)) continue;
    if (BAN.some((w) => p.title.toLowerCase().includes(w))) continue;
    if ((ii.width ?? 0) < 1100 || (ii.height ?? 0) < 700) continue;
    if ((ii.width ?? 0) < (ii.height ?? 0)) continue; // preferisci orizzontali
    const lic = ii.extmetadata?.LicenseShortName?.value ?? '';
    if (!OK_LICENSE.test(stripHtml(lic))) continue;
    cands.push({ p, ii, score: (ii.width ?? 0) * (ii.height ?? 0) });
  }
  cands.sort((a, b) => b.score - a.score);
  return cands[0] ?? null;
}

let done = 0;
let skipped = 0;
const misses = [];

for (const t of trails) {
  if (!t.tags.includes('tour')) continue;
  if (ONLY && t.slug !== ONLY) continue;
  if (REDO.length && !REDO.includes(t.slug)) continue;

  const target = `/trails/${t.slug}.webp`;
  const file = path.join('public', target.slice(1));
  if (!FORCE && t.image === target && fs.existsSync(file) && t.image_credit) {
    skipped++;
    continue;
  }

  const pt =
    gpxHighPoint(t.slug) ??
    {
      lat: (t.start.coords.lat + t.end.coords.lat) / 2,
      lng: (t.start.coords.lng + t.end.coords.lng) / 2,
    };

  let cand = null;
  for (const radius of [2500, 5000, 9000]) {
    try {
      const pages = await searchCommons(pt.lat, pt.lng, radius);
      cand = pickCandidate(pages);
      if (cand) break;
    } catch (e) {
      console.log(`  err ${e.message}`);
    }
    await sleep(400);
  }

  if (!cand) {
    console.log(`✗ ${t.slug} — nessuna foto adatta`);
    misses.push(t.slug);
    continue;
  }

  try {
    const src = cand.ii.thumburl ?? cand.ii.url;
    const res = await fetch(src, { headers: UA, signal: AbortSignal.timeout(60000) });
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(file);
    usedPages.add(cand.p.pageid);

    const meta = cand.ii.extmetadata ?? {};
    const artist = stripHtml(meta.Artist?.value) || 'autore sconosciuto';
    const license = stripHtml(meta.LicenseShortName?.value);
    t.image = target;
    t.hero_image = target;
    t.image_credit = `${artist} · Wikimedia Commons · ${license}`.slice(0, 160);
    t.image_source = cand.ii.descriptionurl ?? cand.ii.url;
    done++;
    console.log(`✓ ${t.slug} ← ${cand.p.title.replace('File:', '').slice(0, 60)} (${license})`);
  } catch (e) {
    console.log(`✗ ${t.slug} download: ${e.message}`);
    misses.push(t.slug);
  }
  await sleep(600);
}

fs.writeFileSync(ROUTES, JSON.stringify(trails, null, 2) + '\n');
console.log(`\n✓ ${done} foto nuove, ${skipped} già ok, ${misses.length} senza foto: ${misses.join(', ')}`);
