import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBrowseTrails } from '@/lib/trails';
import TrailsExplorer from '@/components/TrailsExplorer';
import SectionPageHero from '@/components/SectionPageHero';
import TrailHubExploreSection from '@/components/TrailHubExploreSection';
import AdSlot from '@/components/AdSlot';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';

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

export default async function TrailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { locale } = await params;
  const { tag } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('Trails');
  // Catalogo completo (curati + scheletro). Le descrizioni lunghe non servono
  // alla lista/filtri: le rimuoviamo per non spedire MB di JSON al client.
  const trails = getBrowseTrails().map((tr) => ({
    ...tr,
    description_it: '',
    description_en: '',
    description_fr: '',
    description_de: '',
    waypoints: undefined,
  }));

  return (
    <div>
      <SectionPageHero
        eyebrow={t('heroEyebrow')}
        title={t('title')}
        subtitle={t('heroSubtitle', { count: trails.length })}
        section="sentieri"
        locale={locale}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
        <AdSlot slot="header-billboard" className="mb-12" />
        <TrailHubExploreSection locale={locale} />
        <TrailsExplorer trails={trails} initialTag={tag} />
      </div>
    </div>
  );
}
