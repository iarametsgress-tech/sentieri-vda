'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SCT_LAYERS, SCT_WMS_URL, VDA_CENTER } from '@/lib/sct';

interface MarkerPoint {
  coords: [number, number]; // [lng, lat]
  label: string;
  elevation: number;
  type: 'start' | 'end';
}

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  geojson?: GeoJSON.FeatureCollection;
  showOfficialTrails?: boolean;
  terrain3D?: boolean;
  markers?: MarkerPoint[];
  className?: string;
}

function createMarkerEl(type: 'start' | 'end', label: string, elevation: number): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative';

  const pin = document.createElement('div');
  pin.style.cssText = `
    width: 36px; height: 36px; border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    background: ${type === 'start' ? '#5BC0EB' : '#D4A574'};
    border: 2px solid #0A0A0A;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    cursor: default;
  `;

  const inner = document.createElement('div');
  inner.style.cssText = `
    position: absolute; inset: 4px; border-radius: 50%;
    background: #0A0A0A; transform: rotate(45deg);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; color: ${type === 'start' ? '#5BC0EB' : '#D4A574'};
    font-family: monospace; letter-spacing: 0;
  `;
  inner.textContent = type === 'start' ? 'A' : 'B';
  pin.appendChild(inner);

  const popup_el = document.createElement('div');
  popup_el.style.cssText = `
    position: absolute; bottom: 44px; left: 50%; transform: translateX(-50%);
    background: #0A0A0A; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px; padding: 4px 8px; white-space: nowrap;
    font-size: 11px; color: #FAFAF7; font-family: monospace;
    pointer-events: none; opacity: 0; transition: opacity 0.15s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  `;
  popup_el.innerHTML = `<span style="color:${type === 'start' ? '#5BC0EB' : '#D4A574'}">${label}</span> <span style="color:rgba(250,250,247,0.5)">${elevation}m</span>`;

  wrapper.addEventListener('mouseenter', () => { popup_el.style.opacity = '1'; });
  wrapper.addEventListener('mouseleave', () => { popup_el.style.opacity = '0'; });

  wrapper.appendChild(pin);
  wrapper.appendChild(popup_el);
  return wrapper;
}

export default function MapView({
  center = VDA_CENTER,
  zoom = 9,
  geojson,
  showOfficialTrails = true,
  terrain3D = false,
  markers,
  className = 'w-full h-[500px]',
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    const styleUrl = key
      ? `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${key}`
      : {
          version: 8 as const,
          sources: {
            osm: {
              type: 'raster' as const,
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
          },
          layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
        };

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl as any,
      center,
      zoom,
      maxBounds: [[6.5, 45.3], [8.1, 46.1]],
      attributionControl: false,
      antialias: true,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: "Sentieri © Regione Autonoma Valle d'Aosta · Catasto Sentieri",
      })
    );

    map.on('load', () => {
      // Overlay WMS Catasto Sentieri ufficiale
      if (showOfficialTrails) {
        map.addSource('sct-wms', {
          type: 'raster',
          tiles: [
            `${SCT_WMS_URL}?service=WMS&version=1.1.1&request=GetMap` +
              `&layers=${SCT_LAYERS.sentieri}&styles=&format=image/png` +
              `&transparent=true&srs=EPSG:3857&width=256&height=256` +
              `&bbox={bbox-epsg-3857}`,
          ],
          tileSize: 256,
          attribution: 'Catasto Sentieri Regione VdA',
        });
        map.addLayer({
          id: 'sct-trails-overlay',
          type: 'raster',
          source: 'sct-wms',
          paint: { 'raster-opacity': 0.85 },
        });
      }

      // Terrain 3D
      if (terrain3D && key) {
        map.addSource('terrain', {
          type: 'raster-dem',
          url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}`,
          tileSize: 256,
        });
        map.setTerrain({ source: 'terrain', exaggeration: 1.4 });
        map.setPitch(55);
        map.setBearing(-20);
        // Sky layer for realistic atmosphere (cast to any for MapLibre compatibility)
        (map as any).setFog?.({
          color: 'rgb(220, 230, 240)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.06,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.4,
        });
      }

      // GeoJSON traccia
      if (geojson) {
        map.addSource('trail-geojson', { type: 'geojson', data: geojson });
        map.addLayer({
          id: 'trail-line-casing',
          type: 'line',
          source: 'trail-geojson',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#0A0A0A', 'line-width': 6 },
        });
        map.addLayer({
          id: 'trail-line',
          type: 'line',
          source: 'trail-geojson',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#D4A574', 'line-width': 3.5 },
        });
        const bounds = new maplibregl.LngLatBounds();
        geojson.features.forEach((f) => {
          if (f.geometry.type === 'LineString') {
            (f.geometry.coordinates as [number, number][]).forEach((c) => bounds.extend(c));
          }
        });
        if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 60, duration: 0 });
      }

      // Start/end markers
      if (markers?.length) {
        markers.forEach((m) => {
          const el = createMarkerEl(m.type, m.label, m.elevation);
          new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat(m.coords)
            .addTo(map);
        });

        // If no geojson, fit to markers
        if (!geojson && markers.length >= 2) {
          const bounds = new maplibregl.LngLatBounds();
          markers.forEach((m) => bounds.extend(m.coords));
          map.fitBounds(bounds, { padding: 80, duration: 0, maxZoom: 13 });
        }
      }
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} className={className} />;
}
