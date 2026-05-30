import Image from 'next/image';
import CulturaImageCredit from '@/components/cultura/CulturaImageCredit';
import { TRADITION_CATEGORY } from '@/components/cultura/cultura-constants';
import { trailImageBlurProps } from '@/lib/blur';
import { topicClasses } from '@/lib/topic-themes';
import { cn } from '@/lib/cn';
import { getTraditionTitle, getTraditionBody } from '@/lib/culture';
import type { Tradition } from '@/lib/culture-types';

export default function CulturaTraditionCard({
  item,
  locale,
}: {
  item: Tradition;
  locale: string;
}) {
  const cat = TRADITION_CATEGORY[item.category];
  const catLabel = locale === 'it' ? cat?.it : cat?.en;

  return (
    <article
      id={`tradition-${item.id}`}
      className={cn('scroll-mt-40 overflow-hidden rounded-2xl border', topicClasses('traditions').card)}
    >
      <div className="relative aspect-[16/9]">
        <Image
          src={item.image}
          alt={getTraditionTitle(item, locale)}
          fill
          loading="lazy"
          className="object-cover"
          sizes="400px"
          {...trailImageBlurProps(item.image)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-snow/80">
          {catLabel}
        </span>
        <CulturaImageCredit item={item} />
      </div>
      <div className="p-5">
        <h3 className="mb-3 font-display text-xl text-snow">{getTraditionTitle(item, locale)}</h3>
        <p className="text-sm leading-relaxed text-snow/65">{getTraditionBody(item, locale)}</p>
      </div>
    </article>
  );
}
