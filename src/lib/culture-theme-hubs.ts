import {
  getAllFoodWine,
  getAllTraditions,
  getFoodWineById,
  getFoodWineTitle,
  getTraditionById,
  getTraditionTitle,
  resolveValleyId,
} from '@/lib/culture';
import { getAllTrails } from '@/lib/trails';
import type { Trail } from '@/lib/types';

type CultureThemeMatcher = {
  id: string;
  /** Valli Cultura: sentieri il cui campo valley risolve a uno di questi id */
  valleyIds?: string[];
  /** Comuni (normalizzati) presenti in trail.municipalities */
  municipalities?: string[];
  /** Parole chiave nel testo del sentiero (IT/EN) */
  keywords?: string[];
  /** Tag espliciti in trails.json */
  tags?: string[];
};

/** Regole di associazione tema Cultura → sentieri (tradizioni + cibo/vino). */
const CULTURE_THEME_MATCHERS: CultureThemeMatcher[] = [
  {
    id: 'walser-titsch',
    tags: ['walser'],
    keywords: ['walser', 'titsch'],
    valleyIds: ['valle-del-lys', 'valle-d-ayas', 'valpelline'],
    municipalities: ['gressoney-saint-jean', 'gressoney-la-trinite', 'issime', 'perloz', 'ollomont'],
  },
  {
    id: 'fontina-fair',
    keywords: ['fiera della fontina', 'fontina fair', 'fontina'],
    municipalities: ['gressoney-saint-jean'],
  },
  {
    id: 'jambon-de-bosses',
    keywords: ['jambon de bosses', 'jambon-de-bosses'],
    valleyIds: ['valle-gran-san-bernardo'],
    municipalities: ['saint-rhemy-en-bosses', 'etroubles'],
  },
  {
    id: 'carnival',
    keywords: ['carnevale', 'carnival', 'carnaval'],
    municipalities: ['verres', 'pont-saint-martin', 'ayas', 'brusson'],
  },
  {
    id: 'oropa-procession',
    keywords: ['oropa', 'processione di oropa'],
    municipalities: ['fontainemore'],
    valleyIds: ['bassa-valle'],
  },
  {
    id: 'coumba-freida',
    keywords: ['coumba freida', 'landzette'],
    valleyIds: ['valle-gran-san-bernardo'],
    municipalities: ['saint-rhemy-en-bosses'],
  },
  {
    id: 'fifres',
    keywords: ['fifre', 'fifres'],
  },
  {
    id: 'traditional-costumes',
    keywords: ['costumi tradizionali', 'traditional costumes', 'costume walser'],
    valleyIds: ['valle-del-lys', 'valpelline'],
  },
  {
    id: 'transhumance',
    keywords: ['transumanza', 'transhumance', 'alpeggio', 'malga', 'pastori'],
    valleyIds: ['valle-del-lys', 'valle-d-ayas', 'valpelline', 'val-di-cogne', 'valsavarenche'],
  },
  {
    id: 'saint-ours',
    keywords: ["sant'orso", 'saint-ours', 'fiera di sant'],
    municipalities: ['aosta'],
    valleyIds: ['bassa-valle'],
  },
  {
    id: 'fontina',
    keywords: ['fontina'],
    valleyIds: ['valle-del-lys', 'valle-d-ayas', 'valpelline', 'val-di-cogne', 'valsavarenche', 'valgrisenche'],
  },
  {
    id: 'lardo-arnad',
    keywords: ["lardo d'arnad", 'lardo arnad'],
    municipalities: ['arnad'],
    valleyIds: ['bassa-valle'],
  },
  {
    id: 'mocetta',
    keywords: ['mocetta'],
  },
  {
    id: 'seupa-valpellinentze',
    keywords: ['seupa', 'seupa valpellinentze'],
    valleyIds: ['valpelline'],
    municipalities: ['oyace', 'ollomont', 'bionaz'],
  },
  {
    id: 'polenta-concia',
    keywords: ['polenta concia'],
  },
  {
    id: 'carbonade',
    keywords: ['carbonade'],
    valleyIds: ['bassa-valle', 'valle-del-lys'],
  },
  {
    id: 'caffe-valdostano',
    keywords: ['caffè valdostano', 'caffe valdostano', 'grolla'],
  },
  {
    id: 'picotin',
    keywords: ['picotin'],
    valleyIds: ['bassa-valle', 'valle-d-ayas', 'valgrisenche'],
  },
  {
    id: 'tegole',
    keywords: ['tegole'],
  },
  {
    id: 'blanc-de-morgex',
    keywords: ['blanc de morgex', 'prié blanc', 'prie blanc'],
    municipalities: ['morgex', 'la salle'],
    valleyIds: ['val-ferret', 'val-veny'],
  },
  {
    id: 'enfer-d-arvier',
    keywords: ["enfer d'arvier", 'enfer darvier'],
    municipalities: ['arvier'],
    valleyIds: ['bassa-valle'],
  },
  {
    id: 'torrette',
    keywords: ['torrette'],
    valleyIds: ['bassa-valle'],
    municipalities: ['aosta', 'donnas', 'pont-saint-martin'],
  },
  {
    id: 'donnas-picotendro',
    keywords: ['donnas', 'picotendro', 'nebbiolo'],
    municipalities: ['donnas', 'pont-saint-martin', 'perloz'],
    valleyIds: ['bassa-valle'],
  },
];

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function trailSearchText(trail: Trail): string {
  const parts = [
    trail.name_it,
    trail.name_en,
    trail.shortDescription_it,
    trail.shortDescription_en,
    trail.description_it,
    trail.description_en,
    trail.cultural_notes_it,
    trail.cultural_notes_en,
    trail.valley,
    ...trail.municipalities,
    ...trail.tags,
  ];
  return normalizeKey(parts.filter(Boolean).join(' '));
}

function municipalitySet(trail: Trail): Set<string> {
  return new Set(trail.municipalities.map((m) => normalizeKey(m)));
}

export function trailMatchesCultureTheme(trail: Trail, matcher: CultureThemeMatcher): boolean {
  if (matcher.tags?.some((tag) => trail.tags.includes(tag))) return true;

  const haystack = trailSearchText(trail);
  if (matcher.keywords?.some((kw) => haystack.includes(normalizeKey(kw)))) return true;

  const munis = municipalitySet(trail);
  if (matcher.municipalities?.some((m) => munis.has(normalizeKey(m)))) return true;

  const valleyId = resolveValleyId(trail.valley);
  if (valleyId && matcher.valleyIds?.includes(valleyId)) return true;

  return false;
}

export function getCultureThemeIds(): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const item of getAllTraditions()) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      ids.push(item.id);
    }
  }
  for (const item of getAllFoodWine()) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      ids.push(item.id);
    }
  }
  return ids;
}

export function getCultureThemeLabel(id: string, locale: string): string {
  const tradition = getTraditionById(id);
  if (tradition) return getTraditionTitle(tradition, locale);
  const food = getFoodWineById(id);
  if (food) return getFoodWineTitle(food, locale);
  return id.replace(/-/g, ' ');
}

function getMatcher(id: string): CultureThemeMatcher | undefined {
  return CULTURE_THEME_MATCHERS.find((m) => m.id === id);
}

export function getTrailsByCultureThemeId(themeId: string): Trail[] {
  const matcher = getMatcher(themeId);
  if (!matcher) return [];
  return getAllTrails()
    .filter((t) => trailMatchesCultureTheme(t, matcher))
    .sort((a, b) => a.name_it.localeCompare(b.name_it, 'it'));
}

export type CultureThemeHub = {
  slug: string;
  themeId: string;
  count: number;
  trails: Trail[];
};

export function getCultureThemeHubBySlug(slug: string): CultureThemeHub | undefined {
  const trails = getTrailsByCultureThemeId(slug);
  if (trails.length === 0) return undefined;
  return { slug, themeId: slug, count: trails.length, trails };
}

export function getAllCultureThemeHubs(): CultureThemeHub[] {
  return getCultureThemeIds()
    .map((id) => getCultureThemeHubBySlug(id))
    .filter((hub): hub is CultureThemeHub => Boolean(hub))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export function getCultureThemeHubHref(themeId: string): string {
  return `/sentieri/tema/${themeId}`;
}
