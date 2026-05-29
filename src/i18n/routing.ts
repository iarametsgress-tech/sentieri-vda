import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['it', 'en', 'fr', 'de'],
  defaultLocale: 'it',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
