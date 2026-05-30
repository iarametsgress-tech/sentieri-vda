'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowUpRight } from 'lucide-react';
import { trailImageBlurProps } from '@/lib/blur';
import type { TourId } from '@/lib/tours';

export type TourCatalogItem = {
  id: TourId;
  name: string;
  subtitle: string;
  image: string;
  stageCount: number;
  badgeLabel: string;
  accent: 'alpenglow' | 'ice' | 'emerald' | 'snow';
};

const accentBorder: Record<TourCatalogItem['accent'], string> = {
  alpenglow: 'border-alpenglow/20 hover:border-alpenglow/50',
  ice: 'border-ice/20 hover:border-ice/50',
  emerald: 'border-emerald-500/20 hover:border-emerald-500/40',
  snow: 'border-white/15 hover:border-white/35',
};

export default function TourCatalog({ tours }: { tours: TourCatalogItem[] }) {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-20 lg:grid-cols-2 lg:px-10 lg:gap-10">
      {tours.map((tour) => (
        <Link
          key={tour.id}
          href={`/tour/${tour.id}`}
          className={`group block overflow-hidden rounded-2xl border bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(0,0,0,0.45)] ${accentBorder[tour.accent]}`}
        >
          <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[2/1]">
            <Image
              src={tour.image}
              alt={tour.name}
              fill
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 640px"
              {...trailImageBlurProps(tour.image)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <span className="mb-3 inline-flex rounded-full border border-white/15 bg-ink/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-snow/70 backdrop-blur-sm">
                {tour.badgeLabel}
              </span>
              <h2 className="text-on-image-title font-display text-2xl tracking-tight text-snow lg:text-3xl">
                {tour.name}
              </h2>
              <p className="text-on-image-body mt-2 max-w-lg text-sm text-snow/75">
                {tour.subtitle}
              </p>
            </div>
            <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-ink/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <ArrowUpRight size={18} className="text-snow" />
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
