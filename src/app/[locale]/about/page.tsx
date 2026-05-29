import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Mail } from 'lucide-react';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import SectionPageHero from '@/components/SectionPageHero';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isIT = locale === 'it';
  return {
    title: isIT ? 'Chi siamo' : 'About',
    description: isIT
      ? "Un progetto indipendente nato dalla passione per la Valle d'Aosta e per i sentieri di montagna."
      : 'An independent project born from a passion for Aosta Valley and mountain trails.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/about`,
      languages: {
        it: `${SITE_URL}/it/about`,
        en: `${SITE_URL}/en/about`,
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');

  return (
    <div>
      <SectionPageHero
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        section="about"
        locale={locale}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
        <div className="max-w-2xl">
          {locale === 'it' ? (
          <div className="prose prose-invert prose-lg max-w-none space-y-6 text-snow/70 leading-relaxed">
            <p>
              Ho cominciato a camminare in Valle d'Aosta quasi per caso, una domenica di luglio con
              le scarpe sbagliate e una cartina strappata. Poi è diventata un'abitudine, poi una
              necessità. Oggi non riesco a immaginare un'estate senza almeno una settimana di
              tappe sull'Alta Via 1.
            </p>
            <p>
              Sentieri VdA nasce dalla frustrazione: ogni volta che cercavo informazioni
              affidabili sui percorsi — dislivelli precisi, condizioni attuali, rifugi aperti,
              fonti ufficiali — trovavo dati contraddittori, testi copiati da altri siti, foto
              che non corrispondevano ai luoghi. Ho deciso di fare la cosa bene.
            </p>
            <p>
              I dati che trovi qui provengono esclusivamente dal Catasto Sentieri della Regione
              Valle d'Aosta, da OpenStreetMap e da fonti CAI verificate. Le descrizioni le
              scrivo io, di persona, dopo aver camminato i percorsi o dopo ricerca accurata. Le
              foto sono Wikimedia Commons con licenza CC o immagini con attribuzione esplicita.
              Non invento nulla, non copio.
            </p>
            <p>
              Questo è un progetto personale e indipendente. Non ho redazioni, sponsor, o
              obiettivi commerciali al momento — solo l'intenzione di costruire la risorsa sui
              sentieri valdostani che avrei voluto trovare io da escursionista. Se trovi un
              errore, un dato impreciso o vuoi contribuire, scrivi.
            </p>
          </div>
        ) : (
          <div className="prose prose-invert prose-lg max-w-none space-y-6 text-snow/70 leading-relaxed">
            <p>
              I started walking in Aosta Valley almost by chance — a Sunday in July with the wrong
              shoes and a torn map. Then it became a habit, then a necessity. Today I cannot imagine
              a summer without at least a week of stages on the Alta Via 1.
            </p>
            <p>
              Sentieri VdA was born out of frustration: every time I searched for reliable information
              on the routes — precise elevation data, current conditions, open refuges, official
              sources — I found contradictory data, texts copied from other sites, photos that
              did not match the places. I decided to do it properly.
            </p>
            <p>
              The data you find here comes exclusively from the Aosta Valley Region's official trail
              registry (Catasto Sentieri), OpenStreetMap and verified CAI sources. I write the
              descriptions myself, personally, after walking the routes or after careful research. The
              photos are Wikimedia Commons CC-licensed images or images with explicit attribution.
              I invent nothing, I copy nothing.
            </p>
            <p>
              This is a personal, independent project. There are no editorial teams, sponsors, or
              commercial objectives at present — only the intention to build the Aosta Valley trail
              resource I would have wanted to find as a hiker. If you find an error, imprecise data,
              or would like to contribute, write to me.
            </p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-snow/40 text-sm font-mono mb-4">{t('contact')}</p>
          <a
            href="mailto:info@sentierivda.it"
            className="inline-flex items-center gap-2 text-sm text-alpenglow hover:text-alpenglow/80 transition-colors"
          >
            <Mail size={14} />
            info@sentierivda.it
          </a>
        </div>
      </div>
    </div>
    </div>
  );
}
