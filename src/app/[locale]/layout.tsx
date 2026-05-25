import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSenseScript from '@/components/AdSenseScript';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isIT = locale === 'it';
  return {
    metadataBase: new URL('https://sentierivda.it'),
    title: {
      default: isIT
        ? "Sentieri Valle d'Aosta — Trekking, Alte Vie, Rifugi"
        : "Aosta Valley Trails — Hiking, High Routes, Refuges",
      template: '%s — Sentieri VdA',
    },
    description: isIT
      ? "I sentieri della Valle d'Aosta raccontati con dati ufficiali, mappe interattive, fotografia. Alte Vie, Gran Paradiso, Monte Bianco, Cervino."
      : "The trails of the Aosta Valley with official data, interactive maps, photography. High Routes, Gran Paradiso, Mont Blanc, Matterhorn.",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        it: '/it',
        en: '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: isIT ? 'it_IT' : 'en_US',
      siteName: 'Sentieri VdA',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-ink text-snow min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <AdSenseScript />
      </body>
    </html>
  );
}
