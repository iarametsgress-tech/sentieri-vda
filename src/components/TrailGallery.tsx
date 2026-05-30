'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { trailImageBlurProps } from '@/lib/blur';

export type GalleryImage = { src: string; alt: string; credit?: string | null };

export default function TrailGallery({
  images,
  label,
}: {
  images: GalleryImage[];
  label: string;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <section>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-snow/55 mb-4">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/8 bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-alpenglow"
            aria-label={img.alt}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 50vw, 280px"
              {...trailImageBlurProps(img.src)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-white/5 p-2 text-snow/70 hover:text-snow"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-white/5 p-2.5 text-snow/70 hover:text-snow sm:left-6"
                  aria-label="Previous"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-white/5 p-2.5 text-snow/70 hover:text-snow sm:right-6"
                  aria-label="Next"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <motion.figure
              key={images[index].src}
              initial={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              className="relative mx-4 flex max-h-[88vh] w-full max-w-5xl flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[70vh] w-full overflow-hidden rounded-xl">
                <Image
                  src={images[index].src}
                  alt={images[index].alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  {...trailImageBlurProps(images[index].src)}
                />
              </div>
              <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-snow/70">
                <span>{images[index].alt}</span>
                <span className="font-mono text-[11px] text-snow/55">
                  {images[index].credit ? `© ${images[index].credit} · ` : ''}
                  {index + 1} / {images.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
