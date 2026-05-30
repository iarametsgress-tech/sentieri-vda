'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { CulturaSectionId } from '@/lib/culture-types';

const HIGHLIGHT_CLASS = ['border-alpenglow/50', 'ring-2', 'ring-alpenglow/20'] as const;

function highlightElement(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add(...HIGHLIGHT_CLASS);
}

function CulturaDeepLinkScrollInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const valle = searchParams.get('valle');
    const tradizione = searchParams.get('tradizione');
    const item = searchParams.get('item');
    const town = searchParams.get('town');

    const timer = window.setTimeout(() => {
      if (valle) {
        document.getElementById('valli')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => {
          highlightElement(`valley-${valle}`);
          if (town) highlightElement(`town-${town}`);
        }, 300);
      } else if (tradizione) {
        document.getElementById('tradizioni')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => highlightElement(`tradition-${tradizione}`), 300);
      } else if (item) {
        document.getElementById('cibo-vino')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => highlightElement(`item-${item}`), 300);
      } else {
        const hash = window.location.hash.replace('#', '') as CulturaSectionId;
        if (hash === 'valli' || hash === 'tradizioni' || hash === 'cibo-vino') {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, [searchParams]);

  return null;
}

export default function CulturaDeepLinkScroll() {
  return (
    <Suspense fallback={null}>
      <CulturaDeepLinkScrollInner />
    </Suspense>
  );
}
