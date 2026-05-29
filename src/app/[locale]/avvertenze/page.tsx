import { setRequestLocale } from 'next-intl/server';
import { AlertTriangle, Phone } from 'lucide-react';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isIT = locale === 'it';
  return {
    title: isIT ? 'Sicurezza in montagna — Avvertenze' : 'Mountain Safety — Warnings',
    description: isIT
      ? "Equipaggiamento, meteo, segnali di pericolo, soccorso alpino: tutto quello che devi sapere prima di partire per un sentiero valdostano."
      : 'Equipment, weather, warning signs, mountain rescue: everything you need to know before setting out on an Aosta Valley trail.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/avvertenze`,
      languages: {
        it: `${SITE_URL}/it/avvertenze`,
        en: `${SITE_URL}/en/avvertenze`,
      },
    },
  };
}

export default async function AvvertenzePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isIT = locale === 'it';

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-yellow-500" />
          </div>
          <p className="text-xs font-mono tracking-widest text-yellow-500/80 uppercase">
            {isIT ? 'Sicurezza in montagna' : 'Mountain safety'}
          </p>
        </div>

        <h1 className="font-display text-display-lg tracking-tighter mb-4">
          {isIT ? 'Prima di partire, leggere.' : 'Read before you go.'}
        </h1>

        {/* Emergency callout */}
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 mb-12">
          <Phone size={20} className="text-yellow-500 flex-shrink-0" />
          <div>
            <p className="text-snow font-semibold text-sm">
              {isIT ? 'Emergenza: Soccorso Alpino 118' : 'Emergency: Mountain Rescue 118'}
            </p>
            <p className="text-snow/50 text-xs mt-0.5">
              {isIT
                ? 'Numero unico di emergenza valido su tutto il territorio italiano, gratuito, h24.'
                : 'Single emergency number valid throughout Italy, free of charge, 24/7.'}
            </p>
          </div>
        </div>

        {isIT ? (
          <div className="space-y-10 text-snow/60 text-sm leading-relaxed">
            <section>
              <h2 className="text-snow font-semibold mb-3 text-base">
                Responsabilità individuale
              </h2>
              <p>
                Le informazioni presenti su questo sito hanno carattere divulgativo. I sentieri
                cambiano nel tempo: frane, erosioni, neve tardiva, tratti chiusi per interventi
                forestali. Prima di partire, verifica sempre le condizioni attuali sul sito della
                Regione Valle d&apos;Aosta, al rifugio più vicino o presso la sezione CAI locale.
                La montagna richiede giudizio personale: nessun sito web può sostituire la tua
                valutazione diretta delle condizioni sul campo.
              </p>
            </section>

            <section>
              <h2 className="text-snow font-semibold mb-3 text-base">
                Equipaggiamento minimo
              </h2>
              <p className="mb-3">
                Per i sentieri classificati E (Escursionistico) e superiori, l&apos;equipaggiamento
                minimo raccomandato include:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-snow/50">
                <li>Scarpe da trekking con suola vibram e supporto alla caviglia</li>
                <li>Abbigliamento a strati: base termica, pile, giacca impermeabile antivento</li>
                <li>Zaino con acqua (almeno 1,5 L per giornata estiva), cibo di riserva</li>
                <li>Carta topografica 1:25.000 o app offline (Maps.me, Gaia GPS, OsmAnd)</li>
                <li>Telefono carico con numero di emergenza 118 salvato</li>
                <li>Kit di pronto soccorso minimo: cerotti, benda, disinfettante, coperta termica</li>
                <li>Bastoncini da trekking (consigliati su percorsi con molto dislivello)</li>
                <li>Crema solare ad alto fattore e occhiali da sole anche in quota</li>
              </ul>
            </section>

            <section>
              <h2 className="text-snow font-semibold mb-3 text-base">Meteo</h2>
              <p>
                Il meteo in quota cambia rapidamente. Controlla sempre le previsioni nelle 24 ore
                precedenti la partenza su Arpa Valle d&apos;Aosta (arpa.vda.it) o Meteo France
                per le zone di confine. Attenzione ai temporali pomeridiani in estate: inizia
                le escursioni presto al mattino e scendi prima delle 13:00 se il cielo si
                copre. Non fermarti sui crinali o sotto pareti rocciose durante i temporali.
                La grandine e il fulmine sono i pericoli più sottovalutati in alta quota.
              </p>
            </section>

            <section>
              <h2 className="text-snow font-semibold mb-3 text-base">
                Segnali di pericolo da riconoscere
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-snow/50">
                <li>Cielo che si scurisce rapidamente a ovest con nubi a sviluppo verticale</li>
                <li>Calo repentino di temperatura anche in estate</li>
                <li>Sentiero coperto da neve molle o ghiaccio oltre le 2.500 m anche in giugno</li>
                <li>Segnaletica danneggiata o assente (torna indietro se perdi il filo)</li>
                <li>Stanchezza eccessiva o capogiri: sono segnali da non ignorare</li>
                <li>Mal di montagna (AMS): mal di testa pulsante, nausea, mancanza di respiro</li>
              </ul>
            </section>

            <section>
              <h2 className="text-snow font-semibold mb-3 text-base">
                Soccorso Alpino: cosa fare in caso di emergenza
              </h2>
              <p className="mb-3">
                In caso di incidente o blocco in quota, chiama il 118 (Soccorso Alpino) e
                comunica:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-snow/50">
                <li>Il tuo nome e cognome</li>
                <li>La posizione più precisa possibile (nome sentiero, rifugio più vicino, quota approssimativa)</li>
                <li>Il numero di persone coinvolte e le condizioni</li>
                <li>Il numero di telefono da cui chiami</li>
              </ol>
              <p className="mt-3">
                Se non hai copertura telefonica, usa il segnale internazionale di soccorso: 6
                segnali visivi o acustici al minuto, ripetuti ogni minuto. In Valle d&apos;Aosta il
                soccorso alpino è garantito dal Soccorso Alpino Valdostano (SAV), attivo h24.
                Non aspettare: chiedi aiuto il prima possibile.
              </p>
            </section>

            <section>
              <h2 className="text-snow font-semibold mb-3 text-base">
                Bambini e cani in montagna
              </h2>
              <p>
                Con bambini piccoli scegli percorsi T (Turistico) con basso dislivello e buona
                segnaletica. I bambini si stancano prima e hanno una termoregolazione meno
                efficiente. Con i cani verifica preventivamente se il sentiero attraversa aree
                di protezione faunistica dove sono previsto obbligo di guinzaglio. Nel Parco
                Nazionale Gran Paradiso il cane deve essere tenuto al guinzaglio su tutti i
                percorsi.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-10 text-snow/60 text-sm leading-relaxed">
            <section>
              <h2 className="text-snow font-semibold mb-3 text-base">
                Individual responsibility
              </h2>
              <p>
                The information on this site is for general guidance only. Trails change over
                time: landslides, erosion, late snow, sections closed for forestry work. Before
                setting out, always check current conditions on the Aosta Valley Region website,
                at the nearest refuge or with the local CAI section. The mountains require
                personal judgement: no website can replace your direct assessment of conditions
                in the field.
              </p>
            </section>

            <section>
              <h2 className="text-snow font-semibold mb-3 text-base">
                Minimum equipment
              </h2>
              <p className="mb-3">
                For trails classified E (Hiker) and above, the minimum recommended equipment
                includes:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-snow/50">
                <li>Trekking boots with Vibram sole and ankle support</li>
                <li>Layered clothing: thermal base, fleece, waterproof windproof jacket</li>
                <li>Rucksack with water (at least 1.5 L for a summer day), emergency food</li>
                <li>1:25,000 topographic map or offline app (Maps.me, Gaia GPS, OsmAnd)</li>
                <li>Charged phone with emergency number 118 saved</li>
                <li>Basic first-aid kit: plasters, bandage, antiseptic, emergency blanket</li>
                <li>Trekking poles (recommended on routes with significant elevation gain)</li>
                <li>High-factor sunscreen and sunglasses even at altitude</li>
              </ul>
            </section>

            <section>
              <h2 className="text-snow font-semibold mb-3 text-base">Weather</h2>
              <p>
                Mountain weather changes quickly. Always check forecasts for the 24 hours before
                departure on Arpa Valle d&apos;Aosta (arpa.vda.it) or Météo France for border
                areas. Watch out for afternoon thunderstorms in summer: start hikes early in
                the morning and descend before 1 pm if the sky clouds over. Do not stop on
                ridgelines or under rock faces during storms. Hail and lightning are the most
                underestimated hazards at altitude.
              </p>
            </section>

            <section>
              <h2 className="text-snow font-semibold mb-3 text-base">
                Warning signs to recognise
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-snow/50">
                <li>Sky rapidly darkening to the west with vertically developing clouds</li>
                <li>Sudden temperature drop even in summer</li>
                <li>Trail covered by soft snow or ice above 2,500 m even in June</li>
                <li>Damaged or absent trail markings (turn back if you lose the route)</li>
                <li>Excessive fatigue or dizziness: warning signs not to be ignored</li>
                <li>Altitude sickness (AMS): pounding headache, nausea, shortness of breath</li>
              </ul>
            </section>

            <section>
              <h2 className="text-snow font-semibold mb-3 text-base">
                Mountain Rescue: what to do in an emergency
              </h2>
              <p className="mb-3">
                In the event of an accident or becoming stranded at altitude, call 118 (Mountain
                Rescue) and provide:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-snow/50">
                <li>Your full name</li>
                <li>Your most precise location (trail name, nearest refuge, approximate altitude)</li>
                <li>The number of people involved and their condition</li>
                <li>The phone number you are calling from</li>
              </ol>
              <p className="mt-3">
                If you have no phone signal, use the international distress signal: 6 visual or
                acoustic signals per minute, repeated every minute. In Aosta Valley mountain
                rescue is provided by the Soccorso Alpino Valdostano (SAV), active 24/7.
                Don&apos;t wait: call for help as soon as possible.
              </p>
            </section>

            <section>
              <h2 className="text-snow font-semibold mb-3 text-base">
                Children and dogs in the mountains
              </h2>
              <p>
                With young children choose T (Tourist) routes with low elevation gain and good
                signage. Children tire faster and have less efficient thermoregulation. With
                dogs, check in advance whether the trail passes through wildlife protection
                areas where leads are required. In Gran Paradiso National Park dogs must be
                kept on a lead on all routes.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
