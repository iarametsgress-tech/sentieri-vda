/** Contenuto editoriale esteso delle due Alte Vie — intro "romanzata" +
 *  descrizione generale dettagliata, in 4 lingue. Nessun dato inventato:
 *  i numeri (tappe, km, dislivelli) restano quelli delle schede tappa. */

type L = { it: string; en: string; fr: string; de: string };

export type AlteViaContent = {
  intro: L;
  body: L[];
};

export const ALTE_VIE_CONTENT: Record<'av1' | 'av2', AlteViaContent> = {
  av1: {
    intro: {
      it: "C'è un filo che cuce insieme la Valle d'Aosta da est a ovest, sospeso fra i duemila e i tremila metri, sempre a vista dei grandi ghiacciai. È l'Alta Via n° 1, la «Via dei Giganti»: un cammino che parte dalle colline di vigne sopra Donnas e, tappa dopo tappa, conduce fin sotto le pareti del Monte Bianco, attraversando i piedi del Monte Rosa, del Cervino e del Grand Combin. Non è una corsa: è un lento avvicinarsi ai colossi delle Alpi, un colle alla volta.",
      en: "There is a thread that stitches the Aosta Valley together from east to west, suspended between two and three thousand metres, always within sight of the great glaciers. It is the High Route 1, the 'Way of the Giants': a journey that starts from the vine-clad hills above Donnas and, stage after stage, leads to the foot of Mont Blanc, passing beneath Monte Rosa, the Matterhorn and the Grand Combin. It is not a race: it is a slow approach to the colossi of the Alps, one pass at a time.",
      fr: "Il existe un fil qui coud la Vallée d'Aoste d'est en ouest, suspendu entre deux et trois mille mètres, toujours en vue des grands glaciers. C'est la Haute Route n° 1, la « Voie des Géants » : un chemin qui part des collines de vignes au-dessus de Donnas et, étape après étape, mène au pied du Mont-Blanc, en passant sous le Mont-Rose, le Cervin et le Grand-Combin. Ce n'est pas une course : c'est une lente approche des colosses des Alpes, un col à la fois.",
      de: "Es gibt einen Faden, der das Aostatal von Ost nach West zusammennäht, schwebend zwischen zwei- und dreitausend Metern, stets im Blick der großen Gletscher. Es ist die Höhenroute 1, der „Weg der Giganten“: eine Wanderung, die in den Weinbergen oberhalb von Donnas beginnt und Etappe für Etappe an den Fuß des Mont Blanc führt, vorbei am Monte Rosa, am Matterhorn und am Grand Combin. Es ist kein Wettlauf: Es ist eine langsame Annäherung an die Kolosse der Alpen, ein Pass nach dem anderen.",
    },
    body: [
      {
        it: "L'Alta Via 1 corre lungo il versante sinistro orografico della valle, quello esposto a sud e affacciato sulla catena di confine. È un itinerario a tappe che collega rifugi e villaggi storici, pensato per essere percorso in più giorni con pernottamento in quota: ogni tappa supera un colle e scende in un nuovo vallone, in un alternarsi di salite impegnative e discese verso gli alpeggi. Il panorama cambia di continuo, ma i grandi quattromila restano sempre sullo sfondo, come punti cardinali.",
        en: "High Route 1 runs along the orographic left side of the valley, the south-facing one that overlooks the border chain. It is a multi-stage route linking refuges and historic villages, designed to be walked over several days with overnight stays at altitude: each stage crosses a pass and drops into a new side-valley, in an alternation of demanding climbs and descents to the alpine pastures. The panorama changes constantly, but the great four-thousanders always remain in the background, like cardinal points.",
        fr: "La Haute Route 1 longe le versant gauche orographique de la vallée, celui exposé au sud et donnant sur la chaîne frontalière. C'est un itinéraire par étapes reliant refuges et villages historiques, conçu pour être parcouru en plusieurs jours avec nuitées en altitude : chaque étape franchit un col et descend dans un nouveau vallon, dans une alternance de montées exigeantes et de descentes vers les alpages. Le panorama change sans cesse, mais les grands quatre mille restent toujours en toile de fond, tels des points cardinaux.",
        de: "Die Höhenroute 1 verläuft entlang der orografisch linken Talseite, der nach Süden ausgerichteten, die auf die Grenzkette blickt. Es ist eine Etappenroute, die Hütten und historische Dörfer verbindet und auf mehrere Tage mit Übernachtungen in der Höhe ausgelegt ist: Jede Etappe überquert einen Pass und steigt in ein neues Seitental ab, im Wechsel anspruchsvoller Anstiege und Abstiege zu den Almen. Das Panorama wechselt ständig, doch die großen Viertausender bleiben stets im Hintergrund, wie Himmelsrichtungen.",
      },
      {
        it: "È un percorso di difficoltà escursionistica (E/EE) ma fisicamente esigente per la lunghezza complessiva e i dislivelli quotidiani: richiede allenamento, abitudine alla quota e attrezzatura adeguata. La stagione ideale va da fine giugno a metà settembre, quando i colli sono liberi dalla neve e i rifugi aperti. Si può percorrere per intero in una traversata di più giorni oppure scegliere singole tappe come escursioni in giornata, partendo dai fondovalle raggiungibili in auto o con i mezzi pubblici.",
        en: "It is a route of hiking difficulty (E/EE) but physically demanding for its overall length and daily height gains: it calls for fitness, familiarity with altitude and proper equipment. The ideal season runs from late June to mid-September, when the passes are clear of snow and the refuges open. It can be walked in full as a multi-day traverse, or you can pick single stages as day hikes, starting from valley floors reachable by car or public transport.",
        fr: "C'est un itinéraire de difficulté randonnée (E/EE) mais physiquement exigeant par sa longueur totale et ses dénivelés quotidiens : il demande de l'entraînement, l'habitude de l'altitude et un équipement adapté. La saison idéale va de fin juin à mi-septembre, quand les cols sont dégagés de neige et les refuges ouverts. On peut le parcourir en entier en une traversée de plusieurs jours, ou choisir des étapes isolées comme randonnées à la journée, au départ des fonds de vallée accessibles en voiture ou en transports.",
        de: "Es ist eine Route von Wanderschwierigkeit (E/EE), aber körperlich anspruchsvoll wegen der Gesamtlänge und der täglichen Höhenmeter: Sie erfordert Training, Höhengewöhnung und passende Ausrüstung. Die ideale Saison reicht von Ende Juni bis Mitte September, wenn die Pässe schneefrei und die Hütten geöffnet sind. Man kann sie als mehrtägige Durchquerung ganz begehen oder einzelne Etappen als Tageswanderungen wählen, ausgehend von den mit Auto oder öffentlichen Verkehrsmitteln erreichbaren Talböden.",
      },
      {
        it: "Qui sotto trovi tutte le tappe ufficiali in ordine, ciascuna con la propria scheda: distanza, dislivello, difficoltà, traccia GPX e mappa. Scegli da dove cominciare.",
        en: "Below you'll find all the official stages in order, each with its own page: distance, height gain, difficulty, GPX track and map. Choose where to begin.",
        fr: "Ci-dessous, retrouvez toutes les étapes officielles dans l'ordre, chacune avec sa fiche : distance, dénivelé, difficulté, trace GPX et carte. Choisissez par où commencer.",
        de: "Unten findest du alle offiziellen Etappen der Reihe nach, jede mit eigener Seite: Distanz, Höhenmeter, Schwierigkeit, GPX-Track und Karte. Wähle, wo du beginnst.",
      },
    ],
  },
  av2: {
    intro: {
      it: "Se l'Alta Via 1 è la via dei giganti, l'Alta Via n° 2 è la «Via dei Camosci»: più selvaggia, più alta, più solitaria. Corre sul versante destro della valle, dentro e attorno al Parco Nazionale del Gran Paradiso, là dove stambecchi e camosci pascolano indisturbati e i ghiacciai scendono fino ai sentieri. Da Courmayeur, sotto il Monte Bianco, fino a Donnas: una traversata che attraversa il cuore selvaggio della Valle d'Aosta.",
      en: "If High Route 1 is the way of the giants, High Route 2 is the 'Way of the Chamois': wilder, higher, more solitary. It runs along the right side of the valley, in and around the Gran Paradiso National Park, where ibex and chamois graze undisturbed and the glaciers descend to the trails. From Courmayeur, beneath Mont Blanc, to Donnas: a traverse through the wild heart of the Aosta Valley.",
      fr: "Si la Haute Route 1 est la voie des géants, la Haute Route n° 2 est la « Voie des Chamois » : plus sauvage, plus haute, plus solitaire. Elle longe le versant droit de la vallée, dans et autour du Parc national du Grand-Paradis, là où bouquetins et chamois paissent sans être dérangés et où les glaciers descendent jusqu'aux sentiers. De Courmayeur, sous le Mont-Blanc, jusqu'à Donnas : une traversée du cœur sauvage de la Vallée d'Aoste.",
      de: "Ist die Höhenroute 1 der Weg der Giganten, so ist die Höhenroute 2 der „Weg der Gämsen“: wilder, höher, einsamer. Sie verläuft an der rechten Talseite, im und um den Gran-Paradiso-Nationalpark, wo Steinböcke und Gämsen ungestört weiden und die Gletscher bis zu den Wegen herabreichen. Von Courmayeur, unter dem Mont Blanc, bis Donnas: eine Durchquerung des wilden Herzens des Aostatals.",
    },
    body: [
      {
        it: "L'Alta Via 2 si sviluppa mediamente più in quota della sorella, con valichi che sfiorano e superano i tremila metri e tappe che entrano nel Parco Nazionale del Gran Paradiso, il più antico d'Italia (1922). È il regno della grande fauna alpina: l'incontro con stambecchi e camosci è quasi garantito, soprattutto all'alba e al tramonto. Proprio perché attraversa l'area protetta, su molte tappe valgono regole specifiche del parco — tra cui il divieto di portare cani — pensate per tutelare un ecosistema fragile e unico.",
        en: "High Route 2 runs on average higher than its sister, with passes that brush and exceed three thousand metres and stages that enter the Gran Paradiso National Park, Italy's oldest (1922). It is the realm of large alpine wildlife: encounters with ibex and chamois are almost guaranteed, especially at dawn and dusk. Precisely because it crosses the protected area, specific park rules apply on many stages — including a ban on dogs — designed to safeguard a fragile and unique ecosystem.",
        fr: "La Haute Route 2 se déroule en moyenne plus haut que sa sœur, avec des cols qui frôlent et dépassent trois mille mètres et des étapes qui pénètrent dans le Parc national du Grand-Paradis, le plus ancien d'Italie (1922). C'est le royaume de la grande faune alpine : la rencontre avec bouquetins et chamois est presque garantie, surtout à l'aube et au crépuscule. Parce qu'elle traverse l'aire protégée, des règles spécifiques du parc s'appliquent sur de nombreuses étapes — dont l'interdiction des chiens — pour préserver un écosystème fragile et unique.",
        de: "Die Höhenroute 2 verläuft im Schnitt höher als ihre Schwester, mit Pässen, die dreitausend Meter streifen und überschreiten, und Etappen, die in den Gran-Paradiso-Nationalpark führen, den ältesten Italiens (1922). Es ist das Reich der großen alpinen Tierwelt: Begegnungen mit Steinböcken und Gämsen sind fast garantiert, vor allem in der Morgen- und Abenddämmerung. Gerade weil sie das Schutzgebiet durchquert, gelten auf vielen Etappen besondere Parkregeln — darunter ein Hundeverbot — zum Schutz eines fragilen und einzigartigen Ökosystems.",
      },
      {
        it: "La difficoltà è escursionistica (E/EE), con qualche tratto più tecnico in alta quota: la lunghezza, l'altitudine media elevata e l'ambiente d'alta montagna la rendono leggermente più impegnativa dell'Alta Via 1. La finestra ideale è luglio-settembre. Anche qui puoi affrontare l'intera traversata in autonomia, appoggiandoti ai rifugi, oppure assaporare singole tappe come escursioni in giornata di grande respiro.",
        en: "The difficulty is hiking grade (E/EE), with a few more technical sections at altitude: its length, high average elevation and high-mountain setting make it slightly more demanding than High Route 1. The ideal window is July to September. Here too you can tackle the whole traverse self-sufficiently, relying on the refuges, or savour single stages as wide-ranging day hikes.",
        fr: "La difficulté est de niveau randonnée (E/EE), avec quelques passages plus techniques en altitude : sa longueur, son altitude moyenne élevée et son cadre de haute montagne la rendent un peu plus exigeante que la Haute Route 1. La fenêtre idéale est juillet-septembre. Là encore, vous pouvez affronter toute la traversée en autonomie, en vous appuyant sur les refuges, ou savourer des étapes isolées comme de grandes randonnées à la journée.",
        de: "Die Schwierigkeit ist Wanderniveau (E/EE), mit einigen technischeren Abschnitten in der Höhe: Länge, hohe Durchschnittshöhe und hochalpines Umfeld machen sie etwas anspruchsvoller als die Höhenroute 1. Das ideale Zeitfenster ist Juli bis September. Auch hier kannst du die gesamte Durchquerung eigenständig mit Stützpunkt auf den Hütten angehen oder einzelne Etappen als großzügige Tageswanderungen genießen.",
      },
      {
        it: "Qui sotto trovi tutte le tappe ufficiali in ordine, ciascuna con la propria scheda: distanza, dislivello, difficoltà, traccia GPX e mappa. Scegli da dove cominciare.",
        en: "Below you'll find all the official stages in order, each with its own page: distance, height gain, difficulty, GPX track and map. Choose where to begin.",
        fr: "Ci-dessous, retrouvez toutes les étapes officielles dans l'ordre, chacune avec sa fiche : distance, dénivelé, difficulté, trace GPX et carte. Choisissez par où commencer.",
        de: "Unten findest du alle offiziellen Etappen der Reihe nach, jede mit eigener Seite: Distanz, Höhenmeter, Schwierigkeit, GPX-Track und Karte. Wähle, wo du beginnst.",
      },
    ],
  },
};
