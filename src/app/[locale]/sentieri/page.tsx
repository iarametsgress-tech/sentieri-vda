import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBrowseTrails, getBrowseTrailCount } from '@/lib/trails';
import TrailsExplorer from '@/components/TrailsExplorer';
import SectionPageHero from '@/components/SectionPageHero';
import TrailHubExploreSection from '@/components/TrailHubExploreSection';
import AdSlot from '@/components/AdSlot';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import type { Trail, BrowseTrailSummary } from '@/lib/types';

/** Campi necessari a card, filtri e ricerca — evita MB di JSON inutile al client. */
function toBrowseSummary(tr: Trail): BrowseTrailSummary {
  return {
    slug: tr.slug,
    name_it: tr.name_it,
    name_en: tr.name_en,
    name_fr: tr.name_fr,
    name_de: tr.name_de,
    shortDescription_it: tr.shortDescription_it,
    shortDescription_en: tr.shortDescription_en,
    shortDescription_fr: tr.shortDescription_fr,
    shortDescription_de: tr.shortDescription_de,
    difficulty: tr.difficulty,
    distance_km: tr.distance_km,
    elevation_gain_m: tr.elevation_gain_m,
    duration_hours: tr.duration_hours,
    valley: tr.valley,
    image: tr.image,
    hero_image: tr.hero_image,
    tags: tr.tags,
    start: tr.start,
    end: tr.end,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const titles: Record<string, string> = {
    it: "Tutti i sentieri della Valle d'Aosta",
    en: 'All Aosta Valley trails',
    fr: "Tous les sentiers de la Vallée d'Aoste",
    de: 'Alle Wanderwege im Aostatal',
  };
  const descriptions: Record<string, string> = {
    it: 'Catalogo completo dei sentieri valdostani con mappe, GPX e schede verificate — filtra per valle, difficoltà, tema e fauna.',
    en: 'Complete catalog of Aosta Valley trails with maps, GPX and verified guides — filter by valley, difficulty, theme and wildlife.',
    fr: 'Catalogue complet des sentiers valdôtaines avec cartes, GPX et fiches vérifiées — filtrez par vallée, difficulté, thème et faune.',
    de: 'Vollständiger Katalog der Wege im Aostatal mit Karten, GPX und geprüften Steckbriefen — nach Tal, Schwierigkeit, Thema und Fauna filtern.',
  };
  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    alternates: {
      canonical: `${SITE_URL}/${locale}/sentieri`,
      languages: localeAlternatesAbsolute('/sentieri'),
    },
  };
}

export default async function TrailsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Trails');
  const totalCount = getBrowseTrailCount();
  const trails = getBrowseTrails().map(toBrowseSummary);

  return (
    <div>
      <SectionPageHero
        eyebrow={t('heroEyebrow')}
        title={t('title')}
        subtitle={t('heroSubtitle', { count: totalCount })}
        section="sentieri"
        locale={locale}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
        <AdSlot slot="header-billboard" className="mb-12" />
        <TrailHubExploreSection locale={locale} />
        <TrailsExplorer trails={trails} totalCount={totalCount} />
      </div>
    </div>
  );
}
