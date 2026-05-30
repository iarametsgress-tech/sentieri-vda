import CulturaValleyCard from '@/components/cultura/CulturaValleyCard';
import CulturaValleyMap from '@/components/cultura/CulturaValleyMap';
import { getAllValleys } from '@/lib/culture';
import { topicClasses } from '@/lib/topic-themes';
import { cn } from '@/lib/cn';
import { getTranslations } from 'next-intl/server';

export default async function CulturaValliSection({ locale }: { locale: string }) {
  const t = await getTranslations('Cultura');
  const valleys = getAllValleys();
  const isIT = locale === 'it';

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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {valleys.map((valley, index) => (
            <CulturaValleyCard
              key={valley.id}
              valley={valley}
              locale={locale}
              priority={index < 2}
              labels={{
                townsTitle: t('townsTitle'),
                officialSite: t('officialSite'),
                source: t('source'),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
