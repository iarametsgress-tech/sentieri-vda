'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/routing';
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import {
  Leaf,
  Mountain,
  Layers,
  Droplets,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import type { Species } from '@/lib/species-types';
import type { Peak, EnvironmentSection, AmbienteSectionId, MassifGroup } from '@/lib/environment-types';
import {
  getPeakName,
  getPeakMassif,
  getPeakDescription,
  getPeakWikiUrl,
  getMassifGroups,
  filterMassifGroups,
  getMassifHref,
  getSectionTitle,
  getSectionEyebrow,
  getSectionBody,
  getSectionHighlights,
  getSectionGroupStats,
  type LocalizedStat,
} from '@/lib/environment';
import FloraFaunaExplorer from './FloraFaunaExplorer';
import CounterStat from './CounterStat';
import SceneDivider from './SceneDivider';

const SECTIONS: {
  id: AmbienteSectionId;
  icon: typeof Leaf;
}[] = [
  { id: 'flora-fauna', icon: Leaf },
  { id: 'montagne', icon: Mountain },
  { id: 'geologia', icon: Layers },
  { id: 'idrologia', icon: Droplets },
];

type PeakFilter = 'all' | '4000' | 'trails';

/** Massicci esclusi dalla visualizzazione (non iconici per questo contesto). */
const EXCLUDED_MASSIF_IDS = ['alpi-graie'];


interface AmbienteExplorerProps {
  locale: string;
  flora: Species[];
  fauna: Species[];
  peaks: Peak[];
  geology: EnvironmentSection[];
  hydrology: EnvironmentSection[];
  labels: {
    storyEyebrow: string;
    storyTitle: string;
    storySubtitle: string;
    storyAltitudeLabel: string;
    storyScrollHint: string;
    storyFlora: string;
    storyFauna: string;
    navFloraFauna: string;
    navMontagne: string;
    navGeologia: string;
    navIdrologia: string;
    peaksEyebrow: string;
    peaksTitle: string;
    peaksSubtitle: string;
    filterAll: string;
    filter4000: string;
    filterTrails: string;
    geologyEyebrow: string;
    geologyTitle: string;
    hydrologyEyebrow: string;
    hydrologyTitle: string;
    readMore: string;
    source: string;
    count4000: string;
    secondarySummits: string;
    mainSummit: string;
    onTrails: string;
    viewMassif: string;
  };
}

function StatBand({
  stats,
  sourcesLabel,
}: {
  stats: LocalizedStat[];
  sourcesLabel: string;
}) {
  if (stats.length === 0) return null;
  const sources = Array.from(new Set(stats.map((s) => s.source)));
  return (
    <ScrollReveal variant="scale" className="mb-12 rounded-2xl border border-white/8 bg-white/[0.02] px-6 py-8 lg:px-10 lg:py-10">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {stats.map((s) => (
          <CounterStat
            key={s.label}
            value={s.value}
            prefix={s.prefix}
            suffix={s.suffix}
            label={s.label}
            valueClassName="font-display text-4xl tabular tracking-tighter text-snow lg:text-5xl"
          />
        ))}
      </div>
      <p className="mt-8 border-t border-white/8 pt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-snow/35">
        {sourcesLabel}: {sources.join(' · ')}
      </p>
    </ScrollReveal>
  );
}

function EnvironmentBlock({
  section,
  locale,
  index,
}: {
  section: EnvironmentSection;
  locale: string;
  index: number;
}) {
  const highlights = getSectionHighlights(section, locale);
  const hasImage = Boolean(section.image);
  const imageAlt = locale === 'it' ? (section.image_alt_it ?? '') : (section.image_alt_en ?? '');
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden hover:border-white/14 transition-colors"
    >
      {hasImage && (
        <div className="relative w-full aspect-[16/7] overflow-hidden">
          <Image
            src={section.image!}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        </div>
      )}
      <div className="p-6 lg:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-alpenglow mb-2">
          {getSectionEyebrow(section, locale)}
        </p>
        <h3 className="font-display text-xl lg:text-2xl tracking-tight text-snow mb-4">
          {getSectionTitle(section, locale)}
        </h3>
        <p className="text-snow/70 leading-relaxed text-[15px] mb-5">
          {getSectionBody(section, locale)}
        </p>
        {highlights.length > 0 ? (
          <ul className="space-y-2">
            {highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2 text-sm text-snow/60 leading-snug"
              >
                <ChevronRight size={14} className="text-ice shrink-0 mt-0.5" />
                {h}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </motion.article>
  );
}

function MassifPeakCard({
  group,
  locale,
  viewMassif,
  highlightedPeakId,
}: {
  group: MassifGroup;
  locale: string;
  viewMassif: string;
  highlightedPeakId?: string | null;
}) {
  const { primary, secondaries } = group;
  const massifHref = getMassifHref(group.id);
  const isRemote = primary.image.startsWith('http');
  const massifLabel = getPeakMassif(primary, locale);
  const groupHighlighted =
    highlightedPeakId === primary.id ||
    secondaries.some((p) => p.id === highlightedPeakId);

  const reduce = useReducedMotion();
  const innerRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [4, -4]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-4, 4]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = innerRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.article
      id={`peak-${primary.id}`}
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      style={{ perspective: 1000 }}
      className={`group scroll-mt-40 rounded-2xl border bg-white/[0.02] transition-all hover:-translate-y-1 ${
        groupHighlighted
          ? 'border-ice/60 ring-2 ring-ice/30 shadow-lg shadow-ice/10'
          : 'border-white/10 hover:border-alpenglow/30 hover:shadow-lg hover:shadow-alpenglow/5'
      }`}
    >
      <motion.div
        ref={innerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="overflow-hidden rounded-2xl"
      >
        <Link href={massifHref} className="block">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={primary.image}
              alt={massifLabel}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized={isRemote}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            {group.peaks.some((p) => p.is_4000) ? (
              <span className="absolute top-3 right-3 rounded-full border border-alpenglow/40 bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-alpenglow">
                4000+
              </span>
            ) : null}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="font-display text-xl text-snow leading-tight">{massifLabel}</h3>
              <p className="font-display text-2xl text-ice tabular-nums leading-none mt-1">
                {primary.elevation_m}
                <span className="text-base text-snow/60 ml-1">m</span>
              </p>
            </div>
          </div>
          <div className="p-5">
            <p className="text-sm text-snow/65 leading-relaxed line-clamp-2">
              {getPeakDescription(primary, locale)}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-alpenglow group-hover:text-snow transition-colors">
              {viewMassif}
              <ChevronRight size={12} />
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.article>
  );
}

export default function AmbienteExplorer({
  locale,
  flora,
  fauna,
  peaks,
  geology,
  hydrology,
  labels,
}: AmbienteExplorerProps) {
  const isIT = locale === 'it';
  const searchParams = useSearchParams();
  const router = useRouter();
  const peakParam = searchParams.get('vetta');
  const [activeSection, setActiveSection] = useState<AmbienteSectionId>('flora-fauna');
  const [peakFilter, setPeakFilter] = useState<PeakFilter>('all');
  const [highlightedPeakId, setHighlightedPeakId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const sectionLabels: Record<AmbienteSectionId, string> = {
    'flora-fauna': labels.navFloraFauna,
    montagne: labels.navMontagne,
    geologia: labels.navGeologia,
    idrologia: labels.navIdrologia,
  };

  const filteredGroups = useMemo(() => {
    return filterMassifGroups(getMassifGroups(), peakFilter).filter(
      (g) => !EXCLUDED_MASSIF_IDS.includes(g.id)
    );
  }, [peakFilter]);

  const geologyStats = useMemo(
    () => getSectionGroupStats(geology, locale),
    [geology, locale]
  );
  const hydrologyStats = useMemo(
    () => getSectionGroupStats(hydrology, locale),
    [hydrology, locale]
  );
  const sourcesLabel = isIT ? 'Fonti' : 'Sources';


  const scrollTo = useCallback((id: AmbienteSectionId) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as AmbienteSectionId;
    if (SECTIONS.some((s) => s.id === hash)) {
      setTimeout(() => scrollTo(hash), 100);
    }
  }, [scrollTo]);

  useEffect(() => {
    if (!peakParam) return;
    const peak = peaks.find((p) => p.id === peakParam);
    if (!peak) return;

    setHighlightedPeakId(peakParam);
    setPeakFilter('all');

    const timer = window.setTimeout(() => {
      scrollTo('montagne');
      window.setTimeout(() => {
        const group = getMassifGroups().find((g) => g.peaks.some((p) => p.id === peakParam));
        if (group) {
          router.push(`${getMassifHref(group.id)}#peak-${peakParam}`);
          return;
        }
        document.getElementById(`peak-${peakParam}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 350);
    }, 150);

    return () => window.clearTimeout(timer);
  }, [peakParam, peaks, scrollTo, router]);

  useEffect(() => {
    if (!highlightedPeakId) return;
    const timer = window.setTimeout(() => setHighlightedPeakId(null), 5000);
    return () => window.clearTimeout(timer);
  }, [highlightedPeakId]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky section nav */}
      <nav
        aria-label={isIT ? 'Sezioni ambiente' : 'Environment sections'}
        className="sticky top-[4.5rem] z-30 border-b border-white/8 bg-ink/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 lg:px-10 scrollbar-none">
          {SECTIONS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all ${
                activeSection === id
                  ? 'bg-alpenglow/15 text-alpenglow border border-alpenglow/35'
                  : 'text-snow/50 hover:text-snow border border-transparent hover:border-white/10'
              }`}
            >
              <Icon size={14} />
              {sectionLabels[id]}
            </button>
          ))}
        </div>
        <motion.div
          aria-hidden
          style={{ scaleX: progressScaleX }}
          className="absolute bottom-0 left-0 right-0 h-px origin-left bg-gradient-to-r from-alpenglow via-ice to-alpenglow"
        />
      </nav>

      {/* Flora & Fauna — catalogo interattivo con foto */}
      <section id="flora-fauna" className="scroll-mt-36 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <ScrollReveal className="mb-10 max-w-2xl">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-alpenglow">
              {labels.storyEyebrow}
            </p>
            <h2 className="font-display text-display-md tracking-tighter mb-4">
              {isIT ? 'Flora e Fauna' : 'Flora & Fauna'}
            </h2>
            <p className="text-snow/60 leading-relaxed">
              {isIT
                ? `${fauna.length} specie animali e ${flora.length} vegetali catalogate con schede naturalistiche, areali e fotografie.`
                : `${fauna.length} animal and ${flora.length} plant species catalogued with naturalist profiles, ranges and photographs.`}
            </p>
          </ScrollReveal>
          <FloraFaunaExplorer flora={flora} fauna={fauna} locale={locale} />
        </div>
      </section>

      <SceneDivider
        image="/trails/cervino.jpg"
        title={isIT ? 'Montagne e Valli' : 'Mountains & Valleys'}
        subtitle={isIT
          ? 'Monte Bianco, Cervino, Monte Rosa, Gran Paradiso — massicci leggendari e valli di alta quota'
          : 'Mont Blanc, Matterhorn, Monte Rosa, Gran Paradiso — legendary massifs and high-altitude valleys'}
      />

      {/* Montagne */}
      <section
        id="montagne"
        className="scroll-mt-36 border-b border-white/5 bg-white/[0.01] py-16 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <ScrollReveal className="mb-10 max-w-2xl">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-alpenglow">
              {labels.peaksEyebrow}
            </p>
            <h2 className="font-display text-display-md tracking-tighter mb-4">
              {labels.peaksTitle}
            </h2>
            <p className="text-snow/55 leading-relaxed">{labels.peaksSubtitle}</p>
            <p className="mt-3 font-mono text-xs text-ice/80">{labels.count4000}</p>
          </ScrollReveal>

          <div className="mb-8 flex flex-wrap gap-2">
            {(
              [
                ['all', labels.filterAll],
                ['4000', labels.filter4000],
                ['trails', labels.filterTrails],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPeakFilter(key)}
                className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  peakFilter === key
                    ? 'bg-ice/15 text-ice border border-ice/30'
                    : 'border border-white/10 text-snow/50 hover:text-snow'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <MassifPeakCard
                key={group.id}
                group={group}
                locale={locale}
                viewMassif={labels.viewMassif}
                highlightedPeakId={highlightedPeakId}
              />
            ))}
          </div>
        </div>
      </section>

      <SceneDivider
        image="/trails/alta-via-1-tappa-9-valtournenche-rifugio-barmasse.jpg"
        title={isIT ? 'Geologia' : 'Geology'}
        subtitle={isIT
          ? 'Rocce millenarie, ofioliti e morene glaciali — la storia delle Alpi scritta nella pietra'
          : 'Ancient rocks, ophiolites and glacial moraines — the Alps\' history written in stone'}
      />

      {/* Geologia */}
      <section id="geologia" className="scroll-mt-36 border-b border-white/5 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <ScrollReveal className="mb-10 max-w-xl">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-alpenglow">
              {labels.geologyEyebrow}
            </p>
            <h2 className="font-display text-display-md tracking-tighter">
              {labels.geologyTitle}
            </h2>
          </ScrollReveal>
          <StatBand stats={geologyStats} sourcesLabel={sourcesLabel} />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {geology.map((s, i) => (
              <EnvironmentBlock key={s.id} section={s} locale={locale} index={i} />
            ))}
          </div>
        </div>
      </section>

      <SceneDivider
        image="/trails/lago-djouan-cogne.jpg"
        title={isIT ? 'Acque e Ghiacciai' : 'Waters & Glaciers'}
        subtitle={isIT
          ? '184 ghiacciai censiti, 168 km di Dora Baltea — l\'acqua che scende dalle creste al fondovalle'
          : '184 catalogued glaciers, 168 km of Dora Baltea — water descending from ridges to valley floor'}
      />

      {/* Idrologia */}
      <section id="idrologia" className="scroll-mt-36 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <ScrollReveal className="mb-10 max-w-xl">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-ice">
              {labels.hydrologyEyebrow}
            </p>
            <h2 className="font-display text-display-md tracking-tighter">
              {labels.hydrologyTitle}
            </h2>
          </ScrollReveal>
          <StatBand stats={hydrologyStats} sourcesLabel={sourcesLabel} />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {hydrology.map((s, i) => (
              <EnvironmentBlock key={s.id} section={s} locale={locale} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
