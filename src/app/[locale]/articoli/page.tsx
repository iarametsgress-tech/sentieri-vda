import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import ArticoliExplorer from '@/components/ArticoliExplorer';
import { getAllArticoliPosts } from '@/lib/articoli';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import { trailImageBlurProps } from '@/lib/blur';

const HERO_IMAGE = '/articoli/hero-articoli.jpg';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Articoli.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/articoli`,
      languages: localeAlternatesAbsolute('/articoli'),
    },
  };
}

export default async function ArticoliPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Articoli');
  const posts = getAllArticoliPosts(locale);

  const labels = {
    navClassici: t('navClassici'),
    navLaghi: t('navLaghi'),
    navFamiglia: t('navFamiglia'),
    navRifugi: t('navRifugi'),
    navScoperta: t('navScoperta'),
    navFoto: t('navFoto'),
    readArticle: t('readArticle'),
    sectionIntroClassici: t('sectionIntroClassici'),
    sectionIntroLaghi: t('sectionIntroLaghi'),
    sectionIntroFamiglia: t('sectionIntroFamiglia'),
    sectionIntroRifugi: t('sectionIntroRifugi'),
    sectionIntroScoperta: t('sectionIntroScoperta'),
    sectionIntroFoto: t('sectionIntroFoto'),
  };

  return (
    <div>
      <section className="relative h-[78vh] min-h-[560px] overflow-hidden lg:min-h-[82vh]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            {...trailImageBlurProps(HERO_IMAGE)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/15 via-45% to-ink/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/10 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto flex h-full min-h-[560px] max-w-7xl flex-col justify-end px-6 pb-16 pt-28 lg:px-10 lg:pb-24">
          <p className="text-on-image-eyebrow mb-5 font-mono text-[11px] uppercase tracking-[0.35em] text-alpenglow">
            {t('heroEyebrow')}
          </p>
          <h1 className="text-on-image-title font-display text-display-lg max-w-5xl text-snow">
            {t('heroTitle')}
          </h1>
          <p className="text-on-image-body mt-5 max-w-2xl text-lg font-light leading-relaxed text-snow/85 lg:text-xl">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      <ArticoliExplorer locale={locale} posts={posts} labels={labels} />
    </div>
  );
}
