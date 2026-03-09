import { describe, it, expect } from 'vitest';
import { t, isRtl, getDirection } from './utils';

describe('i18n utils', () => {
    describe('t function', () => {
        it('returns translation for a valid key in English', () => {
            expect(t('en', 'site.title')).toBe('Parallaxin');
        });

        it('returns translation for a valid key in Arabic', () => {
            expect(t('ar', 'site.title')).toBe('بارالاكسين');
        });

        it('falls back to English if key is missing in requested locale', () => {
            expect(t('ar', 'test.fallback')).toBe('This is a fallback');
        });

        it('returns the key itself if missing in both requested and fallback locale', () => {
            expect(t('en', 'non.existent.key')).toBe('non.existent.key');
        });

        it('handles nested keys correctly', () => {
            expect(t('en', 'site.nav.conflicts')).toBe('Conflicts');
        });
    });

    describe('isRtl function', () => {
        it('returns true for ar', () => {
            expect(isRtl('ar')).toBe(true);
        });

        it('returns true for fa', () => {
            expect(isRtl('fa')).toBe(true);
        });

        it('returns false for en', () => {
            expect(isRtl('en')).toBe(false);
        });
    });

    describe('getDirection function', () => {
        it('returns rtl for ar', () => {
            expect(getDirection('ar')).toBe('rtl');
        });

        it('returns ltr for en', () => {
            expect(getDirection('en')).toBe('ltr');
        });
    });
});
