'use client';

import { useRef } from 'react';
import { ArrowRight, ArrowLeft, CalendarDays, ExternalLink } from 'lucide-react';

export type EventItem = {
  id: string;
  when: string;
  title: string;
  body: string;
  url?: string;
};

export default function HomeNewsEvents({
  events,
  labels,
}: {
  events: EventItem[];
  labels: { eyebrow: string; title: string; subtitle: string; more: string; prev: string; next: string };
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    let next = el.scrollLeft + dir * step;
    // wrap-around come nel carosello a freccia
    if (dir === 1 && next > el.scrollWidth - el.clientWidth - 8) next = 0;
    if (dir === -1 && el.scrollLeft <= 8) next = el.scrollWidth;
    el.scrollTo({ left: next, behavior: 'smooth' });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-ice">
            {labels.eyebrow}
          </p>
          <h2 className="font-display text-display-md tracking-tighter">{labels.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-snow/55">{labels.subtitle}</p>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={labels.prev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-snow/70 transition-colors hover:border-ice/50 hover:text-ice"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={labels.next}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-snow/70 transition-colors hover:border-ice/50 hover:text-ice"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {events.map((e) => {
            const Wrapper = e.url ? 'a' : 'div';
            return (
              <Wrapper
                key={e.id}
                data-card
                {...(e.url
                  ? { href: e.url, target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="group relative flex w-[280px] shrink-0 snap-start flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:-translate-y-1 hover:border-ice/30 sm:w-[320px]"
              >
                <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-ice/25 bg-ice/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ice">
                  <CalendarDays size={12} />
                  {e.when}
                </span>
                <h3 className="mb-2 font-display text-xl tracking-tight text-snow">{e.title}</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-snow/60">{e.body}</p>
                {e.url ? (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ice/80 group-hover:text-ice">
                    {labels.more}
                    <ExternalLink size={12} />
                  </span>
                ) : null}
              </Wrapper>
            );
          })}
        </div>
        {/* freccia in basso a destra, stile CourmayeurMontBlanc */}
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label={labels.next}
          className="absolute -bottom-2 right-2 flex h-12 w-12 items-center justify-center rounded-full border border-ice/40 bg-ink/90 text-ice shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur transition-transform hover:scale-110 sm:right-4"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
