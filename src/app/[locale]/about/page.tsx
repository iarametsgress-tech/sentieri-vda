import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Mail, Map, Mountain, Leaf, BookOpen } from 'lucide-react';
import { SITE_URL } from '@/lib/config';
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
              <p className="text-snow/65 leading-relaxed">{t('dataBody')}</p>
            </div>
          </ScrollReveal>

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
