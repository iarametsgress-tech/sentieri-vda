/** Risolve via Overpass i punti non confermati da Nominatim. */
import fs from 'node:fs';

const resolved = JSON.parse(fs.readFileSync('scripts/tours/points-resolved.json', 'utf8'));
const { POINTS } = await import('./points.mjs');

const TODO = {
  'rifugio-bertone': 'node["tourism"="alpine_hut"]["name"~"Bertone",i]',
  'alpage-bovine': 'node["name"~"Bovine",i]',
  trient: 'node["place"~"village|hamlet"]["name"="Trient"]',
  'lac-combal': 'way["natural"="water"]["name"~"Combal",i];node["name"~"Combal",i]',
  'col-pinter': 'node["natural"="saddle"]["name"~"Pinter",i];node["name"~"Colle Pinter",i]',
  gruben: 'node["name"~"Gruben",i]["place"];node["name"="Gruben"]',
  'col-de-torrent': 'node["natural"="saddle"]["name"~"Col de Torrent",i]',
  'col-di-valcournera': 'node["name"~"Valcournera",i]',
  planaval: 'node["place"~"village|hamlet"]["name"~"Planaval",i]',
  'le-monal': 'node["name"~"Monal",i]',
  'col-de-sorebois': 'node["name"~"Sorebois",i]',
  'barrage-de-moiry': 'node["name"~"Moiry",i];way["name"~"Barrage de Moiry",i]',
  'col-des-otanes': 'node["name"~"Otanes",i]',
  mauvoisin: 'node["name"~"Mauvoisin",i]',
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

for (const [key, selectors] of Object.entries(TODO)) {
  const p = POINTS[key];
  const [lng, lat] = p.lnglat;
  const around = `(around:8000,${lat},${lng})`;
  const parts = selectors
    .split(';')
    .map((s) => `${s.trim()}${around};`)
    .join('\n');
  const query = `[out:json][timeout:25];(\n${parts}\n);out center 5;`;
  try {
    let data = null;
    for (const endpoint of [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.private.coffee/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
    ]) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'SentieriVdaBot/1.0 (https://sentierivda.it; dati sentieri)',
          },
          body: `data=${encodeURIComponent(query)}`,
          signal: AbortSignal.timeout(30000),
        });
        if (!res.ok) continue;
        data = await res.json();
        break;
      } catch {}
    }
    if (!data) throw new Error('tutti gli endpoint falliti');
    const els = (data.elements ?? []).map((e) => ({
      name: e.tags?.name,
      lnglat: e.type === 'node' ? [e.lon, e.lat] : [e.center?.lon, e.center?.lat],
      ele: e.tags?.ele,
    }));
    if (els.length) {
      const best = els.sort((a, b) => haversineKm(p.lnglat, a.lnglat) - haversineKm(p.lnglat, b.lnglat))[0];
      const d = haversineKm(p.lnglat, best.lnglat);
      resolved[key] = { ...p, lnglat: best.lnglat, check: `overpass ${d.toFixed(2)}km (${best.name})` };
      console.log(`OK  ${key}  Δ${d.toFixed(2)}km  ${best.name}  ele=${best.ele ?? '?'}`);
    } else {
      resolved[key] = resolved[key] ?? { ...p, check: 'prior' };
      console.log(`??  ${key}  nessun risultato — prior`);
    }
  } catch (e) {
    resolved[key] = resolved[key] ?? { ...p, check: 'prior' };
    console.log(`ERR ${key} ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 1500));
}
fs.writeFileSync('scripts/tours/points-resolved.json', JSON.stringify(resolved, null, 1));
console.log('aggiornato points-resolved.json');
