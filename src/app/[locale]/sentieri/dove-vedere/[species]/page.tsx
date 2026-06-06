import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import TrailHubPage from '@/components/TrailHubPage';
import { SITE_URL } from '@/lib/config';
import { buildHubJsonLd } from '@/lib/hub-jsonld';
import {
  computeTrailStats,
  formatDifficultyRange,
  getAllSpeciesHubs,
  getHubHeroImage,
  getSpeciesHubBySlug,
  getSpeciesLocalizedName,
} from '@/lib/hubs';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import { getSpeciesById } from '@/data/species';
import type { Difficulty } from '@/lib/types';

export function generateStaticParams() {
  return getAllSpeciesHubs().map(({ slug }) => ({ species: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; species: string }>;
}) {
  const { locale, species } = await params;
  const hub = getSpeciesHubBySlug(species);
  if (!hub) return {};
  const t = await getTranslations({ locale, namespace: 'TrailHubs.species' });
  const name = getSpeciesLocalizedName(hub.speciesId, locale);
  const title = t('metaTitle', { species: name, count: hub.count });
  const description = t('metaDescription', { species: name, count: hub.count });
  const path = `/sentieri/dove-vedere/${species}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: getSpeciesById(hub.speciesId)?.image ?? getHubHeroImage(hub.trails) }],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages: localeAlternatesAbsolute(path),
    },
  };
}

export default async function SpeciesHubPage({
  params,
}: {
  params: Promise<{ locale: string; species: string }>;
}) {
  const { locale, species } = await params;
  setRequestLocale(locale);

  const hub = getSpeciesHubBySlug(species);
  if (!hub) notFound();

  const t = await getTranslations('TrailHubs');
  const tSpecies = await getTranslations('TrailHubs.species');
  const tDiff = await getTranslations('Difficulty');
  const name = getSpeciesLocalizedName(hub.speciesId, locale);
  const stats = computeTrailStats(hub.trails);
  const diffLabels = Object.fromEntries(
    (['T', 'E', 'EE', 'EEA', 'A'] as Difficulty[]).map((d) => [d, tDiff(d)]),
  ) as Record<Difficulty, string>;
  const diffRange = formatDifficultyRange(stats.difficulties, locale, diffLabels);

  const title = tSpecies('title', { species: name, count: hub.count });
  const intro = tSpecies('intro', {
    count: hub.count,
    species: name,
    diffRange,
    minGain: stats.minGain,
    maxGain: stats.maxGain,
  });

  const path = `/sentieri/dove-vedere/${species}`;
  const jsonLd = buildHubJsonLd({
    locale,
    pagePath: path,
    pageName: title,
    pageDescription: intro,
    trails: hub.trails,
    breadcrumbs: [
      { name: t('breadcrumbHome'), path: '' },
      { name: t('breadcrumbTrails'), path: '/sentieri' },
      { name: name, path },
    ],
  });

  return (
    <TrailHubPage
      eyebrow={tSpecies('eyebrow')}
      title={title}
      intro={intro}
      trails={hub.trails}
      heroImage={getSpeciesById(hub.speciesId)?.image ?? getHubHeroImage(hub.trails)}
      heroAlt={title}
      breadcrumbs={[
        { label: t('breadcrumbHome'), href: '/' },
        { label: t('breadcrumbTrails'), href: '/sentieri' },
        { label: name },
      ]}
      deepen={{
        prefix: t('deepenPrefix'),
        label: name,
        href: `/ambiente?specie=${hub.speciesId}#flora-fauna`,
      }}
      jsonLd={jsonLd}
    />
  );
}
