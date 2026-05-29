'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  ExternalLink,
  Mountain,
} from 'lucide-react';
import MapView from '@/components/MapView';
import StageCard from '@/components/StageCard';
import type { AlteViaStageSummary } from '@/lib/alte-vie';

export type AlteViaRouteData = {
  id: 'av1' | 'av2';
  tag: string;
  code: string;
  name: string;
  route: string;
  description: string;
  stats: { km: string; gain: string; stages: string; days: string };
  difficultyLabel: string;
  difficulty: string;
  seasonLabel: string;
  season: string;
  badge: string;
  cta: string;
  heroImage: string;
  guideUrl: string;
  accent: 'alpenglow' | 'ice';
  lineColor: string;
  stages: AlteViaStageSummary[];
  geojson: GeoJSON.FeatureCollection | null;
  markers: {
    coords: [number, number];
    label: string;
    elevation: number;
    type: 'start' | 'end';
  }[];
};

type Labels = {
  mapTitle: string;
  mapHint: string;
  stagesTitle: string;
  viewStage: string;
  compareTitle: string;
  compareSubtitle: string;
  selectRoute: string;
  officialGuide: string;
  stageLabel: string;
  fromTo: string;
  outsideRegion: string;
};

type Props = {
  routes: [AlteViaRouteData, AlteViaRouteData];
  labels: Labels;
  initialRouteId?: 'av1' | 'av2';
};

const accentStyles = {
  alpenglow: {
    tab: 'data-[active=true]:bg-alpenglow data-[active=true]:text-ink data-[active=true]:border-alpenglow',
    ring: 'ring-alpenglow/30',
    text: 'text-alpenglow',
    bg: 'bg-alpenglow/10 border-alpenglow/25',
    gradient: 'from-alpenglow/20',
  },
  ice: {
    tab: 'data-[active=true]:bg-ice data-[active=true]:text-ink data-[active=true]:border-ice',
    ring: 'ring-ice/30',
    text: 'text-ice',
    bg: 'bg-ice/10 border-ice/25',
    gradient: 'from-ice/20',
  },
};

export default function AlteVieExplorer({
  routes,
  labels,
  initialRouteId = 'av1',
}: Props) {
  const [activeId, setActiveId] = useState<'av1' | 'av2'>(initialRouteId);

  useEffect(() => {
    setActiveId(initialRouteId);
  }, [initialRouteId]);
  const active = routes.find((r) => r.id === activeId) ?? routes[0];
  const other = routes.find((r) => r.id !== activeId) ?? routes[1];
  const styles = accentStyles[active.accent];

  return (
    <div className="space-y-20 lg:space-y-28">
      {/* Route selector + map */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-snow/40 mb-2">
              {labels.selectRoute}
            </p>
            <h2 className="font-display text-3xl lg:text-4xl tracking-tight">{labels.mapTitle}</h2>
          </div>
          <div className="flex gap-2 p-1 rounded-full bg-white/[0.04] border border-white/10 w-fit">
            {routes.map((route) => {
              const rs = accentStyles[route.accent];
              return (
                <button
                  key={route.id}
                  type="button"
                  data-active={activeId === route.id}
                  onClick={() => setActiveId(route.id)}
                  className={`font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-full border border-transparent transition-all duration-200 text-snow/55 hover:text-snow ${rs.tab}`}
                >
                  {route.code}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8"
          >
            <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-white/10 ring-1 ring-inset ring-white/5">
              <MapView
                key={active.id}
                className="w-full h-[340px] sm:h-[420px] lg:h-[520px]"
                geojson={active.geojson ?? undefined}
                markers={active.markers}
                showOfficialTrails={false}
                terrain3D
                lineColor={active.lineColor}
              />
              <p className="px-4 py-3 text-[11px] font-mono text-snow/35 border-t border-white/5 bg-ink/80">
                {labels.mapHint}
              </p>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/10] lg:aspect-auto lg:flex-1 lg:min-h-[200px]">
                <Image
                  src={active.heroImage}
                  alt={active.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                  unoptimized={active.heroImage.startsWith('http')}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent`} />
                <span
                  className={`absolute top-4 left-4 font-mono text-xs font-bold tracking-widest border px-3 py-1 rounded-full backdrop-blur-sm ${styles.bg} ${styles.text}`}
                >
                  {active.code}
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-xl lg:text-2xl tracking-tight leading-tight mb-1">
                    {active.name}
                  </h3>
                  <p className="font-mono text-xs text-snow/50">{active.route}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[active.stats.km, active.stats.gain, active.stats.stages, active.stats.days].map(
                  (stat) => (
                    <div
                      key={stat}
                      className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3"
                    >
                      <p className="font-display text-lg tabular-nums text-snow">{stat}</p>
                    </div>
                  )
                )}
              </div>

              <p className="text-snow/65 text-sm leading-relaxed line-clamp-5">{active.description}</p>

              <div className="flex flex-wrap gap-3 text-xs font-mono text-snow/50">
                <span className="inline-flex items-center gap-1.5">
                  <Mountain size={12} className={styles.text} />
                  {active.difficultyLabel}: <span className={styles.text}>{active.difficulty}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} className={styles.text} />
                  {active.seasonLabel}: <span className={styles.text}>{active.season}</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mt-auto pt-2">
                <Link
                  href={`/sentieri?tag=${active.tag}`}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-opacity hover:opacity-90 ${
                    active.accent === 'alpenglow'
                      ? 'bg-alpenglow text-ink'
                      : 'bg-ice text-ink'
                  }`}
                >
                  {active.cta}
                  <ArrowRight size={15} />
                </Link>
                <a
                  href={active.guideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/15 text-snow/75 px-5 py-2.5 rounded-full text-sm hover:bg-white/5 transition-colors"
                >
                  {labels.officialGuide}
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Stage timeline */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className={`font-mono text-xs uppercase tracking-[0.25em] mb-2 ${styles.text}`}>
              {active.code} · {active.stats.stages}
            </p>
            <h2 className="font-display text-3xl lg:text-4xl tracking-tight">{labels.stagesTitle}</h2>
          </div>
          <Link
            href={`/sentieri?tag=${other.tag}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-snow/40 hover:text-snow/70 transition-colors"
          >
            {other.code}
            <ArrowUpRight size={13} />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {active.stages.map((stage, i) => (
              <StageCard
                key={stage.slug}
                stage={stage}
                index={i}
                stageLabel={labels.stageLabel}
                viewStageLabel={labels.viewStage}
                outsideRegionLabel={labels.outsideRegion}
                accent={active.accent}
              />
            ))}
          </motion.ul>
        </AnimatePresence>
      </section>

      {/* Compare */}
      <section className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
        <div className="p-8 lg:p-12 border-b border-white/5">
          <h2 className="font-display text-3xl lg:text-4xl tracking-tight mb-3">{labels.compareTitle}</h2>
          <p className="text-snow/55 max-w-2xl leading-relaxed">{labels.compareSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {routes.map((route) => {
            const rs = accentStyles[route.accent];
            return (
              <div key={route.id} className="p-8 lg:p-10 space-y-5">
                <span
                  className={`inline-flex font-mono text-xs font-bold tracking-widest border px-3 py-1 rounded-full ${rs.bg} ${rs.text}`}
                >
                  {route.code}
                </span>
                <h3 className="font-display text-2xl tracking-tight">{route.name}</h3>
                <p className="font-mono text-xs text-snow/45">{route.route}</p>
                <div className="flex flex-wrap gap-2">
                  {[route.stats.km, route.stats.gain, route.stats.stages].map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[10px] tabular-nums bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-snow/60"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <span className="inline-flex text-xs font-mono tracking-wide bg-emerald-500/10 text-emerald-300 border border-emerald-400/25 px-3 py-1.5 rounded-full">
                  {route.badge}
                </span>
                <Link
                  href={`/sentieri?tag=${route.tag}`}
                  className={`inline-flex items-center gap-2 text-sm font-medium ${rs.text} hover:opacity-80 transition-opacity group`}
                >
                  {route.cta}
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
