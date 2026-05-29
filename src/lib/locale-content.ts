/** Pick localized string fields with fr/de support on trail/refuge content. */
export function pickLocalized(
  locale: string,
  fields: { it: string; en: string; fr?: string; de?: string }
): string {
  if (locale === 'it') return fields.it;
  if (locale === 'fr' && fields.fr) return fields.fr;
  if (locale === 'de' && fields.de) return fields.de;
  return fields.en;
}

/** Optional localized field — returns undefined if missing in all fallbacks. */
export function pickLocalizedOptional(
  locale: string,
  fields: { it?: string; en?: string; fr?: string; de?: string }
): string | undefined {
  if (locale === 'it') return fields.it ?? fields.en;
  if (locale === 'fr') return fields.fr ?? fields.en ?? fields.it;
  if (locale === 'de') return fields.de ?? fields.en ?? fields.it;
  return fields.en ?? fields.it;
}

export function pickLocalizedArray(
  locale: string,
  fields: { it?: string[]; en?: string[]; fr?: string[]; de?: string[] }
): string[] | undefined {
  if (locale === 'it') return fields.it ?? fields.en;
  if (locale === 'fr') return fields.fr ?? fields.en ?? fields.it;
  if (locale === 'de') return fields.de ?? fields.en ?? fields.it;
  return fields.en ?? fields.it;
}

export function isItalianLocale(locale: string): boolean {
  return locale === 'it';
}
