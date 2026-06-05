import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { routing, type Locale } from '@/i18n/routing';

const ARTICOLI_DIR = path.join(process.cwd(), 'src/content/articoli');

const ArticoloFrontmatterSchema = z.object({
  date: z
    .union([z.string(), z.date()])
    .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v)),
  published: z.boolean().optional().default(true),
  title_it: z.string(),
  title_en: z.string(),
  title_fr: z.string(),
  title_de: z.string(),
  description_it: z.string(),
  description_en: z.string(),
  description_fr: z.string(),
  description_de: z.string(),
  cover_it: z.string(),
  cover_en: z.string().optional(),
  cover_fr: z.string().optional(),
  cover_de: z.string().optional(),
  category: z
    .enum(['classici', 'laghi', 'famiglia', 'rifugi', 'scoperta', 'foto'])
    .optional()
    .default('classici'),
});

type ArticoloFrontmatter = z.infer<typeof ArticoloFrontmatterSchema>;

export type ArticoloMeta = {
  slug: string;
  date: string;
  published: boolean;
  title: string;
  description: string;
  cover: string;
  category: ArticoloFrontmatter['category'];
};

export type Articolo = ArticoloMeta & {
  body: string;
};

function isBaseMdx(filename: string): boolean {
  if (!filename.endsWith('.mdx')) return false;
  return !/\.(it|en|fr|de)\.mdx$/.test(filename);
}

function parseFrontmatter(slug: string): ArticoloFrontmatter | null {
  const filePath = path.join(ARTICOLI_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const { data } = matter(fs.readFileSync(filePath, 'utf8'));
  const parsed = ArticoloFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    console.warn(`[articoli] Invalid frontmatter for ${slug}:`, parsed.error.flatten());
    return null;
  }
  return parsed.data;
}

function localizedField(
  fm: ArticoloFrontmatter,
  field: 'title' | 'description' | 'cover',
  locale: string,
): string {
  const loc = routing.locales.includes(locale as Locale) ? locale : 'it';
  const key = `${field}_${loc}` as keyof ArticoloFrontmatter;
  const itValue = fm[`${field}_it` as keyof ArticoloFrontmatter] as string;
  const value = fm[key];
  if (typeof value === 'string' && value.length > 0) return value;
  return itValue;
}

export function getAllArticoliSlugs(): string[] {
  if (!fs.existsSync(ARTICOLI_DIR)) return [];
  return fs
    .readdirSync(ARTICOLI_DIR)
    .filter(isBaseMdx)
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getAllArticoliPosts(locale: string): ArticoloMeta[] {
  return getAllArticoliSlugs()
    .map((slug) => getArticoloMeta(slug, locale))
    .filter((p): p is ArticoloMeta => p !== null && p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticoloMeta(slug: string, locale: string): ArticoloMeta | null {
  const fm = parseFrontmatter(slug);
  if (!fm || fm.published === false) return null;
  return {
    slug,
    date: fm.date,
    published: true,
    title: localizedField(fm, 'title', locale),
    description: localizedField(fm, 'description', locale),
    cover: localizedField(fm, 'cover', locale),
    category: fm.category,
  };
}

export function getArticolo(slug: string, locale: string): Articolo | null {
  const filePath = path.join(ARTICOLI_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fm = parseFrontmatter(slug);
  if (!fm || fm.published === false) return null;

  const { content: itBody } = matter(fs.readFileSync(filePath, 'utf8'));
  let body = itBody.trim();

  if (locale !== 'it') {
    const localePath = path.join(ARTICOLI_DIR, `${slug}.${locale}.mdx`);
    if (fs.existsSync(localePath)) {
      body = fs.readFileSync(localePath, 'utf8').trim();
    }
  }

  const meta = getArticoloMeta(slug, locale);
  if (!meta) return null;

  return { ...meta, body };
}
