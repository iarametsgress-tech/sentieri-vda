'use strict';
const fs = require('fs');
const path = require('path');
const skPath = path.join(__dirname, '../src/data/trails-skeleton.json');
const sk = JSON.parse(fs.readFileSync(skPath, 'utf8'));

const extensions = {
  '10-s2': {
    description_fr: " La Valpelline est une vallée peu fréquentée qui préserve un caractère alpin authentique, loin des grands circuits touristiques.",
    description_de: " Das Valpelline ist ein wenig besuchtes Tal, das seinen authentischen Alpencharakter fernab der großen Touristenströme bewahrt.",
  },
  '10-s7': {
    description_fr: " La Valpelline est une vallée peu fréquentée qui confère à cet itinéraire un caractère solitaire et une immersion rare dans le paysage alpin.",
    description_de: " Das Valpelline ist ein stilles Tal mit authentischem Alpencharakter, das diesem Weg eine besondere Einsamkeit verleiht.",
  },
  '12-s10': {
    description_fr: " La Val d'Ayas est l'une des vallées latérales les plus visitées de la Vallée d'Aoste, avec Brusson comme centre principal de la zone.",
    description_de: " Das Ayas-Tal gehört zu den meistbesuchten Seitentälern des Aostatals, mit Brusson als wichtigstem Ortszentrum der Region.",
  },
  '12-s24': {
    description_fr: " La saison recommandée va de juin à septembre, lorsque le col est dégagé de neige et que les conditions de marche sont optimales.",
    description_de: " Empfohlene Saison: Juni bis September, wenn der Pass schneefrei ist und die Wanderbedingungen optimal sind.",
  },
};

let fixed = 0;
const merged = sk.map(t => {
  const ext = extensions[t.slug];
  if (!ext) return t;
  const updated = { ...t };
  for (const [field, addition] of Object.entries(ext)) {
    if (updated[field]) {
      updated[field] = updated[field] + addition;
    }
  }
  fixed++;
  return updated;
});

console.log('Fixed:', fixed);
['10-s2','10-s7','12-s10','12-s24'].forEach(slug => {
  const t = merged.find(s => s.slug === slug);
  if (t) console.log(slug, 'fr:', t.description_fr.length, 'de:', t.description_de.length);
});
fs.writeFileSync(skPath, JSON.stringify(merged, null, 2), 'utf8');
console.log('OK');
