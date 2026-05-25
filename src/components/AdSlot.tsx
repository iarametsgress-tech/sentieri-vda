'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

type SlotKey =
  | 'header-billboard'
  | 'sidebar-sticky'
  | 'in-content-mid'
  | 'footer-leaderboard'
  | 'affiliate-refuge';

/**
 * Mappa slot key → AdSense slot ID.
 * Dopo l'approvazione AdSense, sostituire con gli slot reali.
 */
const SLOT_IDS: Record<SlotKey, string> = {
  'header-billboard': '0000000001',
  'sidebar-sticky': '0000000002',
  'in-content-mid': '0000000003',
  'footer-leaderboard': '0000000004',
  'affiliate-refuge': '0000000005',
};

const SIZES: Record<SlotKey, string> = {
  'header-billboard': 'h-[90px] sm:h-[120px] w-full',
  'sidebar-sticky': 'h-[600px] w-[300px]',
  'in-content-mid': 'h-[280px] w-full',
  'footer-leaderboard': 'h-[90px] w-full',
  'affiliate-refuge': 'h-[120px] w-full',
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({
  slot,
  className,
}: {
  slot: SlotKey;
  className?: string;
}) {
  const adRef = useRef<HTMLModElement>(null);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const isProd = !!client && process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (!isProd || !adRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // silent
    }
  }, [isProd]);

  if (!isProd) {
    // Placeholder dev
    return (
      <div
        className={cn(
          SIZES[slot],
          'flex items-center justify-center border border-dashed border-white/15 bg-white/[0.02] text-snow/30 text-xs font-mono uppercase tracking-widest',
          className
        )}
        data-ad-slot={slot}
      >
        Ad · {slot}
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={cn('adsbygoogle block', SIZES[slot], className)}
      data-ad-client={client}
      data-ad-slot={SLOT_IDS[slot]}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
