import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import { getFauna, getFlora } from '@/data/species';
import { AmbienteExplorerSkeleton } from '@/components/SectionExplorerSkeleton';
import AmbienteExplorerSection from '@/components/sections/AmbienteExplorerSection';
import { trailImageBlurProps } from '@/lib/blur';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Ambiente.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/ambiente`,
      languages: localeAlternatesAbsolute('/ambiente'),
    },
  };
}

export default async function AmbientePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Ambiente');
  const fauna = getFauna();
  const flora = getFlora();

  return (
    <div>
      <section className="relative h-[78vh] min-h-[560px] overflow-hidden lg:min-h-[82vh]">
        <div className="absolute inset-0">
          <Image
            src="/species/aquila-reale-bg.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            {...trailImageBlurProps('/species/aquila-reale-bg.jpg')}
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
            {t('heroSubtitle', { fauna: fauna.length, flora: flora.length })}
          </p>
        </div>
      </section>

      <Suspense fallback={<AmbienteExplorerSkeleton />}>
        <AmbienteExplorerSection locale={locale} />
      </Suspense>
    </div>
  );
}
