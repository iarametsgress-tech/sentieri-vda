import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Info } from 'lucide-react';
import AdSlot from '@/components/AdSlot';
import dynamic from 'next/dynamic';
import AlteVieExplorer, { type AlteViaRouteData } from '@/components/AlteVieExplorer';
import { getAlteViaStages, toStageSummary } from '@/lib/alte-vie';
import { mergeTrailsGeoJSON } from '@/lib/gpx';
import type { RouteHighlight } from '@/components/MapView';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';

const AlteVieHeroMap = dynamic(() => import('@/components/AlteVieHeroMap'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-ink/80 animate-pulse" aria-hidden />,
});

const HERO_AV1 = '/alte-vie/alta-via-1.jpg';
const HERO_AV2 = '/alte-vie/alta-via-2.jpg';

const LOVEVDA_AV1 =
  'https://www.lovevda.it/it/sport/escursionismo/alte-vie/alta-via-1';
const LOVEVDA_AV2 =
  'https://www.lovevda.it/it/sport/escursionismo/alte-vie/alta-via-2';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AlteVie.meta' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: [{ url: `${SITE_URL}${HERO_AV1}`, width: 1600, height: 900 }],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/alte-vie`,
      languages: localeAlternatesAbsolute('/alte-vie'),
    },
  };
}

function buildRouteData(
  id: 'av1' | 'av2',
  tag: 'alta-via-1' | 'alta-via-2',
  t: Awaited<ReturnType<typeof getTranslations<'AlteVie'>>>,
  heroImage: string,
  accent: 'alpenglow' | 'ice',
  lineColor: string,
  guideUrl: string,
  locale: string
): AlteViaRouteData {
  const stages = getAlteViaStages(tag);
  const first = stages[0];
  const last = stages[stages.length - 1];
  const prefix = tag;

  return {
    id,
    tag,
    code: id === 'av1' ? 'AV1' : 'AV2',
    name: t(`${id}.name`),
    route: t(`${id}.route`),
    description: t(`${id}.description`),
    stats: {
      km: t(`${id}.statKm`),
      gain: t(`${id}.statGain`),
      stages: t(`${id}.statStages`),
      days: t(`${id}.statDays`),
    },
    difficultyLabel: t(`${id}.difficultyLabel`),
    difficulty: t(`${id}.difficulty`),
    seasonLabel: t(`${id}.seasonLabel`),
    season: t(`${id}.season`),
    badge: t(`${id}.badge`),
    cta: id === 'av1' ? t('av1.ctaStages') : t('av2.cta'),
    heroImage,
    guideUrl,
    accent,
    lineColor,
    stages: stages.map((s) => toStageSummary(s, prefix, locale)),
    geojson: mergeTrailsGeoJSON(stages.map((s) => s.slug)),
    markers: first && last
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

export default async function AlteViePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ route?: string }>;
}) {
  const { locale } = await params;
  const { route: routeParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('AlteVie');

  const initialRouteId = routeParam === 'av2' ? 'av2' : 'av1';

  const av1Stages = getAlteViaStages('alta-via-1');
  const av2Stages = getAlteViaStages('alta-via-2');
  const av1Geo = mergeTrailsGeoJSON(av1Stages.map((s) => s.slug));
  const av2Geo = mergeTrailsGeoJSON(av2Stages.map((s) => s.slug));

  const heroHighlights: RouteHighlight[] = [];
  if (av1Geo && av1Stages[0]) {
    heroHighlights.push({
      id: 'av1',
      geojson: av1Geo,
      lineColor: '#D4A574',
      label: 'AV1',
      href: `/${locale}/alte-vie?route=av1`,
      labelCoords: [av1Stages[0].start.coords.lng, av1Stages[0].start.coords.lat],
    });
  }
  if (av2Geo && av2Stages[0]) {
    heroHighlights.push({
      id: 'av2',
      geojson: av2Geo,
      lineColor: '#5BC0EB',
      label: 'AV2',
      href: `/${locale}/alte-vie?route=av2`,
      labelCoords: [av2Stages[0].start.coords.lng, av2Stages[0].start.coords.lat],
    });
  }

  const routes: [AlteViaRouteData, AlteViaRouteData] = [
    buildRouteData('av1', 'alta-via-1', t, HERO_AV1, 'alpenglow', '#D4A574', LOVEVDA_AV1, locale),
    buildRouteData('av2', 'alta-via-2', t, HERO_AV2, 'ice', '#5BC0EB', LOVEVDA_AV2, locale),
  ];

  return (
    <div className="bg-ink">
      <section className="relative min-h-[52vh] overflow-hidden lg:min-h-[60vh]">
        <AlteVieHeroMap routeHighlights={heroHighlights} />
        <div className="relative z-10 mx-auto flex min-h-[52vh] max-w-7xl flex-col justify-end px-6 pb-14 pt-28 lg:min-h-[60vh] lg:px-10 lg:pb-20">
          <p className="text-on-image-eyebrow mb-5 font-mono text-xs uppercase tracking-[0.3em] text-alpenglow">
            {t('heroEyebrow')}
          </p>
          <h1 className="text-on-image-title font-display text-display-lg mb-6 max-w-4xl tracking-tighter text-snow">
            {t('heroTitle')}
          </h1>
          <p className="text-on-image-body max-w-2xl text-lg leading-relaxed text-snow/90">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <AlteVieExplorer
          routes={routes}
          initialRouteId={initialRouteId}
          labels={{
            mapTitle: t('mapTitle'),
            mapHint: t('mapHint'),
            stagesTitle: t('stagesTitle'),
            viewStage: t('viewStage'),
            compareTitle: t('compareTitle'),
            compareSubtitle: t('compareSubtitle'),
            selectRoute: t('selectRoute'),
            officialGuide: t('officialGuide'),
            stageLabel: t('stageLabel'),
            fromTo: t('fromTo'),
            outsideRegion: t('outsideRegion'),
          }}
        />

        <aside className="mt-16 rounded-xl border border-white/5 bg-white/[0.02] p-6 lg:p-8 flex gap-4">
          <Info size={20} className="text-alpenglow shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm text-snow/55 leading-relaxed">
            {t.rich('legalNote', {
              tourLink: (chunks) => (
                <Link href="/tour" className="text-alpenglow hover:underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </aside>

        <div className="mt-12">
          <AdSlot slot="footer-leaderboard" />
        </div>
      </div>
    </div>
  );
}
