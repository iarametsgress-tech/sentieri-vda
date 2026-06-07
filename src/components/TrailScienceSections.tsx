import {
  AlertTriangle,
  Bus,
  Car,
  Droplets,
  GitFork,
  Home,
  Landmark,
  Mountain,
  Tent,
} from 'lucide-react';
import { TrailPeakLink } from '@/components/TrailRelatedLinks';
import LinkedText from '@/components/LinkedText';
import type { Trail, Waypoint, WaypointType } from '@/lib/types';
import {
  getTrailCulturalNotes,
  getTrailGeology,
  getTrailTransport,
  getTrailWaterSources,
  getTrailWarnings,
  getWaypointNote,
} from '@/lib/stage-utils';
import { topicClasses } from '@/lib/topic-themes';
import { cn } from '@/lib/cn';

type Props = {
  trail: Trail;
  locale: string;
  labels: {
    waypoints: string;
    geology: string;
    geologyEyebrow: string;
    transport: string;
    parking: string;
    warnings: string;
    nearbyPeaks: string;
    culturalNotes: string;
    waterSources: string;
  };
};

const WAYPOINT_ICONS: Record<WaypointType, typeof Mountain> = {
  col: Mountain,
  rifugio: Home,
  bivacco: Tent,
  lago: Droplets,
  panorama: Landmark,
  'fonte-acqua': Droplets,
  bivio: GitFork,
};

const WAYPOINT_DOT: Record<WaypointType, string> = {
  col: 'bg-ice',
  rifugio: 'bg-alpenglow',
  bivacco: 'bg-snow/60',
  lago: 'bg-ice/70',
  panorama: 'bg-alpenglow/80',
  'fonte-acqua': 'bg-ice/50',
  bivio: 'bg-snow/40',
};

export default function TrailScienceSections({ trail, locale, labels }: Props) {
  const geology = getTrailGeology(trail, locale);
  const transport = getTrailTransport(trail, locale);
  const waterSources = getTrailWaterSources(trail, locale);
  const culturalNotes = getTrailCulturalNotes(trail, locale);
  const warnings = getTrailWarnings(trail, locale);

  return (
    <div className="space-y-14">
      {trail.waypoints && trail.waypoints.length > 0 && (
        <section>
          <SectionLabel>{labels.waypoints}</SectionLabel>
          <ol className="relative pl-6 space-y-8">
            <span
              className="absolute left-[7px] top-2 bottom-2 w-px bg-alpenglow/30"
              aria-hidden
            />
            {trail.waypoints.map((wp, i) => (
              <WaypointItem
                key={`${wp.name}-${i}`}
                waypoint={wp}
                locale={locale}
              />
            ))}
          </ol>
        </section>
      )}

      {geology && (
        <section className={cn('rounded-2xl border p-6 lg:p-8', topicClasses('geology').section, topicClasses('geology').card)}>
          <p className={cn('font-mono text-[10px] uppercase tracking-[0.3em] mb-2', topicClasses('geology').eyebrow)}>
            {labels.geologyEyebrow}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500 mb-4">
            {labels.geology}
          </p>
          <p className="text-stone-800 leading-[1.85] font-light text-[1.05rem]">
            <LinkedText text={geology} locale={locale} />
          </p>
        </section>
      )}

      {culturalNotes && (
        <section className={cn('rounded-2xl border p-6 lg:p-8', topicClasses('culture').section, topicClasses('culture').card)}>
          <SectionLabel>{labels.culturalNotes}</SectionLabel>
          <p className="text-snow/75 leading-[1.85] font-light text-[1.05rem]">
            <LinkedText text={culturalNotes} locale={locale} />
          </p>
        </section>
      )}

      {waterSources && (
        <section className={cn('rounded-2xl border p-6 lg:p-8', topicClasses('water').section, topicClasses('water').card)}>
          <SectionLabel>{labels.waterSources}</SectionLabel>
          <p className="text-snow/75 leading-[1.85] font-light">{waterSources}</p>
        </section>
      )}

      {(transport || trail.parking) && (
        <section className={cn('rounded-2xl border p-6 lg:p-8', topicClasses('transport').section, topicClasses('transport').card)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {transport && (
              <div className={cn('rounded-xl border p-5', topicClasses('transport').card)}>
                <div className={cn('flex items-center gap-2 mb-3', topicClasses('transport').icon)}>
                  <Bus size={16} />
                  <p className="font-mono text-xs uppercase tracking-widest">{labels.transport}</p>
                </div>
                <p className="text-snow/75 text-sm leading-relaxed">{transport}</p>
              </div>
            )}
            {trail.parking && (
              <div className={cn('rounded-xl border p-5', topicClasses('transport').card)}>
                <div className={cn('flex items-center gap-2 mb-3', topicClasses('transport').icon)}>
                  <Car size={16} />
                  <p className="font-mono text-xs uppercase tracking-widest">{labels.parking}</p>
                </div>
                <p className="text-snow/75 text-sm leading-relaxed">{trail.parking}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {warnings && warnings.length > 0 && (
        <section className={cn('rounded-xl border p-5', topicClasses('warnings').section, topicClasses('warnings').card)}>
          <SectionLabel>{labels.warnings}</SectionLabel>
          <ul className="space-y-3">
            {warnings.map((w, i) => (
              <li key={i} className="flex gap-3 text-sm text-snow/80 leading-relaxed">
                <AlertTriangle size={16} className={cn('shrink-0 mt-0.5', topicClasses('warnings').icon)} aria-hidden />
                <LinkedText text={w} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {trail.nearby_peaks && trail.nearby_peaks.length > 0 && (
        <section>
          <SectionLabel>{labels.nearbyPeaks}</SectionLabel>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
            {trail.nearby_peaks.map((peak) => (
              <TrailPeakLink key={peak.name} peak={peak} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function TrailFitnessBar({
  fitnessLevel,
  caloriesText,
  fitnessLabel,
}: {
  fitnessLevel: Trail['fitness_level'];
  caloriesText?: string;
  fitnessLabel: string;
}) {
  return (
    <div className="col-span-2 sm:col-span-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 mt-2 border-t border-white/5">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-snow/55 mb-2">
          {fitnessLabel}
        </p>
        <div className="flex gap-1.5" role="img" aria-label={`${fitnessLabel}: ${fitnessLevel}/5`}>
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <span
              key={n}
              className={`h-2.5 w-2.5 rounded-full ${
                n <= fitnessLevel ? 'bg-alpenglow' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
      {caloriesText && (
        <p className="font-mono text-sm text-snow/50">{caloriesText}</p>
      )}
    </div>
  );
}

function WaypointItem({
  waypoint,
  locale,
}: {
  waypoint: Waypoint;
  locale: string;
}) {
  const Icon = WAYPOINT_ICONS[waypoint.type];
  const note = getWaypointNote(waypoint, locale);

  return (
    <li className="relative flex gap-4">
      <span
        className={`absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full ring-2 ring-ink ${WAYPOINT_DOT[waypoint.type]}`}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2 mb-1">
          <Icon size={14} className="text-alpenglow shrink-0 mt-1" aria-hidden />
          <p className="font-display text-lg text-snow leading-tight">{waypoint.name}</p>
        </div>
        <p className="text-sm text-snow/80 font-mono tabular-nums pl-6">
          {waypoint.elevation_m} m ·{' '}
          {locale === 'it'
            ? `${waypoint.distance_from_start_km} km dall'inizio`
            : locale === 'fr'
              ? `${waypoint.distance_from_start_km} km depuis le départ`
              : locale === 'de'
                ? `${waypoint.distance_from_start_km} km vom Start`
                : `${waypoint.distance_from_start_km} km from start`}
        </p>
        {note && (
          <p className="text-sm text-snow/60 mt-2 pl-6 leading-relaxed">
            <LinkedText text={note} locale={locale} />
          </p>
        )}
      </div>
    </li>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.25em] text-snow/55 mb-4">{children}</p>
  );
}
