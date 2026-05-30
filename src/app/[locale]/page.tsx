import { setRequestLocale, getTranslations } from 'next-intl/server';
import Hero from '@/components/Hero';
import TrailCard from '@/components/TrailCard';
import dynamic from 'next/dynamic';
import AdSlot from '@/components/AdSlot';
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="w-full h-[520px] rounded-2xl bg-white/[0.03] animate-pulse" />,
});
import CounterStat from '@/components/CounterStat';
import ScrollReveal from '@/components/ScrollReveal';
import { getFeaturedTrails, getAllTrails, getTotalTrailKm, getTotalAlteViaStages } from '@/lib/trails';
import { getAlteViaStages } from '@/lib/alte-vie';
import { mergeTrailsGeoJSON } from '@/lib/gpx';
import type { RouteHighlight } from '@/components/MapView';
import { Link } from '@/i18n/routing';
import { ArrowUpRight, Mountain, Footprints, Map, Sun } from 'lucide-react';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const trails = getFeaturedTrails(6);
  const trailCount = getAllTrails().length;
  const totalKm = getTotalTrailKm();
  const alteViaStages = getTotalAlteViaStages();

  const paths = [
    {
      title: t('pathAv1Title'),
      sub: t('pathAv1Sub'),
      href: '/alte-vie',
      icon: Mountain,
      color: 'from-ice/10 to-transparent',
      border: 'border-ice/20 hover:border-ice/50',
    },
    {
      title: t('pathTmbTitle'),
      sub: t('pathTmbSub'),
      href: '/tour',
      icon: Footprints,
      color: 'from-alpenglow/10 to-transparent',
      border: 'border-alpenglow/20 hover:border-alpenglow/50',
    },
    {
      title: t('pathGpTitle'),
      sub: t('pathGpSub'),
      href: '/sentieri',
      icon: Sun,
      color: 'from-emerald-500/10 to-transparent',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
    },
    {
      title: t('pathDayTitle'),
      sub: t('pathDaySub'),
      href: '/sentieri',
      icon: Map,
      color: 'from-white/5 to-transparent',
      border: 'border-white/10 hover:border-white/30',
    },
  ];

  const av1Stages = getAlteViaStages('alta-via-1');
  const av2Stages = getAlteViaStages('alta-via-2');
  const av1Geo = mergeTrailsGeoJSON(av1Stages.map((s) => s.slug));
  const av2Geo = mergeTrailsGeoJSON(av2Stages.map((s) => s.slug));

  const routeHighlights: RouteHighlight[] = [];
  if (av1Geo && av1Stages[0]) {
    routeHighlights.push({
      id: 'av1',
      geojson: av1Geo,
      lineColor: '#D4A574',
      label: t('mapAv1'),
      href: `/${locale}/alte-vie?route=av1`,
      labelCoords: [
        av1Stages[0].start.coords.lng,
        av1Stages[0].start.coords.lat,
      ],
    });
  }
  if (av2Geo && av2Stages[0]) {
    routeHighlights.push({
      id: 'av2',
      geojson: av2Geo,
      lineColor: '#5BC0EB',
      label: t('mapAv2'),
      href: `/${locale}/alte-vie?route=av2`,
      labelCoords: [
        av2Stages[0].start.coords.lng,
        av2Stages[0].start.coords.lat,
      ],
    });
  }

  return (
    <>
      <Hero />

      <section className="border-y border-white/5 bg-white/[0.01]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 lg:grid-cols-4 lg:gap-6 lg:px-10 lg:py-20">
          <CounterStat
            value={trailCount}
            label={t('statTrails')}
            duration={1600}
          />
          <CounterStat
            value={alteViaStages}
            suffix={t('statStagesSuffix')}
            label={t('statAlteVie')}
            duration={1400}
          />
          <CounterStat
            value={totalKm}
            suffix=" km"
            label={t('statTotalKm')}
            duration={2200}
          />
          <CounterStat
            value={6}
            suffix={t('statToursSuffix')}
            label={t('statTours')}
            duration={1000}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <ScrollReveal variant="slide-right" delay={0.05}>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-alpenglow">
                {t('featuredEyebrow')}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={0.1}>
              <h2 className="font-display text-display-lg max-w-2xl tracking-tighter">
                {t('featuredTitle')}
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal variant="fade-in" delay={0.2}>
            <Link
              href="/sentieri"
              className="group hidden items-center gap-1.5 text-sm text-snow/50 transition-colors hover:text-snow sm:inline-flex"
            >
              {t('allTrails')}
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {trails.map((trail, i) => (
            <TrailCard key={trail.slug} trail={trail} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <ScrollReveal variant="fade-up">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-alpenglow">
            {t('choosePathEyebrow')}
          </p>
          <h2 className="mb-12 font-display text-display-md tracking-tighter">
            {t('choosePathTitle')}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((path, i) => {
            const Icon = path.icon;
            return (
              <ScrollReveal key={path.title} variant="fade-up" delay={i * 0.07}>
                <Link
                  href={path.href}
                  className={`group block rounded-xl border bg-gradient-to-b p-6 ${path.color} ${path.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]`}
                >
                  <Icon
                    size={22}
                    className="mb-4 text-snow/50 transition-colors group-hover:text-snow"
                  />
                  <p className="mb-1.5 font-display text-xl tracking-tight text-snow">
                    {path.title}
                  </p>
                  <p className="text-xs leading-relaxed text-snow/45">{path.sub}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-snow/30 transition-colors group-hover:text-snow/70">
                    {t('exploreCta')}
                    <ArrowUpRight
                      size={11}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <AdSlot slot="header-billboard" />
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-10">
        <ScrollReveal variant="fade-up">
          <h2 className="mb-4 font-display text-display-md tracking-tighter">
            {t('exploreMapTitle')}
          </h2>
          <p className="mb-10 max-w-xl text-snow/55">
            {t('exploreMapDescription')}
          </p>
        </ScrollReveal>
        <ScrollReveal variant="scale" delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.6)]">
            <MapView
              className="h-[600px] w-full"
              zoom={9}
              showOfficialTrails
              routeHighlights={routeHighlights}
            />
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
