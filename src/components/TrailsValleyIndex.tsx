import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { getIndexableTrails } from '@/lib/trails';
import { getValleyHubHref } from '@/lib/hubs';
import { getTrailLocalizedName } from '@/lib/stage-utils';

/** Indice HTML crawlable: link testuali a tutti i sentieri indicizzabili, raggruppati per valle. */
export default async function TrailsValleyIndex({ locale }: { locale: string }) {
  const t = await getTranslations('Trails');
  const trails = getIndexableTrails();

  const byValley = new Map<string, typeof trails>();
  for (const trail of trails) {
    const valley = trail.valley?.trim() || '—';
    const list = byValley.get(valley) ?? [];
    list.push(trail);
    byValley.set(valley, list);
  }

  const valleys = [...byValley.entries()].sort((a, b) =>
    a[0].localeCompare(b[0], 'it'),
  );

  return (
    <section
      className="mt-20 border-t border-white/10 pt-14"
      aria-labelledby="trails-valley-index-heading"
    >
      <h2
        id="trails-valley-index-heading"
        className="font-display text-2xl tracking-tight text-snow mb-2 lg:text-3xl"
      >
        {t('indexByValleyTitle')}
      </h2>
      <p className="mb-10 max-w-2xl text-sm leading-relaxed text-snow/55">
        {t('indexByValleySubtitle', { count: trails.length })}
      </p>

      <div className="space-y-4">
        {valleys.map(([valley, valleyTrails]) => {
          const sorted = [...valleyTrails].sort((a, b) =>
            a.name_it.localeCompare(b.name_it, 'it'),
          );
          const hubHref =
            valley !== '—' ? getValleyHubHref(valley) : undefined;

          return (
            <details
              key={valley}
              className="group rounded-xl border border-white/10 bg-white/[0.02] open:bg-white/[0.03]"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-mono text-sm uppercase tracking-widest text-snow/80 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="inline-flex flex-wrap items-center gap-3">
                  {hubHref ? (
                    <Link
                      href={hubHref}
                      className="text-alpenglow hover:text-snow transition-colors"
                    >
                      {valley}
                    </Link>
                  ) : (
                    <span>{valley}</span>
                  )}
                  <span className="text-snow/45 normal-case tracking-normal font-sans text-xs">
                    {sorted.length} sentieri
                  </span>
                </span>
              </summary>
              <ul className="border-t border-white/5 px-5 py-4 columns-1 sm:columns-2 lg:columns-3 gap-x-8 text-sm">
                {sorted.map((trail) => (
                  <li key={trail.slug} className="mb-2 break-inside-avoid">
                    <Link
                      href={`/sentieri/${trail.slug}`}
                      className="text-snow/70 hover:text-alpenglow transition-colors leading-snug"
                    >
                      {getTrailLocalizedName(trail, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </section>
  );
}
