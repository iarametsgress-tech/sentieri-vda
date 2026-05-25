'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/cn';

export default function LocaleSwitch({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (locale: 'it' | 'en') => {
    router.replace(pathname, { locale });
  };

  return (
    <div className="flex items-center gap-1 text-xs font-mono uppercase tracking-widest">
      {(['it', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={cn(
            'px-2 py-1 transition-colors',
            currentLocale === l
              ? 'text-alpenglow'
              : 'text-snow/40 hover:text-snow'
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
