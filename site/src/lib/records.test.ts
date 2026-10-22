import { describe, it, expect } from 'vitest';
import { isArabic, isEnglish, recordId, arabicOrEnglish } from './records';

const en = { id: 'ACT-2026-0001' };
const ar = { id: 'ACT-2026-0001.ar' };
const enOnly = { id: 'ACT-2026-0002' };

describe('records', () => {
  it('detects the Arabic suffix', () => {
    expect(isArabic(ar)).toBe(true);
    expect(isArabic(en)).toBe(false);
    expect(isEnglish(en)).toBe(true);
  });

  it('gives both versions the same record ID', () => {
    expect(recordId(en)).toBe('ACT-2026-0001');
    expect(recordId(ar)).toBe('ACT-2026-0001');
  });

  it('only strips a trailing suffix', () => {
    expect(recordId({ id: 'X.archive' })).toBe('X.archive');
  });

  it('prefers Arabic and keeps one item per record', () => {
    const result = arabicOrEnglish([ar, en, enOnly]);
    expect(result).toEqual([
      { entry: ar, isTranslated: true },
      { entry: enOnly, isTranslated: false },
    ]);
  });
});
