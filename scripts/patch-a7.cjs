'use strict';
const fs = require('fs');
const path = require('path');

// Lotto A7: 02-s3, 04-s7, 06-s1, 06-s25, 07-s10, 07-s23, 07-s36, 07-s5, 07-s9, 08-s23, 10-s12, 10-s24, 11-s2, 12-s13, 12-s36
const patch = JSON.parse(`{
  "02-s3": {
    "description_it": "Il sentiero nel comune di Antey-Saint-André, Valtournenche, percorre i versanti soleggiati della valle collegando frazioni e pascoli in un ambiente di mezza montagna. La classificazione E indica un percorso adatto a escursionisti con normale preparazione.",
    "description_en": "The trail in the commune of Antey-Saint-André, Valtournenche, traverses the sunny valley slopes linking hamlets and pastures in a mid-mountain environment. The E rating marks a route for normally fit hikers.",
    "description_fr": "Le sentier dans la commune d'Antey-Saint-André, Valtournenche, parcourt les versants ensoleillés de la vallée entre hameaux et pâturages.",
    "description_de": "Der Weg in der Gemeinde Antey-Saint-André, Valtournenche, durchquert die besonnten Talhänge zwischen Weilern und Weiden.",
    "shortDescription_it": "Nel comune di Antey-Saint-André, Valtournenche: percorso E tra versanti soleggiati, frazioni e pascoli.",
    "shortDescription_en": "In the commune of Antey-Saint-André, Valtournenche: an E-rated route across sunny slopes, hamlets and pastures.",
    "shortDescription_fr": "Dans la commune d'Antey-Saint-André, Valtournenche : itinéraire E entre versants ensoleillés, hameaux et pâturages.",
    "shortDescription_de": "In der Gemeinde Antey-Saint-André, Valtournenche: E-Weg über besonnte Hänge, Weiler und Weiden.",
    "updated_at": "2026-06-01"
  },
  "04-s7": {
    "description_it": "Il sentiero nel comune di Champdepraz risale il versante boscato verso le frazioni alte in un paesaggio di media montagna. La classificazione E indica un itinerario escursionistico adatto a camminatori allenati.",
    "description_en": "The trail in the commune of Champdepraz climbs the wooded slope toward upper hamlets in a mid-mountain landscape. The E rating marks a hiking trail for fit walkers.",
    "description_fr": "Le sentier dans la commune de Champdepraz remonte le versant boisé vers les hameaux supérieurs dans un paysage de moyenne montagne.",
    "description_de": "Der Weg in der Gemeinde Champdepraz steigt den bewaldeten Hang zu oberen Weilern in einer mittelhohen Berglandschaft auf.",
    "shortDescription_it": "Nel comune di Champdepraz: salita E attraverso il bosco verso le frazioni alte in paesaggio di media montagna.",
    "shortDescription_en": "In the commune of Champdepraz: an E-rated climb through forest toward upper hamlets in a mid-mountain landscape.",
    "shortDescription_fr": "Dans la commune de Champdepraz : montée E à travers la forêt vers les hameaux supérieurs.",
    "shortDescription_de": "In der Gemeinde Champdepraz: E-Aufstieg durch den Wald zu oberen Weilern.",
    "updated_at": "2026-06-01"
  },
  "06-s1": {
    "description_it": "Il sentiero nel comune di La Salle, Valdigne, percorre la fascia montana tra il fondovalle e le frazioni superiori attraverso boschi e vigneti. La classificazione T o E indica un percorso accessibile a escursionisti di diversa preparazione.",
    "description_en": "The trail in the commune of La Salle, Valdigne, crosses the mountain belt between the valley floor and upper hamlets through forest and vineyards. The T or E rating marks an accessible route for hikers of varying preparation.",
    "description_fr": "Le sentier dans la commune de La Salle, Valdigne, traverse la ceinture montagnarde entre le fond de vallée et les hameaux supérieurs à travers forêts et vignes.",
    "description_de": "Der Weg in der Gemeinde La Salle, Valdigne, durchquert den Bergwald zwischen Talboden und oberen Weilern durch Wald und Weinberge.",
    "shortDescription_it": "Nel comune di La Salle, Valdigne: percorso accessibile tra boschi e vigneti verso le frazioni superiori.",
    "shortDescription_en": "In the commune of La Salle, Valdigne: an accessible route through forest and vineyards toward upper hamlets.",
    "shortDescription_fr": "Dans la commune de La Salle, Valdigne : itinéraire accessible entre forêts et vignes vers les hameaux supérieurs.",
    "shortDescription_de": "In der Gemeinde La Salle, Valdigne: zugänglicher Weg durch Wald und Weinberge zu den oberen Weilern.",
    "updated_at": "2026-06-01"
  },
  "06-s25": {
    "description_it": "Il percorso nel comune di La Salle, Valdigne, sale verso le zone alte del versante in un paesaggio alpino con vedute sul Monte Bianco. La classificazione E o EE indica un itinerario per escursionisti allenati.",
    "description_en": "The route in the commune of La Salle, Valdigne, climbs toward the upper slope zones in an alpine landscape with views of Mont Blanc. The E or EE rating marks a route for fit hikers.",
    "description_fr": "L'itinéraire dans la commune de La Salle, Valdigne, monte vers les zones supérieures du versant dans un paysage alpin avec des vues sur le Mont-Blanc.",
    "description_de": "Der Weg in der Gemeinde La Salle, Valdigne, steigt zu oberen Hangzonen in einer Alpenlandschaft mit Blick auf den Mont Blanc auf.",
    "shortDescription_it": "In Valdigne, La Salle: salita E/EE verso le zone alte del versante con vedute sul Monte Bianco.",
    "shortDescription_en": "In the Valdigne, La Salle: an E/EE-rated climb toward upper slope zones with views of Mont Blanc.",
    "shortDescription_fr": "En Valdigne, La Salle : montée E/EE vers les zones supérieures avec vues sur le Mont-Blanc.",
    "shortDescription_de": "Im Valdigne, La Salle: E/EE-Aufstieg zu oberen Hangzonen mit Blick auf den Mont Blanc.",
    "updated_at": "2026-06-01"
  },
  "07-s10": {
    "description_it": "Il sentiero nel comune di Ayas, Val d'Ayas, sale verso un obiettivo di alta quota attraverso i pascoli e le rocce del versante. La progressione è regolare con vedute sul Monte Rosa. La classificazione E indica un itinerario adatto a escursionisti allenati.",
    "description_en": "The trail in the commune of Ayas, Val d'Ayas, climbs toward a high-altitude objective through the slope's pastures and rock. The progression is steady with views of Monte Rosa. The E rating marks a route for fit hikers.",
    "description_fr": "Le sentier dans la commune d'Ayas, Val d'Ayas, monte vers un objectif en altitude à travers pâturages et roches du versant.",
    "description_de": "Der Weg in der Gemeinde Ayas, Val d'Ayas, steigt zu einem Hochgebirgsziel durch Weiden und Fels des Hanges auf.",
    "shortDescription_it": "In Val d'Ayas, Ayas: salita E verso un obiettivo d'alta quota tra pascoli e rocce con vedute sul Monte Rosa.",
    "shortDescription_en": "In the Val d'Ayas, Ayas: an E-rated climb toward a high-altitude objective through pastures and rock with views of Monte Rosa.",
    "shortDescription_fr": "Dans la Val d'Ayas, Ayas : montée E vers un objectif en altitude entre pâturages et roches.",
    "shortDescription_de": "Im Val d'Ayas, Ayas: E-Aufstieg zu einem Hochgebirgsziel durch Weiden und Fels.",
    "updated_at": "2026-06-01"
  },
  "07-s23": {
    "description_it": "Il percorso nel comune di Ayas sale verso un obiettivo di alta quota in un ambiente di alta montagna. La classificazione E o EE riflette le condizioni del terreno nella sezione superiore.",
    "description_en": "The route in the commune of Ayas climbs toward a high-altitude objective in a high-mountain environment. The E or EE rating reflects terrain conditions in the upper section.",
    "description_fr": "L'itinéraire dans la commune d'Ayas monte vers un objectif en haute altitude dans un environnement de haute montagne.",
    "description_de": "Der Weg in der Gemeinde Ayas steigt zu einem Hochgebirgsziel in einem Hochgebirgsumfeld auf.",
    "shortDescription_it": "Comune di Ayas: salita verso un obiettivo d'alta quota in ambiente di alta montagna.",
    "shortDescription_en": "Commune of Ayas: a climb toward a high-altitude objective in a high-mountain environment.",
    "shortDescription_fr": "Commune d'Ayas : montée vers un objectif en haute altitude.",
    "shortDescription_de": "Gemeinde Ayas: Aufstieg zu einem Hochgebirgsziel.",
    "updated_at": "2026-06-01"
  },
  "07-s36": {
    "description_it": "Il sentiero nel comune di Avise, Valle centrale valdostana, risale un vallone laterale verso un lago di quota. La classificazione E indica un itinerario adatto a escursionisti con normale preparazione.",
    "description_en": "The trail in the commune of Avise, central Aosta Valley, climbs a side valley toward a high-altitude lake. The E rating marks a route for normally fit hikers.",
    "description_fr": "Le sentier dans la commune d'Avise, vallée centrale valdôtaine, remonte un vallon latéral vers un lac d'altitude.",
    "description_de": "Der Weg in der Gemeinde Avise, zentrales Aostatal, steigt ein Seitental zu einem Hochgebirgssee auf.",
    "shortDescription_it": "Nel comune di Avise: salita E in un vallone laterale verso un lago di alta quota.",
    "shortDescription_en": "In the commune of Avise: an E-rated climb in a side valley toward a high-altitude lake.",
    "shortDescription_fr": "Dans la commune d'Avise : montée E dans un vallon latéral vers un lac d'altitude.",
    "shortDescription_de": "In der Gemeinde Avise: E-Aufstieg in ein Seitental zu einem Hochgebirgssee.",
    "updated_at": "2026-06-01"
  },
  "07-s5": {
    "description_it": "Il sentiero nel comune di Ayas, Val d'Ayas, risale verso un valico o un obiettivo panoramico. La classificazione E indica un percorso adatto a escursionisti allenati.",
    "description_en": "The trail in the commune of Ayas, Val d'Ayas, climbs toward a pass or panoramic objective. The E rating marks a route for fit hikers.",
    "description_fr": "Le sentier dans la commune d'Ayas, Val d'Ayas, monte vers un col ou un objectif panoramique.",
    "description_de": "Der Weg in der Gemeinde Ayas, Val d'Ayas, steigt zu einem Pass oder Panoramapunkt auf.",
    "shortDescription_it": "In Val d'Ayas, Ayas: salita E verso un valico o obiettivo panoramico.",
    "shortDescription_en": "In the Val d'Ayas, Ayas: an E-rated climb toward a pass or panoramic objective.",
    "shortDescription_fr": "Dans la Val d'Ayas, Ayas : montée E vers un col ou un objectif panoramique.",
    "shortDescription_de": "Im Val d'Ayas, Ayas: E-Aufstieg zu einem Pass oder Panoramapunkt.",
    "updated_at": "2026-06-01"
  },
  "07-s9": {
    "description_it": "Il percorso nel comune di Ayas, Val d'Ayas, sale attraverso i pascoli alpini verso un obiettivo di alta quota. La progressione è regolare su terreno aperto con vedute caratteristiche.",
    "description_en": "The route in the commune of Ayas, Val d'Ayas, climbs through alpine pastures toward a high-altitude objective. The progression is steady over open terrain with characteristic views.",
    "description_fr": "L'itinéraire dans la commune d'Ayas, Val d'Ayas, monte à travers des alpages vers un objectif en haute altitude sur terrain ouvert.",
    "description_de": "Der Weg in der Gemeinde Ayas, Val d'Ayas, steigt durch Almweiden zu einem Hochgebirgsziel über offenem Gelände auf.",
    "shortDescription_it": "In Val d'Ayas, Ayas: salita E regolare attraverso pascoli alpini verso un obiettivo d'alta quota.",
    "shortDescription_en": "In the Val d'Ayas, Ayas: a steady E-rated climb through alpine pastures toward a high-altitude objective.",
    "shortDescription_fr": "Dans la Val d'Ayas, Ayas : montée E régulière à travers alpages vers un objectif en altitude.",
    "shortDescription_de": "Im Val d'Ayas, Ayas: gleichmäßiger E-Aufstieg durch Almweiden zu einem Hochgebirgsziel.",
    "updated_at": "2026-06-01"
  },
  "08-s23": {
    "description_it": "Il sentiero nel comune di Aymavilles, Val di Cogne, risale il versante verso gli alpeggi del Parco Nazionale del Gran Paradiso. La classificazione E indica un percorso adatto a escursionisti allenati.",
    "description_en": "The trail in the commune of Aymavilles, Val di Cogne, climbs the slope toward the alpine pastures of the Gran Paradiso National Park. The E rating marks a route for fit hikers.",
    "description_fr": "Le sentier dans la commune d'Aymavilles, Val di Cogne, remonte le versant vers les alpages du Grand Paradis.",
    "description_de": "Der Weg in der Gemeinde Aymavilles, Val di Cogne, steigt den Hang zu den Almen des Gran-Paradiso-Nationalparks auf.",
    "shortDescription_it": "In Val di Cogne, Aymavilles: salita E verso gli alpeggi del Gran Paradiso.",
    "shortDescription_en": "In the Val di Cogne, Aymavilles: an E-rated climb toward the Gran Paradiso alpine pastures.",
    "shortDescription_fr": "Dans la Val di Cogne, Aymavilles : montée E vers les alpages du Grand Paradis.",
    "shortDescription_de": "Im Val di Cogne, Aymavilles: E-Aufstieg zu den Almen des Gran Paradiso.",
    "updated_at": "2026-06-01"
  },
  "10-s12": {
    "description_it": "Il percorso nella Valpelline, comune di Bionaz, risale il vallone verso un obiettivo in quota. La classificazione E indica un sentiero escursionistico adatto a camminatori allenati.",
    "description_en": "The route in the Valpelline, commune of Bionaz, climbs the valley toward a high-altitude objective. The E rating marks a hiking trail for fit walkers.",
    "description_fr": "L'itinéraire dans la Valpelline, commune de Bionaz, remonte le vallon vers un objectif en altitude.",
    "description_de": "Der Weg im Valpelline, Gemeinde Bionaz, steigt das Tal zu einem Hochgebirgsziel auf.",
    "shortDescription_it": "Valpelline, Bionaz: salita E verso un obiettivo in quota.",
    "shortDescription_en": "Valpelline, Bionaz: an E-rated climb toward a high-altitude objective.",
    "shortDescription_fr": "Valpelline, Bionaz : montée E vers un objectif en altitude.",
    "shortDescription_de": "Valpelline, Bionaz: E-Aufstieg zu einem Hochgebirgsziel.",
    "updated_at": "2026-06-01"
  },
  "10-s24": {
    "description_it": "Il sentiero nella Valpelline, comune di Bionaz, percorre l'alta valle verso un obiettivo glaciale su terreno aperto. La classificazione E indica un percorso privo di difficoltà tecniche.",
    "description_en": "The trail in the Valpelline, commune of Bionaz, traverses the upper valley toward a glacial objective over open terrain. The E rating reflects no technical difficulty.",
    "description_fr": "Le sentier dans la Valpelline, commune de Bionaz, traverse la haute vallée vers un objectif glaciaire sur terrain ouvert.",
    "description_de": "Der Weg im Valpelline, Gemeinde Bionaz, durchquert das obere Tal zu einem Gletscherziel über offenem Gelände.",
    "shortDescription_it": "Alta Valpelline, Bionaz: percorso E verso un obiettivo glaciale su terreno aperto.",
    "shortDescription_en": "Upper Valpelline, Bionaz: an E-rated route toward a glacial objective over open terrain.",
    "shortDescription_fr": "Haute Valpelline, Bionaz : itinéraire E vers un objectif glaciaire sur terrain ouvert.",
    "shortDescription_de": "Oberes Valpelline, Bionaz: E-Weg zu einem Gletscherziel über offenes Gelände.",
    "updated_at": "2026-06-01"
  },
  "11-s2": {
    "description_it": "Il sentiero nel massiccio del Monte Emilius risale verso una quota panoramica sulle creste della Valle centrale valdostana. La classificazione EE riflette la quota elevata e il terreno impervio.",
    "description_en": "The trail in the Monte Emilius massif climbs toward a panoramic altitude on the ridges of the central Aosta Valley. The EE rating reflects the high altitude and demanding terrain.",
    "description_fr": "Le sentier dans le massif du Monte Emilius monte vers une altitude panoramique sur les crêtes de la vallée centrale valdôtaine.",
    "description_de": "Der Weg im Monte-Emilius-Massiv steigt zu einer Panoramahöhe auf den Kämmen des zentralen Aostatals auf.",
    "shortDescription_it": "Massiccio del Monte Emilius: percorso EE verso una quota panoramica sulle creste della Valle centrale.",
    "shortDescription_en": "Monte Emilius massif: an EE route toward a panoramic altitude on the central valley ridges.",
    "shortDescription_fr": "Massif du Monte Emilius : itinéraire EE vers une altitude panoramique sur les crêtes.",
    "shortDescription_de": "Monte-Emilius-Massiv: EE-Weg zu einer Panoramahöhe auf den Kämmen.",
    "updated_at": "2026-06-01"
  },
  "12-s13": {
    "description_it": "Il percorso nel comune di Brusson, Val d'Ayas, si svolge tra le frazioni e i boschi del versante soleggiato con vedute sulla valle. La classificazione E o T indica un itinerario accessibile.",
    "description_en": "The route in the commune of Brusson, Val d'Ayas, moves between the hamlets and forest of the sunny slope with valley views. The E or T rating marks an accessible itinerary.",
    "description_fr": "L'itinéraire dans la commune de Brusson, Val d'Ayas, se déroule entre hameaux et forêts du versant ensoleillé.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, verläuft zwischen Weilern und Wald des besonnten Hanges.",
    "shortDescription_it": "Nel comune di Brusson, Val d'Ayas: itinerario accessibile tra frazioni e boschi del versante soleggiato.",
    "shortDescription_en": "In the commune of Brusson, Val d'Ayas: an accessible itinerary between hamlets and forest on the sunny slope.",
    "shortDescription_fr": "Dans la commune de Brusson, Val d'Ayas : itinéraire accessible entre hameaux et forêts.",
    "shortDescription_de": "In der Gemeinde Brusson, Val d'Ayas: zugänglicher Weg zwischen Weilern und Wald.",
    "updated_at": "2026-06-01"
  },
  "12-s36": {
    "description_it": "Il sentiero nel comune di Brusson, Val d'Ayas, percorre la fascia alta della valle verso un obiettivo panoramico. La progressione avviene su terreno aperto.",
    "description_en": "The trail in the commune of Brusson, Val d'Ayas, traverses the upper valley belt toward a panoramic objective over open terrain.",
    "description_fr": "Le sentier dans la commune de Brusson, Val d'Ayas, traverse la zone haute de la vallée vers un objectif panoramique.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, durchquert die obere Talzone zu einem Panoramapunkt über offenem Gelände.",
    "shortDescription_it": "Alta Val d'Ayas, Brusson: percorso verso un obiettivo panoramico su terreno aperto.",
    "shortDescription_en": "Upper Val d'Ayas, Brusson: a route toward a panoramic objective over open terrain.",
    "shortDescription_fr": "Haute Val d'Ayas, Brusson : itinéraire vers un objectif panoramique sur terrain ouvert.",
    "shortDescription_de": "Oberes Val d'Ayas, Brusson: Weg zu einem Panoramapunkt über offenes Gelände.",
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
