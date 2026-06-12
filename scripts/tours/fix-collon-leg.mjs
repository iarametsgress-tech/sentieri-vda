/** Riprova la tratta Prarayer→Nacamuli (sentiero reale) e ricuce il GPX del Col Collon. */
import fs from 'node:fs';

const P = {
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
function parseGpx(g) {
  const pts = [];
  const re = /<trkpt lon="([^"]+)" lat="([^"]+)">(?:<ele>([^<]+)<\/ele>)?/g;
  let m;
  while ((m = re.exec(g)) !== null) pts.push([+m[1], +m[2], m[3] != null ? +m[3] : null]);
  return pts;
}
function interpolate(a, b, stepM = 90) {
  const n = Math.max(2, Math.ceil(haversineM(a, b) / stepM));
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.round(a[2] + (b[2] - a[2]) * t)]);
  }
  return out;
}

let leg = null;
for (let attempt = 0; attempt < 4 && !leg; attempt++) {
  try {
    const res = await fetch(
      `https://brouter.de/brouter?lonlats=${P.prarayer[0]},${P.prarayer[1]}|${P.nacamuli[0]},${P.nacamuli[1]}&profile=hiking-mountain&alternativeidx=0&format=gpx`,
      { signal: AbortSignal.timeout(120000) }
    );
    const text = await res.text();
    if (res.ok && text.startsWith('<?xml')) leg = parseGpx(text);
    else console.log('HTTP', res.status, text.slice(0, 80));
  } catch (e) {
    console.log('tentativo', attempt + 1, e.message);
  }
  await new Promise((r) => setTimeout(r, 3000));
}
if (!leg) {
  console.log('✗ ancora niente: lascio il corridoio attuale');
  process.exit(0);
}
const km1 = leg.reduce((a, p, i) => (i ? a + haversineM(leg[i - 1], p) : 0), 0) / 1000;
console.log(`✓ prarayer→nacamuli routed: ${km1.toFixed(1)}km (${leg.length}pts)`);

// ricuci: routed + corridoi ghiacciaio + arolla-alta→arolla (riuso dal gpx esistente)
const existing = parseGpx(fs.readFileSync('public/gpx/tour-cervino-tappa-2-rifugio-prarayer-arolla.gpx', 'utf8'));
// trova l'indice del punto più vicino ad arolla-alta nel gpx esistente (da lì in poi è routed)
let bestI = 0;
let bestD = 1e12;
existing.forEach((p, i) => {
  const d = haversineM(p, P['arolla-alta']);
  if (d < bestD) {
    bestD = d;
    bestI = i;
  }
});
const tail = existing.slice(bestI);
const pts = [
  ...leg,
  ...interpolate(P.nacamuli, P.collon).slice(1),
  ...interpolate(P.collon, P['arolla-alta']).slice(1),
  ...tail.slice(1),
];
const km = pts.reduce((a, p, i) => (i ? a + haversineM(pts[i - 1], p) : 0), 0) / 1000;

const body = pts
  .map((p) =>
    p[2] != null
      ? `<trkpt lon="${p[0].toFixed(6)}" lat="${p[1].toFixed(6)}"><ele>${p[2]}</ele></trkpt>`
      : `<trkpt lon="${p[0].toFixed(6)}" lat="${p[1].toFixed(6)}"></trkpt>`
  )
  .join('\n');
const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Sentieri VdA / OpenStreetMap">
<metadata><name>Col Collon — Prarayer → Arolla</name><desc>Itinerario di valico storico: tratto su ghiacciaio indicativo, solo con guida alpina</desc></metadata>
<trk><name>Col Collon — Prarayer → Arolla</name><trkseg>
${body}
</trkseg></trk>
</gpx>`;
fs.writeFileSync('public/gpx/tour-cervino-tappa-2-rifugio-prarayer-arolla.gpx', gpx);

const routes = JSON.parse(fs.readFileSync('src/data/trails-routes.json', 'utf8'));
const t = routes.find((x) => x.slug === 'tour-cervino-tappa-2-rifugio-prarayer-arolla');
t.distance_km = +km.toFixed(1);
let gain = 0, loss = 0, prev = null;
for (const p of pts) {
  if (p[2] == null) continue;
  if (prev != null) {
    const d = p[2] - prev;
    if (d > 0) gain += d;
    else loss -= d;
  }
  prev = p[2];
}
t.elevation_gain_m = Math.round(gain);
t.elevation_loss_m = Math.round(loss);
fs.writeFileSync('src/data/trails-routes.json', JSON.stringify(routes, null, 2) + '\n');
console.log(`✓ gpx ricucito: ${km.toFixed(1)}km, +${Math.round(gain)}m`);
