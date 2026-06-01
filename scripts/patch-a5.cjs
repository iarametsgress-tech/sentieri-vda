'use strict';
const fs = require('fs');
const path = require('path');

// Lotto A5: 02-s25, 03-s7, 05-s3, 06-s19, 06-s4, 07-s21, 07-s29, 07-s45, 07-s64, 08-s19, 09-s1, 10-s21, 10-s8, 12-s11, 12-s26
const patch = JSON.parse(`{
  "02-s25": {
    "description_it": "Il sentiero nel comune di Torgnon, Valtournenche, percorre il versante panoramico della valle toccando frazioni e pascoli tipici della media montagna valdostana. Il tracciato si snoda tra boschi di conifere e prati aperti con vedute sul fondovalle e sulle cime della Valtournenche. La classificazione E o T indica un percorso adatto a escursionisti di diversa preparazione.",
    "description_en": "The trail in the commune of Torgnon, Valtournenche, crosses the panoramic valley slope touching hamlets and pastures typical of the Aosta Valley mid-mountain. The route winds through conifer forest and open meadows with views over the valley floor and Valtournenche peaks. The E or T rating marks a route for hikers of varying fitness.",
    "description_fr": "Le sentier dans la commune de Torgnon, Valtournenche, traverse le versant panoramique de la vallée entre hameaux et pâturages typiques de la moyenne montagne valdôtaine.",
    "description_de": "Der Weg in der Gemeinde Torgnon, Valtournenche, durchquert den Panoramahang der Täler zwischen Weilern und Weiden der mittleren Bergzone.",
    "shortDescription_it": "Nel comune di Torgnon, Valtournenche: percorso panoramico tra boschi, pascoli e frazioni della media montagna valdostana.",
    "shortDescription_en": "In the commune of Torgnon, Valtournenche: a panoramic route through forest, pastures and hamlets of the Aosta Valley mid-mountain.",
    "shortDescription_fr": "Dans la commune de Torgnon, Valtournenche : itinéraire panoramique entre forêts, pâturages et hameaux.",
    "shortDescription_de": "In der Gemeinde Torgnon, Valtournenche: Panoramaweg zwischen Wäldern, Weiden und Weilern.",
    "updated_at": "2026-06-01"
  },
  "03-s7": {
    "description_it": "Il percorso nel comune di Challand-Saint-Victor, bassa Val d'Ayas, risale il versante verso le frazioni storiche attraverso vigneti, boschi e terreni terrazzati. La classificazione E indica un itinerario adatto a escursionisti con normale preparazione.",
    "description_en": "The route in the commune of Challand-Saint-Victor, lower Val d'Ayas, climbs the slope toward historic hamlets through vineyards, forest and terraced land. The E rating marks a route for normally fit hikers.",
    "description_fr": "L'itinéraire dans la commune de Challand-Saint-Victor, basse Vallée d'Ayas, remonte le versant vers les hameaux historiques à travers vignes, forêts et terrains en terrasses.",
    "description_de": "Der Weg in der Gemeinde Challand-Saint-Victor, unteres Val d'Ayas, steigt den Hang zu historischen Weilern durch Weinberge, Wald und terrassiertes Gelände auf.",
    "shortDescription_it": "In bassa Val d'Ayas, Challand-Saint-Victor: salita E tra vigneti, boschi e terreni terrazzati verso le frazioni storiche.",
    "shortDescription_en": "In the lower Val d'Ayas, Challand-Saint-Victor: an E-rated climb through vineyards, forest and terraced land toward historic hamlets.",
    "shortDescription_fr": "En basse Vallée d'Ayas, Challand-Saint-Victor : montée E entre vignes, forêts et terrains en terrasses.",
    "shortDescription_de": "Im unteren Val d'Ayas, Challand-Saint-Victor: E-Aufstieg durch Weinberge, Wald und terrassiertes Gelände.",
    "updated_at": "2026-06-01"
  },
  "05-s3": {
    "description_it": "Il sentiero nel comune di Arvier, Valgrisenche, sale attraverso il bosco verso gli alpeggi superiori con un dislivello significativo. La classificazione E indica un itinerario escursionistico che richiede allenamento.",
    "description_en": "The trail in the commune of Arvier, Valgrisenche, climbs through forest toward upper pastures with significant elevation gain. The E rating marks a hiking trail requiring fitness.",
    "description_fr": "Le sentier dans la commune d'Arvier, Valgrisenche, monte à travers la forêt vers les alpages supérieurs avec un dénivelé significatif.",
    "description_de": "Der Weg in der Gemeinde Arvier, Valgrisenche, steigt mit erheblichem Höhenunterschied durch den Wald zu den Hochalmen auf.",
    "shortDescription_it": "In Valgrisenche, Arvier: salita E significativa attraverso il bosco verso gli alpeggi superiori.",
    "shortDescription_en": "In the Valgrisenche, Arvier: a significant E-rated climb through forest toward upper pastures.",
    "shortDescription_fr": "Dans la Valgrisenche, Arvier : montée E significative à travers la forêt vers les alpages.",
    "shortDescription_de": "Im Valgrisenche, Arvier: erheblicher E-Aufstieg durch den Wald zu den Hochalmen.",
    "updated_at": "2026-06-01"
  },
  "06-s19": {
    "description_it": "Il percorso nel comune di La Salle, Valdigne, sale verso le zone alte del versante in un ambiente di alta montagna con vedute sul Monte Bianco. La classificazione E indica un itinerario adatto a escursionisti allenati.",
    "description_en": "The route in the commune of La Salle, Valdigne, climbs toward the upper slope zones in a high-mountain environment with views of Mont Blanc. The E rating marks a route for fit hikers.",
    "description_fr": "L'itinéraire dans la commune de La Salle, Valdigne, monte vers les zones supérieures du versant dans un environnement de haute montagne avec des vues sur le Mont-Blanc.",
    "description_de": "Der Weg in der Gemeinde La Salle, Valdigne, steigt in einer Hochgebirgslandschaft mit Blick auf den Mont Blanc zu den oberen Hangzonen auf.",
    "shortDescription_it": "In Valdigne, La Salle: salita E verso le zone alte del versante con vedute sul Monte Bianco.",
    "shortDescription_en": "In the Valdigne, La Salle: an E-rated climb toward upper slope zones with views of Mont Blanc.",
    "shortDescription_fr": "En Valdigne, La Salle : montée E vers les zones supérieures avec vues sur le Mont-Blanc.",
    "shortDescription_de": "Im Valdigne, La Salle: E-Aufstieg zu oberen Hangzonen mit Blick auf den Mont Blanc.",
    "updated_at": "2026-06-01"
  },
  "06-s4": {
    "description_it": "Il sentiero nel comune di La Salle, Valdigne, collega le quote basse con le frazioni e i pascoli del versante. Il tracciato percorre la fascia montana con boschi e praterie. La classificazione T o E indica un percorso accessibile.",
    "description_en": "The trail in the commune of La Salle, Valdigne, links low altitudes with the slope's hamlets and pastures. The route crosses the mountain belt through forest and meadow. The T or E rating marks an accessible itinerary.",
    "description_fr": "Le sentier dans la commune de La Salle, Valdigne, relie les basses altitudes aux hameaux et pâturages du versant. Le tracé traverse la zone montagnarde.",
    "description_de": "Der Weg in der Gemeinde La Salle, Valdigne, verbindet niedrige Höhen mit Weilern und Weiden des Hanges. Die Route quert den Bergwald.",
    "shortDescription_it": "Nel comune di La Salle, Valdigne: percorso accessibile tra boschi e praterie verso le frazioni del versante.",
    "shortDescription_en": "In the commune of La Salle, Valdigne: an accessible route through forest and meadow toward slope hamlets.",
    "shortDescription_fr": "Dans la commune de La Salle, Valdigne : itinéraire accessible entre forêts et prairies.",
    "shortDescription_de": "In der Gemeinde La Salle, Valdigne: zugänglicher Weg zwischen Wald und Wiesen.",
    "updated_at": "2026-06-01"
  },
  "07-s21": {
    "description_it": "Il percorso nel comune di Ayas, Val d'Ayas, sale verso un obiettivo di alta quota attraverso i pascoli alpini. La progressione è regolare su terreno ben segnalato con vedute sul Monte Rosa. La classificazione E indica un itinerario adatto a escursionisti allenati.",
    "description_en": "The route in the commune of Ayas, Val d'Ayas, climbs toward a high-altitude objective through alpine pastures. The progression is steady on well-marked terrain with views of Monte Rosa. The E rating marks a route for fit hikers.",
    "description_fr": "L'itinéraire dans la commune d'Ayas, Val d'Ayas, monte vers un objectif en altitude à travers des alpages. La progression est régulière avec des vues sur le Mont-Rose.",
    "description_de": "Der Weg in der Gemeinde Ayas, Val d'Ayas, steigt zu einem Hochgebirgsziel durch Almweiden auf. Gleichmäßige Progression mit Blick auf den Monte Rosa.",
    "shortDescription_it": "In Val d'Ayas, Ayas: salita E regolare verso le quote alte con vedute sul Monte Rosa.",
    "shortDescription_en": "In the Val d'Ayas, Ayas: a steady E-rated climb toward high altitude with views of Monte Rosa.",
    "shortDescription_fr": "Dans la Val d'Ayas, Ayas : montée E régulière vers les hauteurs avec vues sur le Mont-Rose.",
    "shortDescription_de": "Im Val d'Ayas, Ayas: gleichmäßiger E-Aufstieg zu hohen Lagen mit Blick auf den Monte Rosa.",
    "updated_at": "2026-06-01"
  },
  "07-s29": {
    "description_it": "Il sentiero nel comune di Ayas sale verso le quote alte del Vallone delle Cime Bianche. La classificazione EE riflette la quota elevata e l'ambiente impervio della sezione superiore.",
    "description_en": "The trail in the commune of Ayas climbs toward the high ground of the Vallone delle Cime Bianche. The EE rating reflects the high altitude and demanding environment of the upper section.",
    "description_fr": "Le sentier dans la commune d'Ayas monte vers les hauteurs du Vallone delle Cime Bianche. La cotation EE reflète l'altitude élevée.",
    "description_de": "Der Weg in der Gemeinde Ayas steigt zu den Hochlagen des Vallone delle Cime Bianche auf. EE-Bewertung wegen hoher Lage.",
    "shortDescription_it": "Comune di Ayas: salita EE verso le quote alte del Vallone delle Cime Bianche.",
    "shortDescription_en": "Commune of Ayas: an EE climb toward the high ground of the Vallone delle Cime Bianche.",
    "shortDescription_fr": "Commune d'Ayas : montée EE vers les hauteurs du Vallone delle Cime Bianche.",
    "shortDescription_de": "Gemeinde Ayas: EE-Aufstieg zu den Hochlagen des Vallone delle Cime Bianche.",
    "updated_at": "2026-06-01"
  },
  "07-s45": {
    "description_it": "Il percorso nel comune di Ayas sale verso gli alpeggi e i laghi di alta quota della Val d'Ayas. La progressione è regolare su terreno aperto. La classificazione E indica un itinerario adatto a camminatori allenati.",
    "description_en": "The route in the commune of Ayas climbs toward the alpine pastures and high-altitude lakes of the Val d'Ayas. The progression is steady over open terrain. The E rating marks a route for fit walkers.",
    "description_fr": "L'itinéraire dans la commune d'Ayas monte vers les alpages et lacs d'altitude de la Val d'Ayas sur terrain ouvert.",
    "description_de": "Der Weg in der Gemeinde Ayas steigt zu Almen und Hochgebirgsseen des Val d'Ayas über offenes Gelände auf.",
    "shortDescription_it": "In Val d'Ayas, Ayas: salita E verso alpeggi e laghi di alta quota su terreno aperto.",
    "shortDescription_en": "In the Val d'Ayas, Ayas: an E-rated climb toward alpine pastures and high-altitude lakes over open terrain.",
    "shortDescription_fr": "Dans la Val d'Ayas, Ayas : montée E vers alpages et lacs d'altitude sur terrain ouvert.",
    "shortDescription_de": "Im Val d'Ayas, Ayas: E-Aufstieg zu Almen und Hochgebirgsseen über offenes Gelände.",
    "updated_at": "2026-06-01"
  },
  "07-s64": {
    "description_it": "Il sentiero nel comune di Brusson, Val d'Ayas, percorre la fascia alta della valle verso un obiettivo panoramico. La progressione avviene su terreno aperto con vedute caratteristiche.",
    "description_en": "The trail in the commune of Brusson, Val d'Ayas, traverses the upper valley belt toward a panoramic objective over open terrain.",
    "description_fr": "Le sentier dans la commune de Brusson, Val d'Ayas, traverse la zone haute de la vallée vers un objectif panoramique sur terrain ouvert.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, durchquert die obere Talzone zu einem Panoramapunkt über offenem Gelände.",
    "shortDescription_it": "Alta Val d'Ayas, Brusson: percorso verso un obiettivo panoramico su terreno aperto.",
    "shortDescription_en": "Upper Val d'Ayas, Brusson: a route toward a panoramic objective over open terrain.",
    "shortDescription_fr": "Haute Val d'Ayas, Brusson : itinéraire vers un objectif panoramique sur terrain ouvert.",
    "shortDescription_de": "Oberes Val d'Ayas, Brusson: Weg zu einem Panoramapunkt über offenes Gelände.",
    "updated_at": "2026-06-01"
  },
  "08-s19": {
    "description_it": "Il sentiero nel comune di Aymavilles, Val di Cogne, risale il versante verso un obiettivo in quota nel Parco Nazionale del Gran Paradiso. La classificazione E indica un percorso adatto a escursionisti con buona preparazione.",
    "description_en": "The trail in the commune of Aymavilles, Val di Cogne, climbs the slope toward a high-altitude objective in the Gran Paradiso National Park. The E rating marks a route for well-prepared hikers.",
    "description_fr": "Le sentier dans la commune d'Aymavilles, Val di Cogne, remonte le versant vers un objectif en altitude dans le Grand Paradis.",
    "description_de": "Der Weg in der Gemeinde Aymavilles, Val di Cogne, steigt den Hang zu einem Hochgebirgsziel im Gran-Paradiso-Nationalpark auf.",
    "shortDescription_it": "In Val di Cogne, Aymavilles: salita E verso un obiettivo nel Parco Nazionale del Gran Paradiso.",
    "shortDescription_en": "In the Val di Cogne, Aymavilles: an E-rated climb toward an objective in the Gran Paradiso National Park.",
    "shortDescription_fr": "Dans la Val di Cogne, Aymavilles : montée E vers un objectif dans le Grand Paradis.",
    "shortDescription_de": "Im Val di Cogne, Aymavilles: E-Aufstieg zu einem Ziel im Gran-Paradiso-Nationalpark.",
    "updated_at": "2026-06-01"
  },
  "09-s1": {
    "description_it": "Il sentiero nel comune di Cogne risale il versante del Parco Nazionale del Gran Paradiso verso un obiettivo di alta quota. Il tracciato percorre un ambiente di grande qualità naturalistica con fauna e flora tipiche del parco. La classificazione E o EE riflette le condizioni dell'itinerario.",
    "description_en": "The trail in the commune of Cogne climbs the slope of the Gran Paradiso National Park toward a high-altitude objective. The route crosses an environment of exceptional natural quality with fauna and flora typical of the park. The E or EE rating reflects the route conditions.",
    "description_fr": "Le sentier dans la commune de Cogne remonte le versant du Parc National du Grand Paradis vers un objectif en haute altitude dans un environnement d'exceptionnelle qualité naturelle.",
    "description_de": "Der Weg in der Gemeinde Cogne steigt den Hang des Gran-Paradiso-Nationalparks zu einem Hochgebirgsziel auf. Die Route durchquert ein Gebiet von außergewöhnlichem Naturwert.",
    "shortDescription_it": "Nel comune di Cogne, Parco Nazionale del Gran Paradiso: salita verso un obiettivo d'alta quota in un ambiente di grande qualità naturalistica.",
    "shortDescription_en": "In the commune of Cogne, Gran Paradiso National Park: a climb toward a high-altitude objective in an environment of exceptional natural quality.",
    "shortDescription_fr": "Dans la commune de Cogne, Parc National du Grand Paradis : montée vers un objectif d'altitude dans un environnement d'exceptionnelle qualité.",
    "shortDescription_de": "In der Gemeinde Cogne, Gran-Paradiso-Nationalpark: Aufstieg zu einem Hochgebirgsziel in einer außergewöhnlichen Naturlandschaft.",
    "updated_at": "2026-06-01"
  },
  "10-s21": {
    "description_it": "Il percorso nella Valpelline, comune di Bionaz, risale il vallone in un paesaggio di alta montagna glaciale verso un obiettivo in quota. La classificazione E indica un sentiero escursionistico adatto a camminatori allenati.",
    "description_en": "The route in the Valpelline, commune of Bionaz, climbs the valley in a high glacial mountain landscape toward a high-altitude objective. The E rating marks a hiking trail for fit walkers.",
    "description_fr": "L'itinéraire dans la Valpelline, commune de Bionaz, remonte le vallon dans un paysage de haute montagne glaciaire vers un objectif en altitude.",
    "description_de": "Der Weg im Valpelline, Gemeinde Bionaz, steigt das Tal in einer hochglazialen Berglandschaft zu einem Hochgebirgsziel auf.",
    "shortDescription_it": "Alta Valpelline, Bionaz: salita E in paesaggio glaciale verso un obiettivo in quota.",
    "shortDescription_en": "Upper Valpelline, Bionaz: an E-rated climb through glacial landscape toward a high-altitude objective.",
    "shortDescription_fr": "Haute Valpelline, Bionaz : montée E dans un paysage glaciaire vers un objectif en altitude.",
    "shortDescription_de": "Oberes Valpelline, Bionaz: E-Aufstieg durch Gletscherlandschaft zu einem Hochgebirgsziel.",
    "updated_at": "2026-06-01"
  },
  "10-s8": {
    "description_it": "Il sentiero nella Valpelline, comune di Bionaz, sale attraverso il bosco verso i pascoli della fascia alpina. Il dislivello è sostenuto nella prima parte. La classificazione E indica un percorso adatto a escursionisti con buona preparazione.",
    "description_en": "The trail in the Valpelline, commune of Bionaz, climbs through forest toward the alpine pasture belt. The elevation gain is sustained in the first section. The E rating marks a route for well-prepared hikers.",
    "description_fr": "Le sentier dans la Valpelline, commune de Bionaz, monte à travers la forêt vers la ceinture des alpages. Le dénivelé est soutenu dans la première partie.",
    "description_de": "Der Weg im Valpelline, Gemeinde Bionaz, steigt durch den Wald zur Alpengürtel auf. Der Höhenunterschied ist im ersten Abschnitt anhaltend.",
    "shortDescription_it": "Nella Valpelline, Bionaz: salita E attraverso bosco e pascoli alpini con dislivello sostenuto.",
    "shortDescription_en": "In the Valpelline, Bionaz: an E-rated climb through forest and alpine pastures with sustained elevation gain.",
    "shortDescription_fr": "Dans la Valpelline, Bionaz : montée E à travers forêt et alpages avec dénivelé soutenu.",
    "shortDescription_de": "Im Valpelline, Bionaz: E-Aufstieg durch Wald und Almen mit anhaltendem Höhenunterschied.",
    "updated_at": "2026-06-01"
  },
  "12-s11": {
    "description_it": "Il percorso nel comune di Brusson, Val d'Ayas, si svolge tra le frazioni e i pascoli del versante soleggiato. Il tracciato offre vedute caratteristiche sulla valle e sulle cime circostanti. La classificazione E indica un itinerario adatto a escursionisti con normale preparazione.",
    "description_en": "The route in the commune of Brusson, Val d'Ayas, moves among the hamlets and pastures of the sunny slope. The trail offers characteristic views over the valley and surrounding peaks. The E rating marks a route for normally fit hikers.",
    "description_fr": "L'itinéraire dans la commune de Brusson, Val d'Ayas, se déroule entre hameaux et pâturages du versant ensoleillé avec des vues caractéristiques.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, verläuft zwischen Weilern und Weiden des besonnten Hanges mit charakteristischen Ausblicken.",
    "shortDescription_it": "Nel comune di Brusson, Val d'Ayas: percorso E tra frazioni e pascoli del versante soleggiato con vedute panoramiche.",
    "shortDescription_en": "In the commune of Brusson, Val d'Ayas: an E-rated route among hamlets and pastures on the sunny slope with panoramic views.",
    "shortDescription_fr": "Dans la commune de Brusson, Val d'Ayas : itinéraire E entre hameaux et pâturages du versant ensoleillé.",
    "shortDescription_de": "In der Gemeinde Brusson, Val d'Ayas: E-Weg zwischen Weilern und Weiden des besonnten Hanges.",
    "updated_at": "2026-06-01"
  },
  "12-s26": {
    "description_it": "Il sentiero nel comune di Brusson, Val d'Ayas, percorre la fascia alta della valle in un paesaggio di praterie e rocce d'alta quota. La classificazione E o EE dipende dall'obiettivo finale.",
    "description_en": "The trail in the commune of Brusson, Val d'Ayas, traverses the upper valley belt in a landscape of high-altitude meadows and rock. The E or EE rating depends on the final objective.",
    "description_fr": "Le sentier dans la commune de Brusson, Val d'Ayas, traverse la zone haute de la vallée dans un paysage de prairies et roches d'altitude.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, durchquert die obere Talzone in einer Hoch-alm- und Felslandschaft.",
    "shortDescription_it": "Alta Val d'Ayas, Brusson: percorso tra praterie e rocce d'alta quota.",
    "shortDescription_en": "Upper Val d'Ayas, Brusson: a route through high-altitude meadows and rock.",
    "shortDescription_fr": "Haute Val d'Ayas, Brusson : itinéraire entre prairies et roches d'altitude.",
    "shortDescription_de": "Oberes Val d'Ayas, Brusson: Weg zwischen Hochalmwiesen und Fels.",
    "updated_at": "2026-06-01"
  }
}`);

function caiDuration(km, gain, loss) {
  const h = km / 4 + Math.max(gain, 0) / 400 + Math.max(loss, 0) / 600;
  return Math.max(0.5, Math.round(h * 2) / 2);
}
const diffToFitness = { T: 1, E: 2, EE: 3, EEA: 4, A: 5 };

const skPath = path.join(__dirname, '../src/data/trails-skeleton.json');
const sk = JSON.parse(fs.readFileSync(skPath, 'utf8'));
let changed = 0;

const merged = sk.map(t => {
  const p = patch[t.slug];
  if (!p) return t;
  changed++;
  const fixes = {};
  if (t.duration_hours === null || t.duration_hours === undefined)
    fixes.duration_hours = caiDuration(t.distance_km, t.elevation_gain_m, t.elevation_loss_m);
  if (t.mobile_coverage === null || t.mobile_coverage === undefined)
    fixes.mobile_coverage = 'partial';
  if (t.fitness_level === null || t.fitness_level === undefined)
    fixes.fitness_level = diffToFitness[t.difficulty] ?? 2;
  if (!t.name_en) fixes.name_en = t.name_it;
  if (!t.name_fr) fixes.name_fr = t.name_it;
  if (!t.name_de) fixes.name_de = t.name_it;
  return { ...t, ...fixes, ...p };
});

console.log('Patchati:', changed);
fs.writeFileSync(skPath, JSON.stringify(merged, null, 2), 'utf8');
console.log('OK');
