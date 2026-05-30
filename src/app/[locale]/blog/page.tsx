import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { BookOpen, ArrowRight } from 'lucide-react';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import { getAllBlogPosts } from '@/lib/blog';
import NewsletterForm from '@/components/NewsletterForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Blog.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages: localeAlternatesAbsolute('/blog'),
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Blog');
  const posts = getAllBlogPosts(locale);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32">
      <div className="mb-16 max-w-2xl">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-alpenglow/30">
          <BookOpen size={24} className="text-alpenglow" />
        </div>
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-alpenglow/80">
          {t('eyebrow')}
        </p>
        <h1 className="mb-6 font-display text-display-lg tracking-tighter">{t('title')}</h1>
        <p className="text-lg leading-relaxed text-snow/60">{t('subtitle')}</p>
      </div>

      {posts.length > 0 ? (
        <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const formattedDate = new Intl.DateTimeFormat(locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format(new Date(post.date));

            return (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                    <Image
                      src={post.cover}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 400px"
                      unoptimized={post.cover.startsWith('http') || post.cover.endsWith('.png')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  </div>
                  <time
                    dateTime={post.date}
                    className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-snow/45"
                  >
                    {formattedDate}
                  </time>
                  <h2 className="mb-3 font-display text-2xl leading-tight tracking-tight text-snow transition-colors group-hover:text-alpenglow">
                    {post.title}
                  </h2>
                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-snow/55">
                    {post.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-alpenglow">
                    {t('readArticle')}
                    <ArrowRight size={12} />
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      ) : null}

      <div className="max-w-2xl border-t border-white/5 pt-12">
        <p className="mb-6 text-snow/60 leading-relaxed">{t('newsletterHint')}</p>
        <NewsletterForm
          placeholder={t('newsletterPlaceholder')}
          cta={t('newsletterCta')}
          successMessage={t('newsletterSuccess')}
          errorMessage={t('newsletterError')}
        />
      </div>
    </div>
  );
}
