/**
 * Applica i paragrafi editoriali alle tappe tour in trails-routes.json.
 * description_X = paragrafo esistente + '\n' + paragrafo nuovo (multi-<p> nel sito).
 * Idempotente: non riappende se il testo è già presente.
 */
import fs from 'node:fs';
import { CONTENT_1 } from './stage-content-1.mjs';
import { CONTENT_2 } from './stage-content-2.mjs';

const ROUTES = 'src/data/trails-routes.json';
const CONTENT = { ...CONTENT_1, ...CONTENT_2 };
const trails = JSON.parse(fs.readFileSync(ROUTES, 'utf8'));

let applied = 0;
const missing = [];
for (const t of trails) {
  if (!t.tags.includes('tour')) continue;
  const c = CONTENT[t.slug];
  if (!c) {
    missing.push(t.slug);
    continue;
  }
  for (const lang of ['it', 'en', 'fr', 'de']) {
    const key = `description_${lang}`;
    const extra = c[lang];
    if (!t[key].includes(extra.slice(0, 60))) {
      t[key] = `${t[key]}\n${extra}`;
    }
  }
  applied++;
}

fs.writeFileSync(ROUTES, JSON.stringify(trails, null, 2) + '\n');
console.log(`✓ contenuti applicati a ${applied} tappe`);
if (missing.length) console.log('SENZA CONTENUTO:', missing.join(', '));
