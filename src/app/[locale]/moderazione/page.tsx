import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import ModerationPanel from '@/components/ModerationPanel';

export const metadata: Metadata = {
  title: 'Moderazione foto community',
  robots: { index: false, follow: false },
};

export default async function ModerationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-alpenglow mb-3">
        Area riservata
      </p>
      <h1 className="font-display text-display-md tracking-tighter mb-4">
        Moderazione foto community
      </h1>
      <p className="text-snow/65 mb-10 max-w-2xl">
        Le foto caricate dai visitatori restano in attesa finché non vengono approvate.
        Approva solo immagini pertinenti (sentieri, rifugi, paesaggi) e senza persone
        riconoscibili in primo piano.
      </p>
      <ModerationPanel />
    </div>
  );
}
