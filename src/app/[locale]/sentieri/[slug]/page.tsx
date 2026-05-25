import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getAllTrails, getTrailBySlug, getAdjacentAV1Stages } from '@/lib/trails';
import MapView from '@/components/MapView';
import DifficultyBadge from '@/components/DifficultyBadge';
import ElevationProfile from '@/components/ElevationProfile';
import AdSlot from '@/components/AdSlot';
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
  const name = locale === 'it' ? trail.name_it : trail.name_en;
  const desc = locale === 'it' ? trail.shortDescription_it : trail.shortDescription_en;
  return {
    title: name,
    description: desc,
    openGraph: {
      title: name,
      description: desc,
      images: [{ url: trail.hero_image, width: 1600, height: 900 }],
      type: 'article',
    },
    alternates: {
      canonical: `/${locale}/sentieri/${slug}`,
      languages: { it: `/it/sentieri/${slug}`, en: `/en/sentieri/${slug}` },
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
  const name = locale === 'it' ? trail.name_it : trail.name_en;
  const description = locale === 'it' ? trail.description_it : trail.description_en;

  const { prev, next } = getAdjacentAV1Stages(slug);
  const isAV1 = trail.tags.includes('alta-via-1');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `https://sentierivda.it/${locale}/sentieri/${trail.slug}`,
    name,
    description,
    image: trail.hero_image,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: trail.start.coords.lat,
      longitude: trail.start.coords.lng,
    },
    isAccessibleForFree: true,
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

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="relative h-[70svh] min-h-[480px] overflow-hidden grain">
        <Image
          src={trail.hero_image}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          unoptimized={trail.hero_image.startsWith('http')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

        {/* AV1 stage navigation overlay */}
        {isAV1 && (prev || next) && (
          <div className="absolute top-6 left-0 right-0 flex justify-between px-6 lg:px-10 pointer-events-none">
            {prev ? (
              <Link
                href={`/${locale}/sentieri/${prev.slug}`}
                className="pointer-events-auto flex items-center gap-2 bg-ink/70 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-xs font-mono uppercase tracking-widest text-snow/80 hover:bg-ink hover:text-snow transition-all"
              >
                <ArrowLeft size={13} />
                {locale === 'it' ? 'Tappa prec.' : 'Prev stage'}
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link
                href={`/${locale}/sentieri/${next.slug}`}
                className="pointer-events-auto flex items-center gap-2 bg-ink/70 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-xs font-mono uppercase tracking-widest text-snow/80 hover:bg-ink hover:text-snow transition-all"
              >
                {locale === 'it' ? 'Tappa succ.' : 'Next stage'}
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10 pb-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-alpenglow mb-3">
            {trail.valley}
          </p>
          <h1 className="font-display text-display-lg tracking-tighter mb-5 max-w-4xl">
            {name}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <DifficultyBadge difficulty={trail.difficulty} full />
            <span className="font-mono text-xs text-snow/50 tracking-widest uppercase flex items-center gap-1.5">
              <Calendar size={11} />
              {trail.season.join(' · ')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main layout ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ── Main column ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-14">

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-y border-white/5 py-8">
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

          {/* Elevation profile */}
          <section>
            <SectionLabel>{t('altimetricProfile')}</SectionLabel>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-end justify-between mb-3 text-xs font-mono text-snow/40">
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

          {/* Map */}
          <section>
            <SectionLabel>{locale === 'it' ? 'Mappa 3D' : '3D Map'}</SectionLabel>
            <div className="rounded-2xl overflow-hidden border border-white/5">
              <MapView
                className="w-full h-[520px]"
                center={[
                  (trail.start.coords.lng + trail.end.coords.lng) / 2,
                  (trail.start.coords.lat + trail.end.coords.lat) / 2,
                ]}
                zoom={12}
                showOfficialTrails
                terrain3D
                markers={mapMarkers}
              />
            </div>
            {trail.gpx_url && (
              <a
                href={trail.gpx_url}
                download
                className="mt-4 inline-flex items-center gap-2 bg-alpenglow text-ink px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Download size={14} />
                {t('downloadGpx')}
              </a>
            )}
          </section>

          {/* Description */}
          <section>
            <SectionLabel>{t('description')}</SectionLabel>
            <div className="text-snow/75 leading-[1.85] font-light text-[1.05rem] space-y-5">
              {description.split('\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <AdSlot slot="in-content-mid" />

          {/* Start & End cards */}
          <section>
            <SectionLabel>{locale === 'it' ? 'Partenza e arrivo' : 'Start & end'}</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PointCard label={t('start')} name={trail.start.name} elevation={trail.start.elevation_m} type="start" />
              <PointCard label={t('end')} name={trail.end.name} elevation={trail.end.elevation_m} type="end" />
            </div>
          </section>

          {/* Flora / Fauna */}
          {(trail.flora.length > 0 || trail.fauna.length > 0) && (
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {trail.flora.length > 0 && (
                <div>
                  <SectionLabel>{t('flora')}</SectionLabel>
                  <ul className="flex flex-wrap gap-2">
                    {trail.flora.map((f) => (
                      <li
                        key={f}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-snow/75 capitalize"
                      >
                        {f.replace(/-/g, ' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {trail.fauna.length > 0 && (
                <div>
                  <SectionLabel>{t('fauna')}</SectionLabel>
                  <ul className="flex flex-wrap gap-2">
                    {trail.fauna.map((f) => (
                      <li
                        key={f}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-snow/75 capitalize"
                      >
                        {f.replace(/-/g, ' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* AV1 prev/next block */}
          {isAV1 && (prev || next) && (
            <section>
              <SectionLabel>
                {locale === 'it' ? 'Tappe adiacenti' : 'Adjacent stages'}
              </SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev && (
                  <StageNavCard
                    trail={prev}
                    locale={locale}
                    direction="prev"
                    label={locale === 'it' ? 'Tappa precedente' : 'Previous stage'}
                  />
                )}
                {next && (
                  <StageNavCard
                    trail={next}
                    locale={locale}
                    direction="next"
                    label={locale === 'it' ? 'Tappa successiva' : 'Next stage'}
                  />
                )}
              </div>
            </section>
          )}

          {/* Source */}
          <p className="text-xs text-snow/35 border-t border-white/5 pt-6">
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
        </div>

        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Quick info card */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
              <p className="font-mono text-xs uppercase tracking-widest text-snow/40 mb-1">
                {locale === 'it' ? 'Info rapide' : 'Quick info'}
              </p>
              <InfoRow label={locale === 'it' ? 'Valle' : 'Valley'} value={trail.valley} />
              <InfoRow
                label={locale === 'it' ? 'Comuni' : 'Municipalities'}
                value={trail.municipalities.join(', ')}
              />
              <InfoRow
                label={t('difficulty')}
                value={trail.difficulty}
              />
              {trail.refuges.length > 0 && (
                <InfoRow
                  label={locale === 'it' ? 'Rifugi' : 'Refuges'}
                  value={trail.refuges.length.toString()}
                />
              )}
            </div>

            <AdSlot slot="sidebar-sticky" />
          </div>
        </aside>
      </div>
    </article>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.25em] text-snow/40 mb-4">{children}</p>
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
      <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-snow/40 mb-2">
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-3 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-snow/40 font-mono text-xs uppercase tracking-widest shrink-0">
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
  trail: { slug: string; name_it: string; name_en: string; distance_km: number; difficulty: string };
  locale: string;
  direction: 'prev' | 'next';
  label: string;
}) {
  const name = locale === 'it' ? trail.name_it : trail.name_en;
  return (
    <Link
      href={`/${locale}/sentieri/${trail.slug}`}
      className="group block bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-snow/40 mb-2 flex items-center gap-1.5">
        {direction === 'prev' && <ArrowLeft size={11} />}
        {label}
        {direction === 'next' && <ArrowRight size={11} />}
      </p>
      <p className="font-display text-base leading-tight text-snow group-hover:text-alpenglow transition-colors">
        {name}
      </p>
      <p className="text-xs text-snow/40 mt-1 font-mono">
        {trail.distance_km} km · {trail.difficulty}
      </p>
    </Link>
  );
}
