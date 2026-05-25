import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('Footer');
  const tSite = useTranslations('Site');
  const tNav = useTranslations('Nav');

  return (
    <footer className="border-t border-white/5 mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="font-display text-3xl tracking-tighter">
            {tSite('name')}
            <span className="text-alpenglow">.</span>
          </p>
          <p className="mt-4 text-snow/50 text-sm leading-relaxed max-w-md">
            {tSite('tagline')}
          </p>
          <form className="mt-8 flex gap-2 max-w-sm">
            <input
              type="email"
              placeholder={t('newsletterPlaceholder')}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-snow placeholder:text-snow/30 focus:outline-none focus:border-alpenglow/50"
            />
            <button
              type="submit"
              className="bg-alpenglow text-ink px-4 py-2.5 rounded-full text-sm font-medium hover:opacity-90"
            >
              {t('newsletterCta')}
            </button>
          </form>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-snow/40 mb-4">
            Esplora
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/sentieri" className="text-snow/70 hover:text-snow">{tNav('trails')}</Link></li>
            <li><Link href="/alte-vie" className="text-snow/70 hover:text-snow">{tNav('alteVie')}</Link></li>
            <li><Link href="/rifugi" className="text-snow/70 hover:text-snow">{tNav('refuges')}</Link></li>
            <li><Link href="/flora-fauna" className="text-snow/70 hover:text-snow">{tNav('floraFauna')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-snow/40 mb-4">
            Info
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="text-snow/70 hover:text-snow">{tNav('about')}</Link></li>
            <li><Link href="/privacy" className="text-snow/70 hover:text-snow">Privacy</Link></li>
            <li><Link href="/cookie" className="text-snow/70 hover:text-snow">Cookie</Link></li>
            <li><Link href="/avvertenze" className="text-snow/70 hover:text-snow">Sicurezza</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 text-xs text-snow/40 space-y-2">
          <p>{t('disclaimer')}</p>
          <p>{t('credits')}</p>
          <p>© {new Date().getFullYear()} Sentieri VdA — {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
