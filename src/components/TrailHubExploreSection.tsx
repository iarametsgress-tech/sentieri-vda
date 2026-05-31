import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import {
  getAllDifficultyHubs,
  getAllSpeciesHubs,
  getAllThemeHubs,
  getAllValleyHubs,
  getSpeciesLocalizedName,
  humanizeThemeTag,
} from '@/lib/hubs';

export default async function TrailHubExploreSection({ locale }: { locale: string }) {
  const t = await getTranslations('TrailHubs');
  const tDiff = await getTranslations('TrailHubs.difficulty');
  const tTheme = await getTranslations('TrailHubs.theme');

  const valleys = getAllValleyHubs();
  const difficulties = getAllDifficultyHubs();
  const themes = getAllThemeHubs();
  const species = getAllSpeciesHubs().slice(0, 12);

  return (
    <section className="mb-16 border-t border-white/10 pt-14">
      <h2 className="font-display text-2xl tracking-tight text-snow mb-2 lg:text-3xl">
        {t('exploreTitle')}
      </h2>
      <p className="mb-10 max-w-2xl text-sm leading-relaxed text-snow/55">
        {t('exploreSubtitle')}
      </p>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <HubGroup title={t('byValley')}>
          {valleys.map((hub) => (
            <HubLink
              key={hub.slug}
              href={`/sentieri/valle/${hub.slug}`}
              label={hub.label}
              count={hub.count}
              countLabel={t('trailCount', { count: hub.count })}
            />
          ))}
        </HubGroup>

        <HubGroup title={t('byDifficulty')}>
          {difficulties.map((hub) => (
            <HubLink
              key={hub.slug}
              href={`/sentieri/difficolta/${hub.slug}`}
              label={tDiff(`labels.${hub.slug}`)}
              count={hub.count}
              countLabel={t('trailCount', { count: hub.count })}
            />
          ))}
        </HubGroup>

        <HubGroup title={t('byTheme')}>
          {themes.map((hub) => (
            <HubLink
              key={hub.slug}
              href={`/sentieri/tema/${hub.slug}`}
              label={
                tTheme.has(`tags.${hub.tag}`)
                  ? tTheme(`tags.${hub.tag}`)
                  : humanizeThemeTag(hub.tag)
              }
              count={hub.count}
              countLabel={t('trailCount', { count: hub.count })}
            />
          ))}
        </HubGroup>

        <HubGroup title={t('bySpecies')}>
          {species.map((hub) => (
            <HubLink
              key={hub.slug}
              href={`/sentieri/dove-vedere/${hub.slug}`}
              label={getSpeciesLocalizedName(hub.speciesId, locale)}
              count={hub.count}
              countLabel={t('trailCount', { count: hub.count })}
            />
          ))}
          {getAllSpeciesHubs().length > species.length && (
            <p className="mt-3 text-xs font-mono uppercase tracking-widest text-snow/45">
              {t('moreSpecies', { count: getAllSpeciesHubs().length - species.length })}
            </p>
          )}
        </HubGroup>
      </div>
    </section>
  );
}

function HubGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-alpenglow">
        {title}
      </h3>
      <ul className="flex flex-wrap gap-2">{children}</ul>
    </div>
  );
}

function HubLink({
  href,
  label,
  count,
  countLabel,
}: {
  href: string;
  label: string;
  count: number;
  countLabel: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-snow/75 transition-colors hover:border-alpenglow/40 hover:bg-alpenglow/10 hover:text-snow"
      >
        <span>{label}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-snow/45">
          {count}
        </span>
        <span className="sr-only">{countLabel}</span>
      </Link>
    </li>
  );
}
