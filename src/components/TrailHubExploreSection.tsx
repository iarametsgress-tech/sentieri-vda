import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { getValleyById, getValleyName } from '@/lib/culture';
import { getCultureThemeLabel, getAllCultureThemeHubs } from '@/lib/culture-theme-hubs';
import {
  getAllDifficultyHubs,
  getAllSpeciesHubs,
  getAllValleyHubs,
  getExploreMassifLinks,
  getSpeciesLocalizedName,
} from '@/lib/hubs';
import { getSpeciesById } from '@/data/species';

export default async function TrailHubExploreSection({ locale }: { locale: string }) {
  const t = await getTranslations('TrailHubs');
  const tDiff = await getTranslations('TrailHubs.difficulty');

  const valleys = getAllValleyHubs();
  const difficulties = getAllDifficultyHubs();
  const cultureThemes = getAllCultureThemeHubs();
  const massifs = getExploreMassifLinks(locale);
  const species = getAllSpeciesHubs();
  const floraSpecies = species.filter(
    (hub) => getSpeciesById(hub.speciesId)?.kind === 'flora',
  );
  const faunaSpecies = species.filter(
    (hub) => getSpeciesById(hub.speciesId)?.kind === 'fauna',
  );

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
          {valleys.map((hub) => {
            const valley = getValleyById(hub.slug);
            const label = valley ? getValleyName(valley, locale) : hub.label;
            return (
              <HubLink
                key={hub.slug}
                href={`/sentieri/valle/${hub.slug}`}
                label={label}
                count={hub.count}
                countLabel={t('trailCount', { count: hub.count })}
              />
            );
          })}
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
          {cultureThemes.map((hub) => (
            <HubLink
              key={hub.slug}
              href={`/sentieri/tema/${hub.slug}`}
              label={getCultureThemeLabel(hub.themeId, locale)}
              count={hub.count}
              countLabel={t('trailCount', { count: hub.count })}
            />
          ))}
        </HubGroup>

        <HubGroup title={t('byMountain')}>
          {massifs.map((massif) => (
            <HubLink
              key={massif.id}
              href={massif.href}
              label={massif.label}
              count={massif.count}
              countLabel={
                massif.count != null ? t('trailCount', { count: massif.count }) : undefined
              }
            />
          ))}
        </HubGroup>

        <HubGroup title={t('byFlora')} className="lg:col-span-2">
          {floraSpecies.map((hub) => (
            <HubLink
              key={hub.slug}
              href={`/sentieri/dove-vedere/${hub.slug}`}
              label={getSpeciesLocalizedName(hub.speciesId, locale)}
              count={hub.count}
              countLabel={t('trailCount', { count: hub.count })}
            />
          ))}
        </HubGroup>

        <HubGroup title={t('byFauna')} className="lg:col-span-2">
          {faunaSpecies.map((hub) => (
            <HubLink
              key={hub.slug}
              href={`/sentieri/dove-vedere/${hub.slug}`}
              label={getSpeciesLocalizedName(hub.speciesId, locale)}
              count={hub.count}
              countLabel={t('trailCount', { count: hub.count })}
            />
          ))}
        </HubGroup>
      </div>
    </section>
  );
}

function HubGroup({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
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
  count?: number;
  countLabel?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-snow/75 transition-colors hover:border-alpenglow/40 hover:bg-alpenglow/10 hover:text-snow"
      >
        <span>{label}</span>
        {count != null && count > 0 && (
          <>
            <span className="font-mono text-[10px] uppercase tracking-widest text-snow/45">
              {count}
            </span>
            {countLabel && <span className="sr-only">{countLabel}</span>}
          </>
        )}
      </Link>
    </li>
  );
}
