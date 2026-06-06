import type { MetadataRoute } from 'next';
import { getIndexableTrails } from '@/lib/trails';
import { getAllRefuges } from '@/lib/refuges';
import { getAllBlogSlugs } from '@/lib/blog';
import { getAllArticoliSlugs } from '@/lib/articoli';
import { getMassifGroups } from '@/lib/environment';
import { TOUR_IDS } from '@/lib/tours';
import { getAllCultureThemeHubs } from '@/lib/culture-theme-hubs';
import {
  getAllDifficultyHubs,
  getAllMassifHubs,
  getAllSpeciesHubs,
  getAllValleyHubs,
} from '@/lib/hubs';
import { SITE_URL } from '@/lib/config';
import { routing } from '@/i18n/routing';

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;
  const trails = getIndexableTrails();
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
    '/articoli',
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

    for (const id of ['av1', 'av2']) {
      entries.push({
        url: `${BASE}/${locale}/alte-vie/${id}`,
        changeFrequency: 'monthly',
        priority: 0.85,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE}/${l}/alte-vie/${id}`])
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
        priority: t.tags.includes('skeleton') ? 0.65 : 0.8,
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

    for (const { slug } of getAllCultureThemeHubs()) {
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

    for (const { slug } of getAllMassifHubs()) {
      const path = `/sentieri/montagna/${slug}`;
      entries.push({
        url: `${BASE}/${locale}${path}`,
        changeFrequency: 'weekly',
        priority: 0.72,
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

    for (const slug of getAllArticoliSlugs()) {
      entries.push({
        url: `${BASE}/${locale}/articoli/${slug}`,
        changeFrequency: 'monthly',
        priority: 0.85,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE}/${l}/articoli/${slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
