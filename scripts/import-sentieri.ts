/**
 * Importa dati sentieri ufficiali Valle d'Aosta dal WFS della Regione.
 *
 * Uso: npm run import:sct
 *
 * Endpoint: https://geoservizi.regione.vda.it/geoserver/sctGeoSentieri/wfs
 * Layer: sctGeoSentieri:sentieri
 * Formato: application/json (GeoJSON)
 *
 * Lo script:
 * 1. Scarica il GeoJSON completo dei sentieri ufficiali
 * 2. Salva in `src/data/sct-raw.geojson` per uso a runtime nella mappa
 * 3. NON sovrascrive le schede editoriali in trails.json (quelle sono curate)
 *
 * Fallback: se il WFS non risponde, converte lo shapefile ufficiale dal pacchetto ZIP
 * del Geoportale (stesso dataset, stessi campi).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import * as shapefile from 'shapefile';
import proj4 from 'proj4';

const WFS_URL =
  'https://geoservizi.regione.vda.it/geoserver/sctGeoSentieri/wfs' +
  '?service=WFS&version=2.0.0&request=GetFeature' +
  '&typeName=sctGeoSentieri:sentieri' +
  '&outputFormat=application/json' +
  '&srsName=EPSG:4326';

const ZIP_URL = 'https://geoprodotti.regione.vda.it/download/SENTIERI/sentieri.zip';

const SCT_PROJ =
  'PROJCS["ED_1950_UTM_Zone_32N",GEOGCS["GCS_European_1950",DATUM["D_European_1950",SPHEROID["International_1924",6378388.0,297.0]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",9.0],PARAMETER["Scale_Factor",0.9996],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]';

type GeoJsonFeature = {
  type: 'Feature';
  id?: string;
  geometry: { type: string; coordinates: unknown } | null;
  properties: Record<string, unknown>;
};

function reprojectCoords(coords: unknown): unknown {
  if (!Array.isArray(coords)) return coords;
  if (typeof coords[0] === 'number') {
    const [x, y, z] = coords as number[];
    const [lng, lat] = proj4(SCT_PROJ, 'WGS84', [x, y]);
    return z !== undefined ? [lng, lat, z] : [lng, lat];
  }
  return coords.map(reprojectCoords);
}

function fixDbfEncoding(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  if (!value.includes('Ã') && !value.includes('â')) return value;
  try {
    return Buffer.from(value, 'latin1').toString('utf8');
  } catch {
    return value;
  }
}

function normalizeProperties(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    out[key] = fixDbfEncoding(value);
  }
  return out;
}

async function fetchFromZip(): Promise<{ type: 'FeatureCollection'; features: GeoJsonFeature[] }> {
  console.log('→ WFS non disponibile, fallback ZIP Geoportale…');
  const zipPath = path.resolve('sentieri.zip');
  const extractDir = path.resolve('sentieri-zip');
  const shpPath = path.join(extractDir, 'shape', 'sentieri.shp');

  try {
    await fs.access(shpPath);
  } catch {
    console.log(`  Download ${ZIP_URL}`);
    const res = await fetch(ZIP_URL);
    if (!res.ok) throw new Error(`ZIP HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(zipPath, buf);

    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const execFileAsync = promisify(execFile);
    await fs.mkdir(extractDir, { recursive: true });
    await execFileAsync('powershell', [
      '-NoProfile',
      '-Command',
      `Expand-Archive -Path '${zipPath}' -DestinationPath '${extractDir}' -Force`,
    ]);
  }

  const source = await shapefile.open(shpPath);
  const features: GeoJsonFeature[] = [];
  let i = 0;
  while (true) {
    const result = await source.read();
    if (result.done) break;
    const { geometry, properties } = result.value;
    const geomCoords =
      geometry && 'coordinates' in geometry ? geometry.coordinates : undefined;
    features.push({
      type: 'Feature',
      id: `sentieri.${i++}`,
      geometry: geometry
        ? {
            type: geometry.type,
            coordinates: reprojectCoords(geomCoords),
          }
        : null,
      properties: normalizeProperties(properties as Record<string, unknown>),
    });
  }

  console.log(`  convertite ${features.length} feature dallo shapefile.`);
  return { type: 'FeatureCollection', features };
}

function printFieldSummary(features: GeoJsonFeature[]) {
  const keyCounts = new Map<string, number>();
  for (const f of features) {
    for (const k of Object.keys(f.properties ?? {})) {
      keyCounts.set(k, (keyCounts.get(k) ?? 0) + 1);
    }
  }
  const summary = [...keyCounts.entries()].sort((a, b) => b[1] - a[1]);
  console.log(`\nCampi disponibili (${summary.length}):`);
  for (const [k, n] of summary) {
    console.log(`  ${k.padEnd(28)} ${n}/${features.length}`);
  }

  const sample = features.slice(0, 3).map((f) => ({
    id: f.id,
    properties: f.properties,
  }));
  console.log('\nEsempi:');
  console.log(JSON.stringify(sample, null, 2));
}

async function main() {
  let data: { type: 'FeatureCollection'; features: GeoJsonFeature[] };

  console.log('→ Fetch WFS Catasto Sentieri VdA…');
  try {
    const res = await fetch(WFS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
    console.log(`  ricevute ${data.features?.length ?? 0} feature dal WFS.`);
  } catch (err) {
    console.warn(`  WFS fallito: ${err instanceof Error ? err.message : err}`);
    data = await fetchFromZip();
  }

  const features = data.features ?? [];
  const outDir = path.resolve(process.cwd(), 'src/data');
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, 'sct-raw.geojson');
  await fs.writeFile(outPath, JSON.stringify(data));
  console.log(`✓ Scritto ${outPath} (${(JSON.stringify(data).length / 1024 / 1024).toFixed(1)} MB)`);

  printFieldSummary(features);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
