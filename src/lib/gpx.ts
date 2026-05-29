import fs from 'node:fs';
import path from 'node:path';
import { gpx as parseGpx } from '@tmcw/togeojson';
import { DOMParser } from '@xmldom/xmldom';

export function getGpxPublicPath(slug: string): string {
  return `/gpx/${slug}.gpx`;
}

export function gpxFileExists(slug: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public/gpx', `${slug}.gpx`));
}

export function loadTrailGeoJSON(slug: string): GeoJSON.FeatureCollection | null {
  const filePath = path.join(process.cwd(), 'public/gpx', `${slug}.gpx`);
  if (!fs.existsSync(filePath)) return null;

  const xml = fs.readFileSync(filePath, 'utf8');
  const dom = new DOMParser().parseFromString(xml, 'text/xml');
  const geojson = parseGpx(dom as unknown as Document);

  if (!geojson?.features?.length) return null;
  return geojson as GeoJSON.FeatureCollection;
}

export type ElevationPoint = { km: number; elev: number };

/** Estrae profilo altimetrico da GeoJSON GPX (coordinate 3D se presenti). */
export function extractElevationProfile(
  geojson: GeoJSON.FeatureCollection
): ElevationPoint[] {
  const points: { lat: number; lng: number; elev: number }[] = [];

  for (const feature of geojson.features) {
    if (feature.geometry.type === 'LineString') {
      for (const coord of feature.geometry.coordinates) {
        const [lng, lat, elev] = coord;
        if (typeof elev === 'number' && !Number.isNaN(elev)) {
          points.push({ lat, lng, elev });
        }
      }
    } else if (feature.geometry.type === 'MultiLineString') {
      for (const line of feature.geometry.coordinates) {
        for (const coord of line) {
          const [lng, lat, elev] = coord;
          if (typeof elev === 'number' && !Number.isNaN(elev)) {
            points.push({ lat, lng, elev });
          }
        }
      }
    }
  }

  if (points.length < 2) return [];

  const profile: ElevationPoint[] = [{ km: 0, elev: Math.round(points[0].elev) }];
  let totalM = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const dLat = ((curr.lat - prev.lat) * Math.PI) / 180;
    const dLng = ((curr.lng - prev.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((prev.lat * Math.PI) / 180) *
        Math.cos((curr.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    totalM += 6371000 * 2 * Math.asin(Math.sqrt(a));
    profile.push({ km: +(totalM / 1000).toFixed(2), elev: Math.round(curr.elev) });
  }

  // Downsample for chart performance
  if (profile.length <= 120) return profile;
  const step = Math.ceil(profile.length / 120);
  return profile.filter((_, i) => i % step === 0 || i === profile.length - 1);
}

function downsampleCoords(coords: number[][], maxPoints: number): number[][] {
  if (coords.length <= maxPoints) return coords;
  const step = Math.ceil(coords.length / maxPoints);
  const out = coords.filter((_, i) => i % step === 0);
  const last = coords[coords.length - 1];
  if (out[out.length - 1] !== last) out.push(last);
  return out;
}

/** Unisce tracce GPX di più tappe (downsampled) per mappa panoramica. */
export function mergeTrailsGeoJSON(
  slugs: string[],
  maxPointsPerStage = 48
): GeoJSON.FeatureCollection | null {
  const features: GeoJSON.Feature[] = [];

  for (const slug of slugs) {
    const gj = loadTrailGeoJSON(slug);
    if (!gj) continue;

    for (const feature of gj.features) {
      if (feature.geometry.type === 'LineString') {
        features.push({
          type: 'Feature',
          properties: { slug, ...feature.properties },
          geometry: {
            type: 'LineString',
            coordinates: downsampleCoords(
              feature.geometry.coordinates as number[][],
              maxPointsPerStage
            ),
          },
        });
      } else if (feature.geometry.type === 'MultiLineString') {
        for (const line of feature.geometry.coordinates) {
          features.push({
            type: 'Feature',
            properties: { slug, ...feature.properties },
            geometry: {
              type: 'LineString',
              coordinates: downsampleCoords(line as number[][], maxPointsPerStage),
            },
          });
        }
      }
    }
  }

  return features.length ? { type: 'FeatureCollection', features } : null;
}
