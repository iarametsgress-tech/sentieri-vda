/**
 * Collega ogni rifugio ai sentieri REALI del Catasto (trails-skeleton.json)
 * il cui punto di inizio/fine cade entro 500 m dal rifugio.
 * Le tracce GPX di questi sentieri alimentano la mini-mappa di accesso.
 * Uso: node scripts/link-refuge-trails.mjs [--apply]
 */
import fs from 'node:fs';

const APPLY = process.argv.includes('--apply');
const RADIUS = +(process.argv.find((a) => a.startsWith('--radius='))?.split('=')[1] ?? 500);
const ONLY_EMPTY = process.argv.includes('--only-empty');
const refuges = JSON.parse(fs.readFileSync('src/data/refuges.json', 'utf8'));
const skeletons = JSON.parse(fs.readFileSync('src/data/trails-skeleton.json', 'utf8'));
const routes = JSON.parse(fs.readFileSync('src/data/trails-routes.json', 'utf8'));
const curated = JSON.parse(fs.readFileSync('src/data/trails.json', 'utf8'));
const validSlugs = new Set([
  ...skeletons.map((t) => t.slug),
  ...routes.map((t) => t.slug),
  ...curated.map((t) => t.slug),
]);

function haversineM(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

let linked = 0;
let stillEmpty = [];
let removedDead = 0;

for (const r of refuges) {
  // 1. elimina riferimenti a sentieri inesistenti
  const before = r.trails?.length ?? 0;
  r.trails = (r.trails ?? []).filter((s) => validSlugs.has(s));
  removedDead += before - r.trails.length;

  if (ONLY_EMPTY && r.trails.length) continue;

  // 2. candidati skeleton con estremo entro RADIUS m
  const cands = [];
  for (const t of skeletons) {
    if (!t.gpx_path) continue;
    for (const endpoint of [t.start, t.end]) {
      if (!endpoint?.coords) continue;
      const d = haversineM(r.coords, endpoint.coords);
      if (d <= RADIUS) {
        cands.push({ slug: t.slug, d });
        break;
      }
    }
  }
  cands.sort((a, b) => a.d - b.d);
  const add = cands.filter((c) => !r.trails.includes(c.slug)).slice(0, 5);
  if (add.length) {
    r.trails = [...r.trails, ...add.map((c) => c.slug)];
    linked++;
    console.log(`+ ${r.slug}: ${add.map((c) => `${c.slug}(${Math.round(c.d)}m)`).join(', ')}`);
  }
  if (!r.trails.length) stillEmpty.push(r.slug);
}

if (APPLY) fs.writeFileSync('src/data/refuges.json', JSON.stringify(refuges, null, 2) + '\n');
console.log(`\nrifugi con nuovi sentieri: ${linked} · riferimenti morti rimossi: ${removedDead}`);
console.log(`ancora senza sentieri (${stillEmpty.length}):`, stillEmpty.join(', '));
