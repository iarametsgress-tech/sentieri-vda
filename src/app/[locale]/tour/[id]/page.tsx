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
  const geojson = mergeTrailsGeoJSON(stages.map((s) => s.slug), 140);

  // Il badge tappa va messo ESATTAMENTE sulla traccia: prendiamo il punto a
  // metà percorso del segmento di quella tappa (sempre sulla linea disegnata,
  // ben distribuito lungo l'anello e non ammucchiato agli incroci fra tappe).
  const lineCoordsBySlug = new Map<string, [number, number][]>();
  for (const f of geojson?.features ?? []) {
    const slug = (f.properties as { slug?: string } | null)?.slug;
    if (!slug || f.geometry.type !== 'LineString') continue;
    const coords = f.geometry.coordinates as [number, number][];
    const existing = lineCoordsBySlug.get(slug);
    if (existing) existing.push(...coords);
    else lineCoordsBySlug.set(slug, [...coords]);
  }
  const midpointOf = (
    slug: string,
    fallback: [number, number]
  ): [number, number] => {
    const coords = lineCoordsBySlug.get(slug);
    if (!coords?.length) return fallback;
    // punto a metà lunghezza cumulata della traccia
    let total = 0;
    for (let i = 1; i < coords.length; i++) {
      const dx = coords[i][0] - coords[i - 1][0];
      const dy = coords[i][1] - coords[i - 1][1];
      total += Math.hypot(dx, dy);
    }
    let acc = 0;
    for (let i = 1; i < coords.length; i++) {
      const dx = coords[i][0] - coords[i - 1][0];
      const dy = coords[i][1] - coords[i - 1][1];
      acc += Math.hypot(dx, dy);
      if (acc >= total / 2) return [coords[i][0], coords[i][1]];
    }
    return [coords[coords.length - 1][0], coords[coords.length - 1][1]];
  };

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
    geojson,
    // Un badge numerato sulla partenza di ogni tappa, cliccabile verso la scheda
    markers: stages.map((s, i) => ({
      coords: midpointOf(s.slug, [s.start.coords.lng, s.start.coords.lat]),
      label: `${t('stageLabel')} ${i + 1} · ${s.start.name} → ${s.end.name}`,
      elevation: s.start.elevation_m,
      type: 'stage' as const,
      number: i + 1,
      href: `/${locale}/sentieri/${s.slug}`,
      color: TOUR_LINE_COLORS[tourId],
    })),
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
