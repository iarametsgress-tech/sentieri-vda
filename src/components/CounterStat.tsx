'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function CounterStat({
  value,
  suffix = '',
  prefix = '',
  label,
  duration = 2000,
  valueClassName = 'font-display text-5xl tabular tracking-tighter text-snow lg:text-7xl',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  valueClassName?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
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
      <p className={valueClassName}>
        {prefix}
        {count.toLocaleString('it-IT')}
        <span className="text-alpenglow">{suffix}</span>
      </p>
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-snow/55">
        {label}
      </p>
    </div>
  );
}
