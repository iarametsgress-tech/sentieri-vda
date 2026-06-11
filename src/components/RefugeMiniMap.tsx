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
  geojson,
}: {
  lat: number;
  lng: number;
  label: string;
  elevation: number;
  /** Tracce GPX dei sentieri di accesso (mergeTrailsGeoJSON dei trail collegati). */
  geojson?: GeoJSON.FeatureCollection | null;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <MapView
        className="h-[320px] w-full"
        center={[lng, lat]}
        zoom={13}
        terrain3D
        geojson={geojson ?? undefined}
        lineColor="#D4A574"
        markers={[{ coords: [lng, lat], label, elevation, type: 'end' }]}
      />
    </div>
  );
}
