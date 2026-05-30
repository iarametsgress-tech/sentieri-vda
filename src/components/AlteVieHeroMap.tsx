'use client';

import dynamic from 'next/dynamic';
import type { RouteHighlight } from '@/components/MapView';
import { VDA_CENTER } from '@/lib/sct';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-ink/80 animate-pulse" aria-hidden />,
});

interface AlteVieHeroMapProps {
  routeHighlights: RouteHighlight[];
}

export default function AlteVieHeroMap({ routeHighlights }: AlteVieHeroMapProps) {
  return (
    <div className="absolute inset-0">
      <MapView
        center={VDA_CENTER}
        zoom={8.4}
        showOfficialTrails={false}
        routeHighlights={routeHighlights}
        className="h-full w-full"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink/95" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/40" />
    </div>
  );
}
