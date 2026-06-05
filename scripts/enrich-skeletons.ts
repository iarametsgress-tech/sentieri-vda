/**
 * Arricchisce trails-skeleton.json: comune, valle, stagione, descrizioni, gpx_path, enriched.
 *
 * Uso:
 *   npm run enrich:skeletons -- --slug=01-s1 --write   # esempio singolo
 *   npm run enrich:skeletons -- --write                # tutti (~1150)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import trailsJson from '../src/data/trails.json';
import routesJson from '../src/data/trails-routes.json';
import {
  asNumber,
  buildFeatureIndex,
  loadSctRaw,
  parseSenPeriod,
  slugifySctCode,
  type SctProps,
} from './lib/sct-utils';
import { buildEditorialDescriptions } from './lib/enrich-descriptions';

const PLACEHOLDER = '/trails/_placeholder.svg';

type ComuniFile = {
  comuni: Record<
    string,
    {
      name: string;
      valley_it: string;
      valley_en: string;
      valley_fr: string;
      valley_de: string;
    }
  >;
};

function curatedSlugs(): Set<string> {
  const slugs = new Set<string>();
  for (const t of [...trailsJson, ...routesJson] as Array<{ slug: string }>) {
    slugs.add(t.slug);
  }
  return slugs;
}

function resolveMunicipalities(codes: string[], comuni: ComuniFile['comuni']): string[] {
  const names: string[] = [];
  for (const raw of codes) {
    const code = String(raw).padStart(2, '0');
    const c = comuni[code];
    if (c?.name) names.push(c.name);
    else if (/^\d+$/.test(raw)) names.push(raw);
    else names.push(raw);
  }
  return [...new Set(names)];
}

function primaryValley(municipalities: string[], comuni: ComuniFile['comuni'], codes: string[]) {
  for (const code of codes) {
    const c = comuni[String(code).padStart(2, '0')];
    if (c?.valley_it) return c;
  }
  return null;
}

async function main() {
  const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1];
  const write = process.argv.includes('--write');

  const skeletonPath = path.resolve('src/data/trails-skeleton.json');
  const comuniPath = path.resolve('src/data/comuni-vda.json');
  const skeletons = JSON.parse(await fs.readFile(skeletonPath, 'utf8')) as any[];
  const comuniFile = JSON.parse(await fs.readFile(comuniPath, 'utf8')) as ComuniFile;
  const geo = loadSctRaw();
  const featureIndex = buildFeatureIndex(geo);
  const curated = curatedSlugs();

  let updated = 0;
  let enrichedCount = 0;

  for (const sk of skeletons) {
    if (slugArg && sk.slug !== slugArg) continue;
    if (curated.has(sk.slug)) continue;

    const feature = featureIndex.get(sk.sct_code) ?? featureIndex.get(sk.slug);
    const props = (feature?.properties ?? {}) as SctProps;
    const munCodes = [
      ...(Array.isArray(sk.municipalities) ? sk.municipalities : []),
      props.sen_cod_co,
      props.sen_cod__1,
    ].filter(Boolean) as string[];

    const municipalities = resolveMunicipalities(munCodes, comuniFile.comuni);
    const valleyInfo = primaryValley(municipalities, comuniFile.comuni, munCodes);
    const valley_it = valleyInfo?.valley_it ?? sk.valley ?? '';
    const valley_en = valleyInfo?.valley_en ?? valley_it;
    const valley_fr = valleyInfo?.valley_fr ?? valley_it;
    const valley_de = valleyInfo?.valley_de ?? valley_it;

    const senPeriod = props.sen_period ?? null;
    const signposts = asNumber(props.nuovo_segn);
    const { best_months, season } = parseSenPeriod(senPeriod);

    const distance_km = Math.round((sk.distance_km ?? 0) * 10) / 10;

    const desc = buildEditorialDescriptions({
      name_it: sk.name_it,
      sct_code: sk.sct_code,
      slug: sk.slug,
      difficulty: sk.difficulty ?? 'E',
      distance_km,
      elevation_gain_m: sk.elevation_gain_m ?? 0,
      elevation_loss_m: sk.elevation_loss_m ?? 0,
      start: sk.start,
      end: sk.end,
      valley_it,
      valley_en,
      valley_fr,
      valley_de,
      municipalities,
      sen_period: senPeriod,
      signposts,
    });

    const gpxPath = `/gpx/${sk.slug}.gpx`;
    const gpxExists = await fs
      .access(path.resolve('public', gpxPath.slice(1)))
      .then(() => true)
      .catch(() => false);

    const hasPhoto =
      sk.image &&
      sk.image !== '' &&
      !sk.image.endsWith('_placeholder.svg') &&
      !sk.image.includes('_placeholder');
    const hasValley = Boolean(valley_it);
    const hasDesc = Boolean(desc.description_it);
    const gpxOk = Boolean(gpxExists || sk.gpx_path);
    // enriched: GPX + valle + descrizione + foto (geo o fallback valle coerente, mai placeholder)
    const enriched = Boolean(gpxOk && hasValley && hasDesc && hasPhoto);

    Object.assign(sk, {
      distance_km,
      municipalities,
      valley: valley_it,
      best_months: desc.best_months.length ? desc.best_months : best_months,
      season: desc.season.length ? desc.season : season,
      shortDescription_it: desc.shortDescription_it,
      shortDescription_en: desc.shortDescription_en,
      shortDescription_fr: desc.shortDescription_fr,
      shortDescription_de: desc.shortDescription_de,
      description_it: desc.description_it,
      description_en: desc.description_en,
      description_fr: desc.description_fr,
      description_de: desc.description_de,
      gpx_path: gpxExists ? gpxPath : sk.gpx_path ?? null,
      sen_period: senPeriod,
      signposts: signposts,
      enriched,
      updated_at: new Date().toISOString().slice(0, 10),
    });

    if (enriched) enrichedCount++;
    updated++;

    if (slugArg) {
      console.log(JSON.stringify(sk, null, 2));
    }
  }

  console.log(`→ Aggiornati ${updated} scheletri, ${enrichedCount} con enriched=true`);

  if (write) {
    await fs.writeFile(skeletonPath, JSON.stringify(skeletons, null, 2) + '\n');
    console.log(`✓ Scritto ${skeletonPath}`);
  } else if (!slugArg) {
    console.log('Aggiungi --write per salvare.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
