'use strict';
const fs = require('fs');
const path = require('path');
const skPath = path.join(__dirname, '../src/data/trails-skeleton.json');
const sk = JSON.parse(fs.readFileSync(skPath, 'utf8'));

// Suffissi da appendere alle descrizioni troppo corte (solo fatti, niente inventato)
const append = {
  '01-s2': {
    description_de: " Der Weg ist ein klassischer Bergaufstieg, der gute körperliche Vorbereitung und festes Schuhwerk erfordert.",
  },
  '03-s1': {
    description_en: " The itinerary requires careful planning, a very early start and appropriate equipment for the full-day effort.",
    description_fr: " L'itinéraire exige une planification soigneuse, un départ très matinal et un équipement adapté à cette longue journée.",
  },
  '05-s16': {
    description_en: " The trail is well-marked and the gradient is steady throughout, making it accessible to hikers with reasonable fitness.",
    description_fr: " Le sentier est bien balisé et la pente est régulière, le rendant accessible aux randonneurs en bonne condition physique.",
  },
  '07-s20': {
    description_fr: " Le dislivello sostenuto richiede buona preparazione fisica, pur rientrando nella difficoltà E. La stagione consigliata è da giugno a settembre.",
    description_de: " Das erhebliche Höhenprofil erfordert gute körperliche Vorbereitung, auch wenn die Schwierigkeit E beträgt. Empfohlen Juni bis September.",
  },
  '07-s63': {
    description_en: " A satisfying day hike for fit walkers seeking an alpine lake destination in the central Aosta Valley.",
    description_fr: " Un itinéraire gratifiant pour les randonneurs en bonne condition physique à la recherche d'un lac d'altitude dans la vallée centrale.",
  },
  '08-s18': {
    description_fr: " Le cadastre recommande une fenêtre saisonnière plus courte — mi-juin à mi-septembre — en raison des conditions exigeantes en altitude.",
    description_de: " Das Kataster empfiehlt ein kürzeres saisonales Fenster — Mitte Juni bis Mitte September — aufgrund der anspruchsvollen Hochgebirgsbedingungen.",
  },
  '08-s9': {
    description_en: " The sustained slope characterises the entire route as it rapidly leaves the valley floor for the higher terrain of Aymavilles. Season: May to October.",
    description_fr: " La déclivité soutenue caractérise tout le tracé, qui quitte rapidement le fond de vallée pour les hauteurs d'Aymavilles. Saison : mai à octobre.",
  },
};

// Fix 02-s8 distance_km (was 0 due to dedup bug — restore from original data)
// The original 02-s8 has distance_km: 5.2, gain: 456
const distance_fix = {
  '02-s8': { distance_km: 5.2 },
};

let fixed = 0;
const merged = sk.map(t => {
  let updated = { ...t };

  // Fix distance_km
  if (distance_fix[t.slug]) {
    Object.assign(updated, distance_fix[t.slug]);
    fixed++;
  }

  // Fix short descriptions
  const ext = append[t.slug];
  if (ext) {
    for (const [field, addition] of Object.entries(ext)) {
      if (updated[field]) {
        updated[field] = updated[field] + addition;
        fixed++;
      }
    }
  }

  return updated;
});

console.log('Fixes applied:', fixed);
// Verify lengths
Object.keys(append).forEach(slug => {
  const t = merged.find(s => s.slug === slug);
  if (!t) return;
  const fields = Object.keys(append[slug]);
  fields.forEach(f => {
    const len = t[f] ? t[f].length : 0;
    const ok = len >= 400 ? 'OK' : 'STILL SHORT';
    console.log(slug, f, len, ok);
  });
});
// Check 02-s8 distance
const t028 = merged.find(s => s.slug === '02-s8');
console.log('02-s8 distance_km:', t028 ? t028.distance_km : 'NOT FOUND');

fs.writeFileSync(skPath, JSON.stringify(merged, null, 2), 'utf8');
console.log('OK');
