import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import { getAllValleys, getAllTraditions, getAllFoodWine } from '@/lib/culture';

const CulturaExplorer = dynamic(() => import('@/components/CulturaExplorer'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 animate-pulse space-y-8">
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-10 w-28 rounded-full bg-white/[0.04]" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-64 rounded-2xl bg-white/[0.03]" />)}
      </div>
    </div>
  ),
});

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
            {t('heroSubtitle', { valleys: getAllValleys().length })}
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/[0.02]" />
          </div>
        }
      >
        <CulturaExplorer
          locale={locale}
          valleys={getAllValleys()}
          traditions={getAllTraditions()}
          foodWine={getAllFoodWine()}
          labels={{
            navValli: t('navValli'),
            navTradizioni: t('navTradizioni'),
            navCiboVino: t('navCiboVino'),
            valliTitle: t('valliTitle'),
            valliSubtitle: t('valliSubtitle'),
            tradizioniTitle: t('tradizioniTitle'),
            tradizioniSubtitle: t('tradizioniSubtitle'),
            ciboTitle: t('ciboTitle'),
            ciboSubtitle: t('ciboSubtitle'),
            townsTitle: t('townsTitle'),
            officialSite: t('officialSite'),
            source: t('source'),
            readMore: t('readMore'),
          }}
        />
      </Suspense>
    </div>
  );
}
