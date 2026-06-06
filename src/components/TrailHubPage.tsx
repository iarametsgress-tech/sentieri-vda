import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';
import TrailCard from '@/components/TrailCard';
import { trailImageBlurProps } from '@/lib/blur';
import { computeTrailStats } from '@/lib/hubs';
import type { Trail } from '@/lib/types';

type Breadcrumb = { label: string; href?: string };

type TrailHubPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  trails: Trail[];
  heroImage: string;
  heroAlt: string;
  breadcrumbs: Breadcrumb[];
  jsonLd: object[];
  /** Riga "Per approfondire l'argomento:" con link alla sezione di dettaglio. */
  deepen?: { prefix: string; label: string; href: string };
};

export default function TrailHubPage({
  eyebrow,
  title,
  intro,
  trails,
  heroImage,
  heroAlt,
  breadcrumbs,
  jsonLd,
  deepen,
}: TrailHubPageProps) {
  const stats = computeTrailStats(trails);

  return (
    <div>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="relative min-h-[48vh] overflow-hidden lg:min-h-[54vh]">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            {...trailImageBlurProps(heroImage)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[48vh] max-w-7xl flex-col justify-end px-6 pb-12 pt-28 lg:min-h-[54vh] lg:px-10 lg:pb-16">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-xs font-mono uppercase tracking-widest text-snow/55">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="opacity-50" aria-hidden />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-snow transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-snow/80">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-alpenglow">
            {eyebrow}
          </p>
          <h1 className="font-display text-display-md mb-4 max-w-4xl tracking-tighter text-snow">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-snow/75 lg:text-lg">
            {intro}
          </p>
          {deepen && (
            <p className="mt-5 text-sm text-snow/70">
              {deepen.prefix}{' '}
              <Link
                href={deepen.href}
                className="font-medium text-alpenglow underline-offset-4 hover:underline"
              >
                {deepen.label}
              </Link>
            </p>
          )}
          {stats.count > 0 && (
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-snow/50">
              {stats.count} · {stats.minDistance.toFixed(1)}–{stats.maxDistance.toFixed(1)} km · +{stats.minGain}–{stats.maxGain} m
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {trails.map((trail, index) => (
            <TrailCard key={trail.slug} trail={trail} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
