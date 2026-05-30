import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import LinkedText from '@/components/LinkedText';
import CulturaImageCredit from '@/components/cultura/CulturaImageCredit';
import { trailImageBlurProps } from '@/lib/blur';
import { topicClasses } from '@/lib/topic-themes';
import { cn } from '@/lib/cn';
import {
  getValleyName,
  getValleyEyebrow,
  getValleyDescription,
  getTownName,
  getTownDescription,
} from '@/lib/culture';
import type { Valley } from '@/lib/culture-types';

type Labels = {
  townsTitle: string;
  officialSite: string;
  source: string;
};

export default function CulturaValleyCard({
  valley,
  locale,
  labels,
  priority = false,
}: {
  valley: Valley;
  locale: string;
  labels: Labels;
  priority?: boolean;
}) {
  return (
    <article
      id={`valley-${valley.id}`}
      className={cn(
        'scroll-mt-40 overflow-hidden rounded-2xl border transition-all',
        topicClasses('culture').card,
        'hover:border-white/20'
      )}
    >
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-5">
        <div className="relative aspect-[16/10] min-h-[200px] lg:col-span-2 lg:aspect-auto">
          <Image
            src={valley.image}
            alt={getValleyName(valley, locale)}
            fill
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 400px"
            {...trailImageBlurProps(valley.image)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent lg:bg-gradient-to-r" />
          <CulturaImageCredit item={valley} />
        </div>
        <div className="p-6 lg:col-span-3 lg:p-8">
          <p
            className={cn(
              'mb-2 font-mono text-[10px] uppercase tracking-[0.3em]',
              topicClasses('culture').eyebrow
            )}
          >
            {getValleyEyebrow(valley, locale)}
          </p>
          <h3 className="mb-3 font-display text-2xl tracking-tight text-snow">
            {getValleyName(valley, locale)}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-snow/65">
            <LinkedText text={getValleyDescription(valley, locale)} locale={locale} />
          </p>
          {valley.towns.length > 0 ? (
            <div className="mb-4">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-snow/55">
                {labels.townsTitle}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {valley.towns.map((town) => (
                  <div
                    key={town.id}
                    id={`town-${town.id}`}
                    className="rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-colors"
                  >
                    <p className="mb-1 font-display text-base text-snow">
                      {getTownName(town, locale)}
                    </p>
                    <p className="mb-2 line-clamp-3 text-xs leading-relaxed text-snow/55">
                      <LinkedText text={getTownDescription(town, locale)} locale={locale} />
                    </p>
                    {town.official_url ? (
                      <a
                        href={town.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-alpenglow hover:text-snow"
                      >
                        {labels.officialSite}
                        <ExternalLink size={10} />
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-4 border-t border-white/8 pt-2">
            {valley.official_url ? (
              <a
                href={valley.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-alpenglow hover:text-snow"
              >
                {labels.officialSite}
                <ExternalLink size={12} />
              </a>
            ) : null}
            <p className="font-mono text-[10px] text-snow/50">
              {labels.source}: {valley.source}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
