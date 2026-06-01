/**
 * trail-validator — gatekeeper per le schede sentiero di Sentieri VdA.
 *
 * Importa il VERO TrailSchema da src/lib/types.ts, così le regole strutturali
 * non possono divergere dallo schema dell'app. Aggiunge controlli editoriali
 * (parità 4 lingue, frasi-spia dei template, sanity numerica, esistenza di
 * GPX/immagini, foto geolocalizzata verificata) ai tre livelli schema /
 * enriched / index — gli stessi gradini di shouldIndexTrail().
 *
 * Uso:
 *   npm run validate:trails
 *   npm run validate:trails -- --slug lago-djouan-cogne --level enriched
 *   npm run validate:trails -- --file tmp/batch.json --level index --strict
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TrailSchema } from '../../../../src/lib/types';

// ── Project root: .claude/skills/trail-validator/scripts → su di 4 livelli ──
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, '../../../../');
const PUBLIC = join(ROOT, 'public');

type Level = 'schema' | 'enriched' | 'index';
const LEVELS: Level[] = ['schema', 'enriched', 'index'];

// Frasi auto-generate da skeleton-trails.ts (factualDescriptions). La loro
// presenza significa che la scheda NON è stata scritta a mano. Tieni allineato
// con quel file.
const TEMPLATE_MARKERS = [
  'scheda in arricchimento',
  "sentiero ufficiale del Catasto Sentieri della Valle d'Aosta (",
  'page being enriched',
  'official trail from the Aosta Valley trail registry (',
  "fiche en cours d'enrichissement",
  'sentier officiel du cadastre des sentiers',
  'Seite wird ergänzt',
  'offizieller Weg aus dem Wegekataster',
];

const PLACEHOLDER_IMAGE = '/trails/_placeholder.svg';
const MIN_EDITORIAL_DESC = 400; // caratteri: prosa editoriale, non una riga

// Gruppi di campi che, se presenti, devono esserlo in TUTTE e 4 le lingue.
const MULTILINGUAL_GROUPS = [
  'name',
  'shortDescription',
  'description',
  'geology',
  'water_sources',
  'transport',
  'cultural_notes',
] as const;

// ── parsing argomenti ──
function parseArgs(argv: string[]) {
  const out: { file?: string; slug?: string; level: Level; strict: boolean } = {
    level: 'schema',
    strict: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--file') out.file = argv[++i];
    else if (a === '--slug') out.slug = argv[++i];
    else if (a === '--level') {
      const lv = argv[++i] as Level;
      if (!LEVELS.includes(lv)) fail(`--level deve essere uno di: ${LEVELS.join(', ')}`);
      out.level = lv;
    } else if (a === '--strict') out.strict = true;
    else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    }
  }
  return out;
}

function fail(msg: string): never {
  console.error(`\x1b[31m${msg}\x1b[0m`);
  process.exit(2);
}

function printHelp() {
  console.log(`trail-validator
  --file <path>   JSON da validare (default src/data/trails.json)
  --slug <slug>   valida un solo record
  --level <schema|enriched|index>   barra da superare (default schema)
  --strict        esce 1 se c'è almeno un FAIL`);
}

// ── helper ──
const isGeo = (s: unknown) => typeof s === 'string' && s.includes('/trails/geo/');
const nonEmpty = (s: unknown) => typeof s === 'string' && s.trim().length > 0;

function hasVerifiedGeolocatedPhoto(t: any): boolean {
  return isGeo(t.image) && isGeo(t.hero_image) && Boolean(t.image_credit && t.image_source);
}

/** Risolve un path immagine/gpx locale (/images/.., /gpx/..) in un file su disco. */
function localFileExists(p: unknown): boolean | null {
  if (typeof p !== 'string') return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return null; // URL remoto: non verificabile qui
  return existsSync(join(PUBLIC, p.replace(/^\//, '')));
}

type Issue = { level: 'FAIL' | 'WARN'; field: string; msg: string };

/** Controlli editoriali oltre allo schema Zod. Ritorna issue al livello dato. */
function editorialChecks(t: any, level: Level): Issue[] {
  const issues: Issue[] = [];
  const wantEnriched = level === 'enriched' || level === 'index';

  // 1. parità 4 lingue: tutte presenti o tutte assenti, mai miste
  for (const base of MULTILINGUAL_GROUPS) {
    const vals = ['it', 'en', 'fr', 'de'].map((l) => t[`${base}_${l}`]);
    const present = vals.filter(nonEmpty).length;
    if (present > 0 && present < 4) {
      issues.push({
        level: 'FAIL',
        field: base,
        msg: `parità lingue rotta: ${present}/4 valorizzate (deve essere 0 o 4)`,
      });
    }
  }

  // 2. frasi-spia dei template auto-generati
  const textBlob = ['it', 'en', 'fr', 'de']
    .flatMap((l) => [t[`description_${l}`], t[`shortDescription_${l}`]])
    .filter(nonEmpty)
    .join('\n');
  for (const marker of TEMPLATE_MARKERS) {
    if (textBlob.includes(marker)) {
      issues.push({
        level: wantEnriched ? 'FAIL' : 'WARN',
        field: 'description',
        msg: `testo-template non editoriale rilevato: "${marker.slice(0, 40)}…"`,
      });
    }
  }

  // 3. descrizione editoriale sostanziosa (solo a enriched/index)
  if (wantEnriched) {
    for (const l of ['it', 'en', 'fr', 'de']) {
      const d = t[`description_${l}`];
      if (!nonEmpty(d) || d.trim().length < MIN_EDITORIAL_DESC) {
        issues.push({
          level: 'FAIL',
          field: `description_${l}`,
          msg: `descrizione troppo corta per essere editoriale (${(d?.trim().length ?? 0)} < ${MIN_EDITORIAL_DESC} char)`,
        });
      }
    }
  }

  // 4. sanity numerica (WARN: plausibilità, non verità)
  const km = t.distance_km;
  if (typeof km === 'number' && (km <= 0 || km > 80))
    issues.push({ level: 'WARN', field: 'distance_km', msg: `distanza implausibile: ${km} km` });
  for (const f of ['elevation_gain_m', 'elevation_loss_m']) {
    const v = t[f];
    if (typeof v === 'number' && (v < 0 || v > 3000))
      issues.push({ level: 'WARN', field: f, msg: `dislivello implausibile: ${v} m` });
  }
  for (const pt of ['start', 'end']) {
    const e = t[pt]?.elevation_m;
    if (typeof e === 'number' && (e < 300 || e > 4810))
      issues.push({ level: 'WARN', field: `${pt}.elevation_m`, msg: `quota fuori range VdA: ${e} m` });
  }
  if (
    typeof km === 'number' &&
    typeof t.duration_hours === 'number' &&
    typeof t.elevation_gain_m === 'number' &&
    typeof t.elevation_loss_m === 'number'
  ) {
    const cai = km / 4 + Math.max(0, t.elevation_gain_m) / 400 + Math.max(0, t.elevation_loss_m) / 600;
    if (cai > 0 && (t.duration_hours > cai * 2 || t.duration_hours < cai * 0.5)) {
      issues.push({
        level: 'WARN',
        field: 'duration_hours',
        msg: `durata ${t.duration_hours}h lontana dalla stima CAI ${cai.toFixed(1)}h — possibile typo`,
      });
    }
  }

  // 5. GPX: path valido + file esistente (richiesto a enriched/index salvo transfer)
  const gpx = t.gpx_path;
  if (gpx != null) {
    if (!/^\/gpx\/.+\.gpx$/.test(gpx))
      issues.push({ level: 'FAIL', field: 'gpx_path', msg: `formato gpx_path non valido: ${gpx}` });
    else if (localFileExists(gpx) === false)
      issues.push({ level: 'FAIL', field: 'gpx_path', msg: `file GPX mancante in public${gpx}` });
  } else if (wantEnriched && t.is_transfer_stage !== true) {
    issues.push({ level: 'FAIL', field: 'gpx_path', msg: 'gpx_path assente (e non è una tappa di trasferimento)' });
  }

  // 6. immagini: file locali devono esistere; placeholder non vale come foto
  for (const f of ['hero_image', 'image']) {
    const v = t[f];
    if (v === PLACEHOLDER_IMAGE && wantEnriched)
      issues.push({ level: 'FAIL', field: f, msg: 'immagine placeholder: foto non verificata' });
    else if (localFileExists(v) === false)
      issues.push({ level: 'FAIL', field: f, msg: `file immagine mancante in public: ${v}` });
  }
  for (const g of Array.isArray(t.gallery) ? t.gallery : []) {
    if (localFileExists(g) === false)
      issues.push({ level: 'WARN', field: 'gallery', msg: `file gallery mancante: ${g}` });
  }

  // 7. livello index: foto geolocalizzata verificata + flag enriched
  if (level === 'index') {
    if (t.enriched !== true)
      issues.push({ level: 'FAIL', field: 'enriched', msg: 'enriched != true: non indicizzabile' });
    if (!hasVerifiedGeolocatedPhoto(t))
      issues.push({
        level: 'FAIL',
        field: 'photo',
        msg: 'foto non geolocalizzata/verificata (serve /trails/geo/ + image_credit + image_source)',
      });
  }

  // coerenza del flag enriched col contenuto
  if (t.enriched === true && level === 'schema') {
    // se è marcato enriched ma lo validiamo solo a schema, ricordalo
    issues.push({ level: 'WARN', field: 'enriched', msg: 'marcato enriched: validalo a --level enriched o index' });
  }

  return issues;
}

// ── caricamento dati ──
function loadRecords(file: string): any[] {
  if (!existsSync(file)) fail(`File non trovato: ${file}`);
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    fail(`JSON non valido in ${file}: ${(e as Error).message}`);
  }
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray((data as any).trails))
    return (data as any).trails;
  fail(`Formato non riconosciuto in ${file}: atteso array o { trails: [...] }`);
}

// ── main ──
function main() {
  const args = parseArgs(process.argv.slice(2));
  const file = args.file ? resolve(process.cwd(), args.file) : join(ROOT, 'src/data/trails.json');
  let records = loadRecords(file);
  if (args.slug) {
    records = records.filter((r) => r?.slug === args.slug);
    if (records.length === 0) fail(`Nessun sentiero con slug "${args.slug}" in ${file}`);
  }

  console.log(`\nValidazione: ${file}`);
  console.log(`Record: ${records.length} · livello: ${args.level}${args.strict ? ' · strict' : ''}\n`);

  // slug duplicati nel file
  const seen = new Map<string, number>();
  for (const r of records) if (r?.slug) seen.set(r.slug, (seen.get(r.slug) ?? 0) + 1);
  const dups = [...seen].filter(([, n]) => n > 1);

  let nFail = 0;
  let nWarn = 0;
  let nOk = 0;

  for (const rec of records) {
    const slug = rec?.slug ?? '(senza slug)';
    const issues: Issue[] = [];

    // schema Zod (sempre)
    const parsed = TrailSchema.safeParse(rec);
    if (!parsed.success) {
      for (const e of parsed.error.errors) {
        let msg = e.message;
        // Errore frequentissimo: un campo opzionale messo a null invece di omesso.
        // Zod dice solo "Expected string, received null": aggiungiamo il rimedio.
        if (/received null/.test(msg))
          msg += ' → campo opzionale a null: OMETTI la chiave (non scrivere null). Se è obbligatorio, valorizzalo.';
        issues.push({ level: 'FAIL', field: e.path.join('.') || '(root)', msg });
      }
    }

    // controlli editoriali (solo se lo schema regge: altrimenti i campi sono inaffidabili)
    if (parsed.success) issues.push(...editorialChecks(rec, args.level));

    const fails = issues.filter((i) => i.level === 'FAIL');
    const warns = issues.filter((i) => i.level === 'WARN');
    nFail += fails.length;
    nWarn += warns.length;

    if (fails.length === 0 && warns.length === 0) {
      nOk++;
      continue;
    }
    const tag = fails.length ? '\x1b[31mFAIL\x1b[0m' : '\x1b[33mWARN\x1b[0m';
    console.log(`${tag} ${slug}`);
    for (const i of fails) console.log(`   \x1b[31m✗\x1b[0m ${i.field}: ${i.msg}`);
    for (const i of warns) console.log(`   \x1b[33m!\x1b[0m ${i.field}: ${i.msg}`);
  }

  if (dups.length) {
    console.log('\n\x1b[31mSlug duplicati:\x1b[0m');
    for (const [s, n] of dups) console.log(`   ✗ ${s} (${n}×)`);
    nFail += dups.length;
  }

  console.log('\n──────────────────────────────────────');
  console.log(`OK: ${nOk}/${records.length}   FAIL: ${nFail}   WARN: ${nWarn}`);
  console.log('──────────────────────────────────────\n');

  if (args.strict && nFail > 0) process.exit(1);
}

main();
