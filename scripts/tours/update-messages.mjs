/**
 * Aggiorna i messaggi Tour.* nei 4 locali con i dati reali dei tour ricostruiti
 * (numero tappe, km totali, paesi attraversati).
 */
import fs from 'node:fs';

const routes = JSON.parse(fs.readFileSync('src/data/trails-routes.json', 'utf8'));

const TAGS = {
  tmb: 'tour-mont-blanc',
  monteRosa: 'tour-monte-rosa',
  cervino: 'tour-cervino',
  granParadiso: 'tour-gran-paradiso',
  rutor: 'tour-rutor',
  granCombin: 'tour-gran-combin',
};

const totals = {};
for (const [key, tag] of Object.entries(TAGS)) {
  const stages = routes.filter((t) => t.tags.includes(tag));
  totals[key] = {
    n: stages.length,
    km: Math.round(stages.reduce((a, t) => a + t.distance_km, 0) / 5) * 5,
    transfers: stages.filter((t) => t.is_transfer_stage).length,
  };
}
console.log(totals);

const T = (k) => totals[k];

const CONTENT = {
  it: {
    badgeStages: '{count} tappe',
    badgeAvailable: 'Anello completo disponibile',
    tmb: {
      distance: `~${T('tmb').km} km · ${T('tmb').n} tappe (IT · CH · FR)`,
      vdaSide: 'Tappe 1–4 e 12–13 in Valle d’Aosta',
      places: 'Courmayeur, Rif. Bertone, Rif. Bonatti, Rif. Elena, La Fouly (CH), Champex (CH), Chamonix (FR), Rif. Elisabetta',
      description: 'Il percorso più famoso delle Alpi, qui nell’anello completo: tre nazioni, i balconi della Val Ferret, i villaggi del Vallese, le scale degli Aiguilles Rouges e la traversata del Bonhomme, fino al ritorno in Val Veny dal Col de la Seigne.',
      cta: 'Vedi tutte le tappe',
    },
    monteRosa: {
      distance: `~${T('monteRosa').km} km · ${T('monteRosa').n} tappe (VdA · Piemonte · CH)`,
      vdaSide: 'Gressoney, Ayas e il vallone delle Cime Bianche',
      places: 'Gressoney, Col d’Olen, Alagna, Macugnaga, Saas-Fee (CH), Zermatt (CH), Cervinia, Champoluc',
      description: 'L’anello completo attorno al secondo massiccio delle Alpi: le valli walser di Gressoney, Alagna e Macugnaga, il Passo di Monte Moro, l’Europaweg sopra il Mattertal e il rientro dal Teodulo (tappa di trasferimento su ghiacciaio o in funivia) e dalle Cime Bianche.',
      cta: 'Vedi tutte le tappe',
    },
    cervino: {
      distance: `~${T('cervino').km} km · ${T('cervino').n} tappe (IT · CH)`,
      vdaSide: 'Breuil-Cervinia, Valcournera, Prarayer',
      places: 'Breuil-Cervinia, Prarayer, Arolla (CH), Zinal (CH), Gruben (CH), Zermatt (CH)',
      description: 'Il giro della piramide più iconica delle Alpi sul tracciato del Tour du Cervin: il Col di Valcournera verso Prarayer, le valli vallesane di Hérens, Moiry e Anniviers, l’Augstbordpass e Zermatt. Due tappe (Col Collon e Teodulo) sono trasferimenti alpinistici su ghiacciaio, con guida o impianti.',
      cta: 'Vedi tutte le tappe',
    },
    granParadiso: {
      distance: `~${T('granParadiso').km} km · ${T('granParadiso').n} tappe (VdA · Piemonte)`,
      description: 'Anello interamente nel Parco Nazionale Gran Paradiso: la mulattiera reale del Col Lauson, il piano del Nivolet fino al Rifugio Città di Chivasso in Valle Orco (Piemonte), il Col Rosset e il Col Entrelor fra Rhêmes e Valsavarenche. Stambecchi quasi garantiti.',
      cta: 'Vedi tutte le tappe',
    },
    rutor: {
      distance: `~${T('rutor').km} km · ${T('rutor').n} tappe (VdA · Francia)`,
      vdaSide: 'La Thuile, Rutor, Valgrisenche',
      description: 'L’anello del ghiacciaio del Rutor fra Valle d’Aosta e Tarentaise: le cascate e il Rifugio Deffeyes, i passi dell’Alta Via 2 verso Valgrisenche, il Col du Mont verso Sainte-Foy e il ritorno dal Colle del Piccolo San Bernardo con il lago Verney.',
      cta: 'Vedi tutte le tappe',
    },
    granCombin: {
      distance: `~${T('granCombin').km} km · ${T('granCombin').n} tappe (VdA · CH)`,
      vdaSide: 'Ollomont, conca di By, Col Champillon',
      description: 'Il Tour des Combins completo: dal Col Champillon al Gran San Bernardo, le cabanes vallesane di Mille, Brunet, Panossière (con la passerella di Corbassière) e Chanrion, e il rientro in Valpelline dalla Fenêtre de Durand.',
      cta: 'Vedi tutte le tappe',
    },
  },
  en: {
    badgeStages: '{count} stages',
    badgeAvailable: 'Full loop available',
    tmb: {
      distance: `~${T('tmb').km} km · ${T('tmb').n} stages (IT · CH · FR)`,
      vdaSide: 'Stages 1–4 and 12–13 in the Aosta Valley',
      places: 'Courmayeur, Bertone, Bonatti and Elena huts, La Fouly (CH), Champex (CH), Chamonix (FR), Elisabetta hut',
      description: 'The most famous trek in the Alps, here as the full loop: three countries, the Val Ferret balconies, the villages of Valais, the Aiguilles Rouges ladders and the Bonhomme crossing, returning to Val Veny over the Col de la Seigne.',
      cta: 'See all stages',
    },
    monteRosa: {
      distance: `~${T('monteRosa').km} km · ${T('monteRosa').n} stages (Aosta Valley · Piedmont · CH)`,
      vdaSide: 'Gressoney, Ayas and the Cime Bianche valley',
      places: 'Gressoney, Col d’Olen, Alagna, Macugnaga, Saas-Fee (CH), Zermatt (CH), Cervinia, Champoluc',
      description: 'The full loop around the Alps’ second massif: the Walser valleys of Gressoney, Alagna and Macugnaga, the Monte Moro pass, the Europaweg above the Mattertal, returning via the Theodul (a glacier/cable-car transfer stage) and the Cime Bianche.',
      cta: 'See all stages',
    },
    cervino: {
      distance: `~${T('cervino').km} km · ${T('cervino').n} stages (IT · CH)`,
      vdaSide: 'Breuil-Cervinia, Valcournera, Prarayer',
      places: 'Breuil-Cervinia, Prarayer, Arolla (CH), Zinal (CH), Gruben (CH), Zermatt (CH)',
      description: 'The circuit of the Alps’ most iconic pyramid on the Tour du Cervin line: the Valcournera pass to Prarayer, the Valais valleys of Hérens, Moiry and Anniviers, the Augstbordpass and Zermatt. Two stages (Col Collon and Theodul) are alpine glacier transfers, with a guide or by lift.',
      cta: 'See all stages',
    },
    granParadiso: {
      distance: `~${T('granParadiso').km} km · ${T('granParadiso').n} stages (Aosta Valley · Piedmont)`,
      description: 'A loop entirely inside Gran Paradiso National Park: the royal mule track over the Col Lauson, the Nivolet plateau to the Città di Chivasso hut above the Orco valley (Piedmont), and the Rosset and Entrelor passes between Rhêmes and Valsavarenche. Ibex almost guaranteed.',
      cta: 'See all stages',
    },
    rutor: {
      distance: `~${T('rutor').km} km · ${T('rutor').n} stages (Aosta Valley · France)`,
      vdaSide: 'La Thuile, Rutor, Valgrisenche',
      description: 'The loop around the Rutor glacier between the Aosta Valley and the Tarentaise: the waterfalls and the Deffeyes hut, the Alta Via 2 passes to Valgrisenche, the Col du Mont to Sainte-Foy and the return over the Little St Bernard pass past Lake Verney.',
      cta: 'See all stages',
    },
    granCombin: {
      distance: `~${T('granCombin').km} km · ${T('granCombin').n} stages (Aosta Valley · CH)`,
      vdaSide: 'Ollomont, the By basin, Col Champillon',
      description: 'The complete Tour des Combins: from the Col Champillon to the Great St Bernard, the Valais cabanes of Mille, Brunet, Panossière (with the Corbassière footbridge) and Chanrion, returning to the Valpelline over the Fenêtre de Durand.',
      cta: 'See all stages',
    },
  },
  fr: {
    badgeStages: '{count} étapes',
    badgeAvailable: 'Boucle complète disponible',
    tmb: {
      distance: `~${T('tmb').km} km · ${T('tmb').n} étapes (IT · CH · FR)`,
      vdaSide: 'Étapes 1–4 et 12–13 en Vallée d’Aoste',
      places: 'Courmayeur, refuges Bertone, Bonatti et Elena, La Fouly (CH), Champex (CH), Chamonix (FR), refuge Elisabetta',
      description: 'Le trek le plus célèbre des Alpes, ici en boucle complète : trois pays, les balcons du Val Ferret, les villages du Valais, les échelles des Aiguilles Rouges et la traversée du Bonhomme, avec retour en Val Veny par le col de la Seigne.',
      cta: 'Voir toutes les étapes',
    },
    monteRosa: {
      distance: `~${T('monteRosa').km} km · ${T('monteRosa').n} étapes (Vallée d’Aoste · Piémont · CH)`,
      vdaSide: 'Gressoney, Ayas et le vallon des Cime Bianche',
      places: 'Gressoney, col d’Olen, Alagna, Macugnaga, Saas-Fee (CH), Zermatt (CH), Cervinia, Champoluc',
      description: 'La boucle complète autour du deuxième massif des Alpes : les vallées walser de Gressoney, Alagna et Macugnaga, le col de Monte Moro, l’Europaweg au-dessus du Mattertal, et le retour par le Théodule (étape de transfert sur glacier ou en téléphérique) et les Cime Bianche.',
      cta: 'Voir toutes les étapes',
    },
    cervino: {
      distance: `~${T('cervino').km} km · ${T('cervino').n} étapes (IT · CH)`,
      vdaSide: 'Breuil-Cervinia, Valcournera, Prarayer',
      places: 'Breuil-Cervinia, Prarayer, Arolla (CH), Zinal (CH), Gruben (CH), Zermatt (CH)',
      description: 'Le tour de la pyramide la plus iconique des Alpes sur le tracé du Tour du Cervin : le col de Valcournera vers Prarayer, les vallées valaisannes d’Hérens, de Moiry et d’Anniviers, l’Augstbordpass et Zermatt. Deux étapes (col Collon et Théodule) sont des transferts alpins sur glacier, avec guide ou par les remontées.',
      cta: 'Voir toutes les étapes',
    },
    granParadiso: {
      distance: `~${T('granParadiso').km} km · ${T('granParadiso').n} étapes (Vallée d’Aoste · Piémont)`,
      description: 'Une boucle entièrement dans le Parc national du Grand-Paradis : la muletière royale du col Lauson, le plateau du Nivolet jusqu’au refuge Città di Chivasso au-dessus de la vallée de l’Orco (Piémont), et les cols Rosset et Entrelor entre Rhêmes et Valsavarenche. Bouquetins presque garantis.',
      cta: 'Voir toutes les étapes',
    },
    rutor: {
      distance: `~${T('rutor').km} km · ${T('rutor').n} étapes (Vallée d’Aoste · France)`,
      vdaSide: 'La Thuile, Rutor, Valgrisenche',
      description: 'La boucle du glacier du Rutor entre Vallée d’Aoste et Tarentaise : les cascades et le refuge Deffeyes, les cols de la Haute Route n° 2 vers Valgrisenche, le col du Mont vers Sainte-Foy et le retour par le col du Petit-Saint-Bernard et le lac Verney.',
      cta: 'Voir toutes les étapes',
    },
    granCombin: {
      distance: `~${T('granCombin').km} km · ${T('granCombin').n} étapes (Vallée d’Aoste · CH)`,
      vdaSide: 'Ollomont, la combe de By, le col Champillon',
      description: 'Le Tour des Combins complet : du col Champillon au Grand-Saint-Bernard, les cabanes valaisannes de Mille, Brunet, Panossière (avec la passerelle de Corbassière) et Chanrion, et le retour en Valpelline par la Fenêtre de Durand.',
      cta: 'Voir toutes les étapes',
    },
  },
  de: {
    badgeStages: '{count} Etappen',
    badgeAvailable: 'Komplette Runde verfügbar',
    tmb: {
      distance: `~${T('tmb').km} km · ${T('tmb').n} Etappen (IT · CH · FR)`,
      vdaSide: 'Etappen 1–4 und 12–13 im Aostatal',
      places: 'Courmayeur, Bertone-, Bonatti- und Elena-Hütte, La Fouly (CH), Champex (CH), Chamonix (FR), Elisabetta-Hütte',
      description: 'Der berühmteste Trek der Alpen, hier als komplette Runde: drei Länder, die Balkone des Val Ferret, die Dörfer des Wallis, die Leitern der Aiguilles Rouges und die Bonhomme-Überschreitung, mit Rückkehr ins Val Veny über den Col de la Seigne.',
      cta: 'Alle Etappen ansehen',
    },
    monteRosa: {
      distance: `~${T('monteRosa').km} km · ${T('monteRosa').n} Etappen (Aostatal · Piemont · CH)`,
      vdaSide: 'Gressoney, Ayas und das Cime-Bianche-Tal',
      places: 'Gressoney, Col d’Olen, Alagna, Macugnaga, Saas-Fee (CH), Zermatt (CH), Cervinia, Champoluc',
      description: 'Die komplette Runde um das zweithöchste Massiv der Alpen: die Walser Täler von Gressoney, Alagna und Macugnaga, der Monte-Moro-Pass, der Europaweg über dem Mattertal und die Rückkehr über den Theodul (Transferetappe über den Gletscher oder per Seilbahn) und die Cime Bianche.',
      cta: 'Alle Etappen ansehen',
    },
    cervino: {
      distance: `~${T('cervino').km} km · ${T('cervino').n} Etappen (IT · CH)`,
      vdaSide: 'Breuil-Cervinia, Valcournera, Prarayer',
      places: 'Breuil-Cervinia, Prarayer, Arolla (CH), Zinal (CH), Gruben (CH), Zermatt (CH)',
      description: 'Die Runde um die ikonischste Pyramide der Alpen auf der Linie der Tour du Cervin: der Col di Valcournera nach Prarayer, die Walliser Täler Hérens, Moiry und Anniviers, der Augstbordpass und Zermatt. Zwei Etappen (Col Collon und Theodul) sind alpine Gletschertransfers, mit Führer oder per Bahn.',
      cta: 'Alle Etappen ansehen',
    },
    granParadiso: {
      distance: `~${T('granParadiso').km} km · ${T('granParadiso').n} Etappen (Aostatal · Piemont)`,
      description: 'Eine Runde komplett im Nationalpark Gran Paradiso: der königliche Saumpfad über den Col Lauson, die Nivolet-Hochebene bis zur Hütte Città di Chivasso über dem Orco-Tal (Piemont) und die Pässe Rosset und Entrelor zwischen Rhêmes und Valsavarenche. Steinböcke fast garantiert.',
      cta: 'Alle Etappen ansehen',
    },
    rutor: {
      distance: `~${T('rutor').km} km · ${T('rutor').n} Etappen (Aostatal · Frankreich)`,
      vdaSide: 'La Thuile, Rutor, Valgrisenche',
      description: 'Die Runde um den Rutor-Gletscher zwischen Aostatal und Tarentaise: die Wasserfälle und die Deffeyes-Hütte, die Pässe des Höhenwegs 2 nach Valgrisenche, der Col du Mont nach Sainte-Foy und die Rückkehr über den Kleinen Sankt Bernhard am Verney-See vorbei.',
      cta: 'Alle Etappen ansehen',
    },
    granCombin: {
      distance: `~${T('granCombin').km} km · ${T('granCombin').n} Etappen (Aostatal · CH)`,
      vdaSide: 'Ollomont, der By-Kessel, der Col Champillon',
      description: 'Die komplette Tour des Combins: vom Col Champillon zum Grossen Sankt Bernhard, die Walliser Hütten Mille, Brunet, Panossière (mit der Corbassière-Hängebrücke) und Chanrion, und die Rückkehr in die Valpelline über die Fenêtre de Durand.',
      cta: 'Alle Etappen ansehen',
    },
  },
};

for (const locale of ['it', 'en', 'fr', 'de']) {
  const p = `src/messages/${locale}.json`;
  const msgs = JSON.parse(fs.readFileSync(p, 'utf8'));
  const c = CONTENT[locale];
  msgs.Tour.badgeStages = c.badgeStages;
  msgs.Tour.badgeAvailable = c.badgeAvailable;
  for (const key of Object.keys(TAGS)) {
    Object.assign(msgs.Tour[key], c[key]);
  }
  fs.writeFileSync(p, JSON.stringify(msgs, null, 2) + '\n');
  console.log(`✓ ${p}`);
}
