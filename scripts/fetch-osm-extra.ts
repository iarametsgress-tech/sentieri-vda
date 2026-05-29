import fs from 'node:fs/promises';
import path from 'node:path';

const EXTRA = [
  {
    slug: 'tour-rifugio-bonatti',
    name: 'Anello del Rifugio Bonatti',
    center: { lat: 45.8722, lng: 7.0419 },
    pad: 0.035,
  },
  {
    slug: 'lago-djouan-cogne',
    name: 'Lago Djouan',
    center: { lat: 45.5675, lng: 7.2089 },
    pad: 0.05,
  },
];

function haversineM(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

async function main() {
  for (const t of EXTRA) {
    const { lat, lng, pad } = { ...t.center, pad: t.pad };
    const q = `[out:json][timeout:60];way["highway"~"path|footway"](${lat - pad},${lng - pad},${lat + pad},${lng + pad});out geom;`;
    const res = await fetch('https://overpass.kumi.systems/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SentieriVdaBot/1.0 (https://sentieri-vda.vercel.app)',
      },
      body: `data=${encodeURIComponent(q)}`,
    });
    const data = await res.json();
    type Way = { geometry: { lat: number; lon: number }[] };
    const ways = ((data.elements ?? []) as Way[]).filter((w) => w.geometry?.length > 12);
    ways.sort((a, b) => {
      const len = (w: Way) =>
        w.geometry.reduce(
          (acc, p, i) =>
            i
              ? acc +
                haversineM(
                  { lat: w.geometry[i - 1].lat, lng: w.geometry[i - 1].lon },
                  { lat: p.lat, lng: p.lon }
                )
              : 0,
          0
        );
      return len(b) - len(a);
    });
    const best = ways[0];
    if (!best) {
      console.log('FAIL', t.slug);
      continue;
    }
    const trkpts = best.geometry
      .map(
        (p) =>
          `      <trkpt lat="${p.lat.toFixed(6)}" lon="${p.lon.toFixed(6)}"></trkpt>`
      )
      .join('\n');
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Sentieri VdA / OpenStreetMap">
  <metadata><name>${t.name}</name><desc>Traccia da OpenStreetMap — verificare sul terreno</desc></metadata>
  <trk><name>${t.name}</name><trkseg>
${trkpts}
  </trkseg></trk>
</gpx>`;
    await fs.writeFile(path.join('public/gpx', `${t.slug}.gpx`), gpx);
    console.log('OK', t.slug, best.geometry.length, 'points');
  }

  const trailsPath = path.resolve('src/data/trails.json');
  const trails = JSON.parse(await fs.readFile(trailsPath, 'utf8'));
  for (const t of EXTRA) {
    const file = path.join('public/gpx', `${t.slug}.gpx`);
    try {
      await fs.access(file);
      const trail = trails.find((x: { slug: string }) => x.slug === t.slug);
      if (trail) trail.gpx_path = `/gpx/${t.slug}.gpx`;
    } catch {
      /* skip */
    }
  }
  await fs.writeFile(trailsPath, JSON.stringify(trails, null, 2) + '\n');
}

main();
