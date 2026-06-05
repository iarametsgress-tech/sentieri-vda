import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/config';

/** Build hreflang map for all configured locales (relative paths) + x-default.
 *  x-default punta alla versione italiana (mercato primario), come raccomandato
 *  da Google per indicare la pagina di fallback agli utenti di altre lingue. */
export function localeAlternates(path = ''): Record<string, string> {
  const suffix = path.startsWith('/') ? path : path ? `/${path}` : '';
  const map = Object.fromEntries(
    routing.locales.map((locale) => [locale, `/${locale}${suffix}`])
  );
  map['x-default'] = `/${routing.defaultLocale}${suffix}`;
  return map;
}

/** Absolute URLs for sitemap / metadata. */
export function localeAlternatesAbsolute(path = ''): Record<string, string> {
  const relative = localeAlternates(path);
  return Object.fromEntries(
    Object.entries(relative).map(([locale, href]) => [locale, `${SITE_URL}${href}`])
  );
}

export function localeOpenGraph(locale: string): string {
  const map: Record<string, string> = {
    it: 'it_IT',
    en: 'en_US',
    fr: 'fr_FR',
    de: 'de_DE',
  };
  return map[locale] ?? 'en_US';
}

const META: Record<string, { title: string; description: string }> = {
  it: {
    title: "Sentieri Valle d'Aosta — Trekking, Alte Vie, Rifugi",
    description:
      "I sentieri della Valle d'Aosta raccontati con dati ufficiali, mappe interattive, fotografia. Alte Vie, Gran Paradiso, Monte Bianco, Cervino.",
  },
  en: {
    title: 'Aosta Valley Trails — Hiking, High Routes, Refuges',
    description:
      'The trails of the Aosta Valley with official data, interactive maps, photography. High Routes, Gran Paradiso, Mont Blanc, Matterhorn.',
  },
  fr: {
    title: "Sentiers Vallée d'Aoste — Randonnée, Hautes Routes, Refuges",
    description:
      "Les sentiers de la Vallée d'Aoste avec données officielles, cartes interactives et photographie. Hautes Routes, Gran Paradiso, Mont-Blanc, Cervin.",
  },
  de: {
    title: 'Aostatal Wege — Wandern, Hochrouten, Hütten',
    description:
      'Wanderwege im Aostatal mit offiziellen Daten, interaktiven Karten und Fotografie. Hochrouten, Gran Paradiso, Mont Blanc, Matterhorn.',
  },
};

export function localeSiteMeta(locale: string) {
  return META[locale] ?? META.en;
}
