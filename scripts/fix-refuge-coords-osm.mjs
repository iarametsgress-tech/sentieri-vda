/**
 * Verifica e corregge le coordinate dei rifugi contro OSM.
 * 1° passaggio: match per nome sul dump locale _osm_huts.json
 * 2° passaggio: Nominatim per i non risolti
 * Applica la correzione solo con match di nome affidabile.
 * Uso: node scripts/fix-refuge-coords-osm.mjs [--apply]
 */
import fs from 'node:fs';

const APPLY = process.argv.includes('--apply');
const refuges = JSON.parse(fs.readFileSync('src/data/refuges.json', 'utf8'));
const hutsDump = JSON.parse(fs.readFileSync('../../_osm_huts.json', 'utf8'));
const huts = (hutsDump.elements ?? hutsDump).filter((e) => e.tags?.name);

function norm(s) {
  return (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\b(rifugio|bivacco|capanna|refuge|cabane|hutte|hütte|alpe|alpeggio|posto tappa|dortoir|gite d.etape|du|de|della|del|des|d|la|le|les|al|all|aux|en)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokens(s) {
  return new Set(norm(s).split(' ').filter((w) => w.length >= 3));
}

function haversineM(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let fixed = 0;
let okCount = 0;
const unresolved = [];

for (const r of refuges) {
  const tr = tokens(r.name_it);
  let best = null;
  let bestScore = 0;
  for (const h of huts) {
    const th = tokens(h.tags.name);
    let shared = 0;
    for (const t of tr) if (th.has(t)) shared++;
    const score = shared / Math.max(1, Math.min(tr.size, th.size));
    if (shared >= 1 && score > bestScore) {
      bestScore = score;
      best = h;
    }
  }
  let cand = null;
  if (best && bestScore >= 0.99) {
    cand = { lat: best.lat ?? best.center?.lat, lng: best.lon ?? best.center?.lon, src: `osm-dump (${best.tags.name})` };
  } else {
    // Nominatim
    for (const q of [r.name_it + ", Valle d'Aosta", r.name_it]) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&q=${encodeURIComponent(q)}`,
          { headers: { 'User-Agent': 'SentieriVdaBot/1.0 (sentierivda.it)' }, signal: AbortSignal.timeout(20000) }
        );
        const items = await res.json();
        const hit = items.find((it) =>
          ['alpine_hut', 'wilderness_hut', 'hut', 'shelter', 'hostel', 'guest_house', 'hotel'].includes(it.type)
        );
        if (hit) {
          cand = { lat: +hit.lat, lng: +hit.lon, src: `nominatim (${hit.display_name?.slice(0, 50)})` };
        }
      } catch {}
      await sleep(1100);
      if (cand) break;
    }
  }

  if (!cand) {
    unresolved.push(r.slug);
    continue;
  }
  const d = haversineM(r.coords, cand);
  if (d <= 250) {
    okCount++;
    continue;
  }
  if (d > 30000) {
    console.log(`SKIP ${r.slug}: candidato a ${(d / 1000).toFixed(1)}km — sospetto (${cand.src})`);
    unresolved.push(r.slug);
    continue;
  }
  console.log(`FIX  ${r.slug}: Δ${Math.round(d)}m  ${r.coords.lat},${r.coords.lng} → ${cand.lat.toFixed(6)},${cand.lng.toFixed(6)}  [${cand.src}]`);
  if (APPLY) {
    r.coords = { lat: +cand.lat.toFixed(6), lng: +cand.lng.toFixed(6) };
  }
  fixed++;
}

if (APPLY) fs.writeFileSync('src/data/refuges.json', JSON.stringify(refuges, null, 2) + '\n');
console.log(`\nok(<250m): ${okCount} · corretti: ${fixed} · non risolti: ${unresolved.length}`);
console.log('non risolti:', unresolved.join(', '));
