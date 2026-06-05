'use strict';
// Assegna flora/fauna plausibili ai sentieri in base alla fascia altimetrica del
// tracciato, usando SOLO specie già presenti nel DB (src/data/species). Ecologia per
// quota: ogni specie ha un range [min,max]; viene proposta se interseca la fascia del
// sentiero. Selezione deterministica ma variata per slug, così i sentieri non sono identici.
const fs = require('fs');
const path = require('path');

// [id, min, max] estratti dal DB specie.
const FLORA = [
  ['larice',1400,2400],['pino-silvestre',700,2000],['abete-bianco',800,1800],['abete-rosso',900,2100],
  ['betulla',900,1900],['castagno',300,1200],['sorbo',800,2200],['acero',400,1700],['ontano',1200,2400],
  ['pioppo',500,2000],['vite',300,950],['faggio',700,1800],['nocciolo',300,1600],['carpino-bianco',300,1200],
  ['rododendro',1500,2800],['mirtillo',1000,2200],['mirtillo-rosso',1200,2400],['ginepro',800,2600],
  ['biancospino',300,1400],['rosa-canina',300,1800],['spino-cervino',1200,2400],['ribes',1000,2200],
  ['salice-herbaceo',2000,3200],['lampone',700,2000],['uva-ursina',1300,2800],['bosso',300,1400],
  ['stella-alpina',1700,3400],['genepi',2000,3300],['cotone-delle-nevi',1800,2800],['gentiana',1200,2600],
  ['anemone',1400,2800],['primula',1600,3000],['ciclamino',600,1800],['anterica',800,2400],
  ['ranuncolo-glaciale',2200,3800],['saussurea',1800,3000],['linaria',1600,3200],['pinguicula',1400,2800],
  ['nigritella',1500,2800],['genziana-maggiore',1000,2400],['renetta',1200,2600],['arnica',1200,2600],
  ['dryade',1700,3200],['sassifraga-oppositifolia',1800,3500],['silene-acaulis',1800,3300],
  ['papavero-alpino',1700,3100],['trifoglio-alpino',1400,2700],['achillea',500,2500],['buplerum',1400,2800],
  ['campanula',1400,2800],['myosotis-alpino',1500,3000],['aconito',1200,2500],['digitalis-lutea',700,1800],
];
const FAUNA = [
  ['stambecco',1600,3600],['camoscio',900,3200],['cervo',400,2500],['capriolo',300,2200],['muflone',700,2400],
  ['lupo',600,2800],['volpe',300,3000],['martora',600,2300],['faina',300,1900],['ghiro',300,1700],
  ['donnola',500,2800],['gatto-selvatico',400,1900],['tasso',300,1800],['marmotta',1400,3100],
  ['scoiattolo',400,2300],['lepre-alpina',1300,3200],['aquila-reale',1000,3800],['gipeto',1400,4200],
  ['gufo-reale',400,2400],['poiana',300,2100],['falco-pellegrino',400,3000],['allocco',300,1700],
  ['gallo-cedrone',1000,2200],['coturnice',1200,3000],['merlo-acquaiolo',500,2300],['gracchio-corallino',1400,3400],
  ['corvo-imperiale',400,3500],['picchio-nero',600,2100],['ghiandaia',300,1800],['cincia-ciuffo',800,2200],
  ['salamandra-lanzai',1200,2600],['rana-temporaria',600,2600],['vipera-berus',900,2800],['lucertola-allegra',800,2600],
];

// hash deterministico da stringa
function hash(s) { let h = 2166136261; for (let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }

function overlaps(a0,a1,b0,b1){ return a0 <= b1 && b0 <= a1; }

function pick(list, lo, hi, want, seed) {
  // candidati che intersecano la fascia del sentiero (con tolleranza)
  const cands = list.filter(([,m,M]) => overlaps(lo-150, hi+150, m, M));
  if (cands.length === 0) return [];
  // punteggio: preferisci specie il cui range è centrato vicino alla quota max del sentiero
  const scored = cands.map(([id,m,M]) => {
    const mid = (m+M)/2;
    const dist = Math.abs(mid - hi);
    return { id, dist };
  }).sort((a,b)=>a.dist-b.dist);
  // prendi i migliori 2 + alcuni ruotati per varietà (seed-based)
  const top = scored.slice(0, Math.min(scored.length, 2)).map(x=>x.id);
  const rest = scored.slice(2).map(x=>x.id);
  const out = [...top];
  let i = seed % Math.max(1, rest.length);
  while (out.length < want && rest.length) {
    const id = rest[i % rest.length];
    if (!out.includes(id)) out.push(id);
    i++;
    if (i > rest.length + want) break;
  }
  return out.slice(0, want);
}

const skPath = path.join(__dirname, '../src/data/trails-skeleton.json');
const sk = JSON.parse(fs.readFileSync(skPath, 'utf8'));
let changed = 0;
for (const t of sk) {
  const hasFlora = Array.isArray(t.flora) && t.flora.length > 0;
  const hasFauna = Array.isArray(t.fauna) && t.fauna.length > 0;
  if (hasFlora && hasFauna) continue;
  const e1 = t.start && typeof t.start.elevation_m === 'number' ? t.start.elevation_m : 1500;
  const e2 = t.end && typeof t.end.elevation_m === 'number' ? t.end.elevation_m : 1500;
  const lo = Math.min(e1, e2), hi = Math.max(e1, e2);
  const seed = hash(t.slug);
  // più specie dove la fascia è ampia
  const span = hi - lo;
  const floraN = span > 900 ? 5 : span > 400 ? 4 : 3;
  const faunaN = span > 900 ? 4 : 3;
  if (!hasFlora) t.flora = pick(FLORA, lo, hi, floraN, seed);
  if (!hasFauna) t.fauna = pick(FAUNA, lo, hi, faunaN, seed >> 3);
  changed++;
}
fs.writeFileSync(skPath, JSON.stringify(sk, null, 2), 'utf8');
console.log('Sentieri con flora/fauna assegnate:', changed, '/', sk.length);
// statistiche specie usate
const flCount={}, faCount={};
for (const t of sk){ (t.flora||[]).forEach(x=>flCount[x]=(flCount[x]||0)+1); (t.fauna||[]).forEach(x=>faCount[x]=(faCount[x]||0)+1); }
console.log('Sentieri con larice:', flCount['larice']||0, '| stambecco:', faCount['stambecco']||0, '| rododendro:', flCount['rododendro']||0);
console.log('Specie flora distinte usate:', Object.keys(flCount).length, '| fauna:', Object.keys(faCount).length);
