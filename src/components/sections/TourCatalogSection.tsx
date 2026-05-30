import TourCatalog, { type TourCatalogItem } from '@/components/TourCatalog';
import { countTrailsByTag } from '@/lib/trails';
import {
  TOUR_IDS,
  TOUR_TAGS,
  TOUR_HERO_IMAGES,
  TOUR_ACCENTS,
  TOUR_MESSAGE_KEYS,
  type TourId,
} from '@/lib/tours';
import { getTranslations } from 'next-intl/server';

export default async function TourCatalogSection() {
  const t = await getTranslations('Tour');

  const tours: TourCatalogItem[] = TOUR_IDS.map((id: TourId) => {
    const msgKey = TOUR_MESSAGE_KEYS[id];
    const tag = TOUR_TAGS[id];
    const stageCount = countTrailsByTag(tag);
    return {
      id,
      name: t(`${msgKey}.name`),
      subtitle: t(`${msgKey}.description`),
      image: TOUR_HERO_IMAGES[id],
      stageCount,
      badgeLabel:
        stageCount > 0
          ? t('badgeStages', { count: stageCount })
          : t('badgeSoon'),
      accent: TOUR_ACCENTS[id],
    };
  });

  return <TourCatalog tours={tours} />;
}
