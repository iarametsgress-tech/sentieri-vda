import peaksJson from '@/data/environment/peaks.json';
import massifsJson from '@/data/environment/massifs.json';
import geologyJson from '@/data/environment/geology.json';
import hydrologyJson from '@/data/environment/hydrology.json';
import {
  PeakSchema,
  EnvironmentSectionSchema,
  MassifOverviewSchema,
  type Peak,
  type EnvironmentSection,
  type MassifGroup,
  type PeakFilter,
  type MassifOverview,
} from './environment-types';
import { pickLocalized, pickLocalizedOptional } from './locale-content';

const peaks = (peaksJson as unknown[]).map((p) => PeakSchema.parse(p));
const massifOverviews = (massifsJson as unknown[]).map((m) => MassifOverviewSchema.parse(m));
const geology = (geologyJson as unknown[]).map((s) => EnvironmentSectionSchema.parse(s));
const hydrology = (hydrologyJson as unknown[]).map((s) => EnvironmentSectionSchema.parse(s));

/** Alias nomi vette nelle schede sentiero → id catalogo */
const PEAK_NAME_ALIASES: Record<string, string> = {
  'monte rosa': 'monte-rosa-dufour',
  'monte bianco': 'mont-blanc',
  'mont blanc': 'mont-blanc',
  'gran combin': 'grand-combin',
  'grand combin': 'grand-combin',
  'combin de grafeneire': 'grand-combin',
  'mont velan': 'mont-velan',
  'mont vélan': 'mont-velan',
  'dome de rutor': 'dome-rutor',
  'dôme de rutor': 'dome-rutor',
  lyskamm: 'lyskamm',
  'punta gnifetti': 'gnifetti',
  'punta parrot': 'parrotspitze',
  'punta nordend': 'nordend',
  'punta zumstein': 'zumstein',
  'piramide vincent': 'piramide-vincent',
  'corno nero': 'corno-nero-rosa',
  'punta giordani': 'punta-giordani',
  "dent d'herens": 'dent-herens',
};

function normalizePeakName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function shortPeakName(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

function buildPeakNameIndex(): Map<string, string> {
  const map = new Map<string, string>();

  function register(name: string, id: string, onTrails: boolean) {
    const key = normalizePeakName(name);
    const existingId = map.get(key);
    if (!existingId) {
      map.set(key, id);
      return;
    }
    const existing = peaks.find((p) => p.id === existingId);
    if (existing && !existing.on_trails && onTrails) {
      map.set(key, id);
    }
  }

  for (const peak of peaks) {
    for (const raw of [peak.name_it, peak.name_en]) {
      register(raw, peak.id, peak.on_trails);
      register(shortPeakName(raw), peak.id, peak.on_trails);
    }
  }
  for (const [alias, id] of Object.entries(PEAK_NAME_ALIASES)) {
    map.set(normalizePeakName(alias), id);
  }
  return map;
}

const peakNameIndex = buildPeakNameIndex();

export function getAllPeaks(): Peak[] {
  return peaks;
}

export function getPeaks4000(): Peak[] {
  return peaks.filter((p) => p.is_4000);
}

export function getPeaksOnTrails(): Peak[] {
  return peaks.filter((p) => p.on_trails);
}

export function getPeakById(id: string): Peak | undefined {
  return peaks.find((p) => p.id === id);
}

export function resolvePeakIdFromName(name: string): string | null {
  const id = peakNameIndex.get(normalizePeakName(name));
  return id ?? null;
}

export function getMassifHref(massifGroupId: string): string {
  return `/ambiente/montagne/${massifGroupId}`;
}

export function getMassifGroupForPeakId(peakId: string): MassifGroup | undefined {
  const peak = getPeakById(peakId);
  if (!peak) return undefined;
  return getMassifGroups().find((g) => g.peaks.some((p) => p.id === peakId));
}

export function getMassifHrefForPeak(peakId: string): string | null {
  const group = getMassifGroupForPeakId(peakId);
  return group ? getMassifHref(group.id) : null;
}

export function getPeakHref(peakId: string): string {
  const massifHref = getMassifHrefForPeak(peakId);
  if (massifHref) return `${massifHref}#peak-${peakId}`;
  return `/ambiente?vetta=${peakId}#montagne`;
}

export function getGeologySections(): EnvironmentSection[] {
  return geology;
}

export function getHydrologySections(): EnvironmentSection[] {
  return hydrology;
}

export function getPeakName(peak: Peak, locale: string): string {
  return pickLocalized(locale, { it: peak.name_it, en: peak.name_en });
}

export function getPeakMassif(peak: Peak, locale: string): string {
  return pickLocalized(locale, { it: peak.massif_it, en: peak.massif_en });
}

export function getPeakDescription(peak: Peak, locale: string): string {
  return pickLocalized(locale, { it: peak.description_it, en: peak.description_en });
}

export function getSectionTitle(section: EnvironmentSection, locale: string): string {
  return pickLocalized(locale, { it: section.title_it, en: section.title_en });
}

export function getSectionEyebrow(section: EnvironmentSection, locale: string): string {
  return pickLocalized(locale, { it: section.eyebrow_it, en: section.eyebrow_en });
}

export function getSectionBody(section: EnvironmentSection, locale: string): string {
  return pickLocalized(locale, { it: section.body_it, en: section.body_en });
}

export function getSectionHighlights(section: EnvironmentSection, locale: string): string[] {
  const list = locale === 'it' ? section.highlights_it : section.highlights_en;
  return list ?? [];
}

export type LocalizedStat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  source: string;
};

/** Raccoglie e localizza le stat di un gruppo di sezioni (es. geologia, idrologia). */
export function getSectionGroupStats(
  sections: EnvironmentSection[],
  locale: string
): LocalizedStat[] {
  return sections.flatMap((section) =>
    (section.stats ?? []).map((stat) => ({
      value: stat.value,
      prefix: stat.prefix,
      suffix: stat.suffix,
      label: pickLocalized(locale, { it: stat.label_it, en: stat.label_en }),
      source: stat.source,
    }))
  );
}

export function getPeakWikiUrl(peak: Peak, locale: string): string | undefined {
  if (locale === 'it') return peak.wiki_it;
  return peak.wiki_en ?? peak.wiki_it;
}

function massifGroupId(massifIt: string): string {
  return normalizePeakName(massifIt).replace(/\s+/g, '-');
}

function peakMatchesFilter(peak: Peak, filter: PeakFilter): boolean {
  if (filter === '4000') return peak.is_4000;
  if (filter === 'trails') return peak.on_trails;
  return true;
}

/** Raggruppa le vette per catena montuosa; cima principale = quota più alta del massiccio. */
export function getMassifGroups(): MassifGroup[] {
  const byMassif = new Map<string, Peak[]>();

  for (const peak of peaks) {
    const key = peak.massif_it;
    const list = byMassif.get(key) ?? [];
    list.push(peak);
    byMassif.set(key, list);
  }

  const groups: MassifGroup[] = [];

  for (const [massifIt, members] of byMassif) {
    const sorted = [...members].sort((a, b) => b.elevation_m - a.elevation_m);
    const primary = sorted[0];
    const secondaries = sorted.slice(1);
    groups.push({
      id: massifGroupId(massifIt),
      massif_it: massifIt,
      massif_en: primary.massif_en,
      primary,
      secondaries,
      peaks: sorted,
    });
  }

  return groups.sort((a, b) => b.primary.elevation_m - a.primary.elevation_m);
}

export function filterMassifGroups(groups: MassifGroup[], filter: PeakFilter): MassifGroup[] {
  if (filter === 'all') return groups;

  return groups
    .filter((group) => group.peaks.some((p) => peakMatchesFilter(p, filter)))
    .map((group) => ({
      ...group,
      secondaries: group.secondaries.filter((p) => peakMatchesFilter(p, filter)),
      peaks: group.peaks.filter((p) => peakMatchesFilter(p, filter)),
    }));
}

export function getMassifOverview(id: string): MassifOverview | undefined {
  return massifOverviews.find((m) => m.id === id);
}

export function getMassifGroupById(id: string): MassifGroup | undefined {
  return getMassifGroups().find((g) => g.id === id);
}

export function getMassifOverviewText(overview: MassifOverview, locale: string): string {
  return pickLocalized(locale, { it: overview.overview_it, en: overview.overview_en });
}

export function getMassifHighlights(overview: MassifOverview, locale: string): string[] {
  const list = locale === 'it' ? overview.highlights_it : overview.highlights_en;
  return list ?? [];
}

export function getMassifSectionText(
  overview: MassifOverview,
  locale: string,
  field: 'geology' | 'history' | 'trails'
): string | undefined {
  const keyIt = `${field}_it` as keyof MassifOverview;
  const keyEn = `${field}_en` as keyof MassifOverview;
  return pickLocalizedOptional(locale, {
    it: overview[keyIt] as string | undefined,
    en: overview[keyEn] as string | undefined,
  });
}

export function getMassifMapCenter(
  overview: MassifOverview
): [number, number] | undefined {
  if (overview.map_center_lng == null || overview.map_center_lat == null) return undefined;
  return [overview.map_center_lng, overview.map_center_lat];
}

export function getPeakDetail(peak: Peak, locale: string): string {
  const detail = pickLocalizedOptional(locale, { it: peak.detail_it, en: peak.detail_en });
  return detail ?? getPeakDescription(peak, locale);
}
