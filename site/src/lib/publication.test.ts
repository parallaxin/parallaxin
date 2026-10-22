import { describe, it, expect } from 'vitest';
import { editorialStatus, isVisibleWith } from './publication';

const draftActor = { collection: 'actors' as const, data: { status: 'draft' as const } };
const publishedAutopsy = { collection: 'autopsies' as const, data: { status: 'published' as const } };
const activeDraftConflict = {
  collection: 'conflicts' as const,
  data: { status: 'active', editorial_status: 'draft' as const },
};
const endedPublishedConflict = {
  collection: 'conflicts' as const,
  data: { status: 'ended', editorial_status: 'published' as const },
};

describe('publication', () => {
  it('reads conflict approval from editorial_status, not lifecycle status', () => {
    expect(editorialStatus(activeDraftConflict)).toBe('draft');
    expect(editorialStatus(endedPublishedConflict)).toBe('published');
  });

  it('shows only published records in production', () => {
    expect(isVisibleWith(publishedAutopsy, false)).toBe(true);
    expect(isVisibleWith(endedPublishedConflict, false)).toBe(true);
    expect(isVisibleWith(draftActor, false)).toBe(false);
    expect(isVisibleWith(activeDraftConflict, false)).toBe(false);
  });

  it('shows every record in local preview', () => {
    expect(isVisibleWith(draftActor, true)).toBe(true);
    expect(isVisibleWith(activeDraftConflict, true)).toBe(true);
  });
});
