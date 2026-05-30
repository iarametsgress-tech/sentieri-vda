'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

/**
 * Hero cinematic riusabile: parallasse immagine/contenuto, titolo a comparsa
 * parola-per-parola, grana, scroll-cue. Rispetta prefers-reduced-motion.
 */
export default function CinematicHero({
  image,
  videoSrc,
  eyebrow,
  title,
  subtitle,
  credit,
  align = 'left',
  heightClass = 'h-[78vh] min-h-[560px]',
  priority = true,
}: {
  image: string;
  /** Video di sfondo opzionale (es. /video/hero.mp4). Fallback automatico all'immagine. */
  videoSrc?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  credit?: string;
  align?: 'left' | 'center';
  heightClass?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '22%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '12%']);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, reduce ? 1 : 0]);

  const isRemote = image.startsWith('http');
  const centered = align === 'center';

  return (
    <section ref={ref} className={`relative w-full overflow-hidden ${heightClass}`}>
      <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110 origin-center">
        <Image
          src={image}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
        {videoSrc && !reduce ? (
          <video
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={isRemote ? undefined : image}
            aria-hidden
            onCanPlay={() => setVideoReady(true)}
          >
            <source src={videoSrc} />
          </video>
        ) : null}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/15 via-45% to-ink/95" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/10 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        style={{ y: contentY, opacity }}
        className={`relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 lg:px-10 lg:pb-24 ${
          centered ? 'items-center text-center' : ''
        }`}
      >
        <p
          className="text-on-image-eyebrow mb-5 font-mono text-[11px] uppercase tracking-[0.35em] text-alpenglow"
        >
          {eyebrow}
        </p>

        <h1
          className={`text-on-image-title font-display text-display-lg text-snow ${centered ? 'max-w-4xl' : 'max-w-5xl'}`}
        >
          {title}
        </h1>

        {subtitle ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1, ease: 'easeOut' }}
            className={`text-on-image-body mt-5 text-lg font-light leading-relaxed text-snow/85 lg:text-xl ${
              centered ? 'max-w-2xl' : 'max-w-2xl'
            }`}
          >
            {subtitle}
          </motion.p>
        ) : null}
      </motion.div>

      {credit ? (
        <p className="pointer-events-none absolute bottom-4 right-5 z-10 font-mono text-[10px] text-snow/25">
          {credit}
        </p>
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center text-snow/55"
      >
        <motion.div animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
