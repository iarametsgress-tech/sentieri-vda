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
    emergencyCallLabel: t('emergencyCallLabel'),
    emergencyCallHint: t('emergencyCallHint'),
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
    emergencyExtra: t('emergencyExtra'),
    responsibilityTitle: t('responsibilityTitle'),
    responsibilityBody: t('responsibilityBody'),
    responsibilityPoints: t.raw('responsibilityPoints') as string[],
    equipmentTitle: t('equipmentTitle'),
    equipmentIntro: t('equipmentIntro'),
    equipmentNote: t('equipmentNote'),
    weatherTitle: t('weatherTitle'),
    weatherBody: t('weatherBody'),
    weatherPoints: t.raw('weatherPoints') as string[],
    weatherLinksTitle: t('weatherLinksTitle'),
    weatherLinks: t.raw('weatherLinks') as { label: string; href: string; desc: string }[],
    signalsTitle: t('signalsTitle'),
    signalsIntro: t('signalsIntro'),
    rescueTitle: t('rescueTitle'),
    rescueIntro: t('rescueIntro'),
    rescueNote: t('rescueNote'),
    familyTitle: t('familyTitle'),
    familyBody: t('familyBody'),
    familyPoints: t.raw('familyPoints') as string[],
    contactsTitle: t('contactsTitle'),
    contactsSubtitle: t('contactsSubtitle'),
    equipmentItems: t.raw('equipmentItems') as string[],
    signalItems: t.raw('signalItems') as string[],
    rescueSteps: t.raw('rescueSteps') as string[],
    contactLinks: t.raw('contactLinks') as { label: string; href: string; desc: string }[],
  };

  return <SicurezzaExplorer locale={locale} labels={labels} />;
}
