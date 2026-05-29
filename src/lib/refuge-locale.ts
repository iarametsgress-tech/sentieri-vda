import type { Refuge, RefugeImage } from './types';
import { pickLocalized, pickLocalizedOptional } from './locale-content';

export function getRefugeName(refuge: Refuge, locale: string): string {
  return pickLocalized(locale, {
    it: refuge.name_it,
    en: refuge.name_en,
    fr: refuge.name_fr,
    de: refuge.name_de,
  });
}

export function getRefugeValley(refuge: Refuge, locale: string): string {
  return pickLocalized(locale, {
    it: refuge.valley_it,
    en: refuge.valley_en,
    fr: refuge.valley_fr,
    de: refuge.valley_de,
  });
}

export function getRefugeOpenPeriod(refuge: Refuge, locale: string): string | null | undefined {
  return pickLocalizedOptional(locale, {
    it: refuge.open_period_it ?? undefined,
    en: refuge.open_period_en ?? undefined,
    fr: refuge.open_period_fr ?? undefined,
    de: refuge.open_period_de ?? undefined,
  });
}

export function getRefugeManager(refuge: Refuge, locale: string): string | null | undefined {
  return pickLocalizedOptional(locale, {
    it: refuge.manager_it ?? undefined,
    en: refuge.manager_en ?? undefined,
    fr: refuge.manager_fr ?? undefined,
    de: refuge.manager_de ?? undefined,
  });
}

export function getRefugeDescription(refuge: Refuge, locale: string): string {
  return pickLocalized(locale, {
    it: refuge.description_it,
    en: refuge.description_en,
    fr: refuge.description_fr,
    de: refuge.description_de,
  });
}

export function getRefugeHistory(refuge: Refuge, locale: string): string | null | undefined {
  return pickLocalizedOptional(locale, {
    it: refuge.history_it ?? undefined,
    en: refuge.history_en ?? undefined,
    fr: refuge.history_fr ?? undefined,
    de: refuge.history_de ?? undefined,
  });
}

export function getRefugeFood(refuge: Refuge, locale: string): string | null | undefined {
  return pickLocalizedOptional(locale, {
    it: refuge.food_it ?? undefined,
    en: refuge.food_en ?? undefined,
    fr: refuge.food_fr ?? undefined,
    de: refuge.food_de ?? undefined,
  });
}

export function getRefugeCosts(refuge: Refuge, locale: string): string | null | undefined {
  return pickLocalizedOptional(locale, {
    it: refuge.costs_it ?? undefined,
    en: refuge.costs_en ?? undefined,
    fr: refuge.costs_fr ?? undefined,
    de: refuge.costs_de ?? undefined,
  });
}

export function getRefugeImageAlt(image: RefugeImage, locale: string): string {
  return pickLocalized(locale, {
    it: image.alt_it,
    en: image.alt_en,
    fr: image.alt_fr,
    de: image.alt_de,
  });
}
