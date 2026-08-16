import en from '@/i18n/messages/en.json';

const dictionaries = {
  en,
} as const;

export type Locale = keyof typeof dictionaries;

export const defaultLocale: Locale = 'en';

export function getDictionary(locale: Locale = defaultLocale) {
  return dictionaries[locale] ?? dictionaries.en;
}
