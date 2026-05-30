import Image from 'next/image';
import CulturaImageCredit from '@/components/cultura/CulturaImageCredit';
import { FOOD_TYPE } from '@/components/cultura/cultura-constants';
import { trailImageBlurProps } from '@/lib/blur';
import { topicClasses } from '@/lib/topic-themes';
import { cn } from '@/lib/cn';
import { getFoodWineTitle, getFoodWineBody } from '@/lib/culture';
import type { FoodWineItem } from '@/lib/culture-types';

export default function CulturaFoodWineCard({
  item,
  locale,
}: {
  item: FoodWineItem;
  locale: string;
}) {
  const typeLabel = FOOD_TYPE[item.type];

  return (
    <article
      id={`item-${item.id}`}
      className={cn(
        'scroll-mt-40 overflow-hidden rounded-2xl border transition-colors hover:border-alpenglow/25',
        topicClasses('food').card
      )}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={item.image}
          alt={getFoodWineTitle(item, locale)}
          fill
          loading="lazy"
          className="object-cover"
          sizes="350px"
          {...trailImageBlurProps(item.image)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <span className="absolute right-3 top-3 rounded-full border border-ice/30 bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ice">
          {locale === 'it' ? typeLabel?.it : typeLabel?.en}
        </span>
        <CulturaImageCredit item={item} />
      </div>
      <div className="p-5">
        <h3 className="mb-2 font-display text-lg text-snow">{getFoodWineTitle(item, locale)}</h3>
        <p className="line-clamp-6 text-sm leading-relaxed text-snow/65">
          {getFoodWineBody(item, locale)}
        </p>
      </div>
    </article>
  );
}
