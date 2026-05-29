/**
 * Fast FR/DE enrichment: rule-based stage names + Google Translate for prose fields.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import translate from 'google-translate-api-x';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FILES = [
  path.join(ROOT, 'src/data/trails.json'),
  path.join(ROOT, 'src/data/trails-routes.json'),
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cache = new Map();

function localizeName(en, lang) {
  let s = en;
  if (lang === 'fr') {
    s = s
      .replace(/High Route 1/g, 'Haute Route 1')
      .replace(/High Route 2/g, 'Haute Route 2')
      .replace(/High Route/g, 'Haute Route')
      .replace(/Stage (\d+)/g, 'Étape $1')
      .replace(/Tour du Mont Blanc/g, 'Tour du Mont-Blanc')
      .replace(/Tour of the Matterhorn/g, 'Tour du Cervin')
      .replace(/Tour of Monte Rosa/g, 'Tour du Monte Rosa')
      .replace(/Tour of Gran Paradiso/g, 'Tour du Grand Paradiso')
      .replace(/Tour of Rutor/g, 'Tour du Rutor')
      .replace(/Tour of Grand Combin/g, 'Tour du Grand Combin')
      .replace(/Rifugio/g, 'Refuge');
    return s;
  }
  s = s
    .replace(/High Route 1/g, 'Hochroute 1')
    .replace(/High Route 2/g, 'Hochroute 2')
    .replace(/High Route/g, 'Hochroute')
    .replace(/Stage (\d+)/g, 'Etappe $1')
    .replace(/Tour of the Matterhorn/g, 'Matterhorn-Tour')
    .replace(/Tour of Monte Rosa/g, 'Monte-Rosa-Tour')
    .replace(/Tour of Gran Paradiso/g, 'Gran-Paradiso-Tour')
    .replace(/Tour of Rutor/g, 'Rutor-Tour')
    .replace(/Tour of Grand Combin/g, 'Grand-Combin-Tour');
  return s;
}

async function tr(text, to) {
  if (!text?.trim()) return text;
  const key = `${to}::${text}`;
  if (cache.has(key)) return cache.get(key);
  for (let i = 0; i < 3; i++) {
    try {
      const res = await translate(text, { from: 'en', to });
      cache.set(key, res.text);
      await sleep(250);
      return res.text;
    } catch {
      await sleep(800 * (i + 1));
    }
  }
  return text;
}

async function trField(obj, enKey, frKey, deKey) {
  if (!obj[enKey]) return;
  if (!obj[frKey]) obj[frKey] = await tr(obj[enKey], 'fr');
  if (!obj[deKey]) obj[deKey] = await tr(obj[enKey], 'de');
}

async function enrichTrail(trail, i, total) {
  console.log(`[${i + 1}/${total}] ${trail.slug}`);
  if (!trail.name_fr) trail.name_fr = localizeName(trail.name_en, 'fr');
  if (!trail.name_de) trail.name_de = localizeName(trail.name_en, 'de');

  await trField(trail, 'shortDescription_en', 'shortDescription_fr', 'shortDescription_de');
  await trField(trail, 'description_en', 'description_fr', 'description_de');
  await trField(trail, 'geology_en', 'geology_fr', 'geology_de');
  await trField(trail, 'transport_en', 'transport_fr', 'transport_de');
  await trField(trail, 'water_sources_en', 'water_sources_fr', 'water_sources_de');
  await trField(trail, 'cultural_notes_en', 'cultural_notes_fr', 'cultural_notes_de');

  if (trail.warnings_en?.length && !trail.warnings_fr) {
    trail.warnings_fr = [];
    for (const w of trail.warnings_en) trail.warnings_fr.push(await tr(w, 'fr'));
  }
  if (trail.warnings_en?.length && !trail.warnings_de) {
    trail.warnings_de = [];
    for (const w of trail.warnings_en) trail.warnings_de.push(await tr(w, 'de'));
  }

  if (trail.waypoints?.length) {
    for (const wp of trail.waypoints) {
      if (wp.note_en) {
        if (!wp.note_fr) wp.note_fr = await tr(wp.note_en, 'fr');
        if (!wp.note_de) wp.note_de = await tr(wp.note_en, 'de');
      }
    }
  }
}

async function processFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (let i = 0; i < data.length; i++) {
    await enrichTrail(data[i], i, data.length);
    if ((i + 1) % 3 === 0) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log('Saved', filePath);
}

for (const f of FILES) {
  await processFile(f);
}
console.log('Done — FR/DE fields added to all trails.');
