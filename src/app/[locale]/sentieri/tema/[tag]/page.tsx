import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import TrailHubPage from '@/components/TrailHubPage';
import { SITE_URL } from '@/lib/config';
import { buildHubJsonLd } from '@/lib/hub-jsonld';
import {
  getAllCultureThemeHubs,
  getCultureThemeHubBySlug,
  getCultureThemeLabel,
} from '@/lib/culture-theme-hubs';
import {
  computeTrailStats,
  formatDifficultyRange,
  getHubHeroImage,
} from '@/lib/hubs';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import type { Difficulty } from '@/lib/types';

export function generateStaticParams() {
  return getAllCultureThemeHubs().map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  const hub = getCultureThemeHubBySlug(tag);
  if (!hub) return {};
  const t = await getTranslations({ locale, namespace: 'TrailHubs.theme' });
  const themeLabel = getCultureThemeLabel(hub.themeId, locale);
  const title = t('metaTitleCulture', { theme: themeLabel, count: hub.count });
  const description = t('metaDescriptionCulture', { theme: themeLabel, count: hub.count });
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

  const hub = getCultureThemeHubBySlug(tag);
  if (!hub) notFound();

  const t = await getTranslations('TrailHubs');
  const tTheme = await getTranslations('TrailHubs.theme');
  const tDiff = await getTranslations('Difficulty');
  const themeLabel = getCultureThemeLabel(hub.themeId, locale);
  const stats = computeTrailStats(hub.trails);
  const diffLabels = Object.fromEntries(
    (['T', 'E', 'EE', 'EEA', 'A'] as Difficulty[]).map((d) => [d, tDiff(d)]),
  ) as Record<Difficulty, string>;
  const diffRange = formatDifficultyRange(stats.difficulties, locale, diffLabels);

  const title = tTheme('titleCulture', { theme: themeLabel, count: hub.count });
  const intro = tTheme('introCulture', {
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
      eyebrow={tTheme('eyebrowCulture')}
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
