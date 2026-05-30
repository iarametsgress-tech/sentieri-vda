import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Mail, Map, Mountain, Leaf, BookOpen } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SITE_URL, SITE_AUTHOR } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';
import SectionPageHero from '@/components/SectionPageHero';
import ScrollReveal from '@/components/ScrollReveal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Progetto.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/about`,
      languages: localeAlternatesAbsolute('/about'),
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
  const t = await getTranslations('Progetto');

  const pillars = [
    { icon: Map, title: t('pillarTrailsTitle'), body: t('pillarTrailsBody') },
    { icon: Mountain, title: t('pillarAmbienteTitle'), body: t('pillarAmbienteBody') },
    { icon: Leaf, title: t('pillarNatureTitle'), body: t('pillarNatureBody') },
    { icon: BookOpen, title: t('pillarCultureTitle'), body: t('pillarCultureBody') },
  ];

  return (
    <div>
      <SectionPageHero
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        section="about"
        locale={locale}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 pb-20 lg:pb-28">
        <div className="max-w-3xl">
          <ScrollReveal>
            <p className="text-snow/70 text-lg leading-relaxed mb-8">{t('intro')}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <p className="text-snow/60 leading-relaxed mb-14">{t('mission')}</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-16">
            {pillars.map(({ icon: Icon, title, body }, i) => (
              <ScrollReveal key={title} delay={i * 0.06}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-full">
                  <Icon size={22} className="text-alpenglow mb-4" />
                  <h2 className="font-display text-xl text-snow tracking-tight mb-3">{title}</h2>
                  <p className="text-sm text-snow/55 leading-relaxed">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="rounded-2xl border border-ice/20 bg-ice/5 p-8">
              <h2 className="font-display text-2xl text-snow tracking-tight mb-4">
                {t('dataTitle')}
              </h2>
              <p className="text-snow/65 leading-relaxed mb-4">{t('dataBody')}</p>
              <Link
                href="/metodo"
                className="text-sm text-alpenglow hover:text-alpenglow/80 transition-colors"
              >
                {t('dataMethodLink')} →
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-alpenglow/80 mb-6">
                {t('authorEyebrow')}
              </p>
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-white/10 bg-ink">
                  <Image
                    src={SITE_AUTHOR.photo}
                    alt={t('authorPhotoAlt', { name: SITE_AUTHOR.name })}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div>
                  <h2 className="font-display text-2xl text-snow tracking-tight mb-1">
                    {SITE_AUTHOR.name}
                  </h2>
                  <p className="text-sm text-alpenglow mb-4">{t('authorRole')}</p>
                  <p className="text-snow/60 text-sm leading-relaxed mb-4">{t('authorBio')}</p>
                  <Link
                    href="/metodo"
                    className="text-sm text-alpenglow hover:text-alpenglow/80 transition-colors"
                  >
                    {t('authorMethodLink')} →
                  </Link>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-snow/55 text-sm font-mono mb-4">{t('contact')}</p>
            <a
              href={`mailto:${SITE_AUTHOR.email}`}
              className="inline-flex items-center gap-2 text-sm text-alpenglow hover:text-alpenglow/80 transition-colors"
            >
              <Mail size={14} />
              {SITE_AUTHOR.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
