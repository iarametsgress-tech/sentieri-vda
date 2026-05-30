'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Clock, Download, Mountain, TrendingUp } from 'lucide-react';
import DifficultyBadge from '@/components/DifficultyBadge';
import type { Difficulty } from '@/lib/types';

const SENTINEL_ID = 'trail-detail-hero';

type Props = {
  name: string;
  difficulty: Difficulty;
  distanceKm: number;
  elevationGainM: number;
  durationHours: number;
  gpxPath: string | null;
  labels: {
    downloadGpx: string;
  };
};

export default function TrailStickyBar({
  name,
  difficulty,
  distanceKm,
  elevationGainM,
  durationHours,
  gpxPath,
  labels,
}: Props) {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const sentinel = document.getElementById(SENTINEL_ID);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label={name}
          initial={reducedMotion ? { opacity: 0 } : { y: -56, opacity: 0 }}
          animate={reducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { y: -56, opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex fixed top-16 inset-x-0 z-40 h-14 items-center border-b border-white/5 bg-ink/90 backdrop-blur-md"
        >
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <p
                className="truncate font-display text-sm text-snow max-w-[min(100%,280px)] lg:max-w-md"
                title={name}
              >
                {name}
              </p>
              <span className="text-snow/25 shrink-0" aria-hidden>
                ·
              </span>
              <DifficultyBadge difficulty={difficulty} />
              <span className="text-snow/25 shrink-0" aria-hidden>
                ·
              </span>
              <div className="flex items-center gap-3 shrink-0 font-mono text-xs text-snow/60 tabular-nums">
                <span className="inline-flex items-center gap-1">
                  <TrendingUp size={12} className="text-snow/55" aria-hidden />
                  {distanceKm} km
                </span>
                <span className="inline-flex items-center gap-1 text-ice/90">
                  <Mountain size={12} aria-hidden />+{elevationGainM} m
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} className="text-snow/55" aria-hidden />
                  {durationHours} h
                </span>
              </div>
            </div>

            {gpxPath && (
              <a
                href={gpxPath}
                download
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-alpenglow px-4 py-2 text-xs font-medium text-ink hover:opacity-90 transition-opacity"
              >
                <Download size={13} aria-hidden />
                {labels.downloadGpx}
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { SENTINEL_ID as TRAIL_HERO_SENTINEL_ID };
