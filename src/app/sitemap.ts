import type { MetadataRoute } from 'next';
import { getAllTrails, getBrowseTrails } from '@/lib/trails';
import { isEnrichedTrail } from '@/lib/skeleton-trails';
import { getAllRefuges } from '@/lib/refuges';
import { getAllBlogSlugs } from '@/lib/blog';
import { getMassifGroups } from '@/lib/environment';
import { TOUR_IDS } from '@/lib/tours';
import {
  getAllDifficultyHubs,
  getAllSpeciesHubs,
  getAllThemeHubs,
  getAllValleyHubs,
} from '@/lib/hubs';
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
    '/blog',
    '/about',
    '/metodo',
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

    for (const t of getBrowseTrails()) {
      if (!isEnrichedTrail(t)) continue;
      if (trails.some((c) => c.slug === t.slug)) continue;
      entries.push({
        url: `${BASE}/${locale}/sentieri/${t.slug}`,
        lastModified: t.updated_at,
        changeFrequency: 'monthly',
        priority: 0.65,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE}/${l}/sentieri/${t.slug}`])
          ),
        },
      });
    }

    for (const { slug } of getAllValleyHubs()) {
      const path = `/sentieri/valle/${slug}`;
      entries.push({
        url: `${BASE}/${locale}${path}`,
        changeFrequency: 'weekly',
        priority: 0.72,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${BASE}/${l}${path}`])),
        },
      });
    }

    for (const { slug } of getAllDifficultyHubs()) {
      const path = `/sentieri/difficolta/${slug}`;
      entries.push({
        url: `${BASE}/${locale}${path}`,
        changeFrequency: 'weekly',
        priority: 0.72,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${BASE}/${l}${path}`])),
        },
      });
    }

    for (const { slug } of getAllThemeHubs()) {
      const path = `/sentieri/tema/${slug}`;
      entries.push({
        url: `${BASE}/${locale}${path}`,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${BASE}/${l}${path}`])),
        },
      });
    }

    for (const { slug } of getAllSpeciesHubs()) {
      const path = `/sentieri/dove-vedere/${slug}`;
      entries.push({
        url: `${BASE}/${locale}${path}`,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${BASE}/${l}${path}`])),
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

    for (const slug of getAllBlogSlugs()) {
      entries.push({
        url: `${BASE}/${locale}/blog/${slug}`,
        changeFrequency: 'monthly',
        priority: 0.65,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE}/${l}/blog/${slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
