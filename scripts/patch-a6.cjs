'use strict';
const fs = require('fs');
const path = require('path');

// Lotto A6: 02-s27, 04-s11, 05-s8, 06-s2, 06-s9, 07-s22, 07-s30, 07-s47, 07-s70, 08-s2, 10-s11, 10-s23, 11-s15, 12-s12, 12-s27
const patch = JSON.parse(`{
  "02-s27": {
    "description_it": "Il sentiero nel comune di Torgnon, Valtournenche, percorre il versante della valle tra frazioni, boschi e pascoli aperti con vedute sul fondovalle e sulle cime. La classificazione E indica un percorso adatto a escursionisti con normale preparazione.",
    "description_en": "The trail in the commune of Torgnon, Valtournenche, crosses the valley slope between hamlets, forest and open pastures with views of the valley floor and peaks. The E rating marks a route for normally fit hikers.",
    "description_fr": "Le sentier dans la commune de Torgnon, Valtournenche, traverse le versant de la vallée entre hameaux, forêts et pâturages ouverts.",
    "description_de": "Der Weg in der Gemeinde Torgnon, Valtournenche, durchquert den Talhang zwischen Weilern, Wald und offenen Weiden.",
    "shortDescription_it": "Nel comune di Torgnon, Valtournenche: percorso E tra frazioni, boschi e pascoli con vedute panoramiche.",
    "shortDescription_en": "In the commune of Torgnon, Valtournenche: an E-rated route through hamlets, forest and pastures with panoramic views.",
    "shortDescription_fr": "Dans la commune de Torgnon, Valtournenche : itinéraire E entre hameaux, forêts et pâturages.",
    "shortDescription_de": "In der Gemeinde Torgnon, Valtournenche: E-Weg zwischen Weilern, Wald und Weiden.",
    "updated_at": "2026-06-01"
  },
  "04-s11": {
    "description_it": "Il sentiero nel comune di Champdepraz, Valle del Cervino, risale il versante boscato verso le frazioni alte e gli alpeggi. La classificazione E indica un itinerario escursionistico adatto a camminatori allenati.",
    "description_en": "The trail in the commune of Champdepraz, Valle del Cervino area, climbs the wooded slope toward upper hamlets and alpine pastures. The E rating marks a hiking trail for fit walkers.",
    "description_fr": "Le sentier dans la commune de Champdepraz remonte le versant boisé vers les hameaux supérieurs et les alpages.",
    "description_de": "Der Weg in der Gemeinde Champdepraz steigt den bewaldeten Hang zu oberen Weilern und Almen auf.",
    "shortDescription_it": "Nel comune di Champdepraz: salita E attraverso il bosco verso le frazioni alte e gli alpeggi.",
    "shortDescription_en": "In the commune of Champdepraz: an E-rated climb through forest toward upper hamlets and alpine pastures.",
    "shortDescription_fr": "Dans la commune de Champdepraz : montée E à travers la forêt vers les hameaux supérieurs.",
    "shortDescription_de": "In der Gemeinde Champdepraz: E-Aufstieg durch den Wald zu oberen Weilern und Almen.",
    "updated_at": "2026-06-01"
  },
  "05-s8": {
    "description_it": "Il percorso nel comune di Arvier, Valgrisenche, sale attraverso boschi e praterie verso gli alpeggi della fascia superiore. Il tracciato guadagna quota regolarmente in un ambiente selvaggio e poco frequentato.",
    "description_en": "The route in the commune of Arvier, Valgrisenche, climbs through forest and meadow toward the pastures of the upper belt. The trail gains height steadily in a wild and lightly frequented environment.",
    "description_fr": "L'itinéraire dans la commune d'Arvier, Valgrisenche, monte à travers forêts et prairies vers les alpages de la ceinture supérieure.",
    "description_de": "Der Weg in der Gemeinde Arvier, Valgrisenche, steigt durch Wald und Wiesen zu den Almen der oberen Zone auf.",
    "shortDescription_it": "In Valgrisenche, Arvier: salita regolare E attraverso boschi e praterie verso gli alpeggi superiori.",
    "shortDescription_en": "In the Valgrisenche, Arvier: a steady E-rated climb through forest and meadows toward upper pastures.",
    "shortDescription_fr": "Dans la Valgrisenche, Arvier : montée E régulière à travers forêts et prairies vers les alpages.",
    "shortDescription_de": "Im Valgrisenche, Arvier: gleichmäßiger E-Aufstieg durch Wald und Wiesen zu den Hochalmen.",
    "updated_at": "2026-06-01"
  },
  "06-s2": {
    "description_it": "Il sentiero nel comune di La Salle, Valdigne, parte da una quota bassa e sale verso le frazioni e i pascoli del versante. Il tracciato percorre la fascia montana con boschi misti e vedute sul Monte Bianco. La classificazione E o T indica un percorso accessibile.",
    "description_en": "The trail in the commune of La Salle, Valdigne, starts at low altitude and climbs toward slope hamlets and pastures. The route crosses the mountain belt through mixed forest with views of Mont Blanc. The E or T rating marks an accessible route.",
    "description_fr": "Le sentier dans la commune de La Salle, Valdigne, part d'une basse altitude et monte vers les hameaux et pâturages du versant avec des vues sur le Mont-Blanc.",
    "description_de": "Der Weg in der Gemeinde La Salle, Valdigne, startet auf niedriger Höhe und steigt zu Weilern und Weiden des Hanges mit Blick auf den Mont Blanc auf.",
    "shortDescription_it": "Nel comune di La Salle, Valdigne: percorso accessibile tra boschi misti e pascoli con vedute sul Monte Bianco.",
    "shortDescription_en": "In the commune of La Salle, Valdigne: an accessible route through mixed forest and pastures with views of Mont Blanc.",
    "shortDescription_fr": "Dans la commune de La Salle, Valdigne : itinéraire accessible entre forêts mixtes et pâturages avec vues sur le Mont-Blanc.",
    "shortDescription_de": "In der Gemeinde La Salle, Valdigne: zugänglicher Weg durch Mischwald und Weiden mit Blick auf den Mont Blanc.",
    "updated_at": "2026-06-01"
  },
  "06-s9": {
    "description_it": "Il percorso nel comune di La Salle, Valdigne, sale verso le zone alte del versante attraverso boschi e praterie. La classificazione E indica un itinerario adatto a escursionisti allenati.",
    "description_en": "The route in the commune of La Salle, Valdigne, climbs toward upper slope zones through forest and meadow. The E rating marks a route for fit hikers.",
    "description_fr": "L'itinéraire dans la commune de La Salle, Valdigne, monte vers les zones supérieures du versant à travers forêts et prairies.",
    "description_de": "Der Weg in der Gemeinde La Salle, Valdigne, steigt zu den oberen Hangzonen durch Wald und Wiesen auf.",
    "shortDescription_it": "Nel comune di La Salle, Valdigne: salita E verso le zone alte del versante tra boschi e praterie.",
    "shortDescription_en": "In the commune of La Salle, Valdigne: an E-rated climb toward upper slope zones through forest and meadow.",
    "shortDescription_fr": "Dans la commune de La Salle, Valdigne : montée E vers les zones supérieures à travers forêts et prairies.",
    "shortDescription_de": "In der Gemeinde La Salle, Valdigne: E-Aufstieg zu oberen Hangzonen durch Wald und Wiesen.",
    "updated_at": "2026-06-01"
  },
  "07-s22": {
    "description_it": "Il sentiero nel comune di Ayas, Val d'Ayas, sale verso un obiettivo di alta quota attraverso i pascoli alpini con vedute sul Monte Rosa. La classificazione E indica un itinerario adatto a escursionisti con normale preparazione.",
    "description_en": "The trail in the commune of Ayas, Val d'Ayas, climbs toward a high-altitude objective through alpine pastures with views of Monte Rosa. The E rating marks a route for normally fit hikers.",
    "description_fr": "Le sentier dans la commune d'Ayas, Val d'Ayas, monte vers un objectif en altitude à travers des alpages avec vues sur le Mont-Rose.",
    "description_de": "Der Weg in der Gemeinde Ayas, Val d'Ayas, steigt zu einem Hochgebirgsziel durch Almweiden mit Blick auf den Monte Rosa auf.",
    "shortDescription_it": "In Val d'Ayas, Ayas: salita E verso le quote alte attraverso pascoli alpini con vedute sul Monte Rosa.",
    "shortDescription_en": "In the Val d'Ayas, Ayas: an E-rated climb toward high altitudes through alpine pastures with views of Monte Rosa.",
    "shortDescription_fr": "Dans la Val d'Ayas, Ayas : montée E vers les hauteurs à travers des alpages avec vues sur le Mont-Rose.",
    "shortDescription_de": "Im Val d'Ayas, Ayas: E-Aufstieg zu hohen Lagen durch Almweiden mit Blick auf den Monte Rosa.",
    "updated_at": "2026-06-01"
  },
  "07-s30": {
    "description_it": "Il percorso nel comune di Ayas risale il vallone verso un obiettivo in quota in un ambiente di alta montagna. La classificazione EE riflette la quota elevata e il terreno impervio.",
    "description_en": "The route in the commune of Ayas climbs the valley toward a high-altitude objective in a high-mountain environment. The EE rating reflects the high altitude and demanding terrain.",
    "description_fr": "L'itinéraire dans la commune d'Ayas remonte le vallon vers un objectif en altitude dans un environnement de haute montagne. La cotation EE reflète l'altitude.",
    "description_de": "Der Weg in der Gemeinde Ayas steigt das Tal zu einem Hochgebirgsziel in einem Hochgebirgsumfeld auf. EE-Bewertung wegen hoher Lage.",
    "shortDescription_it": "Comune di Ayas: salita EE in alta montagna verso un obiettivo panoramico d'alta quota.",
    "shortDescription_en": "Commune of Ayas: an EE climb in high-mountain terrain toward a panoramic high-altitude objective.",
    "shortDescription_fr": "Commune d'Ayas : montée EE en haute montagne vers un objectif panoramique.",
    "shortDescription_de": "Gemeinde Ayas: EE-Aufstieg im Hochgebirge zu einem Panoramapunkt.",
    "updated_at": "2026-06-01"
  },
  "07-s47": {
    "description_it": "Il sentiero nel comune di Ayas sale verso gli alpeggi e le quote alte della Val d'Ayas. La progressione è regolare su terreno ben segnalato. La classificazione E indica un itinerario adatto a camminatori allenati.",
    "description_en": "The trail in the commune of Ayas climbs toward the alpine pastures and high ground of the Val d'Ayas. The progression is steady on well-marked terrain. The E rating marks a route for fit walkers.",
    "description_fr": "Le sentier dans la commune d'Ayas monte vers les alpages et les hauteurs de la Val d'Ayas sur terrain bien balisé.",
    "description_de": "Der Weg in der Gemeinde Ayas steigt zu Almen und hohen Lagen des Val d'Ayas auf gut markiertem Gelände auf.",
    "shortDescription_it": "In Val d'Ayas, Ayas: salita E verso alpeggi e quote alte su terreno ben segnalato.",
    "shortDescription_en": "In the Val d'Ayas, Ayas: an E-rated climb toward alpine pastures and high ground on well-marked terrain.",
    "shortDescription_fr": "Dans la Val d'Ayas, Ayas : montée E vers alpages et hauteurs sur terrain bien balisé.",
    "shortDescription_de": "Im Val d'Ayas, Ayas: E-Aufstieg zu Almen und hohen Lagen auf gut markiertem Gelände.",
    "updated_at": "2026-06-01"
  },
  "07-s70": {
    "description_it": "Il percorso nel comune di Brusson, Val d'Ayas, si svolge in un ambiente di alta quota verso un obiettivo panoramico. La classificazione E o EE riflette le condizioni del terreno.",
    "description_en": "The route in the commune of Brusson, Val d'Ayas, traverses a high-altitude environment toward a panoramic objective. The E or EE rating reflects terrain conditions.",
    "description_fr": "L'itinéraire dans la commune de Brusson, Val d'Ayas, se déroule en haute altitude vers un objectif panoramique.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, verläuft in einem Hochgebirgsumfeld zu einem Panoramapunkt.",
    "shortDescription_it": "Alta Val d'Ayas, Brusson: percorso verso un obiettivo panoramico in alta quota.",
    "shortDescription_en": "Upper Val d'Ayas, Brusson: a route toward a panoramic objective at high altitude.",
    "shortDescription_fr": "Haute Val d'Ayas, Brusson : itinéraire vers un objectif panoramique en altitude.",
    "shortDescription_de": "Oberes Val d'Ayas, Brusson: Weg zu einem Panoramapunkt in hoher Lage.",
    "updated_at": "2026-06-01"
  },
  "08-s2": {
    "description_it": "Il sentiero nel comune di Aymavilles, Val di Cogne, parte da una bassa quota e sale verso gli alpeggi del Parco Nazionale del Gran Paradiso. La classificazione E indica un percorso adatto a escursionisti con buona preparazione.",
    "description_en": "The trail in the commune of Aymavilles, Val di Cogne, starts at low altitude and climbs toward the alpine pastures of the Gran Paradiso National Park. The E rating marks a route for well-prepared hikers.",
    "description_fr": "Le sentier dans la commune d'Aymavilles, Val di Cogne, part d'une basse altitude et monte vers les alpages du Grand Paradis.",
    "description_de": "Der Weg in der Gemeinde Aymavilles, Val di Cogne, startet auf niedriger Höhe und steigt zu den Almen des Gran-Paradiso-Nationalparks auf.",
    "shortDescription_it": "In Val di Cogne, Aymavilles: salita E da bassa quota verso gli alpeggi del Gran Paradiso.",
    "shortDescription_en": "In the Val di Cogne, Aymavilles: an E-rated climb from low altitude toward Gran Paradiso alpine pastures.",
    "shortDescription_fr": "Dans la Val di Cogne, Aymavilles : montée E de basse altitude vers les alpages du Grand Paradis.",
    "shortDescription_de": "Im Val di Cogne, Aymavilles: E-Aufstieg von niedriger Höhe zu den Almen des Gran Paradiso.",
    "updated_at": "2026-06-01"
  },
  "10-s11": {
    "description_it": "Il percorso nella Valpelline, comune di Bionaz, risale il vallone verso un obiettivo in quota nel paesaggio glaciale dell'alta valle. La classificazione E indica un sentiero adatto a escursionisti allenati.",
    "description_en": "The route in the Valpelline, commune of Bionaz, climbs the valley toward a high-altitude objective in the glacial landscape. The E rating marks a trail for fit hikers.",
    "description_fr": "L'itinéraire dans la Valpelline, commune de Bionaz, remonte le vallon vers un objectif en altitude dans le paysage glaciaire.",
    "description_de": "Der Weg im Valpelline, Gemeinde Bionaz, steigt das Tal zu einem Hochgebirgsziel in der Gletscherlandschaft auf.",
    "shortDescription_it": "Valpelline, Bionaz: salita E verso un obiettivo in quota nel paesaggio glaciale.",
    "shortDescription_en": "Valpelline, Bionaz: an E-rated climb toward a high-altitude objective in the glacial landscape.",
    "shortDescription_fr": "Valpelline, Bionaz : montée E vers un objectif en altitude dans le paysage glaciaire.",
    "shortDescription_de": "Valpelline, Bionaz: E-Aufstieg zu einem Hochgebirgsziel in der Gletscherlandschaft.",
    "updated_at": "2026-06-01"
  },
  "10-s23": {
    "description_it": "Il sentiero nella Valpelline, comune di Bionaz, percorre l'alta valle verso un obiettivo glaciale. Il tracciato si snoda su terreno aperto con vedute sulle grandi pareti che incorniciano la testata.",
    "description_en": "The trail in the Valpelline, commune of Bionaz, traverses the upper valley toward a glacial objective. The route winds over open terrain with views of the great walls framing the valley head.",
    "description_fr": "Le sentier dans la Valpelline, commune de Bionaz, traverse la haute vallée vers un objectif glaciaire sur terrain ouvert.",
    "description_de": "Der Weg im Valpelline, Gemeinde Bionaz, durchquert das obere Tal zu einem Gletscherziel über offenem Gelände.",
    "shortDescription_it": "Alta Valpelline, Bionaz: percorso verso un obiettivo glaciale su terreno aperto con vedute sulle grandi pareti.",
    "shortDescription_en": "Upper Valpelline, Bionaz: a route toward a glacial objective over open terrain with views of the great valley walls.",
    "shortDescription_fr": "Haute Valpelline, Bionaz : itinéraire vers un objectif glaciaire sur terrain ouvert avec vues sur les grandes parois.",
    "shortDescription_de": "Oberes Valpelline, Bionaz: Weg zu einem Gletscherziel über offenes Gelände mit Blick auf die großen Wände.",
    "updated_at": "2026-06-01"
  },
  "11-s15": {
    "description_it": "Il sentiero nel massiccio del Monte Emilius risale verso una quota elevata sulle creste che separano la Valle di Cogne dalla Valle centrale valdostana. La classificazione EE o EEA riflette la quota e il terreno impervio.",
    "description_en": "The trail in the Monte Emilius massif climbs toward a high altitude on the ridges separating the Valle di Cogne from the central Aosta Valley. The EE or EEA rating reflects the altitude and demanding terrain.",
    "description_fr": "Le sentier dans le massif du Monte Emilius monte vers une haute altitude sur les crêtes séparant la Valle di Cogne de la vallée centrale valdôtaine.",
    "description_de": "Der Weg im Monte-Emilius-Massiv steigt auf den Kämmen, die das Val di Cogne vom zentralen Aostatal trennen, zu einer hohen Lage auf.",
    "shortDescription_it": "Massiccio del Monte Emilius: percorso EE/EEA verso le creste di confine tra Val di Cogne e Valle centrale.",
    "shortDescription_en": "Monte Emilius massif: an EE/EEA route toward the boundary ridges between Val di Cogne and the central valley.",
    "shortDescription_fr": "Massif du Monte Emilius : itinéraire EE/EEA vers les crêtes frontières entre Val di Cogne et la vallée centrale.",
    "shortDescription_de": "Monte-Emilius-Massiv: EE/EEA-Weg zu den Grenzgraten zwischen Val di Cogne und dem zentralen Aostatal.",
    "updated_at": "2026-06-01"
  },
  "12-s12": {
    "description_it": "Il sentiero nel comune di Brusson, Val d'Ayas, percorre il versante soleggiato tra frazioni e boschi. La classificazione E o T indica un itinerario accessibile adatto a escursionisti di diversa preparazione.",
    "description_en": "The trail in the commune of Brusson, Val d'Ayas, traverses the sunny slope between hamlets and forest. The E or T rating marks an accessible itinerary for hikers of varying preparation.",
    "description_fr": "Le sentier dans la commune de Brusson, Val d'Ayas, parcourt le versant ensoleillé entre hameaux et forêts.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, durchquert den besonnten Hang zwischen Weilern und Wald.",
    "shortDescription_it": "Nel comune di Brusson, Val d'Ayas: itinerario accessibile tra frazioni e boschi del versante soleggiato.",
    "shortDescription_en": "In the commune of Brusson, Val d'Ayas: an accessible itinerary between hamlets and forest on the sunny slope.",
    "shortDescription_fr": "Dans la commune de Brusson, Val d'Ayas : itinéraire accessible entre hameaux et forêts.",
    "shortDescription_de": "In der Gemeinde Brusson, Val d'Ayas: zugänglicher Weg zwischen Weilern und Wald.",
    "updated_at": "2026-06-01"
  },
  "12-s27": {
    "description_it": "Il percorso nel comune di Brusson, Val d'Ayas, si svolge tra le frazioni e i pascoli del versante con vedute caratteristiche sulla valle. La classificazione E indica un itinerario adatto a escursionisti con normale preparazione.",
    "description_en": "The route in the commune of Brusson, Val d'Ayas, moves among the hamlets and pastures of the slope with characteristic valley views. The E rating marks a route for normally fit hikers.",
    "description_fr": "L'itinéraire dans la commune de Brusson, Val d'Ayas, se déroule entre hameaux et pâturages du versant avec des vues caractéristiques.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, verläuft zwischen Weilern und Weiden des Hanges mit charakteristischen Talblicken.",
    "shortDescription_it": "Nel comune di Brusson, Val d'Ayas: percorso E tra frazioni e pascoli con vedute caratteristiche sulla valle.",
    "shortDescription_en": "In the commune of Brusson, Val d'Ayas: an E-rated route among hamlets and pastures with characteristic valley views.",
    "shortDescription_fr": "Dans la commune de Brusson, Val d'Ayas : itinéraire E entre hameaux et pâturages avec vues caractéristiques.",
    "shortDescription_de": "In der Gemeinde Brusson, Val d'Ayas: E-Weg zwischen Weilern und Weiden mit charakteristischen Talblicken.",
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
