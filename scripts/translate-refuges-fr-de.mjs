/**
 * Translate refuge EN fields → FR/DE in refuges.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import translate from 'google-translate-api-x';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, '../src/data/refuges.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cache = new Map();

function localizeName(en, type, lang) {
  let s = en;
  if (lang === 'fr') {
    s = s
      .replace(/\bRefuge\b/g, 'Refuge')
      .replace(/\bBivouac\b/g, 'Bivouac')
      .replace(/\bMountain hut\b/gi, 'Refuge')
      .replace(/\bBivouac box\b/gi, 'Bivouac');
    if (type === 'bivacco' && !/bivouac/i.test(s)) s = `Bivouac ${s.replace(/^The\s+/i, '')}`;
    else if (type === 'rifugio' && !/^Refuge/i.test(s)) s = s.replace(/\bRefuge\b/, 'Refuge') || `Refuge ${s}`;
    return s;
  }
  s = s
    .replace(/\bRefuge\b/g, 'Hütte')
    .replace(/\bBivouac\b/g, 'Biwak')
    .replace(/\bMountain hut\b/gi, 'Hütte');
  if (type === 'bivacco' && !/biwak/i.test(s)) s = `Biwak ${s.replace(/^The\s+/i, '')}`;
  else if (type === 'rifugio' && !/^Hütte/i.test(s)) s = s.replace(/\bRefuge\b/, 'Hütte') || `Hütte ${s}`;
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

async function enrichRefuge(refuge, i, total) {
  console.log(`[${i + 1}/${total}] ${refuge.slug}`);
  if (!refuge.name_fr) refuge.name_fr = localizeName(refuge.name_en, refuge.type, 'fr');
  if (!refuge.name_de) refuge.name_de = localizeName(refuge.name_en, refuge.type, 'de');

  if (!refuge.valley_fr) refuge.valley_fr = refuge.valley_en;
  if (!refuge.valley_de) refuge.valley_de = refuge.valley_en;

  await trField(refuge, 'description_en', 'description_fr', 'description_de');
  await trField(refuge, 'open_period_en', 'open_period_fr', 'open_period_de');
  await trField(refuge, 'manager_en', 'manager_fr', 'manager_de');
  await trField(refuge, 'history_en', 'history_fr', 'history_de');
  await trField(refuge, 'food_en', 'food_fr', 'food_de');
  await trField(refuge, 'costs_en', 'costs_fr', 'costs_de');

  if (refuge.images?.length) {
    for (const img of refuge.images) {
      if (!img.alt_fr) img.alt_fr = await tr(img.alt_en, 'fr');
      if (!img.alt_de) img.alt_de = await tr(img.alt_en, 'de');
    }
  }
}

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
for (let i = 0; i < data.length; i++) {
  await enrichRefuge(data[i], i, data.length);
  if ((i + 1) % 5 === 0) fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
}
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log('Done — FR/DE fields added to all refuges.');
