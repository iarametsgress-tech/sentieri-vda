'use client';

import type { LucideIcon } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import type { RefObject } from 'react';
import { cn } from '@/lib/cn';

type SectionScrollNavProps<T extends string> = {
  containerRef: RefObject<HTMLElement | null>;
  sections: { id: T; icon: LucideIcon }[];
  activeSection: T;
  sectionLabels: Record<T, string>;
  onNavigate: (id: T) => void;
  ariaLabel: string;
  activeClassName?: string;
  inactiveClassName?: string;
};

export default function SectionScrollNav<T extends string>({
  containerRef,
  sections,
  activeSection,
  sectionLabels,
  onNavigate,
  ariaLabel,
  activeClassName = 'bg-alpenglow/15 text-alpenglow border border-alpenglow/35',
  inactiveClassName = 'text-snow/50 hover:text-snow border border-transparent hover:border-white/10',
}: SectionScrollNavProps<T>) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <nav
      aria-label={ariaLabel}
      className="sticky top-[4.5rem] z-30 border-b border-white/8 bg-ink/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 lg:px-10 scrollbar-none">
        {sections.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all',
              activeSection === id ? activeClassName : inactiveClassName
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
