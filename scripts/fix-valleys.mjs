/**
 * Corregge la mappatura valle per comune.
 * I nomi comune in comuni-vda.json sono per lo più corretti, ma i campi valley_*
 * erano assegnati in modo errato. Qui riassegniamo la valle corretta in base al
 * comune (geografia ufficiale Valle d'Aosta), e riallineiamo trails-skeleton.json.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const V = {
  GSB: { it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-Sankt-Bernhard-Tal' },
  VP: { it: 'Valpelline', en: 'Valpelline', fr: 'Valpelline', de: 'Valpelline-Tal' },
  VD: { it: 'Valdigne', en: 'Valdigne', fr: 'Valdigne', de: 'Valdigne' },
  LT: { it: 'La Thuile', en: 'La Thuile', fr: 'La Thuile', de: 'La Thuile' },
  VG: { it: 'Valgrisenche', en: 'Valgrisenche', fr: 'Valgrisenche', de: 'Valgrisenche' },
  RH: { it: 'Val di Rhêmes', en: 'Rhêmes Valley', fr: 'Val de Rhêmes', de: 'Rhêmes-Tal' },
  VS: { it: 'Valsavarenche', en: 'Valsavarenche', fr: 'Valsavarenche', de: 'Valsavarenche' },
  CO: { it: 'Val di Cogne', en: 'Cogne Valley', fr: 'Val de Cogne', de: 'Cogne-Tal' },
  VC: { it: 'Valle centrale', en: 'Central Valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  VT: { it: 'Valtournenche', en: 'Valtournenche', fr: 'Valtournenche', de: 'Valtournenche' },
  AY: { it: "Val d'Ayas", en: 'Ayas Valley', fr: "Vallée d'Ayas", de: 'Ayas-Tal' },
  LY: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  CH: { it: 'Valle di Champorcher', en: 'Champorcher Valley', fr: 'Vallée de Champorcher', de: 'Champorcher-Tal' },
};

const COMUNE_VALLEY = {
  allein: 'GSB', 'antey-saint-andre': 'VT', aosta: 'VC', arnad: 'LY', arvier: 'VG',
  avise: 'VC', aymavilles: 'CO', ayas: 'AY', bard: 'LY', bionaz: 'VP', brissogne: 'VC',
  brusson: 'AY', 'challand-saint-anselme': 'AY', 'challand-saint-victor': 'AY',
  chambave: 'VC', chamois: 'VT', champdepraz: 'VC', champorcher: 'CH', charvensod: 'VC',
  chatillon: 'VT', cogne: 'CO', courmayeur: 'VD', donnas: 'LY', doues: 'GSB',
  emarese: 'VT', etroubles: 'GSB', fenis: 'VC', fontainemore: 'LY', gaby: 'LY',
  gignod: 'GSB', gressan: 'VC', 'gressoney-la-trinite': 'LY', 'gressoney-saint-jean': 'LY',
  hone: 'CH', introd: 'VS', issime: 'LY', issogne: 'AY', jovencan: 'VC',
  'la magdeleine': 'VT', 'la-magdeleine': 'VT', 'la salle': 'VD', 'la-salle': 'VD',
  'la thuile': 'LT', 'la-thuile': 'LT', lillianes: 'LY', montjovet: 'VC', morgex: 'VD',
  nus: 'VC', ollomont: 'VP', oyace: 'VP', perloz: 'LY', pollein: 'VC',
  pontboset: 'CH', 'pont-bozet': 'CH', 'pont-saint-martin': 'LY', pontey: 'VT',
  'pre-saint-didier': 'VD', quart: 'VC', 'rhemes-notre-dame': 'RH', 'rhemes-saint-georges': 'RH',
  roisan: 'GSB', 'saint-christophe': 'VC', 'saint-denis': 'VT', 'saint-marcel': 'VC',
  'saint-nicolas': 'VC', 'saint-oyen': 'GSB', 'saint-pierre': 'VC',
  'saint-rhemy-en-bosses': 'GSB', 'saint-vincent': 'VC', sarre: 'VC', torgnon: 'VT',
  valgrisenche: 'VG', valpelline: 'VP', valsavarenche: 'VS', valtournenche: 'VT',
  verrayes: 'VT', verres: 'AY', villeneuve: 'VC',
};

const norm = (s) =>
  (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

function valleyKeyForComune(name) {
  return COMUNE_VALLEY[norm(name)] ?? null;
}

// 1) comuni-vda.json
const comuniPath = './src/data/comuni-vda.json';
const comuniDoc = JSON.parse(readFileSync(comuniPath, 'utf8'));
const unknown = new Set();
for (const code of Object.keys(comuniDoc.comuni)) {
  const c = comuniDoc.comuni[code];
  const key = valleyKeyForComune(c.name);
  if (!key) { unknown.add(c.name); continue; }
  c.valley_it = V[key].it; c.valley_en = V[key].en; c.valley_fr = V[key].fr; c.valley_de = V[key].de;
}
writeFileSync(comuniPath, JSON.stringify(comuniDoc, null, 2) + '\n');

// 2) trails-skeleton.json — valley per comune del sentiero
const skelPath = './src/data/trails-skeleton.json';
const skel = JSON.parse(readFileSync(skelPath, 'utf8'));
let patched = 0, noComune = 0;
for (const t of skel) {
  const comune = Array.isArray(t.municipalities) ? t.municipalities[0] : null;
  const key = comune ? valleyKeyForComune(comune) : null;
  if (key) { t.valley = V[key].it; patched++; }
  else noComune++;
}
writeFileSync(skelPath, JSON.stringify(skel) + '\n');

console.log('comuni con valle corretta:', Object.keys(comuniDoc.comuni).length - unknown.size, '/', Object.keys(comuniDoc.comuni).length);
console.log('comuni non riconosciuti:', [...unknown].join(', ') || '(nessuno)');
console.log('sentieri ripatchati:', patched, '| senza comune mappato:', noComune);
// riepilogo distribuzione valli
const dist = {};
for (const t of skel) dist[t.valley] = (dist[t.valley] || 0) + 1;
console.log('distribuzione valli:', JSON.stringify(dist, null, 1));
