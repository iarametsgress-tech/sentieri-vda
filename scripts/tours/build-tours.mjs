/**
 * Ricostruisce le tappe dei 6 tour (incl. tratte estere) con tracce GPX REALI
 * calcolate sulla rete sentieri OpenStreetMap via BRouter (profilo hiking).
 *
 * - tappe transfer (ghiacciaio): nessun GPX, is_transfer_stage: true
 * - aggiorna src/data/trails-routes.json (le tappe AV2 restano invariate)
 * - aggiorna i riferimenti in src/data/refuges.json
 * - scrive scripts/tours/redirects.json (slug rimossi → pagina tour)
 *
 * Uso: node scripts/tours/build-tours.mjs [--only=tag] [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import { TOURS } from './stages.mjs';

const RESOLVED = JSON.parse(fs.readFileSync('scripts/tours/points-resolved.json', 'utf8'));
const GPX_DIR = path.resolve('public/gpx');
const ROUTES_PATH = path.resolve('src/data/trails-routes.json');
const REFUGES_PATH = path.resolve('src/data/refuges.json');
const TODAY = new Date().toISOString().slice(0, 10);
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1] ?? null;
const DRY = process.argv.includes('--dry');

const TOUR_LABEL = {
  it: { tmb: 'Tour del Monte Bianco', 'monte-rosa': 'Tour del Monte Rosa', cervino: 'Tour del Cervino', 'gran-paradiso': 'Tour del Gran Paradiso', rutor: 'Tour del Rutor', 'gran-combin': 'Tour del Gran Combin' },
  en: { tmb: 'Tour du Mont Blanc', 'monte-rosa': 'Tour Monte Rosa', cervino: 'Tour of the Matterhorn', 'gran-paradiso': 'Gran Paradiso Tour', rutor: 'Tour du Rutor', 'gran-combin': 'Tour des Combins' },
  fr: { tmb: 'Tour du Mont Blanc', 'monte-rosa': 'Tour du Mont Rose', cervino: 'Tour du Cervin', 'gran-paradiso': 'Tour du Grand-Paradis', rutor: 'Tour du Rutor', 'gran-combin': 'Tour des Combins' },
  de: { tmb: 'Tour du Mont Blanc', 'monte-rosa': 'Tour Monte Rosa', cervino: 'Tour des Matterhorns', 'gran-paradiso': 'Gran-Paradiso-Tour', rutor: 'Tour du Rutor', 'gran-combin': 'Tour des Combins' },
};
const STAGE_WORD = { it: 'Tappa', en: 'Stage', fr: 'Étape', de: 'Etappe' };

const label = (key) => RESOLVED[key].q.split(',')[0].trim();
const coords = (key) => ({ lng: RESOLVED[key].lnglat[0], lat: RESOLVED[key].lnglat[1] });
const elevOf = (key) => RESOLVED[key].elev;

function haversineM(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function parseGpx(gpx) {
  const pts = [];
  const re = /<trkpt lon="([^"]+)" lat="([^"]+)">(?:<ele>([^<]+)<\/ele>)?/g;
  let m;
  while ((m = re.exec(gpx)) !== null) {
    pts.push({ lng: +m[1], lat: +m[2], ele: m[3] !== undefined ? +m[3] : null });
  }
  if (pts.length) return pts;
  // formato alternativo lat/lon invertiti
  const re2 = /<trkpt\s+lat="([^"]+)"\s+lon="([^"]+)"\s*>(?:\s*<ele>([^<]+)<\/ele>)?/g;
  while ((m = re2.exec(gpx)) !== null) {
    pts.push({ lng: +m[2], lat: +m[1], ele: m[3] !== undefined ? +m[3] : null });
  }
  return pts;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function brouterOnce(lonlats, profile, name) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const url = `https://brouter.de/brouter?lonlats=${lonlats}&profile=${profile}&alternativeidx=0&format=gpx&trackname=${encodeURIComponent(name)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(90000) });
      const text = await res.text();
      if (res.ok && text.startsWith('<?xml')) {
        const meta = text.match(/track-length = (\d+) filtered ascend = (\d+)/);
        return {
          gpx: text,
          profile,
          km: meta ? +meta[1] / 1000 : null,
          ascend: meta ? +meta[2] : null,
        };
      }
      console.log(`    [${profile}] HTTP ${res.status}: ${text.slice(0, 90)}`);
    } catch (e) {
      console.log(`    [${profile}] ${e.message}`);
    }
    await sleep(1500);
  }
  return null;
}

/**
 * Instrada con hiking-mountain; se il risultato è fuori dal range atteso
 * (il profilo a volte rifiuta passi T4 e devia di decine di km) riprova
 * con il profilo trekking e sceglie il risultato dentro il range.
 */
async function brouterGpx(viaKeys, name, expectKm) {
  const lonlats = viaKeys.map((k) => RESOLVED[k].lnglat.map((v) => v.toFixed(6)).join(',')).join('|');
  const inRange = (r) => r && expectKm && r.km >= expectKm[0] && r.km <= expectKm[1];

  const hm = await brouterOnce(lonlats, 'hiking-mountain', name);
  if (!expectKm || inRange(hm)) return hm;
  await sleep(1200);
  const tk = await brouterOnce(lonlats, 'trekking', name);
  if (inRange(tk)) return tk;
  // nessuno in range: preferisci quello più vicino al range
  if (!hm) return tk;
  if (!tk) return hm;
  const dist = (r) => Math.max(expectKm[0] - r.km, r.km - expectKm[1], 0);
  return dist(tk) < dist(hm) ? tk : hm;
}

function caiHours(km, gain, loss) {
  const h = km / 4 + Math.max(gain, 0) / 400 + Math.max(loss, 0) / 600;
  return Math.max(1, Math.round(h * 2) / 2);
}
const FITNESS = { T: 1, E: 2, EE: 3, EEA: 4, A: 5 };

function cumKmAt(pts, target) {
  let total = 0;
  let best = { d: Infinity, km: 0 };
  for (let i = 1; i < pts.length; i++) {
    total += haversineM(pts[i - 1], pts[i]);
    const d = haversineM(pts[i], target);
    if (d < best.d) best = { d, km: total / 1000 };
  }
  return +best.km.toFixed(1);
}

function gainLoss(pts) {
  let gain = 0;
  let loss = 0;
  let prev = null;
  for (const p of pts) {
    if (p.ele == null) continue;
    if (prev != null) {
      const d = p.ele - prev;
      if (d > 0) gain += d;
      else loss -= d;
    }
    prev = p.ele;
  }
  return { gain: Math.round(gain), loss: Math.round(loss) };
}

async function main() {
  const routes = JSON.parse(fs.readFileSync(ROUTES_PATH, 'utf8'));
  const oldBySlug = new Map(routes.map((t) => [t.slug, t]));
  const av2 = routes.filter((t) => t.tags.includes('alta-via-2'));
  const oldTourSlugs = routes.filter((t) => t.tags.includes('tour')).map((t) => t.slug);

  const newStages = [];
  const report = [];

  for (const tour of TOURS) {
    if (ONLY && tour.tag !== ONLY) continue;
    console.log(`\n═══ ${tour.tag} (${tour.stages.length} tappe) ═══`);
    for (const st of tour.stages) {
      const slug = st.keepSlug ?? `${tour.tag}-tappa-${st.n}-${st.slugTail}`;
      const startKey = st.via[0];
      const endKey = st.via[st.via.length - 1];
      const old = st.keepSlug ? oldBySlug.get(st.keepSlug) : null;

      let pts = [];
      let km = null;
      let gain = null;
      let loss = null;
      let profile = null;

      if (!st.transfer) {
        console.log(`→ ${slug}`);
        const routed = await brouterGpx(st.via, slug, st.expectKm);
        if (!routed) {
          console.log(`  ✗ routing FALLITO`);
          report.push({ slug, status: 'ROUTING_FAILED' });
          continue;
        }
        pts = parseGpx(routed.gpx);
        const gl = gainLoss(pts);
        km = +routed.km.toFixed(1);
        gain = routed.ascend ?? gl.gain;
        loss = gl.loss;
        profile = routed.profile;
        const [lo, hi] = st.expectKm;
        const flag = km < lo || km > hi ? '⚠ FUORI RANGE' : 'ok';
        console.log(`  ${flag} ${km}km +${gain}m -${loss}m (${pts.length}pts, ${profile}) atteso ${lo}-${hi}km`);
        report.push({ slug, status: flag === 'ok' ? 'OK' : 'CHECK', km, gain, loss, expected: st.expectKm });
        if (!DRY) fs.writeFileSync(path.join(GPX_DIR, `${slug}.gpx`), routed.gpx);
        await sleep(1200);
      } else {
        // tappa di trasferimento (ghiacciaio/funivia): nessun GPX
        const straight = st.via.slice(1).reduce((acc, k, i) => acc + haversineM(coords(st.via[i]), coords(k)), 0);
        km = +((straight / 1000) * 1.35).toFixed(1);
        const eStart = elevOf(startKey);
        const eEnd = elevOf(endKey);
        const eMax = Math.max(...st.via.map(elevOf));
        gain = Math.max(0, Math.round(eMax - eStart));
        loss = Math.max(0, Math.round(eMax - eEnd));
        report.push({ slug, status: 'TRANSFER', km });
        console.log(`→ ${slug}  (transfer, ~${km}km, nessun GPX)`);
      }

      const startCoords = pts.length ? { lat: +pts[0].lat.toFixed(6), lng: +pts[0].lng.toFixed(6) } : { lat: coords(startKey).lat, lng: coords(startKey).lng };
      const endCoords = pts.length ? { lat: +pts[pts.length - 1].lat.toFixed(6), lng: +pts[pts.length - 1].lng.toFixed(6) } : { lat: coords(endKey).lat, lng: coords(endKey).lng };
      const eleStart = pts.find((p) => p.ele != null)?.ele ?? elevOf(startKey);
      const eleEnd = [...pts].reverse().find((p) => p.ele != null)?.ele ?? elevOf(endKey);

      const names = {};
      for (const lang of ['it', 'en', 'fr', 'de']) {
        names[lang] = `${TOUR_LABEL[lang][tour.id]} — ${STAGE_WORD[lang]} ${st.n}: ${label(startKey)} → ${label(endKey)}`;
      }

      const waypoints = (st.cols ?? []).map((c) => ({
        name: label(c.point),
        elevation_m: elevOf(c.point),
        distance_from_start_km: pts.length ? cumKmAt(pts, coords(c.point)) : +(km / 2).toFixed(1),
        type: c.type,
      }));

      const trail = {
        slug,
        name_it: names.it,
        name_en: names.en,
        name_fr: names.fr,
        name_de: names.de,
        shortDescription_it: st.d.it[0],
        shortDescription_en: st.d.en[0],
        shortDescription_fr: st.d.fr[0],
        shortDescription_de: st.d.de[0],
        description_it: st.d.it[1],
        description_en: st.d.en[1],
        description_fr: st.d.fr[1],
        description_de: st.d.de[1],
        distance_km: km,
        elevation_gain_m: gain,
        elevation_loss_m: loss,
        duration_hours: caiHours(km, gain, loss),
        difficulty: st.diff,
        season: ['summer'],
        start: { name: label(startKey), coords: startCoords, elevation_m: Math.round(eleStart) },
        end: { name: label(endKey), coords: endCoords, elevation_m: Math.round(eleEnd) },
        valley: st.valley,
        municipalities: st.municipalities,
        gpx_path: st.transfer ? null : `/gpx/${slug}.gpx`,
        ...(st.transfer ? { is_transfer_stage: true } : {}),
        hero_image: old?.hero_image ?? tour.image,
        image: old?.image ?? tour.image,
        ...(old?.image_credit ? { image_credit: old.image_credit } : {}),
        ...(old?.image_source ? { image_source: old.image_source } : {}),
        gallery: old?.gallery ?? [],
        refuges: st.refuges,
        flora: old?.flora ?? [],
        fauna: old?.fauna ?? [],
        tags: [tour.tag, 'tour', 'long-distance'],
        source: tour.source,
        updated_at: TODAY,
        ...(waypoints.length ? { waypoints } : {}),
        ...(old?.geology_it ? { geology_it: old.geology_it, geology_en: old.geology_en, geology_fr: old.geology_fr, geology_de: old.geology_de } : {}),
        ...(old?.transport_it ? { transport_it: old.transport_it, transport_en: old.transport_en, transport_fr: old.transport_fr, transport_de: old.transport_de } : {}),
        mobile_coverage: 'partial',
        best_months: [7, 8, 9],
        warnings_it: st.warnings.map((w) => w.it),
        warnings_en: st.warnings.map((w) => w.en),
        warnings_fr: st.warnings.map((w) => w.fr),
        warnings_de: st.warnings.map((w) => w.de),
        fitness_level: FITNESS[st.diff],
      };
      if (!trail.warnings_it.length) {
        delete trail.warnings_it;
        delete trail.warnings_en;
        delete trail.warnings_fr;
        delete trail.warnings_de;
      }
      newStages.push(trail);
    }
  }

  if (DRY) {
    console.log('\n--dry: nessuna scrittura dati');
    console.table(report);
    return;
  }

  // trails-routes.json = AV2 + tour non rigenerati (con --only) + nuove tappe
  const rebuiltTags = new Set(TOURS.filter((t) => !ONLY || t.tag === ONLY).map((t) => t.tag));
  const otherTours = routes.filter(
    (t) => t.tags.includes('tour') && !t.tags.some((tag) => rebuiltTags.has(tag))
  );
  const merged = [...av2, ...otherTours, ...newStages];
  fs.writeFileSync(ROUTES_PATH, JSON.stringify(merged, null, 2) + '\n');

  // GPX orfani delle vecchie tappe rimosse (solo dei tour rigenerati)
  const keptSlugs = new Set(newStages.map((t) => t.slug));
  const removed = oldTourSlugs.filter(
    (s) => !keptSlugs.has(s) && [...rebuiltTags].some((tag) => s.startsWith(tag))
  );
  for (const s of removed) {
    const f = path.join(GPX_DIR, `${s}.gpx`);
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
  let redirects = [];
  try {
    redirects = JSON.parse(fs.readFileSync('src/data/legacy-tour-redirects.json', 'utf8'));
  } catch {}
  const known = new Set(redirects.map((r) => r.source));
  for (const s of removed) {
    const source = `/:locale/sentieri/${s}`;
    if (known.has(source)) continue;
    const tour = TOURS.find((t) => s.startsWith(t.tag));
    redirects.push({ source, destination: `/:locale/tour/${tour?.id ?? ''}` });
  }
  // niente redirect per slug che esistono ancora
  redirects = redirects.filter((r) => !keptSlugs.has(r.source.replace('/:locale/sentieri/', '')));
  fs.writeFileSync('src/data/legacy-tour-redirects.json', JSON.stringify(redirects, null, 1));

  // refuges.json: sostituisci i riferimenti alle vecchie tappe
  const refuges = JSON.parse(fs.readFileSync(REFUGES_PATH, 'utf8'));
  const stageByRefuge = new Map();
  for (const t of newStages) {
    for (const r of t.refuges) {
      if (!stageByRefuge.has(r)) stageByRefuge.set(r, []);
      stageByRefuge.get(r).push(t.slug);
    }
  }
  const removedSet = new Set(removed);
  for (const r of refuges) {
    const kept = (r.trails ?? []).filter((s) => !removedSet.has(s));
    const extra = (stageByRefuge.get(r.slug) ?? []).filter((s) => !kept.includes(s));
    r.trails = [...kept, ...extra];
  }
  fs.writeFileSync(REFUGES_PATH, JSON.stringify(refuges, null, 2) + '\n');

  console.log(`\n✓ ${newStages.length} tappe scritte, ${removed.length} vecchie tappe rimosse`);
  console.table(report);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
