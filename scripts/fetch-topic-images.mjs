// Cerca e scarica immagini per query curate (Ambiente + Cultura).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const UA = 'SentieriVdA/1.0 (educational image sourcing)';

const JOBS = [
  { query: 'serpentinite Valpelline ophiolite', dest: 'public/environment/ophiolites.jpg', must: /serpentin|ophiolit|valpellin/i },
  { query: 'Dora Baltea river close', dest: 'public/environment/dora-baltea.jpg', must: /dora.?baltea|doire.?balt/i },
  { query: 'Ghiacciaio Rutor Valle d Aosta', dest: 'public/environment/glacier-rutor.jpg', must: /rutor|ghiacc|glacier/i },
  { query: 'sorgente alpina fontaine montagne', dest: 'public/environment/alpine-spring.jpg', must: /sorgent|fontain|spring|source/i },
  { query: 'Cogne Valle d Aosta paese', dest: 'public/cultura/val-di-cogne.jpg', must: /cogne/i },
  { query: 'Jambon de Bosses prosciutto', dest: 'public/cultura/jambon-de-bosses.jpg', must: /jambon|bosses|prosciutt/i },
  { query: 'carnevale valdostano maschera', dest: 'public/cultura/carnival.jpg', must: /carnaval|carnival|masch|coumba|landzette/i },
  { query: 'processione Oropa Biella', dest: 'public/cultura/oropa-procession.jpg', must: /oropa|procession|pellegrin/i },
  { query: 'Coumba freida landzette costume', dest: 'public/cultura/coumba-freida.jpg', must: /coumba|landzette|freida/i },
  { query: 'fifre tamburo Valle d Aoste', dest: 'public/cultura/fifres.jpg', must: /fifr|tambur|flûte|flute/i },
  { query: 'costume traditionnel Vallée Aoste folklore', dest: 'public/cultura/traditional-costumes.jpg', must: /costume|tracht|folklor/i },
  { query: 'transumanza alpeggio mucche Valle Aosta', dest: 'public/cultura/transhumance.jpg', must: /transhum|alpage|alpegg|mucche|vache|bestiame|pastor/i },
  { query: 'Foire Saint-Ours Aoste bancarelle', dest: 'public/cultura/saint-ours-fair.jpg', must: /saint.?ours|san.?orso|foire|fiera|aoste|aosta/i },
  { query: 'costume walser Gressoney tradizionale', dest: 'public/cultura/traditions-divider.jpg', must: /costume|walser|dress|tracht/i },
  { query: 'Seupa valpellinentze zuppa', dest: 'public/cultura/seupa-valpellinentze.jpg', must: /seupa|soupe|zuppa|valpell/i },
  { query: 'Picotin fromage chèvre Aosta', dest: 'public/cultura/picotin.jpg', must: /picotin|fromage|cheese|capra/i },
  { query: 'Enfer Arvier vino rosso', dest: 'public/cultura/enfer-d-arvier.jpg', must: /enfer|arvier|vin|wine/i },
  { query: 'Jambon cru tranche prosciutto', dest: 'public/cultura/jambon-food.jpg', must: /jambon|prosciutt|ham|crudo/i },
];

const BAD = /\.svg|logo|coat of arms|stemma|flag|bandiera|map|mappa|carte|locator|icon|diagram|schema/i;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchRetry(url) {
  for (let i = 0; i < 6; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429 || res.status === 503) {
      await sleep(2500 * (i + 1));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  }
  throw new Error('rate limited');
}

async function search(query) {
  const url =
    'https://commons.wikimedia.org/w/api.php?format=json&origin=*' +
    '&action=query&generator=search&gsrnamespace=6&gsrlimit=15' +
    '&gsrsearch=' + encodeURIComponent(query) +
    '&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=1800';
  const res = await fetchRetry(url);
  const data = await res.json();
  return Object.values(data.query?.pages || {})
    .filter((p) => p.imageinfo?.[0])
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((p) => ({ title: p.title, ii: p.imageinfo[0] }));
}

function pick(cands, must) {
  for (const c of cands) {
    if (BAD.test(c.title)) continue;
    if (!/^image\/(jpeg|png|webp)$/.test(c.ii.mime || '')) continue;
    if ((c.ii.width || 0) < 800) continue;
    if (must && !must.test(c.title)) continue;
    return c;
  }
  return null;
}

function credit(ii) {
  const artist = (ii.extmetadata?.Artist?.value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .trim();
  const license = (ii.extmetadata?.LicenseShortName?.value || '').replace(/<[^>]*>/g, '').trim();
  return {
    credit: license ? `${artist} (${license})` : artist || 'Wikimedia Commons',
    source: ii.descriptionurl,
  };
}

async function run() {
  const report = [];
  for (const job of JOBS) {
    const abs = path.join(ROOT, job.dest);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    try {
      const cands = await search(job.query);
      const best = pick(cands, job.must);
      if (!best) {
        console.log(`✗ ${job.dest}: nessun match per "${job.query}"`);
        report.push({ ...job, status: 'no-match' });
      } else {
        const res = await fetchRetry(best.ii.thumburl || best.ii.url);
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(abs, buf);
        const meta = credit(best.ii);
        console.log(`✓ ${path.basename(job.dest)} ← ${best.title}`);
        report.push({ ...job, status: 'ok', title: best.title, ...meta, kb: (buf.length / 1024).toFixed(0) });
      }
    } catch (e) {
      console.log(`✗ ${job.dest}: ${e.message}`);
      report.push({ ...job, status: 'error', error: e.message });
    }
    await sleep(2000);
  }
  fs.writeFileSync(path.join(__dirname, 'topic-search-report.json'), JSON.stringify(report, null, 2));
  console.log(`\nOK: ${report.filter((r) => r.status === 'ok').length}/${JOBS.length}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
