'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

const LOCALES = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
] as const;

type LocaleCode = (typeof LOCALES)[number]['code'];

type LocaleSwitchProps = {
  currentLocale: string;
  /** Nel menu mobile usare inline: il pannello resta nel flusso e non viene tagliato da overflow-hidden */
  menuStyle?: 'dropdown' | 'inline';
};

export default function LocaleSwitch({
  currentLocale,
  menuStyle = 'dropdown',
}: LocaleSwitchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const active = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const switchTo = (locale: LocaleCode) => {
    router.replace(pathname, { locale });
    setOpen(false);
  };

  return (
    <div ref={ref} className={cn('relative', menuStyle === 'inline' && 'w-full')}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-snow/70 transition-colors hover:border-white/25 hover:text-snow',
          menuStyle === 'inline' && 'w-full justify-between',
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="flex items-center gap-2">
          <span>{active.flag}</span>
          <span>{active.code}</span>
        </span>
        <ChevronDown
          size={14}
          className={cn('shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className={cn(
            menuStyle === 'inline'
              ? 'mt-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] py-1'
              : 'absolute right-0 top-[calc(100%+8px)] z-[60] min-w-[11rem] overflow-hidden rounded-xl border border-white/10 bg-ink/95 py-1 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl',
          )}
        >
          {LOCALES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={currentLocale === l.code}
                onClick={() => switchTo(l.code)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.06]',
                  currentLocale === l.code ? 'text-alpenglow' : 'text-snow/75'
                )}
              >
                <span className="text-base">{l.flag}</span>
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
