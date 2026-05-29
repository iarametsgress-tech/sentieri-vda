'use client';

import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { TrendingUp, Clock, Mountain, ArrowUpRight } from 'lucide-react';
import type { Trail } from '@/lib/types';
import { getTrailLocalizedName, getTrailLocalizedShortDesc } from '@/lib/stage-utils';
import DifficultyBadge from './DifficultyBadge';

export default function TrailCard({
  trail,
  index = 0,
}: {
  trail: Trail;
  index?: number;
}) {
  const locale = useLocale();
  const cardRef = useRef<HTMLDivElement>(null);
  const name = getTrailLocalizedName(trail, locale);
  const desc = getTrailLocalizedShortDesc(trail, locale);
  const cardImage = trail.image || trail.hero_image;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [3, -3]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-3, 3]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer"
    >
      <Link href={`/sentieri/${trail.slug}`} className="block">
        <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-sm bg-slate-900">
          <motion.div
            initial={{ scaleY: 1 }}
            whileInView={{ scaleY: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: index * 0.06 + 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 z-10 origin-top bg-ink"
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cardImage}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
            loading="lazy"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

          <div className="absolute left-4 top-4 z-20">
            <DifficultyBadge difficulty={trail.difficulty} />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-20">
            <p className="text-on-image-sm font-mono text-[10px] uppercase tracking-[0.3em] text-alpenglow">
              {trail.valley}
            </p>
          </div>

          <div
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-snow/10 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
          >
            <ArrowUpRight size={14} className="text-snow" />
          </div>
        </div>

        <h3 className="mb-3 font-display text-2xl leading-tight tracking-editorial text-snow transition-colors duration-300 group-hover:text-alpenglow lg:text-[1.7rem]">
          {name}
        </h3>

        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-snow/55">
          {desc}
        </p>

        <div className="flex items-center gap-5 border-t border-white/[0.07] pt-4 text-xs tabular text-snow/45">
          <span className="flex items-center gap-1.5">
            <TrendingUp size={12} />
            {trail.distance_km.toFixed(1)} km
          </span>
          <span className="flex items-center gap-1.5">
            <Mountain size={12} />+{trail.elevation_gain_m} m
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {trail.duration_hours} h
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
