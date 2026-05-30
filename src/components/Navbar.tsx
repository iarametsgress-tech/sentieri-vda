'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LocaleSwitch from './LocaleSwitch';
import { cn } from '@/lib/cn';

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('Nav');
  const tSite = useTranslations('Site');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Prefetch aggressivo: scarica i chunk JS al primo hover, non al click.
  const prefetch = useCallback(
    (href: string) => {
      router.prefetch(href as '/');
    },
    [router]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/sentieri', label: t('trails') },
    { href: '/alte-vie', label: t('alteVie') },
    { href: '/tour', label: 'Tour' },
    { href: '/rifugi', label: t('refuges') },
    { href: '/ambiente', label: t('ambiente') },
    { href: '/cultura', label: t('cultura') },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-white/8 bg-ink/85 shadow-[0_1px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl'
          : 'border-b border-white/4 bg-ink/50 backdrop-blur-md'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-block cursor-pointer font-display text-2xl tracking-tighter"
          >
            {tSite('name')}
            <span className="text-alpenglow">.</span>
          </motion.span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => {
            const isActive =
              pathname === l.href || pathname.startsWith(l.href + '/');
            return (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => prefetch(l.href)}
                onFocus={() => prefetch(l.href)}
                className="relative py-1 text-sm tracking-wide text-snow/65 transition-colors duration-200 hover:text-snow"
              >
                {l.label}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-alpenglow"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
          <LocaleSwitch currentLocale={locale} />
        </div>

        <button
          className="p-1 text-snow md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.div
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            <div className="flex flex-col gap-4 bg-ink/95 px-6 py-5">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => prefetch(l.href)}
                    className="font-display text-lg tracking-tight text-snow/80 transition-colors hover:text-snow"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-white/5 pt-2">
                <LocaleSwitch currentLocale={locale} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
