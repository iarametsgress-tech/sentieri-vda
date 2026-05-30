import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import valleysData from '@/data/culture/valleys.json';
import CulturaSectionNav from '@/components/cultura/CulturaSectionNav';
import CulturaDeepLinkScroll from '@/components/cultura/CulturaDeepLinkScroll';
import {
  CulturaValliSkeleton,
  CulturaBelowFoldSkeleton,
} from '@/components/SectionExplorerSkeleton';
import CulturaValliSection from '@/components/sections/CulturaValliSection';
import CulturaTradizioniSection from '@/components/sections/CulturaTradizioniSection';
import CulturaCiboSection from '@/components/sections/CulturaCiboSection';
import { trailImageBlurProps } from '@/lib/blur';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Cultura.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/cultura`,
      languages: localeAlternatesAbsolute('/cultura'),
    },
  };
}

export default async function CulturaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Cultura');
  const isIT = locale === 'it';

  return (
    <div>
      <section className="relative min-h-[55vh] overflow-hidden lg:min-h-[62vh]">
        <div className="absolute inset-0">
          <Image
            src="/cultura/walser-titsch.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            {...trailImageBlurProps('/cultura/walser-titsch.jpg')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
        </div>
        <div className="relative mx-auto flex min-h-[55vh] max-w-7xl flex-col justify-end px-6 pb-14 pt-28 lg:min-h-[62vh] lg:px-10 lg:pb-20">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-alpenglow">
            {t('heroEyebrow')}
          </p>
          <h1 className="text-on-image-title font-display text-display-lg max-w-3xl tracking-tighter">
            {t('heroTitle')}
          </h1>
          <p className="text-on-image-body mt-5 max-w-2xl text-lg leading-relaxed text-snow/80">
            {t('heroSubtitle', { valleys: valleysData.length })}
          </p>
        </div>
      </section>

      <CulturaSectionNav
        labels={{
          valli: t('navValli'),
          tradizioni: t('navTradizioni'),
          ciboVino: t('navCiboVino'),
        }}
        ariaLabel={isIT ? 'Sezioni cultura' : 'Culture sections'}
      />

      <CulturaDeepLinkScroll />

      <Suspense fallback={<CulturaValliSkeleton />}>
        <CulturaValliSection locale={locale} />
      </Suspense>

      <Suspense fallback={<CulturaBelowFoldSkeleton />}>
        <CulturaTradizioniSection locale={locale} />
      </Suspense>

      <Suspense fallback={<CulturaBelowFoldSkeleton />}>
        <CulturaCiboSection locale={locale} />
      </Suspense>
    </div>
  );
}
