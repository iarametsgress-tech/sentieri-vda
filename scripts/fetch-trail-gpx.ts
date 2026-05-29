/**
 * Scarica tracce GPX (lovevda AV1/AV2, OSM per tour) e sincronizza
 * coordinate di partenza/arrivo da ogni traccia.
 *
 * Uso: npm run fetch:gpx
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import trailsJson from '../src/data/trails.json';
import routesJson from '../src/data/trails-routes.json';

const GPX_DIR = path.resolve('public/gpx');
const BASE = 'https://www.lovevda.it';

type Trail = (typeof trailsJson)[number];
type Coords = { lat: number; lng: number };
type GpxPoint = Coords & { ele: number | null };

const AV1_LOVEVDA: Record<string, { pageId: number; path: string }> = {
  'alta-via-1-tappa-1-donnas-perloz': { pageId: 2977, path: 'donnas-sassa' },
  'alta-via-1-tappa-2-perloz-rifugio-coda': { pageId: 2986, path: 'sassa-rifugio-coda' },
  'alta-via-1-tappa-3-rifugio-coda-rifugio-barma': { pageId: 2980, path: 'rifugio-coda-rifugio-della-barma' },
  'alta-via-1-tappa-4-rifugio-barma-niel': { pageId: 2981, path: 'rifugio-della-barma-niel' },
  'alta-via-1-tappa-5-niel-gressoney-saint-jean': { pageId: 2982, path: 'niel-gressoney-saint-jean' },
  'alta-via-1-tappa-6-gressoney-saint-jean-rifugio-vieux-crest': { pageId: 2983, path: 'gressoney-saint-jean-rifugio-vieux-crest' },
  'alta-via-1-tappa-7-rifugio-vieux-crest-rifugio-grand-tournalin': { pageId: 2969, path: 'rifugio-vieux-crest-rifugio-grand-tournalin' },
  'alta-via-1-tappa-8-rifugio-grand-tournalin-valtournenche': { pageId: 2968, path: 'rifugio-grand-tournalin-valtournenche' },
  'alta-via-1-tappa-9-valtournenche-rifugio-barmasse': { pageId: 2997, path: 'valtournenche-rifugio-barmasse' },
  'alta-via-1-tappa-10-rifugio-barmasse-rifugio-cuney': { pageId: 3000, path: 'rifugio-barmasse-rifugio-cuney' },
  'alta-via-1-tappa-11-rifugio-cuney-oyace': { pageId: 2987, path: 'rifugio-cuney-oyace' },
  'alta-via-1-tappa-12-oyace-ollomont': { pageId: 2989, path: 'oyace-rey-ollomont' },
  'alta-via-1-tappa-13-ollomont-rifugio-champillon': { pageId: 2988, path: 'rey-ollomont-rifugio-letey-champillon' },
  'alta-via-1-tappa-14-rifugio-champillon-saint-rhemy': { pageId: 2979, path: 'rifugio-letey-champillon-saint-rhemy-en-bosses' },
  'alta-via-1-tappa-15-saint-rhemy-rifugio-frassati': { pageId: 2994, path: 'saint-rhemy-en-bosses-rifugio-frassati' },
  'alta-via-1-tappa-16-rifugio-frassati-rifugio-bonatti': { pageId: 2993, path: 'rifugio-frassati-rifugio-walter-bonatti' },
  'alta-via-1-tappa-17-rifugio-bonatti-courmayeur': { pageId: 2975, path: 'rifugio-walter-bonatti-courmayeur' },
};

const AV2_LOVEVDA: Record<string, { pageId: number; path: string }> = {
  'alta-via-2-tappa-1-courmayeur-rifugio-elisabetta': { pageId: 2976, path: 'courmayeur-rifugio-elisabetta-soldini' },
  'alta-via-2-tappa-2-rifugio-elisabetta-la-thuile': { pageId: 2985, path: 'rifugio-elisabetta-soldini-la-thuile' },
  'alta-via-2-tappa-3-la-thuile-promoud': { pageId: 2984, path: 'la-thuile-rifugio-alberto-deffeyes' },
  'alta-via-2-tappa-4-promoud-planaval': { pageId: 2967, path: 'rifugio-alberto-deffeyes-planaval-arvier' },
  'alta-via-2-tappa-5-planaval-rifugio-chalet-epee': { pageId: 2995, path: 'planaval-arvier-rifugio-chalet-de-l-epee' },
  'alta-via-2-tappa-6-rifugio-chalet-epee-rhemes-notre-dame': { pageId: 2992, path: 'rifugio-chalet-de-l-epee-rhemes-notre-dame' },
  'alta-via-2-tappa-7-rhemes-notre-dame-eaux-rousses': { pageId: 2996, path: 'rhemes-notre-dame-eaux-rousses-valsavarenche' },
  'alta-via-2-tappa-8-eaux-rousses-rifugio-vittorio-sella': { pageId: 2973, path: 'eaux-rousses-valsavarenche-rifugio-vittorio-sella' },
  'alta-via-2-tappa-9-rifugio-vittorio-sella-cogne': { pageId: 2972, path: 'rifugio-vittorio-sella-cogne' },
  'alta-via-2-tappa-10-cogne-rifugio-sogno-berdze': { pageId: 2974, path: 'cogne-rifugio-sogno-di-berdze' },
  'alta-via-2-tappa-11-rifugio-sogno-berdze-rifugio-dondena': { pageId: 2970, path: 'rifugio-sogno-di-berdze-rifugio-dondena' },
  'alta-via-2-tappa-12-rifugio-dondena-champorcher': { pageId: 2971, path: 'rifugio-dondena-champorcher' },
  'alta-via-2-tappa-13-champorcher-crest-damon': { pageId: 2990, path: 'champorcher-crest' },
  'alta-via-2-tappa-14-crest-damon-donnas': { pageId: 2978, path: 'crest-donnas' },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchLovevdaTrackId(
  route: 1 | 2,
  pageId: number,
  pagePath: string
): Promise<number | null> {
  const prefix =
    route === 1
      ? `${BASE}/it/banca-dati/7/l-alta-via-n%C2%B0-1/valle-d-aosta/${pagePath}/${pageId}`
      : `${BASE}/it/banca-dati/7/l-alta-via-n%C2%B0-2/valle-d-aosta/${pagePath}/${pageId}`;
  const res = await fetch(prefix);
  if (!res.ok) return null;
  const html = await res.text();
  const m = html.match(/percorsotracciato1\/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

async function downloadLovevdaGpx(trackId: number): Promise<string> {
  const url = `${BASE}/staticmap/percorsotracciato1/${trackId}?estensione=gpx`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GPX HTTP ${res.status} for track ${trackId}`);
  return res.text();
}

type OsmWay = {
  type: 'way';
  id: number;
  geometry: { lat: number; lon: number }[];
  tags?: Record<string, string>;
};

const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];

async function overpass(query: string): Promise<OsmWay[]> {
  let lastErr: Error | null = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'SentieriVdaBot/1.0 (https://sentieri-vda.vercel.app)',
          },
          body: `data=${encodeURIComponent(query)}`,
        });
        if (!res.ok) throw new Error(`Overpass ${res.status}`);
        const data = await res.json();
        return (data.elements ?? []).filter((e: { type: string }) => e.type === 'way');
      } catch (e) {
        lastErr = e instanceof Error ? e : new Error(String(e));
        await sleep(3000 * (attempt + 1));
      }
    }
  }
  throw lastErr ?? new Error('Overpass failed');
}

function haversineM(a: Coords, b: Coords) {
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

function parseGpxPoints(gpx: string): GpxPoint[] {
  const points: GpxPoint[] = [];
  const re = /<trkpt\s+(?:lat="([^"]+)"\s+lon="([^"]+)"|lon="([^"]+)"\s+lat="([^"]+)")[^>]*>([\s\S]*?)<\/trkpt>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(gpx)) !== null) {
    const lat = m[1] ? parseFloat(m[1]) : parseFloat(m[4]);
    const lng = m[2] ? parseFloat(m[2]) : parseFloat(m[3]);
    const eleM = m[5].match(/<ele>([^<]+)<\/ele>/);
    points.push({
      lat,
      lng,
      ele: eleM ? parseFloat(eleM[1]) : null,
    });
  }
  return points;
}

function syncEndpointsFromGpx(trail: Trail, gpx: string) {
  const pts = parseGpxPoints(gpx);
  if (pts.length < 2) return;

  let first = pts[0];
  let last = pts[pts.length - 1];

  const dStartFirst = haversineM(trail.start.coords, first);
  const dStartLast = haversineM(trail.start.coords, last);

  if (dStartLast + 500 < dStartFirst) {
    [first, last] = [last, first];
  }

  trail.start.coords = { lat: +first.lat.toFixed(6), lng: +first.lng.toFixed(6) };
  trail.end.coords = { lat: +last.lat.toFixed(6), lng: +last.lng.toFixed(6) };
  if (first.ele != null) trail.start.elevation_m = Math.round(first.ele);
  if (last.ele != null) trail.end.elevation_m = Math.round(last.ele);
}

function waysToGpx(name: string, ways: OsmWay[]): string {
  const coords = ways.flatMap((w) => w.geometry.map((p) => ({ lat: p.lat, lon: p.lon })));
  const trkpts = coords
    .map((c) => `      <trkpt lat="${c.lat.toFixed(6)}" lon="${c.lon.toFixed(6)}"></trkpt>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Sentieri VdA / OpenStreetMap">
  <metadata><name>${name}</name><desc>Traccia da OpenStreetMap — verificare sul terreno</desc></metadata>
  <trk><name>${name}</name><trkseg>
${trkpts}
  </trkseg></trk>
</gpx>`;
}

function orientWay(way: OsmWay, start: Coords, end: Coords): OsmWay {
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

function pickBestWay(ways: OsmWay[], start: Coords, end: Coords): OsmWay | null {
  if (!ways.length) return null;
  const scored = ways
    .filter((w) => w.geometry?.length >= 8)
    .map((w) => {
      const oriented = orientWay(w, start, end);
      const first = oriented.geometry[0];
      const last = oriented.geometry[oriented.geometry.length - 1];
      const distStart = haversineM(start, { lat: first.lat, lng: first.lon });
      const distEnd = haversineM(end, { lat: last.lat, lng: last.lon });
      const length = oriented.geometry.reduce((acc, p, i) => {
        if (i === 0) return 0;
        const prev = oriented.geometry[i - 1];
        return acc + haversineM({ lat: prev.lat, lng: prev.lon }, { lat: p.lat, lng: p.lon });
      }, 0);
      return { w: oriented, score: distStart + distEnd - length * 0.002 };
    })
    .sort((a, b) => a.score - b.score);
  return scored[0]?.w ?? null;
}

function buildInterpolatedGpx(name: string, start: Coords, end: Coords, steps = 24): string {
  const pts: Coords[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push({
      lat: start.lat + (end.lat - start.lat) * t,
      lng: start.lng + (end.lng - start.lng) * t,
    });
  }
  const trkpts = pts
    .map((c) => `      <trkpt lat="${c.lat.toFixed(6)}" lon="${c.lng.toFixed(6)}"></trkpt>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Sentieri VdA">
  <metadata><name>${name}</name><desc>Traccia approssimativa start→end — scaricare GPX ufficiale se disponibile</desc></metadata>
  <trk><name>${name}</name><trkseg>
${trkpts}
  </trkseg></trk>
</gpx>`;
}

function osmSearchTerms(trail: Trail): string[] {
  const terms = new Set<string>();
  for (const label of [trail.start.name, trail.end.name, trail.valley]) {
    for (const part of label.split(/[\s,→\-/]+/)) {
      const clean = part.replace(/['']/g, '').trim();
      if (clean.length >= 4) terms.add(clean);
    }
  }
  if (trail.tags.includes('alta-via-1')) terms.add('Alta Via');
  if (trail.tags.includes('alta-via-2')) terms.add('Alta Via');
  if (trail.tags.includes('tour-mont-blanc')) {
    terms.add('TMB');
    terms.add('Tour du Mont Blanc');
    terms.add('Val Ferret');
  }
  if (trail.tags.includes('tour-monte-rosa')) terms.add('Monte Rosa');
  if (trail.tags.includes('tour-cervino')) terms.add('Cervino');
  if (trail.tags.includes('tour-gran-paradiso')) terms.add('Gran Paradiso');
  if (trail.tags.includes('tour-rutor')) terms.add('Rutor');
  if (trail.tags.includes('tour-gran-combin')) terms.add('Gran Combin');
  return [...terms].slice(0, 10);
}

async function fetchOsmGpx(trail: Trail): Promise<string | null> {
  const { start, end } = trail;
  const pad = Math.max(0.06, haversineM(start.coords, end.coords) / 111000 / 2 + 0.04);
  const south = Math.min(start.coords.lat, end.coords.lat) - pad;
  const north = Math.max(start.coords.lat, end.coords.lat) + pad;
  const west = Math.min(start.coords.lng, end.coords.lng) - pad;
  const east = Math.max(start.coords.lng, end.coords.lng) + pad;

  const terms = osmSearchTerms(trail);
  const regex = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

  const namedQuery = `[out:json][timeout:25];
(
  way["highway"~"path|footway|track"]["name"~"(${regex})",i](${south},${west},${north},${east});
  way["highway"~"path|footway"]["ref"~"(${regex})",i](${south},${west},${north},${east});
  relation["route"="hiking"]["name"~"(${regex})",i](${south},${west},${north},${east});
);
out geom;`;

  let ways = await overpass(namedQuery);
  let best = pickBestWay(ways, start.coords, end.coords);

  if (!best) {
    const fallbackQuery = `[out:json][timeout:25];
way["highway"~"path|footway|via_ferrata"](${south},${west},${north},${east});
out geom;`;
    ways = await overpass(fallbackQuery);
    best = pickBestWay(ways, start.coords, end.coords);
  }

  if (!best) return null;
  return waysToGpx(trail.name_it, [best]);
}

async function resolveGpx(trail: Trail, existing: string | null): Promise<string> {
  if (existing?.includes('<trkpt')) return existing;

  const av1 = AV1_LOVEVDA[trail.slug];
  if (av1) {
    await sleep(800);
    const trackId = await fetchLovevdaTrackId(1, av1.pageId, av1.path);
    if (trackId) {
      const gpx = await downloadLovevdaGpx(trackId);
      console.log(`  ✓ lovevda AV1 track ${trackId}`);
      return gpx;
    }
  }

  const av2 = AV2_LOVEVDA[trail.slug];
  if (av2) {
    await sleep(800);
    const trackId = await fetchLovevdaTrackId(2, av2.pageId, av2.path);
    if (trackId) {
      const gpx = await downloadLovevdaGpx(trackId);
      console.log(`  ✓ lovevda AV2 track ${trackId}`);
      return gpx;
    }
  }

  await sleep(1500);
  try {
    const osm = await fetchOsmGpx(trail);
    if (osm) {
      console.log('  ✓ OSM Overpass');
      return osm;
    }
  } catch {
    console.warn('  ~ OSM non disponibile, uso interpolata');
  }

  console.warn('  ~ traccia interpolata start→end');
  return buildInterpolatedGpx(trail.name_it, trail.start.coords, trail.end.coords);
}

async function main() {
  await fs.mkdir(GPX_DIR, { recursive: true });

  const baseTrails = [...trailsJson] as Trail[];
  const routeTrails = [...routesJson] as Trail[];

  let ok = 0;
  let fail = 0;

  async function processTrail(trail: Trail) {
    const dest = path.join(GPX_DIR, `${trail.slug}.gpx`);
    console.log(`→ ${trail.slug}`);

    try {
      let gpx: string | null = null;
      try {
        gpx = await fs.readFile(dest, 'utf8');
      } catch {
        gpx = null;
      }

      const hasTrack = Boolean(gpx?.includes('<trkpt'));
      const isAv1Official = Boolean(AV1_LOVEVDA[trail.slug]);
      const isAv2Official = Boolean(AV2_LOVEVDA[trail.slug]);

      if (hasTrack && (isAv1Official || isAv2Official)) {
        console.log('  · traccia ufficiale — sync coords');
      } else {
        gpx = await resolveGpx(trail, hasTrack ? gpx : null);
      }

      if (!gpx?.includes('<trkpt')) {
        throw new Error('GPX vuoto');
      }

      syncEndpointsFromGpx(trail, gpx);
      await fs.writeFile(dest, gpx);
      trail.gpx_path = `/gpx/${trail.slug}.gpx`;
      ok++;
    } catch (e) {
      fail++;
      console.error(`  ✗`, e instanceof Error ? e.message : e);
    }
  }

  for (const trail of baseTrails) await processTrail(trail);
  for (const trail of routeTrails) await processTrail(trail);

  await fs.writeFile(path.resolve('src/data/trails.json'), JSON.stringify(baseTrails, null, 2) + '\n');
  await fs.writeFile(path.resolve('src/data/trails-routes.json'), JSON.stringify(routeTrails, null, 2) + '\n');

  console.log(`\n✓ Completato: ${ok} tracce, ${fail} errori`);
  console.log('✓ trails.json + trails-routes.json aggiornati (coords + gpx_path)');
}

main();
