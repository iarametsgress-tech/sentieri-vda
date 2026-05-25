import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getAllTrails } from '@/lib/trails';
import TrailsExplorer from '@/components/TrailsExplorer';
import AdSlot from '@/components/AdSlot';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'it' ? "Tutti i sentieri della Valle d'Aosta" : "All Aosta Valley trails",
  };
}

export default async function TrailsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Trails');
  const trails = getAllTrails();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <h1 className="font-display text-display-lg tracking-tighter mb-4">{t('title')}</h1>
      <p className="text-snow/60 max-w-2xl mb-12">
        {trails.length} {locale === 'it' ? 'sentieri verificati su fonti ufficiali' : 'trails verified from official sources'}.
      </p>

      <AdSlot slot="header-billboard" className="mb-12" />

      <TrailsExplorer trails={trails} />
    </div>
  );
}
