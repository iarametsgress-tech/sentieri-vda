import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import SectionPageHero from '@/components/SectionPageHero';
import AdSlot from '@/components/AdSlot';
import { TourCatalogSkeleton } from '@/components/SectionExplorerSkeleton';
import TourCatalogSection from '@/components/sections/TourCatalogSection';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Tour.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/tour`,
      languages: localeAlternatesAbsolute('/tour'),
    },
  };
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Tour');

  return (
    <div>
      <SectionPageHero
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        section="tour"
        locale={locale}
      />

      <Suspense fallback={<TourCatalogSkeleton />}>
        <TourCatalogSection />
      </Suspense>

      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <AdSlot slot="footer-leaderboard" />
      </div>
    </div>
  );
}
