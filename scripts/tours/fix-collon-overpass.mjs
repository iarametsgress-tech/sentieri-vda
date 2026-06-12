/** Prarayer→Nacamuli dai segmenti OSM (Overpass + cucitura greedy). */
import fs from 'node:fs';

const START = { lat: 45.892, lng: 7.512 }; // Prarayer
const END = { lat: 45.9495, lng: 7.5077 }; // Rifugio Nacamuli

function haversineM(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

const query = `[out:json][timeout:40];
way["highway"~"path|footway|track"](45.885,7.47,45.96,7.55);
out geom;`;
let ways = [];
for (const ep of ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']) {
  try {
    const res = await fetch(ep, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SentieriVdaBot/1.0 (https://sentierivda.it)',
      },
      body: 'data=' + encodeURIComponent(query),
      signal: AbortSignal.timeout(50000),
    });
    if (!res.ok) continue;
    const data = await res.json();
    ways = (data.elements ?? []).filter((e) => e.type === 'way' && e.geometry?.length > 3);
    if (ways.length) break;
  } catch {}
}
console.log('ways:', ways.length);
if (!ways.length) process.exit(1);

function wayLen(w) {
  let s = 0;
  for (let i = 1; i < w.geometry.length; i++) {
    s += haversineM({ lat: w.geometry[i - 1].lat, lng: w.geometry[i - 1].lon }, { lat: w.geometry[i].lat, lng: w.geometry[i].lon });
  }
  return s;
}
function orient(w, cur, end) {
  const f = w.geometry[0];
  const l = w.geometry[w.geometry.length - 1];
  const sN = haversineM(cur, { lat: f.lat, lng: f.lon }) + haversineM(end, { lat: l.lat, lng: l.lon });
  const sR = haversineM(cur, { lat: l.lat, lng: l.lon }) + haversineM(end, { lat: f.lat, lng: f.lon });
  return sR < sN ? { ...w, geometry: [...w.geometry].reverse() } : w;
}

const used = new Set();
let cur = START;
let path = [];
for (let step = 0; step < 60 && haversineM(cur, END) > 250; step++) {
  let best = null;
  let bestScore = Infinity;
  for (const w of ways) {
    if (used.has(w.id)) continue;
    const o = orient(w, cur, END);
    const f = o.geometry[0];
    const dStart = haversineM(cur, { lat: f.lat, lng: f.lon });
    if (dStart > (step === 0 ? 500 : 200)) continue;
    const l = o.geometry[o.geometry.length - 1];
    const dEnd = haversineM(END, { lat: l.lat, lng: l.lon });
    const score = dStart * 2 + dEnd - wayLen(o) * 0.05;
    if (score < bestScore) {
      bestScore = score;
      best = o;
    }
  }
  if (!best) break;
  used.add(best.id);
  const seg = best.geometry.map((p) => ({ lat: p.lat, lng: p.lon }));
  path = path.length ? [...path, ...seg.slice(1)] : seg;
  cur = path[path.length - 1];
}
const finalGap = haversineM(cur, END);
console.log('punti:', path.length, 'gap finale:', Math.round(finalGap), 'm');
if (path.length < 50 || finalGap > 900) {
  console.log('✗ cucitura insufficiente, lascio il corridoio');
  process.exit(0);
}
// chiusura del gap fino al rifugio
const n = Math.ceil(finalGap / 80);
for (let i = 1; i <= n; i++) {
  path.push({ lat: cur.lat + ((END.lat - cur.lat) * i) / n, lng: cur.lng + ((END.lng - cur.lng) * i) / n });
}

// ricuci il gpx: nuovo leg + resto (da nacamuli in poi) del file esistente
const re = /<trkpt lon="([^"]+)" lat="([^"]+)">(?:<ele>([^<]+)<\/ele>)?/g;
const existing = [];
let m;
const g = fs.readFileSync('public/gpx/tour-cervino-tappa-2-rifugio-prarayer-arolla.gpx', 'utf8');
while ((m = re.exec(g)) !== null) existing.push({ lng: +m[1], lat: +m[2], ele: m[3] != null ? +m[3] : null });
let bi = 0;
let bd = 1e12;
existing.forEach((p, i) => {
  const d = haversineM(p, END);
  if (d < bd) {
    bd = d;
    bi = i;
  }
});
const tail = existing.slice(bi);
const pts = [...path.map((p) => ({ ...p, ele: null })), ...tail];
let km = 0;
for (let i = 1; i < pts.length; i++) km += haversineM(pts[i - 1], pts[i]);
km /= 1000;

const body = pts
  .map((p) =>
    p.ele != null
      ? `<trkpt lon="${p.lng.toFixed(6)}" lat="${p.lat.toFixed(6)}"><ele>${p.ele}</ele></trkpt>`
      : `<trkpt lon="${p.lng.toFixed(6)}" lat="${p.lat.toFixed(6)}"></trkpt>`
  )
  .join('\n');
fs.writeFileSync(
  'public/gpx/tour-cervino-tappa-2-rifugio-prarayer-arolla.gpx',
  `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Sentieri VdA / OpenStreetMap">
<metadata><name>Col Collon — Prarayer → Arolla</name><desc>Itinerario di valico storico: tratto su ghiacciaio indicativo, solo con guida alpina</desc></metadata>
<trk><name>Col Collon — Prarayer → Arolla</name><trkseg>
${body}
</trkseg></trk>
</gpx>`
);
const routes = JSON.parse(fs.readFileSync('src/data/trails-routes.json', 'utf8'));
const t = routes.find((x) => x.slug === 'tour-cervino-tappa-2-rifugio-prarayer-arolla');
t.distance_km = +km.toFixed(1);
fs.writeFileSync('src/data/trails-routes.json', JSON.stringify(routes, null, 2) + '\n');
console.log(`✓ gpx ricucito con sentiero OSM: ${km.toFixed(1)}km`);
