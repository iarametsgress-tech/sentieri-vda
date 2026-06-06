import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import TrailHubPage from '@/components/TrailHubPage';
import { SITE_URL } from '@/lib/config';
import { buildHubJsonLd } from '@/lib/hub-jsonld';
import {
  computeTrailStats,
  formatDifficultyRange,
  getAllMassifHubs,
  getHubHeroImage,
  getMassifHubBySlug,
} from '@/lib/hubs';
import { getMassifGroupById, getMassifLabel } from '@/lib/environment';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import type { Difficulty } from '@/lib/types';

export function generateStaticParams() {
  return getAllMassifHubs().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const hub = getMassifHubBySlug(slug);
  if (!hub) return {};
  const group = getMassifGroupById(hub.massifId);
  const massifName = group ? getMassifLabel(group, locale) : hub.massifId;

  const t = await getTranslations({ locale, namespace: 'TrailHubs.massif' });
  const title = t('metaTitle', { massif: massifName, count: hub.count });
  const description = t('metaDescription', { massif: massifName, count: hub.count });
  const path = `/sentieri/montagna/${slug}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: group?.primary.image ?? getHubHeroImage(hub.trails) }],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages: localeAlternatesAbsolute(path),
    },
  };
}

export default async function MassifHubPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const hub = getMassifHubBySlug(slug);
  if (!hub) notFound();

  const group = getMassifGroupById(hub.massifId);
  const massifName = group ? getMassifLabel(group, locale) : hub.massifId;

  const t = await getTranslations('TrailHubs');
  const tMassif = await getTranslations('TrailHubs.massif');
  const tDiff = await getTranslations('Difficulty');
  const stats = computeTrailStats(hub.trails);
  const diffLabels = Object.fromEntries(
    (['T', 'E', 'EE', 'EEA', 'A'] as Difficulty[]).map((d) => [d, tDiff(d)]),
  ) as Record<Difficulty, string>;
  const diffRange = formatDifficultyRange(stats.difficulties, locale, diffLabels);

  const title = tMassif('title', { massif: massifName, count: hub.count });
  const intro = tMassif('intro', {
    count: hub.count,
    massif: massifName,
    diffRange,
    minGain: stats.minGain,
    maxGain: stats.maxGain,
  });

  const path = `/sentieri/montagna/${slug}`;
  const jsonLd = buildHubJsonLd({
    locale,
    pagePath: path,
    pageName: title,
    pageDescription: intro,
    trails: hub.trails,
    breadcrumbs: [
      { name: t('breadcrumbHome'), path: '' },
      { name: t('breadcrumbTrails'), path: '/sentieri' },
      { name: massifName, path },
    ],
  });

  return (
    <TrailHubPage
      eyebrow={tMassif('eyebrow')}
      title={title}
      intro={intro}
      trails={hub.trails}
      heroImage={group?.primary.image ?? getHubHeroImage(hub.trails)}
      heroAlt={title}
      breadcrumbs={[
        { label: t('breadcrumbHome'), href: '/' },
        { label: t('breadcrumbTrails'), href: '/sentieri' },
        { label: massifName },
      ]}
      deepen={{
        prefix: t('deepenPrefix'),
        label: massifName,
        href: `/ambiente/montagne/${hub.massifId}`,
      }}
      jsonLd={jsonLd}
    />
  );
}
