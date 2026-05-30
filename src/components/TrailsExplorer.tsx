'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import TrailCard from './TrailCard';
import type { Trail, Difficulty } from '@/lib/types';
import { cn } from '@/lib/cn';

const DIFFICULTIES: Difficulty[] = ['T', 'E', 'EE', 'EEA', 'A'];

const ROUTE_TAGS = [
  'alta-via-1',
  'alta-via-2',
  'tour-mont-blanc',
  'tour-monte-rosa',
  'tour-cervino',
  'tour-gran-paradiso',
  'tour-rutor',
  'tour-gran-combin',
] as const;

type RouteTag = (typeof ROUTE_TAGS)[number];

export default function TrailsExplorer({
  trails,
  initialTag,
}: {
  trails: Trail[];
  initialTag?: string;
}) {
  const t = useTranslations('Trails');
  const [diff, setDiff] = useState<Difficulty | 'all'>('all');
  const [valley, setValley] = useState<string>('all');
  const [maxHours, setMaxHours] = useState<number>(24);
  const [routeTag, setRouteTag] = useState<RouteTag | 'all'>(
    ROUTE_TAGS.includes(initialTag as RouteTag) ? (initialTag as RouteTag) : 'all',
  );

  const valleys = useMemo(() => Array.from(new Set(trails.map((tr) => tr.valley))).sort(), [trails]);

  const availableRouteTags = useMemo(
    () => ROUTE_TAGS.filter((tag) => trails.some((tr) => tr.tags.includes(tag))),
    [trails],
  );

  const filtered = useMemo(() => {
    return trails.filter((tr) => {
      if (diff !== 'all' && tr.difficulty !== diff) return false;
      if (valley !== 'all' && tr.valley !== valley) return false;
      if (tr.duration_hours > maxHours) return false;
      if (routeTag !== 'all' && !tr.tags.includes(routeTag)) return false;
      return true;
    });
  }, [trails, diff, valley, maxHours, routeTag]);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-6 lg:-mx-10 px-6 lg:px-10 py-4 bg-ink/90 backdrop-blur-md border-y border-white/5 mb-12 flex flex-wrap items-center gap-6">
        {/* Route / itinerary */}
        {availableRouteTags.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-snow/55 shrink-0">
              {t('filterRoute')}
            </span>
            <select
              value={routeTag}
              onChange={(e) => setRouteTag(e.target.value as RouteTag | 'all')}
              className="bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-snow focus:outline-none focus:border-alpenglow/50 min-w-[180px]"
            >
              <option value="all">{t('all')}</option>
              {availableRouteTags.map((tag) => (
                <option key={tag} value={tag}>
                  {t(`routeTags.${tag}`)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Difficulty */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-snow/55">
            {t('filterDifficulty')}
          </span>
          <div className="flex gap-1">
            <FilterChip active={diff === 'all'} onClick={() => setDiff('all')}>
              {t('all')}
            </FilterChip>
            {DIFFICULTIES.map((d) => (
              <FilterChip key={d} active={diff === d} onClick={() => setDiff(d)}>
                {d}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Valley */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-snow/55">
            {t('filterValley')}
          </span>
          <select
            value={valley}
            onChange={(e) => setValley(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-snow focus:outline-none focus:border-alpenglow/50"
          >
            <option value="all">{t('all')}</option>
            {valleys.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-widest text-snow/55">
            {t('filterDuration')}
          </span>
          <input
            type="range"
            min={1}
            max={24}
            value={maxHours}
            onChange={(e) => setMaxHours(Number(e.target.value))}
            className="w-32 accent-alpenglow"
          />
          <span className="text-sm tabular text-snow/70 w-12">{maxHours}h</span>
        </div>

        <div className="ml-auto text-sm text-snow/50 tabular">
          {filtered.length} / {trails.length}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-snow/55 py-20 text-center">{t('noResults')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {filtered.map((trail, i) => (
            <TrailCard key={trail.slug} trail={trail} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm transition-colors',
        active
          ? 'bg-snow text-ink'
          : 'bg-white/5 text-snow/70 hover:bg-white/10 hover:text-snow'
      )}
    >
      {children}
    </button>
  );
}
