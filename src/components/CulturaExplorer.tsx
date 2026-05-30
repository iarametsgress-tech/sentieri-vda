'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Landmark, UtensilsCrossed, ExternalLink } from 'lucide-react';
import LinkedText from '@/components/LinkedText';
import SectionScrollNav from '@/components/SectionScrollNav';
import { topicClasses } from '@/lib/topic-themes';
import { cn } from '@/lib/cn';
import type { Valley, Tradition, FoodWineItem, CulturaSectionId } from '@/lib/culture-types';
import SceneDivider from '@/components/SceneDivider';
import {
  getValleyName,
  getValleyEyebrow,
  getValleyDescription,
  getTownName,
  getTownDescription,
  getTraditionTitle,
  getTraditionBody,
  getFoodWineTitle,
  getFoodWineBody,
  getImageCredit,
} from '@/lib/culture';

function ImageCredit({
  item,
}: {
  item: { image_credit?: string; image_source?: string };
}) {
  const c = getImageCredit(item);
  if (!c) return null;
  const text = `© ${c.credit}`;
  return (
    <span className="text-on-image-sm pointer-events-auto absolute bottom-1.5 right-2 z-10 font-mono text-[9px] text-snow/55">
      {c.source ? (
        <a
          href={c.source}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-snow/90"
        >
          {text}
        </a>
      ) : (
        text
      )}
    </span>
  );
}

const SECTIONS: { id: CulturaSectionId; icon: typeof MapPin }[] = [
  { id: 'valli', icon: MapPin },
  { id: 'tradizioni', icon: Landmark },
  { id: 'cibo-vino', icon: UtensilsCrossed },
];

const TRADITION_CATEGORY: Record<string, { it: string; en: string }> = {
  costumi: { it: 'Costumi', en: 'Costumes' },
  feste: { it: 'Feste', en: 'Festivals' },
  musica: { it: 'Musica', en: 'Music' },
  folklore: { it: 'Folklore', en: 'Folklore' },
  devozione: { it: 'Devozione', en: 'Devotion' },
};

const FOOD_TYPE: Record<string, { it: string; en: string }> = {
  food: { it: 'Piatto', en: 'Dish' },
  cheese: { it: 'Formaggio', en: 'Cheese' },
  wine: { it: 'Vino', en: 'Wine' },
};

interface CulturaExplorerProps {
  locale: string;
  valleys: Valley[];
  traditions: Tradition[];
  foodWine: FoodWineItem[];
  labels: {
    navValli: string;
    navTradizioni: string;
    navCiboVino: string;
    valliTitle: string;
    valliSubtitle: string;
    tradizioniTitle: string;
    tradizioniSubtitle: string;
    ciboTitle: string;
    ciboSubtitle: string;
    townsTitle: string;
    officialSite: string;
    source: string;
    readMore: string;
    vdaFooterNote: string;
    vdaFooterLink: string;
  };
}

function ValleyCard({
  valley,
  locale,
  labels,
  highlighted,
  highlightedTownId,
}: {
  valley: Valley;
  locale: string;
  labels: CulturaExplorerProps['labels'];
  highlighted?: boolean;
  highlightedTownId?: string | null;
}) {
  return (
    <motion.article
      id={`valley-${valley.id}`}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className={cn(
        'scroll-mt-40 overflow-hidden rounded-2xl border transition-all',
        topicClasses('culture').card,
        highlighted
          ? 'border-alpenglow/50 ring-2 ring-alpenglow/20'
          : 'hover:border-white/20'
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-2 min-h-[200px]">
          <Image
            src={valley.image}
            alt={getValleyName(valley, locale)}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent lg:bg-gradient-to-r" />
          <ImageCredit item={valley} />
        </div>
        <div className="lg:col-span-3 p-6 lg:p-8">
          <p className={cn('font-mono text-[10px] uppercase tracking-[0.3em] mb-2', topicClasses('culture').eyebrow)}>
            {getValleyEyebrow(valley, locale)}
          </p>
          <h3 className="font-display text-2xl text-snow tracking-tight mb-3">
            {getValleyName(valley, locale)}
          </h3>
          <p className="text-snow/65 leading-relaxed text-sm mb-4">
            <LinkedText text={getValleyDescription(valley, locale)} locale={locale} />
          </p>
          {valley.towns.length > 0 ? (
            <div className="mb-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-snow/55 mb-3">
                {labels.townsTitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {valley.towns.map((town) => (
                  <div
                    key={town.id}
                    id={`town-${town.id}`}
                    className={`rounded-xl border p-4 transition-colors ${
                      highlightedTownId === town.id
                        ? 'border-ice/40 bg-ice/5'
                        : 'border-white/8 bg-white/[0.02]'
                    }`}
                  >
                    <p className="font-display text-base text-snow mb-1">
                      {getTownName(town, locale)}
                    </p>
                    <p className="text-xs text-snow/55 leading-relaxed line-clamp-3 mb-2">
                      <LinkedText text={getTownDescription(town, locale)} locale={locale} />
                    </p>
                    {town.official_url ? (
                      <a
                        href={town.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-alpenglow hover:text-snow"
                      >
                        {labels.officialSite}
                        <ExternalLink size={10} />
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/8">
            {valley.official_url ? (
              <a
                href={valley.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-alpenglow hover:text-snow"
              >
                {labels.officialSite}
                <ExternalLink size={12} />
              </a>
            ) : null}
            <p className="text-[10px] text-snow/50 font-mono">
              {labels.source}: {valley.source}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function TraditionCard({
  item,
  locale,
  labels,
  highlighted,
}: {
  item: Tradition;
  locale: string;
  labels: CulturaExplorerProps['labels'];
  highlighted?: boolean;
}) {
  const cat = TRADITION_CATEGORY[item.category];
  const catLabel = locale === 'it' ? cat?.it : cat?.en;
  return (
    <motion.article
      id={`tradition-${item.id}`}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className={cn(
        'scroll-mt-40 overflow-hidden rounded-2xl border',
        topicClasses('traditions').card,
        highlighted ? 'border-alpenglow/50 ring-2 ring-alpenglow/20' : ''
      )}
    >
      <div className="relative aspect-[16/9]">
        <Image src={item.image} alt={getTraditionTitle(item, locale)} fill className="object-cover" sizes="400px" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full border border-white/20 bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-snow/80">
          {catLabel}
        </span>
        <ImageCredit item={item} />
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-snow mb-3">{getTraditionTitle(item, locale)}</h3>
        <p className="text-sm text-snow/65 leading-relaxed">
          {getTraditionBody(item, locale)}
        </p>
      </div>
    </motion.article>
  );
}

function FoodWineCard({
  item,
  locale,
  labels,
  highlighted,
}: {
  item: FoodWineItem;
  locale: string;
  labels: CulturaExplorerProps['labels'];
  highlighted?: boolean;
}) {
  const typeLabel = FOOD_TYPE[item.type];
  return (
    <motion.article
      id={`item-${item.id}`}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className={cn(
        'scroll-mt-40 overflow-hidden rounded-2xl border transition-colors hover:border-alpenglow/25',
        topicClasses('food').card,
        highlighted ? 'border-alpenglow/50 ring-2 ring-alpenglow/20' : ''
      )}
    >
      <div className="relative aspect-[4/3]">
        <Image src={item.image} alt={getFoodWineTitle(item, locale)} fill className="object-cover" sizes="350px" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <span className="absolute top-3 right-3 rounded-full border border-ice/30 bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ice">
          {locale === 'it' ? typeLabel?.it : typeLabel?.en}
        </span>
        <ImageCredit item={item} />
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-snow mb-2">{getFoodWineTitle(item, locale)}</h3>
        <p className="text-sm text-snow/65 leading-relaxed line-clamp-6">
          {getFoodWineBody(item, locale)}
        </p>
      </div>
    </motion.article>
  );
}

export default function CulturaExplorer({
  locale,
  valleys,
  traditions,
  foodWine,
  labels,
}: CulturaExplorerProps) {
  const searchParams = useSearchParams();
  const valleParam = searchParams.get('valle');
  const tradizioneParam = searchParams.get('tradizione');
  const itemParam = searchParams.get('item');

  const [activeSection, setActiveSection] = useState<CulturaSectionId>('valli');
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((id: CulturaSectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'valli' || hash === 'tradizioni' || hash === 'cibo-vino') {
      setTimeout(() => scrollTo(hash as CulturaSectionId), 100);
    }
  }, [scrollTo]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (valleParam) {
        scrollTo('valli');
        window.setTimeout(() => {
          document.getElementById(`valley-${valleParam}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      } else if (tradizioneParam) {
        scrollTo('tradizioni');
        window.setTimeout(() => {
          document.getElementById(`tradition-${tradizioneParam}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      } else if (itemParam) {
        scrollTo('cibo-vino');
        window.setTimeout(() => {
          document.getElementById(`item-${itemParam}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }, 150);
    return () => window.clearTimeout(timer);
  }, [valleParam, tradizioneParam, itemParam, scrollTo]);

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

  const sectionLabels: Record<CulturaSectionId, string> = {
    valli: labels.navValli,
    tradizioni: labels.navTradizioni,
    'cibo-vino': labels.navCiboVino,
  };

  const highlightedTownId = valleParam ? searchParams.get('town') : null;

  return (
    <div ref={containerRef}>
      <SectionScrollNav
        containerRef={containerRef}
        sections={SECTIONS}
        activeSection={activeSection}
        sectionLabels={sectionLabels}
        onNavigate={scrollTo}
        ariaLabel={locale === 'it' ? 'Sezioni cultura' : 'Culture sections'}
      />

      <section
        id="valli"
        className={cn('scroll-mt-36 border-b border-white/5 py-16 lg:py-24', topicClasses('culture').section)}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 max-w-2xl">
            <p className={cn('mb-3 font-mono text-[11px] uppercase tracking-[0.3em]', topicClasses('culture').eyebrow)}>
              {locale === 'it' ? 'Valli e comuni' : 'Valleys & towns'}
            </p>
            <h2 className="font-display text-display-md tracking-tighter mb-4">{labels.valliTitle}</h2>
            <p className="text-snow/55 leading-relaxed">{labels.valliSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {valleys.map((v) => (
              <ValleyCard
                key={v.id}
                valley={v}
                locale={locale}
                labels={labels}
                highlighted={valleParam === v.id}
                highlightedTownId={valleParam === v.id ? highlightedTownId : null}
              />
            ))}
          </div>
        </div>
      </section>

      <SceneDivider
        image="/cultura/traditions-divider.jpg"
        title={locale === 'it' ? 'Tradizioni' : 'Traditions'}
        subtitle={locale === 'it'
          ? 'Carnevali, costumi, musica e devozione — le radici culturali vive della Valle d\'Aosta'
          : 'Carnivals, costumes, music and devotion — the living cultural roots of Aosta Valley'}
      />

      <section
        id="tradizioni"
        className={cn('scroll-mt-36 border-b border-white/5 py-16 lg:py-24', topicClasses('traditions').section)}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 max-w-2xl">
            <p className={cn('mb-3 font-mono text-[11px] uppercase tracking-[0.3em]', topicClasses('traditions').eyebrow)}>
              {locale === 'it' ? 'Tradizioni' : 'Traditions'}
            </p>
            <h2 className="font-display text-display-md tracking-tighter mb-4">{labels.tradizioniTitle}</h2>
            <p className="text-snow/55 leading-relaxed">{labels.tradizioniSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {traditions.map((t) => (
              <TraditionCard
                key={t.id}
                item={t}
                locale={locale}
                labels={labels}
                highlighted={tradizioneParam === t.id}
              />
            ))}
          </div>
        </div>
      </section>

      <SceneDivider
        image="/cultura/fontina.jpg"
        title={locale === 'it' ? 'Cibo e Vino' : 'Food & Wine'}
        subtitle={locale === 'it'
          ? 'Fontina DOP, Jambon de Bosses, Lardo d\'Arnad — i sapori autentici dell\'alta quota valdostana'
          : 'Fontina PDO, Jambon de Bosses, Lardo d\'Arnad — the authentic flavours of Valdostan high altitude'}
      />

      <section
        id="cibo-vino"
        className={cn('scroll-mt-36 py-16 lg:py-24', topicClasses('food').section)}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 max-w-2xl">
            <p className={cn('mb-3 font-mono text-[11px] uppercase tracking-[0.3em]', topicClasses('food').eyebrow)}>
              {locale === 'it' ? 'Enogastronomia' : 'Food & wine'}
            </p>
            <h2 className="font-display text-display-md tracking-tighter mb-4">{labels.ciboTitle}</h2>
            <p className="text-snow/55 leading-relaxed">{labels.ciboSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodWine.map((f) => (
              <FoodWineCard
                key={f.id}
                item={f}
                locale={locale}
                labels={labels}
                highlighted={itemParam === f.id}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 bg-white/[0.01] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 text-center">
          <p className="text-snow/50 text-sm mb-4 max-w-xl mx-auto leading-relaxed">
            {labels.vdaFooterNote}
          </p>
          <a
            href="https://www.lovevda.it/it/territorio-e-cultura"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-alpenglow/30 bg-alpenglow/10 px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-alpenglow hover:bg-alpenglow/20 hover:text-snow transition-colors"
          >
            {labels.vdaFooterLink}
            <ExternalLink size={14} />
          </a>
        </div>
      </section>
    </div>
  );
}
