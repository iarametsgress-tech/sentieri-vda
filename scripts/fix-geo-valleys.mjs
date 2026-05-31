/**
 * Corregge VALLE e DESCRIZIONI dei sentieri scheletro usando le COORDINATE reali
 * (ground truth), perché la tabella codice→comune del Catasto era inaffidabile
 * (>50% valli sbagliate). La valle è derivata dal centroide più vicino; il comune
 * (non verificabile in modo affidabile) viene rimosso anziché mostrato errato.
 * Le descrizioni sono template deterministici basati SOLO su dati reali (niente invenzioni).
 */
import { readFileSync, writeFileSync } from 'node:fs';

// Più punti di riferimento per valle (valli lunghe = più punti lungo l'asse).
const VALLEYS = {
  VD: { c: [[6.97, 45.79], [6.92, 45.84], [7.04, 45.83]], it: 'Valdigne', en: 'Valdigne', fr: 'Valdigne', de: 'Valdigne' },
  LT: { c: [[6.95, 45.69], [6.88, 45.7]], it: 'La Thuile', en: 'La Thuile', fr: 'La Thuile', de: 'La Thuile' },
  VG: { c: [[7.0, 45.6], [7.06, 45.66]], it: 'Valgrisenche', en: 'Valgrisenche', fr: 'Valgrisenche', de: 'Valgrisenche' },
  RH: { c: [[7.12, 45.54], [7.16, 45.61]], it: 'Val di Rhêmes', en: 'Rhêmes Valley', fr: 'Val de Rhêmes', de: 'Rhêmes-Tal' },
  VS: { c: [[7.21, 45.53], [7.19, 45.6]], it: 'Valsavarenche', en: 'Valsavarenche', fr: 'Valsavarenche', de: 'Valsavarenche' },
  CO: { c: [[7.31, 45.61], [7.38, 45.56], [7.35, 45.64]], it: 'Val di Cogne', en: 'Cogne Valley', fr: 'Val de Cogne', de: 'Cogne-Tal' },
  GSB: { c: [[7.24, 45.87], [7.3, 45.83], [7.18, 45.83]], it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-Sankt-Bernhard-Tal' },
  VP: { c: [[7.42, 45.86], [7.48, 45.91], [7.38, 45.84]], it: 'Valpelline', en: 'Valpelline', fr: 'Valpelline', de: 'Valpelline-Tal' },
  VC: { c: [[7.22, 45.72], [7.32, 45.74], [7.45, 45.74], [7.58, 45.74], [7.7, 45.66]], it: 'Valle centrale', en: 'Central Valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  VT: { c: [[7.66, 45.92], [7.62, 45.86], [7.59, 45.83]], it: 'Valtournenche', en: 'Valtournenche', fr: 'Valtournenche', de: 'Valtournenche' },
  AY: { c: [[7.73, 45.84], [7.7, 45.79], [7.67, 45.75]], it: "Val d'Ayas", en: 'Ayas Valley', fr: "Vallée d'Ayas", de: 'Ayas-Tal' },
  LY: { c: [[7.87, 45.8], [7.85, 45.74], [7.82, 45.66], [7.8, 45.6]], it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  CH: { c: [[7.55, 45.6], [7.59, 45.62]], it: 'Valle di Champorcher', en: 'Champorcher Valley', fr: 'Vallée de Champorcher', de: 'Champorcher-Tal' },
};
function valleyKey(lng, lat) {
  let best = null, bd = Infinity;
  for (const [k, v] of Object.entries(VALLEYS)) {
    for (const [cl, ca] of v.c) {
      const d = (lng - cl) ** 2 + (lat - ca) ** 2;
      if (d < bd) { bd = d; best = k; }
    }
  }
  return best;
}

const MONTHS = {
  it: ['', 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
  en: ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  fr: ['', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  de: ['', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
};
function seasonPhrase(months, lang) {
  if (!Array.isArray(months) || !months.length) return null;
  const sorted = [...months].sort((a, b) => a - b);
  const a = MONTHS[lang][sorted[0]], b = MONTHS[lang][sorted[sorted.length - 1]];
  if (!a || !b) return null;
  if (a === b) return { it: a, en: a, fr: a, de: a }[lang];
  return { it: `da ${a} a ${b}`, en: `${a} to ${b}`, fr: `de ${a} à ${b}`, de: `von ${a} bis ${b}` }[lang];
}

function descriptions(t, V) {
  const code = t.sct_code ?? t.slug;
  const a = t.start?.name ?? '?', b = t.end?.name ?? '?';
  const ea = t.start?.elevation_m, eb = t.end?.elevation_m;
  const km = Number(t.distance_km).toFixed(1);
  const g = Math.round(t.elevation_gain_m ?? 0);
  const diff = t.difficulty;
  const lo = Math.min(ea, eb), hi = Math.max(ea, eb);
  const sIt = seasonPhrase(t.best_months, 'it'), sEn = seasonPhrase(t.best_months, 'en'),
    sFr = seasonPhrase(t.best_months, 'fr'), sDe = seasonPhrase(t.best_months, 'de');
  const src = {
    it: 'Tracciato GPX e dati altimetrici dalla Regione Autonoma Valle d\'Aosta (open data DGR 899/2014).',
    en: 'GPX track and elevation data from the Aosta Valley Region (open data DGR 899/2014).',
    fr: 'Tracé GPX et données altimétriques de la Région Autonome Vallée d\'Aoste (open data DGR 899/2014).',
    de: 'GPX-Track und Höhendaten der Autonomen Region Aostatal (Open Data DGR 899/2014).',
  };
  return {
    description_it: `${t.name_it} è un sentiero ufficiale del Catasto Sentieri della Valle d'Aosta (codice ${code}), in ${V.it}. Si sviluppa da ${a} (${ea} m) a ${b} (${eb} m) per ${km} km, con +${g} m di dislivello e difficoltà ${diff} sulla scala CAI. Quota compresa tra ${lo} e ${hi} m${sIt ? `; periodo consigliato ${sIt}` : ''}. ${src.it}`,
    description_en: `${t.name_it} is an official trail from the Aosta Valley trail registry (code ${code}), in the ${V.en}. It runs from ${a} (${ea} m) to ${b} (${eb} m) over ${km} km, with +${g} m of ascent and difficulty ${diff} on the CAI scale. Elevation between ${lo} and ${hi} m${sEn ? `; recommended season ${sEn}` : ''}. ${src.en}`,
    description_fr: `${t.name_it} est un sentier officiel du cadastre des sentiers de la Vallée d'Aoste (code ${code}), en ${V.fr}. Il va de ${a} (${ea} m) à ${b} (${eb} m) sur ${km} km, avec +${g} m de dénivelé et difficulté ${diff} sur l'échelle CAI. Altitude entre ${lo} et ${hi} m${sFr ? ` ; saison conseillée ${sFr}` : ''}. ${src.fr}`,
    description_de: `${t.name_it} ist ein offizieller Weg aus dem Wegekataster des Aostatals (Code ${code}), im ${V.de}. Er führt von ${a} (${ea} m) nach ${b} (${eb} m) über ${km} km, mit +${g} m Aufstieg und Schwierigkeit ${diff} auf der CAI-Skala. Höhe zwischen ${lo} und ${hi} m${sDe ? `; empfohlene Saison ${sDe}` : ''}. ${src.de}`,
    shortDescription_it: `${km} km · +${g} m · ${diff} — da ${a} a ${b} (${V.it}).`,
    shortDescription_en: `${km} km · +${g} m · ${diff} — from ${a} to ${b} (${V.en}).`,
    shortDescription_fr: `${km} km · +${g} m · ${diff} — de ${a} à ${b} (${V.fr}).`,
    shortDescription_de: `${km} km · +${g} m · ${diff} — von ${a} nach ${b} (${V.de}).`,
  };
}

const p = './src/data/trails-skeleton.json';
const skel = JSON.parse(readFileSync(p, 'utf8'));
let updated = 0; const dist = {};
for (const t of skel) {
  const lng = t.start?.coords?.lng, lat = t.start?.coords?.lat;
  if (typeof lng !== 'number' || typeof lat !== 'number') continue;
  const k = valleyKey(lng, lat);
  const V = VALLEYS[k];
  t.valley = V.it;
  t.municipalities = []; // comune non verificabile in modo affidabile → meglio vuoto che errato
  Object.assign(t, descriptions(t, V));
  dist[V.it] = (dist[V.it] || 0) + 1;
  updated++;
}
writeFileSync(p, JSON.stringify(skel) + '\n');
console.log('sentieri aggiornati (valle+descrizioni da coordinate):', updated);
console.log('distribuzione valli corretta:', JSON.stringify(dist, null, 1));
