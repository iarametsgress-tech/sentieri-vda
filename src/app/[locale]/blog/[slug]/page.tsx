import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { blogMdxComponents } from '@/components/mdx/blog-mdx';
import { getAllBlogSlugs, getBlogPost } from '@/lib/blog';
import { SITE_URL, SITE_AUTHOR } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  const locales = ['it', 'en', 'fr', 'de'] as const;
  return slugs.flatMap((slug) => locales.map((locale) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getBlogPost(slug, locale);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: post.cover, width: 1600, height: 900 }],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${slug}`,
      languages: localeAlternatesAbsolute(`/blog/${slug}`),
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getBlogPost(slug, locale);
  if (!post) notFound();

  const t = await getTranslations('Blog');

  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(post.date));

  const articleUrl = `${SITE_URL}/${locale}/blog/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': articleUrl,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: post.cover.startsWith('http') ? post.cover : `${SITE_URL}${post.cover}`,
    inLanguage: locale,
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sentieri VdA',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="relative border-b border-white/5">
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-10 lg:px-10 lg:pt-28">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-snow/55 transition-colors hover:text-snow"
          >
            <ArrowLeft size={14} />
            {t('backToJournal')}
          </Link>

          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-alpenglow">
            {t('eyebrow')}
          </p>
          <h1 className="max-w-4xl font-display text-display-lg tracking-tighter text-snow">
            {post.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-snow/65">
            {post.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-snow/55">
            <time dateTime={post.date} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
              <Calendar size={13} className="text-alpenglow" />
              {t('publishedOn', { date: formattedDate })}
            </time>
            <span className="text-snow/40">·</span>
            <Link href="/about" className="hover:text-snow transition-colors">
              {t('writtenBy', { name: SITE_AUTHOR.name })}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-12 lg:px-10">
          <div className="relative aspect-[21/9] max-h-[520px] w-full overflow-hidden rounded-2xl border border-white/10 bg-ink grain">
            <Image
              src={post.cover}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              unoptimized={post.cover.startsWith('http') || post.cover.endsWith('.png')}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="blog-prose">
          <MDXRemote
            source={post.body}
            components={blogMdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
      </div>
    </article>
  );
}
