'use client';

import React from 'react';
import Image from 'next/image';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

/** Unsplash — alpine ridgeline (verified CDN host in next.config) */
const DEMO_IMAGE =
  'https://images.unsplash.com/photo-1464822759844-d150baec013b?auto=format&fit=crop&w=1400&q=80';

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-[500px] pt-[1000px]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-snow">
              Unleash the power of <br />
              <span className="mt-1 text-4xl font-bold leading-none md:text-[6rem]">
                Scroll Animations
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={DEMO_IMAGE}
          alt="Alpine mountain ridge at sunrise"
          height={720}
          width={1400}
          className="mx-auto h-full rounded-2xl object-cover object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
