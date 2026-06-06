import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Fraunces } from 'next/font/google';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiteJsonLd from '@/components/SiteJsonLd';
import AdSenseScript from '@/components/AdSenseScript';
import { SITE_URL } from '@/lib/config';
import {
  localeAlternates,
  localeAlternatesAbsolute,
  localeOpenGraph,
  localeSiteMeta,
} from '@/lib/metadata-languages';
import '../globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-fraunces',
  preload: true,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = localeSiteMeta(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.title,
      template: '%s — Sentieri VdA',
    },
    description: meta.description,
    applicationName: 'Sentieri VdA',
    keywords: [
      "sentieri Valle d'Aosta",
      'trekking Valle d\'Aosta',
      'escursioni Valle d\'Aosta',
      'Alte Vie Valle d\'Aosta',
      'Gran Paradiso trekking',
      'Tour del Monte Bianco',
      'rifugi Valle d\'Aosta',
      'mappe sentieri GPX',
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: localeAlternates(''),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    icons: {
      icon: [
        { url: '/icon.png', type: 'image/png', sizes: '512x512' },
        { url: '/favicon-48.png', type: 'image/png', sizes: '48x48' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
    },
    manifest: '/manifest.webmanifest',
    openGraph: {
      type: 'website',
      locale: localeOpenGraph(locale),
      siteName: 'Sentieri VdA',
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}`,
      images: [
        { url: '/trails/monte-bianco.webp', width: 1600, height: 900, alt: 'Sentieri VdA' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['/trails/monte-bianco.webp'],
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
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable} ${fraunces.variable}`}>
      <body className="bg-ink text-snow min-h-screen flex flex-col antialiased">
        <SiteJsonLd />
        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <AdSenseScript />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
