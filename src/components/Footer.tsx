import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Mail, Instagram } from 'lucide-react';
import NewsletterForm from '@/components/NewsletterForm';
import { SITE_AUTHOR } from '@/lib/config';

const INSTAGRAM_URL = 'https://www.instagram.com/_ramets/';

export default function Footer() {
  const t = useTranslations('Footer');
  const tSite = useTranslations('Site');
  const tNav = useTranslations('Nav');

  return (
    <footer className="border-t border-white/5 mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Image
            src="/logo-full.webp"
            alt={tSite('name')}
            width={150}
            height={150}
            className="mb-3 h-20 w-auto"
          />
          <p className="font-display text-3xl tracking-tighter">
            {tSite('name')}
            <span className="text-alpenglow">.</span>
          </p>
          <p className="mt-4 text-snow/50 text-sm leading-relaxed max-w-md">
            {tSite('tagline')}
          </p>
          <div className="mt-8">
            <NewsletterForm
              variant="compact"
              placeholder={t('newsletterPlaceholder')}
              cta={t('newsletterCta')}
              successMessage={t('newsletterSuccess')}
              errorMessage={t('newsletterError')}
            />
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-snow/55 mb-4">
            {t('explore')}
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/sentieri" className="text-snow/70 hover:text-snow">{tNav('trails')}</Link></li>
            <li><Link href="/alte-vie" className="text-snow/70 hover:text-snow">{tNav('alteVie')}</Link></li>
            <li><Link href="/tour" className="text-snow/70 hover:text-snow">{tNav('tours')}</Link></li>
            <li><Link href="/rifugi" className="text-snow/70 hover:text-snow">{tNav('refuges')}</Link></li>
            <li><Link href="/ambiente" className="text-snow/70 hover:text-snow">{tNav('ambiente')}</Link></li>
            <li><Link href="/cultura" className="text-snow/70 hover:text-snow">{tNav('cultura')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-snow/55 mb-4">
            {t('info')}
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="text-snow/70 hover:text-snow">{tNav('progetto')}</Link></li>
            <li><Link href="/metodo" className="text-snow/70 hover:text-snow">{tNav('metodo')}</Link></li>
            <li><Link href="/privacy" className="text-snow/70 hover:text-snow">Privacy</Link></li>
            <li><Link href="/cookie" className="text-snow/70 hover:text-snow">Cookie</Link></li>
            <li><Link href="/avvertenze" className="text-snow/70 hover:text-snow">{tNav('sicurezza')}</Link></li>
          </ul>
        </div>
      </div>

      <div id="contatti" className="scroll-mt-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
          <p className="font-mono text-xs uppercase tracking-widest text-alpenglow mb-2">
            {t('contactsTitle')}
          </p>
          <p className="text-sm text-snow/60 mb-5 max-w-xl leading-relaxed">
            {t('contactsIntro')}
          </p>
          <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-8 text-sm">
            <li>
              <a
                href={`mailto:${SITE_AUTHOR.email}`}
                className="inline-flex items-center gap-2.5 text-snow/80 hover:text-alpenglow transition-colors"
              >
                <Mail size={16} aria-hidden />
                {SITE_AUTHOR.email}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-snow/80 hover:text-alpenglow transition-colors"
                aria-label={`${t('contactsInstagram')} @_ramets`}
              >
                <Instagram size={16} aria-hidden />
                <span>@_ramets</span>
                <span className="sr-only">({t('contactsInstagram')})</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 text-xs text-snow/55 space-y-2">
          <p>{t('disclaimer')}</p>
          <p>{t('credits')}</p>
          <p>© {new Date().getFullYear()} Sentieri VdA — {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
