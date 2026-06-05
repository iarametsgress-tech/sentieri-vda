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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/it/sentieri?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
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

export function buildTourJsonLd(args: {
  locale: string;
  id: string;
  name: string;
  description: string;
  image?: string;
  stages: Array<{ name: string; slug: string }>;
}) {
  const { locale, id, name, description, image, stages } = args;
  const url = `${SITE_URL}/${locale}/tour/${id}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': url,
    name,
    description,
    url,
    inLanguage: locale,
    ...(image ? { image: absoluteAssetUrl(image) } : {}),
    touristType: ['Hiking', 'Trekking'],
    isAccessibleForFree: true,
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: stages.length,
      itemListElement: stages.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.name,
        item: `${SITE_URL}/${locale}/sentieri/${s.slug}`,
      })),
    },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };
}

export function buildRefugeJsonLd(args: {
  locale: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  lat: number;
  lng: number;
  elevation_m: number;
  type: string;
  website?: string;
  phone?: string;
}) {
  const { locale, slug, name, description, image, lat, lng, elevation_m, type, website, phone } = args;
  const url = `${SITE_URL}/${locale}/rifugi/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': type === 'bivacco' ? 'Campground' : 'LodgingBusiness',
    '@id': url,
    name,
    description,
    url,
    ...(image ? { image: absoluteAssetUrl(image) } : {}),
    ...(website ? { sameAs: website } : {}),
    ...(phone ? { telephone: phone } : {}),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
      elevation: `${elevation_m} m`,
    },
    address: {
      '@type': 'PostalAddress',
      addressRegion: "Valle d'Aosta",
      addressCountry: 'IT',
    },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };
}

export function buildCollectionPageJsonLd(args: {
  locale: string;
  path: string;
  name: string;
  description: string;
}) {
  const { locale, path, name, description } = args;
  const url = `${SITE_URL}/${locale}${path.startsWith('/') ? path : `/${path}`}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    name,
    description,
    url,
    inLanguage: locale,
    isPartOf: { '@id': `${SITE_URL}/#website` },
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
