'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] w-full rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse" />
  ),
});

export default function RefugeMiniMap({
  lat,
  lng,
  label,
  elevation,
}: {
  lat: number;
  lng: number;
  label: string;
  elevation: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <MapView
        className="h-[320px] w-full"
        center={[lng, lat]}
        zoom={12}
        terrain3D
        markers={[{ coords: [lng, lat], label, elevation, type: 'end' }]}
      />
    </div>
  );
}
