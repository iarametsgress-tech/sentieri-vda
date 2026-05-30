/**
 * Genera blurDataURL (10px) per immagini in public/trails.
 * Uso: npm run blur
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const TRAILS_DIR = path.join(ROOT, 'public/trails');
const OUT = path.join(ROOT, 'src/data/image-blur.json');
const BLUR_SIZE = 10;

async function main() {
  if (!fs.existsSync(TRAILS_DIR)) {
    console.error('Missing public/trails');
    process.exit(1);
  }

  const map: Record<string, string> = {};
  const files = fs
    .readdirSync(TRAILS_DIR)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort();

  for (const file of files) {
    const abs = path.join(TRAILS_DIR, file);
    const publicPath = `/trails/${file}`;
    try {
      const buf = await sharp(abs)
        .resize(BLUR_SIZE, BLUR_SIZE, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 20 })
        .toBuffer();
      map[publicPath] = `data:image/webp;base64,${buf.toString('base64')}`;
    } catch (err) {
      console.warn(`  SKIP blur ${file}: ${err instanceof Error ? err.message : err}`);
    }
  }

  fs.writeFileSync(OUT, JSON.stringify(map, null, 2) + '\n');
  console.log(`\nGenerated ${Object.keys(map).length} blur placeholders → ${OUT}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
