import { fauna, profile } from './factory';

export const FAUNA_LIST = [
  fauna({
    id: 'stambecco',
    faunaClass: 'mammal',
    faunaGroup: 'ungulate',
    name_it: 'Stambecco alpino',
    name_en: 'Alpine ibex',
    scientific: 'Capra ibex',
    altitude: [1600, 3600],
    zoneKeys: ['granParadiso', 'valsavarenche', 'valpelline', 'valGrisanche'],
    wikiIt: 'Stambecco',
    wikiEn: 'Alpine_ibex',
    diet_it: 'Graminacee alpine, forbe, germogli e licheni',
    diet_en: 'Alpine grasses, forbs, shoots and lichens',
    habitat_it: 'Versanti rupestri, creste aperte, pascoli d alta quota',
    habitat_en: 'Rocky slopes, open ridges and high alpine pastures',
    activity_it: 'Diurno, con picchi di attivita al mattino e nel tardo pomeriggio',
    activity_en: 'Diurnal, with activity peaks in the morning and late afternoon',
    status_it: 'Popolazione stabile e ben monitorata nelle aree protette regionali',
    status_en: 'Stable population, closely monitored in regional protected areas',
    profile: profile(
      {
        overview:
          'Lo stambecco alpino e un grande ungulato di alta quota, simbolo faunistico delle Alpi occidentali. In Valle d Aosta mantiene nuclei consistenti grazie alla continuita di habitat rupestri e alle misure di tutela storiche.',
        identification:
          'Il maschio adulto si riconosce per le corna molto sviluppate con marcate nodosita frontali, mentre la femmina ha corna piu sottili e corte. La sagoma e robusta, con arti forti adatti al movimento su pareti rocciose ripide e instabili.',
        ecology:
          'Si alimenta prevalentemente di erbe e piante erbacee, modulando l uso delle esposizioni in base all innevamento stagionale. Le femmine vivono in gruppi sociali, mentre i maschi tendono a frequentare aree separate fuori dal periodo riproduttivo.',
        inValle:
          'Le osservazioni sono frequenti nel settore del Gran Paradiso e nelle testate vallive meno antropizzate. In estate risale ai pascoli piu elevati, mentre in inverno ricerca pendii soleggiati con minore copertura nevosa.',
      },
      {
        overview:
          'The Alpine ibex is a large high-elevation ungulate and an iconic species of the western Alps. In Aosta Valley it sustains strong core populations thanks to extensive rocky habitat and long-term protection measures.',
        identification:
          'Adult males are identified by very large horns with pronounced frontal ridges, while females have shorter and slimmer horns. The body is compact and powerful, with strong limbs suited to steep and unstable rocky terrain.',
        ecology:
          'It feeds mainly on grasses and alpine forbs, shifting slope use according to snow conditions through the year. Females form social groups, whereas males often use separate sectors outside the breeding season.',
        inValle:
          'Sightings are common in the Gran Paradiso sector and in less disturbed valley heads. During summer it moves to higher pastures, while in winter it selects sunny slopes with reduced snow cover.',
      }
    ),
  }),
  fauna({
    id: 'camoscio',
    faunaClass: 'mammal',
    faunaGroup: 'ungulate',
    name_it: 'Camoscio alpino',
    name_en: 'Alpine chamois',
    scientific: 'Rupicapra rupicapra',
    altitude: [900, 3200],
    zoneKeys: ['lys', 'valtournenche', 'valFerret', 'montAvic', 'valpelline'],
    wikiIt: 'Camoscio',
    wikiEn: 'Chamois',
    diet_it: 'Erbe montane, foglie, germogli e arbusti nani',
    diet_en: 'Mountain grasses, leaves, shoots and dwarf shrubs',
    habitat_it: 'Mosaico di praterie alpine, rupi e boschi radi subalpini',
    habitat_en: 'Mosaic of alpine grasslands, cliffs and open subalpine woods',
    activity_it: 'Diurno, con maggiore movimento nelle ore fresche',
    activity_en: 'Diurnal, with stronger movement during cool hours',
    status_it: 'Specie comune, con dinamiche locali legate a innevamento e disturbo',
    status_en: 'Common species, with local dynamics linked to snow and disturbance',
    profile: profile(
      {
        overview:
          'Il camoscio e l ungulato piu diffuso sui versanti valdostani e occupa rapidamente habitat eterogenei di media e alta montagna. La specie mostra elevata plasticita ecologica e buona resilienza alle variazioni stagionali.',
        identification:
          'Si riconosce per le corna uncinate rivolte all indietro presenti in entrambi i sessi e per il muso con bande contrastate. In inverno il mantello diventa piu scuro e folto, mentre in estate assume tonalita piu chiare.',
        ecology:
          'Sfrutta gradienti altitudinali ampi e alterna aree di alimentazione aperte a zone di rifugio piu riparate. Le femmine si aggregano con i giovani, mentre i maschi adulti risultano piu solitari per buona parte dell anno.',
        inValle:
          'E regolarmente osservato in Valtournenche, Val d Ayas, Valpelline e nelle vallate del Monte Rosa. La presenza resta elevata anche in comprensori con forte frequentazione escursionistica quando sono disponibili settori tranquilli.',
      },
      {
        overview:
          'The chamois is the most widespread mountain ungulate on Aosta Valley slopes and rapidly occupies heterogeneous mid and high-elevation habitats. The species shows strong ecological flexibility and good resilience to seasonal variation.',
        identification:
          'It is recognized by backward-hooked horns in both sexes and by contrasted facial stripes. The coat is darker and denser in winter, while summer pelage is lighter.',
        ecology:
          'It uses broad elevational gradients and alternates open feeding grounds with sheltered refuge areas. Females group with young, whereas adult males remain more solitary for much of the year.',
        inValle:
          'It is regularly observed in Valtournenche, Ayas Valley, Valpelline and the Monte Rosa side valleys. Presence remains high even in areas with strong hiking pressure when quiet sectors are available.',
      }
    ),
  }),
  fauna({
    id: 'cervo',
    faunaClass: 'mammal',
    faunaGroup: 'ungulate',
    name_it: 'Cervo nobile',
    name_en: 'Red deer',
    scientific: 'Cervus elaphus',
    altitude: [400, 2500],
    zoneKeys: ['bassaValle', 'valCentrale', 'montAvic', 'granParadiso'],
    wikiIt: 'Cervo',
    wikiEn: 'Red_deer',
    diet_it: 'Vegetazione erbacea, foglie, germogli, cortecce invernali',
    diet_en: 'Herbaceous plants, leaves, shoots and winter bark',
    habitat_it: 'Boschi montani, ecotoni bosco-prato e radure ampie',
    habitat_en: 'Mountain forests, forest-grassland ecotones and broad clearings',
    activity_it: 'Crepuscolare e notturno, con bramito autunnale',
    activity_en: 'Crepuscular and nocturnal, with autumn rut calling',
    status_it: 'Popolazioni in espansione controllata con monitoraggi annuali',
    status_en: 'Populations under controlled expansion with annual monitoring',
    profile: profile(
      {
        overview:
          'Il cervo nobile e il piu grande cervide presente in Valle d Aosta e rappresenta una componente chiave dei boschi montani. La specie influenza la rinnovazione forestale attraverso pressione selettiva su giovani piante e arbusti.',
        identification:
          'Il maschio porta un palco ramificato rinnovato annualmente e presenta corporatura massiccia con collo robusto. La femmina e piu leggera e priva di palco, con profilo generale piu slanciato.',
        ecology:
          'Alterna aree boscate per copertura e pascoli aperti per alimentazione, soprattutto nelle ore crepuscolari. Nel periodo riproduttivo autunnale i maschi diventano territoriali e vocalizzano intensamente.',
        inValle:
          'Le maggiori concentrazioni si osservano nella valle centrale e nei complessi forestali della bassa quota. In inverno molte unita scendono di quota sfruttando versanti meno innevati e margini agricoli.',
      },
      {
        overview:
          'Red deer is the largest cervid in Aosta Valley and a key component of mountain forest ecosystems. The species shapes forest regeneration through selective browsing on young trees and shrubs.',
        identification:
          'Males carry branched antlers renewed each year and show a heavy body with a thick neck. Females are smaller and antlerless, with a generally slimmer outline.',
        ecology:
          'It alternates wooded cover for shelter with open feeding grounds, mainly at twilight. During the autumn rut, males become territorial and produce intense vocal displays.',
        inValle:
          'Highest concentrations occur in the central valley and lower-elevation forest complexes. In winter many groups move downward to less snowy slopes and agricultural edges.',
      }
    ),
  }),
  fauna({
    id: 'capriolo',
    faunaClass: 'mammal',
    faunaGroup: 'ungulate',
    name_it: 'Capriolo',
    name_en: 'Roe deer',
    scientific: 'Capreolus capreolus',
    altitude: [300, 2200],
    zoneKeys: ['bassaValle', 'valCentrale', 'lys', 'montAvic'],
    wikiIt: 'Capriolo',
    wikiEn: 'Roe_deer',
    diet_it: 'Germogli, foglie tenere, forbe e piccoli frutti',
    diet_en: 'Shoots, tender leaves, forbs and small fruits',
    habitat_it: 'Boschi frammentati, margini agricoli e cespuglieti',
    habitat_en: 'Fragmented woods, agricultural edges and shrublands',
    activity_it: 'Crepuscolare con uso di coperture dense diurne',
    activity_en: 'Crepuscular, using dense daytime cover',
    status_it: 'Specie ben distribuita con alta adattabilita paesaggistica',
    status_en: 'Well distributed species with high landscape adaptability',
    profile: profile(
      {
        overview:
          'Il capriolo e un cervide di piccola taglia molto adattabile, diffuso in gran parte della fascia collinare e montana bassa. In ecosistemi mosaicati raggiunge densita elevate grazie alla disponibilita di margini ecotonali.',
        identification:
          'Si riconosce per la sagoma leggera, il rostro corto e la caratteristica macchia caudale chiara. Il maschio ha palchi ridotti con tre punte principali nei soggetti adulti ben sviluppati.',
        ecology:
          'Predilige alimenti ad alto contenuto energetico e seleziona microhabitat ricchi di germogli e forbe. La territorialita dei maschi e marcata in primavera-estate, mentre in inverno aumenta la tolleranza spaziale.',
        inValle:
          'La specie e comune in bassa valle, nei fondovalle aperti e nelle prime quote delle vallate laterali. Le osservazioni sono frequenti all alba e al tramonto presso radure e margini boscati.',
      },
      {
        overview:
          'Roe deer is a small and highly adaptable cervid, widespread across low and mid-elevation belts. In mosaic landscapes it reaches high densities due to abundant ecotonal edges.',
        identification:
          'It is identified by its light build, short muzzle and the characteristic pale rump patch. Males carry relatively small antlers, often with three main tines in well-developed adults.',
        ecology:
          'It selects energy-rich forage and uses microhabitats with abundant shoots and forbs. Male territoriality is strong in spring and summer, while winter brings greater spatial tolerance.',
        inValle:
          'The species is common in the lower valley, open valley floors and lower sectors of side valleys. Sightings are frequent at dawn and dusk near clearings and woodland edges.',
      }
    ),
  }),
  fauna({
    id: 'muflone',
    faunaClass: 'mammal',
    faunaGroup: 'ungulate',
    name_it: 'Muflone',
    name_en: 'Mouflon',
    scientific: 'Ovis aries musimon',
    altitude: [700, 2400],
    zoneKeys: ['valCentrale', 'montAvic', 'valGrisanche'],
    wikiIt: 'Muflone',
    wikiEn: 'Mouflon',
    diet_it: 'Graminacee, piante erbacee, foglie e giovani rami',
    diet_en: 'Grasses, herbaceous plants, leaves and young twigs',
    habitat_it: 'Pendii asciutti, pascoli aperti e boschi radi',
    habitat_en: 'Dry slopes, open pastures and sparse woodland',
    activity_it: 'Diurno con spostamenti stagionali altitudinali',
    activity_en: 'Diurnal with seasonal elevational movements',
    status_it: 'Presenza localizzata, soggetta a gestione faunistica',
    status_en: 'Localized occurrence, under wildlife management',
    profile: profile(
      {
        overview:
          'Il muflone e un ovino selvatico introdotto in varie aree alpine, con nuclei localizzati anche in Valle d Aosta. La sua presenza richiede valutazioni gestionali per l interazione con vegetazione sensibile e ungulati autoctoni.',
        identification:
          'Il maschio adulto presenta corna voluminose ricurve a spirale, mentre la femmina ne e spesso priva o con corna ridotte. Il mantello bruno con sella piu chiara nei maschi invernali facilita il riconoscimento a distanza.',
        ecology:
          'Utilizza pendii aperti e ambienti ecotonali, con dieta prevalentemente graminivora ma opportunista. La struttura sociale e gregaria e varia in base alla stagione riproduttiva e alla disponibilita trofica.',
        inValle:
          'In regione compare in aree circoscritte e con densita inferiori rispetto agli ungulati nativi piu comuni. Le segnalazioni sono concentrate in comprensori collinari montani relativamente asciutti.',
      },
      {
        overview:
          'Mouflon is a wild sheep introduced in several Alpine sectors, with localized nuclei also in Aosta Valley. Its presence requires management assessment due to interactions with sensitive vegetation and native ungulates.',
        identification:
          'Adult males carry large spiral-curved horns, while females are often hornless or have reduced horns. The brown coat with a lighter saddle in winter males helps long-distance identification.',
        ecology:
          'It uses open slopes and ecotonal habitats, with a mainly grass-based but opportunistic diet. Social organization is gregarious and shifts with breeding season and forage availability.',
        inValle:
          'In the region it occurs in limited areas and at lower densities than most native mountain ungulates. Records are concentrated in relatively dry montane hillside sectors.',
      }
    ),
  }),
  fauna({
    id: 'lupo',
    faunaClass: 'mammal',
    faunaGroup: 'carnivore',
    name_it: 'Lupo',
    name_en: 'Wolf',
    scientific: 'Canis lupus',
    altitude: [600, 2800],
    zoneKeys: ['granParadiso', 'valGrisanche', 'valFerret', 'valCentrale'],
    wikiIt: 'Lupo',
    wikiEn: 'Wolf',
    diet_it: 'Ungulati selvatici, piccoli mammiferi e carogne',
    diet_en: 'Wild ungulates, small mammals and carrion',
    habitat_it: 'Foreste montane, valloni remoti e zone aperte di transito',
    habitat_en: 'Mountain forests, remote valleys and open movement corridors',
    activity_it: 'Prevalentemente crepuscolare e notturno',
    activity_en: 'Mainly crepuscular and nocturnal',
    status_it: 'Specie strettamente protetta a livello nazionale e comunitario',
    status_en: 'Strictly protected at national and EU levels',
    profile: profile(
      {
        overview:
          'Il lupo e un predatore apicale tornato stabilmente nelle Alpi occidentali dopo decenni di assenza. In Valle d Aosta utilizza un sistema territoriale ampio con branchi a composizione variabile.',
        identification:
          'La specie mostra corporatura longilinea, coda pendente e mantello grigio-bruno con ampia variabilita individuale. Le impronte sono generalmente allungate e in linea di marcia regolare, utile per distinguere il passaggio da canidi domestici.',
        ecology:
          'La dieta si basa soprattutto su ungulati selvatici e integra risorse opportunistiche in funzione della stagionalita. La riproduzione avviene una volta all anno e il successo dipende da disponibilita trofica e disturbo antropico.',
        inValle:
          'Le evidenze sono piu frequenti nelle vallate laterali boscate e nei corridoi di connessione con regioni limitrofe. Il monitoraggio regionale combina fototrappole, genetica non invasiva e validazione delle segnalazioni.',
      },
      {
        overview:
          'The wolf is an apex predator that has re-established in the western Alps after decades of absence. In Aosta Valley it uses broad territories with packs of variable composition.',
        identification:
          'The species has a long-legged build, a hanging tail and a grey-brown coat with wide individual variation. Tracks are usually elongated and aligned in steady gait, helping separation from domestic canids.',
        ecology:
          'Its diet is primarily based on wild ungulates, with opportunistic resources used according to season. Breeding occurs once per year, and reproductive success depends on prey availability and human disturbance.',
        inValle:
          'Records are more frequent in forested side valleys and in corridors linking neighboring regions. Regional monitoring combines camera traps, non-invasive genetics and report validation.',
      }
    ),
  }),
  fauna({
    id: 'orso',
    faunaClass: 'mammal',
    faunaGroup: 'carnivore',
    name_it: 'Orso bruno',
    name_en: 'Brown bear',
    scientific: 'Ursus arctos',
    altitude: [500, 2600],
    zoneKeys: ['granParadiso', 'valGrisanche', 'valFerret'],
    wikiIt: 'Orso_bruno',
    wikiEn: 'Brown_bear',
    diet_it: 'Onnivoro: vegetali, invertebrati, frutti, carogne',
    diet_en: 'Omnivorous: plants, invertebrates, fruits and carrion',
    habitat_it: 'Complessi forestali estesi con aree tranquille e corridoi',
    habitat_en: 'Large forest complexes with quiet areas and movement corridors',
    activity_it: 'Crepuscolare-notturno, con ibernazione invernale',
    activity_en: 'Crepuscular-nocturnal, with winter denning',
    status_it: 'Presenza occasionale e fortemente protetta',
    status_en: 'Occasional presence and strictly protected',
    profile: profile(
      {
        overview:
          'L orso bruno e un grande carnivoro onnivoro con elevata mobilita e ampi home range individuali. In Valle d Aosta la presenza e sporadica ma ecologicamente rilevante per la connettivita alpina.',
        identification:
          'Ha corporatura massiccia, testa larga e andatura plantigrada facilmente distinguibile su substrati morbidi. Il colore del mantello varia dal bruno scuro al bruno chiaro senza costituire criterio diagnostico univoco.',
        ecology:
          'Sfrutta risorse vegetali stagionali, integra invertebrati e occasionalmente biomassa animale. La sopravvivenza dipende da disponibilita di rifugi tranquilli e dalla riduzione del conflitto con attivita umane.',
        inValle:
          'Le segnalazioni si concentrano in aree montane periferiche con continuita forestale e bassa densita insediativa. Ogni presenza viene seguita con protocolli tecnici dedicati e comunicazione istituzionale.',
      },
      {
        overview:
          'The brown bear is a large omnivorous carnivore with high mobility and broad individual home ranges. In Aosta Valley its occurrence is sporadic but ecologically important for Alpine connectivity.',
        identification:
          'It shows a massive body, broad head and plantigrade gait that is clear on soft substrates. Coat color ranges from dark to light brown and is not a reliable diagnostic feature by itself.',
        ecology:
          'It uses seasonal plant resources, adds invertebrates and occasionally animal biomass. Persistence depends on quiet refuge sites and reduced conflict with human activities.',
        inValle:
          'Records are concentrated in peripheral mountain sectors with continuous forests and low settlement density. Each occurrence is managed through dedicated technical protocols and institutional communication.',
      }
    ),
  }),
  fauna({
    id: 'volpe',
    faunaClass: 'mammal',
    faunaGroup: 'carnivore',
    name_it: 'Volpe rossa',
    name_en: 'Red fox',
    scientific: 'Vulpes vulpes',
    altitude: [300, 3000],
    zoneKeys: ['bassaValle', 'valCentrale', 'montAvic', 'granParadiso', 'valtournenche'],
    wikiIt: 'Volpe',
    wikiEn: 'Red_fox',
    diet_it: 'Onnivora opportunista: roditori, insetti, frutti e carogne',
    diet_en: 'Opportunistic omnivore: rodents, insects, fruits and carrion',
    habitat_it: 'Ambienti molto vari, dal fondovalle ai pascoli alpini',
    habitat_en: 'Very diverse habitats, from valley floor to alpine pastures',
    activity_it: 'Soprattutto notturna, con attivita anche crepuscolare',
    activity_en: 'Mostly nocturnal, with crepuscular activity',
    status_it: 'Specie comune e ampiamente distribuita',
    status_en: 'Common and widely distributed species',
    profile: profile(
      {
        overview:
          'La volpe rossa e il mesocarnivoro piu generalista della regione e occupa un ampio spettro di ambienti. La sua elevata plasticita comportamentale favorisce presenza stabile anche in aree periurbane.',
        identification:
          'Si riconosce per muso appuntito, coda folta con apice chiaro e andatura leggera. La colorazione e variabile, ma la combinazione di proporzioni corporee e portamento resta diagnostica.',
        ecology:
          'Regola la dieta in base alla disponibilita locale e svolge un ruolo importante nel controllo dei piccoli vertebrati. Utilizza tane proprie o adattate e modula l attivita in funzione del disturbo antropico.',
        inValle:
          'E osservabile in tutta la Valle d Aosta, incluse aree agricole, boscate e pascoli montani. La specie mostra buona continuita di popolazione lungo l asse vallivo principale e nelle vallate laterali.',
      },
      {
        overview:
          'The red fox is the most generalist mesocarnivore in the region and occupies a wide range of habitats. Its behavioral plasticity supports stable occurrence even in peri-urban settings.',
        identification:
          'It is recognized by a pointed muzzle, bushy tail with pale tip and a light gait. Coloration is variable, but body proportions and posture remain diagnostically useful.',
        ecology:
          'It adjusts diet to local resource availability and plays an important role in controlling small vertebrates. It uses self-dug or adapted dens and shifts activity according to human disturbance.',
        inValle:
          'It can be observed across Aosta Valley, including agricultural sectors, woodlands and mountain pastures. The species maintains strong population continuity along the main valley axis and side valleys.',
      }
    ),
  }),
  fauna({
    id: 'martora',
    faunaClass: 'mammal',
    faunaGroup: 'carnivore',
    name_it: 'Martora',
    name_en: 'Pine marten',
    scientific: 'Martes martes',
    altitude: [600, 2300],
    zoneKeys: ['montAvic', 'lys', 'valCentrale', 'granParadiso'],
    wikiIt: 'Martora',
    wikiEn: 'Pine_marten',
    diet_it: 'Piccoli mammiferi, uccelli, invertebrati e frutti',
    diet_en: 'Small mammals, birds, invertebrates and fruits',
    habitat_it: 'Boschi maturi con buona continuita arborea',
    habitat_en: 'Mature forests with strong tree continuity',
    activity_it: 'Prevalentemente crepuscolare e notturna',
    activity_en: 'Mainly crepuscular and nocturnal',
    status_it: 'Specie elusiva, localmente regolare in aree boscate idonee',
    status_en: 'Elusive species, locally regular in suitable forest sectors',
    profile: profile(
      {
        overview:
          'La martora e un mustelide forestale specializzato, legato a complessi arborei maturi con struttura verticale articolata. In Valle d Aosta rappresenta un indicatore utile di qualita ecologica dei boschi.',
        identification:
          'Presenta corpo allungato, coda folta e tipica macchia golare giallastra irregolare. La testa e relativamente piccola con orecchie evidenti, utili alla distinzione da altri mustelidi simili.',
        ecology:
          'Ha dieta opportunista ma fortemente orientata a micromammiferi e prede arboricole, con integrazione stagionale di frutti. Usa cavita naturali e alberi vetusti come siti di rifugio e riposo.',
        inValle:
          'Le segnalazioni sono concentrate in vallate con copertura forestale continua e basso disturbo notturno. L osservazione diretta e rara, mentre sono piu frequenti tracce e registrazioni da fototrappola.',
      },
      {
        overview:
          'The pine marten is a specialized forest mustelid tied to mature woodlands with complex vertical structure. In Aosta Valley it is a useful indicator of woodland ecological quality.',
        identification:
          'It has an elongated body, bushy tail and a characteristic irregular yellowish throat patch. The head is relatively small with prominent ears, helping separation from similar mustelids.',
        ecology:
          'Its diet is opportunistic but strongly focused on micromammals and arboreal prey, with seasonal fruit intake. It uses natural cavities and veteran trees for shelter and resting sites.',
        inValle:
          'Records are concentrated in valleys with continuous forest cover and low nocturnal disturbance. Direct observation is rare, while camera-trap detections and signs are more frequent.',
      }
    ),
  }),
  fauna({
    id: 'faina',
    faunaClass: 'mammal',
    faunaGroup: 'carnivore',
    name_it: 'Faina',
    name_en: 'Beech marten',
    scientific: 'Martes foina',
    altitude: [300, 1900],
    zoneKeys: ['bassaValle', 'valCentrale', 'lys'],
    wikiIt: 'Faina',
    wikiEn: 'Beech_marten',
    diet_it: 'Piccoli vertebrati, frutta, insetti e risorse opportunistiche',
    diet_en: 'Small vertebrates, fruits, insects and opportunistic resources',
    habitat_it: 'Mosaico rurale, margini di abitato e boschi aperti',
    habitat_en: 'Rural mosaic, settlement edges and open woodlands',
    activity_it: 'Notturna con buona adattabilita ai contesti antropizzati',
    activity_en: 'Nocturnal, with strong adaptation to humanized settings',
    status_it: 'Comune ma poco osservata per abitudini elusive',
    status_en: 'Common but rarely seen due to elusive behavior',
    profile: profile(
      {
        overview:
          'La faina e un mustelide generalista capace di colonizzare ambienti naturali e periurbani con elevata efficienza. In regione appare piu sinantropica della martora e sfrutta strutture rurali come rifugio.',
        identification:
          'Si distingue per la macchia golare bianca estesa e spesso biforcata che raggiunge il petto. Il corpo e snello con coda folta, ma il movimento e generalmente piu terrestre rispetto alla martora.',
        ecology:
          'La dieta e flessibile e varia in base alla stagione, includendo prede piccole e risorse vegetali. La specie e territoriale e utilizza reti di rifugi distribuiti in un raggio relativamente contenuto.',
        inValle:
          'Le osservazioni sono frequenti in fondovalle e zone collinari con presenza di edifici sparsi. Nelle vallate interne compare soprattutto nelle porzioni basse e in prossimita di ecotoni.',
      },
      {
        overview:
          'The beech marten is a generalist mustelid able to occupy natural and peri-urban habitats efficiently. In the region it is more synanthropic than pine marten and often uses rural structures as shelter.',
        identification:
          'It is distinguished by a broad white throat patch, often split, extending onto the chest. The body is slender with a bushy tail, but movement is usually more ground-based than in pine marten.',
        ecology:
          'Diet is flexible and seasonally variable, including small prey and plant resources. The species is territorial and uses networks of shelters within relatively compact home ranges.',
        inValle:
          'Records are common in valley bottoms and hillside sectors with scattered buildings. In inner valleys it occurs mainly in lower portions near ecotonal habitats.',
      }
    ),
  }),
  fauna({
    id: 'ghiro',
    faunaClass: 'mammal',
    faunaGroup: 'carnivore',
    name_it: 'Ghiro',
    name_en: 'Edible dormouse',
    scientific: 'Glis glis',
    altitude: [300, 1700],
    zoneKeys: ['bassaValle', 'valCentrale'],
    wikiIt: 'Ghiro',
    wikiEn: 'Edible_dormouse',
    diet_it: 'Semi, frutti, gemme, occasionalmente invertebrati',
    diet_en: 'Seeds, fruits, buds and occasional invertebrates',
    habitat_it: 'Boschi caducifogli maturi, castagneti e cavita arboree',
    habitat_en: 'Mature deciduous forests, chestnut stands and tree cavities',
    activity_it: 'Notturno con lunga ibernazione invernale',
    activity_en: 'Nocturnal, with long winter hibernation',
    status_it: 'Popolazioni locali stabili nelle fasce idonee',
    status_en: 'Local populations stable in suitable belts',
    profile: profile(
      {
        overview:
          'Il ghiro e un roditore arboricolo tipico dei boschi maturi con abbondanza di cavita naturali. La specie ha fenologia particolare, con fase attiva breve e ibernazione prolungata.',
        identification:
          'Presenta occhi grandi, coda lunga e folta e livrea grigiastra uniforme con ventre chiaro. La locomozione e agile sui rami e il richiamo notturno puo risultare sorprendentemente sonoro.',
        ecology:
          'Sfrutta risorse energetiche ad alta resa come semi e frutti forestali, accumulando riserve prima dell inverno. L uso di rifugi multipli aumenta la sopravvivenza in ambienti con forte variabilita stagionale.',
        inValle:
          'In Valle d Aosta e piu frequente nei settori termofili di bassa e media quota con castagneti ben strutturati. Le presenze sono spesso rilevate indirettamente tramite nidi, rosure e segni di alimentazione.',
      },
      {
        overview:
          'The edible dormouse is an arboreal rodent typical of mature forests rich in natural cavities. The species has a distinctive phenology, with a short active season and prolonged hibernation.',
        identification:
          'It has large eyes, a long bushy tail and a generally grey coat with pale underparts. Movement is agile in the canopy, and its nocturnal calls can be unexpectedly loud.',
        ecology:
          'It relies on high-energy foods such as seeds and forest fruits, building reserves before winter. The use of multiple shelters increases survival in highly seasonal environments.',
        inValle:
          'In Aosta Valley it is more frequent in warm lower and mid-elevation sectors with well-structured chestnut woodland. Presence is often detected indirectly through nests, gnaw marks and feeding signs.',
      }
    ),
  }),
  fauna({
    id: 'donnola',
    faunaClass: 'mammal',
    faunaGroup: 'carnivore',
    name_it: 'Donnola',
    name_en: 'Least weasel',
    scientific: 'Mustela nivalis',
    altitude: [500, 2800],
    zoneKeys: ['valCentrale', 'granParadiso', 'valpelline', 'valtournenche'],
    wikiIt: 'Donnola',
    wikiEn: 'Least_weasel',
    diet_it: 'Micromammiferi, soprattutto arvicole e topi',
    diet_en: 'Micromammals, mainly voles and mice',
    habitat_it: 'Prati montani, pietraie, margini agricoli e boschi aperti',
    habitat_en: 'Mountain meadows, screes, farmland edges and open woods',
    activity_it: 'Polifasica con attivita sia diurna sia notturna',
    activity_en: 'Polyphasic, active both day and night',
    status_it: 'Diffusa ma raramente osservata direttamente',
    status_en: 'Widespread but rarely seen directly',
    profile: profile(
      {
        overview:
          'La donnola e il piu piccolo carnivoro europeo e svolge un ruolo importante nel controllo dei roditori. In ambienti alpini mostra forte dinamismo spaziale e risposta rapida alla disponibilita di prede.',
        identification:
          'Il corpo e molto allungato con arti corti e coda breve, caratteri utili a differenziarla da ermellino e altri mustelidi. Il contrasto tra dorso bruno e ventre chiaro e netto nella maggior parte degli individui.',
        ecology:
          'Preda soprattutto arvicole in gallerie e microambienti erbosi, con elevata frequenza alimentare giornaliera. Utilizza rifugi temporanei in cavita naturali, muretti e ammassi litici.',
        inValle:
          'La specie e presente in varie vallate ma passa spesso inosservata per dimensioni ridotte e comportamento discreto. Le conferme aumentano con monitoraggi mirati in aree prative e di margine.',
      },
      {
        overview:
          'The least weasel is Europe s smallest carnivore and plays a major role in rodent control. In Alpine environments it shows strong spatial dynamism and rapid response to prey availability.',
        identification:
          'The body is very elongated with short limbs and a short tail, useful features to separate it from stoat and other mustelids. Contrast between brown upperparts and pale underparts is usually clear.',
        ecology:
          'It mainly hunts voles in tunnels and grassy microhabitats, with high daily feeding frequency. It uses temporary shelters in natural cavities, stone walls and rocky accumulations.',
        inValle:
          'The species is present in several valleys but often goes unnoticed due to its small size and discreet behavior. Confirmed records increase with targeted monitoring in grassland and edge habitats.',
      }
    ),
  }),
  fauna({
    id: 'lontra',
    faunaClass: 'mammal',
    faunaGroup: 'carnivore',
    name_it: 'Lontra eurasiatica',
    name_en: 'Eurasian otter',
    scientific: 'Lutra lutra',
    altitude: [300, 1500],
    zoneKeys: ['bassaValle', 'valCentrale'],
    wikiIt: 'Lontra_eurasiatica',
    wikiEn: 'Eurasian_otter',
    diet_it: 'Pesci, anfibi, crostacei e macroinvertebrati acquatici',
    diet_en: 'Fish, amphibians, crustaceans and aquatic macroinvertebrates',
    habitat_it: 'Corsi d acqua con sponde naturali e buona qualita ecologica',
    habitat_en: 'Watercourses with natural banks and good ecological quality',
    activity_it: 'Crepuscolare-notturna con ampia mobilita lineare',
    activity_en: 'Crepuscular-nocturnal with broad linear movements',
    status_it: 'Specie rara e prioritaria, presenza da verificare localmente',
    status_en: 'Rare priority species, local occurrence requiring verification',
    profile: profile(
      {
        overview:
          'La lontra eurasiatica e un mustelide semiacquatico sensibile alla frammentazione fluviale e all inquinamento. In contesto alpino la presenza e generalmente discontinua e legata a tratti idonei dei corsi d acqua.',
        identification:
          'Ha corpo allungato idrodinamico, coda muscolosa e pelliccia densa con sottopelo isolante. Le impronte mostrano dita palmate e sono associate a tipici segni di marcatura lungo le rive.',
        ecology:
          'Preda prevalentemente fauna acquatica e richiede elevata disponibilita trofica durante tutto l anno. Utilizza rifugi in tane di sponda, radici o cavita naturali protette da disturbo diretto.',
        inValle:
          'In Valle d Aosta le segnalazioni sono storicamente limitate e richiedono validazione tecnica rigorosa. La conservazione dipende dal ripristino di continuita ecologica e qualita idromorfologica dei torrenti.',
      },
      {
        overview:
          'The Eurasian otter is a semi-aquatic mustelid sensitive to river fragmentation and pollution. In Alpine contexts, occurrence is generally discontinuous and tied to suitable river stretches.',
        identification:
          'It has a streamlined elongated body, muscular tail and dense fur with insulating undercoat. Tracks show webbed toes and are often associated with characteristic marking signs along banks.',
        ecology:
          'It feeds mainly on aquatic fauna and requires consistent trophic availability year-round. Shelters are used in riverbank dens, root systems or protected natural cavities.',
        inValle:
          'In Aosta Valley records are historically limited and require strict technical validation. Conservation depends on restoring ecological continuity and hydromorphological quality of streams.',
      }
    ),
  }),
  fauna({
    id: 'gatto-selvatico',
    faunaClass: 'mammal',
    faunaGroup: 'carnivore',
    name_it: 'Gatto selvatico europeo',
    name_en: 'European wildcat',
    scientific: 'Felis silvestris silvestris',
    altitude: [400, 1900],
    zoneKeys: ['bassaValle', 'valCentrale', 'montAvic'],
    wikiIt: 'Felis_silvestris_silvestris',
    wikiEn: 'European_wildcat',
    diet_it: 'Micromammiferi, uccelli terrestri e piccoli vertebrati',
    diet_en: 'Micromammals, ground birds and small vertebrates',
    habitat_it: 'Boschi misti con radure e basso disturbo antropico',
    habitat_en: 'Mixed forests with clearings and low human disturbance',
    activity_it: 'Crepuscolare-notturna con comportamento territoriale',
    activity_en: 'Crepuscular-nocturnal with territorial behavior',
    status_it: 'Specie rara, soggetta a rischio di ibridazione',
    status_en: 'Rare species, exposed to hybridization risk',
    profile: profile(
      {
        overview:
          'Il gatto selvatico europeo e un felide autoctono di elevato interesse conservazionistico nelle Alpi. In Valle d Aosta la sua presenza e considerata localizzata e richiede monitoraggi genetici dedicati.',
        identification:
          'Si distingue dal gatto domestico per corporatura piu robusta, coda tozza ad anelli netti e punta nera arrotondata. Il mantello presenta pattern tigrato sobrio e linea dorsale poco continua sulla coda.',
        ecology:
          'E un predatore specializzato su piccoli mammiferi in ambienti forestali eterogenei con rifugi naturali. Evita aree ad alta frequentazione umana e dipende dalla continuita degli habitat boscati.',
        inValle:
          'Le evidenze sono frammentarie e concentrate nei settori collinari e montani inferiori con copertura forestale. La priorita gestionale include la riduzione dell ibridazione con gatti liberi e il controllo del disturbo.',
      },
      {
        overview:
          'The European wildcat is a native felid of high conservation concern in the Alps. In Aosta Valley its occurrence is considered localized and requires dedicated genetic monitoring.',
        identification:
          'It differs from domestic cats by a stockier build, thick ringed tail and rounded black tail tip. Coat pattern is subtly striped, with a dorsal line that does not continue clearly along the tail.',
        ecology:
          'It is a predator specialized on small mammals in heterogeneous forest habitats with natural refuges. It avoids heavily disturbed areas and depends on woodland continuity.',
        inValle:
          'Evidence is fragmentary and concentrated in lower montane and hilly forest sectors. Management priorities include limiting hybridization with free-ranging domestic cats and reducing disturbance.',
      }
    ),
  }),
  fauna({
    id: 'tasso',
    faunaClass: 'mammal',
    faunaGroup: 'carnivore',
    name_it: 'Tasso europeo',
    name_en: 'European badger',
    scientific: 'Meles meles',
    altitude: [300, 1800],
    zoneKeys: ['bassaValle', 'valCentrale', 'lys'],
    wikiIt: 'Meles_meles',
    wikiEn: 'European_badger',
    diet_it: 'Lombrichi, invertebrati, frutti e piccoli vertebrati',
    diet_en: 'Earthworms, invertebrates, fruits and small vertebrates',
    habitat_it: 'Boschi, siepi e mosaici agricoli con suoli scavabili',
    habitat_en: 'Woodlands, hedgerows and farmland mosaics with diggable soils',
    activity_it: 'Notturna con vita sociale in clan familiari',
    activity_en: 'Nocturnal with social life in family clans',
    status_it: 'Specie relativamente comune ma poco visibile',
    status_en: 'Relatively common yet rarely visible species',
    profile: profile(
      {
        overview:
          'Il tasso europeo e un mustelide fossorio con organizzazione sociale complessa e uso pluriennale delle tane. In Valle d Aosta contribuisce alla dinamica del suolo e alla dispersione di semi tramite dieta onnivora.',
        identification:
          'Si riconosce facilmente per corpo tozzo, arti robusti da scavo e tipiche strie bianche e nere sul capo. L andatura e lenta ma efficace su lunghe distanze notturne tra tana e aree trofiche.',
        ecology:
          'La dieta varia stagionalmente, con forte peso di invertebrati del suolo e integrazione di risorse vegetali. Le tane principali possono essere molto articolate e mantenute da piu generazioni.',
        inValle:
          'La specie e diffusa nei settori di bassa e media quota con copertura arbustiva e suoli adatti allo scavo. Le evidenze consistono soprattutto in impronte, latrine e accessi di tana attivi.',
      },
      {
        overview:
          'The European badger is a fossorial mustelid with complex social organization and long-term use of setts. In Aosta Valley it contributes to soil dynamics and seed dispersal through its omnivorous diet.',
        identification:
          'It is readily identified by a stocky body, strong digging limbs and the characteristic black-and-white facial stripes. Movement is slow but efficient over long nocturnal routes between sett and feeding grounds.',
        ecology:
          'Diet changes seasonally, often dominated by soil invertebrates with additional plant resources. Main setts can become highly structured and persist across multiple generations.',
        inValle:
          'The species is distributed in lower and mid-elevation sectors with shrub cover and suitable digging soils. Most records are indirect, including tracks, latrines and active sett entrances.',
      }
    ),
  }),
  fauna({
    id: 'istricio',
    faunaClass: 'mammal',
    faunaGroup: 'carnivore',
    name_it: 'Istrice',
    name_en: 'Crested porcupine',
    scientific: 'Hystrix cristata',
    altitude: [250, 1400],
    zoneKeys: ['bassaValle', 'valCentrale'],
    wikiIt: 'Istrice',
    wikiEn: 'Crested_porcupine',
    diet_it: 'Radici, tuberi, bulbi, cortecce e vegetali coltivati',
    diet_en: 'Roots, tubers, bulbs, bark and cultivated vegetation',
    habitat_it: 'Ambienti termofili di fondovalle con copertura arbustiva',
    habitat_en: 'Thermophilous valley-floor habitats with shrub cover',
    activity_it: 'Notturna, con rifugio diurno in tane o cavita',
    activity_en: 'Nocturnal, sheltering by day in burrows or cavities',
    status_it: 'Specie in espansione verso nord, localmente presente',
    status_en: 'Northward expanding species, locally present',
    profile: profile(
      {
        overview:
          'L istrice e il roditore piu grande d Italia e mostra una recente espansione areale verso settori alpini interni. In Valle d Aosta la presenza e soprattutto legata ai comparti piu miti di bassa quota.',
        identification:
          'La specie e inconfondibile per i lunghi aculei dorsali bianchi e neri e per la corporatura massiccia. Durante situazioni di allerta produce segnali sonori caratteristici tramite vibrazione degli aculei cavi.',
        ecology:
          'Si alimenta di parti ipogee e ipogee delle piante, con possibili interazioni con coltivi e orti. Utilizza tane proprie o preesistenti e adotta percorsi abituali tra rifugio e siti alimentari.',
        inValle:
          'Le segnalazioni sono concentrate in aree termofile della bassa valle con bassa copertura nevosa invernale. La specie resta localizzata e monitorata per valutarne stabilita e impatti ecologici.',
      },
      {
        overview:
          'The crested porcupine is Italy s largest rodent and has recently expanded northward into inner Alpine sectors. In Aosta Valley it is mostly associated with milder low-elevation compartments.',
        identification:
          'It is unmistakable due to long black-and-white dorsal quills and a heavy body shape. When alarmed, it can produce characteristic sounds by vibrating hollow quills.',
        ecology:
          'It feeds on belowground and aboveground plant parts, with potential interaction with crops and gardens. It uses self-dug or pre-existing burrows and follows habitual routes between shelter and feeding areas.',
        inValle:
          'Records are concentrated in thermophilous lower-valley areas with limited winter snow cover. The species remains localized and is monitored to assess stability and ecological effects.',
      }
    ),
  }),
  fauna({
    id: 'marmotta',
    faunaClass: 'mammal',
    faunaGroup: 'rodent',
    name_it: 'Marmotta alpina',
    name_en: 'Alpine marmot',
    scientific: 'Marmota marmota',
    altitude: [1400, 3100],
    zoneKeys: ['granParadiso', 'valpelline', 'valtournenche', 'valFerret'],
    wikiIt: 'Marmotta',
    wikiEn: 'Alpine_marmot',
    diet_it: 'Erbe, forbe, fiori alpini e parti verdi tenere',
    diet_en: 'Grasses, forbs, alpine flowers and tender green parts',
    habitat_it: 'Praterie alpine con suoli profondi idonei allo scavo',
    habitat_en: 'Alpine grasslands with deep soils suitable for burrowing',
    activity_it: 'Diurna con ibernazione invernale prolungata',
    activity_en: 'Diurnal with prolonged winter hibernation',
    status_it: 'Specie diffusa nelle quote superiori della regione',
    status_en: 'Widespread species in the upper elevational belt',
    profile: profile(
      {
        overview:
          'La marmotta alpina e un roditore sociale tipico dei pascoli d alta quota e dei pianori glaciali. Le colonie strutturate contribuiscono alla biodiversita locale creando microhabitat attraverso l attivita di scavo.',
        identification:
          'Presenta corpo robusto, coda corta e mantello bruno-grigiastro con testa piu scura. Il fischio d allarme acuto e un elemento diagnostico importante durante le osservazioni sul campo.',
        ecology:
          'Accumula riserve energetiche estive fondamentali per superare lunghi mesi di ibernazione in tana comune. La specie regola vigilanza e foraggiamento in modo cooperativo all interno del gruppo familiare.',
        inValle:
          'In Valle d Aosta e comune sopra il limite del bosco in numerose vallate laterali. Le densita maggiori si osservano in praterie ben esposte e relativamente poco disturbate nel periodo riproduttivo.',
      },
      {
        overview:
          'The Alpine marmot is a social rodent typical of high-elevation pastures and glacial plateaus. Structured colonies enhance local biodiversity by creating microhabitats through burrowing.',
        identification:
          'It has a robust body, short tail and brown-grey coat with a darker head. Its sharp alarm whistle is a key diagnostic cue during field surveys.',
        ecology:
          'It builds summer energy reserves essential for surviving long hibernation in communal burrows. The species coordinates vigilance and foraging cooperatively within family groups.',
        inValle:
          'In Aosta Valley it is common above the treeline in many side valleys. Highest densities occur in well-exposed grasslands with limited disturbance during breeding season.',
      }
    ),
  }),
  fauna({
    id: 'scoiattolo',
    faunaClass: 'mammal',
    faunaGroup: 'rodent',
    name_it: 'Scoiattolo rosso',
    name_en: 'Red squirrel',
    scientific: 'Sciurus vulgaris',
    altitude: [400, 2300],
    zoneKeys: ['bassaValle', 'valCentrale', 'lys', 'montAvic'],
    wikiIt: 'Scoiattolo_rosso_comune',
    wikiEn: 'Red_squirrel',
    diet_it: 'Semi di conifere, noci, germogli, funghi e frutti',
    diet_en: 'Conifer seeds, nuts, shoots, fungi and fruits',
    habitat_it: 'Boschi di conifere e misti con copertura continua',
    habitat_en: 'Conifer and mixed forests with continuous canopy',
    activity_it: 'Diurna con intensa attivita in autunno',
    activity_en: 'Diurnal with intense activity in autumn',
    status_it: 'Comune e stabile in gran parte dei complessi forestali',
    status_en: 'Common and stable across most forest complexes',
    profile: profile(
      {
        overview:
          'Lo scoiattolo rosso e un roditore arboricolo fondamentale per i processi di dispersione dei semi forestali. In ambiente alpino contribuisce al rinnovamento naturale di conifere e latifoglie.',
        identification:
          'Si riconosce per la coda lunga e folta, le orecchie con ciuffi invernali e il corpo agile. La colorazione puo variare dal rosso al bruno scuro, mantenendo ventre piu chiaro.',
        ecology:
          'Accumula risorse in cache disperse, alcune delle quali non recuperate e utili alla germinazione. La specie adatta i ritmi giornalieri alla pressione predatoria e alla disponibilita stagionale di semi.',
        inValle:
          'E ben rappresentato nei boschi della valle centrale e nelle vallate laterali con copertura arborea continua. In annate con buona fruttificazione le osservazioni aumentano sensibilmente lungo i sentieri forestali.',
      },
      {
        overview:
          'The red squirrel is an arboreal rodent essential to forest seed dispersal processes. In Alpine settings it supports natural regeneration of both conifers and broadleaves.',
        identification:
          'It is recognized by a long bushy tail, ear tufts in winter and agile body shape. Coat color can range from red to dark brown, with consistently paler underparts.',
        ecology:
          'It stores food in scattered caches, some of which are not retrieved and contribute to germination. The species adjusts daily rhythms to predation pressure and seasonal seed supply.',
        inValle:
          'It is well represented in central-valley forests and side valleys with continuous tree cover. In mast years, observations increase markedly along forest trails.',
      }
    ),
  }),
  fauna({
    id: 'lepre-alpina',
    faunaClass: 'mammal',
    faunaGroup: 'rodent',
    name_it: 'Lepre variabile',
    name_en: 'Mountain hare',
    scientific: 'Lepus timidus',
    altitude: [1300, 3200],
    zoneKeys: ['valpelline', 'valtournenche', 'granParadiso', 'valFerret'],
    wikiIt: 'Lepre_alpina',
    wikiEn: 'Mountain_hare',
    diet_it: 'Erbe alpine, arbusti nani, gemme e cortecce',
    diet_en: 'Alpine herbs, dwarf shrubs, buds and bark',
    habitat_it: 'Brughiere subalpine, pascoli alti e margini nivali',
    habitat_en: 'Subalpine heaths, high pastures and subnival margins',
    activity_it: 'Crepuscolare-notturna con soste diurne in copertura',
    activity_en: 'Crepuscular-nocturnal, resting by day in cover',
    status_it: 'Specie montana sensibile al cambiamento climatico',
    status_en: 'Mountain species sensitive to climate change',
    profile: profile(
      {
        overview:
          'La lepre variabile e un lagomorfo di alta quota adattato a condizioni nivali prolungate. In Valle d Aosta rappresenta una componente faunistica tipica degli ambienti sopra il limite forestale.',
        identification:
          'Il mantello cambia stagionalmente da bruno estivo a bianco invernale, con persistenza di estremita auricolari scure. Le zampe posteriori larghe migliorano la locomozione su neve e substrati instabili.',
        ecology:
          'Seleziona habitat aperti con mosaici di erbe e arbusti bassi, evitando aree eccessivamente disturbate. La disponibilita di copertura nevosa influisce su mimetismo, predazione e successo riproduttivo.',
        inValle:
          'Le presenze si concentrano nelle vallate interne alte con pascoli estesi e brughiere subalpine. Il monitoraggio e prioritario nelle aree dove la riduzione della neve modifica la fenologia del cambio mantello.',
      },
      {
        overview:
          'The mountain hare is a high-elevation lagomorph adapted to prolonged snow conditions. In Aosta Valley it is a characteristic faunal component above the forest line.',
        identification:
          'Coat changes seasonally from summer brown to winter white, with dark ear tips often retained. Broad hind feet improve movement on snow and unstable substrates.',
        ecology:
          'It selects open habitats with grass-shrub mosaics and avoids heavily disturbed sectors. Snow-cover availability affects camouflage, predation risk and reproductive success.',
        inValle:
          'Records are concentrated in high inner valleys with extensive pastures and subalpine heaths. Monitoring is a priority where reduced snow cover alters coat-change phenology.',
      }
    ),
  }),
  fauna({
    id: 'aquila-reale',
    faunaClass: 'bird',
    faunaGroup: 'raptor',
    name_it: 'Aquila reale',
    name_en: 'Golden eagle',
    scientific: 'Aquila chrysaetos',
    altitude: [1000, 3800],
    zoneKeys: ['granParadiso', 'valpelline', 'monteBianco', 'valtournenche'],
    wikiIt: 'Aquila_reale',
    wikiEn: 'Golden_eagle',
    diet_it: 'Mammiferi di media taglia, uccelli e carogne',
    diet_en: 'Medium-sized mammals, birds and carrion',
    habitat_it: 'Pareti rocciose per nidificazione e ampi territori aperti',
    habitat_en: 'Rock cliffs for nesting and broad open hunting ranges',
    activity_it: 'Diurna con uso esteso di correnti ascensionali',
    activity_en: 'Diurnal, making broad use of thermal updrafts',
    status_it: 'Specie protetta con coppie territoriali riproduttive',
    status_en: 'Protected species with established breeding territories',
    profile: profile(
      {
        overview:
          'L aquila reale e il principale rapace diurno alpino e occupa grandi territori montani poco frammentati. In Valle d Aosta mantiene una presenza regolare in diversi comprensori adatti alla nidificazione.',
        identification:
          'Si distingue per apertura alare ampia, ali relativamente strette e coda lunga con profilo potente in volo. Gli adulti mostrano colorazione bruno scura uniforme con nuca dorata ben visibile in buona luce.',
        ecology:
          'Caccia in ambienti aperti sfruttando termiche e vento di pendio per ridurre il costo energetico del volo. Il successo riproduttivo dipende dalla disponibilita trofica locale e dalla limitazione del disturbo vicino al nido.',
        inValle:
          'Le coppie territoriali si distribuiscono tra massicci interni, vallate laterali e principali sistemi rupestri. Le osservazioni migliori avvengono in ore centrali con condizioni meteo favorevoli al volo planato.',
      },
      {
        overview:
          'The golden eagle is the leading Alpine diurnal raptor and occupies large, weakly fragmented mountain territories. In Aosta Valley it maintains regular presence across several nesting-suitable sectors.',
        identification:
          'It is recognized by broad wingspan, relatively narrow wings and a long tail with powerful flight profile. Adults show mostly dark-brown plumage with a visible golden nape in good light.',
        ecology:
          'It hunts in open habitats using thermals and slope winds to reduce flight energy costs. Breeding success depends on local prey availability and low disturbance near nest sites.',
        inValle:
          'Territorial pairs are distributed across inner massifs, side valleys and major cliff systems. Best observations occur during central daytime hours under soaring-friendly weather.',
      }
    ),
  }),
  fauna({
    id: 'gipeto',
    faunaClass: 'bird',
    faunaGroup: 'raptor',
    name_it: 'Gipeto',
    name_en: 'Bearded vulture',
    scientific: 'Gypaetus barbatus',
    altitude: [1400, 4200],
    zoneKeys: ['granParadiso', 'valpelline', 'valFerret', 'monteBianco'],
    wikiIt: 'Gipeto',
    wikiEn: 'Bearded_vulture',
    diet_it: 'Prevalentemente ossa e resti ossei di ungulati',
    diet_en: 'Mainly bones and skeletal remains of ungulates',
    habitat_it: 'Alta montagna con grandi pareti e valloni remoti',
    habitat_en: 'High mountains with large cliffs and remote valleys',
    activity_it: 'Diurna con lunghi spostamenti di ricerca trofica',
    activity_en: 'Diurnal, with long-distance foraging movements',
    status_it: 'Specie prioritaria in ripresa grazie a programmi conservativi',
    status_en: 'Priority species recovering through conservation programs',
    profile: profile(
      {
        overview:
          'Il gipeto e un avvoltoio specializzato ossofago, rarissimo in Europa fino a recenti programmi di reintroduzione. In Valle d Aosta la specie e tornata a nidificare in habitat rupestri idonei di alta quota.',
        identification:
          'Mostra ali lunghe e strette, coda cuneiforme e silhouette inconfondibile durante il volo planato. Gli adulti hanno ventre chiaro con tonalita ferruginose e mascherina facciale scura.',
        ecology:
          'Si nutre soprattutto di frammenti ossei ottenuti anche tramite caduta su rocce per romperli. L elevata longevita e la maturita sessuale tardiva rendono cruciale la sopravvivenza degli adulti territoriali.',
        inValle:
          'Le osservazioni avvengono soprattutto in settori d alta montagna con ridotto disturbo antropico in periodo riproduttivo. La conservazione regionale beneficia della rete alpina transfrontaliera di monitoraggio.',
      },
      {
        overview:
          'The bearded vulture is a bone-specialist scavenger that became extremely rare in Europe before reintroduction programs. In Aosta Valley it has returned to breeding in suitable high-elevation cliff habitat.',
        identification:
          'It shows long narrow wings, wedge-shaped tail and an unmistakable soaring silhouette. Adults have pale underparts with rusty tones and a dark facial mask.',
        ecology:
          'It feeds mainly on bone fragments, sometimes dropping bones onto rocks to break them. High longevity and late sexual maturity make adult survival critical for population stability.',
        inValle:
          'Sightings occur mainly in high mountain sectors with low breeding-season disturbance. Regional conservation benefits from transboundary Alpine monitoring networks.',
      }
    ),
  }),
  fauna({
    id: 'gufo-reale',
    faunaClass: 'bird',
    faunaGroup: 'raptor',
    name_it: 'Gufo reale',
    name_en: 'Eurasian eagle-owl',
    scientific: 'Bubo bubo',
    altitude: [400, 2400],
    zoneKeys: ['valCentrale', 'bassaValle', 'granParadiso', 'valtournenche'],
    wikiIt: 'Gufo_reale',
    wikiEn: 'Eurasian_eagle-owl',
    diet_it: 'Mammiferi medi, uccelli e occasionalmente rettili',
    diet_en: 'Medium mammals, birds and occasional reptiles',
    habitat_it: 'Pareti rocciose con aree aperte trofiche circostanti',
    habitat_en: 'Rock cliffs with surrounding open foraging grounds',
    activity_it: 'Notturna con vocalizzazioni territoriali stagionali',
    activity_en: 'Nocturnal with seasonal territorial vocalizations',
    status_it: 'Specie protetta con popolazioni localmente discontinue',
    status_en: 'Protected species with locally discontinuous populations',
    profile: profile(
      {
        overview:
          'Il gufo reale e il piu grande strigiforme europeo e occupa territori ampi con siti rupestri adatti alla nidificazione. In Valle d Aosta e presente con nuclei locali dove il disturbo notturno resta contenuto.',
        identification:
          'Si riconosce per dimensioni imponenti, ciuffi auricolari evidenti e occhi arancio intenso. In volo appare massiccio con battito profondo e traiettoria diretta tra punti di caccia.',
        ecology:
          'Preda un ampio spettro di vertebrati, adattando la dieta alla disponibilita locale e stagionale. La specie e sensibile al disturbo nelle fasi riproduttive e alla collisione con infrastrutture lineari.',
        inValle:
          'Le segnalazioni sono concentrate lungo falesie e versanti rocciosi prossimi a zone aperte di alimentazione. Il monitoraggio acustico notturno resta uno strumento chiave per valutare la presenza territoriale.',
      },
      {
        overview:
          'The Eurasian eagle-owl is Europe s largest owl and occupies large territories with suitable cliff nesting sites. In Aosta Valley it occurs in local nuclei where nocturnal disturbance remains limited.',
        identification:
          'It is recognized by very large size, prominent ear tufts and bright orange eyes. In flight it appears heavy with deep wingbeats and direct commuting routes between hunting areas.',
        ecology:
          'It preys on a wide range of vertebrates, adjusting diet to local and seasonal availability. The species is sensitive to breeding disturbance and collisions with linear infrastructure.',
        inValle:
          'Records are concentrated near cliffs and rocky slopes close to open feeding grounds. Night-time acoustic monitoring remains a key tool to assess territorial occupancy.',
      }
    ),
  }),
  fauna({
    id: 'poiana',
    faunaClass: 'bird',
    faunaGroup: 'raptor',
    name_it: 'Poiana comune',
    name_en: 'Common buzzard',
    scientific: 'Buteo buteo',
    altitude: [300, 2100],
    zoneKeys: ['bassaValle', 'valCentrale', 'lys', 'montAvic'],
    wikiIt: 'Poiana',
    wikiEn: 'Common_buzzard',
    diet_it: 'Micromammiferi, rettili, invertebrati e carogne',
    diet_en: 'Micromammals, reptiles, invertebrates and carrion',
    habitat_it: 'Mosaici agro-forestali con punti di osservazione elevati',
    habitat_en: 'Agro-forest mosaics with elevated lookout points',
    activity_it: 'Diurna con volo planato frequente',
    activity_en: 'Diurnal with frequent soaring flight',
    status_it: 'Specie comune e ben distribuita',
    status_en: 'Common and well distributed species',
    profile: profile(
      {
        overview:
          'La poiana comune e un rapace di medie dimensioni molto adattabile ai paesaggi aperti e semiaperti. In Valle d Aosta rappresenta una presenza regolare in fondovalle, versanti boscati e zone agricole.',
        identification:
          'Mostra forte variabilita cromatica, ma silhouette compatta con ali ampie e coda relativamente corta resta tipica. In volo planato mantiene ali leggermente sollevate a V poco accentuata.',
        ecology:
          'Caccia da posatoi o in ricerca attiva a bassa quota, concentrandosi su prede facilmente accessibili. La dieta opportunista favorisce resilienza in ambienti con elevata variabilita stagionale.',
        inValle:
          'Le osservazioni sono frequenti lungo la valle centrale e nelle conche laterali a media quota. Nidifica in boschi maturi prossimi a superfici aperte utili all alimentazione.',
      },
      {
        overview:
          'The common buzzard is a medium-sized raptor highly adaptable to open and semi-open landscapes. In Aosta Valley it is a regular presence in valley floors, wooded slopes and farmland.',
        identification:
          'It shows strong plumage variability, but its compact silhouette with broad wings and relatively short tail is characteristic. During soaring, wings are often held in a shallow V.',
        ecology:
          'It hunts from perches or by active low-level searching, focusing on accessible prey. Opportunistic diet supports resilience in strongly seasonal environments.',
        inValle:
          'Sightings are frequent along the central valley and side basins at mid elevation. It nests in mature woodland close to open feeding surfaces.',
      }
    ),
  }),
  fauna({
    id: 'falco-pellegrino',
    faunaClass: 'bird',
    faunaGroup: 'raptor',
    name_it: 'Falco pellegrino',
    name_en: 'Peregrine falcon',
    scientific: 'Falco peregrinus',
    altitude: [400, 3000],
    zoneKeys: ['valCentrale', 'valFerret', 'monteBianco', 'valtournenche'],
    wikiIt: 'Falco_pellegrino',
    wikiEn: 'Peregrine_falcon',
    diet_it: 'Uccelli catturati in volo, da passeriformi a columbidi',
    diet_en: 'Birds captured in flight, from passerines to pigeons',
    habitat_it: 'Falesie e pareti con ampio spazio aereo aperto',
    habitat_en: 'Cliffs and escarpments with broad open airspace',
    activity_it: 'Diurna con alte prestazioni di volo in caccia',
    activity_en: 'Diurnal with high-performance hunting flight',
    status_it: 'Specie protetta in consolidamento locale',
    status_en: 'Protected species with strengthening local presence',
    profile: profile(
      {
        overview:
          'Il falco pellegrino e uno dei predatori aerei piu specializzati del Paleartico, legato a contesti rupestri. In Valle d Aosta occupa pareti idonee con disponibilita trofica elevata lungo corridoi di volo.',
        identification:
          'Ha ali appuntite, coda relativamente corta e tipica mascherina scura sul volto. Il volo e rapido e diretto, con picchiate ad altissima velocita durante la cattura della preda.',
        ecology:
          'Si alimenta quasi esclusivamente di uccelli intercettati in volo tramite strategie di sorpresa o inseguimento. La fedelta ai siti riproduttivi e elevata quando il disturbo in falesia resta basso.',
        inValle:
          'E osservabile in molte vallate principali dove sono presenti pareti adatte e avifauna abbondante. Le coppie territoriali richiedono attenzione gestionale durante la stagione riproduttiva.',
      },
      {
        overview:
          'The peregrine falcon is one of the most specialized aerial predators in the Palearctic, tied to cliff habitats. In Aosta Valley it occupies suitable walls with high prey availability along flight corridors.',
        identification:
          'It has pointed wings, relatively short tail and a characteristic dark facial mask. Flight is fast and direct, with very high-speed stoops during prey capture.',
        ecology:
          'It feeds almost exclusively on birds captured in flight using surprise or pursuit tactics. Site fidelity is high when disturbance at breeding cliffs remains low.',
        inValle:
          'It can be observed in many main valleys where suitable cliffs and rich bird communities are present. Territorial pairs require careful management during breeding season.',
      }
    ),
  }),
  fauna({
    id: 'allocco',
    faunaClass: 'bird',
    faunaGroup: 'raptor',
    name_it: 'Allocco',
    name_en: 'Tawny owl',
    scientific: 'Strix aluco',
    altitude: [300, 1700],
    zoneKeys: ['bassaValle', 'valCentrale', 'lys'],
    wikiIt: 'Allocco',
    wikiEn: 'Tawny_owl',
    diet_it: 'Micromammiferi, piccoli uccelli e anfibi',
    diet_en: 'Micromammals, small birds and amphibians',
    habitat_it: 'Boschi maturi, parchi alberati e fasce ripariali',
    habitat_en: 'Mature woodlands, wooded parks and riparian belts',
    activity_it: 'Notturna con vocalizzazioni territoriali marcate',
    activity_en: 'Nocturnal with marked territorial vocalizations',
    status_it: 'Comune nelle fasce forestali di bassa-media quota',
    status_en: 'Common in low-mid elevation forest belts',
    profile: profile(
      {
        overview:
          'L allocco e uno strigiforme forestale ben adattato ai boschi maturi e ai paesaggi rurali arborati. In Valle d Aosta costituisce una componente regolare delle comunita notturne a quote medio-basse.',
        identification:
          'Ha testa grande priva di ciuffi auricolari, ali arrotondate e colorazioni variabili dal grigio al bruno. Il richiamo territoriale e potente e spesso udibile nelle notti calme di fine inverno.',
        ecology:
          'Preda soprattutto piccoli mammiferi ma integra risorse diverse in base alla disponibilita locale. Nidifica in cavita naturali o strutture adatte e mostra buona fedelta territoriale pluriennale.',
        inValle:
          'Le densita maggiori si registrano nei comprensori boscati della valle centrale e nella bassa valle. Il monitoraggio acustico e efficace per valutare distribuzione e tendenza delle popolazioni.',
      },
      {
        overview:
          'The tawny owl is a forest owl well adapted to mature woodland and tree-rich rural landscapes. In Aosta Valley it is a regular component of nocturnal communities at low and mid elevations.',
        identification:
          'It has a large head without ear tufts, rounded wings and plumage ranging from grey to brown morphs. Territorial calls are powerful and often heard on calm late-winter nights.',
        ecology:
          'It mainly preys on small mammals but broadens diet according to local availability. Nesting occurs in natural cavities or suitable structures, with strong multi-year territory fidelity.',
        inValle:
          'Highest densities are recorded in forest districts of the central and lower valley. Acoustic monitoring is effective for tracking distribution and population trends.',
      }
    ),
  }),
  fauna({
    id: 'gallo-cedrone',
    faunaClass: 'bird',
    faunaGroup: 'galliform',
    name_it: 'Gallo cedrone',
    name_en: 'Western capercaillie',
    scientific: 'Tetrao urogallus',
    altitude: [1000, 2200],
    zoneKeys: ['granParadiso', 'montAvic', 'lys', 'valpelline'],
    wikiIt: 'Gallo_cedrone',
    wikiEn: 'Western_capercaillie',
    diet_it: 'Aghi di conifere, gemme, bacche e invertebrati stagionali',
    diet_en: 'Conifer needles, buds, berries and seasonal invertebrates',
    habitat_it: 'Foreste mature di conifere con sottobosco strutturato',
    habitat_en: 'Mature conifer forests with structured understory',
    activity_it: 'Diurna con arene di canto riproduttivo primaverili',
    activity_en: 'Diurnal with spring lekking display grounds',
    status_it: 'Specie sensibile e prioritaria in conservazione',
    status_en: 'Sensitive species and conservation priority',
    profile: profile(
      {
        overview:
          'Il gallo cedrone e il piu grande tetraonide forestale europeo e richiede habitat di elevata qualita strutturale. In Valle d Aosta la specie e localizzata e vulnerabile alla frammentazione dei boschi montani.',
        identification:
          'Il maschio e voluminoso e scuro con riflessi metallici e coda ampia, mentre la femmina e piu piccola e mimetica. Le vocalizzazioni del canto nuziale sono un elemento diagnostico nelle aree di lek.',
        ecology:
          'Dipende da boschi maturi con mosaico di radure, conifere e microhabitat utili alla dieta stagionale. Il disturbo antropico in primavera puo compromettere il successo riproduttivo e l occupazione dei siti storici.',
        inValle:
          'Le presenze sono frammentate in alcuni comprensori interni con gestione forestale orientata alla biodiversita. La conservazione richiede pianificazione spaziale, riduzione del disturbo e monitoraggio continuativo.',
      },
      {
        overview:
          'The western capercaillie is the largest European forest grouse and requires high-quality habitat structure. In Aosta Valley it is localized and vulnerable to mountain-forest fragmentation.',
        identification:
          'Males are large and dark with metallic sheen and broad tail, while females are smaller and cryptic. Breeding-display vocalizations are a key diagnostic cue at lek sites.',
        ecology:
          'It depends on mature forests with a mosaic of clearings, conifers and seasonal feeding microhabitats. Human disturbance in spring can reduce breeding success and occupation of traditional sites.',
        inValle:
          'Occurrences are fragmented in selected inner districts where forest management supports biodiversity. Conservation requires spatial planning, disturbance reduction and continuous monitoring.',
      }
    ),
  }),
  fauna({
    id: 'coturnice',
    faunaClass: 'bird',
    faunaGroup: 'galliform',
    name_it: 'Coturnice alpina',
    name_en: 'Rock partridge',
    scientific: 'Alectoris graeca',
    altitude: [1200, 3000],
    zoneKeys: ['valpelline', 'valtournenche', 'granParadiso', 'valGrisanche'],
    wikiIt: 'Coturnice',
    wikiEn: 'Rock_partridge',
    diet_it: 'Semi, germogli, foglie tenere e piccoli invertebrati',
    diet_en: 'Seeds, shoots, tender leaves and small invertebrates',
    habitat_it: 'Versanti aridi, pietraie e praterie rupestri alpine',
    habitat_en: 'Dry slopes, screes and rocky alpine grasslands',
    activity_it: 'Diurna con movimenti altitudinali stagionali',
    activity_en: 'Diurnal with seasonal elevational movements',
    status_it: 'Specie alpina vulnerabile a disturbo e cambi climatici',
    status_en: 'Alpine species vulnerable to disturbance and climate change',
    profile: profile(
      {
        overview:
          'La coturnice e un galliforme tipico degli ambienti aperti di alta montagna con elevata eterogeneita litologica. In Valle d Aosta mantiene popolazioni irregolari influenzate da innevamento e pressione antropica.',
        identification:
          'Si riconosce per livrea grigio-bruna, gola chiara bordata di nero e fianchi barrati. In volo breve e rapido mostra ali tondeggianti e traiettorie aderenti al pendio.',
        ecology:
          'Forma gruppi familiari post-riproduttivi e utilizza microhabitat diversi tra alimentazione e rifugio. La specie e sensibile al disturbo invernale e primaverile nelle aree di presenza consolidata.',
        inValle:
          'Le osservazioni interessano soprattutto valloni aridi con ampie pietraie e prati sassosi. La gestione conservativa privilegia il mantenimento di habitat aperti e la regolazione della frequentazione.',
      },
      {
        overview:
          'The rock partridge is a high-mountain galliform typical of open habitats with strong lithological heterogeneity. In Aosta Valley it holds uneven populations influenced by snow regimes and human pressure.',
        identification:
          'It is recognized by grey-brown plumage, pale throat bordered in black and barred flanks. In short fast flight, rounded wings and slope-hugging trajectories are characteristic.',
        ecology:
          'It forms family groups after breeding and uses different microhabitats for feeding and refuge. The species is sensitive to winter and spring disturbance in core occupancy areas.',
        inValle:
          'Observations mainly concern dry side valleys with extensive screes and stony grasslands. Conservation management prioritizes open-habitat maintenance and controlled recreational pressure.',
      }
    ),
  }),
  fauna({
    id: 'merlo-acquaiolo',
    faunaClass: 'bird',
    faunaGroup: 'alpine_bird',
    name_it: 'Merlo acquaiolo',
    name_en: 'White-throated dipper',
    scientific: 'Cinclus cinclus',
    altitude: [500, 2300],
    zoneKeys: ['valCentrale', 'valsavarenche', 'valpelline', 'lys'],
    wikiIt: 'Cinclus_cinclus',
    wikiEn: 'White-throated_dipper',
    diet_it: 'Macroinvertebrati acquatici, larve e piccoli crostacei',
    diet_en: 'Aquatic macroinvertebrates, larvae and small crustaceans',
    habitat_it: 'Torrenti ossigenati con alveo naturale e massi affioranti',
    habitat_en: 'Oxygen-rich streams with natural beds and emergent boulders',
    activity_it: 'Diurna con immersioni frequenti in acqua corrente',
    activity_en: 'Diurnal with frequent dives in running water',
    status_it: 'Specie indicatrice di buona qualita fluviale',
    status_en: 'Indicator species of good stream quality',
    profile: profile(
      {
        overview:
          'Il merlo acquaiolo e un passeriforme strettamente legato ai torrenti montani ben ossigenati. In Valle d Aosta e un ottimo indicatore biologico dello stato ecologico dei corsi d acqua alpini.',
        identification:
          'Si distingue per corpo compatto, livrea scura e caratteristica bavetta bianca estesa sul petto. Mostra comportamento unico tra i passeriformi, con nuoto e immersioni controcorrente per alimentarsi.',
        ecology:
          'Preda macroinvertebrati bentonici e dipende da substrati fluviali eterogenei non alterati. La specie nidifica vicino all acqua in anfratti, ponti o pareti umide protette.',
        inValle:
          'E diffuso lungo numerosi torrenti delle vallate laterali dove persiste buona naturalita dell alveo. Riduzioni locali possono segnalare alterazioni idromorfologiche o carico inquinante crescente.',
      },
      {
        overview:
          'The white-throated dipper is a passerine tightly linked to well-oxygenated mountain streams. In Aosta Valley it is an excellent bioindicator of Alpine running-water ecological status.',
        identification:
          'It is recognized by compact body, dark plumage and a characteristic white bib extending onto the chest. It shows unique passerine behavior, swimming and diving in current to forage.',
        ecology:
          'It feeds on benthic macroinvertebrates and depends on heterogeneous, unaltered stream substrates. Nesting occurs close to water in crevices, under bridges or on protected damp walls.',
        inValle:
          'It is widespread along many side-valley streams where channel naturalness remains high. Local declines may indicate hydromorphological alteration or increasing pollutant load.',
      }
    ),
  }),
  fauna({
    id: 'gracchio-corallino',
    faunaClass: 'bird',
    faunaGroup: 'alpine_bird',
    name_it: 'Gracchio corallino',
    name_en: 'Alpine chough',
    scientific: 'Pyrrhocorax pyrrhocorax',
    altitude: [1400, 3400],
    zoneKeys: ['granParadiso', 'valpelline', 'valFerret', 'monteBianco'],
    wikiIt: 'Pyrrhocorax_pyrrhocorax',
    wikiEn: 'Red-billed_chough',
    diet_it: 'Insetti, larve, semi e residui alimentari opportunistici',
    diet_en: 'Insects, larvae, seeds and opportunistic food scraps',
    habitat_it: 'Praterie d alta quota e pareti rocciose ventose',
    habitat_en: 'High-elevation grasslands and windy rocky cliffs',
    activity_it: 'Diurna e gregaria, con voli acrobatici frequenti',
    activity_en: 'Diurnal and gregarious, with frequent acrobatic flight',
    status_it: 'Specie tipica alpina con presenza regolare in quota',
    status_en: 'Typical Alpine species with regular high-altitude presence',
    profile: profile(
      {
        overview:
          'Il gracchio corallino e un corvide di alta montagna strettamente legato a paesaggi aperti rupestri. In Valle d Aosta e una presenza caratteristica delle creste e dei pascoli sommitali.',
        identification:
          'Si riconosce per piumaggio nero lucente, becco rosso arcuato e zampe rosse. In volo mostra grande manovrabilita, spesso in piccoli gruppi con richiami sonori continui.',
        ecology:
          'Sfrutta invertebrati del suolo e risorse alimentari opportunistiche, adattandosi rapidamente alla disponibilita locale. Nidifica in fessure di parete e colonie discontinue in siti poco disturbati.',
        inValle:
          'Le osservazioni sono frequenti nelle vallate interne sopra il limite del bosco e nei pressi dei passi alpini. La specie risente della variazione d uso del pascolo e della pressione turistica in alta stagione.',
      },
      {
        overview:
          'The Alpine chough is a high-mountain corvid strongly tied to open rocky landscapes. In Aosta Valley it is a characteristic species of ridges and summit pastures.',
        identification:
          'It is identified by glossy black plumage, curved red bill and red legs. In flight it is highly agile, often moving in small groups with frequent calls.',
        ecology:
          'It exploits soil invertebrates and opportunistic food resources, quickly adjusting to local availability. It nests in cliff fissures and discontinuous colonies in low-disturbance sites.',
        inValle:
          'Sightings are frequent in inner valleys above treeline and near Alpine passes. The species is affected by grazing-use changes and tourist pressure during peak season.',
      }
    ),
  }),
  fauna({
    id: 'corvo-imperiale',
    faunaClass: 'bird',
    faunaGroup: 'alpine_bird',
    name_it: 'Corvo imperiale',
    name_en: 'Common raven',
    scientific: 'Corvus corax',
    altitude: [400, 3500],
    zoneKeys: ['granParadiso', 'valCentrale', 'valFerret', 'valtournenche', 'bassaValle'],
    wikiIt: 'Corvus_corax',
    wikiEn: 'Common_raven',
    diet_it: 'Onnivoro: carogne, invertebrati, piccoli vertebrati e semi',
    diet_en: 'Omnivorous: carrion, invertebrates, small vertebrates and seeds',
    habitat_it: 'Ambienti montani aperti, pareti e aree antropiche sparse',
    habitat_en: 'Open mountain habitats, cliffs and sparse human areas',
    activity_it: 'Diurna con elevata capacita di apprendimento sociale',
    activity_en: 'Diurnal with high social-learning capacity',
    status_it: 'Specie ben presente e in generale stabile',
    status_en: 'Well represented and generally stable species',
    profile: profile(
      {
        overview:
          'Il corvo imperiale e il piu grande passeriforme europeo e occupa ambienti montani ampi e diversificati. In Valle d Aosta svolge un ruolo ecologico da opportunista e da necrofago secondario.',
        identification:
          'Si riconosce per dimensioni notevoli, becco robusto e coda cuneiforme evidente in volo. Le vocalizzazioni profonde e il volo acrobatico facilitano il riconoscimento anche a grande distanza.',
        ecology:
          'Ha dieta estremamente flessibile e sfrutta risorse naturali e antropiche con elevata intelligenza comportamentale. Nidifica su pareti o alberi alti, mantenendo territori stabili per piu anni.',
        inValle:
          'La specie e distribuita lungo tutto il gradiente altitudinale valdostano, con frequenza maggiore in aree aperte montane. Le coppie territoriali sono spesso osservabili vicino a corridoi vallivi principali.',
      },
      {
        overview:
          'The common raven is Europe s largest passerine and occupies broad, diverse mountain environments. In Aosta Valley it plays an ecological role as both opportunist and secondary scavenger.',
        identification:
          'It is identified by large size, heavy bill and a wedge-shaped tail visible in flight. Deep calls and acrobatic flight help recognition even at long range.',
        ecology:
          'Diet is highly flexible, exploiting natural and human-derived resources with advanced behavioral intelligence. It nests on cliffs or tall trees and can keep stable territories for years.',
        inValle:
          'The species is distributed across the full Aosta elevational gradient, with higher frequency in open mountain sectors. Territorial pairs are often seen near major valley corridors.',
      }
    ),
  }),
  fauna({
    id: 'picchio-nero',
    faunaClass: 'bird',
    faunaGroup: 'forest_bird',
    name_it: 'Picchio nero',
    name_en: 'Black woodpecker',
    scientific: 'Dryocopus martius',
    altitude: [600, 2100],
    zoneKeys: ['montAvic', 'valCentrale', 'lys', 'granParadiso'],
    wikiIt: 'Picchio_nero',
    wikiEn: 'Black_woodpecker',
    diet_it: 'Insetti xilofagi, formiche e larve sotto corteccia',
    diet_en: 'Xylophagous insects, ants and larvae under bark',
    habitat_it: 'Foreste mature con alberi vetusti e legno morto',
    habitat_en: 'Mature forests with veteran trees and deadwood',
    activity_it: 'Diurna con tambureggiamenti territoriali marcati',
    activity_en: 'Diurnal with marked territorial drumming',
    status_it: 'Specie forestale in buono stato dove habitat idoneo',
    status_en: 'Forest species in good condition where habitat is suitable',
    profile: profile(
      {
        overview:
          'Il picchio nero e una specie ombrello dei boschi maturi montani e richiede elevata disponibilita di legno morto. In Valle d Aosta e importante per la creazione di cavita usate da numerose altre specie.',
        identification:
          'Ha piumaggio nero uniforme e vertice rosso, completo nel maschio e limitato nella femmina. Le dimensioni grandi e il volo ondulato potente lo rendono riconoscibile anche in ambienti chiusi.',
        ecology:
          'Scava cavita profonde in tronchi di grosso diametro e ricerca prede xilofaghe in legno degradato. La presenza indica continuita forestale e gestione orientata alla naturalita strutturale.',
        inValle:
          'Le osservazioni si concentrano nei complessi di conifere e faggio delle quote medio-montane. La conservazione beneficia del mantenimento di piante vetuste e dalla riduzione del disturbo in periodo riproduttivo.',
      },
      {
        overview:
          'The black woodpecker is an umbrella species of mature mountain forests and requires substantial deadwood availability. In Aosta Valley it is important for cavity creation used by many other species.',
        identification:
          'It has uniform black plumage and a red crown, full in males and reduced in females. Large size and strong undulating flight make it recognizable even in closed forests.',
        ecology:
          'It excavates deep cavities in large trunks and forages for xylophagous prey in decaying wood. Presence indicates forest continuity and management focused on structural naturalness.',
        inValle:
          'Records are concentrated in conifer and beech complexes at mid-montane elevations. Conservation benefits from retaining veteran trees and minimizing breeding-season disturbance.',
      }
    ),
  }),
  fauna({
    id: 'ghiandaia',
    faunaClass: 'bird',
    faunaGroup: 'forest_bird',
    name_it: 'Ghiandaia eurasiatica',
    name_en: 'Eurasian jay',
    scientific: 'Garrulus glandarius',
    altitude: [300, 1800],
    zoneKeys: ['bassaValle', 'valCentrale', 'montAvic', 'lys'],
    wikiIt: 'Garrulus_glandarius',
    wikiEn: 'Eurasian_jay',
    diet_it: 'Semi forestali, ghiande, invertebrati e piccoli vertebrati',
    diet_en: 'Forest seeds, acorns, invertebrates and small vertebrates',
    habitat_it: 'Boschi misti, margini e parchi arborati',
    habitat_en: 'Mixed woodlands, edges and wooded parks',
    activity_it: 'Diurna con forte vocalita e comportamento vigile',
    activity_en: 'Diurnal with strong vocal behavior and alertness',
    status_it: 'Specie comune e funzionale alla rinnovazione del bosco',
    status_en: 'Common species important for forest regeneration',
    profile: profile(
      {
        overview:
          'La ghiandaia e un corvide forestale versatile con ruolo cruciale nella dispersione delle ghiande. In Valle d Aosta contribuisce in modo significativo alla dinamica di rinnovazione delle latifoglie.',
        identification:
          'Si riconosce per piumaggio rosato-bruno, barrature azzurre sulle ali e coda nera. Il richiamo aspro e la postura vigile la rendono facilmente individuabile ai margini del bosco.',
        ecology:
          'Accumula semi in cache stagionali e molte riserve non recuperate favoriscono la germinazione. Mostra comportamento territoriale in periodo riproduttivo e gregarismo variabile nel resto dell anno.',
        inValle:
          'La specie e diffusa in tutta la fascia boscata valdostana fino a quote medio-montane. La presenza risulta elevata anche in paesaggi rurali con copertura arborea frammentata ma continua.',
      },
      {
        overview:
          'The Eurasian jay is a versatile forest corvid with a key role in acorn dispersal. In Aosta Valley it significantly supports broadleaf regeneration dynamics.',
        identification:
          'It is recognized by pinkish-brown plumage, blue-barred wing patches and black tail. Harsh calls and vigilant posture make it easy to detect at woodland edges.',
        ecology:
          'It stores seeds in seasonal caches, and many unrecovered stores contribute to germination. Territorial behavior is marked in breeding season, with variable gregariousness otherwise.',
        inValle:
          'The species is widespread across Aosta Valley forest belts up to mid-montane elevations. Presence is also high in rural landscapes with fragmented but continuous tree cover.',
      }
    ),
  }),
  fauna({
    id: 'cincia-ciuffo',
    faunaClass: 'bird',
    faunaGroup: 'forest_bird',
    name_it: 'Cincia dal ciuffo',
    name_en: 'Crested tit',
    scientific: 'Lophophanes cristatus',
    altitude: [800, 2200],
    zoneKeys: ['montAvic', 'valpelline', 'lys', 'granParadiso'],
    wikiIt: 'Lophophanes_cristatus',
    wikiEn: 'Crested_tit',
    diet_it: 'Insetti, larve, semi di conifere e piccoli frutti',
    diet_en: 'Insects, larvae, conifer seeds and small fruits',
    habitat_it: 'Coniferete mature, in particolare peccete e lariceti',
    habitat_en: 'Mature conifer forests, especially spruce and larch stands',
    activity_it: 'Diurna, spesso in gruppi misti invernali',
    activity_en: 'Diurnal, often in mixed winter foraging flocks',
    status_it: 'Specie forestale regolare nelle quote montane',
    status_en: 'Regular forest species at montane elevations',
    profile: profile(
      {
        overview:
          'La cincia dal ciuffo e un piccolo passeriforme tipico delle coniferete montane ben strutturate. In Valle d Aosta e indicatrice di continuita ecologica nei boschi di quota media e alta.',
        identification:
          'Il ciuffo erettile bianco-nero e il carattere piu evidente e permette riconoscimento immediato. La specie ha vocalizzazioni sottili e movimenti rapidi tra rami fini della chioma.',
        ecology:
          'Si alimenta su microhabitat arborei diversi e integra semi durante i periodi freddi. Nidifica in cavita naturali o vecchi fori di picchio, sfruttando habitat con legno maturo.',
        inValle:
          'Le presenze sono frequenti nei comprensori forestali montani interni con dominanza di conifere. In inverno compare spesso in stormi misti con altre cince e piccoli passeriformi.',
      },
      {
        overview:
          'The crested tit is a small passerine typical of well-structured montane conifer forests. In Aosta Valley it indicates ecological continuity in mid- and high-elevation woodland.',
        identification:
          'Its black-and-white erectile crest is the most obvious feature and enables immediate recognition. The species gives thin calls and moves quickly through fine canopy branches.',
        ecology:
          'It forages across varied arboreal microhabitats and supplements diet with seeds during cold periods. Nesting occurs in natural cavities or old woodpecker holes within mature-wood habitat.',
        inValle:
          'Records are frequent in inner montane forest districts dominated by conifers. In winter it often joins mixed flocks with other tits and small passerines.',
      }
    ),
  }),
  fauna({
    id: 'rospo-smeraldino',
    faunaClass: 'herpeto',
    faunaGroup: 'amphibian',
    name_it: 'Rospo smeraldino',
    name_en: 'European green toad',
    scientific: 'Bufotes viridis',
    altitude: [300, 1500],
    zoneKeys: ['bassaValle', 'valCentrale'],
    wikiIt: 'Bufotes_viridis',
    wikiEn: 'European_green_toad',
    diet_it: 'Invertebrati terrestri, insetti e piccoli artropodi',
    diet_en: 'Terrestrial invertebrates, insects and small arthropods',
    habitat_it: 'Aree aperte aride con siti riproduttivi temporanei',
    habitat_en: 'Dry open areas with temporary breeding water bodies',
    activity_it: 'Notturna con migrazioni riproduttive stagionali',
    activity_en: 'Nocturnal with seasonal breeding migrations',
    status_it: 'Specie localmente vulnerabile per perdita di pozze',
    status_en: 'Locally vulnerable due to breeding-pond loss',
    profile: profile(
      {
        overview:
          'Il rospo smeraldino e un anfibio termofilo legato a paesaggi aperti e siti riproduttivi effimeri. In Valle d Aosta compare soprattutto nei settori piu caldi di fondovalle e conoidi alluvionali.',
        identification:
          'Si riconosce per pattern dorsale verde-oliva su fondo chiaro e pelle verrucosa ben evidente. Il canto maschile in periodo riproduttivo e prolungato e udibile nelle ore notturne.',
        ecology:
          'Sfrutta pozze temporanee prive di predatori ittici per la deposizione e sviluppo larvale. Fuori dalla stagione riproduttiva frequenta ambienti asciutti con rifugi sotto pietre e detriti.',
        inValle:
          'Le popolazioni sono frammentate e sensibili alla scomparsa di piccoli corpi idrici temporanei. Gli interventi di conservazione puntano al recupero delle pozze e alla riduzione della mortalita stradale.',
      },
      {
        overview:
          'The European green toad is a thermophilous amphibian linked to open landscapes and ephemeral breeding sites. In Aosta Valley it occurs mainly in warmer valley-floor sectors and alluvial fans.',
        identification:
          'It is recognized by green-olive dorsal patches on a pale background and clearly warty skin. Male calls during breeding season are prolonged and audible at night.',
        ecology:
          'It uses temporary fish-free pools for spawning and larval development. Outside breeding season it occupies dry habitats, sheltering under stones and debris.',
        inValle:
          'Populations are fragmented and sensitive to the loss of small temporary water bodies. Conservation actions focus on pond restoration and reducing road mortality.',
      }
    ),
  }),
  fauna({
    id: 'salamandra-pezzata',
    faunaClass: 'herpeto',
    faunaGroup: 'amphibian',
    name_it: 'Salamandra pezzata',
    name_en: 'Fire salamander',
    scientific: 'Salamandra salamandra',
    altitude: [500, 1800],
    zoneKeys: ['montAvic', 'valCentrale', 'lys', 'granParadiso'],
    wikiIt: 'Salamandra_salamandra',
    wikiEn: 'Fire_salamander',
    diet_it: 'Invertebrati del suolo: anellidi, larve e piccoli molluschi',
    diet_en: 'Soil invertebrates: annelids, larvae and small mollusks',
    habitat_it: 'Boschi umidi con ruscelli ombreggiati e lettiera profonda',
    habitat_en: 'Humid forests with shaded brooks and deep leaf litter',
    activity_it: 'Crepuscolare-notturna, favorita da pioggia e alta umidita',
    activity_en: 'Crepuscular-nocturnal, favored by rain and high humidity',
    status_it: 'Specie protetta sensibile ad alterazioni idriche forestali',
    status_en: 'Protected species sensitive to forest hydrological alteration',
    profile: profile(
      {
        overview:
          'La salamandra pezzata e un anfibio forestale iconico degli ambienti umidi montani temperati. In Valle d Aosta e legata a boschi con microclima fresco e corsi d acqua puliti.',
        identification:
          'La livrea nera con macchie gialle irregolari e altamente distintiva e funziona come segnale aposematico. Il corpo tozzo e la coda relativamente corta la differenziano da tritoni e altre salamandre sottili.',
        ecology:
          'Le femmine rilasciano larve in acque correnti o sorgive con buona ossigenazione e bassa alterazione. Gli adulti restano nascosti nel suolo umido e diventano attivi durante notti piovose.',
        inValle:
          'Le popolazioni risultano piu stabili nei comprensori forestali continui con limitata artificializzazione dei ruscelli. La conservazione dipende dalla tutela del reticolo idrico minore e della copertura forestale.',
      },
      {
        overview:
          'The fire salamander is an iconic forest amphibian of humid temperate montane habitats. In Aosta Valley it is tied to woodland with cool microclimate and clean running water.',
        identification:
          'Its black body with irregular yellow spots is highly distinctive and functions as an aposematic signal. The stocky body and relatively short tail distinguish it from newts and slimmer salamanders.',
        ecology:
          'Females release larvae into well-oxygenated streams or spring-fed waters with low alteration. Adults remain hidden in moist substrates and become active on rainy nights.',
        inValle:
          'Populations are more stable in continuous forest districts with limited stream artificialization. Conservation depends on protecting minor drainage networks and forest cover integrity.',
      }
    ),
  }),
  fauna({
    id: 'salamandra-lanzai',
    faunaClass: 'herpeto',
    faunaGroup: 'amphibian',
    name_it: 'Salamandra di Lanza',
    name_en: 'Lanza s alpine salamander',
    scientific: 'Salamandra lanzai',
    altitude: [1200, 2600],
    zoneKeys: ['valGrisanche', 'granParadiso', 'valpelline'],
    wikiIt: 'Salamandra_lanzai',
    wikiEn: 'Salamandra_lanzai',
    diet_it: 'Piccoli invertebrati terrestri di ambienti freschi umidi',
    diet_en: 'Small terrestrial invertebrates of cool humid habitats',
    habitat_it: 'Prati alpini umidi, pietraie e margini nivali',
    habitat_en: 'Humid alpine grasslands, screes and subnival margins',
    activity_it: 'Di superficie con umidita elevata e temperature moderate',
    activity_en: 'Surface-active under high humidity and moderate temperatures',
    status_it: 'Endemismo alpino occidentale di alto valore conservazionistico',
    status_en: 'Western Alpine endemic of high conservation value',
    profile: profile(
      {
        overview:
          'La salamandra di Lanza e un endemismo alpino ristretto a pochi settori del Piemonte e della Valle d Aosta. La specie ha elevato interesse biogeografico e vulnerabilita intrinseca per areale ridotto.',
        identification:
          'A differenza della salamandra pezzata presenta livrea generalmente nera uniforme senza macchie gialle evidenti. Ha corpo compatto e movimenti lenti in superficie durante condizioni microclimatiche favorevoli.',
        ecology:
          'E specie vivipara e partorisce giovani gia metamorfosati, evitando la fase larvale acquatica. Dipende da microhabitat montani freschi con suolo umido e copertura litica o vegetale protettiva.',
        inValle:
          'In regione e segnalata in pochi nuclei montani e richiede tutela rigorosa dell habitat. Le variazioni climatiche e il disturbo localizzato rappresentano pressioni potenzialmente critiche.',
      },
      {
        overview:
          'Lanza s alpine salamander is a narrow endemic restricted to limited sectors of Piedmont and Aosta Valley. The species has high biogeographic relevance and intrinsic vulnerability due to its small range.',
        identification:
          'Unlike the fire salamander, it is generally uniformly black without evident yellow spotting. It has a compact body and slow surface movements under favorable microclimatic conditions.',
        ecology:
          'It is viviparous and gives birth to fully metamorphosed juveniles, avoiding an aquatic larval stage. It depends on cool mountain microhabitats with moist soil and protective rock or vegetation cover.',
        inValle:
          'In the region it is known from very few mountain nuclei and requires strict habitat protection. Climate shifts and localized disturbance are potentially critical pressures.',
      }
    ),
  }),
  fauna({
    id: 'rana-temporaria',
    faunaClass: 'herpeto',
    faunaGroup: 'amphibian',
    name_it: 'Rana temporaria',
    name_en: 'Common frog',
    scientific: 'Rana temporaria',
    altitude: [600, 2600],
    zoneKeys: ['valsavarenche', 'granParadiso', 'valpelline', 'valtournenche'],
    wikiIt: 'Rana_temporaria',
    wikiEn: 'Common_frog',
    diet_it: 'Invertebrati terrestri e acquatici di piccola taglia',
    diet_en: 'Small terrestrial and aquatic invertebrates',
    habitat_it: 'Prati umidi, torbiere, stagni e margini di ruscelli',
    habitat_en: 'Wet meadows, peatlands, ponds and stream margins',
    activity_it: 'Stagionale, con riproduzione primaverile in acque calme',
    activity_en: 'Seasonal, breeding in spring in still waters',
    status_it: 'Specie ancora diffusa ma sensibile alla perdita di zone umide',
    status_en: 'Still widespread but sensitive to wetland loss',
    profile: profile(
      {
        overview:
          'La rana temporaria e una delle specie anfibie piu diffuse in ambiente alpino e subalpino. In Valle d Aosta occupa numerosi siti umidi naturali e secondari lungo il gradiente altitudinale.',
        identification:
          'Ha corpo relativamente robusto, muso arrotondato e colorazione bruno-variabile con maschera temporale scura. Durante la fase riproduttiva forma aggregazioni visibili in pozze e piccoli stagni.',
        ecology:
          'Depone masse gelatinose in acque ferme o debolmente correnti con sviluppo larvale rapido in primavera. Gli adulti sfruttano habitat terrestri umidi, tornando ai siti acquatici per la riproduzione.',
        inValle:
          'La specie e ben rappresentata nelle vallate montane con reticolo di piccole zone umide permanenti o temporanee. La conservazione dipende dalla continuita idrica e dalla limitazione di inquinanti agricoli.',
      },
      {
        overview:
          'The common frog is one of the most widespread amphibians in Alpine and subalpine environments. In Aosta Valley it occupies many natural and secondary wetlands across elevational gradients.',
        identification:
          'It has a relatively robust body, rounded snout and variable brown coloration with a dark temporal mask. During breeding it forms visible aggregations in pools and small ponds.',
        ecology:
          'It lays gelatinous egg masses in still or slow-flowing waters with rapid spring larval development. Adults use moist terrestrial habitats and return to aquatic sites for breeding.',
        inValle:
          'The species is well represented in mountain valleys with networks of permanent or temporary small wetlands. Conservation depends on hydrological continuity and limiting agricultural pollutants.',
      }
    ),
  }),
  fauna({
    id: 'tritone-alpestris',
    faunaClass: 'herpeto',
    faunaGroup: 'amphibian',
    name_it: 'Tritone alpestre',
    name_en: 'Alpine newt',
    scientific: 'Ichthyosaura alpestris',
    altitude: [700, 2500],
    zoneKeys: ['valpelline', 'valtournenche', 'granParadiso', 'montAvic'],
    wikiIt: 'Ichthyosaura_alpestris',
    wikiEn: 'Alpine_newt',
    diet_it: 'Invertebrati acquatici e terrestri, larve di insetti',
    diet_en: 'Aquatic and terrestrial invertebrates, insect larvae',
    habitat_it: 'Piccoli stagni, abbeveratoi, pozze alpine e boschi umidi',
    habitat_en: 'Small ponds, troughs, alpine pools and humid woodlands',
    activity_it: 'Stagionale, con fase acquatica riproduttiva primaverile',
    activity_en: 'Seasonal, with spring aquatic breeding phase',
    status_it: 'Specie montana regolare ma dipendente dai siti riproduttivi',
    status_en: 'Regular mountain species but dependent on breeding sites',
    profile: profile(
      {
        overview:
          'Il tritone alpestre e un urodelo caratteristico delle zone umide montane, spesso presente in piccoli corpi idrici isolati. In Valle d Aosta compare in una rete frammentata di siti riproduttivi naturali e artificiali.',
        identification:
          'In fase acquatica il maschio mostra colorazioni vivaci con ventre arancio acceso e dorso bluastro. Fuori dall acqua la livrea diventa piu opaca e il riconoscimento richiede osservazione ravvicinata.',
        ecology:
          'La riproduzione avviene in acque ferme con vegetazione o microstrutture utili alla deposizione delle uova. La fase terrestre richiede rifugi umidi sotto lettiera, pietre o tronchi.',
        inValle:
          'Le popolazioni sono sensibili all interramento delle pozze e all introduzione di pesci predatori. Interventi mirati su piccoli habitat acquatici migliorano rapidamente la continuita locale della specie.',
      },
      {
        overview:
          'The Alpine newt is a characteristic urodele of montane wetlands, often present in small isolated water bodies. In Aosta Valley it occurs in a fragmented network of natural and artificial breeding sites.',
        identification:
          'During aquatic phase, males show vivid coloration with bright orange belly and bluish dorsal tones. Outside water, coloration becomes duller and identification requires closer observation.',
        ecology:
          'Breeding occurs in still waters with vegetation or microstructures suitable for egg deposition. Terrestrial phase depends on moist refuges under litter, stones or logs.',
        inValle:
          'Populations are sensitive to pond infilling and fish introductions. Targeted actions on small aquatic habitats can quickly improve local continuity of the species.',
      }
    ),
  }),
  fauna({
    id: 'vipera-berus',
    faunaClass: 'herpeto',
    faunaGroup: 'reptile',
    name_it: 'Vipera comune',
    name_en: 'Common adder',
    scientific: 'Vipera berus',
    altitude: [900, 2800],
    zoneKeys: ['valpelline', 'valtournenche', 'granParadiso', 'valGrisanche'],
    wikiIt: 'Vipera_berus',
    wikiEn: 'Adder',
    diet_it: 'Piccoli roditori, anfibi e occasionalmente lucertole',
    diet_en: 'Small rodents, amphibians and occasional lizards',
    habitat_it: 'Mosaici di prateria, pietraie e margini arbustivi montani',
    habitat_en: 'Mosaics of grassland, scree and montane shrub edges',
    activity_it: 'Diurna in stagioni fredde, piu crepuscolare in estate',
    activity_en: 'Diurnal in cooler seasons, more crepuscular in summer',
    status_it: 'Specie autoctona protetta, localmente comune',
    status_en: 'Native protected species, locally common',
    profile: profile(
      {
        overview:
          'La vipera comune e il rettile velenoso piu rappresentativo delle quote montane e subalpine europee. In Valle d Aosta occupa habitat eterogenei dove coesistono aree di basking e rifugio.',
        identification:
          'Si riconosce per testa triangolare, pupilla verticale e tipico disegno dorsale a zig-zag, variabile per tonalita. I giovani presentano gia pattern distintivo ma con dimensioni ridotte e maggiore vulnerabilita.',
        ecology:
          'Regola attivita e termoregolazione in funzione di esposizione, stagione e disponibilita trofica locale. La riproduzione e vivipara e la sopravvivenza dipende dalla disponibilita di rifugi invernali idonei.',
        inValle:
          'Le presenze sono regolari in molte vallate alte con praterie rupestri e margini bosco-prato. La convivenza con la frequentazione escursionistica richiede informazione e comportamento prudente sui sentieri.',
      },
      {
        overview:
          'The common adder is the most representative venomous reptile of European montane and subalpine belts. In Aosta Valley it occupies heterogeneous habitats combining basking and refuge areas.',
        identification:
          'It is identified by triangular head, vertical pupil and the typical dorsal zig-zag pattern, with variable tones. Juveniles already show distinctive patterning but are smaller and more vulnerable.',
        ecology:
          'Activity and thermoregulation are adjusted to exposure, season and local prey availability. Reproduction is viviparous, and survival depends on suitable winter refuge sites.',
        inValle:
          'Records are regular in many high valleys with rocky grasslands and forest-pasture edges. Coexistence with hiking pressure requires public information and prudent trail behavior.',
      }
    ),
  }),
  fauna({
    id: 'lucertola-allegra',
    faunaClass: 'herpeto',
    faunaGroup: 'reptile',
    name_it: 'Lucertola vivipara',
    name_en: 'Viviparous lizard',
    scientific: 'Zootoca vivipara',
    altitude: [800, 2600],
    zoneKeys: ['valpelline', 'granParadiso', 'valtournenche', 'montAvic'],
    wikiIt: 'Zootoca_vivipara',
    wikiEn: 'Viviparous_lizard',
    diet_it: 'Insetti, ragni e altri piccoli artropodi terrestri',
    diet_en: 'Insects, spiders and other small terrestrial arthropods',
    habitat_it: 'Prati umidi montani, torbiere e margini freschi',
    habitat_en: 'Humid montane grasslands, peatlands and cool edges',
    activity_it: 'Diurna con termoregolazione su microhabitat aperti',
    activity_en: 'Diurnal with thermoregulation in open microhabitats',
    status_it: 'Specie montana localmente frequente in ambienti idonei',
    status_en: 'Montane species locally frequent in suitable habitats',
    profile: profile(
      {
        overview:
          'La lucertola vivipara e un rettile di climi freschi con distribuzione ampia nelle fasce montane europee. In Valle d Aosta e legata a microambienti umidi e soleggiati alternati su piccola scala.',
        identification:
          'Ha dimensioni contenute, colorazione bruno-grigiastra variabile e coda relativamente lunga rispetto al corpo. I pattern dorsali sono discreti, per cui il riconoscimento richiede osservazione attenta del comportamento.',
        ecology:
          'Preda piccoli artropodi in aree erbose e margini torbosi con buona disponibilita termica diurna. La viviparita rappresenta un adattamento efficace alle stagioni brevi e alle basse temperature montane.',
        inValle:
          'La specie e presente in numerosi siti d alta quota dove persistono umidita del suolo e copertura erbacea continua. E sensibile alla semplificazione degli habitat umidi e all eccessiva calpestabilita.',
      },
      {
        overview:
          'The viviparous lizard is a cool-climate reptile widely distributed across European mountain belts. In Aosta Valley it is tied to fine-scale mosaics of humid and sun-exposed microhabitats.',
        identification:
          'It has small size, variable brown-grey coloration and a relatively long tail compared with body length. Dorsal pattern is subtle, so reliable identification often requires careful behavioral observation.',
        ecology:
          'It feeds on small arthropods in grassy sectors and peaty margins with adequate daytime thermal conditions. Viviparity is an effective adaptation to short seasons and low mountain temperatures.',
        inValle:
          'The species occurs in many high-elevation sites where soil moisture and continuous herb cover persist. It is sensitive to wet-habitat simplification and excessive trampling pressure.',
      }
    ),
  }),
];
