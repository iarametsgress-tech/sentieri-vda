import {
  getAllValleys,
  getAllTraditions,
  getAllFoodWine,
  getValleyHref,
  getTownHref,
  getTraditionHref,
  getFoodWineHref,
} from '@/lib/culture';
import { getAllPeaks, getPeakHref, getMassifGroups, getMassifHref, resolvePeakIdFromName } from '@/lib/environment';
import { getPeakExternalUrl } from '@/lib/trail-links';
import { getAllRefuges, getRefugeDisplayName } from '@/lib/refuges';

export type TextSegment =
  | { type: 'text'; value: string }
  | { type: 'link'; value: string; href: string; external?: boolean };

interface LinkTerm {
  pattern: string;
  href: string;
  external?: boolean;
  priority: number;
}

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isWordChar(ch: string): boolean {
  return /[\p{L}\p{N}']/u.test(ch);
}

function buildLinkTerms(): LinkTerm[] {
  const terms: LinkTerm[] = [];
  const seen = new Set<string>();

  function add(label: string, href: string, external = false) {
    const trimmed = label.trim();
    if (trimmed.length < 3) return;
    const key = normalizeKey(trimmed);
    if (seen.has(key)) return;
    seen.add(key);
    terms.push({
      pattern: trimmed,
      href,
      external,
      priority: trimmed.length,
    });
  }

  for (const valley of getAllValleys()) {
    add(valley.name_it, getValleyHref(valley.id));
    add(valley.name_en, getValleyHref(valley.id));
    if (valley.name_fr) add(valley.name_fr, getValleyHref(valley.id));
    if (valley.name_de) add(valley.name_de, getValleyHref(valley.id));
    for (const lbl of valley.trail_labels) add(lbl, getValleyHref(valley.id));
    for (const town of valley.towns) {
      const href = getTownHref(valley.id, town.id);
      add(town.name_it, href);
      add(town.name_en, href);
      if (town.name_fr) add(town.name_fr, href);
      if (town.name_de) add(town.name_de, href);
    }
  }

  for (const item of getAllTraditions()) {
    add(item.title_it, getTraditionHref(item.id));
    add(item.title_en, getTraditionHref(item.id));
    if (item.title_fr) add(item.title_fr, getTraditionHref(item.id));
    if (item.title_de) add(item.title_de, getTraditionHref(item.id));
  }

  for (const item of getAllFoodWine()) {
    add(item.title_it, getFoodWineHref(item.id));
    add(item.title_en, getFoodWineHref(item.id));
    if (item.title_fr) add(item.title_fr, getFoodWineHref(item.id));
    if (item.title_de) add(item.title_de, getFoodWineHref(item.id));
  }

  for (const peak of getAllPeaks()) {
    add(peak.name_it, getPeakHref(peak.id));
    add(peak.name_en, getPeakHref(peak.id));
  }

  for (const group of getMassifGroups()) {
    add(group.massif_it, getMassifHref(group.id));
    add(group.massif_en, getMassifHref(group.id));
  }

  for (const refuge of getAllRefuges()) {
    for (const loc of ['it', 'en', 'fr', 'de'] as const) {
      add(getRefugeDisplayName(refuge.slug, loc), `/rifugi/${refuge.slug}`);
    }
  }

  const keywordAliases: { label: string; href: string }[] = [
    { label: 'Fontina', href: getFoodWineHref('fontina') },
    { label: 'Walser', href: getTraditionHref('walser-titsch') },
    { label: 'titsch', href: getTraditionHref('walser-titsch') },
    { label: 'Coumba freida', href: getTraditionHref('coumba-freida') },
    { label: "Sant'Orso", href: getTraditionHref('saint-ours') },
    { label: "Fiera di Sant'Orso", href: getTraditionHref('saint-ours') },
    { label: 'transumanza', href: getTraditionHref('transhumance') },
    { label: 'Transhumance', href: getTraditionHref('transhumance') },
    { label: 'Jambon de Bosses', href: getFoodWineHref('jambon-de-bosses') },
    { label: 'mocetta', href: getFoodWineHref('mocetta') },
    { label: 'Mocetta', href: getFoodWineHref('mocetta') },
    { label: 'seupa', href: getFoodWineHref('seupa-valpellinentze') },
    { label: 'Seupa valpellinentze', href: getFoodWineHref('seupa-valpellinentze') },
    { label: 'polenta concia', href: getFoodWineHref('polenta-concia') },
    { label: 'Carbonade', href: getFoodWineHref('carbonade') },
    { label: 'Lardo d\'Arnad', href: getFoodWineHref('lardo-arnad') },
    { label: 'Blanc de Morgex', href: getFoodWineHref('blanc-de-morgex') },
    { label: 'Enfer d\'Arvier', href: getFoodWineHref('enfer-d-arvier') },
    { label: 'Torrette', href: getFoodWineHref('torrette') },
    { label: 'Donnas Picotendro', href: getFoodWineHref('donnas-picotendro') },
    { label: 'Monte Rosa', href: getMassifHref('massiccio-del-monte-rosa') },
    { label: 'Monte Bianco', href: getMassifHref('massiccio-del-monte-bianco') },
    { label: 'Mont Blanc', href: getMassifHref('massiccio-del-monte-bianco') },
    { label: 'Cervino', href: getMassifHref('massiccio-del-cervino') },
    { label: 'Matterhorn', href: getMassifHref('massiccio-del-cervino') },
    { label: 'Gran Paradiso', href: getMassifHref('massiccio-del-gran-paradiso') },
    { label: 'Gran Combin', href: getMassifHref('massiccio-del-gran-combin') },
    { label: 'Mont Mars', href: getPeakHref('mont-mars') },
    { label: 'Processione di Oropa', href: getTraditionHref('oropa-procession') },
    { label: 'Fiera della Fontina', href: getTraditionHref('fontina-fair') },
    { label: 'Carnevale valdostano', href: getTraditionHref('carnival') },
    { label: 'Valpelline', href: getValleyHref('valpelline') },
    { label: 'Val Ferret', href: getValleyHref('val-ferret') },
    { label: 'Val Veny', href: getValleyHref('val-veny') },
    { label: 'Valtournenche', href: getValleyHref('valtournenche') },
    { label: 'Valsavarenche', href: getValleyHref('valsavarenche') },
    { label: 'Valgrisenche', href: getValleyHref('valgrisenche') },
    { label: 'Cogne', href: getValleyHref('val-di-cogne') },
    { label: 'Courmayeur', href: getValleyHref('val-ferret') },
    { label: 'Gressoney', href: getValleyHref('valle-del-lys') },
    { label: 'Champoluc', href: getValleyHref('valle-d-ayas') },
    { label: 'Perloz', href: getValleyHref('bassa-valle') },
    { label: 'Donnas', href: getValleyHref('bassa-valle') },
    { label: 'Pont-Saint-Martin', href: getValleyHref('bassa-valle') },
    { label: 'Saint-Rhémy-en-Bosses', href: getValleyHref('valle-gran-san-bernardo') },
    { label: 'Champorcher', href: getValleyHref('champorcher') },
  ];

  for (const { label, href } of keywordAliases) add(label, href);

  const extraPeaks = [
    'Grandes Jorasses',
    'Dente del Gigante',
    'Mont Dolent',
    'Mont Nery',
    'Grand Tournalin',
    'Becca di Nona',
    'Lyskamm',
    'Mont Vélan',
    'Mont Velan',
  ];
  for (const name of extraPeaks) {
    const peakId = resolvePeakIdFromName(name);
    if (peakId) add(name, getPeakHref(peakId));
    else {
      const wikiIt = getPeakExternalUrl(name, 'it');
      const wikiEn = getPeakExternalUrl(name, 'en');
      if (wikiIt) add(name, wikiIt, true);
      else if (wikiEn) add(name, wikiEn, true);
    }
  }

  return terms.sort((a, b) => b.priority - a.priority);
}

let cachedTerms: LinkTerm[] | null = null;

function getTerms(): LinkTerm[] {
  if (!cachedTerms) cachedTerms = buildLinkTerms();
  return cachedTerms;
}

function matchesAt(text: string, start: number, pattern: string): boolean {
  const slice = text.slice(start, start + pattern.length);
  if (slice.length !== pattern.length) return false;
  return normalizeKey(slice) === normalizeKey(pattern);
}

function hasWordBoundary(text: string, start: number, end: number): boolean {
  const before = start > 0 ? text[start - 1] : '';
  const after = end < text.length ? text[end] : '';
  if (before && isWordChar(before)) return false;
  if (after && isWordChar(after)) return false;
  return true;
}

/** Split plain text into linkable segments for React rendering. */
export function linkifyText(text: string, _locale: string): TextSegment[] {
  if (!text) return [{ type: 'text', value: '' }];

  const terms = getTerms();
  const segments: TextSegment[] = [];
  let i = 0;

  while (i < text.length) {
    let matched: LinkTerm | null = null;

    for (const term of terms) {
      if (!matchesAt(text, i, term.pattern)) continue;
      const end = i + term.pattern.length;
      if (!hasWordBoundary(text, i, end)) continue;
      matched = term;
      break;
    }

    if (matched) {
      segments.push({
        type: 'link',
        value: text.slice(i, i + matched.pattern.length),
        href: matched.href,
        external: matched.external,
      });
      i += matched.pattern.length;
      continue;
    }

    let plainEnd = i + 1;
    while (plainEnd < text.length) {
      let found = false;
      for (const term of terms) {
        if (matchesAt(text, plainEnd, term.pattern)) {
          const end = plainEnd + term.pattern.length;
          if (hasWordBoundary(text, plainEnd, end)) {
            found = true;
            break;
          }
        }
      }
      if (found) break;
      plainEnd++;
    }

    segments.push({ type: 'text', value: text.slice(i, plainEnd) });
    i = plainEnd;
  }

  return segments.length > 0 ? segments : [{ type: 'text', value: text }];
}
