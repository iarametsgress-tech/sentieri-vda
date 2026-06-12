/**
 * 1) Rigenera l'anello del Rifugio Bonatti (trails.json).
 * 2) Costruisce i GPX delle tratte di valico su ghiacciaio (Teodulo, Col Collon)
 *    cucendo tratti instradabili (BRouter su rete OSM) e, dove la rete si
 *    interrompe sul ghiacciaio, il corridoio rettilineo del passo storico.
 *    Le tappe restano marcate transfer (solo con guida o impianti).
 */
import fs from 'node:fs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = { 'User-Agent': 'SentieriVdaBot/1.0 (https://sentierivda.it)' };

// ── punti (lng, lat, elev) ──
const P = {
  lavachey: [7.0301, 45.8689, 1642],
  arnouva: [7.056, 45.8788, 1769],
  bonatti: [7.0354, 45.8478, 2025],
  zermatt: [7.7491, 46.0207, 1608],
  furi: [7.7372, 45.9926, 1867],
  gandegg: [7.7155, 45.9646, 3030],
  theodul: [7.7089, 45.9385, 3295],
  'testa-grigia': [7.7079, 45.9342, 3458],
  'plan-maison': [7.6553, 45.9468, 2548],
  breuil: [7.6298, 45.9365, 2006],
  prarayer: [7.512, 45.892, 2005],
  nacamuli: [7.5077, 45.9495, 2818],
  collon: [7.5117, 45.9745, 3074],
  'arolla-alta': [7.4965, 46.0055, 2360],
  arolla: [7.484, 46.0259, 2006],
};

function haversineM(a, b) {
  const R = 6371000;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[1] * Math.PI) / 180) * Math.cos((b[1] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function parseGpx(gpx) {
  const pts = [];
  const re = /<trkpt lon="([^"]+)" lat="([^"]+)">(?:<ele>([^<]+)<\/ele>)?/g;
  let m;
  while ((m = re.exec(gpx)) !== null) pts.push([+m[1], +m[2], m[3] != null ? +m[3] : null]);
  return pts;
}

async function brouterLeg(a, b, label) {
  const lonlats = `${a[0]},${a[1]}|${b[0]},${b[1]}`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(
        `https://brouter.de/brouter?lonlats=${lonlats}&profile=hiking-mountain&alternativeidx=0&format=gpx`,
        { headers: UA, signal: AbortSignal.timeout(60000) }
      );
      const text = await res.text();
      if (res.ok && text.startsWith('<?xml')) {
        const pts = parseGpx(text);
        const km = pts.reduce((acc, p, i) => (i ? acc + haversineM(pts[i - 1], p) : 0), 0) / 1000;
        const straight = haversineM(a, b) / 1000;
        if (km <= Math.max(2.5, straight * 3.2)) {
          console.log(`  leg ${label}: routed ${km.toFixed(1)}km (${pts.length}pts)`);
          return pts;
        }
        console.log(`  leg ${label}: routed ${km.toFixed(1)}km TROPPO LUNGO (diretto ${straight.toFixed(1)}km) → corridoio`);
        return null;
      }
    } catch (e) {
      console.log(`  leg ${label}: ${e.message}`);
    }
    await sleep(1500);
  }
  return null;
}

function interpolate(a, b, stepM = 90) {
  const n = Math.max(2, Math.ceil(haversineM(a, b) / stepM));
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push([
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] != null && b[2] != null ? Math.round(a[2] + (b[2] - a[2]) * t) : null,
    ]);
  }
  return out;
}

function toGpx(name, pts) {
  const body = pts
    .map((p) =>
      p[2] != null
        ? `<trkpt lon="${p[0].toFixed(6)}" lat="${p[1].toFixed(6)}"><ele>${p[2]}</ele></trkpt>`
        : `<trkpt lon="${p[0].toFixed(6)}" lat="${p[1].toFixed(6)}"></trkpt>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Sentieri VdA / OpenStreetMap">
<metadata><name>${name}</name><desc>Itinerario di valico storico: tratto su ghiacciaio indicativo, solo con guida alpina o impianti</desc></metadata>
<trk><name>${name}</name><trkseg>
${body}
</trkseg></trk>
</gpx>`;
}

async function buildRoute(name, keys, glacierPairs) {
  const glacier = new Set(glacierPairs.map((p) => p.join('>')));
  let pts = [];
  for (let i = 1; i < keys.length; i++) {
    const a = P[keys[i - 1]];
    const b = P[keys[i]];
    const id = `${keys[i - 1]}>${keys[i]}`;
    let leg = null;
    if (!glacier.has(id)) leg = await brouterLeg(a, b, id);
    if (!leg) {
      leg = interpolate(a, b);
      if (!glacier.has(id)) console.log(`  leg ${id}: fallback corridoio`);
      else console.log(`  leg ${id}: corridoio ghiacciaio (${leg.length}pts)`);
    }
    pts = pts.length ? [...pts, ...leg.slice(1)] : leg;
    await sleep(1200);
  }
  const km = pts.reduce((acc, p, i) => (i ? acc + haversineM(pts[i - 1], p) : 0), 0) / 1000;
  console.log(`✓ ${name}: ${km.toFixed(1)}km totali (${pts.length}pts)`);
  return { pts, km: +km.toFixed(1) };
}

function gainLoss(pts) {
  let gain = 0;
  let loss = 0;
  let prev = null;
  for (const p of pts) {
    if (p[2] == null) continue;
    if (prev != null) {
      const d = p[2] - prev;
      if (d > 0) gain += d;
      else loss -= d;
    }
    prev = p[2];
  }
  return { gain: Math.round(gain), loss: Math.round(loss) };
}

// ── 1. Anello Bonatti ──
console.log('— Anello Rifugio Bonatti —');
const loop = await buildRoute('Anello del Rifugio Bonatti', ['lavachey', 'arnouva', 'bonatti', 'lavachey'], []);
fs.writeFileSync('public/gpx/tour-rifugio-bonatti.gpx', toGpx('Anello del Rifugio Bonatti', loop.pts));
{
  const trails = JSON.parse(fs.readFileSync('src/data/trails.json', 'utf8'));
  const t = trails.find((x) => x.slug === 'tour-rifugio-bonatti');
  const gl = gainLoss(loop.pts);
  t.distance_km = loop.km;
  if (gl.gain > 200) {
    t.elevation_gain_m = gl.gain;
    t.elevation_loss_m = gl.loss;
  }
  t.start.coords = { lat: +loop.pts[0][1].toFixed(6), lng: +loop.pts[0][0].toFixed(6) };
  t.end.coords = t.start.coords;
  fs.writeFileSync('src/data/trails.json', JSON.stringify(trails, null, 2) + '\n');
}

// ── 2. Teodulo: Zermatt → Breuil ──
console.log('— Teodulo (Zermatt → Breuil-Cervinia) —');
const teodulo = await buildRoute(
  'Colle del Teodulo — Zermatt → Breuil-Cervinia',
  ['zermatt', 'furi', 'gandegg', 'theodul', 'testa-grigia', 'plan-maison', 'breuil'],
  [['gandegg', 'theodul'], ['theodul', 'testa-grigia'], ['testa-grigia', 'plan-maison']]
);
for (const slug of ['tour-monte-rosa-tappa-8-zermatt-breuil-cervinia', 'tour-cervino-tappa-8-zermatt-breuil-cervinia']) {
  fs.writeFileSync(`public/gpx/${slug}.gpx`, toGpx('Colle del Teodulo — Zermatt → Breuil-Cervinia', teodulo.pts));
}

// ── 3. Col Collon: Prarayer → Arolla ──
console.log('— Col Collon (Prarayer → Arolla) —');
const collon = await buildRoute(
  'Col Collon — Prarayer → Arolla',
  ['prarayer', 'nacamuli', 'collon', 'arolla-alta', 'arolla'],
  [['nacamuli', 'collon'], ['collon', 'arolla-alta']]
);
fs.writeFileSync('public/gpx/tour-cervino-tappa-2-rifugio-prarayer-arolla.gpx', toGpx('Col Collon — Prarayer → Arolla', collon.pts));

// ── aggiorna i record delle tappe transfer ──
{
  const routes = JSON.parse(fs.readFileSync('src/data/trails-routes.json', 'utf8'));
  const updates = {
    'tour-monte-rosa-tappa-8-zermatt-breuil-cervinia': teodulo,
    'tour-cervino-tappa-8-zermatt-breuil-cervinia': teodulo,
    'tour-cervino-tappa-2-rifugio-prarayer-arolla': collon,
  };
  for (const [slug, r] of Object.entries(updates)) {
    const t = routes.find((x) => x.slug === slug);
    if (!t) continue;
    t.gpx_path = `/gpx/${slug}.gpx`;
    t.distance_km = r.km;
    const gl = gainLoss(r.pts);
    t.elevation_gain_m = gl.gain;
    t.elevation_loss_m = gl.loss;
    t.start.coords = { lat: +r.pts[0][1].toFixed(6), lng: +r.pts[0][0].toFixed(6) };
    t.end.coords = { lat: +r.pts[r.pts.length - 1][1].toFixed(6), lng: +r.pts[r.pts.length - 1][0].toFixed(6) };
  }
  fs.writeFileSync('src/data/trails-routes.json', JSON.stringify(routes, null, 2) + '\n');
}
console.log('✓ record aggiornati');
