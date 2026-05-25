import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://sentierivda.it/sitemap.xml',
    host: 'https://sentierivda.it',
  };
}
