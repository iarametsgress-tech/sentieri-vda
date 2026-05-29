'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

/** Unsplash — snow-capped peaks, editorial hero for scroll card */
const SHOWCASE_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80';

export default function HomeScrollShowcase() {
  const t = useTranslations('Home');

  return (
    <section className="overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-alpenglow">
              Valle d&apos;Aosta
            </p>
            <h2 className="font-display text-display-lg mx-auto max-w-5xl tracking-tighter text-snow">
              {t('exploreMapTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-snow/60">
              {t('exploreMapDescription')}
            </p>
          </>
        }
      >
        <Image
          src={SHOWCASE_IMAGE}
          alt="Creste alpine innevate in Valle d'Aosta"
          height={720}
          width={1400}
          className="mx-auto h-full rounded-2xl object-cover object-center"
          draggable={false}
          sizes="(max-width: 768px) 100vw, 80rem"
        />
      </ContainerScroll>
    </section>
  );
}
