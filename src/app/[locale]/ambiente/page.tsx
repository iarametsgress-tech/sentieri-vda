import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import { getFlora, getFauna } from '@/data/species';
import {
  getAllPeaks,
  getGeologySections,
  getHydrologySections,
  getPeaks4000,
} from '@/lib/environment';
import AmbienteExplorer from '@/components/AmbienteExplorer';
import CinematicHero from '@/components/CinematicHero';

// Video hero opzionale: attivo solo se il file è presente in public/video/.
const AMBIENTE_HERO_VIDEO = existsSync(join(process.cwd(), 'public', 'video', 'ambiente-hero.mp4'))
  ? '/video/ambiente-hero.mp4'
  : undefined;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Ambiente.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/ambiente`,
      languages: localeAlternatesAbsolute('/ambiente'),
    },
  };
}

export default async function AmbientePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Ambiente');
  const flora = getFlora();
  const fauna = getFauna();

  return (
    <div>
      <CinematicHero
        image="/species/aquila-reale-bg.jpg"
        videoSrc={AMBIENTE_HERO_VIDEO}
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        subtitle={t('heroSubtitle', { fauna: fauna.length, flora: flora.length })}
      />

      <AmbienteExplorer
        locale={locale}
        flora={flora}
        fauna={fauna}
        peaks={getAllPeaks()}
        geology={getGeologySections()}
        hydrology={getHydrologySections()}
        labels={{
          storyEyebrow: t('storyEyebrow'),
          storyTitle: t('storyTitle'),
          storySubtitle: t('storySubtitle'),
          storyAltitudeLabel: t('storyAltitudeLabel'),
          storyScrollHint: t('storyScrollHint'),
          storyFlora: t('storyFlora'),
          storyFauna: t('storyFauna'),
          navFloraFauna: t('navFloraFauna'),
          navMontagne: t('navMontagne'),
          navGeologia: t('navGeologia'),
          navIdrologia: t('navIdrologia'),
          peaksEyebrow: t('peaksEyebrow'),
          peaksTitle: t('peaksTitle'),
          peaksSubtitle: t('peaksSubtitle'),
          filterAll: t('filterAll'),
          filter4000: t('filter4000'),
          filterTrails: t('filterTrails'),
          geologyEyebrow: t('geologyEyebrow'),
          geologyTitle: t('geologyTitle'),
          hydrologyEyebrow: t('hydrologyEyebrow'),
          hydrologyTitle: t('hydrologyTitle'),
          readMore: t('readMore'),
          source: t('source'),
          count4000: t('count4000', { n: getPeaks4000().length }),
          secondarySummits: t('secondarySummits'),
          mainSummit: t('mainSummit'),
          onTrails: t('onTrails'),
          viewMassif: t('viewMassif'),
        }}
      />
    </div>
  );
}
