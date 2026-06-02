'use strict';
const fs = require('fs');
const path = require('path');
const skPath = path.join(__dirname, '../src/data/trails-skeleton.json');
const sk = JSON.parse(fs.readFileSync(skPath, 'utf8'));
const add = {
  '03-s7': {
    description_fr: " Le versant, exposé au sud, conserve la chaleur tout au long de la journée et offre une longue saison de randonnée.",
    description_de: " Der südexponierte Hang speichert die Wärme über den ganzen Tag und bietet eine lange Wandersaison von Frühjahr bis Herbst."
  },
  '06-s1': {
    description_en: " A pleasant descent best combined with a higher-altitude outing, or walked as a relaxed spring traverse when mid-elevations clear of snow.",
    description_fr: " Une descente agréable à combiner avec une sortie en altitude, ou à parcourir comme traversée printanière lorsque les versants moyens se libèrent de la neige."
  },
  '06-s29': {
    description_fr: " La proximité du glacier rend la section supérieure particulièrement spectaculaire ; névés possibles jusqu'au début de l'été.",
    description_de: " Die Nähe des Gletschers macht den oberen Abschnitt besonders eindrucksvoll; Firnfelder sind bis zum Frühsommer möglich."
  }
};
let n = 0;
const merged = sk.map(t => {
  const e = add[t.slug];
  if (!e) return t;
  const u = { ...t };
  for (const [f, s] of Object.entries(e)) { if (u[f]) { u[f] = u[f] + s; n++; } }
  return u;
});
Object.keys(add).forEach(sl => { const t = merged.find(x=>x.slug===sl); ['description_en','description_fr','description_de'].forEach(f=>{ if(add[sl][f]) console.log(sl, f, t[f].length); }); });
console.log('fix:', n);
fs.writeFileSync(skPath, JSON.stringify(merged, null, 2), 'utf8');
