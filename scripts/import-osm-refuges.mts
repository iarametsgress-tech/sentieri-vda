import { readFileSync, writeFileSync } from 'node:fs';
import { RefugeSchema } from '../src/lib/types';

const osm = JSON.parse(readFileSync('./scripts/_osm-refuges.json', 'utf8'));
const existing = JSON.parse(readFileSync('./src/data/refuges.json', 'utf8'));

// Valli (centroide lng,lat → etichette 4 lingue)
const VALLEYS: { c: [number, number]; it: string; en: string; fr: string; de: string }[] = [
  { c: [6.98, 45.86], it: 'Val Ferret', en: 'Val Ferret', fr: 'Val Ferret', de: 'Val Ferret' },
  { c: [6.86, 45.78], it: 'Val Veny', en: 'Val Veny', fr: 'Val Veny', de: 'Val Veny' },
  { c: [6.93, 45.68], it: 'La Thuile', en: 'La Thuile', fr: 'La Thuile', de: 'La Thuile' },
  { c: [7.0, 45.6], it: 'Valgrisenche', en: 'Valgrisenche', fr: 'Valgrisenche', de: 'Valgrisenche' },
  { c: [7.12, 45.56], it: 'Val di Rhêmes', en: 'Rhêmes Valley', fr: 'Val de Rhêmes', de: 'Rhêmes-Tal' },
  { c: [7.2, 45.54], it: 'Valsavarenche', en: 'Valsavarenche', fr: 'Valsavarenche', de: 'Valsavarenche' },
  { c: [7.34, 45.6], it: 'Val di Cogne', en: 'Cogne Valley', fr: 'Val de Cogne', de: 'Cogne-Tal' },
  { c: [7.22, 45.86], it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-Sankt-Bernhard-Tal' },
  { c: [7.45, 45.88], it: 'Valpelline', en: 'Valpelline', fr: 'Valpelline', de: 'Valpelline-Tal' },
  { c: [7.63, 45.9], it: 'Valtournenche', en: 'Valtournenche', fr: 'Valtournenche', de: 'Valtournenche' },
  { c: [7.71, 45.83], it: "Val d'Ayas", en: 'Ayas Valley', fr: "Vallée d'Ayas", de: 'Ayas-Tal' },
  { c: [7.84, 45.8], it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  { c: [7.57, 45.62], it: 'Valle di Champorcher', en: 'Champorcher Valley', fr: 'Vallée de Champorcher', de: 'Champorcher-Tal' },
  { c: [7.79, 45.62], it: 'Bassa Valle', en: 'Lower Valley', fr: 'Basse Vallée', de: 'Unteres Tal' },
];

function nearestValley(lng: number, lat: number) {
  let best = VALLEYS[0], bd = Infinity;
  for (const v of VALLEYS) {
    const d = (v.c[0] - lng) ** 2 + (v.c[1] - lat) ** 2;
    if (d < bd) { bd = d; best = v; }
  }
  return best;
}

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const existingSlugs = new Set(existing.map((r: any) => r.slug));
const existingCoords = existing.map((r: any) => [r.coords.lng, r.coords.lat]);
const TYPE_WORDS = /\b(rifugio|refuge|bivacco|bivouac|biwak|capanna|hut|posto tappa|dortoir)\b/g;
const nameKey = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(TYPE_WORDS, '').replace(/[^a-z0-9]+/g, ' ').trim();
const existingNameKeys = new Set(existing.map((r: any) => nameKey(r.name_it)));
function isDuplicate(lng: number, lat: number, name: string) {
  const k = nameKey(name);
  if (existingNameKeys.has(k)) return true;
  return existingCoords.some(([x, y]: number[]) => Math.abs(x - lng) < 0.006 && Math.abs(y - lat) < 0.006);
}

const out: any[] = [];
const usedSlugs = new Set<string>(existingSlugs);
let skippedNoEle = 0, skippedBounds = 0, dup = 0, invalid = 0;

for (const e of osm) {
  const tags = e.tags || {};
  const name = tags.name;
  if (!name) continue;
  const lat = e.lat ?? e.center?.lat;
  const lng = e.lon ?? e.center?.lon;
  if (typeof lat !== 'number' || typeof lng !== 'number') continue;
  if (lat < 45 || lat > 46 || lng < 6.5 || lng > 8) { skippedBounds++; continue; }
  const ele = parseInt(tags.ele, 10);
  if (!Number.isFinite(ele)) { skippedNoEle++; continue; }
  if (isDuplicate(lng, lat, name)) { dup++; continue; }

  const isBiv = tags.tourism === 'wilderness_hut';
  const type = isBiv ? 'bivacco' : 'rifugio';
  // "molti bivacchi e QUALCHE altro rifugio": rifugi solo se notevoli (Wikidata).
  const beds = parseInt(tags.capacity ?? tags.beds, 10);
  if (!isBiv && !tags.wikidata) continue;

  let slug = slugify(name);
  if (!slug) continue;
  let s = slug, n = 2;
  while (usedSlugs.has(s)) s = `${slug}-${n++}`;
  slug = s; usedSlugs.add(slug);

  const v = nearestValley(lng, lat);
  const bedsTxt = Number.isFinite(beds) ? beds : null;
  const website = (tags.website || tags['contact:website'] || '').startsWith('http')
    ? (tags.website || tags['contact:website']) : null;
  const phone = tags.phone || tags['contact:phone'] || null;
  const email = tags.email || tags['contact:email'] || null;

  const d = (typeLabel: Record<string, string>, openTxt: string) => ({
    it: `${typeLabel.it} a ${ele} m in ${v.it}, Valle d'Aosta.${bedsTxt ? ` Posti letto: ${bedsTxt}.` : ''} ${openTxt}`,
    en: `${typeLabel.en} at ${ele} m in ${v.en}, Aosta Valley.${bedsTxt ? ` Beds: ${bedsTxt}.` : ''} Data from OpenStreetMap; verify opening before setting out.`,
    fr: `${typeLabel.fr} à ${ele} m dans ${v.fr}, Vallée d'Aoste.${bedsTxt ? ` Couchages : ${bedsTxt}.` : ''} Données OpenStreetMap ; vérifier l'ouverture avant le départ.`,
    de: `${typeLabel.de} auf ${ele} m im ${v.de}, Aostatal.${bedsTxt ? ` Schlafplätze: ${bedsTxt}.` : ''} Daten aus OpenStreetMap; Öffnung vor dem Aufbruch prüfen.`,
  });
  const desc = isBiv
    ? d({ it: 'Bivacco', en: 'Bivouac', fr: 'Bivouac', de: 'Biwak' }, 'Ricovero non gestito, generalmente sempre aperto. Dati da OpenStreetMap.')
    : d({ it: 'Rifugio alpino', en: 'Alpine refuge', fr: 'Refuge alpin', de: 'Berghütte' }, 'Dati da OpenStreetMap; periodo di apertura e servizi da verificare.');

  const refuge = {
    slug,
    name_it: name, name_en: name, name_fr: name, name_de: name,
    type,
    coords: { lat, lng },
    elevation_m: ele,
    valley_it: v.it, valley_en: v.en, valley_fr: v.fr, valley_de: v.de,
    beds: bedsTxt,
    phone, email,
    website,
    description_it: desc.it, description_en: desc.en, description_fr: desc.fr, description_de: desc.de,
    images: [],
    trails: [],
    source: 'OpenStreetMap contributors',
  };

  const parsed = RefugeSchema.safeParse(refuge);
  if (!parsed.success) { invalid++; continue; }
  out.push(parsed.data);
}

const bivacchi = out.filter((r) => r.type === 'bivacco');
const rifugiAll = out
  .filter((r) => r.type === 'rifugio')
  .sort((a, b) => (b.beds ?? 0) - (a.beds ?? 0) || b.elevation_m - a.elevation_m);
const rifugi = rifugiAll.slice(0, 25); // "qualche altro rifugio"
const added = [...bivacchi, ...rifugi];
console.log(`Generati: bivacchi ${bivacchi.length}, rifugi notevoli ${rifugiAll.length} (aggiunti ${rifugi.length})`);
console.log(`Scartati — senza quota: ${skippedNoEle}, fuori bounds: ${skippedBounds}, duplicati: ${dup}, invalidi: ${invalid}`);

const merged = [...existing, ...added];
writeFileSync('./src/data/refuges.json', JSON.stringify(merged, null, 2) + '\n');
console.log(`refuges.json: ${existing.length} → ${merged.length}`);
