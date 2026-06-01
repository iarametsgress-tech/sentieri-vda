'use strict';
const fs = require('fs');
const path = require('path');

const patch = JSON.parse(`{
  "01-s2": {
    "description_it": "Il sentiero da Allein a Valpelline attraversa il crinale che separa i due versanti, collegando il comune di Allein con la testata della Valpelline in un percorso panoramico di mezza quota. La partenza avviene dal centro di Allein (1248 m). Il tracciato sale verso i pascoli alti, mantenendosi su terreno aperto con ampie vedute sul Gran San Bernardo e sulla Valpelline sottostante, per poi scendere verso il fondovalle opposto. La classificazione E indica un itinerario adatto a escursionisti con normale preparazione.",
    "description_en": "The trail from Allein to Valpelline crosses the ridge separating the two valleys, linking the village of Allein with the upper Valpelline in a panoramic mid-altitude route. The walk begins from Allein centre (1248 m). The path climbs toward high pastures across open terrain with wide views over the Gran San Bernardo and the Valpelline below, before descending toward the opposite valley floor. The E rating marks a route suited to normally fit hikers.",
    "description_fr": "Le sentier d'Allein à Valpelline franchit la crête séparant les deux versants, reliant la commune d'Allein à la haute Valpelline dans un parcours panoramique de moyenne altitude. Le départ s'effectue depuis le centre d'Allein (1248 m). Le tracé monte vers les alpages sur terrain ouvert avec de larges vues sur le Grand-Saint-Bernard et la Valpelline. La cotation E signale un itinéraire adapté aux randonneurs ordinaires.",
    "description_de": "Der Weg von Allein nach Valpelline überquert den Kamm zwischen beiden Tälern und verbindet die Gemeinde Allein mit dem oberen Valpelline auf einer Panoramaroute in mittlerer Höhe. Start ist das Ortszentrum Allein (1248 m). Der Pfad steigt zu Hochalmen auf offenem Gelände mit weiten Blicken auf den Großen Sankt Bernhard und das Valpelline. Bewertung E.",
    "shortDescription_it": "Da Allein verso Valpelline attraverso il crinale panoramico tra i due versanti: percorso E su pascoli aperti con vedute sul Gran San Bernardo.",
    "shortDescription_en": "From Allein toward Valpelline across the panoramic ridge between the two valleys: an E-rated route over open pastures with views of the Gran San Bernardo.",
    "shortDescription_fr": "D'Allein vers Valpelline par la crête panoramique entre les deux versants : itinéraire E sur alpages ouverts avec vues sur le Grand-Saint-Bernard.",
    "shortDescription_de": "Von Allein nach Valpelline über den Panoramakamm zwischen beiden Tälern: E-Weg über offene Almen mit Blick auf den Großen Sankt Bernhard.",
    "updated_at": "2026-06-01"
  },
  "03-s1": {
    "description_it": "Il sentiero nel comune di Challand-Saint-Anselme risale il versante boscato della bassa Val d'Ayas, partendo dalla zona di fondovalle e guadagnando quota regolarmente verso le frazioni alte. L'ambiente è quello della fascia montana media con boschi di latifoglie e conifere, prati terrazzati e scorci sulle cime circostanti. La classificazione E indica un percorso adatto a escursionisti con normale allenamento.",
    "description_en": "The trail in Challand-Saint-Anselme climbs the wooded lower slopes of the Val d'Ayas, rising steadily from the valley bottom toward the upper hamlets. The environment is that of mid-mountain forest — broadleaves and conifers — terraced meadows and views toward the surrounding summits. The E rating marks a route for normally fit hikers.",
    "description_fr": "Le sentier dans la commune de Challand-Saint-Anselme remonte le versant boisé de la basse Vallée d'Ayas depuis le fond de vallée vers les hameaux supérieurs. L'environnement est celui de la ceinture forestière de moyenne montagne. La cotation E signale un itinéraire pour randonneurs ordinaires.",
    "description_de": "Der Weg in der Gemeinde Challand-Saint-Anselme steigt den bewaldeten Unterhang des Val d'Ayas vom Talboden zu den oberen Weilern hinauf. Das Umfeld ist das des mittelhohen Waldgürtels. Bewertung E.",
    "shortDescription_it": "Salita regolare in Val d'Ayas nel comune di Challand-Saint-Anselme tra boschi di mezza quota e prati terrazzati: itinerario E adatto a tutti gli escursionisti allenati.",
    "shortDescription_en": "A steady climb in the Val d'Ayas through mid-altitude forest and terraced meadows in Challand-Saint-Anselme: an E-rated route for fit hikers.",
    "shortDescription_fr": "Montée régulière en Vallée d'Ayas à travers forêts de moyenne altitude et prairies en terrasses dans la commune de Challand-Saint-Anselme.",
    "shortDescription_de": "Gleichmäßiger Aufstieg im Val d'Ayas durch Wälder mittlerer Höhe und terrassierte Wiesen in der Gemeinde Challand-Saint-Anselme.",
    "updated_at": "2026-06-01"
  },
  "05-s12": {
    "description_it": "Il percorso nella Valgrisenche nel comune di Arvier risale un vallone laterale attraverso il bosco verso gli alpeggi superiori. La partenza avviene da una frazione a quota intermedia. Il tracciato guadagna quota con pendenza sostenuta attraverso la fascia forestata, prima di aprirsi sulle praterie alpine. La classificazione E indica un itinerario escursionistico senza difficoltà tecniche.",
    "description_en": "The route in the Valgrisenche, commune of Arvier, climbs a side valley through forest toward the upper pastures. The walk starts from a hamlet at intermediate altitude. The trail gains height steadily through the forested belt before opening onto alpine grassland. The E rating marks a technically straightforward hiking route.",
    "description_fr": "L'itinéraire dans la Valgrisenche, commune d'Arvier, remonte un vallon latéral à travers la forêt vers les alpages supérieurs. Le départ s'effectue depuis un hameau à altitude intermédiaire. Le tracé prend de l'altitude régulièrement à travers la ceinture boisée. La cotation E signale un parcours sans difficulté technique.",
    "description_de": "Der Weg im Valgrisenche, Gemeinde Arvier, steigt ein Seitental durch den Wald zu den Hochalmen hinauf. Start ist ein Weiler auf mittlerer Höhe. Der Pfad gewinnt gleichmäßig Höhe durch den Waldgürtel. Bewertung E: keine technischen Schwierigkeiten.",
    "shortDescription_it": "Nella Valgrisenche il percorso sale attraverso bosco e praterie verso gli alpeggi superiori: itinerario E nel comune di Arvier.",
    "shortDescription_en": "In the Valgrisenche the route climbs through forest and meadows toward upper pastures: an E-rated itinerary in the commune of Arvier.",
    "shortDescription_fr": "Dans la Valgrisenche, l'itinéraire monte à travers forêt et prairies vers les alpages supérieurs dans la commune d'Arvier.",
    "shortDescription_de": "Im Valgrisenche steigt der Weg durch Wald und Wiesen zu den Hochalmen in der Gemeinde Arvier.",
    "updated_at": "2026-06-01"
  },
  "06-s16": {
    "description_it": "Il sentiero nel comune di La Salle, Valdigne, collega una frazione di fondovalle con i pascoli e gli alpeggi del versante superiore. Il tracciato percorre la fascia montana con boschi di conifere e aperture panoramiche sulle vette della Valdigne e del massiccio del Monte Bianco. La classificazione E indica un percorso regolare adatto a escursionisti allenati.",
    "description_en": "The trail in the commune of La Salle, Valdigne, links a valley-floor hamlet with the pastures and alpine meadows of the upper slope. The route crosses the mountain belt through conifer forest with panoramic openings toward the Valdigne summits and the Mont Blanc massif. The E rating marks a regular route for fit hikers.",
    "description_fr": "Le sentier dans la commune de La Salle, Valdigne, relie un hameau de fond de vallée aux pâturages et alpages du versant supérieur. Le tracé traverse la ceinture montagnarde avec des vues panoramiques sur les sommets de la Valdigne. La cotation E signale un parcours régulier.",
    "description_de": "Der Weg in der Gemeinde La Salle, Valdigne, verbindet einen Talweiler mit den Weiden und Almen des oberen Hanges. Die Route quert den Bergwald mit Panoramablicken auf die Valdigne-Gipfel und das Mont-Blanc-Massiv. Bewertung E.",
    "shortDescription_it": "In Valdigne da fondovalle agli alpeggi superiori nel comune di La Salle: percorso E tra boschi di conifere e vedute sul Monte Bianco.",
    "shortDescription_en": "In the Valdigne from valley floor to upper pastures in La Salle: an E-rated route through conifer forest with views of the Mont Blanc massif.",
    "shortDescription_fr": "En Valdigne du fond de vallée aux alpages supérieurs dans la commune de La Salle : itinéraire E entre forêts de conifères et vues sur le Mont-Blanc.",
    "shortDescription_de": "Im Valdigne vom Talboden zu den Hochalmen in La Salle: E-Weg durch Nadelwald mit Blick auf das Mont-Blanc-Massiv.",
    "updated_at": "2026-06-01"
  },
  "06-s29": {
    "description_it": "La salita nel comune di La Salle raggiunge le zone alte della Valdigne attraverso un versante boscato con dislivello significativo. Il percorso parte da una quota intermedia e risale con pendenza sostenuta verso la fascia degli alpeggi. La classificazione E riflette un itinerario impegnativo per il dislivello, ma privo di difficoltà tecniche.",
    "description_en": "The ascent in the commune of La Salle reaches the upper zones of the Valdigne through a wooded slope with significant elevation gain. The route starts at intermediate altitude and climbs at a sustained gradient toward the alpine pasture belt. The E rating reflects a demanding route by ascent, technically straightforward.",
    "description_fr": "La montée dans la commune de La Salle atteint les zones supérieures de la Valdigne à travers un versant boisé avec un dénivelé significatif. Le parcours part d'une altitude intermédiaire et monte à forte pente vers la ceinture des alpages. La cotation E reflète un itinéraire exigeant mais sans difficulté technique.",
    "description_de": "Der Aufstieg in der Gemeinde La Salle erreicht die oberen Bereiche der Valdigne durch einen bewaldeten Hang mit erheblichem Höhenunterschied. Die Route startet auf mittlerer Höhe und steigt mit anhaltender Steigung zur Alpenzone auf. Bewertung E: konditionell fordernd, keine Technischen Schwierigkeiten.",
    "shortDescription_it": "Salita impegnativa in Valdigne nel comune di La Salle verso gli alpeggi alti: dislivello sostenuto su sentiero E tra bosco e prateria.",
    "shortDescription_en": "A demanding climb in the Valdigne, La Salle, toward high pastures: sustained elevation gain on an E-rated trail through forest and grassland.",
    "shortDescription_fr": "Montée exigeante en Valdigne dans la commune de La Salle vers les alpages supérieurs : fort dénivelé sur sentier E entre forêt et prairie.",
    "shortDescription_de": "Anspruchsvoller Aufstieg im Valdigne, La Salle, zu den Hochalmen: anhaltender Höhenunterschied auf E-Weg zwischen Wald und Wiese.",
    "updated_at": "2026-06-01"
  },
  "07-s19": {
    "description_it": "Il percorso nel comune di Ayas parte da Saint-Jacques (1700 m) e sale verso un obiettivo d'alta quota attraverso i pascoli alpini della Val d'Ayas. Il tracciato risale il versante con pendenza regolare, offrendo vedute progressive sul massiccio del Monte Rosa. La classificazione E o EE riflette le condizioni d'alta montagna.",
    "description_en": "The route in the commune of Ayas starts from Saint-Jacques (1700 m) and climbs toward a high-altitude objective across the alpine pastures of the Val d'Ayas. The trail ascends the slope at a regular gradient, offering progressive views of the Monte Rosa massif. The E or EE rating reflects high-mountain conditions.",
    "description_fr": "L'itinéraire dans la commune d'Ayas part de Saint-Jacques (1700 m) et monte vers un objectif de haute altitude à travers les alpages de la Val d'Ayas. Le tracé remonte le versant à pente régulière avec des vues progressives sur le massif du Mont-Rose.",
    "description_de": "Der Weg in der Gemeinde Ayas startet in Saint-Jacques (1700 m) und steigt zu einem Hochgebirgsziel durch die Almweiden des Val d'Ayas auf. Der Pfad steigt gleichmäßig an und bietet stufenweise Ausblicke auf das Monte-Rosa-Massiv.",
    "shortDescription_it": "Da Saint-Jacques (1700 m) verso le quote alte della Val d'Ayas: percorso tra pascoli alpini con vedute sul Monte Rosa.",
    "shortDescription_en": "From Saint-Jacques (1700 m) toward the high ground of the Val d'Ayas: a route through alpine pastures with views of Monte Rosa.",
    "shortDescription_fr": "Depuis Saint-Jacques (1700 m) vers les hauteurs de la Val d'Ayas : itinéraire à travers les alpages avec vues sur le Mont-Rose.",
    "shortDescription_de": "Von Saint-Jacques (1700 m) zu den Hochlagen des Val d'Ayas: Weg durch Almweiden mit Blick auf den Monte Rosa.",
    "updated_at": "2026-06-01"
  },
  "07-s26": {
    "description_it": "Il sentiero nel Vallone delle Cime Bianche nel comune di Ayas risale uno degli ambienti di alta montagna più pregiati della Val d'Ayas, tra laghi glaciali e praterie. La classificazione EE riflette la quota e il terreno impervio della sezione superiore.",
    "description_en": "The trail in the Vallone delle Cime Bianche, commune of Ayas, climbs one of the most prized high-mountain environments of the Val d'Ayas, among glacial lakes and grassland. The EE rating reflects the altitude and demanding terrain of the upper section.",
    "description_fr": "Le sentier dans le Vallone delle Cime Bianche, commune d'Ayas, remonte l'un des environnements de haute montagne les plus précieux de la Val d'Ayas, entre lacs glaciaires et prairies. La cotation EE reflète l'altitude et le terrain difficile.",
    "description_de": "Der Weg im Vallone delle Cime Bianche, Gemeinde Ayas, steigt in einer der wertvollsten Hochgebirgslandschaften des Val d'Ayas auf, zwischen Gletscherseen und Wiesen. EE-Bewertung wegen Höhe und anspruchsvollem Terrain.",
    "shortDescription_it": "Nel Vallone delle Cime Bianche, comune di Ayas: percorso EE tra laghi glaciali e praterie d'alta quota.",
    "shortDescription_en": "In the Vallone delle Cime Bianche, commune of Ayas: an EE route among glacial lakes and high alpine meadows.",
    "shortDescription_fr": "Dans le Vallone delle Cime Bianche, commune d'Ayas : itinéraire EE entre lacs glaciaires et prairies d'altitude.",
    "shortDescription_de": "Im Vallone delle Cime Bianche, Gemeinde Ayas: EE-Weg zwischen Gletscherseen und Hochalmwiesen.",
    "updated_at": "2026-06-01"
  },
  "07-s41": {
    "description_it": "Il percorso nel comune di Ayas sale verso un obiettivo di alta quota attraverso il tipico paesaggio della Val d'Ayas: pascoli verdi, zone umide e rocce d'alta montagna. La progressione è regolare con viste sul Monte Rosa. La classificazione E o EE dipende dalla sezione finale.",
    "description_en": "The route in the commune of Ayas climbs toward a high-altitude objective through the typical Val d'Ayas landscape: green pastures, wetland and high-mountain rock. The progression is steady with views of Monte Rosa. The E or EE rating depends on the final section.",
    "description_fr": "L'itinéraire dans la commune d'Ayas monte vers un objectif en haute altitude à travers le paysage typique de la Val d'Ayas : pâturages verts, zones humides et roches d'altitude. La progression est régulière avec des vues sur le Mont-Rose.",
    "description_de": "Der Weg in der Gemeinde Ayas steigt zu einem Hochgebirgsziel durch die typische Landschaft des Val d'Ayas auf: grüne Weiden, Feuchtgebiete und Hochgebirgsfels. Gleichmäßige Progression mit Blick auf den Monte Rosa.",
    "shortDescription_it": "In Val d'Ayas, comune di Ayas: salita verso le quote alte tra pascoli, zone umide e rocce con vedute sul Monte Rosa.",
    "shortDescription_en": "In the Val d'Ayas, commune of Ayas: a climb toward high altitude among pastures, wetland and rock with views of Monte Rosa.",
    "shortDescription_fr": "Dans la Val d'Ayas, commune d'Ayas : montée vers les hauteurs entre pâturages, zones humides et roches avec vues sur le Mont-Rose.",
    "shortDescription_de": "Im Val d'Ayas, Gemeinde Ayas: Aufstieg zu hohen Lagen zwischen Weiden, Feuchtgebieten und Fels mit Blick auf den Monte Rosa.",
    "updated_at": "2026-06-01"
  },
  "07-s61": {
    "description_it": "Il sentiero nel comune di Brusson o Ayas percorre la fascia alta della Val d'Ayas verso un obiettivo panoramico d'alta quota. La progressione avviene su terreno aperto con viste caratteristiche della valle. La classificazione E o EE dipende dall'obiettivo finale.",
    "description_en": "The trail in the commune of Brusson or Ayas crosses the upper belt of the Val d'Ayas toward a panoramic high-altitude objective. Progress is across open terrain with characteristic valley views. The E or EE rating depends on the final objective.",
    "description_fr": "Le sentier dans la commune de Brusson ou d'Ayas traverse la zone haute de la Val d'Ayas vers un objectif panoramique en altitude. La progression se fait sur terrain ouvert avec des vues caractéristiques.",
    "description_de": "Der Weg in der Gemeinde Brusson oder Ayas durchquert die obere Zone des Val d'Ayas zu einem Panorama-Hochgebirgsziel. Fortschritt über offenes Gelände mit charakteristischen Talblicken.",
    "shortDescription_it": "Alta Val d'Ayas: percorso verso un obiettivo panoramico d'alta quota su terreno aperto.",
    "shortDescription_en": "Upper Val d'Ayas: a route toward a panoramic high-altitude objective across open terrain.",
    "shortDescription_fr": "Haute Val d'Ayas : itinéraire vers un objectif panoramique en altitude sur terrain ouvert.",
    "shortDescription_de": "Oberes Val d'Ayas: Weg zu einem Panorama-Hochgebirgsziel über offenes Gelände.",
    "updated_at": "2026-06-01"
  },
  "08-s16": {
    "description_it": "Il sentiero nel comune di Aymavilles risale la Val di Cogne attraverso boschi e alpeggi verso un obiettivo in quota. La partenza avviene da una frazione a bassa o media quota. Il tracciato guadagna quota regolarmente attraverso il paesaggio caratteristico del Parco Nazionale del Gran Paradiso. La classificazione E indica un percorso adatto a escursionisti allenati.",
    "description_en": "The trail in the commune of Aymavilles climbs the Val di Cogne through forest and alpine pastures toward a high-altitude objective. The walk starts from a hamlet at low or intermediate altitude. The route gains height steadily through the characteristic landscape of the Gran Paradiso National Park. The E rating marks a route for fit hikers.",
    "description_fr": "Le sentier dans la commune d'Aymavilles remonte la Val di Cogne à travers forêts et alpages vers un objectif en altitude. Le départ s'effectue depuis un hameau à basse ou moyenne altitude. Le tracé prend de l'altitude régulièrement dans le cadre du Parc National du Grand Paradis.",
    "description_de": "Der Weg in der Gemeinde Aymavilles steigt durch den Val di Cogne durch Wälder und Almen zu einem Hochgebirgsziel auf. Start ist ein Weiler auf niedriger oder mittlerer Höhe. Die Route gewinnt gleichmäßig Höhe im Umfeld des Gran-Paradiso-Nationalparks.",
    "shortDescription_it": "In Val di Cogne nel comune di Aymavilles: salita E attraverso boschi e alpeggi nel Parco Nazionale del Gran Paradiso.",
    "shortDescription_en": "In the Val di Cogne, commune of Aymavilles: an E-rated climb through forest and alpine pastures in the Gran Paradiso National Park.",
    "shortDescription_fr": "Dans la Val di Cogne, commune d'Aymavilles : montée E à travers forêts et alpages dans le Parc National du Grand Paradis.",
    "shortDescription_de": "Im Val di Cogne, Gemeinde Aymavilles: E-Aufstieg durch Wald und Almen im Gran-Paradiso-Nationalpark.",
    "updated_at": "2026-06-01"
  },
  "08-s3": {
    "description_it": "Il percorso nel comune di Aymavilles, Val di Cogne, parte da una frazione a bassa quota e sale verso i pascoli e gli alpeggi della fascia superiore. Il tracciato percorre il versante boscato prima di aprirsi sulle praterie caratteristiche di questa zona del Parco Nazionale del Gran Paradiso. La classificazione E indica un itinerario adatto a escursionisti con normale preparazione.",
    "description_en": "The route in the commune of Aymavilles, Val di Cogne, starts from a low-altitude hamlet and climbs toward the pastures and alpine meadows of the upper belt. The trail crosses the wooded slope before opening onto the characteristic grasslands of this part of the Gran Paradiso National Park. The E rating marks a route for normally prepared hikers.",
    "description_fr": "L'itinéraire dans la commune d'Aymavilles, Val di Cogne, part d'un hameau en basse altitude et monte vers les pâturages et alpages de la ceinture supérieure. Le tracé traverse le versant boisé avant de s'ouvrir sur les prairies caractéristiques du Parc National du Grand Paradis.",
    "description_de": "Der Weg in der Gemeinde Aymavilles, Val di Cogne, startet an einem Weiler auf niedriger Höhe und steigt zu den Weiden und Almen der oberen Zone auf. Der Pfad quert den bewaldeten Hang, bevor er sich auf die charakteristischen Wiesen des Gran-Paradiso-Nationalparks öffnet.",
    "shortDescription_it": "Da bassa quota verso gli alpeggi nel comune di Aymavilles, Val di Cogne: itinerario E nel cuore del Gran Paradiso.",
    "shortDescription_en": "From low altitude toward alpine pastures in Aymavilles, Val di Cogne: an E-rated route at the heart of the Gran Paradiso.",
    "shortDescription_fr": "De basse altitude vers les alpages dans la commune d'Aymavilles, Val di Cogne : itinéraire E au coeur du Grand Paradis.",
    "shortDescription_de": "Von niedriger Höhe zu den Almen in Aymavilles, Val di Cogne: E-Weg im Herzen des Gran Paradiso.",
    "updated_at": "2026-06-01"
  },
  "10-s18": {
    "description_it": "Il sentiero nella Valpelline, comune di Bionaz, risale il vallone verso un obiettivo di alta quota nel paesaggio glaciale dell'alta Valpelline. Il tracciato si svolge su terreno aperto con vedute sulle vette che circondano la testata della valle. La classificazione E riflette l'assenza di difficoltà tecniche ma richiede attenzione alla quota.",
    "description_en": "The trail in the Valpelline, commune of Bionaz, climbs the valley toward a high-altitude objective in the glacial landscape of the upper Valpelline. The route crosses open terrain with views of the summits surrounding the valley head. The E rating reflects no technical difficulty but altitude requires attention.",
    "description_fr": "Le sentier dans la Valpelline, commune de Bionaz, remonte le vallon vers un objectif de haute altitude dans le paysage glaciaire de la haute Valpelline. Le tracé se déroule sur terrain ouvert avec des vues sur les sommets environnants.",
    "description_de": "Der Weg im Valpelline, Gemeinde Bionaz, steigt das Tal zu einem Hochgebirgsziel in der Gletscherlandschaft des oberen Valpelline auf. Die Route verläuft auf offenem Gelände mit Ausblicken auf die umliegenden Gipfel.",
    "shortDescription_it": "Alta Valpelline, comune di Bionaz: salita E verso un obiettivo glaciale su terreno aperto e panoramico.",
    "shortDescription_en": "Upper Valpelline, commune of Bionaz: an E-rated climb toward a glacial objective over open panoramic terrain.",
    "shortDescription_fr": "Haute Valpelline, commune de Bionaz : montée E vers un objectif glaciaire sur terrain ouvert et panoramique.",
    "shortDescription_de": "Oberes Valpelline, Gemeinde Bionaz: E-Aufstieg zu einem Gletscherziel über offenes Panoramagelände.",
    "updated_at": "2026-06-01"
  },
  "10-s5": {
    "description_it": "Il percorso nella Valpelline, comune di Bionaz, sale attraverso il bosco verso i pascoli della Comba di Vertsan. Il tracciato guadagna quota rapidamente nella fascia forestata per poi aprirsi sul bacino pascolivo aperto. La classificazione E indica un sentiero escursionistico adatto a camminatori allenati.",
    "description_en": "The route in the Valpelline, commune of Bionaz, climbs through forest toward the pastures of the Comba di Vertsan. The trail gains height rapidly in the forested belt before opening onto the broad pastoral basin. The E rating marks a hiking trail for fit walkers.",
    "description_fr": "L'itinéraire dans la Valpelline, commune de Bionaz, monte à travers la forêt vers les pâturages de la Comba di Vertsan. Le tracé prend rapidement de l'altitude dans la ceinture boisée avant de s'ouvrir sur le bassin pastoral.",
    "description_de": "Der Weg im Valpelline, Gemeinde Bionaz, steigt durch den Wald zu den Weiden der Comba di Vertsan auf. Der Pfad gewinnt rasch Höhe im Waldgürtel, bevor er sich auf das offene Weidebecken öffnet.",
    "shortDescription_it": "Nella Valpelline, comune di Bionaz: salita E dal bosco ai pascoli della Comba di Vertsan.",
    "shortDescription_en": "In the Valpelline, commune of Bionaz: an E-rated climb from forest to the Comba di Vertsan pastures.",
    "shortDescription_fr": "Dans la Valpelline, commune de Bionaz : montée E de la forêt aux pâturages de la Comba di Vertsan.",
    "shortDescription_de": "Im Valpelline, Gemeinde Bionaz: E-Aufstieg vom Wald zu den Weiden der Comba di Vertsan.",
    "updated_at": "2026-06-01"
  },
  "11-s8": {
    "description_it": "Il sentiero nel massiccio del Monte Emilius raggiunge un valico o una quota panoramica sulle creste che dominano la Valle centrale valdostana. La classificazione EE riflette la quota elevata e il terreno impervio caratteristico di questo settore montuoso.",
    "description_en": "The trail in the Monte Emilius massif reaches a pass or panoramic point on the ridges dominating the central Aosta Valley. The EE rating reflects the high altitude and demanding terrain characteristic of this mountain sector.",
    "description_fr": "Le sentier dans le massif du Monte Emilius atteint un col ou un point panoramique sur les crêtes dominant la vallée centrale valdôtaine. La cotation EE reflète l'altitude élevée et le terrain difficile.",
    "description_de": "Der Weg im Monte-Emilius-Massiv erreicht einen Pass oder Panoramapunkt auf den Kämmen, die das zentrale Aostatal dominieren. EE-Bewertung wegen hoher Lage und anspruchsvollem Terrain.",
    "shortDescription_it": "Nel massiccio del Monte Emilius: itinerario EE verso un valico o punto panoramico sulle creste della Valle centrale valdostana.",
    "shortDescription_en": "In the Monte Emilius massif: an EE route toward a pass or panoramic point on the ridges above the central Aosta Valley.",
    "shortDescription_fr": "Dans le massif du Monte Emilius : itinéraire EE vers un col ou un point panoramique sur les crêtes.",
    "shortDescription_de": "Im Monte-Emilius-Massiv: EE-Weg zu einem Pass oder Panoramapunkt auf den Kämmen über dem zentralen Aostatal.",
    "updated_at": "2026-06-01"
  },
  "12-s21": {
    "description_it": "Il percorso nel comune di Brusson, Val d'Ayas, si svolge tra le frazioni e gli alpeggi del versante soleggiato della valle. Il tracciato alterna boschi, prati e panorami caratteristici della media Val d'Ayas. La classificazione E o T indica un itinerario accessibile adatto a escursionisti di varia preparazione.",
    "description_en": "The route in the commune of Brusson, Val d'Ayas, moves between the hamlets and alpine pastures of the sunny valley slope. The trail alternates forest, meadow and characteristic views of the mid Val d'Ayas. The E or T rating marks an accessible itinerary for hikers of various levels.",
    "description_fr": "L'itinéraire dans la commune de Brusson, Val d'Ayas, se déroule entre hameaux et alpages du versant ensoleillé. Le tracé alterne forêts, prairies et panoramas caractéristiques.",
    "description_de": "Der Weg in der Gemeinde Brusson, Val d'Ayas, verläuft zwischen Weilern und Almen des besonnten Hanges. Der Pfad wechselt zwischen Wald, Wiesen und charakteristischen Ausblicken.",
    "shortDescription_it": "Nel comune di Brusson, Val d'Ayas: itinerario tra frazioni e alpeggi del versante soleggiato con panorami sulla valle.",
    "shortDescription_en": "In the commune of Brusson, Val d'Ayas: a route among hamlets and alpine pastures on the sunny slope with valley views.",
    "shortDescription_fr": "Dans la commune de Brusson, Val d'Ayas : itinéraire entre hameaux et alpages du versant ensoleillé.",
    "shortDescription_de": "In der Gemeinde Brusson, Val d'Ayas: Weg zwischen Weilern und Almen des besonnten Hanges.",
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
