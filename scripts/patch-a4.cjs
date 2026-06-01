'use strict';
const fs = require('fs');
const path = require('path');

const patch = {
  "02-s20": {
    description_it: "Il sentiero 02_S20 attraversa in senso longitudinale la Valtournenche compiendo un lungo traverso tra i versanti soleggiati che guardano verso la Dora Baltea. Si parte da Bourg a 1078 m, nel comune di Torgnon, e si risale progressivamente verso nord-est fino a raggiungere Maen a 1991 m: 17,4 chilometri con 913 metri di dislivello positivo, difficoltà E secondo la scala CAI. Il percorso attraversa i comuni di Torgnon e Villeneuve, segnando il confine tra due realtà paesaggistiche distinte: i prati bassi e i vigneti delle quote inferiori e i pascoli aperti con vista sulla testata della valle che culmina nel massiccio del Cervino. La finestra stagionale consigliata dal Catasto regionale va da aprile a ottobre, indice di un tracciato accessibile per buona parte dell'anno nelle sue quote intermedie.",
    description_en: "Trail 02_S20 makes a long traverse along the sun-facing slopes of the Valtournenche, linking the village of Bourg at 1,078 m with Maen at 1,991 m. The 17.4 km route climbs 913 m through the municipalities of Torgnon and Villeneuve, passing from the lower meadows and vineyards of the valley floor to the open pastures of mid-mountain, with views toward the Matterhorn massif closing the valley head. Rated E (CAI scale), it is open from April to October according to the regional trail registry — a long accessible season that reflects its moderate altitude range.",
    description_fr: "Le sentier 02_S20 effectue une longue traversée sur les versants ensoleillés de la Valtournenche, reliant le hameau de Bourg (1 078 m) à Maen (1 991 m). Sur 17,4 km et 913 m de dénivelé positif, le tracé franchit les communes de Torgnon et de Villeneuve, passant des prairies basses et des vignes de fond de vallée aux alpages ouverts de moyenne montagne, avec des vues sur le massif du Cervin en tête de vallée. Côté E (échelle CAI), le sentier est praticable d'avril à octobre selon le cadastre régional.",
    description_de: "Der Weg 02_S20 quert in einer langen Traverse die sonnenzugewandten Hänge des Valtournenche und verbindet das Weiler Bourg (1.078 m) mit Maen (1.991 m). Auf 17,4 km Länge und 913 Höhenmetern durchquert die Route die Gemeinden Torgnon und Villeneuve, wobei sie von den tiefer gelegenen Wiesen und Weinbergen zu den offenen Bergweiden aufsteigt, mit Blick auf das Matterhorn-Massiv am Talschluss. Schwierigkeitsgrad E (CAI-Skala), laut Kataster von April bis Oktober begehbar.",
    shortDescription_it: "Lungo traverso in Valtournenche dai vigneti di Bourg (1078 m) ai pascoli di Maen (1991 m): 17,4 km con panorami sul Cervino.",
    shortDescription_en: "A long traverse through Valtournenche from the vineyards of Bourg (1,078 m) to the pastures of Maen (1,991 m), with views toward the Matterhorn.",
    shortDescription_fr: "Longue traversée en Valtournenche des vignes de Bourg (1 078 m) aux alpages de Maen (1 991 m), avec vues sur le Cervin.",
    shortDescription_de: "Lange Traverse im Valtournenche von den Weinbergen bei Bourg (1.078 m) zu den Weiden von Maen (1.991 m), mit Blick aufs Matterhorn.",
    warnings_it: ["Percorso lungo: dotarsi di scorte d'acqua adeguate e partire presto.", "Verificare le condizioni del terreno in caso di maltempo prolungato."],
    warnings_en: ["Long route: carry sufficient water and start early.", "Check trail conditions after prolonged bad weather."],
    warnings_fr: ["Long itinéraire : prévoir suffisamment d'eau et partir tôt.", "Vérifier l'état du sentier après de mauvaises conditions météo prolongées."],
    warnings_de: ["Lange Route: ausreichend Wasser mitführen und früh starten.", "Wegbedingungen nach anhaltend schlechtem Wetter prüfen."],
    updated_at: "2026-06-01"
  },
  "03-s6": {
    description_it: "Breve ma sostenuto itinerario escursionistico nel comune di Challand-Saint-Victor, in Val d'Ayas. Si parte dalla Strada Cappuccini a 601 m e si sale decisi verso Excenex a 1036 m: soli 3,2 chilometri ma con un dislivello di 452 metri che rende il percorso effettivamente impegnativo per chi non è allenato. La difficoltà E della scala CAI è coerente con la pendenza sostenuta. Il tracciato guadagna rapidamente quota lasciandosi alle spalle il fondovalle per entrare in un paesaggio di prati e boschi che caratterizza la fascia submontana della Val d'Ayas. La finestra stagionale indicata dal Catasto regionale è ampia — da aprile a ottobre — grazie alle quote relativamente contenute. Adatto come avvicinamento a Excenex o come escursione di mezza giornata.",
    description_en: "A short but steep hike in the municipality of Challand-Saint-Victor, in the Ayas Valley. The trail starts from Strada Cappuccini at 601 m and climbs firmly to Excenex at 1,036 m: just 3.2 km but with a 452 m elevation gain that demands steady legs. Rated E on the CAI scale, the route quickly sheds the valley floor for a landscape of meadows and mixed woodland typical of the sub-alpine belt of Val d'Ayas. The regional registry recommends it from April to October, reflecting its moderate altitude. Suitable as an approach to Excenex or a solid half-day outing.",
    description_fr: "Courte mais soutenue randonnée dans la commune de Challand-Saint-Victor, en Vallée d'Ayas. Au départ de la Strada Cappuccini (601 m), le sentier grimpe fermement jusqu'à Excenex (1 036 m) : seulement 3,2 km, mais 452 m de dénivelé qui exigent un bon rythme. Côté E (échelle CAI), le tracé quitte rapidement le fond de vallée pour un paysage de prairies et de forêts mixtes caractéristique de la ceinture subalpine. Le cadastre recommande la période d'avril à octobre.",
    description_de: "Kurze, aber steile Wanderung in der Gemeinde Challand-Saint-Victor im Ayas-Tal. Der Weg beginnt an der Strada Cappuccini (601 m) und führt zügig nach Excenex (1.036 m): nur 3,2 km, aber 452 Höhenmeter, die gute Kondition verlangen. Schwierigkeitsgrad E (CAI-Skala). Die Route verlässt rasch den Talboden für eine Landschaft aus Wiesen und Mischwald, typisch für den subalpinen Gürtel des Ayas-Tals. Laut Kataster von April bis Oktober begehbar.",
    shortDescription_it: "Salita diretta e sostenuta dalla Strada Cappuccini (601 m) a Excenex (1036 m) in Val d'Ayas: 3,2 km e 452 m di dislivello.",
    shortDescription_en: "A short, steep climb from Strada Cappuccini (601 m) to Excenex (1,036 m) in Val d'Ayas: 3.2 km and 452 m of ascent.",
    shortDescription_fr: "Montée directe et soutenue de la Strada Cappuccini (601 m) à Excenex (1 036 m) en Vallée d'Ayas : 3,2 km et 452 m de dénivelé.",
    shortDescription_de: "Kurzer, steiler Aufstieg von der Strada Cappuccini (601 m) nach Excenex (1.036 m) im Ayas-Tal: 3,2 km, 452 Hm.",
    updated_at: "2026-06-01"
  },
  "05-s16": {
    description_it: "Il sentiero 05_S16 collega Leverogne, nel fondovalle della Valgrisenche a 721 m, con il centro storico di Saint-Nicolas a 1203 m, salendo per 3,4 chilometri con 499 metri di dislivello positivo. Il tracciato tocca il Relais de la Télévision — punto di riferimento topografico lungo il versante — prima di raggiungere l'abitato. Difficoltà E, aperto da aprile a ottobre nei comuni di Arvier e Saint-Pierre. Il percorso percorre la fascia montana media tra la Dora di Valgrisenche e i contrafforti che separano questa valle dalla Valle della Dora Baltea.",
    description_en: "Trail 05_S16 connects Leverogne in the Valgrisenche valley floor (721 m) with the historic centre of Saint-Nicolas (1,203 m), covering 3.4 km with 499 m of ascent. The route passes the Relais de la Télévision — a topographic landmark on the slope — before reaching the village. Rated E, open from April to October across the municipalities of Arvier and Saint-Pierre.",
    description_fr: "Le sentier 05_S16 relie Leverogne dans le fond de la Valgrisenche (721 m) au centre historique de Saint-Nicolas (1 203 m) : 3,4 km et 499 m de dénivelé. Le tracé passe par le Relais de la Télévision — repère topographique sur le versant — avant d'atteindre le village. Côté E, praticable d'avril à octobre sur les communes d'Arvier et Saint-Pierre.",
    description_de: "Weg 05_S16 verbindet Leverogne im Talboden des Valgrisenche (721 m) mit dem historischen Ortskern von Saint-Nicolas (1.203 m): 3,4 km und 499 Höhenmeter. Die Route führt am Relais de la Télévision vorbei — einem topografischen Orientierungspunkt am Hang — bevor sie das Dorf erreicht. Schwierigkeitsgrad E, von April bis Oktober über die Gemeinden Arvier und Saint-Pierre begehbar.",
    shortDescription_it: "Dal fondovalle di Leverogne (721 m) a Saint-Nicolas (1203 m) passando per il Relais TV: 3,4 km tra Arvier e Saint-Pierre.",
    shortDescription_en: "From the Valgrisenche valley floor at Leverogne (721 m) to the hilltop village of Saint-Nicolas (1,203 m): 3.4 km and 499 m of ascent.",
    shortDescription_fr: "Du fond de la Valgrisenche à Leverogne (721 m) au village perché de Saint-Nicolas (1 203 m) : 3,4 km et 499 m de dénivelé.",
    shortDescription_de: "Vom Talboden bei Leverogne (721 m) zum Bergdorf Saint-Nicolas (1.203 m): 3,4 km und 499 Hm durch Arvier und Saint-Pierre.",
    updated_at: "2026-06-01"
  },
  "06-s18": {
    description_it: "Itinerario escursionistico nel comune di La Salle, in Valdigne, che collega Charbonnière a 1271 m con la località di Vedun a 1519 m. Il tracciato sviluppa 3,5 chilometri con 380 metri di dislivello positivo, difficoltà E secondo la scala CAI. La Valdigne è la parte alta della Valle d'Aosta, dominata a nord dal massiccio del Monte Bianco: il percorso si muove nella fascia montana tra i 1271 e i 1519 m, un ambiente di transizione tra il fondovalle e i pascoli alti. La stagione consigliata dal Catasto è da maggio a ottobre. Adatto a escursionisti con esperienza di base, è percorribile anche come itinerario di avvicinamento ad alpeggi superiori.",
    description_en: "A hiking trail in the municipality of La Salle, in the Valdigne — the uppermost section of the Aosta Valley — linking Charbonnière at 1,271 m with Vedun at 1,519 m. The route covers 3.5 km with 380 m of elevation gain, rated E (CAI scale). It moves through the mid-mountain belt between the valley floor and the higher pastures, in a landscape shaped by La Salle's proximity to the Mont Blanc massif. Recommended season: May to October.",
    description_fr: "Itinéraire de randonnée dans la commune de La Salle, en Valdigne — la partie haute de la Vallée d'Aoste — reliant Charbonnière (1 271 m) à Vedun (1 519 m). Le tracé couvre 3,5 km avec 380 m de dénivelé, côté E (échelle CAI). Il parcourt la ceinture de moyenne montagne entre le fond de vallée et les alpages supérieurs, dans un paysage marqué par la proximité du massif du Mont-Blanc. Période recommandée : mai à octobre.",
    description_de: "Wanderweg in der Gemeinde La Salle im Valdigne — dem obersten Teil des Aostatals — der Charbonnière (1.271 m) mit Vedun (1.519 m) verbindet. Die Route umfasst 3,5 km mit 380 Hm Aufstieg, Schwierigkeitsgrad E (CAI-Skala). Sie bewegt sich im mittleren Bergbereich zwischen Talboden und höheren Almen, in einer Landschaft, die von der Nähe zum Mont-Blanc-Massiv geprägt ist. Empfohlene Saison: Mai bis Oktober.",
    shortDescription_it: "Salita regolare in Valdigne da Charbonnière (1271 m) a Vedun (1519 m) nel comune di La Salle: 3,5 km con 380 m di dislivello.",
    shortDescription_en: "A steady climb in the Valdigne from Charbonnière (1,271 m) to Vedun (1,519 m) in the municipality of La Salle: 3.5 km, 380 m ascent.",
    shortDescription_fr: "Montée régulière en Valdigne de Charbonnière (1 271 m) à Vedun (1 519 m) dans la commune de La Salle : 3,5 km, 380 m de dénivelé.",
    shortDescription_de: "Gleichmäßiger Aufstieg im Valdigne von Charbonnière (1.271 m) nach Vedun (1.519 m) in der Gemeinde La Salle: 3,5 km, 380 Hm.",
    updated_at: "2026-06-01"
  },
  "06-s31": {
    description_it: "Itinerario impegnativo per escursionisti esperti nel comune di La Salle, Valdigne. Da La Clusaz a 1660 m si sale con continuità fino al Pas de Planaval a 3013 m: 7,5 chilometri e 1356 metri di dislivello positivo, difficoltà EE. Il tracciato porta da un ambiente montano di quota media fino alla zona delle alte quote, dove il terreno può presentare nevai residui anche in piena estate. La finestra stagionale ristretta — luglio e agosto secondo il Catasto — riflette le condizioni alpinisticamente esigenti dell'ultima parte del percorso. Il Pas de Planaval a 3013 m è un valico d'alta quota che si apre verso i versanti opposti della Valdigne.",
    description_en: "A demanding route for experienced hikers in the municipality of La Salle, Valdigne. From La Clusaz at 1,660 m the trail climbs steadily to the Pas de Planaval at 3,013 m: 7.5 km and 1,356 m of elevation gain, rated EE (CAI scale). The route ascends from mid-mountain terrain to high-alpine conditions where late-season snowfields may persist into summer. The narrow recommended window — July and August per the registry — reflects the demanding conditions of the upper section.",
    description_fr: "Itinéraire exigeant pour randonneurs confirmés dans la commune de La Salle, Valdigne. De La Clusaz (1 660 m) le sentier monte sans relâche jusqu'au Pas de Planaval (3 013 m) : 7,5 km et 1 356 m de dénivelé, côté EE (échelle CAI). Le tracé passe de la moyenne montagne aux conditions alpines de haute altitude, où des névés peuvent subsister en été. La fenêtre saisonnière étroite — juillet-août selon le cadastre — reflète les conditions exigeantes de la partie supérieure.",
    description_de: "Anspruchsvolle Route für erfahrene Wanderer in der Gemeinde La Salle, Valdigne. Von La Clusaz (1.660 m) steigt der Weg gleichmäßig zum Pas de Planaval (3.013 m): 7,5 km und 1.356 Hm Aufstieg, Schwierigkeitsgrad EE (CAI-Skala). Die Route führt von mittleren Berglagen in hochalpines Gelände, wo Firnfelder bis in den Sommer hinein bestehen können. Das enge empfohlene Zeitfenster — Juli bis August laut Kataster — spiegelt die anspruchsvollen Verhältnisse im oberen Abschnitt wider.",
    shortDescription_it: "Da La Clusaz (1660 m) al Pas de Planaval (3013 m) in Valdigne: 7,5 km e 1356 m di dislivello per escursionisti esperti.",
    shortDescription_en: "From La Clusaz (1,660 m) to the high-alpine Pas de Planaval (3,013 m) in the Valdigne: 7.5 km and 1,356 m of ascent, EE difficulty.",
    shortDescription_fr: "De La Clusaz (1 660 m) au Pas de Planaval (3 013 m) en Valdigne : 7,5 km et 1 356 m de dénivelé pour randonneurs confirmés.",
    shortDescription_de: "Von La Clusaz (1.660 m) zum hochalpinen Pas de Planaval (3.013 m) im Valdigne: 7,5 km und 1.356 Hm, Schwierigkeit EE.",
    warnings_it: ["Possibili nevai fino a luglio inoltrato; ramponi o piccozza potrebbero essere necessari in caso di neve.", "Apertura stagionale ristretta: luglio-agosto. Sconsigliato in condizioni di scarsa visibilità."],
    warnings_en: ["Snowfields may persist into late July; crampons or an ice axe may be needed in snowy conditions.", "Short season: July–August. Not recommended in poor visibility."],
    warnings_fr: ["Des névés peuvent persister jusqu'à fin juillet ; crampons ou piolet peuvent s'avérer nécessaires.", "Saison courte : juillet-août. Déconseillé par mauvaise visibilité."],
    warnings_de: ["Firnfelder können bis in den Hochsommer bestehen; Steigeisen oder Eispickel können erforderlich sein.", "Kurze Saison: Juli–August. Bei schlechter Sicht nicht empfohlen."],
    updated_at: "2026-06-01"
  },
  "07-s20": {
    description_it: "Il sentiero 07_S20 porta da Saint-Jacques a 1700 m al Col de Nannaz a 2770 m: 6,6 chilometri con 1082 metri di dislivello positivo, difficoltà E secondo la scala CAI. Il percorso guadagna quota con regolarità attraverso la fascia dei pascoli alpini, puntando verso un valico che raggiunge i quasi 2800 m. A queste quote il panorama si apre sulle creste circostanti della Valle centrale valdostana. La stagione consigliata dal Catasto è da giugno a settembre. Il dislivello sostenuto richiede buona preparazione fisica, pur rientrando nella difficoltà E.",
    description_en: "Trail 07_S20 climbs from Saint-Jacques at 1,700 m to the Col de Nannaz at 2,770 m: 6.6 km and 1,082 m of ascent, rated E (CAI scale). The route gains altitude steadily through alpine pastures toward a pass approaching 2,800 m, where the surrounding ridgelines of the central valley come into view. Recommended season: June to September. The significant elevation gain demands good physical preparation despite the E rating.",
    description_fr: "Le sentier 07_S20 monte de Saint-Jacques (1 700 m) au Col de Nannaz (2 770 m) : 6,6 km et 1 082 m de dénivelé, côté E (échelle CAI). Le tracé gagne régulièrement de l'altitude à travers les alpages vers un col à près de 2 800 m, où s'ouvrent les vues sur les crêtes environnantes. Période recommandée : juin à septembre.",
    description_de: "Weg 07_S20 führt von Saint-Jacques (1.700 m) zum Col de Nannaz (2.770 m): 6,6 km und 1.082 Hm Aufstieg, Schwierigkeitsgrad E (CAI-Skala). Die Route gewinnt gleichmäßig an Höhe durch alpine Weiden zu einem Pass knapp unter 2.800 m. Empfohlene Saison: Juni bis September.",
    shortDescription_it: "Da Saint-Jacques (1700 m) al Col de Nannaz (2770 m): 6,6 km e oltre 1000 m di dislivello con vista sulle creste valdostane.",
    shortDescription_en: "From Saint-Jacques (1,700 m) to the Col de Nannaz (2,770 m): 6.6 km and over 1,000 m of ascent with views over the central Aosta Valley ridges.",
    shortDescription_fr: "De Saint-Jacques (1 700 m) au Col de Nannaz (2 770 m) : 6,6 km et plus de 1 000 m de dénivelé avec vues sur les crêtes valdôtaines.",
    shortDescription_de: "Von Saint-Jacques (1.700 m) zum Col de Nannaz (2.770 m): 6,6 km und über 1.000 Hm mit Blick auf die Kämme des Aostatals.",
    updated_at: "2026-06-01"
  },
  "07-s28": {
    description_it: "Itinerario tra i più impegnativi del Catasto: dal villaggio di Blanchard a 1731 m si sale fino al Rifugio Guide di Ayas a 3394 m, accumulando 1668 metri di dislivello in 8,8 chilometri, difficoltà EE. Il rifugio si colloca nell'alta Valle d'Ayas, ai piedi di un ambiente glaciale di alta quota. La finestra stagionale consigliata — giugno, luglio, agosto, settembre — è generosa in calendario ma le condizioni di alta quota richiedono valutazione accurata. L'escursione è adatta a escursionisti esperti con allenamento adeguato e dotazione appropriata per ambienti di alta montagna.",
    description_en: "One of the most demanding routes in the registry: from Blanchard at 1,731 m the trail climbs to the Rifugio Guide di Ayas at 3,394 m, gaining 1,668 m over 8.8 km, rated EE (CAI scale). The refuge sits in the high Ayas Valley at the threshold of a glacial high-alpine environment. The recommended season — June through September — is broad on paper, but high-altitude conditions require careful assessment. Suitable for experienced hikers with adequate fitness and appropriate high-mountain equipment.",
    description_fr: "L'un des itinéraires les plus exigeants du cadastre : depuis Blanchard (1 731 m), le sentier monte jusqu'au Rifugio Guide di Ayas (3 394 m), avec 1 668 m de dénivelé en 8,8 km, côté EE (échelle CAI). Le refuge est situé dans la haute Vallée d'Ayas, au seuil d'un environnement glaciaire de haute altitude. La saison recommandée — juin à septembre — est large en théorie, mais les conditions en altitude exigent une évaluation attentive. Réservé aux randonneurs expérimentés avec équipement adapté.",
    description_de: "Einer der anspruchsvollsten Wege im Kataster: Von Blanchard (1.731 m) führt der Weg zum Rifugio Guide di Ayas (3.394 m), mit 1.668 Hm Aufstieg auf 8,8 km, Schwierigkeitsgrad EE (CAI-Skala). Die Hütte liegt im oberen Ayas-Tal an der Schwelle einer hochalpinen Gletscherumgebung. Die empfohlene Saison — Juni bis September — ist kalendarisch großzügig, aber die Hochgebirgsbedingungen erfordern sorgfältige Einschätzung. Geeignet für erfahrene Wanderer mit angemessener Fitness und Hochgebirgsausrüstung.",
    shortDescription_it: "Da Blanchard (1731 m) al Rifugio Guide di Ayas (3394 m): 8,8 km e 1668 m di dislivello nell'alta Valle d'Ayas, difficoltà EE.",
    shortDescription_en: "From Blanchard (1,731 m) to the Rifugio Guide di Ayas (3,394 m): 8.8 km and 1,668 m of ascent into the high Ayas Valley, EE difficulty.",
    shortDescription_fr: "De Blanchard (1 731 m) au Rifugio Guide di Ayas (3 394 m) : 8,8 km et 1 668 m de dénivelé dans la haute Vallée d'Ayas, difficulté EE.",
    shortDescription_de: "Von Blanchard (1.731 m) zum Rifugio Guide di Ayas (3.394 m): 8,8 km und 1.668 Hm im oberen Ayas-Tal, Schwierigkeit EE.",
    warnings_it: ["Alta quota (3394 m): rischio di mal di montagna. Salire gradualmente e idratarsi.", "Terreno d'alta montagna: attrezzatura idonea obbligatoria (scarponi, abbigliamento a strati).", "Possibili nevai e terreno ghiacciato a inizio stagione."],
    warnings_en: ["High altitude (3,394 m): risk of altitude sickness. Ascend gradually and stay hydrated.", "High-mountain terrain: appropriate equipment required (mountain boots, layered clothing).", "Snowfields and icy ground possible early in the season."],
    warnings_fr: ["Haute altitude (3 394 m) : risque de mal des montagnes. Monter progressivement et s'hydrater.", "Terrain de haute montagne : équipement adapté obligatoire.", "Névés et terrain verglacé possibles en début de saison."],
    warnings_de: ["Hohe Lage (3.394 m): Risiko der Höhenkrankheit. Schrittweise aufsteigen und ausreichend trinken.", "Hochgebirgsgelände: geeignete Ausrüstung erforderlich.", "Firnfelder und Eisgelände früh in der Saison möglich."],
    updated_at: "2026-06-01"
  },
  "07-s43": {
    description_it: "Il sentiero 07_S43 parte dal centro di Champoluc a 1569 m e sale verso i Lacs Perrin a 2649 m: 6 chilometri con 1147 metri di dislivello, difficoltà E. Champoluc è il principale centro abitativo dell'alta Valle d'Ayas, punto di partenza di numerosi itinerari verso le quote superiori. Il percorso guadagna quota con regolarità, attraversando dapprima il pascolo estivo per poi raggiungere l'ambiente lacustre di alta quota dei Lacs Perrin. La stagione consigliata è da giugno a settembre. La presenza di laghi d'alta quota come meta finale rende questo percorso particolarmente apprezzato in estate.",
    description_en: "Trail 07_S43 starts from the centre of Champoluc at 1,569 m and climbs to the Lacs Perrin at 2,649 m: 6 km and 1,147 m of ascent, rated E (CAI scale). Champoluc is the main village in the upper Ayas Valley and the trailhead for numerous high-altitude routes. The path gains elevation steadily, moving through summer pastures before reaching the alpine lake basin of the Lacs Perrin. Recommended season: June to September.",
    description_fr: "Le sentier 07_S43 part du centre de Champoluc (1 569 m) et monte aux Lacs Perrin (2 649 m) : 6 km et 1 147 m de dénivelé, côté E (échelle CAI). Champoluc est le principal village de la haute Vallée d'Ayas et le point de départ de nombreux itinéraires de haute altitude. Le tracé gagne régulièrement de l'altitude, traversant les alpages d'été avant d'atteindre le bassin lacustre des Lacs Perrin. Période recommandée : juin à septembre.",
    description_de: "Weg 07_S43 beginnt im Ortszentrum von Champoluc (1.569 m) und führt zu den Lacs Perrin (2.649 m): 6 km und 1.147 Hm Aufstieg, Schwierigkeitsgrad E (CAI-Skala). Champoluc ist das Hauptdorf im oberen Ayas-Tal und Ausgangspunkt zahlreicher Hochgebirgsrouten. Der Pfad gewinnt gleichmäßig an Höhe durch Sommerwiesen und erreicht das Hochgebirgsseen-Becken der Lacs Perrin. Empfohlene Saison: Juni bis September.",
    shortDescription_it: "Da Champoluc (1569 m) ai Lacs Perrin (2649 m) nell'alta Valle d'Ayas: 6 km e 1147 m di dislivello verso i laghi d'alta quota.",
    shortDescription_en: "From Champoluc (1,569 m) to the Lacs Perrin (2,649 m) in the upper Ayas Valley: 6 km and 1,147 m of ascent to alpine lakes.",
    shortDescription_fr: "De Champoluc (1 569 m) aux Lacs Perrin (2 649 m) dans la haute Vallée d'Ayas : 6 km et 1 147 m de dénivelé vers des lacs d'altitude.",
    shortDescription_de: "Von Champoluc (1.569 m) zu den Lacs Perrin (2.649 m) im oberen Ayas-Tal: 6 km und 1.147 Hm zu Hochgebirgsseen.",
    updated_at: "2026-06-01"
  },
  "07-s63": {
    description_it: "Dal villaggio di Blanchard a 1731 m si raggiunge il Lago Blu a 2297 m percorrendo 4,2 chilometri con 575 metri di dislivello, difficoltà E. Il Lago Blu è una meta di alta quota nella Valle centrale valdostana. Il percorso parte da Blanchard e si sviluppa con pendenza moderata verso il bacino del lago. La stagione consigliata è da giugno a settembre. Un'escursione accessibile agli escursionisti con buona forma fisica che cercano la soddisfazione di una meta lacustre d'alta quota.",
    description_en: "From Blanchard at 1,731 m the trail leads to Lago Blu at 2,297 m: 4.2 km and 575 m of ascent, rated E (CAI scale). Lago Blu is a high-altitude lake in the central Aosta Valley. The route departs from Blanchard and climbs at a moderate gradient toward the lake basin. Recommended season: June to September. A satisfying day hike for fit walkers seeking an alpine lake destination.",
    description_fr: "Depuis Blanchard (1 731 m), le sentier mène au Lago Blu (2 297 m) : 4,2 km et 575 m de dénivelé, côté E (échelle CAI). Le Lago Blu est un lac d'altitude dans la vallée centrale valdôtaine. Le tracé part de Blanchard et monte à pente modérée vers le bassin lacustre. Période recommandée : juin à septembre.",
    description_de: "Von Blanchard (1.731 m) führt der Weg zum Lago Blu (2.297 m): 4,2 km und 575 Hm Aufstieg, Schwierigkeitsgrad E (CAI-Skala). Der Lago Blu ist ein Hochgebirgssee im zentralen Aostatal. Die Route startet in Blanchard und steigt mit mäßiger Neigung zum Seebecken. Empfohlene Saison: Juni bis September.",
    shortDescription_it: "Da Blanchard (1731 m) al Lago Blu (2297 m) in Valle centrale: 4,2 km e 575 m di dislivello verso un suggestivo lago d'alta quota.",
    shortDescription_en: "From Blanchard (1,731 m) to the vivid Lago Blu (2,297 m): 4.2 km and 575 m of ascent to a distinctive high-altitude lake.",
    shortDescription_fr: "De Blanchard (1 731 m) au Lago Blu (2 297 m) : 4,2 km et 575 m de dénivelé vers un lac d'altitude remarquable.",
    shortDescription_de: "Von Blanchard (1.731 m) zum Lago Blu (2.297 m): 4,2 km und 575 Hm zu einem markanten Hochgebirgssee.",
    updated_at: "2026-06-01"
  },
  "08-s18": {
    description_it: "Il sentiero 08_S18 risale la Val di Cogne nel comune di Aymavilles, partendo da La Nouva a 1300 m e salendo agli Alpeggi Nomenon e poi al Bivacco Gontier a 2302 m: 6,7 chilometri con 1020 metri di dislivello, difficoltà E. Il percorso attraversa due fasi ambientali distinte: la fascia dei boschi e dei prati bassi nella prima parte, poi gli alpeggi della quota media e infine l'ambiente aperto di alta montagna nei pressi del bivacco. Il Catasto indica come apertura la finestra metà giugno–metà settembre. La Val di Cogne offre scenari di rara qualità paesaggistica nel cuore del Parco Nazionale del Gran Paradiso.",
    description_en: "Trail 08_S18 climbs through the Cogne Valley in the municipality of Aymavilles, from La Nouva at 1,300 m through the Alpeggi Nomenon to the Bivacco Gontier at 2,302 m: 6.7 km and 1,020 m of ascent, rated E (CAI scale). The route moves through two distinct landscapes: forested lower slopes giving way to mid-mountain pastures and finally the open high terrain near the bivouac. The registry recommends mid-June to mid-September. The Cogne Valley sits within the Gran Paradiso National Park.",
    description_fr: "Le sentier 08_S18 remonte la Val de Cogne dans la commune d'Aymavilles, de La Nouva (1 300 m) par les Alpeggi Nomenon jusqu'au Bivacco Gontier (2 302 m) : 6,7 km et 1 020 m de dénivelé, côté E (échelle CAI). Le tracé traverse deux paysages distincts. Le cadastre recommande mi-juin à mi-septembre. La Val de Cogne s'inscrit dans le Parc National du Grand Paradis.",
    description_de: "Weg 08_S18 steigt im Cogne-Tal in der Gemeinde Aymavilles auf, von La Nouva (1.300 m) über die Alpeggi Nomenon zum Bivacco Gontier (2.302 m): 6,7 km und 1.020 Hm Aufstieg, Schwierigkeitsgrad E (CAI-Skala). Die Route durchquert zwei unterschiedliche Landschaften. Das Kataster empfiehlt Mitte Juni bis Mitte September. Das Cogne-Tal liegt im Gran-Paradiso-Nationalpark.",
    shortDescription_it: "Da La Nouva (1300 m) agli Alpeggi Nomenon e al Bivacco Gontier (2302 m) nel Parco Nazionale del Gran Paradiso: 6,7 km e 1020 m.",
    shortDescription_en: "From La Nouva (1,300 m) through the Nomenon alp to Bivacco Gontier (2,302 m) in the Gran Paradiso National Park: 6.7 km, 1,020 m ascent.",
    shortDescription_fr: "De La Nouva (1 300 m) par l'alpe Nomenon au Bivacco Gontier (2 302 m) dans le Parc National du Grand Paradis : 6,7 km, 1 020 m.",
    shortDescription_de: "Von La Nouva (1.300 m) über die Nomenon-Alm zum Bivacco Gontier (2.302 m) im Gran-Paradiso-Nationalpark: 6,7 km, 1.020 Hm.",
    updated_at: "2026-06-01"
  },
  "08-s9": {
    description_it: "Itinerario breve e diretto nel comune di Aymavilles, Val di Cogne. Da Champsolin a 762 m si sale a Ozein a 1371 m in soli 3,2 chilometri, con un dislivello di 596 metri che risulta tra i più sostenuti della fascia E del Catasto valdostano. La pendenza media elevata caratterizza tutto il percorso, che scalza rapidamente la quota del fondovalle per guadagnare l'ambiente collinare superiore del comune di Aymavilles. La stagione consigliata è da maggio a ottobre.",
    description_en: "A short, direct trail in the municipality of Aymavilles, Cogne Valley. From Champsolin at 762 m the route climbs to Ozein at 1,371 m in just 3.2 km, with a 596 m elevation gain — one of the steepest gradients among E-rated trails in the Aosta Valley registry. Season: May to October.",
    description_fr: "Itinéraire court et direct dans la commune d'Aymavilles, Val de Cogne. De Champsolin (762 m), le sentier monte à Ozein (1 371 m) en seulement 3,2 km, avec 596 m de dénivelé — l'une des pentes moyennes les plus élevées parmi les sentiers côte E. Saison : mai à octobre.",
    description_de: "Kurzer, direkter Weg in der Gemeinde Aymavilles im Cogne-Tal. Von Champsolin (762 m) steigt die Route nach Ozein (1.371 m) auf nur 3,2 km mit 596 Hm — eine der steilsten mittleren Steigungen unter den E-Wegen. Saison: Mai bis Oktober.",
    shortDescription_it: "Salita ripida da Champsolin (762 m) a Ozein (1371 m) in Val di Cogne: 3,2 km con 596 m di dislivello.",
    shortDescription_en: "Steep climb from Champsolin (762 m) to Ozein (1,371 m) in the Cogne Valley: 3.2 km with 596 m of ascent.",
    shortDescription_fr: "Montée raide de Champsolin (762 m) à Ozein (1 371 m) en Val de Cogne : 3,2 km et 596 m de dénivelé.",
    shortDescription_de: "Steiler Aufstieg von Champsolin (762 m) nach Ozein (1.371 m) im Cogne-Tal: 3,2 km mit 596 Hm.",
    updated_at: "2026-06-01"
  },
  "10-s2": {
    description_it: "Il sentiero 10_S2 risale la Valpelline nel comune di Bionaz, portando da Lessert a 1618 m al Col de Crête Sèche a 2898 m: 6,5 chilometri con 1330 metri di dislivello, difficoltà E. Il Col de Crête Sèche è un valico d'alta quota che mette in comunicazione la Valpelline con i territori oltre confine verso il Canton Vallese svizzero, e rappresenta un punto panoramico di notevole apertura visiva. Il Catasto segnala solo 2 segnavia lungo il tracciato, elemento che invita a una particolare attenzione alla lettura del percorso in caso di nebbia o neve. La stagione è luglio-settembre.",
    description_en: "Trail 10_S2 climbs through the Valpelline in the municipality of Bionaz, from Lessert at 1,618 m to the Col de Crête Sèche at 2,898 m: 6.5 km and 1,330 m of ascent, rated E (CAI scale). The Col de Crête Sèche is a high pass connecting the Valpelline with Swiss territory in the Canton of Valais, offering broad panoramic views. Only 2 waymarks are recorded — careful navigation required in fog or snow. Season: July to September.",
    description_fr: "Le sentier 10_S2 remonte la Valpelline dans la commune de Bionaz, de Lessert (1 618 m) au Col de Crête Sèche (2 898 m) : 6,5 km et 1 330 m de dénivelé, côté E (échelle CAI). Le Col de Crête Sèche relie la Valpelline aux territoires suisses du Canton du Valais. Seulement 2 jalons recensés — navigation attentive requise par brouillard ou neige. Saison : juillet à septembre.",
    description_de: "Weg 10_S2 steigt im Valpelline in der Gemeinde Bionaz auf, von Lessert (1.618 m) zum Col de Crête Sèche (2.898 m): 6,5 km und 1.330 Hm, Schwierigkeitsgrad E. Der Pass verbindet das Valpelline mit dem Kanton Wallis. Nur 2 Wegmarkierungen — sorgfältige Navigation bei Nebel oder Schnee nötig. Saison: Juli bis September.",
    shortDescription_it: "Da Lessert (1618 m) al Col de Crête Sèche (2898 m) in Valpelline: 6,5 km e 1330 m verso il valico al confine con il Canton Vallese.",
    shortDescription_en: "From Lessert (1,618 m) to the Col de Crête Sèche (2,898 m) in the Valpelline: 6.5 km and 1,330 m to a high pass on the Swiss border.",
    shortDescription_fr: "De Lessert (1 618 m) au Col de Crête Sèche (2 898 m) en Valpelline : 6,5 km et 1 330 m vers un col frontalier avec le Canton du Valais.",
    shortDescription_de: "Von Lessert (1.618 m) zum Col de Crête Sèche (2.898 m) im Valpelline: 6,5 km und 1.330 Hm zu einem Grenzpass zum Kanton Wallis.",
    warnings_it: ["Segnaletica scarsa (2 segnavia): portare cartografia dettagliata o GPS.", "Possibili nevai tardivi; verificare le condizioni prima di partire in luglio."],
    warnings_en: ["Sparse waymarking (2 signs): carry detailed map or GPS.", "Late snowfields possible; check conditions before setting out in July."],
    warnings_fr: ["Balisage rare (2 jalons) : emporter une carte détaillée ou un GPS.", "Névés tardifs possibles ; vérifier les conditions avant de partir en juillet."],
    warnings_de: ["Spärliche Markierung (2 Schilder): detaillierte Karte oder GPS mitführen.", "Späte Firnfelder möglich; Bedingungen vor dem Start im Juli prüfen."],
    updated_at: "2026-06-01"
  },
  "10-s7": {
    description_it: "Il sentiero 10_S7 percorre la Valpelline nel comune di Bionaz, salendo da Chamin a 1732 m al Bivacco della Sassa a 2964 m: 7,1 chilometri con 1246 metri di dislivello, difficoltà E. Il Bivacco della Sassa è posto a quasi 3000 m, in un ambiente di alta quota che richiede preparazione adeguata pur rientrando nella classificazione E. La Valpelline è una valle poco frequentata rispetto ad altri itinerari valdostani, il che conferisce a questo percorso un carattere di maggiore solitudine e immersione nel paesaggio alpino. Stagione: giugno-settembre.",
    description_en: "Trail 10_S7 traverses the Valpelline in the municipality of Bionaz, climbing from Chamin at 1,732 m to the Bivacco della Sassa at 2,964 m: 7.1 km and 1,246 m of ascent, rated E (CAI scale). The Bivacco della Sassa at nearly 3,000 m requires solid preparation despite the E rating. The Valpelline is a comparatively quiet valley that gives this route a more solitary, immersive alpine character. Season: June to September.",
    description_fr: "Le sentier 10_S7 parcourt la Valpelline dans la commune de Bionaz, de Chamin (1 732 m) au Bivacco della Sassa (2 964 m) : 7,1 km et 1 246 m de dénivelé, côté E (échelle CAI). Le bivouac à près de 3 000 m exige une bonne préparation malgré la côte E. La Valpelline est une vallée peu fréquentée, offrant un caractère plus solitaire et immersif. Saison : juin à septembre.",
    description_de: "Weg 10_S7 durchquert das Valpelline in der Gemeinde Bionaz und steigt von Chamin (1.732 m) zum Bivacco della Sassa (2.964 m): 7,1 km und 1.246 Hm, Schwierigkeitsgrad E. Das Bivouak auf knapp 3.000 m erfordert gute Vorbereitung. Das Valpelline ist ein stilles, selten begangenes Tal. Saison: Juni bis September.",
    shortDescription_it: "Da Chamin (1732 m) al Bivacco della Sassa (2964 m) in Valpelline: 7,1 km e 1246 m di dislivello in una valle di grande solitudine alpina.",
    shortDescription_en: "From Chamin (1,732 m) to the Bivacco della Sassa (2,964 m) in the quiet Valpelline: 7.1 km and 1,246 m of ascent.",
    shortDescription_fr: "De Chamin (1 732 m) au Bivacco della Sassa (2 964 m) dans la solitaire Valpelline : 7,1 km et 1 246 m de dénivelé.",
    shortDescription_de: "Von Chamin (1.732 m) zum Bivacco della Sassa (2.964 m) im stillen Valpelline: 7,1 km und 1.246 Hm.",
    updated_at: "2026-06-01"
  },
  "12-s10": {
    description_it: "Itinerario per escursionisti esperti (EE) nel comune di Brusson, in Val d'Ayas. La partenza si trova lungo la strada per Estoul a 1884 m; il percorso tocca il Lago Battaglia e culmina al Corno Boussolaz a 3023 m: 7,9 chilometri con 1149 metri di dislivello. Il Lago Battaglia è una tappa lacustre intermedia che interrompe la salita verso la sommità. Il Corno Boussolaz a 3023 m richiede condizioni stabili e buona esperienza su terreno alpino. La stagione consigliata è da giugno a settembre.",
    description_en: "An EE-rated route for experienced hikers in the municipality of Brusson, Val d'Ayas. The trail starts from the road to Estoul at 1,884 m, passes the Lago Battaglia, and culminates at the Corno Boussolaz summit at 3,023 m: 7.9 km and 1,149 m of ascent. The Lago Battaglia is an alpine lake that marks an intermediate stage in the ascent. The Corno Boussolaz demands stable conditions and solid experience on alpine terrain. Season: June to September.",
    description_fr: "Itinéraire côté EE pour randonneurs expérimentés dans la commune de Brusson, Vallée d'Ayas. Au départ de la route d'Estoul (1 884 m), le tracé passe par le Lago Battaglia et culmine au Corno Boussolaz (3 023 m) : 7,9 km et 1 149 m de dénivelé. Le Lago Battaglia marque une étape intermédiaire. Conditions stables et expérience alpine requises. Saison : juin à septembre.",
    description_de: "EE-bewertete Route für erfahrene Wanderer in der Gemeinde Brusson im Ayas-Tal. Start an der Estoul-Straße (1.884 m), vorbei am Lago Battaglia, Gipfel am Corno Boussolaz (3.023 m): 7,9 km und 1.149 Hm. Stabile Bedingungen und alpine Erfahrung erforderlich. Saison: Juni bis September.",
    shortDescription_it: "Dalla strada per Estoul (1884 m) al Corno Boussolaz (3023 m) toccando il Lago Battaglia: 7,9 km EE in Val d'Ayas.",
    shortDescription_en: "From the Estoul road (1,884 m) via Lago Battaglia to the Corno Boussolaz summit (3,023 m): 7.9 km EE in Val d'Ayas.",
    shortDescription_fr: "De la route d'Estoul (1 884 m) par le Lago Battaglia au Corno Boussolaz (3 023 m) : 7,9 km EE en Vallée d'Ayas.",
    shortDescription_de: "Von der Estoul-Straße (1.884 m) über den Lago Battaglia zum Corno Boussolaz (3.023 m): 7,9 km EE im Ayas-Tal.",
    warnings_it: ["Difficoltà EE: richiede esperienza su terreno alpino e condizioni meteorologiche stabili.", "Possibili nevai nella parte alta del percorso."],
    warnings_en: ["EE difficulty: experience on alpine terrain and stable weather required.", "Snowfields possible in the upper section."],
    warnings_fr: ["Difficulté EE : expérience en terrain alpin et conditions stables requises.", "Névés possibles en partie haute."],
    warnings_de: ["Schwierigkeit EE: Erfahrung im Alpengelände und stabile Bedingungen erforderlich.", "Firnfelder im oberen Abschnitt möglich."],
    updated_at: "2026-06-01"
  },
  "12-s24": {
    description_it: "Il sentiero 12_S24 parte dal borgo medievale di Graines a 1398 m e sale al Col de Frudière a 2266 m: 7,7 chilometri con 912 metri di dislivello, difficoltà E. Graines è un sito di interesse storico in Val d'Ayas, nel comune di Brusson, con resti di un castello medievale che caratterizza la partenza del percorso. Da questo punto culturalmente significativo il tracciato si allunga verso i pascoli della fascia alpina, con 9 segnavia censiti dal Catasto che garantiscono una buona copertura segnaletiga. Il Col de Frudière a 2266 m apre viste sulla testata della Val d'Ayas. Stagione consigliata: da giugno a settembre.",
    description_en: "Trail 12_S24 departs from the medieval hamlet of Graines at 1,398 m and climbs to the Col de Frudière at 2,266 m: 7.7 km and 912 m of ascent, rated E (CAI scale). Graines is a site of historical interest in the municipality of Brusson, Val d'Ayas, with the ruins of a medieval castle marking the start of the route. From this culturally significant point the trail extends through alpine pastures, with 9 waymarks. The Col de Frudière opens views over the upper Val d'Ayas. Season: June to September.",
    description_fr: "Le sentier 12_S24 part du hameau médiéval de Graines (1 398 m) et monte au Col de Frudière (2 266 m) : 7,7 km et 912 m de dénivelé, côté E (échelle CAI). Graines est un site historique avec les vestiges d'un château médiéval qui marque le départ. 9 jalons balisés. Le Col de Frudière (2 266 m) ouvre sur des vues vers la tête de vallée. Saison : juin à septembre.",
    description_de: "Weg 12_S24 startet am mittelalterlichen Weiler Graines (1.398 m) und führt zum Col de Frudière (2.266 m): 7,7 km und 912 Hm, Schwierigkeitsgrad E. Graines ist eine historische Stätte mit Überresten einer mittelalterlichen Burg. 9 Wegmarkierungen laut Kataster. Der Col de Frudière (2.266 m) eröffnet Ausblicke auf das obere Ayas-Tal. Saison: Juni bis September.",
    shortDescription_it: "Dal castello medievale di Graines (1398 m) al Col de Frudière (2266 m) in Val d'Ayas: 7,7 km tra storia e paesaggio alpino aperto.",
    shortDescription_en: "From the medieval castle ruins at Graines (1,398 m) to the Col de Frudière (2,266 m) in Val d'Ayas: 7.7 km blending history and open alpine landscape.",
    shortDescription_fr: "Du château médiéval de Graines (1 398 m) au Col de Frudière (2 266 m) en Vallée d'Ayas : 7,7 km entre histoire et paysage alpin ouvert.",
    shortDescription_de: "Von der mittelalterlichen Burgruine Graines (1.398 m) zum Col de Frudière (2.266 m) im Ayas-Tal: 7,7 km zwischen Geschichte und offenem Alpenpanorama.",
    updated_at: "2026-06-01"
  }
};

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
