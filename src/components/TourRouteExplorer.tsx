'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ExternalLink,
  Mountain,
} from 'lucide-react';
import dynamic from 'next/dynamic';
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="w-full h-[520px] rounded-2xl bg-white/[0.03] animate-pulse" />,
});
import StageCard, { type StageCardData } from '@/components/StageCard';

export type TourRouteData = {
  id: string;
  tag: string;
  name: string;
  route: string;
  description: string;
  stats: { km: string; gain?: string; vdaSide?: string; stages: string };
  difficultyLabel: string;
  difficulty: string;
  seasonLabel: string;
  season: string;
  badge: string;
  cta: string;
  heroImage: string;
  guideUrl?: string;
  accent: 'alpenglow' | 'ice' | 'emerald' | 'snow';
  lineColor: string;
  stages: StageCardData[];
  geojson: GeoJSON.FeatureCollection | null;
  markers: {
    coords: [number, number];
    label: string;
    elevation: number;
    type: 'start' | 'end';
  }[];
};

type Labels = {
  backToTours: string;
  mapTitle: string;
  mapHint: string;
  stagesTitle: string;
  viewStage: string;
  stageLabel: string;
  outsideRegion: string;
  officialGuide?: string;
};

const accentStyles = {
  alpenglow: {
    ring: 'ring-alpenglow/30',
    text: 'text-alpenglow',
    bg: 'bg-alpenglow/10 border-alpenglow/25',
    btn: 'bg-alpenglow text-ink',
  },
  ice: {
    ring: 'ring-ice/30',
    text: 'text-ice',
    bg: 'bg-ice/10 border-ice/25',
    btn: 'bg-ice text-ink',
  },
  emerald: {
    ring: 'ring-emerald-400/30',
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/10 border-emerald-400/25',
    btn: 'bg-emerald-400 text-ink',
  },
  snow: {
    ring: 'ring-white/20',
    text: 'text-snow/80',
    bg: 'bg-white/5 border-white/15',
    btn: 'bg-snow text-ink',
  },
};

export default function TourRouteExplorer({
  route,
  labels,
}: {
  route: TourRouteData;
  labels: Labels;
}) {
  const styles = accentStyles[route.accent];

  return (
    <div className="space-y-20 lg:space-y-28">
      <Link
        href="/tour"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-snow/55 transition-colors hover:text-snow"
      >
        <ArrowLeft size={14} />
        {labels.backToTours}
      </Link>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className={`relative min-h-[320px] overflow-hidden rounded-2xl border border-white/10 ring-1 ring-inset lg:min-h-[420px] ${styles.ring}`}>
          <Image
            src={route.heroImage}
            alt={route.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized={route.heroImage.startsWith('http')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span
              className={`mb-3 inline-flex rounded-full border px-3 py-1 font-mono text-xs font-bold tracking-widest backdrop-blur-sm ${styles.bg} ${styles.text}`}
            >
              {route.badge}
            </span>
            <h1 className="text-on-image-title font-display text-3xl tracking-tight text-snow lg:text-4xl">
              {route.name}
            </h1>
            <p className="text-on-image-body mt-2 font-mono text-sm text-snow/70">
              {route.route}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="text-sm leading-relaxed text-snow/70">{route.description}</p>
          <div className="grid grid-cols-2 gap-2">
            {[route.stats.km, route.stats.stages, route.stats.vdaSide, route.stats.gain]
              .filter(Boolean)
              .map((stat) => (
                <div
                  key={stat}
                  className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                >
                  <p className="font-display text-lg tabular-nums text-snow">{stat}</p>
                </div>
              ))}
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-mono text-snow/50">
            <span className="inline-flex items-center gap-1.5">
              <Mountain size={12} className={styles.text} />
              {route.difficultyLabel}:{' '}
              <span className={styles.text}>{route.difficulty}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={12} className={styles.text} />
              {route.seasonLabel}: <span className={styles.text}>{route.season}</span>
            </span>
          </div>
          <Link
            href={`/sentieri?tag=${route.tag}`}
            className={`inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 ${styles.btn}`}
          >
            {route.cta}
            <ArrowRight size={15} />
          </Link>
          {route.guideUrl ? (
            <a
              href={route.guideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-snow/75 transition-colors hover:bg-white/5"
            >
              {labels.officialGuide}
              <ExternalLink size={14} />
            </a>
          ) : null}
        </div>
      </section>

      <section>
        <h2 className="mb-10 font-display text-3xl tracking-tight lg:text-4xl">
          {labels.mapTitle}
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <MapView
            className="h-[340px] w-full sm:h-[420px] lg:h-[520px]"
            geojson={route.geojson ?? undefined}
            markers={route.markers}
            showOfficialTrails={false}
            terrain3D
            lineColor={route.lineColor}
          />
          <p className="border-t border-white/5 bg-ink/80 px-4 py-3 font-mono text-[11px] text-snow/50">
            {labels.mapHint}
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-10 font-display text-3xl tracking-tight lg:text-4xl">
          {labels.stagesTitle}
        </h2>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {route.stages.map((stage, i) => (
            <StageCard
              key={stage.slug}
              stage={stage}
              index={i}
              stageLabel={labels.stageLabel}
              viewStageLabel={labels.viewStage}
              outsideRegionLabel={labels.outsideRegion}
              accent={route.accent}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
