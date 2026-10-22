// Records are stored as `<ID>.md` (English) and `<ID>.ar.md` (Arabic).
// Entry IDs keep the `.ar` suffix (see content.config.ts); routes never do.

const AR_SUFFIX = '.ar';

type Entry = { id: string };

export function isArabic(entry: Entry): boolean {
  return entry.id.endsWith(AR_SUFFIX);
}

export function isEnglish(entry: Entry): boolean {
  return !isArabic(entry);
}

/** Record ID used in URLs, shared by both language versions. */
export function recordId(entry: Entry): string {
  return isArabic(entry) ? entry.id.slice(0, -AR_SUFFIX.length) : entry.id;
}

/** One item per English record, using the Arabic version when it exists. */
export function arabicOrEnglish<T extends Entry>(items: T[]): { entry: T; isTranslated: boolean }[] {
  const arabic = new Map(items.filter(isArabic).map((e) => [recordId(e), e]));
  return items.filter(isEnglish).map((entry) => {
    const translated = arabic.get(entry.id);
    return { entry: translated ?? entry, isTranslated: translated !== undefined };
  });
}
