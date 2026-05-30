import valleysJson from '@/data/culture/valleys.json';
import traditionsJson from '@/data/culture/traditions.json';
import foodWineJson from '@/data/culture/food-wine.json';
import {
  ValleySchema,
  TraditionSchema,
  FoodWineItemSchema,
  type Valley,
  type Tradition,
  type FoodWineItem,
} from './culture-types';
import { pickLocalized } from './locale-content';

const valleys = (valleysJson as unknown[]).map((v) => ValleySchema.parse(v));
const traditions = (traditionsJson as unknown[]).map((t) => TraditionSchema.parse(t));
const foodWine = (foodWineJson as unknown[]).map((f) => FoodWineItemSchema.parse(f));

/** Mappa etichette valle nei sentieri → id catalogo */
const VALLEY_ALIASES: Record<string, string> = {
  'val ferret': 'val-ferret',
  'val veny': 'val-veny',
  valtournenche: 'valtournenche',
  'valtournenche — val saint-barthélemy': 'valtournenche',
  'valle del lys': 'valle-del-lys',
  'valle di gressoney': 'valle-del-lys',
  'valle di gressoney — valle d\'ayas': 'valle-d-ayas',
  'valle d\'ayas': 'valle-d-ayas',
  valpelline: 'valpelline',
  'valpelline — conca di by': 'valpelline',
  'val di cogne': 'val-di-cogne',
  valsavarenche: 'valsavarenche',
  valgrisenche: 'valgrisenche',
  'val di rhêmes': 'val-di-rhemes',
  'val di rhemes': 'val-di-rhemes',
  'la thuile': 'la-thuile',
  'bassa valle': 'bassa-valle',
  'bassa valle — mont mars': 'bassa-valle',
  'valle del gran san bernardo': 'valle-gran-san-bernardo',
  champorcher: 'champorcher',
};

/** Comuni → valle di appartenenza */
const TOWN_TO_VALLEY: Record<string, string> = {
  courmayeur: 'val-ferret',
  'la salle': 'val-ferret',
  'la thuile': 'la-thuile',
  valtournenche: 'valtournenche',
  'gressoney-saint-jean': 'valle-del-lys',
  'gressoney-la-trinité': 'valle-del-lys',
  'gressoney-la-trinite': 'valle-del-lys',
  ayas: 'valle-d-ayas',
  champoluc: 'valle-d-ayas',
  antey: 'valle-d-ayas',
  'antey-saint-andré': 'valle-d-ayas',
  ollomont: 'valpelline',
  oyace: 'valpelline',
  bionaz: 'valpelline',
  cogne: 'val-di-cogne',
  valsavarenche: 'valsavarenche',
  valgrisenche: 'valgrisenche',
  'rhêmes-notre-dame': 'val-di-rhemes',
  'rhemes-notre-dame': 'val-di-rhemes',
  donnas: 'bassa-valle',
  'pont-saint-martin': 'bassa-valle',
  perloz: 'bassa-valle',
  'saint-rhémy-en-bosses': 'valle-gran-san-bernardo',
  'saint-rhemy-en-bosses': 'valle-gran-san-bernardo',
  etroubles: 'valle-gran-san-bernardo',
  champorcher: 'champorcher',
  issime: 'valle-del-lys',
  torgnon: 'valtournenche',
};

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildValleyLabelIndex(): Map<string, string> {
  const map = new Map<string, string>();
  for (const valley of valleys) {
    map.set(normalizeKey(valley.name_it), valley.id);
    map.set(normalizeKey(valley.name_en), valley.id);
    for (const label of valley.trail_labels) {
      map.set(normalizeKey(label), valley.id);
    }
  }
  for (const [alias, id] of Object.entries(VALLEY_ALIASES)) {
    map.set(normalizeKey(alias), id);
  }
  return map;
}

const valleyLabelIndex = buildValleyLabelIndex();

export function getAllValleys(): Valley[] {
  return valleys;
}

export function getValleyById(id: string): Valley | undefined {
  return valleys.find((v) => v.id === id);
}

export function resolveValleyId(label: string): string | null {
  return valleyLabelIndex.get(normalizeKey(label)) ?? null;
}

export function getCulturaHref(): string {
  return '/cultura';
}

export function getValleyHref(valleyId: string): string {
  return `/cultura?valle=${valleyId}#valli`;
}

export function getValleyHrefFromLabel(label: string): string | null {
  const id = resolveValleyId(label);
  return id ? getValleyHref(id) : null;
}

export function getTownHref(valleyId: string, townId: string): string {
  return `/cultura?valle=${valleyId}#town-${townId}`;
}

export function resolveTownValleyId(townName: string): { valleyId: string; townId?: string } | null {
  const key = normalizeKey(townName);
  const valleyId = TOWN_TO_VALLEY[key];
  if (!valleyId) return null;
  const valley = getValleyById(valleyId);
  const town = valley?.towns.find(
    (t) => normalizeKey(t.name_it) === key || normalizeKey(t.name_en) === key || t.id === key.replace(/\s+/g, '-')
  );
  return { valleyId, townId: town?.id };
}

export function getMunicipalityHref(name: string): string | null {
  const resolved = resolveTownValleyId(name);
  if (!resolved) return null;
  if (resolved.townId) return getTownHref(resolved.valleyId, resolved.townId);
  return getValleyHref(resolved.valleyId);
}

export function getAllTraditions(): Tradition[] {
  return traditions;
}

export function getTraditionById(id: string): Tradition | undefined {
  return traditions.find((t) => t.id === id);
}

export function getTraditionHref(id: string): string {
  return `/cultura?tradizione=${id}#tradizioni`;
}

export function getAllFoodWine(): FoodWineItem[] {
  return foodWine;
}

export function getFoodWineById(id: string): FoodWineItem | undefined {
  return foodWine.find((f) => f.id === id);
}

export function getFoodWineHref(id: string): string {
  return `/cultura?item=${id}#cibo-vino`;
}

export function getValleyName(valley: Valley, locale: string): string {
  return pickLocalized(locale, { it: valley.name_it, en: valley.name_en, fr: valley.name_fr, de: valley.name_de });
}

export function getValleyEyebrow(valley: Valley, locale: string): string {
  return pickLocalized(locale, { it: valley.eyebrow_it, en: valley.eyebrow_en, fr: valley.eyebrow_fr, de: valley.eyebrow_de });
}

export function getValleyDescription(valley: Valley, locale: string): string {
  return pickLocalized(locale, { it: valley.description_it, en: valley.description_en, fr: valley.description_fr, de: valley.description_de });
}

export function getTownName(town: Valley['towns'][number], locale: string): string {
  return pickLocalized(locale, { it: town.name_it, en: town.name_en, fr: town.name_fr, de: town.name_de });
}

export function getTownDescription(town: Valley['towns'][number], locale: string): string {
  return pickLocalized(locale, { it: town.description_it, en: town.description_en, fr: town.description_fr, de: town.description_de });
}

export function getTraditionTitle(item: Tradition, locale: string): string {
  return pickLocalized(locale, { it: item.title_it, en: item.title_en, fr: item.title_fr, de: item.title_de });
}

export function getTraditionBody(item: Tradition, locale: string): string {
  return pickLocalized(locale, { it: item.body_it, en: item.body_en, fr: item.body_fr, de: item.body_de });
}

export function getFoodWineTitle(item: FoodWineItem, locale: string): string {
  return pickLocalized(locale, { it: item.title_it, en: item.title_en, fr: item.title_fr, de: item.title_de });
}

export function getFoodWineBody(item: FoodWineItem, locale: string): string {
  return pickLocalized(locale, { it: item.body_it, en: item.body_en, fr: item.body_fr, de: item.body_de });
}

/** Credito immagine (autore · licenza) + URL sorgente, se disponibili. */
export function getImageCredit(item: {
  image_credit?: string;
  image_source?: string;
}): { credit: string; source?: string } | null {
  if (!item.image_credit) return null;
  return { credit: item.image_credit, source: item.image_source };
}
