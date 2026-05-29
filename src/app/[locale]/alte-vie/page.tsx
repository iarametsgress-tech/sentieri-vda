import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Info } from 'lucide-react';
import AdSlot from '@/components/AdSlot';
import SectionPageHero from '@/components/SectionPageHero';
import AlteVieExplorer, { type AlteViaRouteData } from '@/components/AlteVieExplorer';
import { getAlteViaStages, toStageSummary } from '@/lib/alte-vie';
import { mergeTrailsGeoJSON } from '@/lib/gpx';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';

const HERO_AV1 = '/trails/alta-via-1-tappa-16-rifugio-frassati-rifugio-bonatti.jpg';
const HERO_AV2 = '/trails/alta-via-2-tappa-10-cogne-rifugio-sogno-berdze.jpg';

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

  const routes: [AlteViaRouteData, AlteViaRouteData] = [
    buildRouteData('av1', 'alta-via-1', t, HERO_AV1, 'alpenglow', '#D4A574', LOVEVDA_AV1, locale),
    buildRouteData('av2', 'alta-via-2', t, HERO_AV2, 'ice', '#5BC0EB', LOVEVDA_AV2, locale),
  ];

  return (
    <div className="bg-ink">
      <SectionPageHero
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        section="alte-vie"
        locale={locale}
      />

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
