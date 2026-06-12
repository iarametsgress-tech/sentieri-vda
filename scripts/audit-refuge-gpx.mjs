/**
 * Audit: per ogni rifugio, verifica che i trail collegati abbiano GPX
 * e che la traccia passi vicino al rifugio (accesso "reale e corretto").
 * Uso: node scripts/audit-refuge-gpx.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const refuges = JSON.parse(fs.readFileSync('src/data/refuges.json', 'utf8'));
const GPX_DIR = path.resolve('public/gpx');

function haversineM(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function gpxPoints(file) {
  const gpx = fs.readFileSync(file, 'utf8');
  const pts = [];
  const re = /<trkpt\s+(?:lat="([^"]+)"\s+lon="([^"]+)"|lon="([^"]+)"\s+lat="([^"]+)")/g;
  let m;
  while ((m = re.exec(gpx)) !== null) {
    pts.push({ lat: m[1] ? +m[1] : +m[4], lng: m[2] ? +m[2] : +m[3] });
  }
  return pts;
}

const rows = [];
for (const r of refuges) {
  const trails = r.trails ?? [];
  if (!trails.length) {
    rows.push({ slug: r.slug, status: 'NO_TRAILS', detail: '' });
    continue;
  }
  let bestDist = Infinity;
  let totalPts = 0;
  const missing = [];
  for (const t of trails) {
    const f = path.join(GPX_DIR, `${t}.gpx`);
    if (!fs.existsSync(f)) {
      missing.push(t);
      continue;
    }
    const pts = gpxPoints(f);
    totalPts += pts.length;
    for (const p of pts) {
      const d = haversineM(r.coords, p);
      if (d < bestDist) bestDist = d;
    }
  }
  const status =
    missing.length === trails.length
      ? 'ALL_GPX_MISSING'
      : bestDist > 500
        ? 'TRACK_FAR'
        : 'OK';
  rows.push({
    slug: r.slug,
    status,
    detail: `minDist=${Math.round(bestDist)}m pts=${totalPts} trails=${trails.length}${missing.length ? ' missing=' + missing.join(',') : ''}`,
  });
}

const counts = {};
for (const row of rows) counts[row.status] = (counts[row.status] ?? 0) + 1;
console.log(counts);
for (const row of rows.filter((x) => x.status !== 'OK' && x.status !== 'NO_TRAILS')) {
  console.log(`${row.status}  ${row.slug}  ${row.detail}`);
}
console.log('--- NO_TRAILS:', rows.filter((x) => x.status === 'NO_TRAILS').length);
