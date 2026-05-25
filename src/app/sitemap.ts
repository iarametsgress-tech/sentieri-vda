import type { MetadataRoute } from 'next';
import { getAllTrails } from '@/lib/trails';

const BASE = 'https://sentierivda.it';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['it', 'en'] as const;
  const trails = getAllTrails();

  const staticPaths = ['', '/sentieri', '/alte-vie', '/rifugi', '/flora-fauna', '/about'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const p of staticPaths) {
      entries.push({
        url: `${BASE}/${locale}${p}`,
        changeFrequency: 'weekly',
        priority: p === '' ? 1.0 : 0.7,
        alternates: {
          languages: {
            it: `${BASE}/it${p}`,
            en: `${BASE}/en${p}`,
          },
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
          languages: {
            it: `${BASE}/it/sentieri/${t.slug}`,
            en: `${BASE}/en/sentieri/${t.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
