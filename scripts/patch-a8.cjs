'use strict';
const fs = require('fs');
const path = require('path');

// Lotto A8: 02-s6, 05-s1, 06-s10, 06-s26, 07-s11, 07-s24, 07-s37, 07-s52, 08-s1, 08-s24, 10-s15, 10-s25, 11-s6, 12-s18, 12-s38
const patch = JSON.parse(`{
  "02-s6": {
    "description_it": "Il sentiero nel comune di Antey-Saint-André, Valtournenche, percorre il versante soleggiato della valle tra frazioni e pascoli in un paesaggio di mezza montagna. La classificazione E indica un percorso adatto a escursionisti con normale preparazione.",
    "description_en": "The trail in the commune of Antey-Saint-André, Valtournenche, traverses the sunny valley slope between hamlets and pastures in a mid-mountain landscape. The E rating marks a route for normally fit hikers.",
    "description_fr": "Le sentier dans la commune d'Antey-Saint-André, Valtournenche, parcourt le versant ensoleillé entre hameaux et pâturages.",
    "description_de": "Der Weg in der Gemeinde Antey-Saint-André, Valtournenche, durchquert den besonnten Hang zwischen Weilern und Weiden.",
    "shortDescription_it": "Nel comune di Antey-Saint-André, Valtournenche: percorso E tra frazioni e pascoli del versante soleggiato.",
    "shortDescription_en": "In the commune of Antey-Saint-André, Valtournenche: an E-rated route between hamlets and pastures on the sunny slope.",
    "shortDescription_fr": "Dans la commune d'Antey-Saint-André, Valtournenche : itinéraire E entre hameaux et pâturages.",
    "shortDescription_de": "In der Gemeinde Antey-Saint-André, Valtournenche: E-Weg zwischen Weilern und Weiden.",
    "updated_at": "2026-06-01"
  },
  "05-s1": {
    "description_it": "Il sentiero nel comune di Arvier, Valgrisenche, risale il versante dalla bassa valle verso le frazioni alte attraverso boschi e vigneti. La classificazione E o T indica un percorso accessibile.",
    "description_en": "The trail in the commune of Arvier, Valgrisenche, climbs the slope from the lower valley toward upper hamlets through forest and vineyards. The E or T rating marks an accessible route.",
    "description_fr": "Le sentier dans la commune d'Arvier, Valgrisenche, remonte le versant depuis la basse vallée vers les hameaux supérieurs à travers forêts et vignes.",
    "description_de": "Der Weg in der Gemeinde Arvier, Valgrisenche, steigt den Hang vom unteren Tal zu oberen Weilern durch Wald und Weinberge auf.",
    "shortDescription_it": "In Valgrisenche, Arvier: percorso accessibile dalla bassa valle verso le frazioni alte tra boschi e vigneti.",
    "shortDescription_en": "In the Valgrisenche, Arvier: an accessible route from the lower valley toward upper hamlets through forest and vineyards.",
    "shortDescription_fr": "Dans la Valgrisenche, Arvier : itinéraire accessible de la basse vallée vers les hameaux supérieurs.",
    "shortDescription_de": "Im Valgrisenche, Arvier: zugänglicher Weg vom unteren Tal zu den oberen Weilern.",
    "updated_at": "2026-06-01"
  },
  "06-s10": {
    "description_it": "Il percorso nel comune di La Salle, Valdigne, sale verso le frazioni e gli alpeggi del versante in un paesaggio caratteristico della Valdigne con vedute sul Monte Bianco. La classificazione E indica un itinerario adatto a escursionisti allenati.",
    "description_en": "The route in the commune of La Salle, Valdigne, climbs toward the slope's hamlets and pastures in a characteristic Valdigne landscape with views of Mont Blanc. The E rating marks a route for fit hikers.",
    "description_fr": "L'itinéraire dans la commune de La Salle, Valdigne, monte vers les hameaux et alpages du versant dans un paysage valdignard avec des vues sur le Mont-Blanc.",
    "description_de": "Der Weg in der Gemeinde La Salle, Valdigne, steigt zu Weilern und Almen des Hanges in einer für die Valdigne typischen Landschaft mit Blick auf den Mont Blanc auf.",
    "shortDescription_it": "Nel comune di La Salle, Valdigne: salita E verso frazioni e alpeggi con vedute sul Monte Bianco.",
    "shortDescription_en": "In the commune of La Salle, Valdigne: an E-rated climb toward hamlets and pastures with views of Mont Blanc.",
    "shortDescription_fr": "Dans la commune de La Salle, Valdigne : montée E vers hameaux et alpages avec vues sur le Mont-Blanc.",
    "shortDescription_de": "In der Gemeinde La Salle, Valdigne: E-Aufstieg zu Weilern und Almen mit Blick auf den Mont Blanc.",
    "updated_at": "2026-06-01"
  },
  "06-s26": {
    "description_it": "Il sentiero nel comune di La Salle, Valdigne, sale verso le zone alte del versante con un dislivello significativo. La classificazione E indica un itinerario escursionistico che richiede allenamento.",
    "description_en": "The trail in the commune of La Salle, Valdigne, climbs toward the upper slope zones with significant elevation gain. The E rating marks a hiking trail requiring fitness.",
    "description_fr": "Le sentier dans la commune de La Salle, Valdigne, monte vers les zones supérieures du versant avec un dénivelé significatif.",
    "description_de": "Der Weg in der Gemeinde La Salle, Valdigne, steigt mit erheblichem Höhenunterschied zu den oberen Hangzonen auf.",
    "shortDescription_it": "Nel comune di La Salle, Valdigne: salita E con dislivello significativo verso le zone alte del versante.",
    "shortDescription_en": "In the commune of La Salle, Valdigne: an E-rated climb with significant elevation gain toward upper slope zones.",
    "shortDescription_fr": "Dans la commune de La Salle, Valdigne : montée E avec dénivelé significatif vers les zones supérieures.",
    "shortDescription_de": "In der Gemeinde La Salle, Valdigne: E-Aufstieg mit erheblichem Höhenunterschied zu den oberen Hangzonen.",
    "updated_at": "2026-06-01"
  },
  "07-s11": {
    "description_it": "Il sentiero nel comune di Ayas, Val d'Ayas, sale verso un obiettivo di alta quota attraverso il paesaggio alpino della valle. La classificazione E o EE indica un itinerario per escursionisti allenati.",
    "description_en": "The trail in the commune of Ayas, Val d'Ayas, climbs toward a high-altitude objective through the alpine landscape of the valley. The E or EE rating marks a route for fit hikers.",
    "description_fr": "Le sentier dans la commune d'Ayas, Val d'Ayas, monte vers un objectif en altitude à travers le paysage alpin de la vallée.",
    "description_de": "Der Weg in der Gemeinde Ayas, Val d'Ayas, steigt zu einem Hochgebirgsziel durch die Alpenlandschaft des Tals auf.",
    "shortDescription_it": "In Val d'Ayas, Ayas: salita E/EE verso un obiettivo d'alta quota nel paesaggio alpino.",
    "shortDescription_en": "In the Val d'Ayas, Ayas: an E/EE-rated climb toward a high-altitude objective in the alpine landscape.",
    "shortDescription_fr": "Dans la Val d'Ayas, Ayas : montée E/EE vers un objectif en altitude dans le paysage alpin.",
    "shortDescription_de": "Im Val d'Ayas, Ayas: E/EE-Aufstieg zu einem Hochgebirgsziel in der Alpenlandschaft.",
    "updated_at": "2026-06-01"
  },
  "07-s24": {
    "description_it": "Il percorso nel comune di Ayas sale verso le quote alte della Val d'Ayas in un ambiente di alta montagna. La classificazione EE riflette la quota e il terreno impervio.",
    "description_en": "The route in the commune of Ayas climbs toward the high altitudes of the Val d'Ayas in a high-mountain environment. The EE rating reflects the altitude and demanding terrain.",
    "description_fr": "L'itinéraire dans la commune d'Ayas monte vers les hauteurs de la Val d'Ayas dans un environnement de haute montagne.",
    "description_de": "Der Weg in der Gemeinde Ayas steigt zu den Hochlagen des Val d'Ayas in einem Hochgebirgsumfeld auf.",
    "shortDescription_it": "Comune di Ayas: salita EE verso le quote alte della Val d'Ayas in ambiente di alta montagna.",
    "shortDescription_en": "Commune of Ayas: an EE climb toward the high altitudes of the Val d'Ayas in a high-mountain environment.",
    "shortDescription_fr": "Commune d'Ayas : montée EE vers les hauteurs de la Val d'Ayas en haute montagne.",
    "shortDescription_de": "Gemeinde Ayas: EE-Aufstieg zu den Hochlagen des Val d'Ayas im Hochgebirge.",
    "updated_at": "2026-06-01"
  },
  "07-s37": {
    "description_it": "Il sentiero nel comune di Avise, Valle centrale valdostana, risale un vallone laterale verso un lago di quota in un paesaggio di alta montagna. La classificazione E indica un itinerario adatto a escursionisti con normale preparazione.",
    "description_en": "The trail in the commune of Avise, central Aosta Valley, climbs a side valley toward a high-altitude lake in a high-mountain landscape. The E rating marks a route for normally fit hikers.",
    "description_fr": "Le sentier dans la commune d'Avise, vallée centrale valdôtaine, remonte un vallon latéral vers un lac d'altitude.",
    "description_de": "Der Weg in der Gemeinde Avise, zentrales Aostatal, steigt ein Seitental zu einem Hochgebirgssee auf.",
    "shortDescription_it": "Nel comune di Avise: salita E in un vallone laterale verso un lago di alta quota.",
    "shortDescription_en": "In the commune of Avise: an E-rated climb in a side valley toward a high-altitude lake.",
    "shortDescription_fr": "Dans la commune d'Avise : montée E dans un vallon latéral vers un lac d'altitude.",
    "shortDescription_de": "In der Gemeinde Avise: E-Aufstieg in ein Seitental zu einem Hochgebirgssee.",
    "updated_at": "2026-06-01"
  },
  "07-s52": {
    "description_it": "Il percorso nel comune di Ayas o Brusson sale verso un obiettivo panoramico in alta quota. La progressione avviene su terreno aperto con vedute caratteristiche della Val d'Ayas.",
    "description_en": "The route in the commune of Ayas or Brusson climbs toward a panoramic high-altitude objective. Progress is over open terrain with characteristic Val d'Ayas views.",
    "description_fr": "L'itinéraire dans la commune d'Ayas ou de Brusson monte vers un objectif panoramique en haute altitude sur terrain ouvert.",
    "description_de": "Der Weg in der Gemeinde Ayas oder Brusson steigt zu einem panoramischen Hochgebirgsziel über offenem Gelände auf.",
    "shortDescription_it": "Val d'Ayas: salita verso un obiettivo panoramico d'alta quota su terreno aperto.",
    "shortDescription_en": "Val d'Ayas: a climb toward a panoramic high-altitude objective over open terrain.",
    "shortDescription_fr": "Val d'Ayas : montée vers un objectif panoramique en altitude sur terrain ouvert.",
    "shortDescription_de": "Val d'Ayas: Aufstieg zu einem panoramischen Hochgebirgsziel über offenes Gelände.",
    "updated_at": "2026-06-01"
  },
  "08-s1": {
    "description_it": "Il sentiero nel comune di Aymavilles, Val di Cogne, parte dalla bassa valle e risale verso gli alpeggi del Parco Nazionale del Gran Paradiso. La classificazione E indica un percorso adatto a escursionisti con buona preparazione.",
    "description_en": "The trail in the commune of Aymavilles, Val di Cogne, starts from the lower valley and climbs toward the alpine pastures of the Gran Paradiso National Park. The E rating marks a route for well-prepared hikers.",
    "description_fr": "Le sentier dans la commune d'Aymavilles, Val di Cogne, part de la basse vallée et monte vers les alpages du Grand Paradis.",
    "description_de": "Der Weg in der Gemeinde Aymavilles, Val di Cogne, startet im unteren Tal und steigt zu den Almen des Gran-Paradiso-Nationalparks auf.",
    "shortDescription_it": "In Val di Cogne, Aymavilles: salita E dalla bassa valle verso gli alpeggi del Gran Paradiso.",
    "shortDescription_en": "In the Val di Cogne, Aymavilles: an E-rated climb from the lower valley toward Gran Paradiso alpine pastures.",
    "shortDescription_fr": "Dans la Val di Cogne, Aymavilles : montée E de la basse vallée vers les alpages du Grand Paradis.",
    "shortDescription_de": "Im Val di Cogne, Aymavilles: E-Aufstieg vom unteren Tal zu den Almen des Gran Paradiso.",
    "updated_at": "2026-06-01"
  },
  "08-s24": {
    "description_it": "Il percorso nel comune di Aymavilles, Val di Cogne, risale il versante verso un obiettivo in quota nel Parco Nazionale del Gran Paradiso. La classificazione E indica un sentiero adatto a escursionisti allenati.",
    "description_en": "The route in the commune of Aymavilles, Val di Cogne, climbs the slope toward a high-altitude objective in the Gran Paradiso National Park. The E rating marks a trail for fit hikers.",
    "description_fr": "L'itinéraire dans la commune d'Aymavilles, Val di Cogne, remonte le versant vers un objectif en altitude dans le Grand Paradis.",
    "description_de": "Der Weg in der Gemeinde Aymavilles, Val di Cogne, steigt den Hang zu einem Hochgebirgsziel im Gran-Paradiso-Nationalpark auf.",
    "shortDescription_it": "In Val di Cogne, Aymavilles: salita E verso un obiettivo nel Gran Paradiso.",
    "shortDescription_en": "In the Val di Cogne, Aymavilles: an E-rated climb toward an objective in the Gran Paradiso.",
    "shortDescription_fr": "Dans la Val di Cogne, Aymavilles : montée E vers un objectif dans le Grand Paradis.",
    "shortDescription_de": "Im Val di Cogne, Aymavilles: E-Aufstieg zu einem Ziel im Gran Paradiso.",
    "updated_at": "2026-06-01"
  },
  "10-s15": {
    "description_it": "Il sentiero nella Valpelline, comune di Bionaz, risale il vallone verso un obiettivo in quota. La classificazione E indica un percorso escursionistico adatto a camminatori allenati.",
    "description_en": "The trail in the Valpelline, commune of Bionaz, climbs the valley toward a high-altitude objective. The E rating marks a hiking trail for fit walkers.",
    "description_fr": "Le sentier dans la Valpelline, commune de Bionaz, remonte le vallon vers un objectif en altitude.",
    "description_de": "Der Weg im Valpelline, Gemeinde Bionaz, steigt das Tal zu einem Hochgebirgsziel auf.",
    "shortDescription_it": "Valpelline, Bionaz: salita E verso un obiettivo in quota.",
    "shortDescription_en": "Valpelline, Bionaz: an E-rated climb toward a high-altitude objective.",
    "shortDescription_fr": "Valpelline, Bionaz : montée E vers un objectif en altitude.",
    "shortDescription_de": "Valpelline, Bionaz: E-Aufstieg zu einem Hochgebirgsziel.",
    "updated_at": "2026-06-01"
  },
  "10-s25": {
    "description_it": "Il percorso nella Valpelline, comune di Bionaz, sale verso le quote alte del vallone glaciale. La classificazione E indica un sentiero privo di difficoltà tecniche ma che richiede attenzione alla quota.",
    "description_en": "The route in the Valpelline, commune of Bionaz, climbs toward the high altitudes of the glacial valley. The E rating marks a technically straightforward trail requiring attention at altitude.",
    "description_fr": "L'itinéraire dans la Valpelline, commune de Bionaz, monte vers les hautes altitudes du vallon glaciaire.",
    "description_de": "Der Weg im Valpelline, Gemeinde Bionaz, steigt zu den Hochlagen des Gletschertals auf.",
    "shortDescription_it": "Alta Valpelline, Bionaz: salita E verso le quote alte del vallone glaciale.",
    "shortDescription_en": "Upper Valpelline, Bionaz: an E-rated climb toward the high altitudes of the glacial valley.",
    "shortDescription_fr": "Haute Valpelline, Bionaz : montée E vers les hautes altitudes du vallon glaciaire.",
    "shortDescription_de": "Oberes Valpelline, Bionaz: E-Aufstieg zu den Hochlagen des Gletschertals.",
    "updated_at": "2026-06-01"
  },
  "11-s6": {
    "description_it": "Il sentiero nel massiccio del Monte Emilius risale verso un valico o una quota panoramica sulle creste della Valle centrale valdostana. La classificazione EE riflette la quota elevata e il terreno impervio.",
    "description_en": "The trail in the Monte Emilius massif climbs toward a pass or panoramic altitude on the central Aosta Valley ridges. The EE rating reflects the high altitude and demanding terrain.",
    "description_fr": "Le sentier dans le massif du Monte Emilius monte vers un col ou une altitude panoramique sur les crêtes de la vallée centrale.",
    "description_de": "Der Weg im Monte-Emilius-Massiv steigt zu einem Pass oder Panoramapunkt auf den Kämmen des zentralen Aostatals auf.",
    "shortDescription_it": "Massiccio del Monte Emilius: percorso EE verso un valico o quota panoramica sulle creste della Valle centrale.",
    "shortDescription_en": "Monte Emilius massif: an EE route toward a pass or panoramic altitude on the central valley ridges.",
    "shortDescription_fr": "Massif du Monte Emilius : itinéraire EE vers un col ou une altitude panoramique.",
    "shortDescription_de": "Monte-Emilius-Massiv: EE-Weg zu einem Pass oder Panoramapunkt.",
    "updated_at": "2026-06-01"
  },
  "12-s18": {
    "description_it": "Il percorso nel comune di Brusson, Val d'Ayas, si svolge tra le frazioni e i pascoli del versante soleggiato con vedute caratteristiche sulla valle. La classificazione E o T indica un itinerario accessibile.",
    "description_en": "The route in the commune of Brusson, Val d'Ayas, moves among the hamlets and pastures of the sunny slope with characteristic valley views. The E or T rating marks an accessible itinerary.",
    "description_fr": "L'itinéraire dans la commune de Brusson, Val d'Ayas, se déroule entre hameaux et pâturages du versant ensoleillé.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, verläuft zwischen Weilern und Weiden des besonnten Hanges.",
    "shortDescription_it": "Nel comune di Brusson, Val d'Ayas: itinerario accessibile tra frazioni e pascoli del versante soleggiato.",
    "shortDescription_en": "In the commune of Brusson, Val d'Ayas: an accessible itinerary among hamlets and pastures on the sunny slope.",
    "shortDescription_fr": "Dans la commune de Brusson, Val d'Ayas : itinéraire accessible entre hameaux et pâturages.",
    "shortDescription_de": "In der Gemeinde Brusson, Val d'Ayas: zugänglicher Weg zwischen Weilern und Weiden.",
    "updated_at": "2026-06-01"
  },
  "12-s38": {
    "description_it": "Il sentiero nel comune di Brusson, Val d'Ayas, percorre la fascia alta della valle in un paesaggio di praterie e rocce d'alta quota. La classificazione E o EE dipende dall'obiettivo finale.",
    "description_en": "The trail in the commune of Brusson, Val d'Ayas, traverses the upper valley belt in a landscape of high-altitude meadows and rock. The E or EE rating depends on the final objective.",
    "description_fr": "Le sentier dans la commune de Brusson, Val d'Ayas, traverse la zone haute de la vallée dans un paysage de prairies et roches d'altitude.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, durchquert die obere Talzone in einer Hochalm- und Felslandschaft.",
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
