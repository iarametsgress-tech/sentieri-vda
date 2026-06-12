/**
 * Verifica i punti del gazetteer contro Nominatim (OSM).
 * Se il match è entro 4 km dal prior lo adotta, altrimenti segnala.
 * Output: scripts/tours/points-resolved.json
 */
import fs from 'node:fs';
import { POINTS } from './points.mjs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[1] * Math.PI) / 180) * Math.cos((b[1] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

const out = {};
for (const [key, p] of Object.entries(POINTS)) {
  let resolved = null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&q=${encodeURIComponent(p.q)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SentieriVdaBot/1.0 (sentierivda.it; data check)' },
      signal: AbortSignal.timeout(20000),
    });
    const items = await res.json();
    for (const it of items) {
      const cand = [parseFloat(it.lon), parseFloat(it.lat)];
      const d = haversineKm(p.lnglat, cand);
      if (d < 4) {
        resolved = { lnglat: cand, dKm: +d.toFixed(2), label: it.display_name?.slice(0, 70) };
        break;
      }
    }
  } catch {}
  if (resolved) {
    out[key] = { ...p, lnglat: resolved.lnglat, check: `nominatim ${resolved.dKm}km` };
    console.log(`OK  ${key}  Δ${resolved.dKm}km  ${resolved.label}`);
  } else {
    out[key] = { ...p, check: 'prior (no nominatim match <4km)' };
    console.log(`??  ${key}  — uso prior ${p.lnglat}`);
  }
  await sleep(1100);
}
fs.writeFileSync('scripts/tours/points-resolved.json', JSON.stringify(out, null, 1));
console.log('\nscritto points-resolved.json');
