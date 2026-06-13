'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

// Foto Wikimedia Commons — Val Ferret con Monte Bianco
// Autore: Hairless Heart — CC BY-SA 4.0
const HERO_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Monte_Bianco_dalla_Val_Ferret.jpg/1280px-Monte_Bianco_dalla_Val_Ferret.jpg';

export default function Hero() {
  const t = useTranslations('Home');
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden"
    >
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 scale-110 origin-center"
      >
        <Image
          src={HERO_IMAGE}
          alt="Monte Bianco visto dalla Val Ferret, Courmayeur"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent via-40% to-ink/95" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/50 via-ink/10 to-transparent" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256'
            xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E
            %3CfeTurbulence type='fractalNoise' baseFrequency='0.9'
            numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E
            %3Crect width='100%25' height='100%25'
            filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 lg:px-10 lg:pb-32">
        {/* Static SSR block — visible at first paint without JS or web-font */}
        <div>
          <p className="text-on-image-eyebrow mb-6 font-mono text-[11px] uppercase tracking-[0.35em] text-alpenglow">
            {t('heroEyebrow')}
          </p>

          <h1 className="text-on-image-title font-display text-display-xl max-w-5xl pb-1 text-snow">
            {t('heroTitle')}
          </h1>
          <p className="text-on-image-eyebrow mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-snow/55">
            By Andrea Rama
          </p>
        </div>

        <motion.div style={{ y: contentY }}>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1, ease: 'easeOut' }}
            className="text-on-image-body mt-6 max-w-2xl text-lg font-light leading-relaxed text-snow/90 lg:text-xl"
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/sentieri"
              className="group inline-flex items-center gap-2 rounded-full bg-snow px-6 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:bg-alpenglow hover:shadow-[0_0_32px_rgba(212,165,116,0.4)]"
            >
              {t('heroCtaPrimary')}
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href="/alte-vie"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm text-snow backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/5"
            >
              {t('heroCtaSecondary')}
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="pointer-events-none absolute bottom-6 right-6 font-mono text-[10px] text-snow/25"
          >
            © Hairless Heart — CC BY-SA 4.0 / Wikimedia Commons
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{ opacity: scrollCueOpacity }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-snow/55"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
