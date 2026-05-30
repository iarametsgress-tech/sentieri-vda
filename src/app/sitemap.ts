import type { MetadataRoute } from 'next';
import { getAllTrails } from '@/lib/trails';
import { getAllRefuges } from '@/lib/refuges';
import { getMassifGroups } from '@/lib/environment';
import { TOUR_IDS } from '@/lib/tours';
import { SITE_URL } from '@/lib/config';
import { routing } from '@/i18n/routing';

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;
  const trails = getAllTrails();
  const refuges = getAllRefuges();

  const staticPaths = [
    '',
    '/sentieri',
    '/alte-vie',
    '/tour',
    '/rifugi',
    '/ambiente',
    '/cultura',
    '/avvertenze',
    '/about',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const p of staticPaths) {
      entries.push({
        url: `${BASE}/${locale}${p}`,
        changeFrequency: 'weekly',
        priority: p === '' ? 1.0 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE}/${l}${p}`])
          ),
        },
      });
    }

    for (const id of TOUR_IDS) {
      entries.push({
        url: `${BASE}/${locale}/tour/${id}`,
        changeFrequency: 'monthly',
        priority: 0.75,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE}/${l}/tour/${id}`])
          ),
        },
      });
    }

    for (const t of trails) {
      entries.push({
        url: `${BASE}/${locale}/sentieri/${t.slug}`,
        lastModified: t.updated_at,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE}/${l}/sentieri/${t.slug}`])
          ),
        },
      });
    }

    for (const r of refuges) {
      entries.push({
        url: `${BASE}/${locale}/rifugi/${r.slug}`,
        changeFrequency: 'monthly',
        priority: 0.75,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE}/${l}/rifugi/${r.slug}`])
          ),
        },
      });
    }

    for (const { id } of getMassifGroups()) {
      entries.push({
        url: `${BASE}/${locale}/ambiente/montagne/${id}`,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE}/${l}/ambiente/montagne/${id}`])
          ),
        },
      });
    }
  }

  return entries;
}
