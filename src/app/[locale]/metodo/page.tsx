import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Database, Globe2, Map, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
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
  const t = await getTranslations({ locale, namespace: 'Metodo.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/metodo`,
      languages: localeAlternatesAbsolute('/metodo'),
    },
  };
}

export default async function MetodoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Metodo');

  const sources = [
    {
      icon: Database,
      title: t('sctTitle'),
      body: t('sctBody'),
      href: 'https://catastosentieri.regione.vda.it/',
      label: t('sctLink'),
    },
    {
      icon: Globe2,
      title: t('osmTitle'),
      body: t('osmBody'),
      href: 'https://www.openstreetmap.org/',
      label: t('osmLink'),
    },
    {
      icon: Map,
      title: t('geoTitle'),
      body: t('geoBody'),
      href: 'https://geoportale.regione.vda.it/download/rete-sentieristica/',
      label: t('geoLink'),
    },
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
            <p className="text-snow/70 text-lg leading-relaxed mb-14">{t('intro')}</p>
          </ScrollReveal>

          <div className="space-y-6 mb-16">
            {sources.map(({ icon: Icon, title, body, href, label }, i) => (
              <ScrollReveal key={title} delay={i * 0.06}>
                <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <Icon size={22} className="text-alpenglow mb-4" />
                  <h2 className="font-display text-xl text-snow tracking-tight mb-3">{title}</h2>
                  <p className="text-sm text-snow/55 leading-relaxed mb-4">{body}</p>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-alpenglow hover:text-alpenglow/80 transition-colors"
                  >
                    {label} →
                  </a>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="rounded-2xl border border-ice/20 bg-ice/5 p-8">
              <div className="flex items-start gap-4 mb-4">
                <ShieldCheck size={24} className="text-ice shrink-0 mt-0.5" />
                <h2 className="font-display text-2xl text-snow tracking-tight">
                  {t('verifyTitle')}
                </h2>
              </div>
              <p className="text-snow/65 leading-relaxed mb-4">{t('verifyBody')}</p>
              <p className="text-sm text-snow/50 leading-relaxed">{t('verifyNote')}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-12 text-sm text-snow/50">
              {t('aboutLinkPrefix')}{' '}
              <Link href="/about" className="text-alpenglow hover:text-alpenglow/80 transition-colors">
                {t('aboutLinkLabel')}
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
