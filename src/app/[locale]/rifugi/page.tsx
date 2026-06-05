import { setRequestLocale, getTranslations } from 'next-intl/server';
import AdSlot from '@/components/AdSlot';
import SectionPageHero from '@/components/SectionPageHero';
import RefugesExplorer from '@/components/RefugesExplorer';
import { getAllRefuges } from '@/lib/refuges';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import { buildCollectionPageJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Refuges.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/rifugi`,
      languages: {
        it: `${SITE_URL}/it/rifugi`,
        en: `${SITE_URL}/en/rifugi`,
      },
    },
  };
}

export default async function RifugiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Refuges');
  const tMeta = await getTranslations('Refuges.meta');
  const refuges = getAllRefuges();

  const collectionJsonLd = buildCollectionPageJsonLd({
    locale,
    path: '/rifugi',
    name: tMeta('title'),
    description: tMeta('description'),
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(locale, [
    { name: 'Home', path: `/${locale}` },
    { name: t('heroEyebrow'), path: `/${locale}/rifugi` },
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SectionPageHero
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        section="rifugi"
        locale={locale}
        note={t('heroNote')}
      />

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <RefugesExplorer
          refuges={refuges}
          locale={locale}
          labels={{
            search: t('search'),
            all: t('tabAll'),
            rifugio: t('tabRefuges'),
            bivacco: t('tabBivouacs'),
            elevation: t('elevation'),
            valley: t('valley'),
            beds: t('beds'),
            open: t('openPeriod'),
            viewProfile: t('viewProfile'),
            noResults: t('noResults'),
            book: t('book'),
          }}
        />
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <AdSlot slot="footer-leaderboard" />
      </div>
    </div>
  );
}
