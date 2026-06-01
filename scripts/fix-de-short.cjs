'use strict';
const fs = require('fs');
const path = require('path');
const skPath = path.join(__dirname, '../src/data/trails-skeleton.json');
const sk = JSON.parse(fs.readFileSync(skPath, 'utf8'));

// Estensioni minimali in DE per raggiungere 400 caratteri — solo fatti già presenti
const fixes = {
  '03-s1': {
    description_de: " Die Wanderung erfordert sehr gute körperliche Verfassung, da das Ziel bei 2.611 m liegt und der Anstieg fast 1.940 Höhenmeter beträgt — einer der größten im Aostatal-Kataster. Ein sehr früher Start ist unbedingt erforderlich. Empfohlen von Juni bis September."
  },
  '05-s16': {
    description_de: " Schwierigkeitsgrad E, von April bis Oktober über die Gemeinden Arvier und Saint-Pierre begehbar."
  },
  '07-s63': {
    description_de: " Vom Lago Blu, dem charakteristischen Hochgebirgssee im zentralen Aostatal, kehrt man auf gleichem Weg nach Blanchard zurück. Empfohlene Saison: Juni bis September. Ein lohnender Halbtagesausflug für konditionsstarke Wanderer."
  },
  '08-s9': {
    description_de: " Das hohe Steigungsgefälle prägt den gesamten Weg. Acht Wegmarkierungen laut Kataster. Empfohlene Saison: Mai bis Oktober. Geeignet für trainierte Wanderer, die schnell an Höhe gewinnen möchten, ohne technische Schwierigkeiten zu erwarten."
  },
};

let fixed = 0;
const merged = sk.map(t => {
  const ext = fixes[t.slug];
  if (!ext) return t;
  const updated = { ...t };
  for (const [field, addition] of Object.entries(ext)) {
    if (updated[field]) {
      updated[field] = updated[field] + addition;
    } else {
      updated[field] = addition.trim();
    }
    fixed++;
  }
  return updated;
});

Object.keys(fixes).forEach(slug => {
  const t = merged.find(s => s.slug === slug);
  if (t) {
    const len = t.description_de ? t.description_de.length : 0;
    console.log(slug, 'de:', len, len >= 400 ? 'OK' : 'STILL SHORT');
  }
});
console.log('Fixes:', fixed);
fs.writeFileSync(skPath, JSON.stringify(merged, null, 2), 'utf8');
console.log('Saved OK');
