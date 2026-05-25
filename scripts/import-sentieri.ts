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
 * Le schede editoriali in trails.json vanno scritte a mano combinando
 * dati WFS + descrizioni proprie. Mai inventare numeri.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const WFS_URL =
  'https://geoservizi.regione.vda.it/geoserver/sctGeoSentieri/wfs' +
  '?service=WFS&version=2.0.0&request=GetFeature' +
  '&typeName=sctGeoSentieri:sentieri' +
  '&outputFormat=application/json' +
  '&srsName=EPSG:4326';

async function main() {
  console.log('→ Fetch WFS Catasto Sentieri VdA…');
  const res = await fetch(WFS_URL);
  if (!res.ok) {
    console.error(`Errore HTTP ${res.status}: ${res.statusText}`);
    process.exit(1);
  }

  const data = await res.json();
  const features = (data?.features as any[]) ?? [];
  console.log(`  ricevute ${features.length} feature.`);

  const outDir = path.resolve(process.cwd(), 'src/data');
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, 'sct-raw.geojson');
  await fs.writeFile(outPath, JSON.stringify(data));
  console.log(`✓ Scritto ${outPath} (${(JSON.stringify(data).length / 1024 / 1024).toFixed(1)} MB)`);

  // Riepilogo per debug
  const sample = features.slice(0, 3).map((f) => ({
    id: f.id,
    properties: f.properties,
  }));
  console.log('\nEsempi:');
  console.log(JSON.stringify(sample, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
