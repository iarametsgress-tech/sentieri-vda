import TrailCard from '@/components/TrailCard';
import { getRelatedTrails } from '@/lib/trails';
import type { Trail } from '@/lib/types';

interface RelatedTrailsProps {
  trail: Trail;
  excludeSlugs?: string[];
  labels: {
    title: string;
    subtitle: string;
  };
}

export default function RelatedTrails({
  trail,
  excludeSlugs = [],
  labels,
}: RelatedTrailsProps) {
  const related = getRelatedTrails(trail, 4, excludeSlugs);
  if (related.length === 0) return null;

  return (
    <section
      className="border-t border-white/5 bg-white/[0.01]"
      aria-labelledby="related-trails-heading"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <header className="mb-10 max-w-2xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-alpenglow">
            {trail.valley}
          </p>
          <h2
            id="related-trails-heading"
            className="font-display text-display-sm tracking-tighter text-snow"
          >
            {labels.title}
          </h2>
          <p className="mt-3 text-snow/60 leading-relaxed">{labels.subtitle}</p>
        </header>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, index) => (
            <TrailCard key={item.slug} trail={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
