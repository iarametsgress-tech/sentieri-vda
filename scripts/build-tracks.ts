/**
 * Esporta tracce GPX e GeoJSON da sct-raw.geojson (Catasto Sentieri VdA).
 *
 * Uso:
 *   npm run build:tracks -- --slug=01-s1     # un sentiero (esempio)
 *   npm run build:tracks -- --write          # tutti (~1150)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import {
  asNumber,
  buildFeatureIndex,
  escapeXml,
  flattenLineCoords,
  interpolateElevation,
  loadSctRaw,
  slugifySctCode,
  type GeoJsonFeature,
  type SctProps,
} from './lib/sct-utils';

const GPX_DIR = path.resolve('public/gpx');
const TRACKS_DIR = path.resolve('public/tracks');

function featureToGpx(feature: GeoJsonFeature, slug: string): string | null {
  const props = (feature.properties ?? {}) as SctProps;
  const code = String(props.sen_codice ?? props.CodSen ?? slug).trim();
  const name = String(props.sen_nome_s ?? slug).trim();
  const coords = flattenLineCoords(feature.geometry?.coordinates);
  if (coords.length < 2) return null;

  const startEle = asNumber(props.sen_quota_);
  const endEle = asNumber(props.sen_quota1);

  const trkpts = coords
    .map(([lng, lat, ele], i) => {
      const elev =
        ele !== undefined && !Number.isNaN(ele)
          ? Math.round(ele)
          : interpolateElevation(i, coords.length, startEle, endEle);
      const eleTag = elev !== undefined ? `\n        <ele>${elev}</ele>` : '';
      return `      <trkpt lat="${lat.toFixed(7)}" lon="${lng.toFixed(7)}">${eleTag}\n      </trkpt>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="sentieri-vda" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(name)}</name>
    <desc>Catasto Sentieri VdA — ${escapeXml(code)}</desc>
    <author><name>Regione Autonoma Valle d'Aosta</name></author>
  </metadata>
  <trk>
    <name>${escapeXml(name)}</name>
    <src>Catasto Sentieri VdA (${escapeXml(code)})</src>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>
`;
}

function featureToGeoJson(feature: GeoJsonFeature, slug: string, code: string) {
  const coords = flattenLineCoords(feature.geometry?.coordinates);
  const props = feature.properties ?? {};
  const startEle = asNumber(props.sen_quota_);
  const endEle = asNumber(props.sen_quota1);
  const line = coords.map(([lng, lat, ele], i) => {
    const elev =
      ele !== undefined && !Number.isNaN(ele)
        ? ele
        : interpolateElevation(i, coords.length, startEle, endEle);
    return elev !== undefined ? [lng, lat, elev] : [lng, lat];
  });

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { slug, sct_code: code, source: 'Catasto Sentieri VdA' },
        geometry: { type: 'LineString', coordinates: line },
      },
    ],
  };
}

async function exportOne(feature: GeoJsonFeature, slug: string): Promise<boolean> {
  const props = feature.properties ?? {};
  const code = String(props.sen_codice ?? props.CodSen ?? '').trim();
  const gpx = featureToGpx(feature, slug);
  if (!gpx) return false;

  await fs.mkdir(GPX_DIR, { recursive: true });
  await fs.mkdir(TRACKS_DIR, { recursive: true });
  await fs.writeFile(path.join(GPX_DIR, `${slug}.gpx`), gpx, 'utf8');
  await fs.writeFile(
    path.join(TRACKS_DIR, `${slug}.geojson`),
    JSON.stringify(featureToGeoJson(feature, slug, code)),
    'utf8'
  );
  return true;
}

async function main() {
  const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1];
  const writeAll = process.argv.includes('--write');

  const geo = loadSctRaw();
  const index = buildFeatureIndex(geo);
  console.log(`→ ${geo.features.length} feature in sct-raw.geojson`);

  let ok = 0;
  let fail = 0;

  if (slugArg) {
    const feature = index.get(slugArg) ?? index.get(slugifySctCode(slugArg));
    if (!feature) {
      console.error(`✗ Feature non trovata per slug/code: ${slugArg}`);
      process.exit(1);
    }
    const slug = slugifySctCode(String(feature.properties?.sen_codice ?? feature.properties?.CodSen ?? slugArg));
    if (await exportOne(feature, slug)) {
      console.log(`✓ GPX + GeoJSON: ${slug}`);
      ok = 1;
    } else {
      fail = 1;
    }
  } else if (writeAll) {
    for (const feature of geo.features) {
      const props = feature.properties ?? {};
      const code = String(props.sen_codice ?? props.CodSen ?? '').trim();
      if (!code) {
        fail++;
        continue;
      }
      const slug = slugifySctCode(code);
      if (await exportOne(feature, slug)) ok++;
      else fail++;
      if (ok % 100 === 0 && ok > 0) console.log(`  … ${ok} GPX`);
    }
  } else {
    console.log('Specifica --slug=01-s1 oppure --write per tutti i sentieri.');
    process.exit(0);
  }

  console.log(`\n✓ GPX generati: ${ok}, falliti: ${fail}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
