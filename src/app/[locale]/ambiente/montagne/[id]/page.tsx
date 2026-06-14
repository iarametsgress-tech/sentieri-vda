import type { ReactNode } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Mountain, Layers, History, Footprints } from 'lucide-react';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import {
  getMassifGroupById,
  getMassifGroups,
  getMassifOverview,
  getMassifOverviewText,
  getMassifHighlights,
  getMassifSectionText,
  getMassifMapCenter,
  getPeakName,
  getPeakDetail,
} from '@/lib/environment';
import { routing } from '@/i18n/routing';
import TrailGallery, { type GalleryImage } from '@/components/TrailGallery';
import LinkedText from '@/components/LinkedText';

const MassifTerrainMap = dynamic(() => import('@/components/MassifTerrainMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] animate-pulse rounded-2xl bg-white/[0.04] lg:h-[480px]" />
  ),
});

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getMassifGroups().map(({ id }) => ({ locale, id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const group = getMassifGroupById(id);
  if (!group) return { title: 'Montagna' };
  const name = locale === 'it' ? group.massif_it : group.massif_en;
  const t = await getTranslations({ locale, namespace: 'Ambiente.massif' });
  return {
    title: `${name} — ${t('metaTitle')}`,
    description: getMassifOverviewText(getMassifOverview(id) ?? { id, overview_it: getPeakDetail(group.primary, 'it'), overview_en: getPeakDetail(group.primary, 'en') }, locale).slice(0, 160),
    alternates: {
      canonical: `${SITE_URL}/${locale}/ambiente/montagne/${id}`,
      languages: localeAlternatesAbsolute(`/ambiente/montagne/${id}`),
    },
  };
}

function DetailBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Mountain;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:p-8">
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-snow tracking-tight">
        <Icon size={18} className="text-ice shrink-0" />
        {title}
      </h2>
      <div className="text-snow/65 leading-relaxed space-y-4">{children}</div>
    </section>
  );
}

export default async function MassifDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const group = getMassifGroupById(id);
  if (!group) notFound();

  const t = await getTranslations('Ambiente.massif');
  const overview = getMassifOverview(id);
  const massifName = locale === 'it' ? group.massif_it : group.massif_en;
  const overviewText = overview
    ? getMassifOverviewText(overview, locale)
    : getPeakDetail(group.primary, locale);
  const highlights = overview ? getMassifHighlights(overview, locale) : [];
  const geology = overview ? getMassifSectionText(overview, locale, 'geology') : undefined;
  const history = overview ? getMassifSectionText(overview, locale, 'history') : undefined;
  const trails = overview ? getMassifSectionText(overview, locale, 'trails') : undefined;
  const mapCenter = overview ? getMassifMapCenter(overview) : undefined;

  const allPeaks = [group.primary, ...group.secondaries];
  const seenImg = new Set<string>();
  const galleryImages: GalleryImage[] = [];
  for (const peak of allPeaks) {
    if (peak.image && !seenImg.has(peak.image)) {
      seenImg.add(peak.image);
      galleryImages.push({ src: peak.image, alt: `${getPeakName(peak, locale)} · ${peak.elevation_m} m` });
    }
  }

  const isIT = locale === 'it';

  return (
    <article>
      <section className="relative min-h-[50vh] overflow-hidden lg:min-h-[58vh]">
        <div className="absolute inset-0">
          <Image
            src={group.primary.image}
            alt={massifName}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        </div>
        <div className="relative mx-auto flex min-h-[50vh] max-w-4xl flex-col justify-end px-6 pb-12 pt-28 lg:min-h-[58vh] lg:px-10 lg:pb-16">
          <Link
            href="/ambiente#montagne"
            className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-snow/60 hover:text-snow transition-colors"
          >
            <ArrowLeft size={14} />
            {t('backToMontagne')}
          </Link>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.35em] text-alpenglow">
            {t('eyebrow')}
          </p>
          <h1 className="text-on-image-title font-display text-display-md tracking-tighter">
            {massifName}
          </h1>
          <p className="text-on-image-body mt-4 max-w-2xl text-lg text-snow/80 leading-relaxed">
            {getPeakName(group.primary, locale)} · {group.primary.elevation_m} m
            {group.peaks.some((p) => p.is_4000) ? (
              <span className="ml-3 font-mono text-sm text-alpenglow">4000+</span>
            ) : null}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-14 lg:px-10 lg:py-20 space-y-12">
        <div className="prose-alpine max-w-none">
          <p className="text-snow/75 text-lg leading-relaxed">
            <LinkedText text={overviewText} locale={locale} />
          </p>

          {highlights.length > 0 ? (
            <div className="mt-8">
              <h2 className="font-display text-lg text-snow mb-4">{t('highlightsTitle')}</h2>
              <ul className="space-y-2">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-snow/65">
                    <Mountain size={14} className="text-ice shrink-0 mt-1" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {mapCenter ? (
          <div>
            <h2 className="font-display text-2xl text-snow tracking-tight mb-4">
              {t('terrain3dTitle')}
            </h2>
            <p className="text-snow/50 text-sm mb-6 leading-relaxed">{t('terrain3dHint')}</p>
            <MassifTerrainMap
              center={mapCenter}
              zoom={overview?.map_zoom ?? 10.5}
              label={t('terrain3dLabel')}
              hint={isIT ? 'Ruota · inclina · zoom' : 'Rotate · tilt · zoom'}
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6">
          {geology ? (
            <DetailBlock icon={Layers} title={t('geologyTitle')}>
              <p><LinkedText text={geology} locale={locale} /></p>
            </DetailBlock>
          ) : null}
          {history ? (
            <DetailBlock icon={History} title={t('historyTitle')}>
              <p><LinkedText text={history} locale={locale} /></p>
            </DetailBlock>
          ) : null}
          {trails ? (
            <DetailBlock icon={Footprints} title={t('trailsTitle')}>
              <p><LinkedText text={trails} locale={locale} /></p>
            </DetailBlock>
          ) : null}
        </div>

        <div>
          <h2 className="font-display text-2xl text-snow tracking-tight mb-6">
            {t('summitsTitle')}
          </h2>
          <div className="space-y-6">
            {[group.primary, ...group.secondaries].map((peak) => (
              <section
                key={peak.id}
                id={`peak-${peak.id}`}
                className="scroll-mt-32 rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:p-8"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                  <h3 className="font-display text-xl text-snow">{getPeakName(peak, locale)}</h3>
                  <p className="font-display text-2xl text-ice tabular-nums">
                    {peak.elevation_m}
                    <span className="text-base text-snow/50 ml-1">m</span>
                  </p>
                </div>
                <p className="text-snow/65 leading-relaxed whitespace-pre-line">
                  <LinkedText text={getPeakDetail(peak, locale)} locale={locale} />
                </p>
              </section>
            ))}
          </div>
        </div>

        {galleryImages.length > 1 && (
          <div>
            <TrailGallery images={galleryImages} label={t('gallery')} />
          </div>
        )}
      </div>
    </article>
  );
}
