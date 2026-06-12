/**
 * Applica l'arricchimento editoriale a refuges.json:
 * - desc: paragrafo aggiunto alla descrizione (separatore '\n')
 * - hist: storia documentata (sostituisce se più ricca dell'esistente)
 * Idempotente.
 */
import fs from 'node:fs';
import { REFUGE_CONTENT } from './refuge-content.mjs';

const PATH = 'src/data/refuges.json';
const refuges = JSON.parse(fs.readFileSync(PATH, 'utf8'));

let touched = 0;
const unknown = [];
for (const [slug, c] of Object.entries(REFUGE_CONTENT)) {
  const r = refuges.find((x) => x.slug === slug);
  if (!r) {
    unknown.push(slug);
    continue;
  }
  for (const lang of ['it', 'en', 'fr', 'de']) {
    const dKey = `description_${lang}`;
    if (c.desc?.[lang] && !(r[dKey] ?? '').includes(c.desc[lang].slice(0, 50))) {
      r[dKey] = `${r[dKey] ?? ''}\n${c.desc[lang]}`.trim();
    }
    const hKey = `history_${lang}`;
    if (c.hist?.[lang] && (r[hKey] ?? '').length < c.hist[lang].length) {
      r[hKey] = c.hist[lang];
    }
  }
  touched++;
}

fs.writeFileSync(PATH, JSON.stringify(refuges, null, 2) + '\n');
console.log(`✓ ${touched} rifugi arricchiti`);
if (unknown.length) console.log('SLUG NON TROVATI:', unknown.join(', '));
