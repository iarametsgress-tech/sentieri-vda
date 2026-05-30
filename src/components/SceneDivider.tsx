'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function SceneDivider({
  image,
  title,
  subtitle,
  credit,
}: {
  image: string;
  title: string;
  subtitle?: string;
  credit?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative h-[70vh] min-h-[420px] overflow-hidden my-0">
      <motion.div style={{ y }} className="absolute inset-0 scale-125">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/80" />
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <h2 className="font-display text-display-lg tracking-tighter text-snow max-w-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-lg text-snow/70 max-w-xl font-light">{subtitle}</p>
        )}
      </motion.div>
      {credit && (
        <p className="absolute bottom-3 right-4 text-[10px] text-snow/50 font-mono z-10">
          {credit}
        </p>
      )}
    </div>
  );
}
