'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import LocaleSwitch from './LocaleSwitch';
import { cn } from '@/lib/cn';

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('Nav');
  const tSite = useTranslations('Site');
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/sentieri', label: t('trails') },
    { href: '/alte-vie', label: t('alteVie') },
    { href: '/rifugi', label: t('refuges') },
    { href: '/flora-fauna', label: t('floraFauna') },
    { href: '/blog', label: t('blog') },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-ink/70 border-b border-white/5">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tighter">
          {tSite('name')}
          <span className="text-alpenglow">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm tracking-wide text-snow/70 hover:text-snow transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <LocaleSwitch currentLocale={locale} />
        </div>

        <button
          className="md:hidden text-snow"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div
        className={cn(
          'md:hidden overflow-hidden transition-all border-t border-white/5',
          open ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="px-6 py-4 flex flex-col gap-4 bg-ink">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-snow/80 hover:text-snow"
            >
              {l.label}
            </Link>
          ))}
          <LocaleSwitch currentLocale={locale} />
        </div>
      </div>
    </header>
  );
}
