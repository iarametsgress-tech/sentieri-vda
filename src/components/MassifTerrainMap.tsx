'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-2xl bg-white/[0.04]" aria-hidden />
  ),
});

interface MassifTerrainMapProps {
  center: [number, number];
  zoom?: number;
  label: string;
  hint: string;
}

export default function MassifTerrainMap({
  center,
  zoom = 11,
  label,
  hint,
}: MassifTerrainMapProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.03] px-5 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ice">{label}</p>
        <p className="hidden text-[10px] text-snow/40 sm:block">{hint}</p>
      </div>
      <MapView
        center={center}
        zoom={zoom}
        terrain3D
        showOfficialTrails={false}
        className="h-[420px] w-full lg:h-[480px]"
      />
    </div>
  );
}
