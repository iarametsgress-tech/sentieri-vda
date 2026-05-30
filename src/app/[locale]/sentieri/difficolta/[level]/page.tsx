import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import TrailHubPage from '@/components/TrailHubPage';
import { SITE_URL } from '@/lib/config';
import { buildHubJsonLd } from '@/lib/hub-jsonld';
import {
  computeTrailStats,
  formatDifficultyRange,
  getAllDifficultyHubs,
  getDifficultyHubBySlug,
  getHubHeroImage,
} from '@/lib/hubs';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import type { Difficulty } from '@/lib/types';

export function generateStaticParams() {
  return getAllDifficultyHubs().map(({ slug }) => ({ level: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; level: string }>;
}) {
  const { locale, level } = await params;
  const hub = getDifficultyHubBySlug(level);
  if (!hub) return {};
  const t = await getTranslations({ locale, namespace: 'TrailHubs.difficulty' });
  const label = t(`labels.${hub.slug}`);
  const title = t('metaTitle', { label, count: hub.count });
  const description = t('metaDescription', { label, count: hub.count });
  const path = `/sentieri/difficolta/${level}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: getHubHeroImage(hub.trails) }],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages: localeAlternatesAbsolute(path),
    },
  };
}

export default async function DifficultyHubPage({
  params,
}: {
  params: Promise<{ locale: string; level: string }>;
}) {
  const { locale, level } = await params;
  setRequestLocale(locale);

  const hub = getDifficultyHubBySlug(level);
  if (!hub) notFound();

  const t = await getTranslations('TrailHubs');
  const tDiffHub = await getTranslations('TrailHubs.difficulty');
  const tDiff = await getTranslations('Difficulty');
  const label = tDiffHub(`labels.${hub.slug}`);
  const stats = computeTrailStats(hub.trails);
  const diffLabels = Object.fromEntries(
    (['T', 'E', 'EE', 'EEA', 'A'] as Difficulty[]).map((d) => [d, tDiff(d)]),
  ) as Record<Difficulty, string>;
  const diffRange = formatDifficultyRange(stats.difficulties, locale, diffLabels);

  const title = tDiffHub('title', { label, count: hub.count });
  const intro = tDiffHub('intro', {
    count: hub.count,
    label,
    diffRange,
    minGain: stats.minGain,
    maxGain: stats.maxGain,
    minDistance: stats.minDistance.toFixed(1),
    maxDistance: stats.maxDistance.toFixed(1),
  });

  const path = `/sentieri/difficolta/${level}`;
  const jsonLd = buildHubJsonLd({
    locale,
    pagePath: path,
    pageName: title,
    pageDescription: intro,
    trails: hub.trails,
    breadcrumbs: [
      { name: t('breadcrumbHome'), path: '' },
      { name: t('breadcrumbTrails'), path: '/sentieri' },
      { name: label, path },
    ],
  });

  return (
    <TrailHubPage
      eyebrow={tDiffHub('eyebrow')}
      title={title}
      intro={intro}
      trails={hub.trails}
      heroImage={getHubHeroImage(hub.trails)}
      heroAlt={title}
      breadcrumbs={[
        { label: t('breadcrumbHome'), href: '/' },
        { label: t('breadcrumbTrails'), href: '/sentieri' },
        { label: label },
      ]}
      jsonLd={jsonLd}
    />
  );
}
