'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function CounterStat({
  value,
  suffix = '',
  prefix = '',
  label,
  duration = 1600,
  valueClassName = 'font-display text-5xl tabular-nums tracking-tighter text-snow lg:text-7xl',
  labelClassName = 'text-snow/55',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  valueClassName?: string;
  labelClassName?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  // SSR e primo render mostrano SUBITO il valore reale (niente "0", niente flash).
  const [count, setCount] = useState(value);
  // Il count-up parte una sola volta, dal valore già mostrato, e solo se l'utente
  // non preferisce meno animazioni. Non riparte mai da 0 → nessun bug di caricamento.
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!isInView || animatedRef.current) return;
    animatedRef.current = true;
    if (
      typeof window === 'undefined' ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return; // resta sul valore, nessuna animazione
    }
    const startTime = performance.now();
    setCount(0);
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(value);
    };
    requestAnimationFrame(tick);
  }, [isInView, value, duration]);

  return (
    <div ref={ref} className="text-center">
      <p className={`${valueClassName} whitespace-nowrap`}>
        {prefix}
        {count.toLocaleString('it-IT')}
        <span className="text-alpenglow">{suffix}</span>
      </p>
      <p
        className={`mt-3 min-h-[1.25rem] font-mono text-xs uppercase tracking-[0.25em] ${labelClassName}`}
      >
        {label}
      </p>
    </div>
  );
}
