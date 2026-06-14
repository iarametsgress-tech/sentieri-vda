import { Link } from '@/i18n/routing';
import { ExternalLink, Mountain } from 'lucide-react';
import {
  formatRefugeLabel,
  getPeakLinkHref,
  getRefugeHref,
  getSpeciesHref,
  getValleyHrefFromLabel,
  getMunicipalityHref,
  getDifficultyHubHref,
  getThemeHubHref,
  isPeakInternalLink,
  resolveSpeciesId,
} from '@/lib/trail-links';
import { getLinkableThemeTagsForTrail } from '@/lib/hubs';
import type { Difficulty, NearbyPeak, Trail } from '@/lib/types';

function LinkedChip({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const className =
    'inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-snow/75 hover:text-snow hover:border-alpenglow/40 hover:bg-alpenglow/10 transition-colors capitalize';

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <ExternalLink size={12} className="opacity-60 shrink-0" aria-hidden />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function StaticChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-snow/75 capitalize">
      {children}
    </span>
  );
}

export function TrailFloraFaunaLinks({ slugs }: { slugs: string[] }) {
  return (
    <>
      {slugs.map((slug) => {
        const speciesId = resolveSpeciesId(slug);
        const label = slug.replace(/-/g, ' ');
        if (!speciesId) return <StaticChip key={slug}>{label}</StaticChip>;
        return (
          <LinkedChip key={slug} href={getSpeciesHref(speciesId)}>
            {label}
          </LinkedChip>
        );
      })}
    </>
  );
}

export function TrailDifficultyLink({
  difficulty,
  locale = 'it',
  children,
}: {
  difficulty: Difficulty;
  locale?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={getDifficultyHubHref(difficulty)}
      className="inline-flex hover:opacity-90 transition-opacity"
      title={
        locale === 'it'
          ? 'Altri sentieri con questa difficoltà'
          : locale === 'fr'
            ? 'Autres sentiers de cette difficulté'
            : locale === 'de'
              ? 'Weitere Wege mit dieser Schwierigkeit'
              : 'More trails at this difficulty'
      }
    >
      {children}
    </Link>
  );
}

export function TrailThemeTagLinks({
  trail,
  getLabel,
}: {
  trail: Trail;
  getLabel: (tag: string) => string;
}) {
  const tags = getLinkableThemeTagsForTrail(trail);
  if (tags.length === 0) return null;
  return (
    <>
      {tags.map((tag) => (
        <LinkedChip key={tag} href={getThemeHubHref(tag)}>
          {getLabel(tag)}
        </LinkedChip>
      ))}
    </>
  );
}

export function TrailRefugeLinks({ slugs, locale = 'it' }: { slugs: string[]; locale?: string }) {
  return (
    <>
      {slugs.map((slug) => {
        const href = getRefugeHref(slug);
        const label = formatRefugeLabel(slug, locale);
        if (!href) return <StaticChip key={slug}>{label}</StaticChip>;
        return (
          <LinkedChip key={slug} href={href}>
            {label}
          </LinkedChip>
        );
      })}
    </>
  );
}

export function TrailPeakLink({ peak, locale }: { peak: NearbyPeak; locale: string }) {
  const internal = isPeakInternalLink(peak.name);
  const href = getPeakLinkHref(peak.name, locale);
  const cardBody = (
    <>
      <p className="font-display text-sm text-snow mb-2 leading-tight flex items-start justify-between gap-1">
        {peak.name}
        {href ? (
          internal ? (
            <Mountain size={12} className="text-ice/70 shrink-0 mt-0.5" aria-hidden />
          ) : (
            <ExternalLink size={12} className="text-alpenglow/70 shrink-0 mt-0.5" aria-hidden />
          )
        ) : null}
      </p>
      <p className="font-display text-2xl text-ice tabular-nums">{peak.elevation_m} m</p>
      <p className="text-xs text-snow/55 font-mono mt-2">
        {locale === 'it' ? `${peak.distance_km} km (linea d'aria)` : `${peak.distance_km} km (as crow flies)`}
      </p>
    </>
  );

  if (!href) {
    return (
      <div className="snap-start shrink-0 w-[180px] bg-white/[0.02] border border-white/5 rounded-xl p-4">
        {cardBody}
      </div>
    );
  }

  if (internal) {
    return (
      <Link
        href={href}
        className="snap-start shrink-0 w-[180px] group"
        title={
          locale === 'it'
            ? 'Scheda montagna su Ambiente'
            : locale === 'fr'
              ? 'Fiche montagne sur Environnement'
              : locale === 'de'
                ? 'Bergprofil auf Umwelt'
                : 'Mountain profile on Environment'
        }
      >
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 group-hover:border-ice/40 group-hover:bg-ice/5 transition-colors h-full">
          {cardBody}
        </div>
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="snap-start shrink-0 w-[180px] group"
      title={locale === 'it' ? 'Approfondisci su Wikipedia' : 'Read more on Wikipedia'}
    >
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 group-hover:border-alpenglow/40 group-hover:bg-alpenglow/5 transition-colors h-full">
        {cardBody}
      </div>
    </a>
  );
}

export function TrailValleyLink({
  label,
  locale = 'it',
}: {
  label: string;
  locale?: string;
}) {
  const href = getValleyHrefFromLabel(label);
  if (!href) {
    return <span className="text-snow/80">{label}</span>;
  }
  return (
    <Link
      href={href}
      className="text-alpenglow hover:underline"
      title={
        locale === 'it'
          ? 'Sentieri in questa valle'
          : locale === 'fr'
            ? 'Sentiers dans cette vallée'
            : locale === 'de'
              ? 'Wege in diesem Tal'
              : 'Trails in this valley'
      }
    >
      {label}
    </Link>
  );
}

export function TrailMunicipalityLinks({
  names,
  locale = 'it',
}: {
  names: string[];
  locale?: string;
}) {
  return (
    <>
      {names.map((name, i) => {
        const href = getMunicipalityHref(name);
        return (
          <span key={name}>
            {i > 0 ? ', ' : null}
            {href ? (
              <Link
                href={href}
                className="text-alpenglow hover:underline"
                title={
                  locale === 'it'
                    ? 'Comune su Cultura'
                    : locale === 'fr'
                      ? 'Commune sur Culture'
                      : locale === 'de'
                        ? 'Gemeinde auf Kultur'
                        : 'Municipality on Culture'
                }
              >
                {name}
              </Link>
            ) : (
              name
            )}
          </span>
        );
      })}
    </>
  );
}

export function TrailRefugesSection({
  trail,
  label,
  locale = 'it',
  slugs,
}: {
  trail: Trail;
  label: string;
  locale?: string;
  slugs?: string[];
}) {
  const refugeSlugs = slugs ?? trail.refuges;
  if (refugeSlugs.length === 0) return null;
  return (
    <section>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-snow/55 mb-4">{label}</p>
      <div className="flex flex-wrap gap-2">
        <TrailRefugeLinks slugs={refugeSlugs} locale={locale} />
      </div>
    </section>
  );
}
