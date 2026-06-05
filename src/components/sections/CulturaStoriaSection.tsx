import CulturaStaticDivider from '@/components/cultura/CulturaStaticDivider';
import { pickLocalized } from '@/lib/locale-content';

type LocalizedText = { it: string; en: string; fr: string; de: string };

type Era = {
  id: string;
  period: string;
  title: LocalizedText;
  body: LocalizedText;
};

/**
 * Storia della Valle d'Aosta — sintesi editoriale dalle origini all'autonomia.
 * Fonti di riferimento riscritte: storiografia regionale (Salassi, Augusta
 * Praetoria, casa Savoia, Statuto speciale 1948). Nessun dato sui sentieri.
 */
const ERAS: Era[] = [
  {
    id: 'preistoria',
    period: 'fino al 25 a.C.',
    title: {
      it: 'I Salassi e le origini',
      en: 'The Salassi and the origins',
      fr: 'Les Salasses et les origines',
      de: 'Die Salasser und die Ursprünge',
    },
    body: {
      it: "Prima di Roma la valle era abitata dai Salassi, popolo celto-ligure che controllava i valichi del Piccolo e Gran San Bernardo e l'oro dei torrenti della bassa valle. L'area di Saint-Martin-de-Corléans ad Aosta conserva una straordinaria necropoli megalitica con stele antropomorfe e allineamenti risalenti al III millennio a.C., tra i più importanti dell'arco alpino.",
      en: 'Before Rome the valley was home to the Salassi, a Celto-Ligurian people who controlled the Little and Great St Bernard passes and the river gold of the lower valley. The Saint-Martin-de-Corléans site in Aosta preserves an extraordinary megalithic necropolis with anthropomorphic stelae and alignments dating to the 3rd millennium BC, among the most important in the Alps.',
      fr: "Avant Rome, la vallée était habitée par les Salasses, peuple celto-ligure qui contrôlait les cols du Petit et du Grand-Saint-Bernard et l'or des torrents de la basse vallée. Le site de Saint-Martin-de-Corléans à Aoste conserve une extraordinaire nécropole mégalithique avec stèles anthropomorphes et alignements du IIIe millénaire av. J.-C., parmi les plus importants des Alpes.",
      de: 'Vor Rom war das Tal von den Salassern bewohnt, einem keltisch-ligurischen Volk, das die Pässe des Kleinen und Großen St. Bernhard und das Flussgold des unteren Tals kontrollierte. Die Stätte Saint-Martin-de-Corléans in Aosta bewahrt eine außergewöhnliche megalithische Nekropole mit anthropomorphen Stelen aus dem 3. Jahrtausend v. Chr.',
    },
  },
  {
    id: 'romani',
    period: '25 a.C. – V sec.',
    title: {
      it: 'Augusta Prætoria romana',
      en: 'Roman Augusta Prætoria',
      fr: 'Augusta Prætoria romaine',
      de: 'Das römische Augusta Prætoria',
    },
    body: {
      it: "Nel 25 a.C., dopo la sconfitta dei Salassi, Roma fonda Augusta Prætoria Salassorum — l'odierna Aosta — come colonia a guardia dei valichi verso la Gallia. L'impianto urbano a scacchiera, l'Arco di Augusto, la Porta Prætoria, il teatro e i ponti sono ancora oggi visibili: la valle diventa un corridoio strategico delle Alpi romane, percorso dalle vie consolari verso i due San Bernardo.",
      en: 'In 25 BC, after defeating the Salassi, Rome founded Augusta Prætoria Salassorum — today’s Aosta — as a colony guarding the passes towards Gaul. The grid street plan, the Arch of Augustus, the Porta Prætoria, the theatre and the bridges are still visible today: the valley became a strategic corridor of the Roman Alps, crossed by consular roads to both St Bernard passes.',
      fr: "En 25 av. J.-C., après la défaite des Salasses, Rome fonde Augusta Prætoria Salassorum — l'actuelle Aoste — colonie gardant les cols vers la Gaule. Le plan en damier, l'Arc d'Auguste, la Porte Prætoria, le théâtre et les ponts sont encore visibles : la vallée devient un corridor stratégique des Alpes romaines, parcouru par les voies consulaires vers les deux Saint-Bernard.",
      de: 'Im Jahr 25 v. Chr. gründete Rom nach dem Sieg über die Salasser Augusta Prætoria Salassorum — das heutige Aosta — als Kolonie zur Sicherung der Pässe nach Gallien. Der schachbrettartige Stadtplan, der Augustusbogen, die Porta Prætoria, das Theater und die Brücken sind bis heute sichtbar: Das Tal wurde zum strategischen Korridor der römischen Alpen.',
    },
  },
  {
    id: 'medioevo',
    period: 'V – XV sec.',
    title: {
      it: 'Castelli, Savoia e Via Francigena',
      en: 'Castles, Savoy and the Via Francigena',
      fr: 'Châteaux, Savoie et Via Francigena',
      de: 'Burgen, Savoyen und die Via Francigena',
    },
    body: {
      it: "Dopo Roma la valle passa a Burgundi, Franchi e infine alla Casa Savoia, che dall'XI secolo ne fa una propria signoria di frontiera. È l'età dei grandi castelli — Fénis, Issogne, Verrès, Saint-Pierre, Ussel — e del transito dei pellegrini lungo la Via Francigena, che dal Gran San Bernardo scendeva verso Roma. Nel 1191 il conte Tommaso I concede la Carta delle Franchigie, primo nucleo dell'autonomia valdostana.",
      en: 'After Rome the valley passed to the Burgundians, the Franks and finally the House of Savoy, which from the 11th century made it a frontier lordship. It is the age of the great castles — Fénis, Issogne, Verrès, Saint-Pierre, Ussel — and of pilgrims travelling the Via Francigena, descending from the Great St Bernard towards Rome. In 1191 Count Thomas I granted the Charter of Franchises, the first seed of Valdostan autonomy.',
      fr: "Après Rome, la vallée passe aux Burgondes, aux Francs puis à la Maison de Savoie, qui en fait dès le XIe siècle une seigneurie de frontière. C'est l'âge des grands châteaux — Fénis, Issogne, Verrès, Saint-Pierre, Ussel — et du passage des pèlerins sur la Via Francigena, descendant du Grand-Saint-Bernard vers Rome. En 1191, le comte Thomas Ier accorde la Charte des Franchises, premier germe de l'autonomie valdôtaine.",
      de: 'Nach Rom fiel das Tal an Burgunder, Franken und schließlich an das Haus Savoyen, das es ab dem 11. Jahrhundert zu einer Grenzherrschaft machte. Es ist die Zeit der großen Burgen — Fénis, Issogne, Verrès, Saint-Pierre, Ussel — und der Pilger auf der Via Francigena vom Großen St. Bernhard nach Rom. 1191 gewährte Graf Thomas I. die Freiheitscharta, den ersten Keim der valdostanischen Autonomie.',
    },
  },
  {
    id: 'walser',
    period: 'XIII – XIV sec.',
    title: {
      it: 'I Walser ai piedi del Rosa',
      en: 'The Walser at the foot of Monte Rosa',
      fr: 'Les Walser au pied du Mont-Rose',
      de: 'Die Walser am Fuße des Monte Rosa',
    },
    body: {
      it: "Tra XIII e XIV secolo coloni Walser di lingua alemanna, provenienti dall'alto Vallese, valicano i ghiacciai e si insediano nell'alta Valle del Lys, a Gressoney e Issime. Portano con sé la lingua titsch e töitschu, l'architettura in legno dello stadel e una cultura alpina d'alta quota che sopravvive ancora oggi, accanto al patrimonio francoprovenzale del resto della valle.",
      en: 'Between the 13th and 14th centuries Walser settlers of Alemannic tongue, coming from the upper Valais, crossed the glaciers and settled in the upper Lys valley, at Gressoney and Issime. They brought the titsch and töitschu languages, the timber stadel architecture and a high-altitude alpine culture that survives today, alongside the Franco-Provençal heritage of the rest of the valley.',
      fr: "Entre le XIIIe et le XIVe siècle, des colons Walser de langue alémanique, venus du haut Valais, franchissent les glaciers et s'installent dans la haute vallée du Lys, à Gressoney et Issime. Ils apportent les langues titsch et töitschu, l'architecture en bois du stadel et une culture alpine d'altitude qui survit encore, aux côtés du patrimoine francoprovençal du reste de la vallée.",
      de: 'Zwischen dem 13. und 14. Jahrhundert überquerten Walser Siedler alemannischer Sprache aus dem Oberwallis die Gletscher und ließen sich im oberen Lystal, in Gressoney und Issime, nieder. Sie brachten die Sprachen Titsch und Töitschu, die hölzerne Stadel-Architektur und eine hochalpine Kultur mit, die bis heute neben dem frankoprovenzalischen Erbe des übrigen Tals fortbesteht.',
    },
  },
  {
    id: 'moderna',
    period: 'XVI – XIX sec.',
    title: {
      it: 'Dal Conseil des Commis a Napoleone',
      en: 'From the Conseil des Commis to Napoleon',
      fr: 'Du Conseil des Commis à Napoléon',
      de: 'Vom Conseil des Commis bis Napoleon',
    },
    body: {
      it: "Dal 1536 la valle si governa attraverso il Conseil des Commis, assemblea che amministra in lingua francese con ampia autonomia dai Savoia. Nel maggio 1800 Napoleone Bonaparte attraversa il Gran San Bernardo con 40.000 uomini per piombare sull'Italia: un'impresa logistica leggendaria lungo i valichi valdostani. L'Ottocento porta le grandi vie d'acqua dei rû e le prime esplorazioni alpinistiche del Cervino e del Monte Bianco.",
      en: 'From 1536 the valley governed itself through the Conseil des Commis, an assembly administering in French with broad autonomy from Savoy. In May 1800 Napoleon Bonaparte crossed the Great St Bernard with 40,000 men to descend on Italy: a legendary logistical feat across the Valdostan passes. The 19th century brought the great rû irrigation channels and the first mountaineering explorations of the Matterhorn and Mont Blanc.',
      fr: "Dès 1536, la vallée se gouverne par le Conseil des Commis, assemblée administrant en français avec une large autonomie vis-à-vis de la Savoie. En mai 1800, Napoléon Bonaparte franchit le Grand-Saint-Bernard avec 40 000 hommes pour fondre sur l'Italie : exploit logistique légendaire à travers les cols valdôtains. Le XIXe siècle apporte les grands rûs d'irrigation et les premières explorations alpines du Cervin et du Mont-Blanc.",
      de: 'Ab 1536 regierte sich das Tal durch den Conseil des Commis, eine Versammlung, die auf Französisch mit weitgehender Autonomie von Savoyen verwaltete. Im Mai 1800 überquerte Napoleon Bonaparte den Großen St. Bernhard mit 40.000 Mann, um über Italien herzufallen: eine legendäre logistische Leistung über die valdostanischen Pässe. Das 19. Jahrhundert brachte die großen Rû-Bewässerungskanäle und die ersten alpinistischen Erkundungen von Matterhorn und Mont Blanc.',
    },
  },
  {
    id: 'autonomia',
    period: '1945 – oggi',
    title: {
      it: "L'autonomia e oggi",
      en: 'Autonomy and today',
      fr: "L'autonomie et aujourd'hui",
      de: 'Die Autonomie und heute',
    },
    body: {
      it: "Dopo il ventennio fascista, che tentò di cancellare il francese e italianizzò i toponimi, la Resistenza e la figura di Émile Chanoux alimentano l'idea di un'autonomia federalista. Nel 1948 la Valle d'Aosta diventa Regione autonoma a statuto speciale, con bilinguismo italiano-francese garantito. Oggi è la regione più piccola d'Italia: poco più di 120.000 abitanti, un patrimonio alpino tutelato dal Parco del Gran Paradiso — il primo parco nazionale italiano, dal 1922.",
      en: 'After the Fascist period, which tried to erase French and Italianised place names, the Resistance and the figure of Émile Chanoux fuelled the idea of federalist autonomy. In 1948 Aosta Valley became an autonomous region with special statute and guaranteed Italian-French bilingualism. Today it is Italy’s smallest region: just over 120,000 inhabitants, an alpine heritage protected by the Gran Paradiso Park — Italy’s first national park, since 1922.',
      fr: "Après le fascisme, qui tenta d'effacer le français et italianisa les toponymes, la Résistance et la figure d'Émile Chanoux nourrissent l'idée d'une autonomie fédéraliste. En 1948, la Vallée d'Aoste devient une région autonome à statut spécial, avec bilinguisme italien-français garanti. C'est aujourd'hui la plus petite région d'Italie : un peu plus de 120 000 habitants, un patrimoine alpin protégé par le Parc du Grand-Paradis — premier parc national italien, depuis 1922.",
      de: 'Nach dem Faschismus, der das Französische auszulöschen versuchte und die Ortsnamen italianisierte, nährten der Widerstand und die Gestalt von Émile Chanoux die Idee einer föderalistischen Autonomie. 1948 wurde das Aostatal eine autonome Region mit Sonderstatut und garantierter italienisch-französischer Zweisprachigkeit. Heute ist es die kleinste Region Italiens: gut 120.000 Einwohner, ein alpines Erbe, geschützt durch den Gran-Paradiso-Park — Italiens ersten Nationalpark seit 1922.',
    },
  },
];

export default function CulturaStoriaSection({ locale }: { locale: string }) {
  const isIT = locale === 'it';

  return (
    <>
      <CulturaStaticDivider
        image="/cultura/saint-ours.jpg"
        title={isIT ? 'Storia' : locale === 'fr' ? 'Histoire' : locale === 'de' ? 'Geschichte' : 'History'}
        subtitle={pickLocalized(locale, {
          it: "Dai Salassi a Roma, dai Savoia all'autonomia — tremila anni ai crocevia delle Alpi",
          en: 'From the Salassi to Rome, from Savoy to autonomy — three thousand years at the crossroads of the Alps',
          fr: "Des Salasses à Rome, de la Savoie à l'autonomie — trois mille ans au carrefour des Alpes",
          de: 'Von den Salassern bis Rom, von Savoyen bis zur Autonomie — dreitausend Jahre am Kreuzweg der Alpen',
        })}
      />

      <section
        id="storia"
        className="defer-render scroll-mt-36 border-b border-white/5 bg-slate-950/30 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-alpenglow">
              {isIT ? 'Storia' : locale === 'fr' ? 'Histoire' : locale === 'de' ? 'Geschichte' : 'History'}
            </p>
            <h2 className="mb-4 font-display text-display-md tracking-tighter">
              {pickLocalized(locale, {
                it: "La storia della Valle d'Aosta",
                en: 'The history of the Aosta Valley',
                fr: "L'histoire de la Vallée d'Aoste",
                de: 'Die Geschichte des Aostatals',
              })}
            </h2>
            <p className="leading-relaxed text-snow/55">
              {pickLocalized(locale, {
                it: "Corridoio naturale tra la pianura padana e i passi alpini, la Valle d'Aosta è stata terra di confine, di transito e di identità da oltre tre millenni.",
                en: 'A natural corridor between the Po plain and the alpine passes, the Aosta Valley has been a land of borders, transit and identity for over three millennia.',
                fr: "Corridor naturel entre la plaine du Pô et les cols alpins, la Vallée d'Aoste est une terre de frontière, de transit et d'identité depuis plus de trois millénaires.",
                de: 'Als natürlicher Korridor zwischen der Po-Ebene und den Alpenpässen ist das Aostatal seit über drei Jahrtausenden ein Land der Grenzen, des Transits und der Identität.',
              })}
            </p>
          </div>

          <ol className="relative space-y-10 border-l border-white/10 pl-8">
            {ERAS.map((era) => (
              <li key={era.id} className="relative">
                <span
                  className="absolute -left-[2.45rem] top-1.5 h-3.5 w-3.5 rounded-full bg-alpenglow ring-4 ring-ink"
                  aria-hidden
                />
                <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-ice">
                  {era.period}
                </p>
                <h3 className="mb-3 font-display text-2xl tracking-tight text-snow">
                  {pickLocalized(locale, era.title)}
                </h3>
                <p className="max-w-3xl text-[1.02rem] font-light leading-[1.85] text-snow/75">
                  {pickLocalized(locale, era.body)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
