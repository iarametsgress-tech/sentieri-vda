'use client';

import { useEffect, useState } from 'react';
import { MapPin, Landmark, UtensilsCrossed, ScrollText } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/cn';

const SECTIONS = [
  { id: 'valli', icon: MapPin },
  { id: 'storia', icon: ScrollText },
  { id: 'tradizioni', icon: Landmark },
  { id: 'cibo-vino', icon: UtensilsCrossed },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

export default function CulturaSectionNav({
  labels,
  ariaLabel,
}: {
  labels: { valli: string; storia: string; tradizioni: string; ciboVino: string };
  ariaLabel: string;
}) {
  const sectionLabels: Record<SectionId, string> = {
    valli: labels.valli,
    storia: labels.storia,
    tradizioni: labels.tradizioni,
    'cibo-vino': labels.ciboVino,
  };

  const [active, setActive] = useState<SectionId>('valli');

  // Linea di progresso che cresce con lo scroll della pagina.
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Scroll-spy: evidenzia la sezione mentre la si attraversa.
  useEffect(() => {
    const els = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: SectionId) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav
      aria-label={ariaLabel}
      className="sticky top-[4.5rem] z-30 border-b border-white/8 bg-ink/90 backdrop-blur-xl"
    >
      <div className="scrollbar-none mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 lg:px-10">
        {SECTIONS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            aria-current={active === id ? 'true' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all',
              active === id
                ? 'border border-alpenglow/35 bg-alpenglow/15 text-alpenglow'
                : 'border border-transparent text-snow/50 hover:border-white/10 hover:text-snow',
            )}
          >
            <Icon size={14} />
            {sectionLabels[id]}
          </button>
        ))}
      </div>
      <motion.div
        aria-hidden
        style={{ scaleX: progressScaleX }}
        className="absolute bottom-0 left-0 right-0 h-px origin-left bg-gradient-to-r from-alpenglow via-ice to-alpenglow"
      />
    </nav>
  );
}
