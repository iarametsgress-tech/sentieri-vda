import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Utensils, History, Wallet, MapPin } from 'lucide-react';
import AdSlot from '@/components/AdSlot';
import {
  RefugeBookingBar,
  RefugeContactsSection,
  RefugeDetailStats,
} from '@/components/RefugesExplorer';
import { getRefugeBySlug, getAllRefuges } from '@/lib/refuges';
import {
  getRefugeName,
  getRefugeDescription,
  getRefugeHistory,
  getRefugeFood,
  getRefugeCosts,
  getRefugeImageAlt,
} from '@/lib/refuge-locale';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import { buildRefugeJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllRefuges().map((r) => ({ locale, slug: r.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const refuge = getRefugeBySlug(slug);
  if (!refuge) return { title: 'Not found' };
  const name = getRefugeName(refuge, locale);
  const desc = getRefugeDescription(refuge, locale);
  return {
    title: name,
    description: desc.slice(0, 160),
    alternates: {
      canonical: `${SITE_URL}/${locale}/rifugi/${slug}`,
      languages: localeAlternatesAbsolute(`/rifugi/${slug}`),
    },
  };
}

function InfoBlock({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-snow/55">
        {icon}
        {title}
      </h2>
      <p className="text-snow/75 leading-relaxed text-[15px]">{text}</p>
    </section>
  );
}

export default async function RefugeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Refuges');
  const tNav = await getTranslations('Nav');
  const refuge = getRefugeBySlug(slug);
  if (!refuge) notFound();

  const name = getRefugeName(refuge, locale);
  const description = getRefugeDescription(refuge, locale);
  const history = getRefugeHistory(refuge, locale);
  const food = getRefugeFood(refuge, locale);
  const costs = getRefugeCosts(refuge, locale);

  const statLabels = {
    elevation: t('elevation'),
    valley: t('valley'),
    beds: t('beds'),
    open: t('openPeriod'),
    manager: t('manager'),
  };

  const bookingLabels = {
    book: t('book'),
    call: t('call'),
    website: t('website'),
  };

  const contactLabels = {
    title: t('contactsTitle'),
    subtitle: t('contactsSubtitle'),
    call: t('call'),
    website: t('officialWebsite'),
    book: t('book'),
    instagram: t('instagram'),
    facebook: t('facebook'),
    email: t('email'),
    noSocial: t('noSocial'),
  };

  const refugeJsonLd = buildRefugeJsonLd({
    locale,
    slug,
    name,
    description,
    image: refuge.images[0]?.src,
    lat: refuge.coords.lat,
    lng: refuge.coords.lng,
    elevation_m: refuge.elevation_m,
    type: refuge.type,
    website: refuge.website || undefined,
    phone: refuge.phone || undefined,
  });
  const refugeBreadcrumb = buildBreadcrumbJsonLd(locale, [
    { name: 'Home', path: `/${locale}` },
    { name: tNav('refuges'), path: `/${locale}/rifugi` },
    { name, path: `/${locale}/rifugi/${slug}` },
  ]);

  return (
    <div className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(refugeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(refugeBreadcrumb) }}
      />
      <div className="max-w-4xl mx-auto px-6 lg:px-10 pt-12">
        <Link
          href="/rifugi"
          className="inline-flex items-center gap-2 text-sm text-snow/50 hover:text-alpenglow transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          {t('backToCatalog')}
        </Link>

        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-alpenglow mb-3">
            {refuge.type === 'bivacco' ? t('bivacco') : t('rifugio')} · {refuge.elevation_m} m
          </p>
          <h1 className="font-display text-display-md tracking-tighter mb-4">{name}</h1>
          <p className="text-snow/65 text-lg leading-relaxed">{description}</p>
        </header>

        {refuge.images.length > 0 ? (
          <div className={`grid gap-3 mb-10 ${refuge.images.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {refuge.images.map((img, i) => (
              <div
                key={img.src}
                className={`relative overflow-hidden rounded-2xl border border-white/10 bg-ink/40 ${
                  i === 0 && refuge.images.length > 2 ? 'sm:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'
                }`}
              >
                <Image
                  src={img.src}
                  alt={getRefugeImageAlt(img, locale)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority={i === 0}
                />
                {img.credit ? (
                  <p className="absolute bottom-2 right-2 text-[10px] font-mono text-snow/50 bg-ink/70 px-2 py-1 rounded">
                    {img.credit}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        <div className="mb-10">
          <RefugeDetailStats refuge={refuge} locale={locale} labels={statLabels} />
        </div>

        <div className="space-y-10 mb-12">
          {history ? (
            <InfoBlock icon={<History size={14} className="text-alpenglow" />} title={t('history')} text={history} />
          ) : null}
          {food ? (
            <InfoBlock icon={<Utensils size={14} className="text-alpenglow" />} title={t('food')} text={food} />
          ) : null}
          {costs ? (
            <InfoBlock icon={<Wallet size={14} className="text-alpenglow" />} title={t('costs')} text={costs} />
          ) : null}
        </div>

        <div className="mb-12">
          <RefugeContactsSection refuge={refuge} labels={contactLabels} />
        </div>

        {refuge.trails.length > 0 ? (
          <section className="mb-12">
            <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-snow/55 mb-4">
              <MapPin size={14} />
              {t('onTrails')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {refuge.trails.map((trailSlug) => (
                <Link
                  key={trailSlug}
                  href={`/sentieri/${trailSlug}`}
                  className="px-3 py-1.5 rounded-full text-sm border border-white/10 text-snow/70 hover:border-alpenglow/40 hover:text-alpenglow transition-colors"
                >
                  {trailSlug.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {refuge.source ? (
          <p className="text-snow/50 text-xs font-mono mb-8">
            {t('source')}: {refuge.source}
          </p>
        ) : null}

        <AdSlot slot="in-content-mid" className="mb-8" />
      </div>

      <RefugeBookingBar refuge={refuge} locale={locale} labels={bookingLabels} />
    </div>
  );
}
