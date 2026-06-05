import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { SHOW_ALPHA_BANNER } from '@/lib/config';

export default async function AlphaBanner() {
  if (!SHOW_ALPHA_BANNER) return null;

  const t = await getTranslations('Home');

  return (
    <div
      role="status"
      className="border-b border-amber-600/40 bg-amber-400 text-ink"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center text-sm sm:gap-x-4 sm:text-[0.9375rem]">
        <span className="font-semibold tracking-tight">{t('alphaBannerProduction')}</span>
        <span className="hidden text-ink/50 sm:inline" aria-hidden>
          ·
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/85 sm:text-xs">
          {t('alphaBannerVersion')}
        </span>
        <span className="hidden text-ink/50 sm:inline" aria-hidden>
          ·
        </span>
        <Link
          href="/#contatti"
          className="font-semibold underline decoration-ink/40 underline-offset-[3px] transition-colors hover:text-ink/75 hover:decoration-ink/70"
        >
          {t('alphaBannerContacts')}
        </Link>
      </div>
    </div>
  );
}
