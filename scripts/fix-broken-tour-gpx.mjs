/**
 * Ricostruisce tracce GPX distinte per le tappe tour con GPX duplicato/sbagliato.
 * Usa routing Dijkstra sulla rete di sentieri OpenStreetMap tra i waypoint reali.
 * Uso: node scripts/fix-broken-tour-gpx.mjs [slug ...]
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const GPX_DIR = path.resolve('public/gpx');
const ROUTES = path.resolve('src/data/trails-routes.json');
const OVERPASS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

const TARGETS = [
  'tour-mont-blanc-tappa-1-courmayeur-rifugio-bertone',
  'tour-mont-blanc-tappa-2-rifugio-bertone-rifugio-bonatti',
  'tour-mont-blanc-tappa-3-rifugio-bonatti-rifugio-elena',
  'tour-mont-blanc-tappa-4-rifugio-elena-col-seigne',
  'tour-cervino-tappa-1-breuil-rifugio-duca-abruzzi',
  'tour-cervino-tappa-2-rifugio-duca-orionde',
  'tour-cervino-tappa-3-rifugio-orionde-colle-teodulo',
  'tour-gran-combin-tappa-3-col-gran-san-bernardo-combin-tsessione',
  'tour-monte-rosa-tappa-1-gressoney-rifugio-gabiet',
  'tour-monte-rosa-tappa-4-breuil-gressoney',
];

// Coordinate waypoint corrette (da OpenStreetMap) per riparare i dati corrotti
// da script precedenti che avevano sovrascritto start/end dalle tracce duplicate.
const CORRECT = {
  'tour-mont-blanc-tappa-1-courmayeur-rifugio-bertone': {
    start: { lat: 45.7906, lng: 6.9695, ele: 1224 },
    end: { lat: 45.809255, lng: 6.978859, ele: 2010 },
  },
  'tour-mont-blanc-tappa-2-rifugio-bertone-rifugio-bonatti': {
    start: { lat: 45.809255, lng: 6.978859, ele: 2010 },
    end: { lat: 45.846917, lng: 7.033661, ele: 2030 },
  },
  'tour-mont-blanc-tappa-3-rifugio-bonatti-rifugio-elena': {
    start: { lat: 45.846917, lng: 7.033661, ele: 2030 },
    end: { lat: 45.884719, lng: 7.065638, ele: 2055 },
  },
  'tour-mont-blanc-tappa-4-rifugio-elena-col-seigne': {
    start: { lat: 45.884719, lng: 7.065638, ele: 2055 },
    end: { lat: 45.751264, lng: 6.807213, ele: 2515 },
  },
  'tour-cervino-tappa-3-rifugio-orionde-colle-teodulo': {
    end: { lat: 45.943498, lng: 7.708713, ele: 3301 },
  },
  'tour-monte-rosa-tappa-1-gressoney-rifugio-gabiet': {
    start: { lat: 45.779297, lng: 7.825032, ele: 1385 },
    end: { lat: 45.85435, lng: 7.849603, ele: 2370 },
  },
  'tour-monte-rosa-tappa-4-breuil-gressoney': {
    start: { lat: 45.935603, lng: 7.63044, ele: 2050 },
    end: { lat: 45.779297, lng: 7.825032, ele: 1385 },
  },
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

async function overpass(query) {
  for (let attempt = 0; attempt < 4; attempt++) {
    for (const url of OVERPASS) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'SentieriVdaBot/1.0 (https://sentieri-vda.vercel.app)',
          },
          body: 'data=' + encodeURIComponent(query),
          signal: AbortSignal.timeout(70000),
        });
        const text = await res.text();
        if (!res.ok || text.trimStart().startsWith('<')) continue; // rate-limited
        const data = JSON.parse(text);
        return (data.elements ?? []).filter((e) => e.type === 'way' && e.geometry?.length >= 2);
      } catch {
        /* retry */
      }
    }
    await new Promise((r) => setTimeout(r, 5000 * (attempt + 1)));
  }
  return [];
}

const key = (lat, lon) => `${lat.toFixed(5)},${lon.toFixed(5)}`;

function buildGraph(ways) {
  const adj = new Map();
  const coord = new Map();
  const addNode = (lat, lon) => {
    const k = key(lat, lon);
    if (!coord.has(k)) {
      coord.set(k, { lat, lng: lon });
      adj.set(k, []);
    }
    return k;
  };
  const addEdge = (a, b) => {
    const w = haversineM(coord.get(a), coord.get(b));
    adj.get(a).push({ to: b, w });
    adj.get(b).push({ to: a, w });
  };
  for (const way of ways) {
    let prev = null;
    for (const p of way.geometry) {
      const k = addNode(p.lat, p.lon);
      if (prev && prev !== k) addEdge(prev, k);
      prev = k;
    }
  }
  return { adj, coord };
}

function nearestNode(coord, pt) {
  let best = null;
  let bestD = Infinity;
  for (const [k, c] of coord) {
    const d = haversineM(c, pt);
    if (d < bestD) {
      bestD = d;
      best = k;
    }
  }
  return { key: best, dist: bestD };
}

/** Dijkstra con binary heap minimale. */
function dijkstra(adj, coord, startK, endK) {
  const dist = new Map();
  const prev = new Map();
  dist.set(startK, 0);
  const heap = [[0, startK]];
  const swap = (i, j) => ([heap[i], heap[j]] = [heap[j], heap[i]]);
  const push = (item) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] <= heap[i][0]) break;
      swap(i, p);
      i = p;
    }
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let s = i;
        if (l < heap.length && heap[l][0] < heap[s][0]) s = l;
        if (r < heap.length && heap[r][0] < heap[s][0]) s = r;
        if (s === i) break;
        swap(i, s);
        i = s;
      }
    }
    return top;
  };
  const visited = new Set();
  while (heap.length) {
    const [d, u] = pop();
    if (visited.has(u)) continue;
    visited.add(u);
    if (u === endK) break;
    for (const { to, w } of adj.get(u) ?? []) {
      if (visited.has(to)) continue;
      const nd = d + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        dist.set(to, nd);
        prev.set(to, u);
        push([nd, to]);
      }
    }
  }
  if (!dist.has(endK)) return null;
  const pathKeys = [];
  let cur = endK;
  while (cur !== undefined) {
    pathKeys.push(cur);
    if (cur === startK) break;
    cur = prev.get(cur);
  }
  pathKeys.reverse();
  if (pathKeys[0] !== startK) return null;
  return { coords: pathKeys.map((k) => coord.get(k)), lengthM: dist.get(endK) };
}

function writeGpx(name, coords) {
  const trkpts = coords
    .map((c) => `      <trkpt lat="${c.lat.toFixed(6)}" lon="${c.lng.toFixed(6)}"></trkpt>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Sentieri VdA / OpenStreetMap routing">
  <metadata><name>${name}</name><desc>Traccia ricostruita da OpenStreetMap (routing) — verificare sul terreno</desc></metadata>
  <trk><name>${name}</name><trkseg>
${trkpts}
  </trkseg></trk>
</gpx>`;
}

async function fixStage(trail) {
  const start = trail.start.coords;
  const end = trail.end.coords;
  const directM = haversineM(start, end);
  const pad = Math.max(0.025, directM / 111000 / 2 + 0.03);
  const south = Math.min(start.lat, end.lat) - pad;
  const north = Math.max(start.lat, end.lat) + pad;
  const west = Math.min(start.lng, end.lng) - pad;
  const east = Math.max(start.lng, end.lng) + pad;

  const ways = await overpass(`[out:json][timeout:65];
(
  way["highway"~"path|footway|track|steps|bridleway|via_ferrata|cycleway|pedestrian|living_street|residential|unclassified|service|tertiary"](${south},${west},${north},${east});
);
out geom;`);

  if (ways.length < 3) return { ok: false, reason: `solo ${ways.length} ways OSM` };

  const { adj, coord } = buildGraph(ways);
  const s = nearestNode(coord, start);
  const e = nearestNode(coord, end);
  if (!s.key || !e.key) return { ok: false, reason: 'nessun nodo vicino' };
  if (s.dist > 1300 || e.dist > 1300)
    return { ok: false, reason: `snap troppo lontano (${Math.round(s.dist)}/${Math.round(e.dist)} m)` };

  const route = dijkstra(adj, coord, s.key, e.key);
  if (!route || route.coords.length < 10) return { ok: false, reason: 'nessun percorso' };

  const km = route.lengthM / 1000;
  const expected = trail.distance_km || km;
  if (km > expected * 3 + 4) return { ok: false, reason: `troppo lungo (${km.toFixed(1)} vs ${expected} km)` };

  // assicura orientamento start→end
  let coords = route.coords;
  if (haversineM(coords[0], start) > haversineM(coords[0], end)) coords = [...coords].reverse();

  return { ok: true, coords, km };
}

async function main() {
  const requested = process.argv.slice(2);
  const slugs = requested.length ? requested : TARGETS;
  const trails = JSON.parse(await fs.readFile(ROUTES, 'utf8'));
  const results = [];

  for (const slug of slugs) {
    const trail = trails.find((t) => t.slug === slug);
    if (!trail) {
      console.warn(`! ${slug}: non trovato`);
      continue;
    }
    // Applica le coordinate waypoint corrette (se note) e persistile
    const fix = CORRECT[slug];
    if (fix) {
      if (fix.start) {
        trail.start.coords = { lat: fix.start.lat, lng: fix.start.lng };
        if (fix.start.ele != null) trail.start.elevation_m = fix.start.ele;
      }
      if (fix.end) {
        trail.end.coords = { lat: fix.end.lat, lng: fix.end.lng };
        if (fix.end.ele != null) trail.end.elevation_m = fix.end.ele;
      }
    }
    process.stdout.write(`→ ${slug} ... `);
    try {
      const r = await fixStage(trail);
      if (!r.ok) {
        console.log(`SKIP (${r.reason})`);
        results.push({ slug, ok: false, reason: r.reason });
        continue;
      }
      const gpx = writeGpx(trail.name_it, r.coords);
      await fs.writeFile(path.join(GPX_DIR, `${slug}.gpx`), gpx);
      trail.gpx_path = `/gpx/${slug}.gpx`;
      console.log(`OK ${r.coords.length} pt, ${r.km.toFixed(1)} km`);
      results.push({ slug, ok: true, points: r.coords.length, km: r.km });
    } catch (err) {
      console.log(`ERR ${err.message}`);
      results.push({ slug, ok: false, reason: err.message });
    }
    await new Promise((res) => setTimeout(res, 1500));
  }

  await fs.writeFile(ROUTES, JSON.stringify(trails, null, 2) + '\n');
  const ok = results.filter((r) => r.ok).length;
  console.log(`\n${ok}/${results.length} tracce ricostruite.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
