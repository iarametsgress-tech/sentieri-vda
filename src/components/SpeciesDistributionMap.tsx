'use client';

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { VDA_CENTER } from '@/lib/sct';
import type { DistributionZone } from '@/lib/species-types';

function circleRing(
  center: [number, number],
  radiusKm: number,
  steps = 48
): [number, number][] {
  const ring: [number, number][] = [];
  const latRad = (center[1] * Math.PI) / 180;
  const kmPerDegLat = 111.32;
  const kmPerDegLng = 111.32 * Math.cos(latRad);

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dx = (radiusKm * Math.cos(angle)) / kmPerDegLng;
    const dy = (radiusKm * Math.sin(angle)) / kmPerDegLat;
    ring.push([center[0] + dx, center[1] + dy]);
  }
  return ring;
}

function zonesToGeoJSON(zones: DistributionZone[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: zones.map((z, i) => ({
      type: 'Feature',
      properties: { name: z.name_it, index: i },
      geometry: {
        type: 'Polygon',
        coordinates: [circleRing(z.center, z.radiusKm)],
      },
    })),
  };
}

function osmStyle(): maplibregl.StyleSpecification {
  return {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
      },
    },
    layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
  };
}

interface SpeciesDistributionMapProps {
  speciesId: string;
  zones: DistributionZone[];
  kind: 'flora' | 'fauna';
  locale: string;
  className?: string;
}

export default function SpeciesDistributionMap({
  speciesId,
  zones,
  kind,
  locale,
  className = 'w-full h-[420px]',
}: SpeciesDistributionMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const accent = kind === 'flora' ? '#D4A574' : '#5BC0EB';
  const geojson = useMemo(() => zonesToGeoJSON(zones), [zones]);

  function clearMarkers() {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }

  function addZoneMarkers(map: maplibregl.Map) {
    clearMarkers();
    zones.forEach((z) => {
      const el = document.createElement('div');
      el.className =
        'px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-wide bg-ink/90 border border-white/15 text-snow whitespace-nowrap shadow-lg pointer-events-none';
      el.textContent = locale === 'it' ? z.name_it : z.name_en;

      markersRef.current.push(
        new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat(z.center)
          .addTo(map)
      );
    });
  }

  function fitToZones(map: maplibregl.Map) {
    const bounds = new maplibregl.LngLatBounds();
    zones.forEach((z) => {
      circleRing(z.center, z.radiusKm).forEach((c) => bounds.extend(c));
    });
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 48, duration: 800, maxZoom: 11 });
    }
  }

  function applyZones(map: maplibregl.Map) {
    const source = map.getSource('species-zones') as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(geojson);
    } else {
      map.addSource('species-zones', { type: 'geojson', data: geojson });
      map.addLayer({
        id: 'zones-fill',
        type: 'fill',
        source: 'species-zones',
        paint: { 'fill-color': accent, 'fill-opacity': 0.22 },
      });
      map.addLayer({
        id: 'zones-outline',
        type: 'line',
        source: 'species-zones',
        paint: { 'line-color': accent, 'line-width': 2.5, 'line-opacity': 0.85 },
      });
    }

    map.setPaintProperty('zones-fill', 'fill-color', accent);
    map.setPaintProperty('zones-outline', 'line-color', accent);
    addZoneMarkers(map);
    fitToZones(map);
    map.resize();
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    const styleUrl = key
      ? `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${key}`
      : osmStyle();

    const map = new maplibregl.Map({
      container,
      style: styleUrl as maplibregl.StyleSpecification,
      center: VDA_CENTER,
      zoom: 8.2,
      maxBounds: [
        [6.5, 45.3],
        [8.1, 46.1],
      ],
      attributionControl: false,
      antialias: true,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    const onReady = () => applyZones(map);
    map.on('load', onReady);
    if (map.isStyleLoaded()) onReady();

    map.on('error', (e) => {
      console.error('[SpeciesDistributionMap]', e.error?.message ?? e);
    });

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(container);

    mapRef.current = map;

    return () => {
      ro.disconnect();
      clearMarkers();
      map.remove();
      mapRef.current = null;
    };
  }, [speciesId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const update = () => applyZones(map);
    if (map.isStyleLoaded()) {
      update();
    } else {
      map.once('load', update);
    }
  }, [geojson, zones, locale, accent]);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a18] ${className}`}
    >
      <div ref={containerRef} className="absolute inset-0 min-h-[200px]" />
      <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-full bg-ink/80 backdrop-blur-sm border border-white/10 text-[10px] font-mono uppercase tracking-widest text-snow/60 pointer-events-none">
        {locale === 'it' ? "Distribuzione in Valle d'Aosta" : 'Distribution in Aosta Valley'}
      </div>
    </div>
  );
}
