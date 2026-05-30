// Scarica immagini per titolo esatto Wikimedia Commons.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const UA = 'SentieriVdA/1.0';

const FILES = [
  ['File:Dora Baltea, Montjovet, Italia (2025-08-17).jpg', 'public/environment/dora-baltea.jpg'],
  ['File:Ghiacciaio Rutor.jpg', 'public/environment/glacier-rutor.jpg'],
  ['File:Processione da Fontainemore a Oropa.jpg', 'public/cultura/oropa-procession.jpg'],
  ['File:Mezzo ATAP partenza processione fontainemore oropa.jpg', 'public/cultura/oropa-procession-alt.jpg'],
  ['File:Serpentinite.jpg', 'public/environment/ophiolites.jpg'],
  ['File:Ophiolite.jpg', 'public/environment/ophiolites-alt.jpg'],
  ['File:Fontaine de la Salle.jpg', 'public/environment/alpine-spring.jpg'],
  ['File:Cogne.jpg', 'public/cultura/val-di-cogne-alt.jpg'],
  ['File:Jambon de Bosses DOP.jpg', 'public/cultura/jambon-de-bosses-alt.jpg'],
  ['File:Jambon de la Valle d Aoste.jpg', 'public/cultura/jambon-food.jpg'],
  ['File:Landzette Coumba Freida.jpg', 'public/cultura/coumba-freida.jpg'],
  ['File:Coumba Freida.jpg', 'public/cultura/coumba-freida-alt.jpg'],
  ['File:Fifre.jpg', 'public/cultura/fifres.jpg'],
  ['File:Foire de Saint-Ours.jpg', 'public/cultura/saint-ours-fair.jpg'],
  ['File:Fiera di Sant Orso.jpg', 'public/cultura/saint-ours-fair-alt.jpg'],
  ['File:Transhumance.jpg', 'public/cultura/transhumance.jpg'],
  ['File:Costume valdôtain.jpg', 'public/cultura/traditional-costumes.jpg'],
  ['File:Seupa.jpg', 'public/cultura/seupa-valpellinentze.jpg'],
  ['File:Picotin.jpg', 'public/cultura/picotin.jpg'],
  ['File:Enfer d Arvier DOC.jpg', 'public/cultura/enfer-d-arvier.jpg'],
  ['File:Vignoble Enfer d Arvier.jpg', 'public/cultura/enfer-d-arvier-alt.jpg'],
  ['File:Carnevale di Pont-Saint-Martin.jpg', 'public/cultura/carnival.jpg'],
  ['File:Maschere carnevali valdostane.jpg', 'public/cultura/carnival-alt.jpg'],
  ['File:Costume tradizionale della Valle d Aosta.jpg', 'public/cultura/traditions-divider.jpg'],
];

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getInfo(title) {
  const url =
    'https://commons.wikimedia.org/w/api.php?format=json&origin=*' +
    '&action=query&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1800' +
    '&titles=' + encodeURIComponent(title);
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429) {
      await sleep(3000 * (i + 1));
      continue;
    }
    const data = await res.json();
    const page = Object.values(data.query?.pages || {})[0];
    if (page?.missing) return null;
    const ii = page?.imageinfo?.[0];
    if (!ii) return null;
    const artist = (ii.extmetadata?.Artist?.value || '').replace(/<[^>]*>/g, '').trim();
    const license = (ii.extmetadata?.LicenseShortName?.value || '').replace(/<[^>]*>/g, '').trim();
    return {
      title: page.title,
      url: ii.thumburl || ii.url,
      credit: license ? `${artist} (${license})` : artist,
      source: ii.descriptionurl,
    };
  }
  return null;
}

async function download(title, dest) {
  const abs = path.join(ROOT, dest);
  if (fs.existsSync(abs)) {
    console.log(`= skip ${dest}`);
    return { dest, status: 'exists' };
  }
  const info = await getInfo(title);
  if (!info) {
    console.log(`✗ missing ${title}`);
    return { dest, status: 'missing', title };
  }
  const res = await fetch(info.url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(abs, buf);
  console.log(`✓ ${dest} ← ${info.title} (${(buf.length / 1024).toFixed(0)} KB)`);
  return { dest, status: 'ok', ...info, kb: (buf.length / 1024).toFixed(0) };
}

async function main() {
  const report = [];
  for (const [title, dest] of FILES) {
    try {
      report.push(await download(title, dest));
    } catch (e) {
      console.log(`✗ ${dest}: ${e.message}`);
      report.push({ dest, status: 'error', error: e.message });
    }
    await sleep(2500);
  }
  fs.writeFileSync(path.join(__dirname, 'exact-file-report.json'), JSON.stringify(report, null, 2));
}

main();
