import { NextRequest } from 'next/server';

export const runtime = 'edge';

const WMS_BASE = 'https://geoservizi.regione.vda.it/geoserver/sctGeoSentieri/wms';

export async function GET(req: NextRequest) {
  const search = req.nextUrl.search; // tutti i parametri WMS
  const target = `${WMS_BASE}${search}`;
  try {
    const upstream = await fetch(target, {
      headers: { 'User-Agent': 'SentieriVdA/1.0' },
    });
    if (!upstream.ok) {
      return new Response(null, { status: upstream.status });
    }
    const buf = await upstream.arrayBuffer();
    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
