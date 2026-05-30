/** Sfondi e accenti per argomento — coerenti in tutto il sito. */
export const TOPIC_THEMES = {
  flora: {
    section: 'bg-emerald-950/30',
    card: 'border-emerald-500/20 bg-emerald-500/[0.06]',
    eyebrow: 'text-emerald-300',
    icon: 'text-emerald-400',
  },
  fauna: {
    section: 'bg-emerald-950/25',
    card: 'border-emerald-400/20 bg-emerald-400/[0.05]',
    eyebrow: 'text-emerald-300',
    icon: 'text-emerald-400',
  },
  mountains: {
    section: 'bg-slate-950/35',
    card: 'border-white/10 bg-white/[0.03]',
    eyebrow: 'text-alpenglow',
    icon: 'text-ice',
  },
  geology: {
    section: 'bg-stone-200 text-stone-900',
    card: 'border-stone-300 bg-white shadow-sm',
    eyebrow: 'text-stone-500',
    icon: 'text-stone-500',
  },
  water: {
    section: 'bg-sky-950/35',
    card: 'border-sky-500/20 bg-sky-500/[0.07]',
    eyebrow: 'text-sky-300',
    icon: 'text-sky-400',
  },
  culture: {
    section: 'bg-amber-950/25',
    card: 'border-amber-500/20 bg-amber-500/[0.06]',
    eyebrow: 'text-amber-300',
    icon: 'text-alpenglow',
  },
  traditions: {
    section: 'bg-violet-950/25',
    card: 'border-violet-500/20 bg-violet-500/[0.06]',
    eyebrow: 'text-violet-300',
    icon: 'text-violet-300',
  },
  food: {
    section: 'bg-orange-950/22',
    card: 'border-orange-500/20 bg-orange-500/[0.06]',
    eyebrow: 'text-orange-300',
    icon: 'text-alpenglow',
  },
  transport: {
    section: 'bg-slate-900/30',
    card: 'border-white/10 bg-white/[0.03]',
    eyebrow: 'text-alpenglow',
    icon: 'text-alpenglow',
  },
  warnings: {
    section: 'bg-amber-950/20',
    card: 'border-amber-500/25 bg-amber-500/[0.08]',
    eyebrow: 'text-amber-300',
    icon: 'text-amber-400',
  },
  safetyEmergency: {
    section: 'bg-yellow-950/15',
    card: 'border-yellow-400/35 bg-[#16140f]/95',
    eyebrow: 'text-yellow-300',
    icon: 'text-yellow-400',
  },
  safetyGeneral: {
    section: 'bg-slate-900/25',
    card: 'border-white/15 bg-[#111318]/95',
    eyebrow: 'text-ice',
    icon: 'text-ice',
  },
  safetyEquipment: {
    section: 'bg-alpenglow/[0.06]',
    card: 'border-alpenglow/35 bg-[#161310]/95',
    eyebrow: 'text-alpenglow',
    icon: 'text-alpenglow',
  },
  safetyWeather: {
    section: 'bg-sky-950/25',
    card: 'border-sky-400/30 bg-[#0f1419]/95',
    eyebrow: 'text-sky-300',
    icon: 'text-sky-400',
  },
  safetySignals: {
    section: 'bg-orange-950/20',
    card: 'border-orange-400/30 bg-[#16110f]/95',
    eyebrow: 'text-orange-300',
    icon: 'text-orange-400',
  },
  safetyRescue: {
    section: 'bg-red-950/18',
    card: 'border-red-400/30 bg-[#160f0f]/95',
    eyebrow: 'text-red-300',
    icon: 'text-red-400',
  },
  safetyFamily: {
    section: 'bg-emerald-950/18',
    card: 'border-emerald-400/30 bg-[#0f1412]/95',
    eyebrow: 'text-emerald-300',
    icon: 'text-emerald-400',
  },
  safetyContacts: {
    section: 'bg-ice/[0.04]',
    card: 'border-ice/30 bg-[#0f1216]/95',
    eyebrow: 'text-ice',
    icon: 'text-ice',
  },
} as const;

export type TopicThemeKey = keyof typeof TOPIC_THEMES;

export function topicClasses(key: TopicThemeKey) {
  return TOPIC_THEMES[key];
}
