import { setRequestLocale, getTranslations } from 'next-intl/server';
import Hero from '@/components/Hero';
import AlphaBanner from '@/components/AlphaBanner';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import AdSlot from '@/components/AdSlot';
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="w-full h-[520px] rounded-2xl bg-white/[0.03] animate-pulse" />,
});
import CounterStat from '@/components/CounterStat';
import ScrollReveal from '@/components/ScrollReveal';
import { getAllTrails, getTotalTrailKm, getTotalAlteViaStages } from '@/lib/trails';
import { getAlteViaStages } from '@/lib/alte-vie';
import { mergeTrailsGeoJSON } from '@/lib/gpx';
import type { RouteHighlight } from '@/components/MapView';
import { Link } from '@/i18n/routing';
import { trailImageBlurProps } from '@/lib/blur';
import { ArrowUpRight, Mountain, Footprints, Map, Sun } from 'lucide-react';
import HomeNewsEvents from '@/components/HomeNewsEvents';
import eventsData from '@/data/events.json';
import { getAllArticoliPosts } from '@/lib/articoli';

const LK = (locale: string) => (['it', 'en', 'fr', 'de'].includes(locale) ? locale : 'it');

const HOME_AV_IMAGE =
  '/trails/alta-via-1-tappa-16-rifugio-frassati-rifugio-bonatti.webp';
const HOME_TOUR_IMAGE =
  '/trails/tour-mont-blanc-tappa-3-rifugio-bonatti-rifugio-elena.webp';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const trailCount = getAllTrails().length;
  const totalKm = getTotalTrailKm();
  const alteViaStages = getTotalAlteViaStages();
  const lk = LK(locale);

  const events = (eventsData as Record<string, string>[]).map((e) => ({
    id: e.id,
    when: e[`when_${lk}`],
    title: e[`title_${lk}`],
    body: e[`body_${lk}`],
    cover: e.cover,
    url: e.url,
  }));

  const eventsLabels = {
    eyebrow: { it: 'News & eventi', en: 'News & events', fr: 'Actualités & événements', de: 'News & Veranstaltungen' }[lk]!,
    title: { it: 'Cosa succede in valle', en: "What's on in the valley", fr: 'Que se passe-t-il dans la vallée', de: 'Was im Tal los ist' }[lk]!,
    subtitle: {
      it: 'I grandi appuntamenti della Valle d’Aosta lungo l’anno: fiere, feste della tradizione, sport e cultura di montagna.',
      en: 'The Aosta Valley’s great events through the year: fairs, traditional festivals, mountain sport and culture.',
      fr: 'Les grands rendez-vous du Val d’Aoste au fil de l’année : foires, fêtes traditionnelles, sport et culture de montagne.',
      de: 'Die großen Termine des Aostatals im Jahreslauf: Messen, Traditionsfeste, Bergsport und -kultur.',
    }[lk]!,
    more: { it: 'Scopri di più', en: 'Find out more', fr: 'En savoir plus', de: 'Mehr erfahren' }[lk]!,
    prev: { it: 'Precedente', en: 'Previous', fr: 'Précédent', de: 'Zurück' }[lk]!,
    next: { it: 'Successivo', en: 'Next', fr: 'Suivant', de: 'Weiter' }[lk]!,
  };

  const articles = getAllArticoliPosts(locale).slice(0, 3);
  const articlesLabels = {
    eyebrow: { it: 'Dal magazine', en: 'From the magazine', fr: 'Du magazine', de: 'Aus dem Magazin' }[lk]!,
    title: { it: 'Guide e ispirazione', en: 'Guides & inspiration', fr: 'Guides & inspiration', de: 'Guides & Inspiration' }[lk]!,
    all: { it: 'Tutti gli articoli', en: 'All articles', fr: 'Tous les articles', de: 'Alle Artikel' }[lk]!,
  };

  const paths = [
    {
      title: t('pathAv1Title'),
      sub: t('pathAv1Sub'),
      href: '/alte-vie',
      icon: Mountain,
      color: 'from-ice/10 to-transparent',
      border: 'border-ice/20 hover:border-ice/50',
    },
    {
      title: t('pathTmbTitle'),
      sub: t('pathTmbSub'),
      href: '/tour',
      icon: Footprints,
      color: 'from-alpenglow/10 to-transparent',
      border: 'border-alpenglow/20 hover:border-alpenglow/50',
    },
    {
      title: t('pathGpTitle'),
      sub: t('pathGpSub'),
      href: '/sentieri',
      icon: Sun,
      color: 'from-emerald-500/10 to-transparent',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
    },
    {
      title: t('pathDayTitle'),
      sub: t('pathDaySub'),
      href: '/sentieri',
      icon: Map,
      color: 'from-white/5 to-transparent',
      border: 'border-white/10 hover:border-white/30',
    },
  ];

  const av1Stages = getAlteViaStages('alta-via-1');
  const av2Stages = getAlteViaStages('alta-via-2');
  const av1Geo = mergeTrailsGeoJSON(av1Stages.map((s) => s.slug));
  const av2Geo = mergeTrailsGeoJSON(av2Stages.map((s) => s.slug));

  const routeHighlights: RouteHighlight[] = [];
  if (av1Geo && av1Stages[0]) {
    routeHighlights.push({
      id: 'av1',
      geojson: av1Geo,
      lineColor: '#D4A574',
      label: t('mapAv1'),
      href: `/${locale}/alte-vie?route=av1`,
      labelCoords: [
        av1Stages[0].start.coords.lng,
        av1Stages[0].start.coords.lat,
      ],
    });
  }
  if (av2Geo && av2Stages[0]) {
    routeHighlights.push({
      id: 'av2',
      geojson: av2Geo,
      lineColor: '#5BC0EB',
      label: t('mapAv2'),
      href: `/${locale}/alte-vie?route=av2`,
      labelCoords: [
        av2Stages[0].start.coords.lng,
        av2Stages[0].start.coords.lat,
      ],
    });
  }

  return (
    <>
      <AlphaBanner />
      <Hero />

      <section className="border-y border-white/5 bg-white/[0.01]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 lg:grid-cols-4 lg:gap-6 lg:px-10 lg:py-20">
          <CounterStat
            value={trailCount}
            label={t('statTrails')}
            duration={1600}
          />
          <CounterStat
            value={alteViaStages}
            suffix={t('statStagesSuffix')}
            label={t('statAlteVie')}
            duration={1400}
          />
          <CounterStat
            value={totalKm}
            suffix=" km"
            label={t('statTotalKm')}
            duration={2200}
          />
          <CounterStat
            value={6}
            suffix={t('statToursSuffix')}
            label={t('statTours')}
            duration={1000}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <ScrollReveal variant="slide-right" delay={0.05}>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-alpenglow">
                {t('featuredEyebrow')}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={0.1}>
              <h2 className="font-display text-display-lg max-w-2xl tracking-tighter">
                {t('featuredTitle')}
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal variant="fade-in" delay={0.2}>
            <Link
              href="/alte-vie"
              className="group hidden items-center gap-1.5 text-sm text-snow/50 transition-colors hover:text-snow sm:inline-flex"
            >
              {t('featuredCta')}
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ScrollReveal variant="fade-up" delay={0.05}>
            <Link
              href="/alte-vie"
              className="group relative block overflow-hidden rounded-2xl border border-ice/20 bg-gradient-to-br from-ice/10 to-transparent transition-all duration-300 hover:-translate-y-1 hover:border-ice/45 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={HOME_AV_IMAGE}
                  alt={t('featuredAvTitle')}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  {...trailImageBlurProps(HOME_AV_IMAGE)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full border border-ice/40 bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ice">
                  AV1 · AV2
                </span>
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl text-snow tracking-tight mb-2 group-hover:text-ice transition-colors">
                  {t('featuredAvTitle')}
                </h3>
                <p className="text-sm text-snow/55 leading-relaxed mb-4">{t('featuredAvSub')}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-snow/55 group-hover:text-ice transition-colors">
                  {t('exploreCta')}
                  <ArrowUpRight size={12} />
                </span>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.12}>
            <Link
              href="/tour"
              className="group relative block overflow-hidden rounded-2xl border border-alpenglow/20 bg-gradient-to-br from-alpenglow/10 to-transparent transition-all duration-300 hover:-translate-y-1 hover:border-alpenglow/45 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={HOME_TOUR_IMAGE}
                  alt={t('featuredTourTitle')}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  {...trailImageBlurProps(HOME_TOUR_IMAGE)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full border border-alpenglow/40 bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-alpenglow">
                  Tour
                </span>
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl text-snow tracking-tight mb-2 group-hover:text-alpenglow transition-colors">
                  {t('featuredTourTitle')}
                </h3>
                <p className="text-sm text-snow/55 leading-relaxed mb-4">{t('featuredTourSub')}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-snow/55 group-hover:text-alpenglow transition-colors">
                  {t('exploreCta')}
                  <ArrowUpRight size={12} />
                </span>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <ScrollReveal variant="fade-up">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-alpenglow">
            {t('choosePathEyebrow')}
          </p>
          <h2 className="mb-12 font-display text-display-md tracking-tighter">
            {t('choosePathTitle')}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((path, i) => {
            const Icon = path.icon;
            return (
              <ScrollReveal key={path.title} variant="fade-up" delay={i * 0.07}>
                <Link
                  href={path.href}
                  className={`group block rounded-xl border bg-gradient-to-b p-6 ${path.color} ${path.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]`}
                >
                  <Icon
                    size={22}
                    className="mb-4 text-snow/50 transition-colors group-hover:text-snow"
                  />
                  <p className="mb-1.5 font-display text-xl tracking-tight text-snow">
                    {path.title}
                  </p>
                  <p className="text-xs leading-relaxed text-snow/55">{path.sub}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-snow/50 transition-colors group-hover:text-snow/70">
                    {t('exploreCta')}
                    <ArrowUpRight
                      size={11}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <AdSlot slot="header-billboard" />
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-10">
        <ScrollReveal variant="fade-up">
          <h2 className="mb-4 font-display text-display-md tracking-tighter">
            {t('exploreMapTitle')}
          </h2>
          <p className="mb-10 max-w-xl text-snow/55">
            {t('exploreMapDescription')}
          </p>
        </ScrollReveal>
        <ScrollReveal variant="scale" delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.6)]">
            <MapView
              className="h-[600px] w-full"
              zoom={9}
              showOfficialTrails
              routeHighlights={routeHighlights}
            />
          </div>
        </ScrollReveal>
      </section>

      {/* News & eventi — carosello con freccia, prima degli articoli */}
      <div className="border-t border-white/5 bg-white/[0.01]">
        <HomeNewsEvents events={events} labels={eventsLabels} />
      </div>

      {/* 3 articoli principali */}
      {articles.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-alpenglow">
                {articlesLabels.eyebrow}
              </p>
              <h2 className="font-display text-display-md tracking-tighter">{articlesLabels.title}</h2>
            </div>
            <Link
              href="/articoli"
              className="group hidden items-center gap-1.5 text-sm text-snow/50 transition-colors hover:text-snow sm:inline-flex"
            >
              {articlesLabels.all}
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map((a, i) => (
              <ScrollReveal key={a.slug} variant="fade-up" delay={i * 0.08}>
                <Link href={`/articoli/${a.slug}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all hover:-translate-y-1 hover:border-alpenglow/30">
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink/40">
                    {a.cover ? (
                      <Image
                        src={a.cover}
                        alt={a.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 400px"
                        {...trailImageBlurProps(a.cover)}
                      />
                    ) : null}
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 font-display text-xl tracking-tight text-snow group-hover:text-alpenglow">
                      {a.title}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-snow/55">{a.description}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
