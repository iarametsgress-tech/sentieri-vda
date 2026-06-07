/* Corregge le coordinate dei rifugi/bivacchi abbinandoli ai nodi OpenStreetMap
 * (fonte ammessa). Match per token distintivi del nome. DRY-RUN di default;
 * passare --write per scrivere refuges.json. Nessuna coord inventata: si
 * aggiorna SOLO dove il match è univoco e affidabile. */
const fs = require('fs');
const path = require('path');
const REF = path.join(__dirname, '..', 'src', 'data', 'refuges.json');
const OSM = path.join(__dirname, '..', '..', '..', '_osm_huts.json');
const WRITE = process.argv.includes('--write');

const GENERIC = new Set([
  'rifugio', 'rifugi', 'refuge', 'refuges', 'rifuge', 'bivacco', 'bivouac', 'biv',
  'cabane', 'capanna', 'hut', 'huette', 'hütte', 'casa', 'chalet', 'ricovero',
  'di', 'de', 'del', 'della', 'dello', 'dei', 'delle', 'da', 'la', 'le', 'il',
  'lo', 'l', 'd', 'al', 'au', 'a', 'e', 'et', 'the', 'cai', 'cas', 'sezione',
  'monte', 'mont', 'col', 'colle', 'lac', 'lago', 'alpe', 'alpage', 'punta',
]);

function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function tokens(s) {
  return norm(s)
    .split(' ')
    .filter((t) => t.length >= 3 && !GENERIC.has(t));
}

const refData = JSON.parse(fs.readFileSync(REF, 'utf8'));
const refs = Array.isArray(refData) ? refData : refData.refuges;
const osm = JSON.parse(fs.readFileSync(OSM, 'utf8')).elements
  .filter((e) => e.tags && e.tags.name && (e.lat || e.center))
  .map((e) => ({
    name: e.tags.name,
    lat: e.lat ?? e.center.lat,
    lon: e.lon ?? e.center.lon,
    toks: tokens(e.tags.name),
  }));

/** Match affidabile: >=2 token distintivi condivisi, OPPURE un insieme è
 *  sottoinsieme dell'altro con un token raro (len>=6). Evita i falsi positivi
 *  su nomi propri comuni (Vittorio, Federico, Grand, ...). */
function matchInfo(refToks, osmToks) {
  const setO = new Set(osmToks);
  const setR = new Set(refToks);
  const shared = refToks.filter((t) => setO.has(t));
  const sharedLong = shared.filter((t) => t.length >= 6);
  const subset =
    (osmToks.length > 0 && osmToks.every((t) => setR.has(t))) ||
    (refToks.length > 0 && refToks.every((t) => setO.has(t)));
  const ok = shared.length >= 2 || (shared.length === 1 && sharedLong.length === 1 && subset);
  return { ok, shared };
}

let updated = 0, rejected = 0, nomatch = 0;
const report = [];
for (const r of refs) {
  const rt = tokens(r.name_it);
  const candidates = osm
    .map((o) => ({ o, m: matchInfo(rt, o.toks) }))
    .filter((c) => c.m.ok)
    .sort((a, b) => b.m.shared.length - a.m.shared.length);

  if (candidates.length === 1 || (candidates.length > 1 && candidates[0].m.shared.length > candidates[1].m.shared.length)) {
    const best = candidates[0].o;
    const moved = Math.abs(best.lat - r.coords.lat) > 0.002 || Math.abs(best.lon - r.coords.lng) > 0.002;
    report.push(`OK   ${r.name_it}  ->  OSM "${best.name}"  (${best.lat.toFixed(4)},${best.lon.toFixed(4)})  ${moved ? 'Δ MOVED' : 'same'}`);
    if (WRITE) { r.coords.lat = +best.lat.toFixed(5); r.coords.lng = +best.lon.toFixed(5); }
    updated++;
  } else if (candidates.length > 1) {
    report.push(`AMB  ${r.name_it}  ~  ${candidates.slice(0, 2).map((c) => '"' + c.o.name + '"').join(' / ')}`);
    rejected++;
  } else {
    report.push(`MISS ${r.name_it}`);
    nomatch++;
  }
}

console.log(report.join('\n'));
console.log(`\n=== ${WRITE ? 'SCRITTI' : 'DRY-RUN'}: match affidabili ${updated} | ambigui ${rejected} | nessun match ${nomatch} (tot ${refs.length}) ===`);
if (WRITE) {
  fs.writeFileSync(REF, JSON.stringify(refData, null, 2) + '\n');
  console.log('refuges.json aggiornato.');
}
