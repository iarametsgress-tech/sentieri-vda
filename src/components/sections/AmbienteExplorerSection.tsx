import AmbienteExplorer from '@/components/AmbienteExplorer';
import { getFlora, getFauna } from '@/data/species';
import {
  getAllPeaks,
  getGeologySections,
  getHydrologySections,
  getParksSections,
  getPeaks4000,
} from '@/lib/environment';
import { getTranslations } from 'next-intl/server';

export default async function AmbienteExplorerSection({ locale }: { locale: string }) {
  const t = await getTranslations('Ambiente');
  const flora = getFlora();
  const fauna = getFauna();

  return (
    <AmbienteExplorer
      locale={locale}
      flora={flora}
      fauna={fauna}
      peaks={getAllPeaks()}
      geology={getGeologySections()}
      hydrology={getHydrologySections()}
      parks={getParksSections()}
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
        navParchi: t('navParchi'),
        parksEyebrow: t('parksEyebrow'),
        parksTitle: t('parksTitle'),
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
  );
}
