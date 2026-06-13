/** Applica arricchimenti: AV2 (para+cult), geologia per tour, note culturali tappe, descrizioni brevi. */
import fs from 'node:fs';
import { AV2 } from './av2-content.mjs';
import { GEO, CULT_1 } from './deep-fields-1.mjs';
import { CULT_2, SHORT_DESC } from './deep-fields-2.mjs';

const CULT = { ...CULT_1, ...CULT_2 };
const TODAY = new Date().toISOString().slice(0, 10);
const LANGS = ['it', 'en', 'fr', 'de'];

function apply(file) {
  const trails = JSON.parse(fs.readFileSync(file, 'utf8'));
  let n = 0;
  for (const t of trails) {
    let touched = false;

    const av2 = AV2[t.slug];
    if (av2) {
      for (const l of LANGS) {
        if (!t['description_' + l].includes(av2.para[l].slice(0, 40))) {
          t['description_' + l] = t['description_' + l].trimEnd() + '\n' + av2.para[l];
        }
        t['cultural_notes_' + l] = av2.cult[l];
      }
      touched = true;
    }

    const tourTag = t.tags?.find((x) => GEO[x]);
    if (tourTag && !t.geology_it) {
      for (const l of LANGS) t['geology_' + l] = GEO[tourTag][l];
      touched = true;
    }

    const cult = CULT[t.slug];
    if (cult && !t.cultural_notes_it) {
      for (const l of LANGS) t['cultural_notes_' + l] = cult[l];
      touched = true;
    }

    const sd = SHORT_DESC[t.slug];
    if (sd) {
      for (const l of LANGS) {
        if (!t['description_' + l].includes(sd[l].slice(0, 40))) {
          t['description_' + l] = sd[l];
        }
      }
      touched = true;
    }

    if (touched) {
      t.updated_at = TODAY;
      n++;
    }
  }
  fs.writeFileSync(file, JSON.stringify(trails, null, 2) + '\n');
  console.log(`✓ ${file}: ${n} schede arricchite`);
}

apply('src/data/trails.json');
apply('src/data/trails-routes.json');
