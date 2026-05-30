/**
 * Audit immagini in public/trails e public/images.
 * Uso: npm run audit:img
 */
import fs from 'node:fs';
import path from 'node:path';
import sizeOf from 'image-size';

const ROOT = path.join(process.cwd());
const SCAN_DIRS = ['public/trails', 'public/images'];
const TRAIL_FILES = ['src/data/trails.json', 'src/data/trails-routes.json'];
const OUT_JSON = path.join(ROOT, 'image-audit.json');
const MIN_HERO_WIDTH = 1600;

type Usage = { slug: string; role: 'hero_image' | 'image' };

type AuditEntry = {
  path: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  under1600: boolean;
  isPng: boolean;
  warn: boolean;
  usedBy: Usage[];
};

function loadTrailUsage(): Map<string, Usage[]> {
  const map = new Map<string, Usage[]>();
  const add = (filePath: string | undefined, slug: string, role: Usage['role']) => {
    if (!filePath || !filePath.startsWith('/')) return;
    const list = map.get(filePath) ?? [];
    if (!list.some((u) => u.slug === slug && u.role === role)) {
      list.push({ slug, role });
    }
    map.set(filePath, list);
  };

  for (const file of TRAIL_FILES) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) continue;
    const trails = JSON.parse(fs.readFileSync(full, 'utf8')) as Array<{
      slug: string;
      hero_image?: string;
      image?: string;
    }>;
    for (const t of trails) {
      add(t.hero_image, t.slug, 'hero_image');
      add(t.image, t.slug, 'image');
    }
  }
  return map;
}

function collectImageFiles(): string[] {
  const files: string[] = [];
  for (const dir of SCAN_DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const name of fs.readdirSync(abs)) {
      const fp = path.join(abs, name);
      if (!fs.statSync(fp).isFile()) continue;
      if (/\.(jpe?g|png|webp|gif|avif)$/i.test(name)) {
        files.push(fp);
      }
    }
  }
  return files.sort();
}

function main() {
  const usageMap = loadTrailUsage();
  const entries: AuditEntry[] = [];

  for (const absPath of collectImageFiles()) {
    const publicPath = '/' + path.relative(path.join(ROOT, 'public'), absPath).replace(/\\/g, '/');
    const buf = fs.readFileSync(absPath);
    const dim = sizeOf(buf);
    if (!dim.width || !dim.height) continue;

    const format = (dim.type ?? path.extname(absPath).slice(1)).toLowerCase();
    const isPng = format === 'png';
    const under1600 = dim.width < MIN_HERO_WIDTH;

    entries.push({
      path: publicPath,
      width: dim.width,
      height: dim.height,
      format,
      bytes: buf.length,
      under1600,
      isPng,
      warn: under1600 || isPng,
      usedBy: usageMap.get(publicPath) ?? [],
    });
  }

  entries.sort((a, b) => a.width - b.width || a.path.localeCompare(b.path));

  console.log('\n── Image audit (sorted by width) ──\n');
  console.log(
    'Flag'.padEnd(6) +
      'Path'.padEnd(58) +
      'Dimensions'.padEnd(14) +
      'Fmt'.padEnd(6) +
      'KB'.padEnd(8) +
      'Used by',
  );
  console.log('─'.repeat(120));

  for (const e of entries) {
    const flag = e.warn ? '⚠️' : '  ';
    const kb = Math.round(e.bytes / 1024);
    const slugs =
      e.usedBy.length > 0
        ? e.usedBy.map((u) => `${u.slug} (${u.role})`).join(', ')
        : '—';
    console.log(
      `${flag}    ${e.path.padEnd(56)} ${`${e.width}×${e.height}`.padEnd(12)} ${e.format.padEnd(4)} ${String(kb).padEnd(6)} ${slugs}`,
    );
  }

  const warned = entries.filter((e) => e.warn);
  console.log(`\nTotal: ${entries.length} files | ⚠️ flagged: ${warned.length}`);
  console.log(`  < ${MIN_HERO_WIDTH}px: ${entries.filter((e) => e.under1600).length}`);
  console.log(`  PNG: ${entries.filter((e) => e.isPng).length}`);

  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        minHeroWidth: MIN_HERO_WIDTH,
        total: entries.length,
        flagged: warned.length,
        entries,
      },
      null,
      2,
    ),
  );
  console.log(`\nSaved ${OUT_JSON}\n`);
}

main();
