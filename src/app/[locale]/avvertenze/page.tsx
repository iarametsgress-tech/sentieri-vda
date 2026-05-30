import { setRequestLocale, getTranslations } from 'next-intl/server';
import SicurezzaExplorer from '@/components/SicurezzaExplorer';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Sicurezza.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/avvertenze`,
      languages: localeAlternatesAbsolute('/avvertenze'),
    },
  };
}

export default async function AvvertenzePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Sicurezza');

  const labels = {
    heroEyebrow: t('heroEyebrow'),
    heroTitle: t('heroTitle'),
    heroSubtitle: t('heroSubtitle'),
    navEmergency: t('navEmergency'),
    navResponsibility: t('navResponsibility'),
    navEquipment: t('navEquipment'),
    navWeather: t('navWeather'),
    navSignals: t('navSignals'),
    navRescue: t('navRescue'),
    navFamily: t('navFamily'),
    navContacts: t('navContacts'),
    emergencyTitle: t('emergencyTitle'),
    emergencyBody: t('emergencyBody'),
    responsibilityTitle: t('responsibilityTitle'),
    responsibilityBody: t('responsibilityBody'),
    equipmentTitle: t('equipmentTitle'),
    equipmentIntro: t('equipmentIntro'),
    weatherTitle: t('weatherTitle'),
    weatherBody: t('weatherBody'),
    signalsTitle: t('signalsTitle'),
    rescueTitle: t('rescueTitle'),
    rescueIntro: t('rescueIntro'),
    familyTitle: t('familyTitle'),
    familyBody: t('familyBody'),
    contactsTitle: t('contactsTitle'),
    contactsSubtitle: t('contactsSubtitle'),
    equipmentItems: t.raw('equipmentItems') as string[],
    signalItems: t.raw('signalItems') as string[],
    rescueSteps: t.raw('rescueSteps') as string[],
    contactLinks: t.raw('contactLinks') as { label: string; href: string; desc: string }[],
  };

  return <SicurezzaExplorer locale={locale} labels={labels} />;
}
