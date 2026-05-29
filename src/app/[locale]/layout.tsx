import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSenseScript from '@/components/AdSenseScript';
import { SITE_URL } from '@/lib/config';
import {
  localeAlternates,
  localeAlternatesAbsolute,
  localeOpenGraph,
  localeSiteMeta,
} from '@/lib/metadata-languages';
import '../globals.css';

const PageTransition = dynamic(() => import('@/components/PageTransition'), {
  ssr: false,
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
    alternates: {
      canonical: `/${locale}`,
      languages: localeAlternates(''),
    },
    openGraph: {
      type: 'website',
      locale: localeOpenGraph(locale),
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
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </NextIntlClientProvider>
        <AdSenseScript />
      </body>
    </html>
  );
}
