/**
 * Riutilizza GPX ufficiali AV2 / sentieri buoni per tappe tour equivalenti.
 * Uso: node scripts/reuse-gpx-segments.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const GPX_DIR = path.resolve('public/gpx');

const REUSE = {
  'tour-gran-paradiso-tappa-3-lago-djouan-eaux-rousses':
    'alta-via-2-tappa-7-rhemes-notre-dame-eaux-rousses',
  'tour-gran-paradiso-tappa-4-eaux-rousses-rifugio-vittorio-sella':
    'alta-via-2-tappa-8-eaux-rousses-rifugio-vittorio-sella',
  'tour-gran-paradiso-tappa-5-rifugio-vittorio-sella-cogne':
    'alta-via-2-tappa-9-rifugio-vittorio-sella-cogne',
  'tour-rutor-tappa-1-la-thuile-rifugio-deffeyes':
    'alta-via-2-tappa-3-la-thuile-promoud',
  'tour-rutor-tappa-2-rifugio-deffeyes-lago-rutor':
    'alta-via-2-tappa-4-promoud-planaval',
  'tour-rutor-tappa-4-rifugio-verney-la-thuile':
    'alta-via-2-tappa-2-rifugio-elisabetta-la-thuile',
  'tour-mont-blanc-tappa-3-rifugio-bonatti-rifugio-elena':
    'tour-mont-blanc-tappa-2-rifugio-bertone-rifugio-bonatti',
  'tour-mont-blanc-tappa-4-rifugio-elena-col-seigne':
    'tour-mont-blanc-tappa-3-rifugio-bonatti-rifugio-elena',
  'tour-monte-rosa-tappa-4-breuil-gressoney':
    'tour-monte-rosa-tappa-3-valtournenche-champoluc',
  'tour-cervino-tappa-2-rifugio-duca-orionde':
    'tour-cervino-tappa-1-breuil-rifugio-duca-abruzzi',
  'tour-cervino-tappa-3-rifugio-orionde-colle-teodulo':
    'tour-cervino-tappa-1-breuil-rifugio-duca-abruzzi',
  'tour-gran-combin-tappa-3-col-gran-san-bernardo-combin-tsessione':
    'tour-gran-combin-tappa-2-rifugio-prarayer-col-gran-san-bernardo',
};

function haversineM(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function parseGpxPoints(gpx) {
  const points = [];
  const re = /<trkpt\s+(?:lat="([^"]+)"\s+lon="([^"]+)"|lon="([^"]+)"\s+lat="([^"]+)")[^>]*>([\s\S]*?)<\/trkpt>/g;
  let m;
  while ((m = re.exec(gpx)) !== null) {
    const lat = m[1] ? +m[1] : +m[4];
    const lng = m[2] ? +m[2] : +m[3];
    const eleM = m[5].match(/<ele>([^<]+)<\/ele>/);
    points.push({ lat, lng, ele: eleM ? +eleM[1] : null });
  }
  return points;
}

function syncTrail(trail, gpx) {
  const pts = parseGpxPoints(gpx);
  if (pts.length < 2) return;
  let first = pts[0];
  let last = pts[pts.length - 1];
  if (haversineM(trail.start.coords, last) + 500 < haversineM(trail.start.coords, first)) {
    [first, last] = [last, first];
  }
  trail.start.coords = { lat: +first.lat.toFixed(6), lng: +first.lng.toFixed(6) };
  trail.end.coords = { lat: +last.lat.toFixed(6), lng: +last.lng.toFixed(6) };
  if (first.ele != null) trail.start.elevation_m = Math.round(first.ele);
  if (last.ele != null) trail.end.elevation_m = Math.round(last.ele);
  trail.gpx_path = `/gpx/${trail.slug}.gpx`;
}

async function main() {
  const routesPath = path.resolve('src/data/trails-routes.json');
  const trails = JSON.parse(await fs.readFile(routesPath, 'utf8'));

  for (const [target, source] of Object.entries(REUSE)) {
    const trail = trails.find((t) => t.slug === target);
    if (!trail) continue;
    const gpx = await fs.readFile(path.join(GPX_DIR, `${source}.gpx`), 'utf8');
    await fs.writeFile(path.join(GPX_DIR, `${target}.gpx`), gpx);
    syncTrail(trail, gpx);
    console.log(`✓ ${target} ← ${source}`);
  }

  await fs.writeFile(routesPath, JSON.stringify(trails, null, 2) + '\n');
}

main();
