import CulturaValleyCard from '@/components/cultura/CulturaValleyCard';
import CulturaValleyMap from '@/components/cultura/CulturaValleyMap';
import { getAllValleys } from '@/lib/culture';
import { topicClasses } from '@/lib/topic-themes';
import { cn } from '@/lib/cn';
import { getTranslations } from 'next-intl/server';

const MACRO_ORDER = ['alta', 'centrale', 'bassa'] as const;

const MACRO_LABELS: Record<
  (typeof MACRO_ORDER)[number],
  { eyebrow: Record<string, string>; title: Record<string, string>; sub: Record<string, string> }
> = {
  alta: {
    eyebrow: { it: 'Alta Valle', en: 'Upper Valley', fr: 'Haute Vallée', de: 'Oberes Tal' },
    title: {
      it: 'Alta Valle',
      en: 'Upper Valley',
      fr: 'Haute Vallée',
      de: 'Oberes Tal',
    },
    sub: {
      it: 'Le valli del Monte Bianco e del Gran Paradiso, dai centri di Arvier e Courmayeur ai grandi massicci: Val Ferret e Veny, Valgrisenche, La Thuile, Val di Cogne, Valsavarenche, Val di Rhêmes, Valpelline e Valle del Gran San Bernardo.',
      en: 'The valleys of Mont Blanc and the Gran Paradiso, from Arvier and Courmayeur to the great massifs: Val Ferret and Veny, Valgrisenche, La Thuile, Cogne, Valsavarenche, Val di Rhêmes, Valpelline and the Great St Bernard valley.',
      fr: 'Les vallées du Mont-Blanc et du Grand-Paradis, d’Arvier et Courmayeur aux grands massifs : Val Ferret et Veny, Valgrisenche, La Thuile, Cogne, Valsavarenche, Val di Rhêmes, Valpelline et vallée du Grand-Saint-Bernard.',
      de: 'Die Täler des Mont Blanc und des Gran Paradiso, von Arvier und Courmayeur bis zu den großen Massiven: Val Ferret und Veny, Valgrisenche, La Thuile, Cogne, Valsavarenche, Val di Rhêmes, Valpelline und das Tal des Grossen Sankt Bernhard.',
    },
  },
  centrale: {
    eyebrow: { it: 'Vallata centrale', en: 'Central Valley', fr: 'Vallée centrale', de: 'Zentrales Tal' },
    title: {
      it: 'Vallata centrale',
      en: 'Central Valley',
      fr: 'Vallée centrale',
      de: 'Zentrales Tal',
    },
    sub: {
      it: 'La conca di Aosta, “Roma delle Alpi”, e i centri da Saint-Vincent a Introd, terra dei grandi castelli (Fénis, Sarre, Saint-Pierre) e dei vigneti d’altura.',
      en: 'The Aosta basin, “Rome of the Alps”, and the towns from Saint-Vincent to Introd, land of the great castles (Fénis, Sarre, Saint-Pierre) and high-altitude vineyards.',
      fr: 'La cuvette d’Aoste, « Rome des Alpes », et les bourgs de Saint-Vincent à Introd, terre des grands châteaux (Fénis, Sarre, Saint-Pierre) et des vignobles d’altitude.',
      de: 'Das Becken von Aosta, „Rom der Alpen“, und die Orte von Saint-Vincent bis Introd, Land der großen Schlösser (Fénis, Sarre, Saint-Pierre) und Höhenweinberge.',
    },
  },
  bassa: {
    eyebrow: { it: 'Bassa Valle', en: 'Lower Valley', fr: 'Basse Vallée', de: 'Unteres Tal' },
    title: {
      it: 'Bassa Valle',
      en: 'Lower Valley',
      fr: 'Basse Vallée',
      de: 'Unteres Tal',
    },
    sub: {
      it: 'La porta della Valle, da Pont-Saint-Martin a Châtillon, fra ponti romani, castelli e vino: Champorcher, Valle del Lys, Valle d’Ayas e Valtournenche, con Arnad e il suo lardo DOP.',
      en: 'The gateway to the valley, from Pont-Saint-Martin to Châtillon, among Roman bridges, castles and wine: Champorcher, the Lys, Ayas and Valtournenche valleys, with Arnad and its PDO lardo.',
      fr: 'La porte de la vallée, de Pont-Saint-Martin à Châtillon, entre ponts romains, châteaux et vin : Champorcher, vallées du Lys, d’Ayas et Valtournenche, avec Arnad et son lard AOP.',
      de: 'Das Tor zum Tal, von Pont-Saint-Martin bis Châtillon, zwischen römischen Brücken, Burgen und Wein: Champorcher, die Täler Lys, Ayas und Valtournenche, mit Arnad und seinem Lardo DOP.',
    },
  },
};

function localeKey(locale: string): string {
  return ['it', 'en', 'fr', 'de'].includes(locale) ? locale : 'it';
}

export default async function CulturaValliSection({ locale }: { locale: string }) {
  const t = await getTranslations('Cultura');
  const valleys = getAllValleys();
  const isIT = locale === 'it';
  const lk = localeKey(locale);

  const valleyMarkers = valleys.map((v) => ({
    id: v.id,
    name:
      locale === 'en'
        ? v.name_en
        : locale === 'fr'
          ? v.name_fr
          : locale === 'de'
            ? v.name_de
            : v.name_it,
  }));

  // Ordina i blocchi "centri principali" del fondovalle in testa a ogni macro.
  const FRONT = new Set(['alta-valle-centri', 'vallata-centrale', 'bassa-valle']);
  const byMacro = MACRO_ORDER.map((macro) => ({
    macro,
    valleys: valleys
      .filter((v) => (v.macro ?? 'alta') === macro)
      .sort((a, b) => Number(FRONT.has(b.id)) - Number(FRONT.has(a.id))),
  }));

  return (
    <section
      id="valli"
      className={cn('scroll-mt-36 border-b border-white/5 py-16 lg:py-24', topicClasses('culture').section)}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 max-w-2xl">
          <p
            className={cn(
              'mb-3 font-mono text-[11px] uppercase tracking-[0.3em]',
              topicClasses('culture').eyebrow
            )}
          >
            {isIT ? 'Valli e comuni' : 'Valleys & towns'}
          </p>
          <h2 className="mb-4 font-display text-display-md tracking-tighter">{t('valliTitle')}</h2>
          <p className="leading-relaxed text-snow/55">{t('valliSubtitle')}</p>
        </div>
        <div className="mb-12">
          <CulturaValleyMap valleys={valleyMarkers} />
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-snow/40">
            {isIT
              ? 'Le valli della Valle d’Aosta e dove si trovano'
              : 'The valleys of Aosta Valley and where they lie'}
          </p>
        </div>
        <div className="space-y-16">
          {byMacro.map(({ macro, valleys: group }, gi) => {
            if (group.length === 0) return null;
            const m = MACRO_LABELS[macro];
            return (
              <div key={macro} id={`macro-${macro}`} className="scroll-mt-36">
                <div className="mb-8 flex items-start gap-4">
                  <span
                    className={cn(
                      'mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-lg',
                      topicClasses('culture').card
                    )}
                  >
                    {gi + 1}
                  </span>
                  <div className="max-w-3xl">
                    <p
                      className={cn(
                        'mb-1 font-mono text-[10px] uppercase tracking-[0.3em]',
                        topicClasses('culture').eyebrow
                      )}
                    >
                      {m.eyebrow[lk]}
                    </p>
                    <h3 className="mb-2 font-display text-2xl tracking-tight text-snow lg:text-3xl">
                      {m.title[lk]}
                    </h3>
                    <p className="text-sm leading-relaxed text-snow/55">{m.sub[lk]}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {group.map((valley, index) => (
                    <CulturaValleyCard
                      key={valley.id}
                      valley={valley}
                      locale={locale}
                      priority={gi === 0 && index < 2}
                      labels={{
                        townsTitle: t('townsTitle'),
                        officialSite: t('officialSite'),
                        source: t('source'),
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
