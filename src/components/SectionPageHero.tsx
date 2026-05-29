import Image from 'next/image';
import { pickLocalized } from '@/lib/locale-content';

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
    src: '/trails/gran-paradiso.jpg',
    altIt: 'Sentieri nel Parco Nazionale del Gran Paradiso',
    altEn: 'Trails in Gran Paradiso National Park',
  },
  rifugi: {
    src: '/refuges/rifugio-bonatti.jpg',
    altIt: 'Rifugio Bonatti sul Tour del Monte Bianco',
    altEn: 'Rifugio Bonatti on the Tour du Mont Blanc',
  },
  tour: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Grandes_Jorasses_-_Val_Ferret%2C_Courmayeur%2C_Aosta%2C_Italy_-_August_8%2C_2016.jpg/1280px-Grandes_Jorasses_-_Val_Ferret%2C_Courmayeur%2C_Aosta%2C_Italy_-_August_8%2C_2016.jpg',
    altIt: 'Grandes Jorasses viste dalla Val Ferret, Courmayeur',
    altEn: 'Grandes Jorasses from Val Ferret, Courmayeur',
  },
  'flora-fauna': {
    src: '/species/camoscio.jpg',
    altIt: 'Camoscio alpino in Valle d\'Aosta',
    altEn: 'Alpine chamois in Aosta Valley',
  },
  about: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mont_Blanc_from_Val_Ferret_2.jpg/1280px-Mont_Blanc_from_Val_Ferret_2.jpg',
    altIt: 'Monte Bianco dalla Val Ferret',
    altEn: 'Mont Blanc from Val Ferret',
  },
  'alte-vie': {
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
