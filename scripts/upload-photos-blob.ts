/**
 * Carica le foto geolocalizzate dei sentieri (public/trails/geo/*.webp) su Vercel Blob
 * e aggiorna trails-skeleton.json puntando agli URL Blob (CDN). Così le ~441 MB di foto
 * NON stanno in git: il repo resta leggero e Vercel le serve dal CDN.
 *
 * PREREQUISITO: variabile d'ambiente BLOB_READ_WRITE_TOKEN
 *   - Vercel → progetto → Storage → Create/Connect a Blob store → Tokens → copia il token "Read/Write"
 *   - In locale: aggiungi in .env.local →  BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx
 *
 * Uso:
 *   npm run upload:blob              # carica tutte le foto non ancora su Blob
 *   npm run upload:blob -- --limit=50
 *   npm run upload:blob -- --dry-run # mostra cosa farebbe, senza caricare
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';
import { loadEnvLocal } from './lib/load-env';

const SKELETON = './src/data/trails-skeleton.json';
const GEO_DIR = 'public/trails/geo';
const SAVE_EVERY = 25;

function arg(name: string): string | undefined {
  const a = process.argv.find((x) => x.startsWith(`--${name}`));
  if (!a) return undefined;
  return a.includes('=') ? a.split('=')[1] : 'true';
}

async function fileExists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

async function main() {
  await loadEnvLocal();
  const dryRun = Boolean(arg('dry-run'));
  const limit = Number(arg('limit') ?? Infinity);
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token && !dryRun) {
    console.error('❌ Manca BLOB_READ_WRITE_TOKEN. Crea un Blob store su Vercel (Storage → Blob),');
    console.error('   copia il token Read/Write e mettilo in .env.local. Poi rilancia.');
    process.exit(1);
  }

  const skeletons: any[] = JSON.parse(await readFile(SKELETON, 'utf8'));
  // Solo quelli che puntano a un file geo LOCALE (non già su https/Blob).
  const todo = skeletons.filter(
    (t) => typeof t.image === 'string' && t.image.startsWith('/trails/geo/'),
  ).slice(0, limit);

  console.log(`Foto da caricare su Blob: ${todo.length}${dryRun ? ' (DRY RUN)' : ''}`);
  let done = 0, missing = 0, processed = 0;

  for (const t of todo) {
    const base = path.basename(t.image); // es. 03-s1.webp
    const localPath = path.join(GEO_DIR, base);
    if (!(await fileExists(localPath))) { missing++; continue; }

    if (dryRun) { console.log(`  ${t.slug} → ${base}`); processed++; continue; }

    try {
      const buf = await readFile(localPath);
      const res = await put(`trails/geo/${base}`, buf, {
        access: 'public',
        token,
        contentType: 'image/webp',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 31536000,
      });
      t.image = res.url;
      t.hero_image = res.url;
      done++;
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      if (/private store/i.test(msg)) {
        console.error(`  ✗ ${t.slug}: lo store Blob è privato. Vercel → Storage → Blob → imposta accesso Public, poi rilancia.`);
        break;
      }
      console.error(`  ✗ ${t.slug}:`, msg);
    }
    processed++;
    if (!dryRun && done % SAVE_EVERY === 0) {
      await writeFile(SKELETON, JSON.stringify(skeletons) + '\n');
    }
    if (processed % 50 === 0) console.log(`  …${processed}/${todo.length}`);
  }

  if (!dryRun) await writeFile(SKELETON, JSON.stringify(skeletons) + '\n');
  console.log(`\n✓ Caricate su Blob: ${done} | file locali mancanti: ${missing}`);
  console.log('Ora committa src/data/trails-skeleton.json (gli URL puntano al CDN Blob) e fai push.');
}

main().catch((e) => { console.error(e); process.exit(1); });
