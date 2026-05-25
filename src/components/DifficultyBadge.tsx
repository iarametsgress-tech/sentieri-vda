import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import type { Difficulty } from '@/lib/types';

const STYLES: Record<Difficulty, string> = {
  T: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  E: 'bg-ice/20 text-ice border-ice/40',
  EE: 'bg-alpenglow/20 text-alpenglow border-alpenglow/40',
  EEA: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
  A: 'bg-red-500/20 text-red-300 border-red-400/40',
};

export default function DifficultyBadge({
  difficulty,
  full = false,
}: {
  difficulty: Difficulty;
  full?: boolean;
}) {
  const t = useTranslations('Difficulty');
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono backdrop-blur-sm',
        STYLES[difficulty]
      )}
    >
      <span className="font-semibold">{difficulty}</span>
      {full && <span className="opacity-80">{t(difficulty)}</span>}
    </span>
  );
}
