// Production builds show published records only. The local dev server
// (`npm run dev`) also shows drafts and records under review, with a
// preview banner, so editors can check them before approval.

export type EditorialStatus = 'draft' | 'under-review' | 'published';

type Record =
  | { collection: 'conflicts'; data: { editorial_status: EditorialStatus } }
  | { collection: 'actors' | 'autopsies'; data: { status: EditorialStatus } };

export const SHOW_UNPUBLISHED: boolean = import.meta.env.DEV;

/** Conflicts keep `status` for their lifecycle (active, ended...); approval is separate. */
export function editorialStatus(entry: Record): EditorialStatus {
  return entry.collection === 'conflicts' ? entry.data.editorial_status : entry.data.status;
}

export function isVisibleWith(entry: Record, showUnpublished: boolean): boolean {
  return showUnpublished || editorialStatus(entry) === 'published';
}

/** Filter for getCollection(): what this build may show. */
export function isVisible(entry: Record): boolean {
  return isVisibleWith(entry, SHOW_UNPUBLISHED);
}
