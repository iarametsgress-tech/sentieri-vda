import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import TrailHubPage from '@/components/TrailHubPage';
import { SITE_URL } from '@/lib/config';
import { buildHubJsonLd } from '@/lib/hub-jsonld';
import {
  computeTrailStats,
  formatDifficultyRange,
  getAllValleyHubs,
  getHubHeroImage,
  getValleyHubBySlug,
} from '@/lib/hubs';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import type { Difficulty } from '@/lib/types';

export function generateStaticParams() {
  return getAllValleyHubs().map(({ slug }) => ({ valley: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; valley: string }>;
}) {
  const { locale, valley } = await params;
  const hub = getValleyHubBySlug(valley);
  if (!hub) return {};
  const t = await getTranslations({ locale, namespace: 'TrailHubs.valley' });
  const title = t('metaTitle', { valley: hub.label, count: hub.count });
  const description = t('metaDescription', { valley: hub.label, count: hub.count });
  const path = `/sentieri/valle/${valley}`;
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

export default async function ValleyHubPage({
  params,
}: {
  params: Promise<{ locale: string; valley: string }>;
}) {
  const { locale, valley } = await params;
  setRequestLocale(locale);

  const hub = getValleyHubBySlug(valley);
  if (!hub) notFound();

  const t = await getTranslations('TrailHubs');
  const tValley = await getTranslations('TrailHubs.valley');
  const tDiff = await getTranslations('Difficulty');
  const stats = computeTrailStats(hub.trails);
  const diffLabels = Object.fromEntries(
    (['T', 'E', 'EE', 'EEA', 'A'] as Difficulty[]).map((d) => [d, tDiff(d)]),
  ) as Record<Difficulty, string>;
  const diffRange = formatDifficultyRange(stats.difficulties, locale, diffLabels);

  const title = tValley('title', { valley: hub.label, count: hub.count });
  const intro = tValley('intro', {
    count: hub.count,
    valley: hub.label,
    diffRange,
    minGain: stats.minGain,
    maxGain: stats.maxGain,
  });

  const path = `/sentieri/valle/${valley}`;
  const jsonLd = buildHubJsonLd({
    locale,
    pagePath: path,
    pageName: title,
    pageDescription: intro,
    trails: hub.trails,
    breadcrumbs: [
      { name: t('breadcrumbHome'), path: '' },
      { name: t('breadcrumbTrails'), path: '/sentieri' },
      { name: hub.label, path },
    ],
  });

  return (
    <TrailHubPage
      eyebrow={tValley('eyebrow')}
      title={title}
      intro={intro}
      trails={hub.trails}
      heroImage={getHubHeroImage(hub.trails)}
      heroAlt={title}
      breadcrumbs={[
        { label: t('breadcrumbHome'), href: '/' },
        { label: t('breadcrumbTrails'), href: '/sentieri' },
        { label: hub.label },
      ]}
      jsonLd={jsonLd}
    />
  );
}
