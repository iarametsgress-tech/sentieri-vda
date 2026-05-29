/**
 * Completa rapidamente GPX mancanti + sync coords per tutte le schede.
 * Uso: node scripts/quick-complete-maps.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const GPX_DIR = path.resolve('public/gpx');
const BASE = 'https://www.lovevda.it';

const AV2_TRACK = {
  'alta-via-2-tappa-1-courmayeur-rifugio-elisabetta': { pageId: 2976, path: 'courmayeur-rifugio-elisabetta-soldini' },
  'alta-via-2-tappa-2-rifugio-elisabetta-la-thuile': { pageId: 2985, path: 'rifugio-elisabetta-soldini-la-thuile' },
};

function haversineM(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
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

function syncEndpoints(trail, gpx) {
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
}

function interpolateGpx(name, start, end, steps = 32) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push({
      lat: start.lat + (end.lat - start.lat) * t,
      lng: start.lng + (end.lng - start.lng) * t,
    });
  }
  const trkpts = pts.map((c) => `      <trkpt lat="${c.lat.toFixed(6)}" lon="${c.lng.toFixed(6)}"></trkpt>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Sentieri VdA">
  <trk><name>${name}</name><trkseg>\n${trkpts}\n  </trkseg></trk>
</gpx>`;
}

async function fetchAv2Gpx(pageId, pagePath) {
  const url = `${BASE}/it/banca-dati/7/l-alta-via-n%C2%B0-2/valle-d-aosta/${pagePath}/${pageId}`;
  const html = await (await fetch(url)).text();
  const m = html.match(/percorsotracciato1\/(\d+)/);
  if (!m) return null;
  return (await fetch(`${BASE}/staticmap/percorsotracciato1/${m[1]}?estensione=gpx`)).text();
}

async function processTrail(trail) {
  const dest = path.join(GPX_DIR, `${trail.slug}.gpx`);
  let gpx = null;
  try {
    gpx = await fs.readFile(dest, 'utf8');
  } catch {
    gpx = null;
  }

  if (!gpx?.includes('<trkpt')) {
    const av2 = AV2_TRACK[trail.slug];
    if (av2) {
      gpx = await fetchAv2Gpx(av2.pageId, av2.path);
      console.log(`  ✓ lovevda ${trail.slug}`);
    }
    if (!gpx?.includes('<trkpt')) {
      gpx = interpolateGpx(trail.name_it, trail.start.coords, trail.end.coords);
      console.log(`  ~ interpolata ${trail.slug}`);
    }
    await fs.writeFile(dest, gpx);
  }

  syncEndpoints(trail, gpx);
  trail.gpx_path = `/gpx/${trail.slug}.gpx`;
}

async function main() {
  const basePath = path.resolve('src/data/trails.json');
  const routesPath = path.resolve('src/data/trails-routes.json');
  const base = JSON.parse(await fs.readFile(basePath, 'utf8'));
  const routes = JSON.parse(await fs.readFile(routesPath, 'utf8'));

  for (const t of base) await processTrail(t);
  for (const t of routes) await processTrail(t);

  await fs.writeFile(basePath, JSON.stringify(base, null, 2) + '\n');
  await fs.writeFile(routesPath, JSON.stringify(routes, null, 2) + '\n');
  console.log(`\n✓ ${base.length + routes.length} sentieri — GPX + coords aggiornati`);
}

main();
