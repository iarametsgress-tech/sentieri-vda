'use client';

import { motion, useInView, type Variants } from 'framer-motion';
import { useRef } from 'react';

type Variant = 'fade-up' | 'fade-in' | 'slide-right' | 'scale';

const VARIANTS: Record<Variant, Variants> = {
  'fade-up': {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0 },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: -24 },
    show: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1 },
  },
};

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.7,
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      variants={VARIANTS[variant]}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
