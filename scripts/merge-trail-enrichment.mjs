/**
 * Merges src/data/trail-enrichment.json into src/data/trails.json
 * Run: node scripts/merge-trail-enrichment.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const trailsPath = join(root, 'src/data/trails.json');
const enrichmentPath = join(root, 'src/data/trail-enrichment.json');

const trails = JSON.parse(readFileSync(trailsPath, 'utf8'));
const enrichment = JSON.parse(readFileSync(enrichmentPath, 'utf8'));

const slugs = trails.map((t) => t.slug);
const missing = slugs.filter((s) => !enrichment[s]);
if (missing.length) {
  console.error('Missing enrichment for:', missing.join(', '));
  process.exit(1);
}

const merged = trails.map((trail) => ({
  ...trail,
  ...enrichment[trail.slug],
}));

writeFileSync(trailsPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
console.log(`Merged enrichment into ${merged.length} trails.`);
