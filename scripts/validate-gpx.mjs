/**
 * Valida le tracce GPX rispetto ai dati dei sentieri.
 * - esistenza file, n. punti
 * - vicinanza start/end ai waypoint del sentiero
 * - duplicati (stessa traccia su tappe diverse dello stesso tour)
 * Uso: node scripts/validate-gpx.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const GPX_DIR = path.resolve('public/gpx');

function loadTrails() {
  const all = [];
  for (const f of ['src/data/trails.json', 'src/data/trails-routes.json']) {
    const p = path.resolve(f);
    if (fs.existsSync(p)) all.push(...JSON.parse(fs.readFileSync(p, 'utf8')));
  }
  return all;
}

function haversineM(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function parsePoints(gpx) {
  const pts = [];
  const re = /<trkpt\s+(?:lat="([^"]+)"\s+lon="([^"]+)"|lon="([^"]+)"\s+lat="([^"]+)")/g;
  let m;
  while ((m = re.exec(gpx)) !== null) pts.push({ lat: m[1] ? +m[1] : +m[4], lng: m[2] ? +m[2] : +m[3] });
  return pts;
}

const trails = loadTrails();
const byTour = new Map();
const hashByTrack = new Map();
let problems = 0;
let ok = 0;

for (const trail of trails) {
  const file = path.join(GPX_DIR, `${trail.slug}.gpx`);
  if (!fs.existsSync(file)) {
    if (trail.is_transfer_stage) {
      console.log(`· ${trail.slug}: tappa di trasferimento (nessuna traccia, atteso)`);
      ok++;
    } else {
      console.log(`✗ ${trail.slug}: GPX mancante`);
      problems++;
    }
    continue;
  }
  const gpx = fs.readFileSync(file, 'utf8');
  const pts = parsePoints(gpx);
  const issues = [];
  if (pts.length < 10) issues.push(`solo ${pts.length} punti`);

  if (pts.length >= 2 && trail.start?.coords && trail.end?.coords) {
    const first = pts[0];
    const last = pts[pts.length - 1];
    const dStart = Math.min(
      haversineM(trail.start.coords, first) + haversineM(trail.end.coords, last),
      haversineM(trail.start.coords, last) + haversineM(trail.end.coords, first)
    );
    if (dStart > 1600) issues.push(`endpoint lontani (${Math.round(dStart)} m totali)`);
  }

  // duplicati per tour
  const tourTag = (trail.tags || []).find((t) => t.startsWith('tour-') && t !== 'tour');
  if (tourTag) {
    const hash = crypto.createHash('md5').update(pts.map((p) => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`).join(';')).digest('hex');
    if (!byTour.has(tourTag)) byTour.set(tourTag, new Map());
    const seen = byTour.get(tourTag);
    if (seen.has(hash)) issues.push(`traccia DUPLICATA di ${seen.get(hash)}`);
    else seen.set(hash, trail.slug);
  }

  if (issues.length) {
    console.log(`✗ ${trail.slug}: ${issues.join('; ')}`);
    problems++;
  } else {
    ok++;
  }
}

console.log(`\n${ok} ok, ${problems} con problemi su ${trails.length} sentieri.`);
process.exit(problems > 0 ? 1 : 0);
