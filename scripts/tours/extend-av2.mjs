import fs from 'node:fs';

const EXT = {
  'alta-via-2-tappa-10-cogne-rifugio-sogno-berdze': {
    en: ' The valley keeps the atmosphere of a forgotten corner of the Park: there are no roads to the upper alps, only the old miners’ and shepherds’ paths, and the silence is broken solely by streams and the whistle of marmots.',
    fr: ' Le vallon garde l’atmosphère d’un coin oublié du Parc : aucune route ne dessert les alpages supérieurs, seulement les anciens chemins des mineurs et des bergers, et le silence n’est rompu que par les torrents et le sifflement des marmottes.',
    de: ' Das Tal bewahrt die Atmosphäre eines vergessenen Winkels des Parks: Keine Straße erschließt die oberen Almen, nur die alten Wege der Bergleute und Hirten, und die Stille wird allein von Bächen und dem Pfiff der Murmeltiere durchbrochen.',
  },
  'alta-via-2-tappa-12-rifugio-dondena-champorcher': {
    en: ' The whole descent follows the engineered grade of the royal road, comfortable underfoot and rich in viewpoints over the Mont Avic park, whose dark serpentinite peaks and pine forests of uncinate pine make it one of the Alps’ most distinctive protected areas.',
    de: ' Der gesamte Abstieg folgt der ausgebauten Neigung der königlichen Straße, angenehm zu gehen und reich an Ausblicken über den Mont-Avic-Park, dessen dunkle Serpentinitgipfel und Hakenkiefernwälder ihn zu einem der eigentümlichsten Schutzgebiete der Alpen machen.',
  },
  'alta-via-2-tappa-13-champorcher-crest-damon': {
    en: ' This is the quiet, contemplative stage of the high route: few other walkers, the rustle of beech leaves, and the steady reminder — in every ruined wall and abandoned terrace — of how densely these slopes were once farmed and inhabited.',
  },
};

const routes = JSON.parse(fs.readFileSync('src/data/trails-routes.json', 'utf8'));
let n = 0;
for (const t of routes) {
  const ext = EXT[t.slug];
  if (!ext) continue;
  for (const [l, sentence] of Object.entries(ext)) {
    if (!t['description_' + l].includes(sentence.trim().slice(0, 30))) {
      t['description_' + l] = t['description_' + l].trimEnd() + sentence;
    }
  }
  n++;
}
fs.writeFileSync('src/data/trails-routes.json', JSON.stringify(routes, null, 2) + '\n');
console.log(`✓ ${n} tappe estese`);
