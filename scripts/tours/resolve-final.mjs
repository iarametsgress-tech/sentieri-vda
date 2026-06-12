/** Ultimo giro di risoluzione con query Nominatim specifiche. */
import fs from 'node:fs';

const resolved = JSON.parse(fs.readFileSync('scripts/tours/points-resolved.json', 'utf8'));

const QUERIES = {
  'rifugio-bertone': 'Rifugio Bertone, Courmayeur',
  'alpage-bovine': 'Alpage de Bovine, Martigny-Combe',
  trient: 'Trient, Valais, Suisse',
  'lac-combal': 'Lac Combal, Courmayeur',
  'col-pinter': 'Colle Pinter, Ayas',
  'col-de-torrent': 'Col de Torrent, Evolène',
  'le-monal': 'Le Monal, Sainte-Foy-Tarentaise',
  'col-de-sorebois': 'Col de Sorebois, Anniviers',
  'barrage-de-moiry': 'Lac de Moiry, Grimentz',
  'col-des-otanes': 'Col des Otanes, Val de Bagnes',
  mauvoisin: 'Mauvoisin, Val de Bagnes',
};

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[1] * Math.PI) / 180) * Math.cos((b[1] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

for (const [key, q] of Object.entries(QUERIES)) {
  const prior = resolved[key].lnglat;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SentieriVdaBot/1.0 (sentierivda.it; data check)' },
      signal: AbortSignal.timeout(20000),
    });
    const items = await res.json();
    let done = false;
    for (const it of items) {
      const cand = [parseFloat(it.lon), parseFloat(it.lat)];
      const d = haversineKm(prior, cand);
      console.log(`${key}  Δ${d.toFixed(2)}km  [${it.type}] ${it.display_name?.slice(0, 80)}`);
      if (!done && d < 6) {
        resolved[key] = { ...resolved[key], lnglat: cand, check: `nominatim2 ${d.toFixed(2)}km` };
        done = true;
      }
    }
    if (!done) console.log(`${key}  — nessun candidato accettato, resta ${resolved[key].check}`);
  } catch (e) {
    console.log(`${key} ERR ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 1100));
}
fs.writeFileSync('scripts/tours/points-resolved.json', JSON.stringify(resolved, null, 1));
console.log('aggiornato.');
