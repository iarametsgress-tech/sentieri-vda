'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('Home');

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden grain">
      <div className="absolute inset-0 animate-kenburns">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
      </div>

      {/* Cinematic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-10 flex flex-col justify-end pb-20 lg:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs uppercase tracking-[0.3em] text-alpenglow mb-6 font-mono"
        >
          {t('heroEyebrow')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-display-xl text-snow max-w-5xl"
        >
          {t('heroTitle')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-lg lg:text-xl text-snow/80 max-w-2xl leading-relaxed font-light"
        >
          {t('heroSubtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/sentieri"
            className="group inline-flex items-center gap-2 bg-snow text-ink px-6 py-3.5 rounded-full text-sm font-medium hover:bg-alpenglow transition-colors"
          >
            {t('heroCtaPrimary')}
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <Link
            href="/alte-vie"
            className="inline-flex items-center gap-2 text-snow border border-white/30 hover:border-white/70 px-6 py-3.5 rounded-full text-sm transition-colors"
          >
            {t('heroCtaSecondary')}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 right-6 text-xs font-mono uppercase tracking-widest text-snow/40"
      >
        Scroll ↓
      </motion.div>
    </section>
  );
}
