import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import TrailHubPage from '@/components/TrailHubPage';
import { SITE_URL } from '@/lib/config';
import { buildHubJsonLd } from '@/lib/hub-jsonld';
import {
  computeTrailStats,
  formatDifficultyRange,
  getAllThemeHubs,
  getHubHeroImage,
  getThemeHubBySlug,
} from '@/lib/hubs';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import type { Difficulty } from '@/lib/types';

export function generateStaticParams() {
  return getAllThemeHubs().map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  const hub = getThemeHubBySlug(tag);
  if (!hub) return {};
  const t = await getTranslations({ locale, namespace: 'TrailHubs.theme' });
  const themeLabel = t(`tags.${hub.tag}`, { defaultValue: hub.tag.replace(/-/g, ' ') });
  const title = t('metaTitle', { theme: themeLabel, count: hub.count });
  const description = t('metaDescription', { theme: themeLabel, count: hub.count });
  const path = `/sentieri/tema/${tag}`;
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

export default async function ThemeHubPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  setRequestLocale(locale);

  const hub = getThemeHubBySlug(tag);
  if (!hub) notFound();

  const t = await getTranslations('TrailHubs');
  const tTheme = await getTranslations('TrailHubs.theme');
  const tDiff = await getTranslations('Difficulty');
  const themeLabel = tTheme(`tags.${hub.tag}`, { defaultValue: hub.tag.replace(/-/g, ' ') });
  const stats = computeTrailStats(hub.trails);
  const diffLabels = Object.fromEntries(
    (['T', 'E', 'EE', 'EEA', 'A'] as Difficulty[]).map((d) => [d, tDiff(d)]),
  ) as Record<Difficulty, string>;
  const diffRange = formatDifficultyRange(stats.difficulties, locale, diffLabels);

  const title = tTheme('title', { theme: themeLabel, count: hub.count });
  const intro = tTheme('intro', {
    count: hub.count,
    theme: themeLabel,
    diffRange,
    minGain: stats.minGain,
    maxGain: stats.maxGain,
  });

  const path = `/sentieri/tema/${tag}`;
  const jsonLd = buildHubJsonLd({
    locale,
    pagePath: path,
    pageName: title,
    pageDescription: intro,
    trails: hub.trails,
    breadcrumbs: [
      { name: t('breadcrumbHome'), path: '' },
      { name: t('breadcrumbTrails'), path: '/sentieri' },
      { name: themeLabel, path },
    ],
  });

  return (
    <TrailHubPage
      eyebrow={tTheme('eyebrow')}
      title={title}
      intro={intro}
      trails={hub.trails}
      heroImage={getHubHeroImage(hub.trails)}
      heroAlt={title}
      breadcrumbs={[
        { label: t('breadcrumbHome'), href: '/' },
        { label: t('breadcrumbTrails'), href: '/sentieri' },
        { label: themeLabel },
      ]}
      jsonLd={jsonLd}
    />
  );
}
