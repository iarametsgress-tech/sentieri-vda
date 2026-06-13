'use client';

import dynamic from 'next/dynamic';
import type { MapLabel } from '@/components/MapView';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full animate-pulse rounded-2xl bg-white/[0.03] lg:h-[520px]" />
  ),
});

/** Centroidi approssimativi delle valli valdostane (lng, lat). */
const CENTROIDS: Record<string, [number, number]> = {
  'val-ferret': [6.98, 45.86],
  'val-veny': [6.86, 45.78],
  'la-thuile': [6.93, 45.68],
  valgrisenche: [7.0, 45.6],
  'val-di-rhemes': [7.12, 45.56],
  valsavarenche: [7.2, 45.54],
  'val-di-cogne': [7.34, 45.6],
  'valle-gran-san-bernardo': [7.22, 45.86],
  valpelline: [7.45, 45.88],
  valtournenche: [7.63, 45.9],
  'valle-d-ayas': [7.71, 45.83],
  'valle-del-lys': [7.84, 45.8],
  champorcher: [7.57, 45.62],
  'bassa-valle': [7.79, 45.62],
  'vallata-centrale': [7.32, 45.74],
  'alta-valle-centri': [7.05, 45.7],
};

export default function CulturaValleyMap({
  valleys,
}: {
  valleys: { id: string; name: string }[];
}) {
  const labels: MapLabel[] = valleys
    .map((v) => (CENTROIDS[v.id] ? { text: v.name, coords: CENTROIDS[v.id] } : null))
    .filter((l): l is MapLabel => l !== null);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 shadow-[0_24px_48px_rgba(0,0,0,0.45)]">
      <MapView
        className="h-[420px] w-full lg:h-[520px]"
        center={[7.36, 45.74]}
        zoom={8.4}
        showOfficialTrails
        labels={labels}
      />
    </div>
  );
}
