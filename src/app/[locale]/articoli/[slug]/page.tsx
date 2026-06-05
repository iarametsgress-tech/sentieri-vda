import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { blogMdxComponents } from '@/components/mdx/blog-mdx';
import { getAllArticoliSlugs, getArticolo } from '@/lib/articoli';
import { SITE_URL, SITE_AUTHOR } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';

export async function generateStaticParams() {
  const slugs = getAllArticoliSlugs();
  const locales = ['it', 'en', 'fr', 'de'] as const;
  return slugs.flatMap((slug) => locales.map((locale) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const articolo = getArticolo(slug, locale);
  if (!articolo) return {};

  return {
    title: articolo.title,
    description: articolo.description,
    openGraph: {
      title: articolo.title,
      description: articolo.description,
      type: 'article',
      publishedTime: articolo.date,
      images: [{ url: articolo.cover, width: 1600, height: 900 }],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/articoli/${slug}`,
      languages: localeAlternatesAbsolute(`/articoli/${slug}`),
    },
  };
}

export default async function ArticoloPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const articolo = getArticolo(slug, locale);
  if (!articolo) notFound();

  const t = await getTranslations('Articoli');

  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(articolo.date));

  const articleUrl = `${SITE_URL}/${locale}/articoli/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': articleUrl,
    headline: articolo.title,
    description: articolo.description,
    datePublished: articolo.date,
    dateModified: articolo.date,
    image: articolo.cover.startsWith('http') ? articolo.cover : `${SITE_URL}${articolo.cover}`,
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
            href="/articoli"
            className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-snow/55 transition-colors hover:text-snow"
          >
            <ArrowLeft size={14} />
            {t('backToArticles')}
          </Link>

          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-alpenglow">
            {t('eyebrow')}
          </p>
          <h1 className="max-w-4xl font-display text-display-lg tracking-tighter text-snow">
            {articolo.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-snow/65">
            {articolo.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-snow/55">
            <time
              dateTime={articolo.date}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
            >
              <Calendar size={13} className="text-alpenglow" />
              {t('publishedOn', { date: formattedDate })}
            </time>
            <span className="text-snow/40">·</span>
            <Link href="/about" className="transition-colors hover:text-snow">
              {t('writtenBy', { name: SITE_AUTHOR.name })}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-12 lg:px-10">
          <div className="relative aspect-[21/9] max-h-[520px] w-full overflow-hidden rounded-2xl border border-white/10 bg-ink grain">
            <Image
              src={articolo.cover}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              unoptimized={
                articolo.cover.startsWith('http') || articolo.cover.endsWith('.png')
              }
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="blog-prose">
          <MDXRemote
            source={articolo.body}
            components={blogMdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
      </div>
    </article>
  );
}
