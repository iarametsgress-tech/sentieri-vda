import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getAllTrails, getTrailBySlug, getAdjacentAV1Stages, getAdjacentAV2Stages, getAdjacentTourStages } from '@/lib/trails';
import { isSkeletonTrail, shouldIndexTrail } from '@/lib/skeleton-trails';
import dynamic from 'next/dynamic';
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="w-full h-[520px] rounded-2xl bg-white/[0.03] animate-pulse" />,
});
import DifficultyBadge from '@/components/DifficultyBadge';
import TrailConditionsBadge from '@/components/TrailConditionsBadge';
import ElevationProfile from '@/components/ElevationProfile';
import TrailScienceSections, { TrailFitnessBar } from '@/components/TrailScienceSections';
import {
  TrailFloraFaunaLinks,
  TrailRefugeLinks,
  TrailRefugesSection,
  TrailValleyLink,
  TrailMunicipalityLinks,
  TrailDifficultyLink,
  TrailThemeTagLinks,
} from '@/components/TrailRelatedLinks';
import TrailStickyBar, { TRAIL_HERO_SENTINEL_ID } from '@/components/TrailStickyBar';
import TrailGallery from '@/components/TrailGallery';
import RelatedTrails from '@/components/RelatedTrails';
import LinkedText from '@/components/LinkedText';
import AdSlot from '@/components/AdSlot';
import { SITE_URL, SITE_AUTHOR } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import type { Trail } from '@/lib/types';
import {
  getTrailLocalizedName,
  getTrailLocalizedShortDesc,
  getTrailLocalizedDescription,
  getTrailConditionsNote,
} from '@/lib/stage-utils';
import { extractRefugeSlugsFromTrail, getTrailGalleryImages } from '@/lib/refuges';
import { getLinkableThemeTagsForTrail, humanizeThemeTag } from '@/lib/hubs';
import { trailImageBlurProps } from '@/lib/blur';
import { loadTrailGeoJSON, getGpxPublicPath, gpxFileExists } from '@/lib/gpx';
import {
  Download,
  MapPin,
  Mountain,
  Clock,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Calendar,
} from 'lucide-react';

// Prerendera al build solo i sentieri curati (getAllTrails).
// I 1000+ scheletri del Catasto vengono renderizzati on-demand (ISR) al primo
// accesso e poi messi in cache: evita un build con migliaia di pagine.
export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllTrails().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const trail = getTrailBySlug(slug);
  if (!trail) return {};
  const name = getTrailLocalizedName(trail, locale);
  const desc = getTrailLocalizedShortDesc(trail, locale);
  return {
    title: name,
    description: desc,
    // Le schede scheletro (dati ufficiali ma senza foto/descrizione editoriale)
    // restano navigabili ma noindex finché non sono arricchite: niente thin content.
    ...(shouldIndexTrail(trail) ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title: name,
      description: desc,
      images: [{ url: trail.hero_image, width: 1600, height: 900 }],
      type: 'article',
    },
    alternates: {
      canonical: `/${locale}/sentieri/${slug}`,
      languages: localeAlternatesAbsolute(`/sentieri/${slug}`),
    },
  };
}

export default async function TrailDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const trail = getTrailBySlug(slug);
  if (!trail) notFound();

  const t = await getTranslations('Trails.details');
  const tTheme = await getTranslations('TrailHubs.theme');
  const name = getTrailLocalizedName(trail, locale);
  const description = getTrailLocalizedDescription(trail, locale);
  const refugeSlugs = extractRefugeSlugsFromTrail(trail);
  const galleryImages = getTrailGalleryImages(trail, refugeSlugs, locale);

  const isAV1 = trail.tags.includes('alta-via-1');
  const isAV2 = trail.tags.includes('alta-via-2');
  const tourTag = trail.tags.find((tag) => tag.startsWith('tour-') && tag !== 'tour');
  const stageNav = isAV1
    ? getAdjacentAV1Stages(slug)
    : isAV2
      ? getAdjacentAV2Stages(slug)
      : tourTag
        ? getAdjacentTourStages(slug, tourTag)
        : { prev: null, next: null };
  const { prev, next } = stageNav;
  const isStageRoute = isAV1 || isAV2 || Boolean(tourTag);
  const iconicImage = trail.image || trail.hero_image;
  const gpxPath = trail.gpx_path ?? (gpxFileExists(slug) ? getGpxPublicPath(slug) : null);
  const trailGeoJSON = loadTrailGeoJSON(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${SITE_URL}/${locale}/sentieri/${trail.slug}`,
    name,
    description,
    image: trail.hero_image,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: trail.start.coords.lat,
      longitude: trail.start.coords.lng,
    },
    isAccessibleForFree: true,
    ...(trail.updated_at ? { dateModified: trail.updated_at } : {}),
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.url,
    },
  };

  const mapMarkers = [
    {
      coords: [trail.start.coords.lng, trail.start.coords.lat] as [number, number],
      label: trail.start.name,
      elevation: trail.start.elevation_m,
      type: 'start' as const,
    },
    {
      coords: [trail.end.coords.lng, trail.end.coords.lat] as [number, number],
      label: trail.end.name,
      elevation: trail.end.elevation_m,
      type: 'end' as const,
    },
  ];

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <TrailStickyBar
        name={name}
        difficulty={trail.difficulty}
        distanceKm={trail.distance_km}
        elevationGainM={trail.elevation_gain_m}
        durationHours={trail.duration_hours}
        gpxPath={gpxPath}
        labels={{
          downloadGpx: t('downloadGpx'),
        }}
      />

      {/* ── Header compatto + immagine iconica ─────────────── */}
      <header className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-8 lg:pt-28">
        {isStageRoute && (prev || next) && (
          <div className="flex justify-between items-center mb-8 gap-4">
            {prev ? (
              <Link
                href={`/${locale}/sentieri/${prev.slug}`}
                className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-4 py-2 text-xs font-mono uppercase tracking-widest text-snow/70 hover:text-snow hover:bg-white/[0.07] transition-all"
              >
                <ArrowLeft size={13} />
                {t('prevStageShort')}
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link
                href={`/${locale}/sentieri/${next.slug}`}
                className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-4 py-2 text-xs font-mono uppercase tracking-widest text-snow/70 hover:text-snow hover:bg-white/[0.07] transition-all"
              >
                {t('nextStageShort')}
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        )}

        <p className="font-mono text-xs uppercase tracking-[0.3em] text-alpenglow mb-3">
          <TrailValleyLink label={trail.valley} locale={locale} />
        </p>
        <h1 className="font-display text-display-lg tracking-tighter mb-5 max-w-4xl">
          {name}
        </h1>
        {trail.conditions && (
          <TrailConditionsBadge
            status={trail.conditions.status}
            note={getTrailConditionsNote(trail.conditions, locale)}
            updatedAt={trail.conditions.updated_at}
            locale={locale}
            labels={{
              statusOpen: t('conditionsOpen'),
              statusCaution: t('conditionsCaution'),
              statusClosed: t('conditionsClosed'),
              updated: t('conditionsUpdated'),
            }}
          />
        )}
        <div className="flex items-center gap-3 flex-wrap mb-10">
          <TrailDifficultyLink difficulty={trail.difficulty} locale={locale}>
            <DifficultyBadge difficulty={trail.difficulty} full />
          </TrailDifficultyLink>
          <span className="font-mono text-xs text-snow/50 tracking-widest uppercase flex items-center gap-1.5">
            <Calendar size={11} />
            {trail.season.join(' · ')}
          </span>
        </div>

        {/* Full-bleed hero: `fill` + fixed aspect-ratio container (no layout shift). */}
        <div className="relative w-full aspect-[21/9] max-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-ink grain">
          <Image
            src={iconicImage}
            alt={name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
            {...(iconicImage.endsWith('.svg')
              ? { unoptimized: true }
              : trailImageBlurProps(iconicImage))}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent pointer-events-none" />
          {trail.image_credit && trail.image_source && (
            <a
              href={trail.image_source}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-3 z-10 rounded bg-ink/55 px-2 py-1 font-mono text-[10px] text-snow/60 transition-colors hover:text-snow"
            >
              © {trail.image_credit}
            </a>
          )}
        </div>
        <div id={TRAIL_HERO_SENTINEL_ID} className="h-0 w-full" aria-hidden />
      </header>

      {/* ── Main layout ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ── Main column ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-14">

          {/* Quick stats */}
          <div className="border-y border-white/5 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Stat
                icon={<TrendingUp size={15} />}
                label={t('distance')}
                value={`${trail.distance_km} km`}
              />
              <Stat
                icon={<Mountain size={15} />}
                label={t('elevationGain')}
                value={`+${trail.elevation_gain_m} m`}
                accent="ice"
              />
              <Stat
                icon={<TrendingDown size={15} />}
                label={t('elevationLoss')}
                value={`−${trail.elevation_loss_m} m`}
              />
              <Stat
                icon={<Clock size={15} />}
                label={t('duration')}
                value={`${trail.duration_hours} h`}
              />
            </div>
            <TrailFitnessBar
              fitnessLevel={trail.fitness_level}
              fitnessLabel={t('fitnessLevel')}
              caloriesText={
                trail.calories_estimate != null
                  ? t('caloriesEstimate', { n: trail.calories_estimate })
                  : undefined
              }
            />
          </div>

          {/* Elevation profile */}
          <section>
            <SectionLabel>{t('altimetricProfile')}</SectionLabel>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-end justify-between mb-3 text-xs font-mono text-snow/55">
                <span>{trail.start.name} · {trail.start.elevation_m} m</span>
                <span>{trail.end.name} · {trail.end.elevation_m} m</span>
              </div>
              <ElevationProfile
                startElevation={trail.start.elevation_m}
                endElevation={trail.end.elevation_m}
                elevationGain={trail.elevation_gain_m}
                elevationLoss={trail.elevation_loss_m}
                distanceKm={trail.distance_km}
              />
            </div>
          </section>

          {/* Map + GPX */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
              <SectionLabel>{t('mapAndRoute')}</SectionLabel>
              {gpxPath && (
                <a
                  href={gpxPath}
                  download={`${trail.slug}.gpx`}
                  className="inline-flex items-center gap-2 bg-alpenglow text-ink px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
                >
                  <Download size={14} />
                  {t('downloadGpx')}
                </a>
              )}
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/5">
              <MapView
                className="w-full h-[520px]"
                center={[
                  (trail.start.coords.lng + trail.end.coords.lng) / 2,
                  (trail.start.coords.lat + trail.end.coords.lat) / 2,
                ]}
                zoom={12}
                showOfficialTrails={!trailGeoJSON}
                terrain3D
                geojson={trailGeoJSON ?? undefined}
                markers={mapMarkers}
              />
            </div>
            {gpxPath ? (
              <p className="mt-3 text-xs text-snow/55 font-mono">
                {isAV1 || isAV2 ? t('gpxNoteAlteVia') : t('gpxNoteGeneric')}
              </p>
            ) : trail.is_transfer_stage ? (
              <p className="mt-3 text-xs text-snow/55 font-mono">
                {t('transferStageNote')}
              </p>
            ) : null}
          </section>

          {/* Description */}
          <section>
            <SectionLabel>{t('description')}</SectionLabel>
            <div className="text-snow/75 leading-[1.85] font-light text-[1.05rem] space-y-5">
              {description.split('\n').map((p, i) => (
                <p key={i}>
                  <LinkedText text={p} locale={locale} />
                </p>
              ))}
            </div>
          </section>

          <TrailScienceSections
            trail={trail}
            locale={locale}
            labels={{
              waypoints: t('waypoints'),
              geology: t('geology'),
              geologyEyebrow: t('geologyEyebrow'),
              transport: t('transport'),
              parking: t('parking'),
              warnings: t('warnings'),
              nearbyPeaks: t('nearbyPeaks'),
              culturalNotes: t('culturalNotes'),
              waterSources: t('waterSources'),
            }}
          />

          <AdSlot slot="in-content-mid" />

          {/* Start & End cards */}
          <section>
            <SectionLabel>{t('startEnd')}</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PointCard label={t('start')} name={trail.start.name} elevation={trail.start.elevation_m} type="start" />
              <PointCard label={t('end')} name={trail.end.name} elevation={trail.end.elevation_m} type="end" />
            </div>
          </section>

          {refugeSlugs.length > 0 && (
            <TrailRefugesSection
              trail={trail}
              slugs={refugeSlugs}
              locale={locale}
              label={t('refugesNearby')}
            />
          )}

          {galleryImages.length > 0 && (
            <TrailGallery images={galleryImages} label={t('gallery')} />
          )}

          {/* Flora / Fauna / Theme tags */}
          {(trail.flora.length > 0 || trail.fauna.length > 0 || getLinkableThemeTagsForTrail(trail).length > 0) && (
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {trail.flora.length > 0 && (
                <div>
                  <SectionLabel>{t('flora')}</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    <TrailFloraFaunaLinks slugs={trail.flora} />
                  </div>
                </div>
              )}
              {trail.fauna.length > 0 && (
                <div>
                  <SectionLabel>{t('fauna')}</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    <TrailFloraFaunaLinks slugs={trail.fauna} />
                  </div>
                </div>
              )}
              {getLinkableThemeTagsForTrail(trail).length > 0 && (
                <div className="sm:col-span-2">
                  <SectionLabel>{t('tags')}</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    <TrailThemeTagLinks
                      trail={trail}
                      getLabel={(tag) =>
                        tTheme.has(`tags.${tag}`)
                          ? tTheme(`tags.${tag}`)
                          : humanizeThemeTag(tag)
                      }
                    />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Stage prev/next block */}
          {isStageRoute && (prev || next) && (
            <section>
              <SectionLabel>{t('adjacentStages')}</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev && (
                  <StageNavCard
                    trail={prev}
                    locale={locale}
                    direction="prev"
                    label={t('previousStage')}
                  />
                )}
                {next && (
                  <StageNavCard
                    trail={next}
                    locale={locale}
                    direction="next"
                    label={t('nextStage')}
                  />
                )}
              </div>
            </section>
          )}

          {/* Source + last verified + author */}
          <div className="border-t border-white/5 pt-6 space-y-2">
            <p className="text-sm text-snow/70 flex items-center gap-2">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-alpenglow/15 text-[11px] font-display text-alpenglow">
                {SITE_AUTHOR.name.charAt(0)}
              </span>
              <Link href={`/${locale}/metodo`} className="hover:text-snow transition-colors">
                {t('curatedBy', { name: SITE_AUTHOR.name })}
              </Link>
            </p>
            <p className="text-xs text-snow/50">
              {t('source')}:{' '}
              <a
                href={trail.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-alpenglow hover:underline inline-flex items-center gap-1"
              >
                {trail.source.name} <ExternalLink size={11} />
              </a>{' '}
              · {trail.source.license}
            </p>
            {trail.updated_at && (
              <p className="text-xs text-snow/50 flex items-center gap-1.5">
                <Calendar size={11} />
                {t('lastVerified')}:{' '}
                <time dateTime={trail.updated_at}>
                  {new Intl.DateTimeFormat(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }).format(new Date(trail.updated_at))}
                </time>
              </p>
            )}
          </div>
        </div>

        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Quick info card */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
              <p className="font-mono text-xs uppercase tracking-widest text-snow/55 mb-1">
                {t('quickInfo')}
              </p>
              <InfoRowLinked label={t('valley')}>
                <TrailValleyLink label={trail.valley} locale={locale} />
              </InfoRowLinked>
              <InfoRowLinked label={t('municipalities')}>
                <TrailMunicipalityLinks names={trail.municipalities} locale={locale} />
              </InfoRowLinked>
              <InfoRowLinked label={t('difficulty')}>
                <TrailDifficultyLink difficulty={trail.difficulty} locale={locale}>
                  <DifficultyBadge difficulty={trail.difficulty} full />
                </TrailDifficultyLink>
              </InfoRowLinked>
              {refugeSlugs.length > 0 && (
                <div className="border-b border-white/5 pb-3">
                  <p className="text-snow/55 font-mono text-xs uppercase tracking-widest mb-2">
                    {t('refugesNearby')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <TrailRefugeLinks slugs={refugeSlugs} locale={locale} />
                  </div>
                </div>
              )}
            </div>

            <AdSlot slot="sidebar-sticky" />
          </div>
        </aside>
      </div>

      <RelatedTrails
        trail={trail}
        excludeSlugs={[prev?.slug, next?.slug].filter((s): s is string => Boolean(s))}
        labels={{
          title: t('relatedTrails'),
          subtitle: t('relatedTrailsSubtitle'),
        }}
      />
    </article>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.25em] text-snow/55 mb-4">{children}</p>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-snow/55 mb-2">
        {icon}
        {label}
      </div>
      <p
        className={`font-display text-2xl tabular-nums ${
          accent === 'ice' ? 'text-ice' : 'text-snow'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PointCard({
  label,
  name,
  elevation,
  type,
}: {
  label: string;
  name: string;
  elevation: number;
  type: 'start' | 'end';
}) {
  const accent = type === 'start' ? 'text-ice' : 'text-alpenglow';
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
      <p className={`text-xs font-mono uppercase tracking-widest ${accent} mb-2`}>{label}</p>
      <p className="font-display text-xl mb-1">{name}</p>
      <p className="text-sm text-snow/50 flex items-center gap-1.5">
        <MapPin size={12} />
        {elevation} m
      </p>
    </div>
  );
}

function InfoRowLinked({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-start gap-3 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-snow/55 font-mono text-xs uppercase tracking-widest shrink-0">
        {label}
      </span>
      <span className="text-snow/80 text-right leading-tight">{children}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-3 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-snow/55 font-mono text-xs uppercase tracking-widest shrink-0">
        {label}
      </span>
      <span className="text-snow/80 text-right leading-tight">{value}</span>
    </div>
  );
}

function StageNavCard({
  trail,
  locale,
  direction,
  label,
}: {
  trail: Pick<Trail, 'slug' | 'name_it' | 'name_en' | 'name_fr' | 'name_de' | 'distance_km' | 'difficulty'>;
  locale: string;
  direction: 'prev' | 'next';
  label: string;
}) {
  const name = getTrailLocalizedName(trail as Trail, locale);
  return (
    <Link
      href={`/${locale}/sentieri/${trail.slug}`}
      className="group block bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-snow/55 mb-2 flex items-center gap-1.5">
        {direction === 'prev' && <ArrowLeft size={11} />}
        {label}
        {direction === 'next' && <ArrowRight size={11} />}
      </p>
      <p className="font-display text-base leading-tight text-snow group-hover:text-alpenglow transition-colors">
        {name}
      </p>
      <p className="text-xs text-snow/55 mt-1 font-mono">
        {trail.distance_km} km · {trail.difficulty}
      </p>
    </Link>
  );
}
