import { Link } from '@/i18n/routing';
import { MapPin, Footprints, CalendarRange, Gauge, Backpack, Sunrise, Info } from 'lucide-react';
import RefugeMiniMap from '@/components/RefugeMiniMap';
import { pickLocalized } from '@/lib/locale-content';
import type { Difficulty } from '@/lib/types';

export type ReachTrail = {
  slug: string;
  name: string;
  difficulty: Difficulty;
  distance_km: number;
  elevation_gain_m: number;
};

type Labels = {
  whereTitle: string;
  howToReach: string;
  seasonTitle: string;
  effortTitle: string;
  bringTitle: string;
  doTitle: string;
  aboutBivouacTitle: string;
};

const DIFF_ORDER: Difficulty[] = ['T', 'E', 'EE', 'EEA', 'A'];

function Block({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-snow/55">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function RefugeGuideExtras({
  type,
  name,
  lat,
  lng,
  elevation_m,
  openPeriod,
  reachTrails,
  locale,
  labels,
}: {
  type: 'rifugio' | 'bivacco' | string;
  name: string;
  lat: number;
  lng: number;
  elevation_m: number;
  openPeriod?: string;
  reachTrails: ReachTrail[];
  locale: string;
  labels: Labels;
}) {
  const isBivacco = type === 'bivacco';

  // Sforzo derivato dai sentieri di accesso (dati reali), nessun dato inventato.
  let effortText: string | null = null;
  if (reachTrails.length > 0) {
    const diffs = reachTrails
      .map((t) => DIFF_ORDER.indexOf(t.difficulty))
      .filter((i) => i >= 0);
    const minD = DIFF_ORDER[Math.min(...diffs)];
    const maxD = DIFF_ORDER[Math.max(...diffs)];
    const gains = reachTrails.map((t) => t.elevation_gain_m).filter((n) => n > 0);
    const minG = gains.length ? Math.min(...gains) : 0;
    const maxG = gains.length ? Math.max(...gains) : 0;
    const diffPart = minD === maxD ? minD : `${minD}–${maxD}`;
    const gainPart =
      gains.length === 0 ? '' : minG === maxG ? `, +${minG} m` : `, +${minG}–${maxG} m`;
    effortText = `${labelEffortPrefix(locale)} ${diffPart}${gainPart} (${labelCai(locale)}).`;
  }

  return (
    <div className="space-y-10">
      {/* Dove si trova */}
      <Block icon={<MapPin size={14} className="text-alpenglow" />} title={labels.whereTitle}>
        <RefugeMiniMap lat={lat} lng={lng} label={name} elevation={elevation_m} />
        <p className="mt-3 font-mono text-xs text-snow/50">
          {lat.toFixed(4)}, {lng.toFixed(4)} · {elevation_m} m
        </p>
      </Block>

      {/* Come arrivare */}
      {reachTrails.length > 0 && (
        <Block icon={<Footprints size={14} className="text-alpenglow" />} title={labels.howToReach}>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {reachTrails.map((tr) => (
              <li key={tr.slug}>
                <Link
                  href={`/sentieri/${tr.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition-colors hover:border-alpenglow/40 hover:bg-alpenglow/5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-snow group-hover:text-alpenglow">
                      {tr.name}
                    </span>
                    <span className="font-mono text-[11px] text-snow/50">
                      {tr.distance_km.toFixed(1)} km · +{tr.elevation_gain_m} m
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full border border-white/15 px-2 py-0.5 font-mono text-[11px] text-snow/70">
                    {tr.difficulty}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {/* Periodo consigliato */}
      {openPeriod && (
        <Block icon={<CalendarRange size={14} className="text-alpenglow" />} title={labels.seasonTitle}>
          <p className="leading-relaxed text-snow/75">{openPeriod}</p>
        </Block>
      )}

      {/* Sforzo */}
      {effortText && (
        <Block icon={<Gauge size={14} className="text-alpenglow" />} title={labels.effortTitle}>
          <p className="leading-relaxed text-snow/75">{effortText}</p>
        </Block>
      )}

      {/* Cosa portare */}
      <Block icon={<Backpack size={14} className="text-alpenglow" />} title={labels.bringTitle}>
        <p className="leading-relaxed text-snow/75">
          {pickLocalized(locale, isBivacco ? BRING_BIVACCO : BRING_RIFUGIO)}
        </p>
      </Block>

      {/* Cosa fare */}
      <Block icon={<Sunrise size={14} className="text-alpenglow" />} title={labels.doTitle}>
        <p className="leading-relaxed text-snow/75">
          {pickLocalized(locale, isBivacco ? DO_BIVACCO : DO_RIFUGIO)}
        </p>
      </Block>

      {/* Cos'è un bivacco */}
      {isBivacco && (
        <Block icon={<Info size={14} className="text-alpenglow" />} title={labels.aboutBivouacTitle}>
          <p className="leading-relaxed text-snow/75">{pickLocalized(locale, ABOUT_BIVOUAC)}</p>
        </Block>
      )}
    </div>
  );
}

function labelEffortPrefix(locale: string): string {
  return pickLocalized(locale, {
    it: 'Difficoltà dei sentieri di accesso:',
    en: 'Difficulty of the access trails:',
    fr: "Difficulté des sentiers d'accès :",
    de: 'Schwierigkeit der Zustiegswege:',
  });
}
function labelCai(locale: string): string {
  return pickLocalized(locale, { it: 'scala CAI', en: 'CAI scale', fr: 'échelle CAI', de: 'CAI-Skala' });
}

const BRING_BIVACCO = {
  it: "Tutto l'occorrente per l'autonomia: sacco a pelo e materassino (spesso assenti o minimi), cibo e acqua o un piccolo fornello, abbigliamento a strati e antivento, pila frontale, kit di primo soccorso. Non serve denaro — il bivacco è gratuito. Porta via ogni rifiuto.",
  en: 'Everything you need to be self-sufficient: sleeping bag and mat (often absent or minimal), food and water or a small stove, layered and windproof clothing, a headlamp, a first-aid kit. No money is needed — the bivouac is free. Carry out all your waste.',
  fr: "Tout le nécessaire pour être autonome : sac de couchage et matelas (souvent absents ou minimes), nourriture et eau ou un petit réchaud, vêtements en couches et coupe-vent, lampe frontale, trousse de secours. Pas besoin d'argent — le bivouac est gratuit. Remportez tous vos déchets.",
  de: 'Alles für die Selbstversorgung: Schlafsack und Matte (oft fehlend oder minimal), Essen und Wasser oder ein kleiner Kocher, Kleidung im Zwiebellook und winddicht, Stirnlampe, Erste-Hilfe-Set. Geld ist nicht nötig — der Biwak ist kostenlos. Nimm allen Müll wieder mit.',
};

const BRING_RIFUGIO = {
  it: 'Sacco-lenzuolo (obbligatorio in molti rifugi), contanti (in quota spesso non si paga con carta), ricambio e strati caldi per la sera, pila frontale, borraccia. Prenota sempre in anticipo posto letto e pasti, e avvisa in caso di rinuncia.',
  en: 'A sleeping-bag liner (required in many huts), cash (cards are often not accepted at altitude), a change of clothes and warm layers for the evening, a headlamp, a water bottle. Always book your bed and meals in advance, and let the hut know if you cancel.',
  fr: "Un drap-sac (obligatoire dans de nombreux refuges), des espèces (en altitude la carte passe rarement), des vêtements de rechange et des couches chaudes pour le soir, une lampe frontale, une gourde. Réservez toujours à l'avance lit et repas, et prévenez en cas d'annulation.",
  de: 'Ein Hüttenschlafsack (in vielen Hütten Pflicht), Bargeld (in der Höhe wird oft keine Karte akzeptiert), Wechselkleidung und warme Schichten für den Abend, Stirnlampe, Trinkflasche. Buche Bett und Mahlzeiten stets im Voraus und sag bei Absage Bescheid.',
};

const DO_BIVACCO = {
  it: "Se pernotti, concediti il silenzio e il cielo stellato lontano da ogni luce. La ricompensa di chi sale fin quassù è l'alba dall'alta quota: svegliati presto, quando l'aria è ancora limpida, e guardala accendersi sulle creste. Le cime e i colli raggiungibili dipendono dalla zona — verifica gli itinerari sulle schede dei sentieri qui sopra.",
  en: 'If you stay overnight, enjoy the silence and the starry sky far from any light. The reward for climbing this high is dawn from altitude: wake early, while the air is still clear, and watch it set the ridges alight. Which summits and passes you can reach depends on the area — check the routes on the trail pages above.',
  fr: "Si vous passez la nuit, savourez le silence et le ciel étoilé loin de toute lumière. La récompense de qui monte jusqu'ici, c'est l'aube en altitude : réveillez-vous tôt, tant que l'air est limpide, et regardez-la embraser les crêtes. Les sommets et cols accessibles dépendent de la zone — consultez les itinéraires sur les fiches des sentiers ci-dessus.",
  de: 'Wer übernachtet, genießt die Stille und den Sternenhimmel fernab jeden Lichts. Der Lohn für den Aufstieg bis hierher ist die Morgendämmerung in der Höhe: früh aufstehen, solange die Luft klar ist, und zusehen, wie sie die Grate erglühen lässt. Welche Gipfel und Pässe erreichbar sind, hängt vom Gebiet ab — prüfe die Routen auf den Wegeseiten oben.',
};

const DO_RIFUGIO = {
  it: 'Goditi la cena in compagnia e il tramonto dalla terrazza. Molti usano il rifugio come base per una partenza all\'alba: chiedi al gestore le condizioni del sentiero e del meteo prima di muoverti, e parti leggero quando la neve è ancora compatta. Gli itinerari di salita sono nelle schede dei sentieri qui sopra.',
  en: 'Enjoy dinner in good company and the sunset from the terrace. Many use the hut as a base for a dawn departure: ask the keeper about trail and weather conditions before setting out, and start light while the snow is still firm. The climbing routes are on the trail pages above.',
  fr: "Profitez du dîner en bonne compagnie et du coucher de soleil depuis la terrasse. Beaucoup utilisent le refuge comme base pour un départ à l'aube : demandez au gardien l'état du sentier et la météo avant de partir, et partez léger tant que la neige est ferme. Les itinéraires de montée figurent sur les fiches des sentiers ci-dessus.",
  de: 'Genieße das Abendessen in Gesellschaft und den Sonnenuntergang von der Terrasse. Viele nutzen die Hütte als Basis für einen Aufbruch im Morgengrauen: Frag den Wirt vor dem Start nach Wege- und Wetterlage und brich leicht auf, solange der Schnee fest ist. Die Aufstiegsrouten findest du auf den Wegeseiten oben.',
};

const ABOUT_BIVOUAC = {
  it: "Un bivacco è un piccolo riparo non gestito, sempre aperto e gratuito, posto in alta quota là dove un rifugio non potrebbe esistere. Nasce per spezzare lunghe traversate, per attendere le prime luci prima di una salita o come riparo d'emergenza in caso di maltempo. Non c'è custode né servizi: si trova ciò che chi è passato prima ha lasciato. Per questo vale una regola d'oro — lasciarlo pulito e in ordine come lo si vorrebbe trovare.",
  en: 'A bivouac is a small unmanned shelter, always open and free, placed at high altitude where a staffed hut could not exist. It was conceived to break up long traverses, to wait for first light before a climb, or as an emergency shelter in bad weather. There is no keeper and no services: you find what those before you have left. Hence the golden rule — leave it as clean and tidy as you would wish to find it.',
  fr: "Un bivouac est un petit abri non gardé, toujours ouvert et gratuit, placé en altitude là où un refuge ne pourrait exister. Il sert à fractionner de longues traversées, à attendre les premières lueurs avant une ascension ou d'abri d'urgence par mauvais temps. Pas de gardien ni de services : on trouve ce que les précédents ont laissé. D'où la règle d'or — le laisser aussi propre et rangé qu'on aimerait le trouver.",
  de: 'Ein Biwak ist ein kleiner unbewirtschafteter Unterstand, stets offen und kostenlos, dort in der Höhe platziert, wo eine bewirtschaftete Hütte nicht bestehen könnte. Es dient dazu, lange Überschreitungen zu teilen, vor einem Aufstieg das erste Licht abzuwarten, oder als Notunterkunft bei Schlechtwetter. Es gibt keinen Wirt und keine Dienste: Man findet, was die Vorgänger hinterlassen haben. Daher die goldene Regel — es so sauber und ordentlich hinterlassen, wie man es vorfinden möchte.',
};
