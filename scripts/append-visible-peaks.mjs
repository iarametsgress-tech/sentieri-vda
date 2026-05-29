/**
 * Aggiunge vette visibili (già in peaks.json) alle schede sentiero nearby_peaks.
 * Run: node scripts/append-visible-peaks.mjs && node scripts/merge-trail-enrichment.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Vette supplementari per slug — distanze stimate linea d'aria, quote da UIAA/catalogo */
const SUPPLEMENTS = {
  'alta-via-1-tappa-2-perloz-rifugio-coda': [
    { name: 'Monte Rosa', elevation_m: 4634, distance_km: 15 },
  ],
  'alta-via-1-tappa-3-rifugio-coda-rifugio-barma': [
    { name: 'Lyskamm', elevation_m: 4527, distance_km: 10 },
    { name: 'Piramide Vincent', elevation_m: 4215, distance_km: 14 },
  ],
  'alta-via-1-tappa-5-niel-gressoney-saint-jean': [
    { name: 'Punta Gnifetti (Signalkuppe)', elevation_m: 4554, distance_km: 11 },
    { name: 'Punta Parrot', elevation_m: 4432, distance_km: 12 },
  ],
  'alta-via-1-tappa-6-gressoney-saint-jean-rifugio-vieux-crest': [
    { name: 'Lyskamm', elevation_m: 4527, distance_km: 9 },
    { name: "Dent d'Hérens", elevation_m: 4177, distance_km: 18 },
  ],
  'alta-via-1-tappa-7-rifugio-vieux-crest-rifugio-grand-tournalin': [
    { name: "Dent d'Hérens", elevation_m: 4177, distance_km: 6 },
    { name: 'Mont Nery', elevation_m: 3075, distance_km: 8 },
  ],
  'alta-via-1-tappa-8-rifugio-grand-tournalin-valtournenche': [
    { name: "Dent d'Hérens", elevation_m: 4177, distance_km: 5 },
  ],
  'alta-via-1-tappa-9-valtournenche-rifugio-barmasse': [
    { name: "Dent d'Hérens", elevation_m: 4177, distance_km: 7 },
  ],
  'alta-via-1-tappa-10-rifugio-barmasse-rifugio-cuney': [
    { name: "Dent d'Hérens", elevation_m: 4177, distance_km: 6 },
    { name: 'Mont Vélan', elevation_m: 3734, distance_km: 12 },
  ],
  'alta-via-2-tappa-1-courmayeur-rifugio-elisabetta': [
    { name: 'Grandes Jorasses', elevation_m: 4208, distance_km: 10 },
  ],
  'alta-via-2-tappa-6-rifugio-chalet-epee-rhemes-notre-dame': [
    { name: 'Becca di Nona', elevation_m: 3142, distance_km: 10 },
  ],
  'alta-via-2-tappa-7-rhemes-notre-dame-eaux-rousses': [
    { name: 'Becca di Moncorvé', elevation_m: 3384, distance_km: 8 },
    { name: 'Becca di Nona', elevation_m: 3142, distance_km: 6 },
  ],
  'alta-via-2-tappa-8-eaux-rousses-rifugio-vittorio-sella': [
    { name: 'Becca di Moncorvé', elevation_m: 3384, distance_km: 5 },
  ],
  'alta-via-2-tappa-9-rifugio-vittorio-sella-cogne': [
    { name: 'Becca di Moncorvé', elevation_m: 3384, distance_km: 6 },
    { name: 'Becca di Nona', elevation_m: 3142, distance_km: 8 },
  ],
  'alta-via-2-tappa-10-cogne-rifugio-sogno-berdze': [
    { name: 'Becca di Nona', elevation_m: 3142, distance_km: 5 },
  ],
  'tour-mont-blanc-tappa-1-courmayeur-rifugio-bertone': [
    { name: 'Grandes Jorasses', elevation_m: 4208, distance_km: 8 },
  ],
  'tour-mont-blanc-tappa-3-rifugio-bonatti-rifugio-elena': [
    { name: 'Grandes Jorasses', elevation_m: 4208, distance_km: 2 },
  ],
  'tour-mont-blanc-tappa-4-rifugio-elena-col-seigne': [
    { name: 'Grandes Jorasses', elevation_m: 4208, distance_km: 6 },
  ],
  'tour-monte-rosa-tappa-1-gressoney-rifugio-gabiet': [
    { name: 'Monte Rosa', elevation_m: 4634, distance_km: 7 },
    { name: 'Punta Gnifetti (Signalkuppe)', elevation_m: 4554, distance_km: 8 },
    { name: 'Piramide Vincent', elevation_m: 4215, distance_km: 7 },
    { name: 'Balmenhorn', elevation_m: 4167, distance_km: 8 },
  ],
  'tour-monte-rosa-tappa-2-rifugio-gabiet-colle-teodulo': [
    { name: 'Punta Nordend', elevation_m: 4609, distance_km: 7 },
    { name: 'Punta Zumstein', elevation_m: 4563, distance_km: 6 },
    { name: 'Lyskamm', elevation_m: 4527, distance_km: 4 },
    { name: "Dent d'Hérens", elevation_m: 4177, distance_km: 8 },
  ],
  'tour-monte-rosa-tappa-3-valtournenche-champoluc': [
    { name: "Dent d'Hérens", elevation_m: 4177, distance_km: 4 },
    { name: 'Monte Rosa', elevation_m: 4634, distance_km: 8 },
  ],
  'tour-monte-rosa-tappa-4-breuil-gressoney': [
    { name: 'Lyskamm', elevation_m: 4527, distance_km: 8 },
    { name: 'Punta Parrot', elevation_m: 4432, distance_km: 10 },
    { name: 'Piramide Vincent', elevation_m: 4215, distance_km: 9 },
  ],
  'tour-cervino-tappa-1-breuil-rifugio-duca-abruzzi': [
    { name: "Dent d'Hérens", elevation_m: 4177, distance_km: 5 },
  ],
  'tour-cervino-tappa-2-rifugio-duca-orionde': [
    { name: "Dent d'Hérens", elevation_m: 4177, distance_km: 4 },
  ],
  'tour-cervino-tappa-3-rifugio-orionde-colle-teodulo': [
    { name: 'Lyskamm', elevation_m: 4527, distance_km: 7 },
    { name: "Dent d'Hérens", elevation_m: 4177, distance_km: 6 },
    { name: 'Punta Gnifetti (Signalkuppe)', elevation_m: 4554, distance_km: 9 },
    { name: 'Monte Rosa', elevation_m: 4634, distance_km: 7 },
  ],
  'tour-gran-paradiso-tappa-2-valnontey-lago-djouan': [
    { name: 'Becca di Moncorvé', elevation_m: 3384, distance_km: 3 },
    { name: 'Becca di Nona', elevation_m: 3142, distance_km: 8 },
  ],
  'tour-gran-paradiso-tappa-3-lago-djouan-eaux-rousses': [
    { name: 'Becca di Moncorvé', elevation_m: 3384, distance_km: 2 },
  ],
  'tour-gran-paradiso-tappa-4-eaux-rousses-rifugio-vittorio-sella': [
    { name: 'Becca di Moncorvé', elevation_m: 3384, distance_km: 4 },
  ],
  'tour-gran-combin-tappa-1-ollomont-rifugio-prarayer': [
    { name: 'Mont Vélan', elevation_m: 3734, distance_km: 8 },
  ],
  'tour-gran-combin-tappa-2-rifugio-prarayer-col-gran-san-bernardo': [
    { name: 'Mont Vélan', elevation_m: 3734, distance_km: 6 },
    { name: 'Monte Bianco', elevation_m: 4808, distance_km: 14 },
  ],
  'tour-gran-combin-tappa-3-col-gran-san-bernardo-ollomont': [
    { name: 'Mont Vélan', elevation_m: 3734, distance_km: 5 },
  ],
  'tour-rutor-tappa-3-lago-rutor-rifugio-verney': [
    { name: 'Dôme de Rutor', elevation_m: 3486, distance_km: 3 },
  ],
};

function norm(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function mergePeaks(existing = [], extra = []) {
  const map = new Map();
  for (const p of existing) map.set(norm(p.name), p);
  for (const p of extra) {
    const key = norm(p.name);
    if (!map.has(key)) map.set(key, p);
  }
  return [...map.values()];
}

function patchTrailList(trails, label) {
  let patched = 0;
  for (const trail of trails) {
    const extra = SUPPLEMENTS[trail.slug];
    if (!extra?.length) continue;
    const before = trail.nearby_peaks?.length ?? 0;
    trail.nearby_peaks = mergePeaks(trail.nearby_peaks, extra);
    if (trail.nearby_peaks.length > before) patched++;
  }
  console.log(`${label}: patched ${patched} trails`);
}

function patchEnrichment(enrichment) {
  let patched = 0;
  for (const [slug, extra] of Object.entries(SUPPLEMENTS)) {
    if (!enrichment[slug]) continue;
    const before = enrichment[slug].nearby_peaks?.length ?? 0;
    enrichment[slug].nearby_peaks = mergePeaks(enrichment[slug].nearby_peaks, extra);
    if (enrichment[slug].nearby_peaks.length > before) patched++;
  }
  // Corregge quota Becca di Moncorvé (UIAA)
  const djouan = enrichment['lago-djouan-cogne'];
  if (djouan?.nearby_peaks) {
    for (const p of djouan.nearby_peaks) {
      if (norm(p.name) === norm('Becca di Moncorvé')) p.elevation_m = 3384;
    }
  }
  console.log(`enrichment: patched ${patched} entries`);
}

const enrichmentPath = resolve(root, 'src/data/trail-enrichment.json');
const routesPath = resolve(root, 'src/data/trails-routes.json');
const trailsPath = resolve(root, 'src/data/trails.json');
const peaksPath = resolve(root, 'src/data/environment/peaks.json');

const enrichment = JSON.parse(readFileSync(enrichmentPath, 'utf8'));
const routes = JSON.parse(readFileSync(routesPath, 'utf8'));
const trails = JSON.parse(readFileSync(trailsPath, 'utf8'));
const peaks = JSON.parse(readFileSync(peaksPath, 'utf8'));

patchEnrichment(enrichment);
patchTrailList(routes, 'trails-routes');
patchTrailList(trails, 'trails');

writeFileSync(enrichmentPath, `${JSON.stringify(enrichment, null, 2)}\n`, 'utf8');
writeFileSync(routesPath, `${JSON.stringify(routes, null, 2)}\n`, 'utf8');
writeFileSync(trailsPath, `${JSON.stringify(trails, null, 2)}\n`, 'utf8');

// Aggiorna on_trails nel catalogo vette
const cited = new Set();
for (const t of [...trails, ...routes]) {
  for (const p of t.nearby_peaks ?? []) cited.add(norm(p.name));
}
const aliases = {
  'monte rosa': 'monte-rosa-dufour',
  'monte bianco': 'mont-blanc',
  'mont blanc': 'mont-blanc',
  'gran combin': 'grand-combin',
  'grand combin': 'grand-combin',
  'combin de grafeneire': 'grand-combin',
  lyskamm: 'lyskamm',
  'dome de rutor': 'dome-rutor',
  'dôme de rutor': 'dome-rutor',
};
const nameToId = new Map();
for (const peak of peaks) {
  for (const raw of [peak.name_it, peak.name_en]) {
    nameToId.set(norm(raw), peak.id);
    nameToId.set(norm(raw.replace(/\s*\([^)]*\)\s*$/, '').trim()), peak.id);
  }
}
for (const [alias, id] of Object.entries(aliases)) nameToId.set(norm(alias), id);

const citedIds = new Set();
for (const name of cited) {
  const id = nameToId.get(name);
  if (id) citedIds.add(id);
}

let onTrailsUpdated = 0;
for (const peak of peaks) {
  if (citedIds.has(peak.id) && !peak.on_trails) {
    peak.on_trails = true;
    onTrailsUpdated++;
  }
}
writeFileSync(peaksPath, `${JSON.stringify(peaks, null, 2)}\n`, 'utf8');
console.log(`peaks.json: set on_trails for ${onTrailsUpdated} newly cited peaks`);
console.log(`Total unique cited peak names: ${cited.size}`);
