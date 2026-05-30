/**
 * Converte immagini in public/trails a WebP (max 2000px, q82).
 * Aggiorna path in trails.json e trails-routes.json.
 * Uso: npm run optimize:heroes
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import sizeOf from 'image-size';

const ROOT = process.cwd();
const TRAILS_DIR = path.join(ROOT, 'public/trails');
const TRAIL_FILES = ['src/data/trails.json', 'src/data/trails-routes.json'];
const MAX_WIDTH = 2000;
const QUALITY = 82;
const MIN_HERO_WIDTH = 1600;

const CONVERT_EXT = new Set(['.jpg', '.jpeg', '.png']);

function replacePathInJson(oldPath: string, newPath: string): number {
  let replacements = 0;
  for (const rel of TRAIL_FILES) {
    const fp = path.join(ROOT, rel);
    if (!fs.existsSync(fp)) continue;
    const raw = fs.readFileSync(fp, 'utf8');
    if (!raw.includes(oldPath)) continue;
    const updated = raw.split(oldPath).join(newPath);
    fs.writeFileSync(fp, updated);
    replacements += (raw.match(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? [])
      .length;
  }
  return replacements;
}

async function optimizeFile(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (!CONVERT_EXT.has(ext)) return null;

  const inputPath = path.join(TRAILS_DIR, filename);
  const base = path.basename(filename, ext);
  const outputName = `${base}.webp`;
  const outputPath = path.join(TRAILS_DIR, outputName);
  const publicPath = `/trails/${outputName}`;
  const oldPublicPath = `/trails/${filename}`;

  let inputBuf: Buffer;
  try {
    inputBuf = fs.readFileSync(inputPath);
  } catch {
    console.log(`  SKIP ${filename} — unreadable`);
    return null;
  }

  let before: { width?: number; height?: number; type?: string };
  try {
    before = sizeOf(inputBuf)!;
  } catch {
    console.log(`  SKIP ${filename} — corrupt or unsupported`);
    return null;
  }
  if (!before.width || !before.height) {
    console.log(`  SKIP ${filename} — cannot read dimensions`);
    return null;
  }

  if (fs.existsSync(outputPath)) {
    try {
      const existing = sizeOf(fs.readFileSync(outputPath));
      if (existing.width && existing.width >= before.width) {
        console.log(`  SKIP ${filename} — ${outputName} already exists (${existing.width}px ≥ ${before.width}px)`);
        if (filename !== outputName) {
          fs.unlinkSync(inputPath);
          replacePathInJson(oldPublicPath, publicPath);
        }
        return null;
      }
    } catch {
      /* overwrite below */
    }
  }

  try {
    let pipeline = sharp(inputBuf);
    if (before.width > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }
    await pipeline.webp({ quality: QUALITY }).toFile(outputPath);
  } catch (err) {
    console.log(`  SKIP ${filename} — sharp error: ${err instanceof Error ? err.message : err}`);
    return null;
  }

  const outBuf = fs.readFileSync(outputPath);
  const after = sizeOf(outBuf)!;
  const outWidth = after.width ?? before.width;
  const outHeight = after.height ?? before.height;

  if (filename !== outputName && fs.existsSync(inputPath)) {
    fs.unlinkSync(inputPath);
  }

  let jsonUpdates = 0;
  if (filename !== outputName) {
    jsonUpdates += replacePathInJson(oldPublicPath, publicPath);
  }

  return {
    from: oldPublicPath,
    to: publicPath,
    before: `${before.width}×${before.height} ${before.type}`,
    after: `${outWidth}×${outHeight} webp`,
    kbBefore: Math.round(inputBuf.length / 1024),
    kbAfter: Math.round(outBuf.length / 1024),
    under1600: outWidth < MIN_HERO_WIDTH,
    jsonUpdates,
  };
}

async function main() {
  if (!fs.existsSync(TRAILS_DIR)) {
    console.error('Missing public/trails');
    process.exit(1);
  }

  const files = fs.readdirSync(TRAILS_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return CONVERT_EXT.has(ext);
  });

  console.log(`\n── Optimizing ${files.length} files in public/trails ──\n`);

  const stillSmall: string[] = [];
  let converted = 0;

  for (const file of files.sort()) {
    const result = await optimizeFile(file);
    if (!result) continue;
    converted++;

    const warn = result.under1600 ? ' ⚠️ STILL <1600px — replace manually' : '';
    console.log(
      `  ${result.from} → ${result.to}\n    ${result.before} (${result.kbBefore} KB) → ${result.after} (${result.kbAfter} KB) | JSON refs: ${result.jsonUpdates}${warn}`,
    );
    if (result.under1600) stillSmall.push(result.to);
  }

  console.log(`\nConverted: ${converted}`);
  if (stillSmall.length > 0) {
    console.log(`\n⚠️  Still under ${MIN_HERO_WIDTH}px (manual replacement needed):`);
    stillSmall.forEach((p) => console.log(`   ${p}`));
  } else {
    console.log('\nAll outputs are ≥1600px wide.');
  }
  console.log('');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
