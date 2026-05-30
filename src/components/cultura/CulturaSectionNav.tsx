import { MapPin, Landmark, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/cn';

const SECTIONS = [
  { id: 'valli', icon: MapPin, hash: '#valli' },
  { id: 'tradizioni', icon: Landmark, hash: '#tradizioni' },
  { id: 'cibo-vino', icon: UtensilsCrossed, hash: '#cibo-vino' },
] as const;

export default function CulturaSectionNav({
  labels,
  ariaLabel,
}: {
  labels: { valli: string; tradizioni: string; ciboVino: string };
  ariaLabel: string;
}) {
  const sectionLabels: Record<(typeof SECTIONS)[number]['id'], string> = {
    valli: labels.valli,
    tradizioni: labels.tradizioni,
    'cibo-vino': labels.ciboVino,
  };

  return (
    <nav
      aria-label={ariaLabel}
      className="sticky top-[4.5rem] z-30 border-b border-white/8 bg-ink/90 backdrop-blur-xl"
    >
      <div className="scrollbar-none mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 lg:px-10">
        {SECTIONS.map(({ id, icon: Icon, hash }) => (
          <a
            key={id}
            href={hash}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-full border border-transparent px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-snow/50 transition-all hover:border-white/10 hover:text-snow'
            )}
          >
            <Icon size={14} />
            {sectionLabels[id]}
          </a>
        ))}
      </div>
    </nav>
  );
}
