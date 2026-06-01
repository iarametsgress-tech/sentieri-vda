/**
 * batch-ledger — registro di stato per i 1150 sentieri di Sentieri VdA.
 *
 * Calcola, per ogni slug, lo stato dei tre assi di lavoro (descrizione / foto /
 * mappa) leggendo i dati reali, e permette ai sotto-agenti di "rivendicare"
 * lotti di lavoro senza pestarsi i piedi. È la colla che fa lavorare molti
 * agenti in parallelo sugli stessi 1150 sentieri.
 *
 * Lo stato è DERIVATO dai file (build), non dichiarato a mano: così non può
 * mentire. La verità ultima su "completo" resta `npm run validate:trails`;
 * qui usiamo gli stessi criteri per dare una vista d'insieme e distribuire.
 *
 * Comandi:
 *   npm run ledger:build                       # ricalcola lo stato di tutti
 *   npm run ledger:status                       # riepilogo a colpo d'occhio
 *   npm run ledger:claim -- --agent=a1 --count=20 --need=desc
 *   npm run ledger:release -- --agent=a1        # libera i claim di un agente
 *   npm run ledger:release -- --stale           # libera i claim più vecchi di TTL
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, '../../../../');
const PUBLIC = join(ROOT, 'public');
const LEDGER_PATH = join(ROOT, 'trail-ledger.json');
const CLAIM_TTL_MS = 6 * 60 * 60 * 1000; // 6h: un claim più vecchio è considerato abbandonato

// Frasi-spia dei template auto-generati (allineate a validate-trails.ts).
const TEMPLATE_MARKERS = [
  'scheda in arricchimento',
  "sentiero ufficiale del Catasto Sentieri della Valle d'Aosta (",
  'page being enriched',
  'official trail from the Aosta Valley trail registry (',
  "fiche en cours d'enrichissement",
  'Seite wird ergänzt',
];
const MIN_EDITORIAL_DESC = 400;
const LANGS = ['it', 'en', 'fr', 'de'] as const;

type Axis = 'desc' | 'photo' | 'map';
type Claim = { agent: string; axis: Axis | 'all'; at: string } | null;
type Entry = {
  slug: string;
  name: string;
  curated: boolean;
  desc: boolean;
  photo: boolean;
  map: boolean;
  indexable: boolean;
  claim: Claim;
};
type Ledger = { updatedAt: string; entries: Entry[] };

const isGeo = (s: unknown) => typeof s === 'string' && s.includes('/trails/geo/');
const nonEmpty = (s: unknown) => typeof s === 'string' && s.trim().length > 0;

function localExists(p: unknown): boolean {
  if (typeof p !== 'string') return false;
  if (p.startsWith('http')) return true; // remoto: lo consideriamo presente
  return existsSync(join(PUBLIC, p.replace(/^\//, '')));
}

function descDone(t: any): boolean {
  for (const l of LANGS) {
    const d = t[`description_${l}`];
    if (!nonEmpty(d) || d.trim().length < MIN_EDITORIAL_DESC) return false;
    if (TEMPLATE_MARKERS.some((m) => d.includes(m))) return false;
  }
  return true;
}

function photoDone(t: any): boolean {
  return isGeo(t.image) && isGeo(t.hero_image) && Boolean(t.image_credit && t.image_source);
}

function mapDone(t: any): boolean {
  if (t.is_transfer_stage === true) return true;
  return typeof t.gpx_path === 'string' && /^\/gpx\/.+\.gpx$/.test(t.gpx_path) && localExists(t.gpx_path);
}

function loadJson(rel: string): any[] {
  const p = join(ROOT, rel);
  if (!existsSync(p)) return [];
  const data = JSON.parse(readFileSync(p, 'utf8'));
  return Array.isArray(data) ? data : data.trails ?? [];
}

function loadLedger(): Ledger | null {
  if (!existsSync(LEDGER_PATH)) return null;
  return JSON.parse(readFileSync(LEDGER_PATH, 'utf8'));
}

function saveLedger(l: Ledger) {
  l.updatedAt = new Date().toISOString();
  writeFileSync(LEDGER_PATH, JSON.stringify(l, null, 2) + '\n');
}

// ── build: ricalcola lo stato preservando i claim esistenti ──
function build(): Ledger {
  const curated = loadJson('src/data/trails.json');
  const curatedSlugs = new Set(curated.map((t) => t.slug));
  const skeletons = loadJson('src/data/trails-skeleton.json').filter((t) => !curatedSlugs.has(t.slug));
  const all = [...curated.map((t) => [t, true] as const), ...skeletons.map((t) => [t, false] as const)];

  const prev = loadLedger();
  const prevClaims = new Map<string, Claim>(prev?.entries.map((e) => [e.slug, e.claim]) ?? []);

  const entries: Entry[] = all.map(([t, isCurated]) => {
    const desc = descDone(t);
    const photo = photoDone(t);
    const map = mapDone(t);
    // un claim vivo viene preservato solo finché il suo asse non è completato
    let claim = prevClaims.get(t.slug) ?? null;
    if (claim) {
      const done = claim.axis === 'all' ? desc && photo && map : ({ desc, photo, map } as const)[claim.axis];
      if (done) claim = null;
    }
    return {
      slug: t.slug,
      name: t.name_it ?? t.slug,
      curated: isCurated,
      desc,
      photo,
      map,
      indexable: desc && photo && map,
      claim,
    };
  });

  const ledger: Ledger = { updatedAt: '', entries };
  saveLedger(ledger);
  return ledger;
}

// ── status ──
function status() {
  const l = loadLedger() ?? build();
  const n = l.entries.length;
  const count = (k: keyof Entry) => l.entries.filter((e) => e[k] === true).length;
  const claimed = l.entries.filter((e) => e.claim).length;
  const pct = (x: number) => `${x}/${n} (${Math.round((x / n) * 100)}%)`;
  console.log(`\nLedger aggiornato: ${l.updatedAt}`);
  console.log(`Sentieri totali:   ${n}\n`);
  console.log(`  descrizione  ${pct(count('desc'))}`);
  console.log(`  foto         ${pct(count('photo'))}`);
  console.log(`  mappa        ${pct(count('map'))}`);
  console.log(`  INDICIZZABILI ${pct(count('indexable'))}`);
  console.log(`\n  rivendicati ora: ${claimed}`);
  const byAgent = new Map<string, number>();
  for (const e of l.entries) if (e.claim) byAgent.set(e.claim.agent, (byAgent.get(e.claim.agent) ?? 0) + 1);
  for (const [a, c] of byAgent) console.log(`    ${a}: ${c}`);
  console.log('');
}

// ── claim: assegna N slug non finiti e non rivendicati a un agente ──
function claim(agent: string, count: number, need: Axis | 'all') {
  if (!agent) fail('--agent obbligatorio');
  const l = loadLedger() ?? build();
  const now = Date.now();

  const isClaimable = (e: Entry) => {
    const axisTodo = need === 'all' ? !e.indexable : !e[need];
    if (!axisTodo) return false;
    if (!e.claim) return true;
    // claim scaduto → riassegnabile
    return now - new Date(e.claim.at).getTime() > CLAIM_TTL_MS;
  };

  const picked = l.entries.filter(isClaimable).slice(0, count);
  if (picked.length === 0) {
    console.log(`Nessuno slug disponibile per --need=${need}. Forse è tutto fatto o rivendicato.`);
    return;
  }
  const at = new Date().toISOString();
  for (const e of picked) e.claim = { agent, axis: need, at };
  saveLedger(l);

  console.log(`\nAssegnati ${picked.length} sentieri a "${agent}" (asse: ${need}):\n`);
  for (const e of picked) console.log(`  ${e.slug}`);
  console.log(`\nQuando hai finito uno slug, esegui "npm run ledger:build" per aggiornare lo stato`);
  console.log(`(un asse completato libera automaticamente il suo claim).\n`);
}

// ── release ──
function release(agent: string | undefined, stale: boolean) {
  const l = loadLedger() ?? build();
  const now = Date.now();
  let freed = 0;
  for (const e of l.entries) {
    if (!e.claim) continue;
    const isStale = now - new Date(e.claim.at).getTime() > CLAIM_TTL_MS;
    if ((agent && e.claim.agent === agent) || (stale && isStale)) {
      e.claim = null;
      freed++;
    }
  }
  saveLedger(l);
  console.log(`Liberati ${freed} claim.`);
}

function fail(msg: string): never {
  console.error(`\x1b[31m${msg}\x1b[0m`);
  process.exit(2);
}

function arg(name: string): string | undefined {
  const a = process.argv.find((x) => x.startsWith(`--${name}`));
  if (!a) return undefined;
  return a.includes('=') ? a.split('=')[1] : 'true';
}

function main() {
  const cmd = process.argv[2];
  switch (cmd) {
    case 'build':
      build();
      console.log('Ledger ricostruito → trail-ledger.json');
      status();
      break;
    case 'status':
      status();
      break;
    case 'claim':
      claim(arg('agent') ?? '', Number(arg('count') ?? 10), (arg('need') as Axis) ?? 'all');
      break;
    case 'release':
      release(arg('agent'), Boolean(arg('stale')));
      break;
    default:
      console.log('Comandi: build | status | claim | release');
      process.exit(1);
  }
}

main();
