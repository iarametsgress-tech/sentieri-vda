import { ExternalLink } from 'lucide-react';
import CulturaFoodWineCard from '@/components/cultura/CulturaFoodWineCard';
import CulturaStaticDivider from '@/components/cultura/CulturaStaticDivider';
import { getAllFoodWine } from '@/lib/culture';
import { topicClasses } from '@/lib/topic-themes';
import { cn } from '@/lib/cn';
import { getTranslations } from 'next-intl/server';

export default async function CulturaCiboSection({ locale }: { locale: string }) {
  const t = await getTranslations('Cultura');
  const foodWine = getAllFoodWine();
  const isIT = locale === 'it';

  return (
    <>
      <CulturaStaticDivider
        image="/cultura/fontina.jpg"
        title={isIT ? 'Cibo e Vino' : 'Food & Wine'}
        subtitle={
          isIT
            ? "Fontina DOP, Jambon de Bosses, Lardo d'Arnad — i sapori autentici dell'alta quota valdostana"
            : 'Fontina PDO, Jambon de Bosses, Lardo d\'Arnad — the authentic flavours of Valdostan high altitude'
        }
      />

      <section
        id="cibo-vino"
        className={cn('defer-render scroll-mt-36 py-16 lg:py-24', topicClasses('food').section)}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 max-w-2xl">
            <p
              className={cn(
                'mb-3 font-mono text-[11px] uppercase tracking-[0.3em]',
                topicClasses('food').eyebrow
              )}
            >
              {isIT ? 'Enogastronomia' : 'Food & wine'}
            </p>
            <h2 className="mb-4 font-display text-display-md tracking-tighter">{t('ciboTitle')}</h2>
            <p className="leading-relaxed text-snow/55">{t('ciboSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {foodWine.map((item) => (
              <CulturaFoodWineCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 bg-white/[0.01] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
          <p className="mx-auto mb-4 max-w-xl text-sm leading-relaxed text-snow/50">
            {t('vdaFooterNote')}
          </p>
          <a
            href="https://www.lovevda.it/it/territorio-e-cultura"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-alpenglow/30 bg-alpenglow/10 px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-alpenglow transition-colors hover:bg-alpenglow/20 hover:text-snow"
          >
            {t('vdaFooterLink')}
            <ExternalLink size={14} />
          </a>
        </div>
      </section>
    </>
  );
}
