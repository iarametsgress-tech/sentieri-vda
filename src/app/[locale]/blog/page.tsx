import { setRequestLocale } from 'next-intl/server';
import { BookOpen } from 'lucide-react';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import NewsletterForm from '@/components/NewsletterForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isIT = locale === 'it';
  return {
    title: isIT ? 'Diario di montagna' : 'Mountain Journal',
    description: isIT
      ? "Racconti, note di campo, consigli tecnici e reportage fotografici dai sentieri della Valle d'Aosta. In arrivo."
      : "Stories, field notes, technical tips and photo essays from the trails of Aosta Valley. Coming soon.",
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages: {
        it: `${SITE_URL}/it/blog`,
        en: `${SITE_URL}/en/blog`,
      },
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isIT = locale === 'it';

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-32">
      <div className="max-w-2xl">
        <div className="w-14 h-14 rounded-2xl border border-alpenglow/30 flex items-center justify-center mb-8">
          <BookOpen size={24} className="text-alpenglow" />
        </div>

        <p className="text-xs font-mono tracking-widest text-alpenglow/80 uppercase mb-4">
          {isIT ? 'Diario di montagna' : 'Mountain journal'}
        </p>

        <h1 className="font-display text-display-lg tracking-tighter mb-6">
          {isIT ? 'In arrivo.' : 'Coming soon.'}
        </h1>

        <p className="text-snow/60 text-lg leading-relaxed mb-6">
          {isIT
            ? "Il diario di montagna sarà uno spazio per racconti di tappa, note di campo scritte sul posto, consigli tecnici su attrezzatura e meteo, e reportage fotografici dai sentieri della Valle d'Aosta."
            : "The mountain journal will be a space for stage reports, field notes written on location, technical advice on gear and weather, and photo essays from the trails of Aosta Valley."}
        </p>

        <p className="text-snow/60 text-lg leading-relaxed mb-10">
          {isIT
            ? 'Iscriviti alla newsletter per non perdere il primo articolo — e per ricevere aggiornamenti sulle condizioni dei sentieri prima delle stagioni più frequentate.'
            : 'Subscribe to the newsletter to catch the first article — and to receive trail condition updates before the busiest seasons.'}
        </p>

        {/* Newsletter form */}
        <NewsletterForm
          placeholder={isIT ? 'la-tua@email.it' : 'your@email.com'}
          cta={isIT ? 'Iscriviti' : 'Subscribe'}
        />
      </div>
    </div>
  );
}
