'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Phone,
  CloudLightning,
  Backpack,
  HeartPulse,
  ExternalLink,
  Shield,
  Thermometer,
  MapPin,
  CheckCircle2,
  ListChecks,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import SectionScrollNav from '@/components/SectionScrollNav';
import { topicClasses, type TopicThemeKey } from '@/lib/topic-themes';
import { cn } from '@/lib/cn';

type SectionId =
  | 'emergenza'
  | 'responsabilita'
  | 'equipaggiamento'
  | 'meteo'
  | 'segnali'
  | 'soccorso'
  | 'buone-norme'
  | 'contatti';

const SECTIONS: { id: SectionId; icon: typeof Phone; theme: TopicThemeKey }[] = [
  { id: 'emergenza', icon: Phone, theme: 'safetyEmergency' },
  { id: 'responsabilita', icon: Shield, theme: 'safetyGeneral' },
  { id: 'equipaggiamento', icon: Backpack, theme: 'safetyEquipment' },
  { id: 'meteo', icon: CloudLightning, theme: 'safetyWeather' },
  { id: 'segnali', icon: AlertTriangle, theme: 'safetySignals' },
  { id: 'soccorso', icon: HeartPulse, theme: 'safetyRescue' },
  { id: 'buone-norme', icon: ListChecks, theme: 'safetyFamily' },
  { id: 'contatti', icon: MapPin, theme: 'safetyContacts' },
];

const PAGE_BG = '/safety/hero-alpine-rescue.jpg';

interface SicurezzaExplorerProps {
  locale: string;
  labels: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    emergencyCallLabel: string;
    emergencyCallHint: string;
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
    emergencyExtra: string;
    responsibilityTitle: string;
    responsibilityBody: string;
    responsibilityPoints: string[];
    equipmentTitle: string;
    equipmentIntro: string;
    equipmentNote: string;
    weatherTitle: string;
    weatherBody: string;
    weatherPoints: string[];
    weatherLinksTitle: string;
    signalsTitle: string;
    signalsIntro: string;
    rescueTitle: string;
    rescueIntro: string;
    rescueNote: string;
    familyTitle: string;
    familyBody: string;
    familyPoints: string[];
    contactsTitle: string;
    contactsSubtitle: string;
    equipmentItems: string[];
    signalItems: string[];
    rescueSteps: string[];
    weatherLinks: { label: string; href: string; desc: string }[];
    contactLinks: { label: string; href: string; desc: string }[];
  };
}

function SectionHeader({
  icon: Icon,
  title,
  theme,
}: {
  icon: typeof Phone;
  title: string;
  theme: TopicThemeKey;
}) {
  const t = topicClasses(theme);
  return (
    <div className="mb-8 flex items-start gap-4">
      <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border', t.card)}>
        <Icon size={26} className={t.icon} />
      </div>
      <h2 className="font-display text-2xl lg:text-[2rem] text-snow tracking-tight leading-tight pt-1">
        {title}
      </h2>
    </div>
  );
}

function BodyText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-base lg:text-[17px] leading-[1.85] text-snow/90', className)}>{children}</p>
  );
}

function BulletList({ items, theme }: { items: string[]; theme: TopicThemeKey }) {
  const t = topicClasses(theme);
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            'flex items-start gap-3 rounded-xl border px-5 py-4 text-[15px] leading-relaxed text-snow/90',
            t.card
          )}
        >
          <CheckCircle2 size={18} className={cn('mt-0.5 shrink-0', t.icon)} aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

function LinkGrid({
  links,
  theme,
}: {
  links: { label: string; href: string; desc: string }[];
  theme: TopicThemeKey;
}) {
  const t = topicClasses(theme);
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target={link.href.startsWith('tel:') ? undefined : '_blank'}
          rel={link.href.startsWith('tel:') ? undefined : 'noopener noreferrer'}
          className={cn(
            'group rounded-xl border p-5 transition-colors hover:border-ice/50',
            t.card
          )}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="font-display text-lg text-snow group-hover:text-ice transition-colors">
              {link.label}
            </span>
            <ExternalLink size={14} className="text-snow/45 group-hover:text-ice shrink-0" />
          </div>
          <p className="text-sm text-snow/70 leading-relaxed">{link.desc}</p>
        </a>
      ))}
    </div>
  );
}

function SectionCard({
  id,
  theme,
  children,
}: {
  id: SectionId;
  theme: TopicThemeKey;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-36 border-b border-white/8">
      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8 lg:py-14">
        <ScrollReveal>
          <div className={cn('rounded-2xl border border-white/12 p-8 lg:p-12 shadow-xl', topicClasses(theme).card)}>
            {children}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function SicurezzaExplorer({ locale, labels }: SicurezzaExplorerProps) {
  const isIT = locale === 'it';
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<SectionId>('emergenza');

  const sectionLabels: Record<SectionId, string> = {
    emergenza: labels.navEmergency,
    responsabilita: labels.navResponsibility,
    equipaggiamento: labels.navEquipment,
    meteo: labels.navWeather,
    segnali: labels.navSignals,
    soccorso: labels.navRescue,
    'buone-norme': labels.navFamily,
    contatti: labels.navContacts,
  };

  const scrollTo = useCallback((id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
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
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <Image
          src={PAGE_BG}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/84" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/55 to-ink/90" />
      </div>

      <section className="relative min-h-[58vh] overflow-hidden lg:min-h-[62vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/25 to-transparent" />
        <div className="relative mx-auto grid min-h-[58vh] max-w-6xl grid-cols-1 items-end gap-10 px-6 pb-14 pt-28 lg:min-h-[62vh] lg:grid-cols-2 lg:items-center lg:px-10 lg:pb-20">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-yellow-300"
            >
              {labels.heroEyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-display text-display-lg tracking-tighter text-snow"
            >
              {labels.heroTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-snow/90"
            >
              {labels.heroSubtitle}
            </motion.p>
          </div>
          <motion.a
            href="tel:118"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-yellow-400/50 bg-[#16140f]/95 px-8 py-10 text-center shadow-2xl backdrop-blur-sm transition-transform hover:scale-[1.02] lg:max-w-sm lg:justify-self-end"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-yellow-400/40 bg-yellow-500/10">
              <Phone size={36} className="text-yellow-300" aria-hidden />
            </div>
            <span className="font-display text-6xl tabular-nums tracking-tight text-yellow-300">118</span>
            <span className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-yellow-200/90">
              {labels.emergencyCallLabel}
            </span>
            <span className="mt-3 text-sm text-snow/75 leading-relaxed">{labels.emergencyCallHint}</span>
          </motion.a>
        </div>
      </section>

      <SectionScrollNav
        containerRef={containerRef}
        sections={SECTIONS}
        activeSection={active}
        sectionLabels={sectionLabels}
        onNavigate={scrollTo}
        ariaLabel={isIT ? 'Sezioni sicurezza' : 'Safety sections'}
        activeClassName="bg-yellow-500/20 text-yellow-200 border border-yellow-400/40"
      />

      <SectionCard id="emergenza" theme="safetyEmergency">
        <SectionHeader icon={Phone} title={labels.emergencyTitle} theme="safetyEmergency" />
        <BodyText className="mb-5">{labels.emergencyBody}</BodyText>
        <BodyText className="text-snow/80">{labels.emergencyExtra}</BodyText>
        <a
          href="tel:118"
          className="mt-8 inline-flex items-center gap-3 rounded-xl border border-yellow-400/40 bg-yellow-500/15 px-6 py-4 font-display text-2xl text-yellow-200 transition-colors hover:bg-yellow-500/25"
        >
          <Phone size={22} />
          118
        </a>
      </SectionCard>

      <SectionCard id="responsabilita" theme="safetyGeneral">
        <SectionHeader icon={Shield} title={labels.responsibilityTitle} theme="safetyGeneral" />
        <BodyText className="mb-6">{labels.responsibilityBody}</BodyText>
        <BulletList items={labels.responsibilityPoints} theme="safetyGeneral" />
      </SectionCard>

      <SectionCard id="equipaggiamento" theme="safetyEquipment">
        <SectionHeader icon={Backpack} title={labels.equipmentTitle} theme="safetyEquipment" />
        <BodyText className="mb-6">{labels.equipmentIntro}</BodyText>
        <ul className="space-y-3">
          {labels.equipmentItems.map((item) => (
            <li
              key={item}
              className={cn(
                'rounded-xl border px-5 py-4 text-[15px] leading-relaxed text-snow/90',
                topicClasses('safetyEquipment').card
              )}
            >
              {item}
            </li>
          ))}
        </ul>
        <BodyText className="mt-6 border-t border-white/10 pt-6 text-snow/75">{labels.equipmentNote}</BodyText>
      </SectionCard>

      <SectionCard id="meteo" theme="safetyWeather">
        <SectionHeader icon={Thermometer} title={labels.weatherTitle} theme="safetyWeather" />
        <BodyText className="mb-6">{labels.weatherBody}</BodyText>
        <BulletList items={labels.weatherPoints} theme="safetyWeather" />
        <div className="mt-10 border-t border-white/10 pt-8">
          <p className={cn('mb-4 font-mono text-[11px] uppercase tracking-[0.25em]', topicClasses('safetyWeather').eyebrow)}>
            {labels.weatherLinksTitle}
          </p>
          <LinkGrid links={labels.weatherLinks} theme="safetyWeather" />
        </div>
      </SectionCard>

      <SectionCard id="segnali" theme="safetySignals">
        <SectionHeader icon={AlertTriangle} title={labels.signalsTitle} theme="safetySignals" />
        <BodyText className="mb-6">{labels.signalsIntro}</BodyText>
        <ul className="space-y-3">
          {labels.signalItems.map((item) => (
            <li
              key={item}
              className={cn(
                'flex items-start gap-3 rounded-xl border px-5 py-4 text-[15px] leading-relaxed text-snow/90',
                topicClasses('safetySignals').card
              )}
            >
              <AlertTriangle size={16} className={cn('mt-1 shrink-0', topicClasses('safetySignals').icon)} />
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard id="soccorso" theme="safetyRescue">
        <SectionHeader icon={HeartPulse} title={labels.rescueTitle} theme="safetyRescue" />
        <BodyText className="mb-6">{labels.rescueIntro}</BodyText>
        <ol className="space-y-3">
          {labels.rescueSteps.map((step, i) => (
            <li
              key={step}
              className={cn('flex gap-4 rounded-xl border px-5 py-4', topicClasses('safetyRescue').card)}
            >
              <span className={cn('font-display text-2xl tabular-nums leading-none', topicClasses('safetyRescue').icon)}>
                {i + 1}
              </span>
              <span className="text-[15px] text-snow/90 leading-relaxed pt-1">{step}</span>
            </li>
          ))}
        </ol>
        <BodyText className="mt-6 text-snow/75">{labels.rescueNote}</BodyText>
      </SectionCard>

      <SectionCard id="buone-norme" theme="safetyFamily">
        <SectionHeader icon={ListChecks} title={labels.familyTitle} theme="safetyFamily" />
        <BodyText className="mb-6">{labels.familyBody}</BodyText>
        <BulletList items={labels.familyPoints} theme="safetyFamily" />
      </SectionCard>

      <section id="contatti" className="scroll-mt-36 py-10 lg:py-14">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <ScrollReveal>
            <div className={cn('rounded-2xl border border-white/12 p-8 lg:p-12 shadow-xl', topicClasses('safetyContacts').card)}>
              <SectionHeader icon={MapPin} title={labels.contactsTitle} theme="safetyContacts" />
              <BodyText className="mb-8 text-snow/80">{labels.contactsSubtitle}</BodyText>
              <LinkGrid links={labels.contactLinks} theme="safetyContacts" />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
