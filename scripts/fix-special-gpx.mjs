/**
 * Ripara GPX errati/interpolati (Bonatti, Djouan, tour TMB tappa 1, ecc.)
 * Uso: node scripts/fix-special-gpx.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const GPX_DIR = path.resolve('public/gpx');
const OVERPASS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];

const LAVACHEY = { lat: 45.884511, lng: 7.065606 };
const BONATTI = { lat: 45.8687229, lng: 7.0343894 };

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
      /* retry next endpoint */
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

function pickBestWay(ways, start, end) {
  const scored = ways
    .filter((w) => w.geometry?.length >= 8)
    .map((w) => {
      const oriented = orientWay(w, start, end);
      const first = oriented.geometry[0];
      const last = oriented.geometry[oriented.geometry.length - 1];
      const distStart = haversineM(start, { lat: first.lat, lng: first.lon });
      const distEnd = haversineM(end, { lat: last.lat, lng: last.lon });
      const length = wayLength(oriented);
      return { w: oriented, score: distStart + distEnd - length * 0.002 };
    })
    .sort((a, b) => a.score - b.score);
  return scored[0]?.w ?? null;
}

function wayToCoords(way) {
  return way.geometry.map((p) => ({ lat: p.lat, lng: p.lon }));
}

function wayCoversAnchors(way, anchors, thresholdM = 450) {
  return anchors.every((anchor) =>
    way.geometry.some(
      (p) => haversineM(anchor, { lat: p.lat, lng: p.lon }) <= thresholdM
    )
  );
}

function filterWaysForAnchors(ways, anchors, thresholdM = 450) {
  return ways.filter((w) => wayCoversAnchors(w, anchors, thresholdM));
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

function findGreedyPath(ways, start, end, usedIds = new Set()) {
  const path = [];
  let current = snapToNetwork(ways, start);
  const localUsed = new Set(usedIds);

  for (let step = 0; step < 30 && haversineM(current, end) > 180; step++) {
    let best = null;
    let bestScore = Infinity;
    const connectThreshold = step === 0 ? 650 : 220;

    for (const way of ways) {
      if (localUsed.has(way.id)) continue;
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
    localUsed.add(best.id);
    const seg = wayToCoords(best);
    if (!path.length) path.push(...seg);
    else path.push(...seg.slice(1));
    current = path[path.length - 1];
  }

  return { coords: path, usedIds: localUsed };
}

async function fetchSegment(start, end, terms = [], anchors = null) {
  const pad = Math.max(0.025, haversineM(start, end) / 111000 / 2 + 0.015);
  const south = Math.min(start.lat, end.lat) - pad;
  const north = Math.max(start.lat, end.lat) + pad;
  const west = Math.min(start.lng, end.lng) - pad;
  const east = Math.max(start.lng, end.lng) + pad;

  const regex =
    terms.length > 0
      ? terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
      : null;

  let ways = [];
  if (regex) {
    const named = `[out:json][timeout:20];
(
  way["highway"~"path|footway|track"]["name"~"(${regex})",i](${south},${west},${north},${east});
  way["highway"~"path|footway"]["ref"~"(${regex})",i](${south},${west},${north},${east});
);
out geom;`;
    ways = await overpass(named);
  }

  if (ways.length < 2) {
    const fallback = `[out:json][timeout:20];
way["highway"~"path|footway|via_ferrata"](${south},${west},${north},${east});
out geom;`;
    ways = await overpass(fallback);
  }

  ways = ways.filter((w) => wayLength(w) > 150);
  if (anchors?.length) {
    ways = filterWaysForAnchors(ways, anchors);
  }
  return pickBestWay(ways, start, end);
}

function stitchSegments(segments) {
  const out = [];
  for (const seg of segments) {
    if (!seg.length) continue;
    if (!out.length) {
      out.push(...seg);
      continue;
    }
    const tail = out[out.length - 1];
    const head = seg[0];
    if (haversineM(tail, head) < 80) {
      out.push(...seg.slice(1));
    } else {
      out.push(...seg);
    }
  }
  return out;
}

async function fetchBonattiLoop() {
  const pad = 0.045;
  const south = Math.min(LAVACHEY.lat, BONATTI.lat) - pad;
  const north = Math.max(LAVACHEY.lat, BONATTI.lat) + pad;
  const west = Math.min(LAVACHEY.lng, BONATTI.lng) - pad;
  const east = Math.max(LAVACHEY.lng, BONATTI.lng) + pad;

  let ways = await overpass(`[out:json][timeout:20];
(
  way["highway"~"path|footway|track"]["name"~"Bonatti|Tour du Mont Blanc|Val Ferret|Lavachey|Pra Sec|TMB",i](${south},${west},${north},${east});
  way["highway"~"path|footway"]["ref"~"TMB|Tour du Mont Blanc",i](${south},${west},${north},${east});
);
out geom;`);

  if (ways.length < 3) {
    ways = await overpass(`[out:json][timeout:20];
way["highway"~"path|footway|via_ferrata"](${south},${west},${north},${east});
out geom;`);
  }

  ways = ways.filter((w) => wayLength(w) > 80);
  if (!ways.length) return [];

  const up = findGreedyPath(ways, LAVACHEY, BONATTI);
  const down = findGreedyPath(ways, BONATTI, LAVACHEY, up.usedIds);

  const coords = stitchSegments([up.coords, down.coords]);
  if (coords.length < 20) return [];

  const nearLavachey = coords.some((p) => haversineM(p, LAVACHEY) < 500);
  const nearBonatti = coords.some((p) => haversineM(p, BONATTI) < 500);
  if (!nearLavachey || !nearBonatti) return [];

  if (haversineM(coords[0], coords[coords.length - 1]) > 120) {
    coords.push(coords[0]);
  }
  return coords;
}

async function fetchPointToPoint(start, end, terms) {
  const pad = Math.max(0.03, haversineM(start, end) / 111000 / 2 + 0.02);
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
  const greedy = findGreedyPath(ways, start, end);
  if (greedy.coords.length >= 20) return greedy.coords;

  const way = pickBestWay(ways, start, end);
  return way ? wayToCoords(way) : [];
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
}

async function loadTrail(slug) {
  for (const file of ['src/data/trails.json', 'src/data/trails-routes.json']) {
    const trails = JSON.parse(await fs.readFile(path.resolve(file), 'utf8'));
    const trail = trails.find((t) => t.slug === slug);
    if (trail) return { trail, file, trails };
  }
  return null;
}

async function saveTrails(file, trails) {
  await fs.writeFile(path.resolve(file), JSON.stringify(trails, null, 2) + '\n');
}

const JOBS = [
  {
    slug: 'tour-rifugio-bonatti',
    name: 'Anello del Rifugio Bonatti',
    minPoints: 60,
    fetch: fetchBonattiLoop,
  },
  {
    slug: 'lago-djouan-cogne',
    name: 'Lago Djouan dal Valnontey',
    minPoints: 40,
    fetch: async () => {
      const loaded = await loadTrail('lago-djouan-cogne');
      if (!loaded) return [];
      const { trail } = loaded;
      return fetchPointToPoint(trail.start.coords, trail.end.coords, [
        'Djouan',
        'Orvieille',
        'Valnontey',
        'Lauson',
        '8C',
        'Gran Paradiso',
      ]);
    },
  },
  {
    slug: 'tour-mont-blanc-tappa-1-courmayeur-rifugio-bertone',
    name: 'TMB Tappa 1 Courmayeur Bertone',
    minPoints: 60,
    fetch: async () => {
      const loaded = await loadTrail('tour-mont-blanc-tappa-1-courmayeur-rifugio-bertone');
      if (!loaded) return [];
      const { trail } = loaded;
      return fetchPointToPoint(trail.start.coords, trail.end.coords, [
        'Bertone',
        'Tour du Mont Blanc',
        'TMB',
        'Val Ferret',
      ]);
    },
  },
  {
    slug: 'tour-monte-rosa-tappa-2-rifugio-gabiet-colle-teodulo',
    name: 'Monte Rosa Gabiet Teodulo',
    minPoints: 60,
    fetch: async () => {
      const loaded = await loadTrail('tour-monte-rosa-tappa-2-rifugio-gabiet-colle-teodulo');
      if (!loaded) return [];
      const { trail } = loaded;
      return fetchPointToPoint(trail.start.coords, trail.end.coords, [
        'Teodulo',
        'Gabiet',
        'Theodul',
        'Monte Rosa',
      ]);
    },
  },
  {
    slug: 'tour-cervino-tappa-1-breuil-rifugio-duca-abruzzi',
    name: 'Cervino Duca degli Abruzzi',
    minPoints: 60,
    fetch: async () => {
      const loaded = await loadTrail('tour-cervino-tappa-1-breuil-rifugio-duca-abruzzi');
      if (!loaded) return [];
      const { trail } = loaded;
      return fetchPointToPoint(trail.start.coords, trail.end.coords, [
        'Abruzzi',
        'Cervino',
        'Matterhorn',
        'Oriond',
      ]);
    },
  },
];

async function main() {
  for (const job of JOBS) {
    console.log(`→ ${job.slug}`);
    const coords = await job.fetch();
    if (coords.length < job.minPoints) {
      console.warn(`  ✗ solo ${coords.length} punti, skip`);
      continue;
    }
    const gpx = waysToGpx(job.name, coords);
    await fs.writeFile(path.join(GPX_DIR, `${job.slug}.gpx`), gpx);
    console.log(`  ✓ ${coords.length} punti`);

    const loaded = await loadTrail(job.slug);
    if (loaded) {
      syncTrail(loaded.trail, gpx);
      loaded.trail.gpx_path = `/gpx/${job.slug}.gpx`;
      await saveTrails(loaded.file, loaded.trails);
    }
  }
  console.log('\n✓ GPX e coordinate aggiornati');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
