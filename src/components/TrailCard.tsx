'use client';

import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Mountain } from 'lucide-react';
import type { Trail } from '@/lib/types';
import DifficultyBadge from './DifficultyBadge';

export default function TrailCard({ trail, index = 0 }: { trail: Trail; index?: number }) {
  const locale = useLocale();
  const t = useTranslations('Trails.details');

  const name = locale === 'it' ? trail.name_it : trail.name_en;
  const desc = locale === 'it' ? trail.shortDescription_it : trail.shortDescription_en;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link href={`/sentieri/${trail.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-900 mb-5">
          <img
            src={trail.hero_image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <DifficultyBadge difficulty={trail.difficulty} />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="font-mono text-xs uppercase tracking-widest text-alpenglow/90">
              {trail.valley}
            </p>
          </div>
        </div>

        <h3 className="font-display text-2xl lg:text-3xl leading-tight text-snow tracking-editorial mb-3 group-hover:text-alpenglow transition-colors">
          {name}
        </h3>

        <p className="text-snow/60 text-sm leading-relaxed mb-5 line-clamp-2">{desc}</p>

        <div className="flex items-center gap-5 text-xs text-snow/50 tabular border-t border-white/5 pt-4">
          <span className="flex items-center gap-1.5">
            <TrendingUp size={13} />
            {trail.distance_km.toFixed(1)} km
          </span>
          <span className="flex items-center gap-1.5">
            <Mountain size={13} />+{trail.elevation_gain_m} m
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {trail.duration_hours} h
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
