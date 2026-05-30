'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Phone,
  CloudLightning,
  Backpack,
  Mountain,
  HeartPulse,
  Dog,
  Baby,
  ExternalLink,
  Shield,
  Thermometer,
  MapPin,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

type SectionId =
  | 'emergenza'
  | 'responsabilita'
  | 'equipaggiamento'
  | 'meteo'
  | 'segnali'
  | 'soccorso'
  | 'famiglia'
  | 'contatti';

const SECTIONS: { id: SectionId; icon: typeof Phone }[] = [
  { id: 'emergenza', icon: Phone },
  { id: 'responsabilita', icon: Shield },
  { id: 'equipaggiamento', icon: Backpack },
  { id: 'meteo', icon: CloudLightning },
  { id: 'segnali', icon: AlertTriangle },
  { id: 'soccorso', icon: HeartPulse },
  { id: 'famiglia', icon: Baby },
  { id: 'contatti', icon: MapPin },
];

interface SicurezzaExplorerProps {
  locale: string;
  labels: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    navEmergency: string;
    navResponsibility: string;
    navEquipment: string;
    navWeather: string;
    navSignals: string;
    navRescue: string;
    navFamily: string;
    navContacts: string;
    emergencyTitle: string;
    emergencyBody: string;
    responsibilityTitle: string;
    responsibilityBody: string;
    equipmentTitle: string;
    equipmentIntro: string;
    weatherTitle: string;
    weatherBody: string;
    signalsTitle: string;
    rescueTitle: string;
    rescueIntro: string;
    familyTitle: string;
    familyBody: string;
    contactsTitle: string;
    contactsSubtitle: string;
    equipmentItems: string[];
    signalItems: string[];
    rescueSteps: string[];
    contactLinks: { label: string; href: string; desc: string }[];
  };
}

export default function SicurezzaExplorer({ locale, labels }: SicurezzaExplorerProps) {
  const isIT = locale === 'it';
  const [active, setActive] = useState<SectionId>('emergenza');

  const sectionLabels: Record<SectionId, string> = {
    emergenza: labels.navEmergency,
    responsabilita: labels.navResponsibility,
    equipaggiamento: labels.navEquipment,
    meteo: labels.navWeather,
    segnali: labels.navSignals,
    soccorso: labels.navRescue,
    famiglia: labels.navFamily,
    contatti: labels.navContacts,
  };

  const scrollTo = useCallback((id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <section className="relative min-h-[62vh] overflow-hidden lg:min-h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src="/trails/alta-via-1-tappa-10-valtournenche-rifugio-barmasse.jpg"
            alt={isIT ? 'Cresta alpina in Valle d\'Aosta' : 'Alpine ridge in Aosta Valley'}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        </div>
        <div className="relative mx-auto flex min-h-[62vh] max-w-4xl flex-col justify-end px-6 pb-14 pt-28 lg:min-h-[70vh] lg:px-10 lg:pb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-alpenglow"
          >
            {labels.heroEyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-on-image-title font-display text-display-lg tracking-tighter"
          >
            {labels.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-on-image-body mt-5 max-w-2xl text-lg leading-relaxed text-snow/85"
          >
            {labels.heroSubtitle}
          </motion.p>
        </div>
      </section>

      <nav
        aria-label={isIT ? 'Sezioni sicurezza' : 'Safety sections'}
        className="sticky top-16 z-30 border-b border-white/8 bg-ink/92 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 lg:px-10 scrollbar-none">
          {SECTIONS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all ${
                active === id
                  ? 'border border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
                  : 'border border-transparent text-snow/50 hover:border-white/10 hover:text-snow'
              }`}
            >
              <Icon size={13} />
              {sectionLabels[id]}
            </button>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-10 lg:py-24 space-y-20">
        <ScrollReveal>
          <section id="emergenza" className="scroll-mt-36">
            <div className="rounded-2xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/10 to-transparent p-8 lg:p-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-yellow-500/30 bg-yellow-500/10">
                  <Phone size={22} className="text-yellow-400" />
                </div>
                <h2 className="font-display text-2xl text-snow tracking-tight">
                  {labels.emergencyTitle}
                </h2>
              </div>
              <p className="text-snow/70 leading-relaxed">{labels.emergencyBody}</p>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="responsabilita" className="scroll-mt-36">
            <h2 className="font-display text-2xl text-snow tracking-tight mb-4 flex items-center gap-2">
              <Shield size={20} className="text-ice" />
              {labels.responsibilityTitle}
            </h2>
            <p className="text-snow/65 leading-relaxed text-lg">{labels.responsibilityBody}</p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="equipaggiamento" className="scroll-mt-36">
            <h2 className="font-display text-2xl text-snow tracking-tight mb-3 flex items-center gap-2">
              <Backpack size={20} className="text-alpenglow" />
              {labels.equipmentTitle}
            </h2>
            <p className="text-snow/55 mb-8 leading-relaxed">{labels.equipmentIntro}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {labels.equipmentItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={false}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <Mountain size={14} className="mt-1 shrink-0 text-ice" />
                  <span className="text-sm text-snow/70 leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="meteo" className="scroll-mt-36">
            <h2 className="font-display text-2xl text-snow tracking-tight mb-4 flex items-center gap-2">
              <Thermometer size={20} className="text-ice" />
              {labels.weatherTitle}
            </h2>
            <p className="text-snow/65 leading-relaxed text-lg">{labels.weatherBody}</p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="segnali" className="scroll-mt-36">
            <h2 className="font-display text-2xl text-snow tracking-tight mb-6 flex items-center gap-2">
              <AlertTriangle size={20} className="text-yellow-400" />
              {labels.signalsTitle}
            </h2>
            <ul className="space-y-3">
              {labels.signalItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-snow/65"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500/80" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="soccorso" className="scroll-mt-36">
            <h2 className="font-display text-2xl text-snow tracking-tight mb-4 flex items-center gap-2">
              <HeartPulse size={20} className="text-alpenglow" />
              {labels.rescueTitle}
            </h2>
            <p className="text-snow/55 mb-6">{labels.rescueIntro}</p>
            <ol className="space-y-3">
              {labels.rescueSteps.map((step, i) => (
                <li
                  key={step}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <span className="font-display text-xl text-ice tabular-nums">{i + 1}</span>
                  <span className="text-sm text-snow/70 leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="famiglia" className="scroll-mt-36">
            <h2 className="font-display text-2xl text-snow tracking-tight mb-4 flex items-center gap-2">
              <Baby size={18} className="text-snow/70" />
              <Dog size={18} className="text-snow/70" />
              {labels.familyTitle}
            </h2>
            <p className="text-snow/65 leading-relaxed text-lg">{labels.familyBody}</p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="contatti" className="scroll-mt-36">
            <h2 className="font-display text-2xl text-snow tracking-tight mb-2">
              {labels.contactsTitle}
            </h2>
            <p className="text-snow/50 mb-8 text-sm">{labels.contactsSubtitle}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {labels.contactLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-alpenglow/35 hover:bg-alpenglow/5"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-display text-lg text-snow group-hover:text-alpenglow transition-colors">
                      {link.label}
                    </span>
                    <ExternalLink size={14} className="text-snow/30 group-hover:text-alpenglow" />
                  </div>
                  <p className="text-xs text-snow/50 leading-relaxed">{link.desc}</p>
                </a>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
