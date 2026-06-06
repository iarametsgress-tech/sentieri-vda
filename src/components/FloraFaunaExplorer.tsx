'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  PawPrint,
  Mountain,
  Thermometer,
  Droplets,
  Flower2,
  Layers,
  TreeDeciduous,
  Sun,
  Shield,
  Utensils,
  MapPin,
  ExternalLink,
  Sprout,
  Shrub,
  Search,
  Binoculars,
  Microscope,
  Globe2,
} from 'lucide-react';
import type {
  FaunaClass,
  FaunaGroup,
  FloraGroup,
  FloraSubgroup,
  Species,
  SpeciesProfile,
} from '@/lib/species-types';
import {
  FAUNA_CLASS_LABELS,
  FAUNA_GROUP_LABELS,
  FAUNA_GROUPS_BY_CLASS,
  FLORA_GROUP_LABELS,
  FLORA_SUBGROUP_LABELS,
  FLORA_SUBGROUPS_BY_GROUP,
  isFlora,
  isFauna,
} from '@/lib/species-types';
import SpeciesDistributionMap from './SpeciesDistributionMap';

type Tab = 'flora' | 'fauna';

interface FloraFaunaExplorerProps {
  flora: Species[];
  fauna: Species[];
  locale: string;
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: 'ice' | 'alpenglow';
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.04] backdrop-blur-sm p-4 flex gap-3 items-start">
      <div
        className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
          accent === 'ice' ? 'bg-ice/15 text-ice' : 'bg-alpenglow/15 text-alpenglow'
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-widest text-snow/55 mb-1">{label}</p>
        <p className="text-sm text-snow/85 leading-snug">{value}</p>
      </div>
    </div>
  );
}

function ProfileBlock({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-snow/50">
        {icon}
        {title}
      </h3>
      <p className="text-snow/75 leading-relaxed text-[15px]">{text}</p>
    </div>
  );
}

function StructuredProfile({
  profile,
  locale,
}: {
  profile: SpeciesProfile;
  locale: string;
}) {
  const isIT = locale === 'it';
  const sections = [
    {
      icon: <Binoculars size={14} className="text-ice/80" />,
      title: isIT ? 'Panoramica' : 'Overview',
      text: isIT ? profile.overview_it : profile.overview_en,
    },
    {
      icon: <Microscope size={14} className="text-ice/80" />,
      title: isIT ? 'Identificazione' : 'Identification',
      text: isIT ? profile.identification_it : profile.identification_en,
    },
    {
      icon: <Leaf size={14} className="text-alpenglow/80" />,
      title: isIT ? 'Ecologia' : 'Ecology',
      text: isIT ? profile.ecology_it : profile.ecology_en,
    },
    {
      icon: <Globe2 size={14} className="text-alpenglow/80" />,
      title: isIT ? 'In Valle d\'Aosta' : 'In Aosta Valley',
      text: isIT ? profile.inValle_it : profile.inValle_en,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {sections.map((s) => (
        <ProfileBlock key={s.title} icon={s.icon} title={s.title} text={s.text} />
      ))}
    </div>
  );
}

const FLORA_GROUPS: FloraGroup[] = ['tree', 'shrub', 'herb'];
const FAUNA_CLASSES: FaunaClass[] = ['mammal', 'bird', 'herpeto'];

function FloraFaunaExplorerInner({ flora, fauna, locale }: FloraFaunaExplorerProps) {
  const isIT = locale === 'it';
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const allSpecies = useMemo(() => [...fauna, ...flora], [fauna, flora]);
  const paramId = searchParams.get('specie');
  const paramFloraGroup = searchParams.get('gruppo') as FloraGroup | null;
  const paramFloraSub = searchParams.get('sottogruppo') as FloraSubgroup | null;
  const paramFaunaClass = searchParams.get('classe') as FaunaClass | null;
  const paramFaunaGroup = searchParams.get('sottogruppo') as FaunaGroup | null;

  const initialFromUrl = allSpecies.find((s) => s.id === paramId);

  const [tab, setTab] = useState<Tab>(initialFromUrl?.kind ?? 'fauna');
  const [faunaClass, setFaunaClass] = useState<FaunaClass>(
    initialFromUrl && isFauna(initialFromUrl)
      ? initialFromUrl.faunaClass
      : paramFaunaClass && FAUNA_CLASSES.includes(paramFaunaClass)
        ? paramFaunaClass
        : 'mammal'
  );
  const [faunaGroup, setFaunaGroup] = useState<FaunaGroup>(
    initialFromUrl && isFauna(initialFromUrl)
      ? initialFromUrl.faunaGroup
      : paramFaunaGroup && FAUNA_GROUPS_BY_CLASS[faunaClass]?.includes(paramFaunaGroup)
        ? paramFaunaGroup
        : FAUNA_GROUPS_BY_CLASS.mammal[0]
  );
  const [floraGroup, setFloraGroup] = useState<FloraGroup>(
    initialFromUrl && isFlora(initialFromUrl)
      ? initialFromUrl.floraGroup
      : paramFloraGroup && FLORA_GROUPS.includes(paramFloraGroup)
        ? paramFloraGroup
        : 'tree'
  );
  const [floraSubgroup, setFloraSubgroup] = useState<FloraSubgroup>(
    initialFromUrl && isFlora(initialFromUrl)
      ? initialFromUrl.floraSubgroup
      : paramFloraSub && FLORA_SUBGROUPS_BY_GROUP[floraGroup]?.includes(paramFloraSub)
        ? paramFloraSub
        : FLORA_SUBGROUPS_BY_GROUP.tree[0]
  );
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    let base =
      tab === 'fauna'
        ? fauna.filter((s) => isFauna(s) && s.faunaClass === faunaClass && s.faunaGroup === faunaGroup)
        : flora.filter(
            (s) =>
              isFlora(s) &&
              s.floraGroup === floraGroup &&
              s.floraSubgroup === floraSubgroup
          );
    if (query.trim()) {
      const q = query.toLowerCase();
      base = base.filter(
        (s) =>
          s.name_it.toLowerCase().includes(q) ||
          s.name_en.toLowerCase().includes(q) ||
          s.scientific.toLowerCase().includes(q)
      );
    }
    return base;
  }, [tab, fauna, flora, faunaClass, faunaGroup, floraGroup, floraSubgroup, query]);

  const [selectedId, setSelectedId] = useState<string>(
    initialFromUrl?.id ?? fauna[0]?.id ?? flora[0]?.id ?? ''
  );

  // selected deve restare valido anche se la ricerca filtra via tutto il `list`
  // (altrimenti l'intero explorer — barra di ricerca inclusa — sparirebbe).
  const selected =
    allSpecies.find((s) => s.id === selectedId) ?? list[0] ?? allSpecies[0];

  useEffect(() => {
    if (!paramId) return;
    const sp = allSpecies.find((s) => s.id === paramId);
    if (sp) {
      setTab(sp.kind);
      setSelectedId(sp.id);
      if (isFauna(sp)) {
        setFaunaClass(sp.faunaClass);
        setFaunaGroup(sp.faunaGroup);
      }
      if (isFlora(sp)) {
        setFloraGroup(sp.floraGroup);
        setFloraSubgroup(sp.floraSubgroup);
      }
    }
  }, [paramId, allSpecies]);

  function updateUrl(
    id: string,
    kind: Tab,
    opts?: { faunaClass?: FaunaClass; faunaGroup?: FaunaGroup; floraGroup?: FloraGroup; floraSubgroup?: FloraSubgroup }
  ) {
    const params = new URLSearchParams();
    params.set('specie', id);
    if (kind === 'fauna' && opts?.faunaClass && opts?.faunaGroup) {
      params.set('classe', opts.faunaClass);
      params.set('sottogruppo', opts.faunaGroup);
    }
    if (kind === 'flora' && opts?.floraGroup && opts?.floraSubgroup) {
      params.set('gruppo', opts.floraGroup);
      params.set('sottogruppo', opts.floraSubgroup);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function selectSpecies(s: Species) {
    setSelectedId(s.id);
    if (isFauna(s)) updateUrl(s.id, 'fauna', { faunaClass: s.faunaClass, faunaGroup: s.faunaGroup });
    else updateUrl(s.id, 'flora', { floraGroup: s.floraGroup, floraSubgroup: s.floraSubgroup });
  }

  function switchTab(next: Tab) {
    setTab(next);
    setQuery('');
    if (next === 'fauna') {
      const first = fauna.find((s) => isFauna(s) && s.faunaClass === faunaClass && s.faunaGroup === faunaGroup);
      if (first) selectSpecies(first);
    } else {
      const first = flora.find(
        (s) => isFlora(s) && s.floraGroup === floraGroup && s.floraSubgroup === floraSubgroup
      );
      if (first) selectSpecies(first);
    }
  }

  function switchFaunaClass(c: FaunaClass) {
    setFaunaClass(c);
    setQuery('');
    const g = FAUNA_GROUPS_BY_CLASS[c][0];
    setFaunaGroup(g);
    const first = fauna.find((s) => isFauna(s) && s.faunaClass === c && s.faunaGroup === g);
    if (first) selectSpecies(first);
  }

  function switchFaunaGroup(g: FaunaGroup) {
    setFaunaGroup(g);
    setQuery('');
    const first = fauna.find((s) => isFauna(s) && s.faunaClass === faunaClass && s.faunaGroup === g);
    if (first) selectSpecies(first);
  }

  function switchFloraGroup(g: FloraGroup) {
    setFloraGroup(g);
    setQuery('');
    const sub = FLORA_SUBGROUPS_BY_GROUP[g][0];
    setFloraSubgroup(sub);
    const first = flora.find((s) => isFlora(s) && s.floraGroup === g && s.floraSubgroup === sub);
    if (first) selectSpecies(first);
  }

  function switchFloraSubgroup(sub: FloraSubgroup) {
    setFloraSubgroup(sub);
    setQuery('');
    const first = flora.find(
      (s) => isFlora(s) && s.floraGroup === floraGroup && s.floraSubgroup === sub
    );
    if (first) selectSpecies(first);
  }

  if (!selected) return null;

  const name = isIT ? selected.name_it : selected.name_en;
  const accentClass = selected.kind === 'flora' ? 'text-alpenglow' : 'text-ice';

  const categoryLabel =
    selected.kind === 'fauna' && isFauna(selected)
      ? `${isIT ? FAUNA_CLASS_LABELS[selected.faunaClass].it : FAUNA_CLASS_LABELS[selected.faunaClass].en} · ${isIT ? FAUNA_GROUP_LABELS[selected.faunaGroup].it : FAUNA_GROUP_LABELS[selected.faunaGroup].en}`
      : isFlora(selected)
        ? `${isIT ? FLORA_GROUP_LABELS[selected.floraGroup].it : FLORA_GROUP_LABELS[selected.floraGroup].en} · ${isIT ? FLORA_SUBGROUP_LABELS[selected.floraSubgroup].it : FLORA_SUBGROUP_LABELS[selected.floraSubgroup].en}`
        : '';

  return (
    <div className="space-y-8">
      {/* Tab Fauna / Flora */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => switchTab('fauna')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            tab === 'fauna'
              ? 'bg-ice/15 text-ice border border-ice/30'
              : 'bg-white/[0.03] text-snow/50 border border-white/8 hover:border-white/15'
          }`}
        >
          <PawPrint size={16} />
          Fauna
          <span className="text-xs font-mono opacity-60">{fauna.length}</span>
        </button>
        <button
          type="button"
          onClick={() => switchTab('flora')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            tab === 'flora'
              ? 'bg-alpenglow/15 text-alpenglow border border-alpenglow/30'
              : 'bg-white/[0.03] text-snow/50 border border-white/8 hover:border-white/15'
          }`}
        >
          <Leaf size={16} />
          Flora
          <span className="text-xs font-mono opacity-60">{flora.length}</span>
        </button>
      </div>

      {/* Filtri a due livelli */}
      {tab === 'fauna' ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {FAUNA_CLASSES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => switchFaunaClass(c)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wide border transition-all ${
                  faunaClass === c
                    ? 'bg-ice/15 text-ice border-ice/35'
                    : 'bg-white/[0.02] text-snow/55 border-white/8 hover:border-white/12'
                }`}
              >
                {isIT ? FAUNA_CLASS_LABELS[c].it : FAUNA_CLASS_LABELS[c].en}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {FAUNA_GROUPS_BY_CLASS[faunaClass].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => switchFaunaGroup(g)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono border transition-all ${
                  faunaGroup === g
                    ? 'bg-ice/10 text-ice border-ice/30'
                    : 'bg-transparent text-snow/55 border-white/8 hover:text-snow/60'
                }`}
              >
                {isIT ? FAUNA_GROUP_LABELS[g].it : FAUNA_GROUP_LABELS[g].en}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {FLORA_GROUPS.map((g) => {
              const Icon = g === 'tree' ? TreeDeciduous : g === 'shrub' ? Shrub : Sprout;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => switchFloraGroup(g)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wide border transition-all ${
                    floraGroup === g
                      ? 'bg-alpenglow/15 text-alpenglow border-alpenglow/35'
                      : 'bg-white/[0.02] text-snow/55 border-white/8 hover:border-white/12'
                  }`}
                >
                  <Icon size={14} />
                  {isIT ? FLORA_GROUP_LABELS[g].it : FLORA_GROUP_LABELS[g].en}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {FLORA_SUBGROUPS_BY_GROUP[floraGroup].map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => switchFloraSubgroup(sub)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono border transition-all ${
                  floraSubgroup === sub
                    ? 'bg-alpenglow/10 text-alpenglow border-alpenglow/30'
                    : 'bg-transparent text-snow/55 border-white/8 hover:text-snow/60'
                }`}
              >
                {isIT ? FLORA_SUBGROUP_LABELS[sub].it : FLORA_SUBGROUP_LABELS[sub].en}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-snow/50" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isIT ? 'Cerca per nome…' : 'Search by name…'}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-snow placeholder:text-snow/50 focus:outline-none focus:border-white/20"
            />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-snow/55">
            {list.length} {isIT ? 'specie in questa categoria' : 'species in this category'}
          </p>
          <ul className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 snap-x snap-mandatory max-h-[60vh] lg:overflow-y-auto lg:pr-1">
            {list.map((s) => {
              const active = s.id === selected.id;
              const label = isIT ? s.name_it : s.name_en;
              return (
                <li key={s.id} className="snap-start shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => selectSpecies(s)}
                    className={`w-full min-w-[200px] lg:min-w-0 flex items-center gap-3 p-2 rounded-xl border text-left transition-all ${
                      active
                        ? tab === 'flora'
                          ? 'border-alpenglow/40 bg-alpenglow/10'
                          : 'border-ice/40 bg-ice/10'
                        : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/12'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-ink">
                      <Image src={s.image} alt={label} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-sm leading-tight truncate">{label}</p>
                      <p className="text-[10px] font-mono italic text-snow/55 truncate">
                        {s.scientific}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="lg:col-span-8 xl:col-span-9">
          <AnimatePresence mode="wait">
            <motion.article
              key={selected.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <header className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-0">
                  <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[240px] bg-ink">
                    <Image
                      src={selected.image}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 240px"
                      priority
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-center gap-3">
                    <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${accentClass}`}>
                      {categoryLabel}
                    </p>
                    <p className="font-mono text-sm italic text-snow/55">{selected.scientific}</p>
                    <h2 className="font-display text-3xl md:text-4xl tracking-tighter leading-tight">
                      {name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-xs font-mono text-snow/70">
                        <Mountain size={12} className={accentClass} />
                        {selected.altitude.min}–{selected.altitude.max} m
                      </span>
                      <span className="text-[10px] font-mono text-snow/50">
                        © {selected.author} · {selected.license}
                      </span>
                    </div>
                  </div>
                </div>
              </header>

              <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 md:p-8">
                <p className="text-[10px] font-mono uppercase tracking-widest text-snow/55 mb-6">
                  {isIT ? 'Scheda naturalistica' : 'Naturalist profile'}
                </p>
                <StructuredProfile profile={selected.profile} locale={locale} />
              </section>

              <section className="space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-snow/55">
                  {isIT ? 'Areale in Valle d\'Aosta' : 'Range in Aosta Valley'}
                </p>
                <SpeciesDistributionMap
                  speciesId={selected.id}
                  zones={selected.zones}
                  kind={selected.kind}
                  locale={locale}
                  className="w-full h-[280px] sm:h-[320px] shadow-xl ring-1 ring-white/10"
                />
                <ul className="flex flex-wrap gap-2">
                  {selected.zones.map((z) => (
                    <li
                      key={z.name_it}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono border ${
                        selected.kind === 'flora'
                          ? 'border-alpenglow/30 text-alpenglow/90 bg-alpenglow/10'
                          : 'border-ice/30 text-ice/90 bg-ice/10'
                      }`}
                    >
                      {isIT ? z.name_it : z.name_en}
                    </li>
                  ))}
                </ul>
              </section>

              {selected.links.length > 0 && (
                <section>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-snow/55 mb-3">
                    {isIT ? 'Approfondimenti' : 'Learn more'}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {selected.links.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all hover:bg-white/[0.06] ${
                            selected.kind === 'flora'
                              ? 'border-alpenglow/25 text-alpenglow/90 hover:border-alpenglow/40'
                              : 'border-ice/25 text-ice/90 hover:border-ice/40'
                          }`}
                        >
                          <ExternalLink size={14} className="shrink-0 opacity-70" />
                          {isIT ? link.label_it : link.label_en}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <p className="text-[10px] font-mono uppercase tracking-widest text-snow/55 mb-4">
                  {isIT ? 'Dati ecologici' : 'Ecological data'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {isFlora(selected) && (
                    <>
                      <StatCard icon={<TreeDeciduous size={16} />} label={isIT ? 'Tipo' : 'Type'} value={isIT ? selected.plantType_it : selected.plantType_en} accent="alpenglow" />
                      <StatCard icon={<Layers size={16} />} label={isIT ? 'Suolo' : 'Soil'} value={isIT ? selected.soil_it : selected.soil_en} accent="alpenglow" />
                      <StatCard icon={<Leaf size={16} />} label={isIT ? 'Foglie' : 'Leaves'} value={isIT ? selected.leaves_it : selected.leaves_en} accent="alpenglow" />
                      <StatCard icon={<Flower2 size={16} />} label={isIT ? 'Fiori' : 'Flowers'} value={isIT ? selected.flowers_it : selected.flowers_en} accent="alpenglow" />
                      <StatCard icon={<Sun size={16} />} label={isIT ? 'Fioritura' : 'Bloom'} value={isIT ? selected.bloom_it : selected.bloom_en} accent="alpenglow" />
                      <StatCard icon={<Thermometer size={16} />} label={isIT ? 'Temperatura' : 'Temperature'} value={isIT ? selected.tempRange_it : selected.tempRange_en} accent="alpenglow" />
                      <StatCard icon={<Droplets size={16} />} label={isIT ? 'Umidità' : 'Humidity'} value={isIT ? selected.humidity_it : selected.humidity_en} accent="alpenglow" />
                    </>
                  )}
                  {isFauna(selected) && (
                    <>
                      <StatCard icon={<Utensils size={16} />} label={isIT ? 'Dieta' : 'Diet'} value={isIT ? selected.diet_it : selected.diet_en} accent="ice" />
                      <StatCard icon={<MapPin size={16} />} label={isIT ? 'Habitat' : 'Habitat'} value={isIT ? selected.habitat_it : selected.habitat_en} accent="ice" />
                      <StatCard icon={<Sun size={16} />} label={isIT ? 'Attività' : 'Activity'} value={isIT ? selected.activity_it : selected.activity_en} accent="ice" />
                      <StatCard icon={<Shield size={16} />} label={isIT ? 'Stato' : 'Status'} value={isIT ? selected.status_it : selected.status_en} accent="ice" />
                    </>
                  )}
                </div>
              </section>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function FloraFaunaExplorer(props: FloraFaunaExplorerProps) {
  return (
    <Suspense fallback={<div className="h-96 rounded-3xl border border-white/10 bg-white/[0.02] animate-pulse" />}>
      <FloraFaunaExplorerInner {...props} />
    </Suspense>
  );
}
