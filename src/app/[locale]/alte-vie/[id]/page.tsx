import { notFound } from 'next/navigation';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Calendar, Mountain, ExternalLink } from 'lucide-react';
import AdSlot from '@/components/AdSlot';
import StageCard from '@/components/StageCard';
import { getAlteViaStages, toStageSummary } from '@/lib/alte-vie';
import { ALTE_VIE_CONTENT } from '@/lib/alte-vie-content';
import { pickLocalized } from '@/lib/locale-content';
import { trailImageBlurProps } from '@/lib/blur';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
} from '@/lib/seo';

const CONFIG = {
  av1: {
    tag: 'alta-via-1' as const,
    code: 'AV1',
    hero: '/alte-vie/alta-via-1.webp',
    accent: 'alpenglow' as const,
    guide: 'https://www.lovevda.it/it/sport/escursionismo/alte-vie/alta-via-1',
  },
  av2: {
    tag: 'alta-via-2' as const,
    code: 'AV2',
    hero: '/alte-vie/alta-via-2.webp',
    accent: 'ice' as const,
    guide: 'https://www.lovevda.it/it/sport/escursionismo/alte-vie/alta-via-2',
  },
};

type AvId = keyof typeof CONFIG;

export function generateStaticParams() {
  return (Object.keys(CONFIG) as AvId[]).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!(id in CONFIG)) return {};
  const t = await getTranslations({ locale, namespace: 'AlteVie' });
  const name = t(`${id}.name`);
  return {
    title: name,
    description: t(`${id}.description`),
    alternates: {
      canonical: `${SITE_URL}/${locale}/alte-vie/${id}`,
      languages: localeAlternatesAbsolute(`/alte-vie/${id}`),
    },
    openGraph: {
      title: name,
      description: t(`${id}.description`),
      type: 'article',
      images: [{ url: `${SITE_URL}${CONFIG[id as AvId].hero}`, width: 1600, height: 900 }],
    },
  };
}

export default async function AlteViaDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!(id in CONFIG)) notFound();
  const avId = id as AvId;
  const cfg = CONFIG[avId];
  setRequestLocale(locale);
  const t = await getTranslations('AlteVie');
  const content = ALTE_VIE_CONTENT[avId];

  const stages = getAlteViaStages(cfg.tag).map((s) => toStageSummary(s, cfg.tag, locale));
  const name = t(`${avId}.name`);
  const accentText = cfg.accent === 'alpenglow' ? 'text-alpenglow' : 'text-ice';

  const stats = [
    t(`${avId}.statKm`),
    t(`${avId}.statGain`),
    t(`${avId}.statStages`),
    t(`${avId}.statDays`),
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(locale, [
    { name: 'Home', path: `/${locale}` },
    { name: t('heroTitle'), path: `/${locale}/alte-vie` },
    { name, path: `/${locale}/alte-vie/${avId}` },
  ]);
  const collectionJsonLd = buildCollectionPageJsonLd({
    locale,
    path: `/alte-vie/${avId}`,
    name,
    description: t(`${avId}.description`),
  });

  return (
    <div className="bg-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative min-h-[56vh] overflow-hidden lg:min-h-[64vh]">
        <Image
          src={cfg.hero}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          {...trailImageBlurProps(cfg.hero)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink/95" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[56vh] max-w-7xl flex-col justify-end px-6 pb-14 pt-28 lg:min-h-[64vh] lg:px-10 lg:pb-20">
          <Link
            href="/alte-vie"
            className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-snow/70 transition-colors hover:text-snow"
          >
            <ArrowLeft size={14} />
            {t('heroTitle')}
          </Link>
          <span className={`mb-4 inline-flex w-fit rounded-full border border-white/20 bg-ink/60 px-3 py-1 font-mono text-xs font-bold tracking-widest backdrop-blur-sm ${accentText}`}>
            {cfg.code}
          </span>
          <h1 className="text-on-image-title font-display text-display-lg mb-5 max-w-4xl tracking-tighter text-snow">
            {name}
          </h1>
          <p className="text-on-image-body max-w-2xl text-lg leading-relaxed text-snow/90">
            {t(`${avId}.route`)}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        {/* Stats */}
        <div className="mb-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-4">
              <p className="font-display text-lg tabular-nums text-snow">{s}</p>
            </div>
          ))}
        </div>

        {/* Intro romanzata + descrizione */}
        <div className="mb-16 max-w-3xl space-y-6">
          <p className="font-display text-2xl leading-snug tracking-tight text-snow lg:text-3xl">
            {pickLocalized(locale, content.intro)}
          </p>
          {content.body.map((para, i) => (
            <p key={i} className="text-[1.05rem] font-light leading-[1.85] text-snow/75">
              {pickLocalized(locale, para)}
            </p>
          ))}
          <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-snow/55">
            <span className="inline-flex items-center gap-1.5">
              <Mountain size={13} className={accentText} />
              {t(`${avId}.difficultyLabel`)}: <span className={accentText}>{t(`${avId}.difficulty`)}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} className={accentText} />
              {t(`${avId}.seasonLabel`)}: <span className={accentText}>{t(`${avId}.season`)}</span>
            </span>
            <a
              href={cfg.guide}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-snow"
            >
              {t('officialGuide')}
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Tappe come card */}
        <section>
          <p className={`mb-2 font-mono text-xs uppercase tracking-[0.25em] ${accentText}`}>
            {cfg.code} · {t(`${avId}.statStages`)}
          </p>
          <h2 className="mb-10 font-display text-3xl tracking-tight lg:text-4xl">
            {t('stagesTitle')}
          </h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {stages.map((stage, i) => (
              <StageCard
                key={stage.slug}
                stage={stage}
                index={i}
                stageLabel={t('stageLabel')}
                viewStageLabel={t('viewStage')}
                outsideRegionLabel={t('outsideRegion')}
                accent={cfg.accent}
              />
            ))}
          </ul>
        </section>

        <div className="mt-16">
          <AdSlot slot="footer-leaderboard" />
        </div>
      </div>
    </div>
  );
}
