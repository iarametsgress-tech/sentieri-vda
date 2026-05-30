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

export interface RouteHighlight {
  id: string;
  geojson: GeoJSON.FeatureCollection;
  lineColor: string;
  label: string;
  href: string;
  labelCoords: [number, number];
}

export interface MapLabel {
  text: string;
  coords: [number, number];
}

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  geojson?: GeoJSON.FeatureCollection;
  showOfficialTrails?: boolean;
  terrain3D?: boolean;
  markers?: MarkerPoint[];
  routeHighlights?: RouteHighlight[];
  labels?: MapLabel[];
  className?: string;
  lineColor?: string;
}

function createMapLabelEl(text: string): HTMLElement {
  const el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = `
    padding: 4px 10px; border-radius: 999px;
    background: rgba(10,10,10,0.82); border: 1px solid rgba(212,165,116,0.45);
    color: #FAFAF7; font-family: monospace; font-size: 10px;
    font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.4);
    backdrop-filter: blur(6px); pointer-events: none;
  `;
  return el;
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

function createRouteLabelEl(label: string, href: string, color: string): HTMLElement {
  const link = document.createElement('a');
  link.href = href;
  link.style.cssText = `
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 999px;
    background: rgba(10,10,10,0.92); border: 1px solid rgba(255,255,255,0.18);
    color: #FAFAF7; font-family: monospace; font-size: 11px;
    font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    text-decoration: none; cursor: pointer;
    box-shadow: 0 8px 24px rgba(0,0,0,0.45);
    backdrop-filter: blur(8px);
    transform: translateZ(0);
    pointer-events: auto;
  `;
  const dot = document.createElement('span');
  dot.style.cssText = `width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;`;
  link.appendChild(dot);
  link.appendChild(document.createTextNode(label));
  link.addEventListener('mouseenter', () => {
    link.style.borderColor = color;
    link.style.background = 'rgba(10,10,10,0.96)';
  });
  link.addEventListener('mouseleave', () => {
    link.style.borderColor = 'rgba(255,255,255,0.18)';
    link.style.background = 'rgba(10,10,10,0.92)';
  });
  link.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  return link;
}

function extendBoundsFromGeoJSON(
  bounds: maplibregl.LngLatBounds,
  geojson: GeoJSON.FeatureCollection
) {
  geojson.features.forEach((f) => {
    if (f.geometry.type === 'LineString') {
      (f.geometry.coordinates as [number, number][]).forEach((c) => bounds.extend(c));
    } else if (f.geometry.type === 'MultiLineString') {
      f.geometry.coordinates.forEach((line) =>
        (line as [number, number][]).forEach((c) => bounds.extend(c))
      );
    }
  });
}

export default function MapView({
  center = VDA_CENTER,
  zoom = 9,
  geojson,
  showOfficialTrails = true,
  terrain3D = false,
  markers,
  routeHighlights,
  labels,
  className = 'w-full h-[500px]',
  lineColor = '#D4A574',
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

      // GeoJSON traccia singola
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
          paint: { 'line-color': lineColor, 'line-width': 3.5 },
        });
      }

      // Alte Vie / percorsi evidenziati
      const fitBounds = new maplibregl.LngLatBounds();
      if (routeHighlights?.length) {
        routeHighlights.forEach((route) => {
          const sourceId = `route-${route.id}`;
          map.addSource(sourceId, { type: 'geojson', data: route.geojson });
          map.addLayer({
            id: `${sourceId}-casing`,
            type: 'line',
            source: sourceId,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#0A0A0A', 'line-width': 5 },
          });
          map.addLayer({
            id: `${sourceId}-line`,
            type: 'line',
            source: sourceId,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': route.lineColor, 'line-width': 3 },
          });
          extendBoundsFromGeoJSON(fitBounds, route.geojson);

          const labelEl = createRouteLabelEl(route.label, route.href, route.lineColor);
          new maplibregl.Marker({
            element: labelEl,
            anchor: 'center',
            pitchAlignment: 'map',
            rotationAlignment: 'map',
          })
            .setLngLat(route.labelCoords)
            .addTo(map);
        });
      }

      if (geojson) {
        extendBoundsFromGeoJSON(fitBounds, geojson);
      }

      if (!fitBounds.isEmpty()) {
        map.fitBounds(fitBounds, { padding: 70, duration: 0, maxZoom: 10 });
      }

      // Start/end markers — allineati alla traccia se presente
      const markerPoints = markers?.length ? [...markers] : [];
      if (geojson) {
        const lineCoords: [number, number][] = [];
        geojson.features.forEach((f) => {
          if (f.geometry.type === 'LineString') {
            (f.geometry.coordinates as [number, number][]).forEach((c) =>
              lineCoords.push([c[0], c[1]])
            );
          } else if (f.geometry.type === 'MultiLineString') {
            f.geometry.coordinates.forEach((line) =>
              (line as [number, number][]).forEach((c) => lineCoords.push([c[0], c[1]]))
            );
          }
        });
        if (lineCoords.length >= 2 && markerPoints.length >= 2) {
          const first = lineCoords[0];
          const last = lineCoords[lineCoords.length - 1];
          const startM = markerPoints.find((m) => m.type === 'start');
          const endM = markerPoints.find((m) => m.type === 'end');
          if (startM) startM.coords = first;
          if (endM) endM.coords = last;
        }
      }

      if (markerPoints.length) {
        markerPoints.forEach((m) => {
          const el = createMarkerEl(m.type, m.label, m.elevation);
          new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat(m.coords)
            .addTo(map);
        });

        // If no geojson, fit to markers
        if (!geojson && markerPoints.length >= 2) {
          const bounds = new maplibregl.LngLatBounds();
          markerPoints.forEach((m) => bounds.extend(m.coords));
          map.fitBounds(bounds, { padding: 80, duration: 0, maxZoom: 13 });
        }
      }

      // Etichette di testo (es. nomi delle valli)
      if (labels?.length) {
        labels.forEach((l) => {
          new maplibregl.Marker({ element: createMapLabelEl(l.text), anchor: 'center' })
            .setLngLat(l.coords)
            .addTo(map);
        });
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
