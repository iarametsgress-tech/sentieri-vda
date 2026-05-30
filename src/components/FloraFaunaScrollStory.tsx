'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { Leaf, PawPrint, Mountain, ChevronDown } from 'lucide-react';

export type StoryScene = {
  id: string;
  image: string;
  name: string;
  scientific: string;
  kind: 'flora' | 'fauna';
  altMin: number;
  altMax: number;
  text: string;
};

export type StoryLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  altitudeLabel: string;
  scrollHint: string;
  flora: string;
  fauna: string;
};

/** Intervallo di progress assegnato a una scena, con dissolvenze ai bordi. */
function sceneRange(index: number, total: number) {
  const seg = 1 / total;
  const center = (index + 0.5) * seg;
  if (index === 0) {
    return { input: [0, center, center + seg], output: [1, 1, 0] };
  }
  if (index === total - 1) {
    return { input: [center - seg, center, 1], output: [0, 1, 1] };
  }
  return { input: [center - seg, center, center + seg], output: [0, 1, 0] };
}

function SceneBackground({
  scene,
  index,
  total,
  progress,
  reduce,
}: {
  scene: StoryScene;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean | null;
}) {
  const { input, output } = sceneRange(index, total);
  const opacity = useTransform(progress, input, output);
  const seg = 1 / total;
  const center = (index + 0.5) * seg;
  const scale = useTransform(
    progress,
    [center - seg, center + seg],
    reduce ? [1, 1] : [1.14, 1.02]
  );

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src={scene.image}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover"
          unoptimized={scene.image.startsWith('http')}
        />
      </motion.div>
    </motion.div>
  );
}

function ScenePanel({
  scene,
  index,
  total,
  progress,
  labels,
  reduce,
}: {
  scene: StoryScene;
  index: number;
  total: number;
  progress: MotionValue<number>;
  labels: StoryLabels;
  reduce: boolean | null;
}) {
  const { input, output } = sceneRange(index, total);
  const opacity = useTransform(progress, input, output);
  const seg = 1 / total;
  const center = (index + 0.5) * seg;
  const y = useTransform(
    progress,
    [center - seg, center, center + seg],
    reduce ? [0, 0, 0] : [40, 0, -40]
  );
  const isFlora = scene.kind === 'flora';
  const accent = isFlora ? 'text-alpenglow' : 'text-ice';

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex max-w-3xl flex-col px-6 pb-20 lg:pb-28"
    >
      <p className={`text-on-image-eyebrow mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] ${accent}`}>
        {isFlora ? <Leaf size={13} /> : <PawPrint size={13} />}
        {isFlora ? labels.flora : labels.fauna}
        <span className="text-snow/55">·</span>
        <span className="inline-flex items-center gap-1 text-snow/70">
          <Mountain size={12} />
          {scene.altMin.toLocaleString('it-IT')}–{scene.altMax.toLocaleString('it-IT')} m
        </span>
      </p>
      <h3 className="text-on-image-title font-display text-display-md tracking-tighter text-snow">
        {scene.name}
      </h3>
      <p className="text-on-image-muted mt-2 font-mono text-sm italic text-snow/65">
        {scene.scientific}
      </p>
      <p className="text-on-image-body mt-5 max-w-2xl text-base leading-relaxed text-snow/85 line-clamp-4 lg:text-lg">
        {scene.text}
      </p>
    </motion.div>
  );
}

export default function FloraFaunaScrollStory({
  scenes,
  labels,
}: {
  scenes: StoryScene[];
  labels: StoryLabels;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const total = scenes.length;
  const introOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);
  const railTop = useTransform(scrollYProgress, [0, 1], ['88%', '6%']);

  if (total === 0) return null;

  return (
    <section ref={ref} style={{ height: `${total * 70}vh` }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        {scenes.map((scene, i) => (
          <SceneBackground
            key={scene.id}
            scene={scene}
            index={i}
            total={total}
            progress={scrollYProgress}
            reduce={reduce}
          />
        ))}

        {/* Overlay leggibilità + grana */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/55" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Intro pinnata */}
        <motion.div
          style={{ opacity: introOpacity }}
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto flex max-w-3xl flex-col px-6 pt-24 lg:pt-28"
        >
          <p className="text-on-image-eyebrow mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-alpenglow">
            {labels.eyebrow}
          </p>
          <h2 className="text-on-image-title font-display text-display-lg tracking-tighter text-snow">
            {labels.title}
          </h2>
          <p className="text-on-image-body mt-4 max-w-xl text-base leading-relaxed text-snow/80 lg:text-lg">
            {labels.subtitle}
          </p>
        </motion.div>

        {/* Pannelli scena */}
        {scenes.map((scene, i) => (
          <ScenePanel
            key={scene.id}
            scene={scene}
            index={i}
            total={total}
            progress={scrollYProgress}
            labels={labels}
            reduce={reduce}
          />
        ))}

        {/* Rail della quota */}
        <div className="pointer-events-none absolute right-5 top-1/2 hidden h-[60vh] -translate-y-1/2 flex-col items-center sm:flex lg:right-8">
          <span className="mb-3 font-mono text-[9px] uppercase tracking-[0.25em] text-snow/55">
            {labels.altitudeLabel}
          </span>
          <div className="relative w-px flex-1 bg-snow/15">
            <motion.div
              style={{ top: railTop }}
              className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-ice shadow-[0_0_12px_rgba(91,192,235,0.8)]"
            />
          </div>
          <span className="mt-3 font-mono text-[9px] text-snow/55">+</span>
        </div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-snow/55"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
            {labels.scrollHint}
          </span>
          <motion.div
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
