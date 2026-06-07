/* Normalizza i campi valley_* dei rifugi alle 14 valli canoniche del sito
 * (valleys.json). Correzione geografica accurata: nessun dato inventato. */
const fs = require('fs');
const path = require('path');
const valleys = require('../src/data/culture/valleys.json');
const REF = path.join(__dirname, '..', 'src', 'data', 'refuges.json');

// id canonico → nomi localizzati
const CANON = {};
for (const v of valleys) {
  CANON[v.id] = { it: v.name_it, en: v.name_en, fr: v.name_fr, de: v.name_de };
}

function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// label rifugio (normalizzata) → id valle canonica
const MAP = {
  'valle del lys': 'valle-del-lys',
  'gressoney-la-trinite': 'valle-del-lys',
  'valle di gaby, val d\'ayas': 'valle-del-lys',
  'val veny': 'val-veny',
  'val veny, courmayeur': 'val-veny',
  'val ferret': 'val-ferret',
  'val ferret, courmayeur': 'val-ferret',
  'valtournenche': 'valtournenche',
  'alta val tournenche': 'valtournenche',
  'breuil-cervinia': 'valtournenche',
  'valtournenche / valpelline': 'valtournenche',
  'valle del lys ': 'valle-del-lys',
  'val di cogne': 'val-di-cogne',
  'cogne, valnontey': 'val-di-cogne',
  'valpelline': 'valpelline',
  'valpelline, conca di by': 'valpelline',
  'valpelline, ollomont': 'valpelline',
  'valgrisenche': 'valgrisenche',
  'valsavarenche': 'valsavarenche',
  'valle del gran san bernardo': 'valle-gran-san-bernardo',
  'saint-rhemy-en-bosses': 'valle-gran-san-bernardo',
  'valle di champorcher': 'champorcher',
  'champorcher': 'champorcher',
  "val d'ayas": 'valle-d-ayas',
  "crest, val d'ayas": 'valle-d-ayas',
  "val d'ayas / val d'ayas": 'valle-d-ayas',
  'la thuile': 'la-thuile',
  'la thuile, valle del rutor': 'la-thuile',
  'la thuile, lago verney': 'la-thuile',
  'val di rhemes': 'val-di-rhemes',
};

const data = JSON.parse(fs.readFileSync(REF, 'utf8'));
const arr = Array.isArray(data) ? data : data.refuges;
let fixed = 0, unmatched = new Set();
for (const r of arr) {
  const key = norm(r.valley_it);
  const id = MAP[key];
  if (!id) { unmatched.add(r.valley_it); continue; }
  const c = CANON[id];
  if (r.valley_it !== c.it || r.valley_en !== c.en) fixed++;
  r.valley_it = c.it;
  r.valley_en = c.en;
  r.valley_fr = c.fr;
  r.valley_de = c.de;
}
fs.writeFileSync(REF, JSON.stringify(data, null, 2) + '\n');
console.log('Rifugi normalizzati:', fixed);
if (unmatched.size) console.log('NON mappati (rivedere):', [...unmatched].join(' | '));
// riepilogo valli finali
const tally = {};
for (const r of arr) tally[r.valley_it] = (tally[r.valley_it] || 0) + 1;
console.log('Valli finali:', Object.entries(tally).map(([k, n]) => `${k}:${n}`).join(', '));
