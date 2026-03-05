import en from './en.json';
import ar from './ar.json';
import fa from './fa.json';

const translations: Record<string, typeof en> = { en, ar, fa };

export type Locale = 'en' | 'ar' | 'fa' | 'fr' | 'es';

export const defaultLocale: Locale = 'en';

export const rtlLocales: Locale[] = ['ar', 'fa'];

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale] || translations[defaultLocale];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return isRtl(locale) ? 'rtl' : 'ltr';
}
