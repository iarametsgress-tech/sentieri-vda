import { SITE_URL, SITE_AUTHOR } from '@/lib/config';
import { formatDistanceKm } from '@/lib/format';
import { getTrailLocalizedDescription, getTrailLocalizedName } from '@/lib/stage-utils';
import type { Trail } from '@/lib/types';

/** URL assoluto per asset locali, Blob CDN o path già assoluti. */
export function absoluteAssetUrl(src: string | undefined | null): string | undefined {
  if (!src) return undefined;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return `${SITE_URL}${src.startsWith('/') ? src : `/${src}`}`;
}

export function metaDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

export function buildTrailJsonLd(trail: Trail, locale: string) {
  const name = getTrailLocalizedName(trail, locale);
  const description = getTrailLocalizedDescription(trail, locale);
  const image = absoluteAssetUrl(trail.hero_image || trail.image);
  const pageUrl = `${SITE_URL}/${locale}/sentieri/${trail.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'HikingTrail',
    '@id': pageUrl,
    name,
    description,
    url: pageUrl,
    inLanguage: locale,
    ...(image ? { image } : {}),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: trail.start.coords.lat,
      longitude: trail.start.coords.lng,
    },
    distance: {
      '@type': 'Distance',
      name: 'Length',
      value: formatDistanceKm(trail.distance_km),
      unitCode: 'KMT',
    },
    elevation: {
      '@type': 'QuantitativeValue',
      name: 'Elevation gain',
      value: trail.elevation_gain_m,
      unitCode: 'MTR',
    },
    isAccessibleForFree: true,
    ...(trail.updated_at ? { dateModified: trail.updated_at } : {}),
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.url,
    },
    provider: {
      '@type': 'Organization',
      name: 'Catasto Sentieri Regione Autonoma VdA',
      url: trail.source.url,
    },
  };
}

export function buildBreadcrumbJsonLd(
  locale: string,
  items: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Sentieri VdA',
    url: SITE_URL,
    description:
      "Catalogo dei sentieri della Valle d'Aosta con mappe, tracciati GPX e schede verificate dal Catasto regionale.",
    inLanguage: ['it', 'en', 'fr', 'de'],
    publisher: {
      '@type': 'Organization',
      name: 'Sentieri VdA',
      url: SITE_URL,
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Sentieri VdA',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    sameAs: [],
  };
}

export function buildTrailsCatalogJsonLd(locale: string, count: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/${locale}/sentieri`,
    name:
      locale === 'it'
        ? "Catalogo sentieri Valle d'Aosta"
        : 'Aosta Valley trails catalog',
    url: `${SITE_URL}/${locale}/sentieri`,
    inLanguage: locale,
    numberOfItems: count,
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };
}
