import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { routing, type Locale } from '@/i18n/routing';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

const BlogFrontmatterSchema = z.object({
  // gray-matter converte le date YAML non quotate in oggetti Date:
  // accettiamo entrambi e normalizziamo a 'YYYY-MM-DD'.
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
});

type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;

export type BlogPostMeta = {
  slug: string;
  date: string;
  published: boolean;
  title: string;
  description: string;
  cover: string;
};

export type BlogPost = BlogPostMeta & {
  body: string;
};

function isBaseMdx(filename: string): boolean {
  if (!filename.endsWith('.mdx')) return false;
  return !/\.(it|en|fr|de)\.mdx$/.test(filename);
}

function parseFrontmatter(slug: string): BlogFrontmatter | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const { data } = matter(fs.readFileSync(filePath, 'utf8'));
  const parsed = BlogFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    console.warn(`[blog] Invalid frontmatter for ${slug}:`, parsed.error.flatten());
    return null;
  }
  return parsed.data;
}

function localizedField(
  fm: BlogFrontmatter,
  field: 'title' | 'description' | 'cover',
  locale: string,
): string {
  const loc = routing.locales.includes(locale as Locale) ? locale : 'it';
  const key = `${field}_${loc}` as keyof BlogFrontmatter;
  const itValue = fm[`${field}_it` as keyof BlogFrontmatter] as string;
  const value = fm[key];
  if (typeof value === 'string' && value.length > 0) return value;
  return itValue;
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter(isBaseMdx)
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getAllBlogPosts(locale: string): BlogPostMeta[] {
  return getAllBlogSlugs()
    .map((slug) => getBlogPostMeta(slug, locale))
    .filter((p): p is BlogPostMeta => p !== null && p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostMeta(slug: string, locale: string): BlogPostMeta | null {
  const fm = parseFrontmatter(slug);
  if (!fm || fm.published === false) return null;
  return {
    slug,
    date: fm.date,
    published: true,
    title: localizedField(fm, 'title', locale),
    description: localizedField(fm, 'description', locale),
    cover: localizedField(fm, 'cover', locale),
  };
}

export function getBlogPost(slug: string, locale: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fm = parseFrontmatter(slug);
  if (!fm || fm.published === false) return null;

  const { content: itBody } = matter(fs.readFileSync(filePath, 'utf8'));
  let body = itBody.trim();

  if (locale !== 'it') {
    const localePath = path.join(BLOG_DIR, `${slug}.${locale}.mdx`);
    if (fs.existsSync(localePath)) {
      body = fs.readFileSync(localePath, 'utf8').trim();
    }
  }

  const meta = getBlogPostMeta(slug, locale);
  if (!meta) return null;

  return { ...meta, body };
}
