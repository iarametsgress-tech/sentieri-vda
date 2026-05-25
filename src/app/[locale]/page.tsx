import { setRequestLocale, getTranslations } from 'next-intl/server';
import Hero from '@/components/Hero';
import TrailCard from '@/components/TrailCard';
import MapView from '@/components/MapView';
import AdSlot from '@/components/AdSlot';
import { getFeaturedTrails } from '@/lib/trails';
import { Link } from '@/i18n/routing';
import { ArrowUpRight } from 'lucide-react';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const trails = getFeaturedTrails(6);

  return (
    <>
      <Hero />

      {/* Featured trails — editorial grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="flex items-end justify-between mb-12 lg:mb-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-alpenglow mb-4">
              {t('featuredEyebrow')}
            </p>
            <h2 className="font-display text-display-lg max-w-2xl tracking-tighter">
              {t('featuredTitle')}
            </h2>
          </div>
          <Link
            href="/sentieri"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-snow/60 hover:text-snow group"
          >
            Tutti
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {trails.map((trail, i) => (
            <TrailCard key={trail.slug} trail={trail} index={i} />
          ))}
        </div>
      </section>

      {/* Header billboard ad */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
        <AdSlot slot="header-billboard" />
      </div>

      {/* Interactive map section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-32">
        <div className="mb-8 lg:mb-12">
          <h2 className="font-display text-display-md tracking-tighter mb-4">
            {t('exploreMapTitle')}
          </h2>
          <p className="text-snow/60 max-w-xl">{t('exploreMapDescription')}</p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          <MapView className="w-full h-[600px]" zoom={9} showOfficialTrails />
        </div>
      </section>
    </>
  );
}
