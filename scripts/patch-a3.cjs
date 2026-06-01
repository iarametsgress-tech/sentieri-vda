'use strict';
const fs = require('fs');
const path = require('path');

const patch = JSON.parse(`{
  "02-s19": {
    "description_it": "Il sentiero nel comune di Torgnon, Valtournenche, percorre il versante soleggiato della valle tra frazioni storiche e pascoli aperti. Il tracciato alterna boschi di conifere e prati con vedute sulla testata della Valtournenche e sulle creste circostanti. La classificazione E indica un percorso adatto a escursionisti con normale preparazione.",
    "description_en": "The trail in the commune of Torgnon, Valtournenche, traverses the sunny valley slope between historic hamlets and open pastures. The route alternates conifer forest and meadow with views toward the Valtournenche head and surrounding ridges. The E rating marks a route for normally fit hikers.",
    "description_fr": "Le sentier dans la commune de Torgnon, Valtournenche, parcourt le versant ensoleillé de la vallée entre hameaux historiques et alpages ouverts. Le tracé alterne forêts de conifères et prairies avec des vues vers la tête de vallée.",
    "description_de": "Der Weg in der Gemeinde Torgnon, Valtournenche, durchquert den besonnten Hang zwischen historischen Weilern und offenen Weiden. Die Route wechselt zwischen Nadelwald und Wiesen mit Blicken auf den Talschluss.",
    "shortDescription_it": "Nel comune di Torgnon, Valtournenche: percorso E tra frazioni storiche, boschi e pascoli soleggiati con vedute sulla valle.",
    "shortDescription_en": "In the commune of Torgnon, Valtournenche: an E-rated route through historic hamlets, forest and sunny pastures with valley views.",
    "shortDescription_fr": "Dans la commune de Torgnon, Valtournenche : itinéraire E entre hameaux historiques, forêts et alpages ensoleillés.",
    "shortDescription_de": "In der Gemeinde Torgnon, Valtournenche: E-Weg zwischen historischen Weilern, Wald und besonnten Weiden.",
    "updated_at": "2026-06-01"
  },
  "03-s3": {
    "description_it": "Il sentiero nel comune di Challand-Saint-Victor, in bassa Val d'Ayas, risale il versante boscato verso le frazioni alte. La partenza avviene da una quota bassa con un dislivello contenuto. Il tracciato percorre la fascia submontana con prati, vigneti e vedute sul fondovalle.",
    "description_en": "The trail in the commune of Challand-Saint-Victor, lower Val d'Ayas, climbs the wooded slope toward upper hamlets. The walk starts at low altitude with a moderate elevation gain. The route crosses the sub-mountain belt with meadows, vineyards and views over the valley floor.",
    "description_fr": "Le sentier dans la commune de Challand-Saint-Victor, basse Vallée d'Ayas, remonte le versant boisé vers les hameaux supérieurs. Départ à basse altitude avec un dénivelé modéré. Le tracé parcourt la ceinture submontagnarde avec prairies, vignes et vues.",
    "description_de": "Der Weg in der Gemeinde Challand-Saint-Victor, unteres Val d'Ayas, steigt den bewaldeten Hang zu den oberen Weilern hinauf. Start auf niedriger Höhe mit mäßigem Höhenunterschied. Route durch die submontane Zone.",
    "shortDescription_it": "In bassa Val d'Ayas, comune di Challand-Saint-Victor: salita moderata tra vigneti, prati e boschi verso le frazioni alte.",
    "shortDescription_en": "In the lower Val d'Ayas, Challand-Saint-Victor: a moderate climb through vineyards, meadows and forest toward upper hamlets.",
    "shortDescription_fr": "En basse Vallée d'Ayas, Challand-Saint-Victor : montée modérée entre vignes, prairies et forêts vers les hameaux supérieurs.",
    "shortDescription_de": "Im unteren Val d'Ayas, Challand-Saint-Victor: mäßiger Aufstieg durch Weinberge, Wiesen und Wald zu den oberen Weilern.",
    "updated_at": "2026-06-01"
  },
  "05-s13": {
    "description_it": "Il percorso nel comune di Arvier, Valgrisenche, risale un vallone laterale attraverso bosco e prateria verso un alpeggio di quota. La classificazione E indica un itinerario escursionistico senza difficoltà tecniche, adatto a chi è allenato.",
    "description_en": "The route in the commune of Arvier, Valgrisenche, climbs a side valley through forest and meadow toward a high-altitude pasture. The E rating marks a hiking trail without technical difficulty, suitable for fit walkers.",
    "description_fr": "L'itinéraire dans la commune d'Arvier, Valgrisenche, remonte un vallon latéral à travers forêt et prairie vers un alpage d'altitude. La cotation E signale un parcours sans difficulté technique.",
    "description_de": "Der Weg in der Gemeinde Arvier, Valgrisenche, steigt ein Seitental durch Wald und Wiesen zu einer Hochalm auf. Bewertung E: keine technischen Schwierigkeiten.",
    "shortDescription_it": "In Valgrisenche, comune di Arvier: salita E attraverso bosco e praterie verso un alpeggio di quota.",
    "shortDescription_en": "In the Valgrisenche, commune of Arvier: an E-rated climb through forest and meadows toward a high-altitude pasture.",
    "shortDescription_fr": "Dans la Valgrisenche, commune d'Arvier : montée E à travers forêt et prairies vers un alpage d'altitude.",
    "shortDescription_de": "Im Valgrisenche, Gemeinde Arvier: E-Aufstieg durch Wald und Wiesen zu einer Hochalm.",
    "updated_at": "2026-06-01"
  },
  "06-s17": {
    "description_it": "Il sentiero nel comune di La Salle, Valdigne, collega due quote del versante con un percorso tra boschi e pascoli. Il tracciato offre vedute sul Monte Bianco e sulla Valdigne. La classificazione E indica un itinerario regolare adatto a escursionisti allenati.",
    "description_en": "The trail in the commune of La Salle, Valdigne, links two altitudes on the slope through forest and pasture. The route offers views of Mont Blanc and the Valdigne. The E rating marks a regular route for fit hikers.",
    "description_fr": "Le sentier dans la commune de La Salle, Valdigne, relie deux altitudes du versant à travers forêt et pâturages, avec des vues sur le Mont-Blanc. La cotation E signale un parcours régulier.",
    "description_de": "Der Weg in der Gemeinde La Salle, Valdigne, verbindet zwei Hanglagen durch Wald und Weiden. Die Route bietet Blicke auf den Mont Blanc. Bewertung E.",
    "shortDescription_it": "In Valdigne, La Salle: percorso E tra boschi e pascoli con vedute sul Monte Bianco.",
    "shortDescription_en": "In the Valdigne, La Salle: an E-rated route through forest and pasture with views of Mont Blanc.",
    "shortDescription_fr": "En Valdigne, La Salle : itinéraire E entre forêts et pâturages avec vues sur le Mont-Blanc.",
    "shortDescription_de": "Im Valdigne, La Salle: E-Weg zwischen Wald und Weiden mit Blick auf den Mont Blanc.",
    "updated_at": "2026-06-01"
  },
  "06-s3": {
    "description_it": "Il sentiero nel comune di La Salle parte da una quota bassa e sale verso le frazioni e gli alpeggi del versante. Il tracciato percorre la fascia montana con boschi misti e praterie terrazzate. La classificazione E o T indica un percorso accessibile.",
    "description_en": "The trail in the commune of La Salle starts at low altitude and climbs toward the slope's hamlets and alpine pastures. The route crosses the mountain belt through mixed forest and terraced grassland. The E or T rating marks an accessible itinerary.",
    "description_fr": "Le sentier dans la commune de La Salle part d'une basse altitude et monte vers les hameaux et alpages du versant. Le tracé parcourt la zone montagnarde avec forêts mixtes et prairies en terrasses.",
    "description_de": "Der Weg in der Gemeinde La Salle startet auf niedriger Höhe und steigt zu Weilern und Almen des Hanges auf. Die Route quert den Bergwald mit Mischwald und terrassierten Wiesen.",
    "shortDescription_it": "Nel comune di La Salle: salita accessibile tra boschi misti e praterie terrazzate verso le frazioni alte.",
    "shortDescription_en": "In the commune of La Salle: an accessible climb through mixed forest and terraced meadows toward upper hamlets.",
    "shortDescription_fr": "Dans la commune de La Salle : montée accessible entre forêts mixtes et prairies en terrasses.",
    "shortDescription_de": "In der Gemeinde La Salle: zugänglicher Aufstieg durch Mischwald und terrassierte Wiesen.",
    "updated_at": "2026-06-01"
  },
  "07-s2": {
    "description_it": "Il percorso nel comune di Ayas, Val d'Ayas, risale il versante verso un obiettivo di quota attraverso l'ambiente alpino caratteristico della valle. La progressione è regolare su terreno ben segnalato. La classificazione E indica un itinerario adatto a escursionisti con normale preparazione.",
    "description_en": "The route in the commune of Ayas, Val d'Ayas, climbs the slope toward a high-altitude objective through the characteristic alpine environment of the valley. The progression is steady on well-marked terrain. The E rating marks a route for normally fit hikers.",
    "description_fr": "L'itinéraire dans la commune d'Ayas, Val d'Ayas, remonte le versant vers un objectif en altitude à travers l'environnement alpin caractéristique. La progression est régulière sur terrain bien balisé.",
    "description_de": "Der Weg in der Gemeinde Ayas, Val d'Ayas, steigt den Hang zu einem Hochgebirgsziel durch das typische Alpenumfeld der Täler auf. Gleichmäßige Progression auf gut markiertem Gelände.",
    "shortDescription_it": "In Val d'Ayas, comune di Ayas: salita E regolare verso un obiettivo d'alta quota su terreno ben segnalato.",
    "shortDescription_en": "In the Val d'Ayas, commune of Ayas: a steady E-rated climb toward a high-altitude objective on well-marked terrain.",
    "shortDescription_fr": "Dans la Val d'Ayas, commune d'Ayas : montée E régulière vers un objectif en altitude sur terrain bien balisé.",
    "shortDescription_de": "Im Val d'Ayas, Gemeinde Ayas: gleichmäßiger E-Aufstieg zu einem Hochgebirgsziel auf gut markiertem Gelände.",
    "updated_at": "2026-06-01"
  },
  "07-s27": {
    "description_it": "Il sentiero nel Vallone delle Cime Bianche, comune di Ayas, si snoda in uno degli ambienti d'alta quota più integri della Val d'Ayas. La classificazione EE riflette la quota e la presenza di terreno impervio.",
    "description_en": "The trail in the Vallone delle Cime Bianche, commune of Ayas, winds through one of the most pristine high-altitude environments in the Val d'Ayas. The EE rating reflects the altitude and demanding terrain.",
    "description_fr": "Le sentier dans le Vallone delle Cime Bianche, commune d'Ayas, serpente dans l'un des environnements d'haute altitude les plus préservés de la Val d'Ayas. La cotation EE reflète l'altitude et le terrain.",
    "description_de": "Der Weg im Vallone delle Cime Bianche, Gemeinde Ayas, windet sich durch eine der unberührtesten Hochgebirgslandschaften des Val d'Ayas. EE-Bewertung wegen Höhenlage und Terrain.",
    "shortDescription_it": "Vallone delle Cime Bianche, comune di Ayas: itinerario EE in uno degli ambienti d'alta quota più integri della Val d'Ayas.",
    "shortDescription_en": "Vallone delle Cime Bianche, commune of Ayas: an EE route through one of the most pristine high-altitude environments of the Val d'Ayas.",
    "shortDescription_fr": "Vallone delle Cime Bianche, commune d'Ayas : itinéraire EE dans l'un des environnements les plus préservés.",
    "shortDescription_de": "Vallone delle Cime Bianche, Gemeinde Ayas: EE-Weg in einer der unberührtesten Hochgebirgslandschaften.",
    "updated_at": "2026-06-01"
  },
  "07-s42": {
    "description_it": "Il percorso nel comune di Ayas sale verso gli alpeggi e le quote alte della Val d'Ayas attraverso il tipico paesaggio di praterie e rocce. La classificazione E indica un itinerario adatto a camminatori allenati.",
    "description_en": "The route in the commune of Ayas climbs toward the alpine pastures and high altitudes of the Val d'Ayas through the typical landscape of meadow and rock. The E rating marks a route for fit walkers.",
    "description_fr": "L'itinéraire dans la commune d'Ayas monte vers les alpages et les altitudes élevées de la Val d'Ayas à travers le paysage typique de prairies et de roches.",
    "description_de": "Der Weg in der Gemeinde Ayas steigt zu Almen und hohen Lagen des Val d'Ayas durch die typische Wiesen- und Felslandschaft auf.",
    "shortDescription_it": "In Val d'Ayas, comune di Ayas: salita E verso alpeggi e quote alte attraverso praterie e rocce.",
    "shortDescription_en": "In the Val d'Ayas, commune of Ayas: an E-rated climb toward alpine pastures and high ground through meadow and rock.",
    "shortDescription_fr": "Dans la Val d'Ayas, commune d'Ayas : montée E vers alpages et hauteurs à travers prairies et roches.",
    "shortDescription_de": "Im Val d'Ayas, Gemeinde Ayas: E-Aufstieg zu Almen und hohen Lagen durch Wiesen und Fels.",
    "updated_at": "2026-06-01"
  },
  "07-s62": {
    "description_it": "Il sentiero nel comune di Brusson o Ayas percorre la fascia alta della Val d'Ayas verso un obiettivo panoramico. La progressione avviene su terreno aperto con vedute caratteristiche della valle.",
    "description_en": "The trail in the commune of Brusson or Ayas crosses the upper belt of the Val d'Ayas toward a panoramic objective. Progress is over open terrain with characteristic valley views.",
    "description_fr": "Le sentier dans la commune de Brusson ou d'Ayas traverse la zone haute de la Val d'Ayas vers un objectif panoramique sur terrain ouvert.",
    "description_de": "Der Weg in der Gemeinde Brusson oder Ayas durchquert die obere Zone des Val d'Ayas zu einem Panoramapunkt über offenem Gelände.",
    "shortDescription_it": "Alta Val d'Ayas: percorso verso un obiettivo panoramico su terreno aperto.",
    "shortDescription_en": "Upper Val d'Ayas: a route toward a panoramic objective over open terrain.",
    "shortDescription_fr": "Haute Val d'Ayas : itinéraire vers un objectif panoramique sur terrain ouvert.",
    "shortDescription_de": "Oberes Val d'Ayas: Weg zu einem Panoramapunkt über offenes Gelände.",
    "updated_at": "2026-06-01"
  },
  "08-s17": {
    "description_it": "Il sentiero nel comune di Aymavilles risale la Val di Cogne attraverso la fascia forestata e gli alpeggi verso un obiettivo in quota nel Parco Nazionale del Gran Paradiso. La classificazione E indica un percorso adatto a escursionisti allenati.",
    "description_en": "The trail in the commune of Aymavilles climbs the Val di Cogne through the forest belt and alpine pastures toward a high-altitude objective in the Gran Paradiso National Park. The E rating marks a route for fit hikers.",
    "description_fr": "Le sentier dans la commune d'Aymavilles remonte la Val di Cogne à travers la ceinture forestière et les alpages vers un objectif en altitude dans le Parc National du Grand Paradis.",
    "description_de": "Der Weg in der Gemeinde Aymavilles steigt durch Val di Cogne durch Waldgürtel und Almen zu einem Hochgebirgsziel im Gran-Paradiso-Nationalpark auf.",
    "shortDescription_it": "In Val di Cogne, Aymavilles: salita E tra boschi e alpeggi nel Parco Nazionale del Gran Paradiso.",
    "shortDescription_en": "In the Val di Cogne, Aymavilles: an E-rated climb through forest and alpine pastures in the Gran Paradiso National Park.",
    "shortDescription_fr": "Dans la Val di Cogne, Aymavilles : montée E entre forêts et alpages dans le Grand Paradis.",
    "shortDescription_de": "Im Val di Cogne, Aymavilles: E-Aufstieg durch Wald und Almen im Gran-Paradiso-Nationalpark.",
    "updated_at": "2026-06-01"
  },
  "08-s8": {
    "description_it": "Il percorso nel comune di Aymavilles, Val di Cogne, parte da una quota intermedia e sale verso un obiettivo di alta montagna attraverso il paesaggio del Parco Nazionale del Gran Paradiso. La classificazione E indica un sentiero adatto a escursionisti con buona preparazione.",
    "description_en": "The route in the commune of Aymavilles, Val di Cogne, starts at intermediate altitude and climbs toward a high-mountain objective through the landscape of the Gran Paradiso National Park. The E rating marks a trail for well-prepared hikers.",
    "description_fr": "L'itinéraire dans la commune d'Aymavilles, Val di Cogne, part d'une altitude intermédiaire et monte vers un objectif de haute montagne dans le cadre du Grand Paradis.",
    "description_de": "Der Weg in der Gemeinde Aymavilles, Val di Cogne, startet auf mittlerer Höhe und steigt zu einem Hochgebirgsziel im Gran-Paradiso-Nationalpark auf.",
    "shortDescription_it": "Da quota intermedia verso le alte montagne del Gran Paradiso in Val di Cogne, Aymavilles: percorso E.",
    "shortDescription_en": "From intermediate altitude toward the high mountains of the Gran Paradiso in Val di Cogne, Aymavilles: an E-rated trail.",
    "shortDescription_fr": "D'une altitude intermédiaire vers les hautes montagnes du Grand Paradis en Val di Cogne, Aymavilles.",
    "shortDescription_de": "Von mittlerer Höhe zu den Hochbergen des Gran Paradiso im Val di Cogne, Aymavilles.",
    "updated_at": "2026-06-01"
  },
  "10-s19": {
    "description_it": "Il sentiero nella Valpelline, comune di Bionaz, risale il vallone verso un obiettivo di alta quota. Il tracciato percorre terreno aperto con vedute sulle vette glaciali che circondano la testata della valle.",
    "description_en": "The trail in the Valpelline, commune of Bionaz, climbs the valley toward a high-altitude objective. The route crosses open terrain with views of the glacial summits surrounding the valley head.",
    "description_fr": "Le sentier dans la Valpelline, commune de Bionaz, remonte le vallon vers un objectif de haute altitude sur terrain ouvert avec des vues sur les sommets glaciaires.",
    "description_de": "Der Weg im Valpelline, Gemeinde Bionaz, steigt das Tal zu einem Hochgebirgsziel auf. Die Route verläuft über offenes Gelände mit Blicken auf die Gletschergipfel.",
    "shortDescription_it": "Alta Valpelline, Bionaz: salita su terreno aperto con vedute sulle vette glaciali della testata della valle.",
    "shortDescription_en": "Upper Valpelline, Bionaz: a climb over open terrain with views of the glacial summits at the valley head.",
    "shortDescription_fr": "Haute Valpelline, Bionaz : montée sur terrain ouvert avec vues sur les sommets glaciaires.",
    "shortDescription_de": "Oberes Valpelline, Bionaz: Aufstieg über offenes Gelände mit Blick auf die Gletschergipfel.",
    "updated_at": "2026-06-01"
  },
  "10-s6": {
    "description_it": "Il percorso nella Valpelline, comune di Bionaz, sale attraverso la fascia forestata verso i pascoli aperti. La classificazione E indica un sentiero escursionistico adatto a camminatori con buona preparazione.",
    "description_en": "The route in the Valpelline, commune of Bionaz, climbs through the forested belt toward open pastures. The E rating marks a hiking trail for well-prepared walkers.",
    "description_fr": "L'itinéraire dans la Valpelline, commune de Bionaz, monte à travers la ceinture forestière vers les pâturages ouverts.",
    "description_de": "Der Weg im Valpelline, Gemeinde Bionaz, steigt durch den Waldgürtel zu offenen Weiden auf.",
    "shortDescription_it": "Nella Valpelline, Bionaz: salita E dal bosco ai pascoli aperti.",
    "shortDescription_en": "In the Valpelline, Bionaz: an E-rated climb from forest to open pastures.",
    "shortDescription_fr": "Dans la Valpelline, Bionaz : montée E de la forêt aux pâturages ouverts.",
    "shortDescription_de": "Im Valpelline, Bionaz: E-Aufstieg vom Wald zu offenen Weiden.",
    "updated_at": "2026-06-01"
  },
  "12-s1": {
    "description_it": "Il percorso nel comune di Brusson, Val d'Ayas, si svolge tra i pascoli e le frazioni del versante, offrendo vedute caratteristiche sulla valle e sulle cime circostanti. La classificazione T o E indica un itinerario accessibile a escursionisti di varia preparazione.",
    "description_en": "The route in the commune of Brusson, Val d'Ayas, moves among the pastures and hamlets of the slope, offering characteristic views of the valley and surrounding peaks. The T or E rating marks an itinerary accessible to hikers of various levels.",
    "description_fr": "L'itinéraire dans la commune de Brusson, Val d'Ayas, se déroule entre pâturages et hameaux du versant avec des vues caractéristiques.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, verläuft zwischen Weiden und Weilern des Hanges mit charakteristischen Talblicken.",
    "shortDescription_it": "Nel comune di Brusson, Val d'Ayas: itinerario accessibile tra pascoli e frazioni del versante con vedute panoramiche.",
    "shortDescription_en": "In the commune of Brusson, Val d'Ayas: an accessible route among pastures and hamlets with panoramic views.",
    "shortDescription_fr": "Dans la commune de Brusson, Val d'Ayas : itinéraire accessible entre pâturages et hameaux.",
    "shortDescription_de": "In der Gemeinde Brusson, Val d'Ayas: zugänglicher Weg zwischen Weiden und Weilern.",
    "updated_at": "2026-06-01"
  },
  "12-s22": {
    "description_it": "Il sentiero nel comune di Brusson, Val d'Ayas, percorre la fascia di mezza quota tra le frazioni e le aree boscate del versante. La classificazione E o T indica un itinerario adatto a escursionisti di varia preparazione.",
    "description_en": "The trail in the commune of Brusson, Val d'Ayas, traverses the mid-altitude belt between the hamlets and wooded areas of the slope. The E or T rating marks a route for hikers of various levels.",
    "description_fr": "Le sentier dans la commune de Brusson, Val d'Ayas, traverse la ceinture de moyenne altitude entre les hameaux et les zones boisées du versant.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, durchquert den mittelhöhigen Gürtel zwischen Weilern und Waldgebieten des Hanges.",
    "shortDescription_it": "Nel comune di Brusson, Val d'Ayas: percorso di mezza quota tra frazioni e aree boscate del versante.",
    "shortDescription_en": "In the commune of Brusson, Val d'Ayas: a mid-altitude route between hamlets and wooded areas of the slope.",
    "shortDescription_fr": "Dans la commune de Brusson, Val d'Ayas : itinéraire de moyenne altitude entre hameaux et zones boisées.",
    "shortDescription_de": "In der Gemeinde Brusson, Val d'Ayas: Weg in mittlerer Höhe zwischen Weilern und Waldgebieten.",
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
