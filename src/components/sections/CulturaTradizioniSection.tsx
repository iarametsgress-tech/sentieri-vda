import CulturaTraditionCard from '@/components/cultura/CulturaTraditionCard';
import CulturaStaticDivider from '@/components/cultura/CulturaStaticDivider';
import { getAllTraditions } from '@/lib/culture';
import { topicClasses } from '@/lib/topic-themes';
import { cn } from '@/lib/cn';
import { getTranslations } from 'next-intl/server';

export default async function CulturaTradizioniSection({ locale }: { locale: string }) {
  const t = await getTranslations('Cultura');
  const traditions = getAllTraditions();
  const isIT = locale === 'it';

  return (
    <>
      <CulturaStaticDivider
        image="/cultura/traditions-divider.jpg"
        title={isIT ? 'Tradizioni' : 'Traditions'}
        subtitle={
          isIT
            ? "Carnevali, costumi, musica e devozione — le radici culturali vive della Valle d'Aosta"
            : 'Carnivals, costumes, music and devotion — the living cultural roots of Aosta Valley'
        }
      />

      <section
        id="tradizioni"
        className={cn(
          'defer-render scroll-mt-36 border-b border-white/5 py-16 lg:py-24',
          topicClasses('traditions').section
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 max-w-2xl">
            <p
              className={cn(
                'mb-3 font-mono text-[11px] uppercase tracking-[0.3em]',
                topicClasses('traditions').eyebrow
              )}
            >
              {isIT ? 'Tradizioni' : 'Traditions'}
            </p>
            <h2 className="mb-4 font-display text-display-md tracking-tighter">
              {t('tradizioniTitle')}
            </h2>
            <p className="leading-relaxed text-snow/55">{t('tradizioniSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {traditions.map((item) => (
              <CulturaTraditionCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
