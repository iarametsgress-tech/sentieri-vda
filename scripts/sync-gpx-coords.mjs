/**
 * Sincronizza start/end da GPX esistenti (senza riscrivere le tracce).
 * Uso: node scripts/sync-gpx-coords.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const GPX_DIR = path.resolve('public/gpx');

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
  if (pts.length < 2) return false;
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
  return true;
}

async function main() {
  const files = ['src/data/trails.json', 'src/data/trails-routes.json'];
  let synced = 0;
  let skipped = 0;

  for (const file of files) {
    const p = path.resolve(file);
    const trails = JSON.parse(await fs.readFile(p, 'utf8'));
    for (const trail of trails) {
      const gpxPath = path.join(GPX_DIR, `${trail.slug}.gpx`);
      try {
        const gpx = await fs.readFile(gpxPath, 'utf8');
        if (syncTrail(trail, gpx)) synced++;
        else skipped++;
      } catch {
        skipped++;
      }
    }
    await fs.writeFile(p, JSON.stringify(trails, null, 2) + '\n');
  }

  console.log(`✓ ${synced} sentieri sincronizzati, ${skipped} saltati`);
}

main();
