import en from './en.json';
import ar from './ar.json';
import fa from './fa.json';
import fr from './fr.json';
import es from './es.json';

const translations: Record<string, typeof en> = { en, ar, fa, fr, es };

export type Locale = 'en' | 'ar' | 'fa' | 'fr' | 'es';

export const defaultLocale: Locale = 'en';

export const rtlLocales: Locale[] = ['ar', 'fa'];

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  // Try requested locale first
  let value: any = translations[locale];
  for (const k of keys) {
    value = value?.[k];
  }
  if (value) return value;

  // Fall back to English
  let fallback: any = translations[defaultLocale];
  for (const k of keys) {
    fallback = fallback?.[k];
  }
  return fallback || key;
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return isRtl(locale) ? 'rtl' : 'ltr';
}
