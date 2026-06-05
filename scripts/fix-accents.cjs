'use strict';
// Corregge accenti "apostrofati" (perche' -> perché, citta' -> città, ...) nei campi
// testuali dei sentieri. Lavora su trails-skeleton.json e trails.json.
const fs = require('fs');
const path = require('path');

// Mappa parola-con-apostrofo -> parola accentata. Word-boundary, case-insensitive
// sull'iniziale ma preservando maiuscola iniziale.
const WORDS = {
  "perche": "perché", "poiche": "poiché", "finche": "finché", "benche": "benché",
  "affinche": "affinché", "giacche": "giacché", "sicche": "sicché", "anziche": "anziché",
  "nonche": "nonché", "cosicche": "cosicché",
  "citta": "città", "qualita": "qualità", "quantita": "quantità", "universita": "università",
  "meta": "metà", "liberta": "libertà", "novita": "novità", "varieta": "varietà",
  "realta": "realtà", "possibilita": "possibilità", "difficolta": "difficoltà",
  "attivita": "attività", "localita": "località", "verita": "verità", "eta": "età",
  "piu": "più", "gia": "già", "puo": "può", "cosi": "così", "pero": "però",
  "piu'": "più", "viceversa": "viceversa",
};

// Applica le sostituzioni a una stringa.
function fixStr(s) {
  if (typeof s !== 'string' || s.indexOf("'") === -1) return s;
  let out = s;
  for (const [bare, acc] of Object.entries(WORDS)) {
    // parola seguita da apostrofo (dritto o tipografico) a fine parola
    const re = new RegExp(`\\b(${bare})['’](?=\\s|[.,;:!?)»"]|$)`, 'gi');
    out = out.replace(re, (m, w) => {
      // preserva maiuscola iniziale
      return w[0] === w[0].toUpperCase() ? acc[0].toUpperCase() + acc.slice(1) : acc;
    });
  }
  // " e' " come verbo essere -> " è "
  out = out.replace(/(^|[\s(])e['’](?=\s)/g, (m, p1) => p1 + 'è');
  // " ne' " congiunzione -> " né " (solo se isolato tra spazi)
  out = out.replace(/(\s)ne['’](?=\s)/gi, (m, p1) => p1 + 'né');
  return out;
}

const FIELDS = [
  'name_it','name_en','name_fr','name_de',
  'shortDescription_it','shortDescription_en','shortDescription_fr','shortDescription_de',
  'description_it','description_en','description_fr','description_de',
  'geology_it','geology_en','geology_fr','geology_de',
  'cultural_notes_it','cultural_notes_en','cultural_notes_fr','cultural_notes_de',
  'water_sources_it','water_sources_en','water_sources_fr','water_sources_de',
  'transport_it','transport_en','transport_fr','transport_de','parking',
];
const ARRAY_FIELDS = ['warnings_it','warnings_en','warnings_fr','warnings_de'];

function fixRecord(t) {
  let changed = 0;
  for (const f of FIELDS) {
    if (typeof t[f] === 'string') {
      const v = fixStr(t[f]);
      if (v !== t[f]) { t[f] = v; changed++; }
    }
  }
  for (const f of ARRAY_FIELDS) {
    if (Array.isArray(t[f])) {
      t[f] = t[f].map((x) => {
        const v = fixStr(x);
        if (v !== x) changed++;
        return v;
      });
    }
  }
  return changed;
}

let total = 0, recs = 0;
for (const file of ['trails-skeleton.json', 'trails.json', 'trails-routes.json']) {
  const fp = path.join(__dirname, '../src/data', file);
  if (!fs.existsSync(fp)) continue;
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  let fileChanges = 0, fileRecs = 0;
  for (const t of data) {
    const c = fixRecord(t);
    if (c) { fileChanges += c; fileRecs++; }
  }
  if (fileChanges) {
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
  }
  console.log(`${file}: ${fileChanges} correzioni su ${fileRecs} record`);
  total += fileChanges; recs += fileRecs;
}
console.log(`Totale: ${total} correzioni su ${recs} record.`);
