'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { ArrowUpRight, MapPin, Mountain, TrendingUp } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import { COUNTRY_FLAGS, type CountryCode } from '@/lib/stage-utils';
import type { Trail } from '@/lib/types';

export type StageCardData = {
  slug: string;
  stageNum: number;
  name: string;
  shortDescription: string;
  distance_km: number;
  elevation_gain_m: number;
  difficulty: Trail['difficulty'];
  image: string;
  startName: string;
  endName: string;
  countries: CountryCode[];
  outsideVda?: boolean;
};

type Accent = 'alpenglow' | 'ice' | 'emerald' | 'snow';

const accentNumColor: Record<Accent, string> = {
  alpenglow: 'text-alpenglow/90',
  ice: 'text-ice/90',
  emerald: 'text-emerald-400/90',
  snow: 'text-snow/90',
};

const accentBorder: Record<Accent, string> = {
  alpenglow: 'group-hover:border-alpenglow/40',
  ice: 'group-hover:border-ice/40',
  emerald: 'group-hover:border-emerald-400/40',
  snow: 'group-hover:border-white/30',
};

export default function StageCard({
  stage,
  index,
  stageLabel,
  viewStageLabel,
  outsideRegionLabel,
  accent = 'alpenglow',
}: {
  stage: StageCardData;
  index: number;
  stageLabel: string;
  viewStageLabel: string;
  outsideRegionLabel?: string;
  accent?: Accent;
}) {
  const num = String(stage.stageNum).padStart(2, '0');

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/sentieri/${stage.slug}`}
        className={`group block overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] transition-colors hover:bg-white/[0.04] ${accentBorder[accent]}`}
      >
        <div className="relative h-48 overflow-hidden sm:h-52">
          <Image
            src={stage.image}
            alt={stage.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 400px"
            unoptimized={stage.image.startsWith('http')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <span
            className={`absolute left-3 top-3 font-display text-4xl tabular-nums leading-none ${accentNumColor[accent]}`}
          >
            {num}
          </span>
          <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
            <DifficultyBadge difficulty={stage.difficulty} />
            <div className="flex gap-1 rounded-full border border-white/10 bg-ink/70 px-2 py-1 backdrop-blur-sm">
              {stage.countries.map((c) => (
                <span key={c} className="text-sm leading-none" title={c}>
                  {COUNTRY_FLAGS[c]}
                </span>
              ))}
            </div>
          </div>
          {stage.outsideVda && outsideRegionLabel ? (
            <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-ink/75 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-snow/60 backdrop-blur-sm">
              {outsideRegionLabel}
            </span>
          ) : null}
        </div>
        <div className="space-y-3 p-5">
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-snow/35">
              {stageLabel} {stage.stageNum}
            </p>
            <h3 className="font-display text-lg leading-snug tracking-tight transition-colors group-hover:text-snow">
              {stage.name}
            </h3>
          </div>
          <p className="flex items-start gap-1.5 text-xs font-mono text-snow/45">
            <MapPin size={11} className="mt-0.5 shrink-0" />
            <span>
              {stage.startName} → {stage.endName}
            </span>
          </p>
          <p className="line-clamp-2 text-sm leading-relaxed text-snow/55">
            {stage.shortDescription}
          </p>
          <div className="flex items-center justify-between border-t border-white/5 pt-2">
            <div className="flex gap-4 font-mono text-xs tabular-nums text-snow/45">
              <span className="inline-flex items-center gap-1">
                <TrendingUp size={11} />
                {stage.distance_km} km
              </span>
              <span className="inline-flex items-center gap-1">
                <Mountain size={11} />+{stage.elevation_gain_m} m
              </span>
            </div>
            <span className="inline-flex items-center gap-1 font-mono text-xs text-snow/35 transition-colors group-hover:text-alpenglow">
              {viewStageLabel}
              <ArrowUpRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}
