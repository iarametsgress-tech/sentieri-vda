'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/cn';

export default function CounterStat({
  value,
  suffix = '',
  prefix = '',
  label,
  duration = 2000,
  valueClassName = 'font-display text-5xl tabular tracking-tighter text-snow lg:text-7xl',
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
  // Init col valore finale: l'HTML server-side (e i client senza JS / i crawler)
  // mostrano il numero reale invece di "0". L'animazione count-up parte solo
  // dopo il mount, quando la sezione entra in viewport (progressive enhancement).
  const [count, setCount] = useState(value);

  useEffect(() => {
    if (!isInView) return;
    // Rispetta chi preferisce meno animazioni: nessun count-up, resta sul valore.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setCount(value);
      return;
    }
    const startTime = performance.now();
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
      <p className={cn(valueClassName, 'whitespace-nowrap tabular-nums')}>
        {prefix}
        {count.toLocaleString('it-IT')}
        <span className="text-alpenglow">{suffix}</span>
      </p>
      <p className={`mt-3 min-h-[1.25rem] font-mono text-xs uppercase tracking-[0.25em] ${labelClassName}`}>
        {label}
      </p>
    </div>
  );
}
