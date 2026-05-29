import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getAllTrails } from '@/lib/trails';
import TrailsExplorer from '@/components/TrailsExplorer';
import SectionPageHero from '@/components/SectionPageHero';
import AdSlot from '@/components/AdSlot';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'it' ? "Tutti i sentieri della Valle d'Aosta" : "All Aosta Valley trails",
  };
}

export default async function TrailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { locale } = await params;
  const { tag } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('Trails');
  const trails = getAllTrails();

  return (
    <div>
      <SectionPageHero
        eyebrow={t('heroEyebrow')}
        title={t('title')}
        subtitle={t('heroSubtitle', { count: trails.length })}
        section="sentieri"
        locale={locale}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
        <AdSlot slot="header-billboard" className="mb-12" />
        <TrailsExplorer trails={trails} initialTag={tag} />
      </div>
    </div>
  );
}
