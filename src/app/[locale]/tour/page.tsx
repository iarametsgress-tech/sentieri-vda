import { setRequestLocale, getTranslations } from 'next-intl/server';
import SectionPageHero from '@/components/SectionPageHero';
import AdSlot from '@/components/AdSlot';
import TourCatalog, { type TourCatalogItem } from '@/components/TourCatalog';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import { countTrailsByTag } from '@/lib/trails';
import {
  TOUR_IDS,
  TOUR_TAGS,
  TOUR_HERO_IMAGES,
  TOUR_ACCENTS,
  TOUR_MESSAGE_KEYS,
  type TourId,
} from '@/lib/tours';

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

  const tours: TourCatalogItem[] = TOUR_IDS.map((id: TourId) => {
    const msgKey = TOUR_MESSAGE_KEYS[id];
    const tag = TOUR_TAGS[id];
    const stageCount = countTrailsByTag(tag);
    return {
      id,
      name: t(`${msgKey}.name`),
      subtitle: t(`${msgKey}.description`),
      image: TOUR_HERO_IMAGES[id],
      stageCount,
      badgeLabel:
        stageCount > 0
          ? t('badgeStages', { count: stageCount })
          : t('badgeSoon'),
      accent: TOUR_ACCENTS[id],
    };
  });

  return (
    <div>
      <SectionPageHero
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        section="tour"
        locale={locale}
      />

      <TourCatalog tours={tours} />

      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <AdSlot slot="footer-leaderboard" />
      </div>
    </div>
  );
}
