'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Landmark, UtensilsCrossed, ExternalLink } from 'lucide-react';
import LinkedText from '@/components/LinkedText';
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className={`scroll-mt-40 overflow-hidden rounded-2xl border bg-white/[0.02] transition-all ${
        highlighted
          ? 'border-alpenglow/50 ring-2 ring-alpenglow/20'
          : 'border-white/10 hover:border-white/20'
      }`}
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
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-alpenglow mb-2">
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
              <p className="font-mono text-[10px] uppercase tracking-widest text-snow/40 mb-3">
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
            <p className="text-[10px] text-snow/35 font-mono">
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className={`scroll-mt-40 overflow-hidden rounded-2xl border bg-white/[0.02] ${
        highlighted ? 'border-alpenglow/50 ring-2 ring-alpenglow/20' : 'border-white/10'
      }`}
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
          <LinkedText text={getTraditionBody(item, locale)} locale={locale} />
        </p>
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          {item.official_url ? (
            <a
              href={item.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-alpenglow hover:text-snow"
            >
              {labels.officialSite}
              <ExternalLink size={12} />
            </a>
          ) : null}
          <span className="text-[10px] text-snow/35 font-mono">{item.source}</span>
        </div>
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className={`scroll-mt-40 overflow-hidden rounded-2xl border bg-white/[0.02] hover:border-alpenglow/25 transition-colors ${
        highlighted ? 'border-alpenglow/50 ring-2 ring-alpenglow/20' : 'border-white/10'
      }`}
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
          <LinkedText text={getFoodWineBody(item, locale)} locale={locale} />
        </p>
        {item.official_url ? (
          <a
            href={item.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-alpenglow hover:text-snow"
          >
            {labels.officialSite}
            <ExternalLink size={12} />
          </a>
        ) : null}
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

  const sectionLabels: Record<CulturaSectionId, string> = {
    valli: labels.navValli,
    tradizioni: labels.navTradizioni,
    'cibo-vino': labels.navCiboVino,
  };

  const highlightedTownId = valleParam ? searchParams.get('town') : null;

  return (
    <div>
      <nav
        aria-label={locale === 'it' ? 'Sezioni cultura' : 'Culture sections'}
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
      </nav>

      <section id="valli" className="scroll-mt-36 border-b border-white/5 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 max-w-2xl">
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
        image="/cultura/walser-titsch.jpg"
        title={locale === 'it' ? 'Tradizioni' : 'Traditions'}
        subtitle={locale === 'it'
          ? 'Carnevali, costumi, musica e devozione — le radici culturali vive della Valle d\'Aosta'
          : 'Carnivals, costumes, music and devotion — the living cultural roots of Aosta Valley'}
      />

      <section id="tradizioni" className="scroll-mt-36 border-b border-white/5 bg-white/[0.01] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 max-w-2xl">
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

      <section id="cibo-vino" className="scroll-mt-36 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 max-w-2xl">
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
    </div>
  );
}
