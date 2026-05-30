import { SITE_URL } from '@/lib/config';
import { getTrailLocalizedName } from '@/lib/stage-utils';
import type { Trail } from '@/lib/types';

type BreadcrumbItem = { name: string; path: string };

export function buildHubJsonLd({
  locale,
  pagePath,
  pageName,
  pageDescription,
  trails,
  breadcrumbs,
}: {
  locale: string;
  pagePath: string;
  pageName: string;
  pageDescription: string;
  trails: Trail[];
  breadcrumbs: BreadcrumbItem[];
}) {
  const pageUrl = `${SITE_URL}/${locale}${pagePath}`;

  const collectionPage = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': pageUrl,
    name: pageName,
    description: pageDescription,
    url: pageUrl,
    inLanguage: locale,
    numberOfItems: trails.length,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: trails.length,
      itemListElement: trails.map((trail, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/${locale}/sentieri/${trail.slug}`,
        name: getTrailLocalizedName(trail, locale),
      })),
    },
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path}`,
    })),
  };

  return [collectionPage, breadcrumbList];
}
