import Image from 'next/image';
import { pickLocalized } from '@/lib/locale-content';
import { trailImageBlurProps } from '@/lib/blur';

export type SectionHeroId =
  | 'sentieri'
  | 'rifugi'
  | 'tour'
  | 'flora-fauna'
  | 'about'
  | 'alte-vie';

/** Foto di sfondo per hero di sezione — Wikimedia Commons o asset locali verificati */
export const SECTION_HERO_IMAGES: Record<
  SectionHeroId,
  { src: string; altIt: string; altEn: string }
> = {
  sentieri: {
    // Escursionista sul sentiero — tappa AV2 in alta quota
    src: '/trails/alta-via-2-tappa-8-eaux-rousses-rifugio-vittorio-sella.jpg',
    altIt: 'Sentiero di alta quota in Valle d\'Aosta verso il Rifugio Vittorio Sella',
    altEn: 'High-altitude trail in Aosta Valley towards Rifugio Vittorio Sella',
  },
  rifugi: {
    src: '/refuges/rifugio-bonatti.jpg',
    altIt: 'Rifugio Walter Bonatti in Val Ferret — rifugio iconico lungo Alta Via e Tour del Monte Bianco',
    altEn: 'Walter Bonatti refuge in Val Ferret — iconic hut on the High Route and Tour du Mont Blanc',
  },
  tour: {
    src: '/trails/tour-mont-blanc-tappa-4-rifugio-elena-col-seigne.webp',
    altIt: 'Ghiacciaio del Monte Bianco visto dal Col de la Seigne — Tour del Monte Bianco',
    altEn: 'Mont Blanc glacier from Col de la Seigne — Tour du Mont Blanc',
  },
  'flora-fauna': {
    // Stambecco alpino — simbolo della fauna valdostana
    src: '/species/stambecco.jpg',
    altIt: 'Stambecco alpino sulle creste della Valle d\'Aosta',
    altEn: 'Alpine ibex on the ridges of Aosta Valley',
  },
  about: {
    // Panorama Monte Bianco dall'alta via
    src: '/trails/alta-via-1-tappa-17-rifugio-bonatti-courmayeur.jpg',
    altIt: 'Monte Bianco visto dall\'Alta Via — tappa finale verso Courmayeur',
    altEn: 'Mont Blanc seen from the High Route — final stage to Courmayeur',
  },
  'alte-vie': {
    // Alta Via 1 in quota — panorama Grandes Jorasses
    src: '/trails/alta-via-1-tappa-16-rifugio-frassati-rifugio-bonatti.jpg',
    altIt: 'Alta Via 1 — Val Ferret e Grandes Jorasses',
    altEn: 'High Route 1 — Val Ferret and Grandes Jorasses',
  },
};

interface SectionPageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  section: SectionHeroId;
  locale: string;
  note?: string;
}

export default function SectionPageHero({
  eyebrow,
  title,
  subtitle,
  section,
  locale,
  note,
}: SectionPageHeroProps) {
  const image = SECTION_HERO_IMAGES[section];
  const alt = pickLocalized(locale, { it: image.altIt, en: image.altEn });
  const isRemote = image.src.startsWith('http');

  return (
    <section className="relative min-h-[52vh] overflow-hidden lg:min-h-[60vh]">
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          unoptimized={isRemote}
          {...(!isRemote ? trailImageBlurProps(image.src) : {})}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/50 to-ink/95" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/25 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[52vh] max-w-7xl flex-col justify-end px-6 pb-14 pt-28 lg:min-h-[60vh] lg:px-10 lg:pb-20 lg:pt-32">
        <p className="text-on-image-eyebrow mb-5 font-mono text-xs uppercase tracking-[0.3em] text-alpenglow">
          {eyebrow}
        </p>
        <h1 className="text-on-image-title font-display text-display-lg mb-6 max-w-4xl tracking-tighter text-snow">
          {title}
        </h1>
        <p className="text-on-image-body max-w-2xl text-lg leading-relaxed text-snow/90">
          {subtitle}
        </p>
        {note ? (
          <p className="text-on-image-muted mt-6 max-w-xl font-mono text-xs leading-relaxed text-snow/55">
            {note}
          </p>
        ) : null}
      </div>
    </section>
  );
}
