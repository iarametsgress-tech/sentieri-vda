/**
 * Helpers per il WMS ufficiale del Catasto Sentieri della Regione Autonoma Valle d'Aosta.
 * Documentazione: https://catastosentieri.regione.vda.it/interoperabilita/
 *
 * I 5.000 km di rete sentieristica regionale sono pubblicati come WMS standard OGC,
 * usabile in MapLibre come "raster source". Licenza: open data DGR 899/2014.
 */

// Proxy same-origin — evita il blocco CORS del server WMS regionale.
// La route /api/wms inoltra la richiesta a geoservizi.regione.vda.it
// aggiungendo Access-Control-Allow-Origin: *.
export const SCT_WMS_URL = '/api/wms';

export const SCT_LAYERS = {
  sentieri: 'sctGeoSentieri:sentieri',
  numeriSentieri: 'sctGeoSentieri:numeri_sentieri',
} as const;

export type SctLayer = (typeof SCT_LAYERS)[keyof typeof SCT_LAYERS];

/**
 * Costruisce l'URL template per MapLibre raster source (WMS).
 * EPSG:3857 = Web Mercator.
 */
export function buildSctWmsTileUrl(layer: SctLayer = SCT_LAYERS.sentieri): string {
  const params = new URLSearchParams({
    service: 'WMS',
    version: '1.1.1',
    request: 'GetMap',
    layers: layer,
    styles: '',
    format: 'image/png',
    transparent: 'true',
    srs: 'EPSG:3857',
    width: '256',
    height: '256',
    // bbox è interpolato da MapLibre
  });
  // MapLibre sostituisce {bbox-epsg-3857}
  return `${SCT_WMS_URL}?${params.toString()}&bbox={bbox-epsg-3857}`;
}

/**
 * Bounds della Valle d'Aosta per centratura mappa.
 */
export const VDA_BOUNDS: [[number, number], [number, number]] = [
  [6.795, 45.466], // SW
  [7.940, 45.987], // NE
];

export const VDA_CENTER: [number, number] = [7.367, 45.726]; // ~ Aosta
