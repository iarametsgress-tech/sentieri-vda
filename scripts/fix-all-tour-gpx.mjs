/**
 * Ripara GPX interpolati per tutte le tappe tour in trails-routes.json.
 * Uso: node scripts/fix-all-tour-gpx.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const GPX_DIR = path.resolve('public/gpx');
const OVERPASS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];

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
  const re = /<trkpt\s+(?:lat="([^"]+)"\s+lon="([^"]+)"|lon="([^"]+)"\s+lat="([^"]+)")/g;
  let m;
  while ((m = re.exec(gpx)) !== null) {
    points.push({ lat: m[1] ? +m[1] : +m[4], lng: m[2] ? +m[2] : +m[3] });
  }
  return points;
}

function isBadGpx(gpx) {
  const pts = parseGpxPoints(gpx);
  if (pts.length <= 80) return true;
  if (gpx.includes('creator="Sentieri VdA"') && pts.length <= 100) return true;
  return false;
}

function waysToGpx(name, coords) {
  const trkpts = coords
    .map((c) => `      <trkpt lat="${c.lat.toFixed(6)}" lon="${c.lng.toFixed(6)}"></trkpt>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Sentieri VdA / OpenStreetMap">
  <metadata><name>${name}</name><desc>Traccia da OpenStreetMap — verificare sul terreno</desc></metadata>
  <trk><name>${name}</name><trkseg>\n${trkpts}\n  </trkseg></trk>\n</gpx>`;
}

async function overpass(query) {
  for (const url of OVERPASS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'SentieriVdaBot/1.0 (https://sentieri-vda.vercel.app)',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(25000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      return (data.elements ?? []).filter((e) => e.type === 'way' && e.geometry?.length > 5);
    } catch {
      /* retry */
    }
  }
  return [];
}

function wayLength(way) {
  return way.geometry.reduce((acc, p, i) => {
    if (i === 0) return 0;
    const prev = way.geometry[i - 1];
    return acc + haversineM({ lat: prev.lat, lng: prev.lon }, { lat: p.lat, lng: p.lon });
  }, 0);
}

function orientWay(way, start, end) {
  const first = way.geometry[0];
  const last = way.geometry[way.geometry.length - 1];
  const scoreNormal =
    haversineM(start, { lat: first.lat, lng: first.lon }) +
    haversineM(end, { lat: last.lat, lng: last.lon });
  const scoreReversed =
    haversineM(start, { lat: last.lat, lng: last.lon }) +
    haversineM(end, { lat: first.lat, lng: first.lon });
  if (scoreReversed < scoreNormal) {
    return { ...way, geometry: [...way.geometry].reverse() };
  }
  return way;
}

function snapToNetwork(ways, point, maxDist = 600) {
  let best = point;
  let bestDist = maxDist;
  for (const way of ways) {
    for (const p of way.geometry) {
      const d = haversineM(point, { lat: p.lat, lng: p.lon });
      if (d < bestDist) {
        bestDist = d;
        best = { lat: p.lat, lng: p.lon };
      }
    }
  }
  return best;
}

function findGreedyPath(ways, start, end) {
  const path = [];
  let current = snapToNetwork(ways, start);
  const used = new Set();

  for (let step = 0; step < 30 && haversineM(current, end) > 180; step++) {
    let best = null;
    let bestScore = Infinity;
    const connectThreshold = step === 0 ? 650 : 220;

    for (const way of ways) {
      if (used.has(way.id)) continue;
      const oriented = orientWay(way, current, end);
      const first = oriented.geometry[0];
      const last = oriented.geometry[oriented.geometry.length - 1];
      const dStart = haversineM(current, { lat: first.lat, lng: first.lon });
      if (dStart > connectThreshold) continue;
      const dEnd = haversineM(end, { lat: last.lat, lng: last.lon });
      const len = wayLength(oriented);
      const score = dStart + dEnd - len * 0.003;
      if (score < bestScore) {
        bestScore = score;
        best = oriented;
      }
    }
    if (!best) break;
    used.add(best.id);
    const seg = best.geometry.map((p) => ({ lat: p.lat, lng: p.lon }));
    if (!path.length) path.push(...seg);
    else path.push(...seg.slice(1));
    current = path[path.length - 1];
  }
  return path;
}

function osmSearchTerms(trail) {
  const terms = new Set();
  for (const label of [trail.start.name, trail.end.name, trail.valley]) {
    for (const part of label.split(/[\s,→\-/]+/)) {
      const clean = part.replace(/['']/g, '').trim();
      if (clean.length >= 4) terms.add(clean);
    }
  }
  if (trail.tags.includes('tour-mont-blanc')) {
    terms.add('TMB');
    terms.add('Tour du Mont Blanc');
    terms.add('Val Ferret');
  }
  if (trail.tags.includes('tour-monte-rosa')) terms.add('Monte Rosa');
  if (trail.tags.includes('tour-cervino')) {
    terms.add('Cervino');
    terms.add('Matterhorn');
  }
  if (trail.tags.includes('tour-gran-paradiso')) terms.add('Gran Paradiso');
  if (trail.tags.includes('tour-rutor')) terms.add('Rutor');
  if (trail.tags.includes('tour-gran-combin')) terms.add('Gran Combin');
  return [...terms].slice(0, 12);
}

async function fetchOsmTrack(trail) {
  const start = trail.start.coords;
  const end = trail.end.coords;
  const terms = osmSearchTerms(trail);
  const pad = Math.max(0.04, haversineM(start, end) / 111000 / 2 + 0.025);
  const south = Math.min(start.lat, end.lat) - pad;
  const north = Math.max(start.lat, end.lat) + pad;
  const west = Math.min(start.lng, end.lng) - pad;
  const east = Math.max(start.lng, end.lng) + pad;
  const regex = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

  let ways = await overpass(`[out:json][timeout:20];
(
  way["highway"~"path|footway|track"]["name"~"(${regex})",i](${south},${west},${north},${east});
  way["highway"~"path|footway"]["ref"~"(${regex})",i](${south},${west},${north},${east});
);
out geom;`);

  if (ways.length < 2) {
    ways = await overpass(`[out:json][timeout:20];
way["highway"~"path|footway|via_ferrata"](${south},${west},${north},${east});
out geom;`);
  }

  ways = ways.filter((w) => wayLength(w) > 80);
  return findGreedyPath(ways, start, end);
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
  trail.gpx_path = `/gpx/${trail.slug}.gpx`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const routesPath = path.resolve('src/data/trails-routes.json');
  const trails = JSON.parse(await fs.readFile(routesPath, 'utf8'));
  let fixed = 0;
  let skipped = 0;

  for (const trail of trails) {
    if (trail.tags.includes('alta-via-2')) continue;

    const gpxFile = path.join(GPX_DIR, `${trail.slug}.gpx`);
    let existing = '';
    try {
      existing = await fs.readFile(gpxFile, 'utf8');
    } catch {
      existing = '';
    }

    if (existing && !isBadGpx(existing)) {
      skipped++;
      continue;
    }

    console.log(`→ ${trail.slug}`);
    const coords = await fetchOsmTrack(trail);
    if (coords.length < 40) {
      console.warn(`  ✗ solo ${coords.length} punti`);
      continue;
    }

    const gpx = waysToGpx(trail.name_it, coords);
    await fs.writeFile(gpxFile, gpx);
    syncTrail(trail, gpx);
    console.log(`  ✓ ${coords.length} punti`);
    fixed++;
    await sleep(1200);
  }

  await fs.writeFile(routesPath, JSON.stringify(trails, null, 2) + '\n');
  console.log(`\n✓ ${fixed} GPX riparati, ${skipped} già ok`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
