import { getCollection } from 'astro:content';
import { isVisible } from './publication';
import { isEnglish, recordId } from './records';

/**
 * Returns a lookup from record ID (e.g. ACT-2026-0001, any case) to its page
 * URL in this build. Unpublished or missing records give undefined, so pages
 * render them as plain text instead of a link.
 */
export async function recordLinks(locale: 'en' | 'ar'): Promise<(ref: string) => string | undefined> {
  const prefix = import.meta.env.BASE_URL + (locale === 'ar' ? 'ar/' : '');
  const links = new Map<string, string>();
  for (const collection of ['autopsies', 'actors', 'conflicts'] as const) {
    for (const entry of (await getCollection(collection, isVisible)).filter(isEnglish)) {
      links.set(entry.data.record_id.toUpperCase(), `${prefix}${collection}/${recordId(entry)}`);
    }
  }
  return (ref) => links.get(ref.toUpperCase());
}
