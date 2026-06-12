import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import SectionPageHero from '@/components/SectionPageHero';
import AdSlot from '@/components/AdSlot';
import TourRouteExplorer, { type TourRouteData } from '@/components/TourRouteExplorer';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import { buildTourJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo';
import { mergeTrailsGeoJSON } from '@/lib/gpx';
import {
  TOUR_IDS,
  TOUR_TAGS,
  TOUR_HERO_IMAGES,
  TOUR_ACCENTS,
  TOUR_LINE_COLORS,
  TOUR_MESSAGE_KEYS,
  getTourById,
  getTourStages,
  toRouteStageSummary,
  type TourId,
} from '@/lib/tours';

export function generateStaticParams() {
  return TOUR_IDS.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const tourId = getTourById(id);
  if (!tourId) return {};
  const msgKey = TOUR_MESSAGE_KEYS[tourId];
  const t = await getTranslations({ locale, namespace: 'Tour' });
  return {
    title: t(`${msgKey}.name`),
    description: t(`${msgKey}.description`),
    alternates: {
      canonical: `${SITE_URL}/${locale}/tour/${id}`,
      languages: localeAlternatesAbsolute(`/tour/${id}`),
    },
  };
}

function buildTourRoute(
  tourId: TourId,
  t: Awaited<ReturnType<typeof getTranslations<'Tour'>>>,
  locale: string
): TourRouteData {
  const tag = TOUR_TAGS[tourId];
  const msgKey = TOUR_MESSAGE_KEYS[tourId];
  const stages = getTourStages(tag);
  const first = stages[0];
  const last = stages[stages.length - 1];

  return {
    id: tourId,
    tag,
    name: t(`${msgKey}.name`),
    route: t.has(`${msgKey}.vdaSide`) ? t(`${msgKey}.vdaSide`) : t(`${msgKey}.distance`),
    description: t(`${msgKey}.description`),
    stats: {
      km: t(`${msgKey}.distance`),
      vdaSide: t.has(`${msgKey}.vdaSide`) ? t(`${msgKey}.vdaSide`) : undefined,
      stages: t('badgeStages', { count: stages.length }),
    },
    difficultyLabel: t('labels.difficulty'),
    difficulty: t(`${msgKey}.difficulty`),
    seasonLabel: t('labels.season'),
    season: t(`${msgKey}.season`),
    badge: t('badgeStages', { count: stages.length }),
    cta: t(`${msgKey}.cta`),
    heroImage: TOUR_HERO_IMAGES[tourId],
    accent: TOUR_ACCENTS[tourId],
    lineColor: TOUR_LINE_COLORS[tourId],
    stages: stages.map((s) => toRouteStageSummary(s, tag, locale)),
    geojson: mergeTrailsGeoJSON(stages.map((s) => s.slug), 140),
    markers:
      first && last
        ? [
            {
              coords: [first.start.coords.lng, first.start.coords.lat] as [number, number],
              label: first.start.name,
              elevation: first.start.elevation_m,
              type: 'start' as const,
            },
            {
              coords: [last.end.coords.lng, last.end.coords.lat] as [number, number],
              label: last.end.name,
              elevation: last.end.elevation_m,
              type: 'end' as const,
            },
          ]
        : [],
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const tourId = getTourById(id);
  if (!tourId) notFound();

  setRequestLocale(locale);
  const t = await getTranslations('Tour');
  const route = buildTourRoute(tourId, t, locale);

  const tourJsonLd = buildTourJsonLd({
    locale,
    id,
    name: route.name,
    description: route.description,
    image: route.heroImage,
    stages: route.stages.map((s) => ({ name: s.name, slug: s.slug })),
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(locale, [
    { name: 'Home', path: `/${locale}` },
    { name: t('heroEyebrow'), path: `/${locale}/tour` },
    { name: route.name, path: `/${locale}/tour/${id}` },
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SectionPageHero
        eyebrow={t('heroEyebrow')}
        title={route.name}
        subtitle={route.description}
        section="tour"
        locale={locale}
        imageSrc={route.heroImage}
        imageAlt={route.name}
      />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <TourRouteExplorer
          route={route}
          labels={{
            backToTours: t('backToTours'),
            mapTitle: t('mapTitle'),
            mapHint: t('mapHint'),
            stagesTitle: t('stagesTitle'),
            viewStage: t('viewStage'),
            stageLabel: t('stageLabel'),
            outsideRegion: t('outsideRegion'),
          }}
        />

        <div className="mt-16">
          <AdSlot slot="footer-leaderboard" />
        </div>
      </div>
    </div>
  );
}
