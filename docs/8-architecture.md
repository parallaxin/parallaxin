# PARALLAXIN — Architecture Overview

**Technical documentation for contributors. Updated 22 October 2026.**

The authority on record structure is the code: `site/src/content.config.ts` for the schema and `site/scripts/evidence-rules.mjs` for the publication rules. This document explains how the pieces fit.

---

## TECHNOLOGY STACK

- **Astro 7** — static site generator; the site ships HTML and CSS with no client framework.
- **TypeScript** — checked with `astro check`.
- **Markdown + YAML front matter** — every record is a file in Git, so its full history is public.
- **Zod** (through Astro content collections) — describes record structure.
- **Plain CSS** — `site/public/styles/global.css`, with custom properties for the dark theme and the evidence colour system. IBM Plex Sans/Mono are loaded from Google Fonts.
- **Vitest** (unit tests) and **Playwright** (end-to-end tests).
- **GitHub Actions** and **GitHub Pages** — CI and hosting.

---

## PROJECT STRUCTURE

```
parallaxin/
├── docs/                         # Constitution, plans, build log, templates
│   └── templates/                # Starting points for new records
├── site/                         # The Astro site; install and run everything here
│   ├── src/
│   │   ├── content/              # Records: autopsies/, actors/, conflicts/
│   │   ├── content.config.ts     # Record schemas
│   │   ├── lib/                  # Language and publication helpers
│   │   ├── components/           # RecordStatus, SourceLinks, ContestedNotice
│   │   ├── layouts/Base.astro    # Page shell, language switcher, preview banner
│   │   ├── pages/                # English routes; pages/ar/ holds the Arabic mirror
│   │   └── i18n/                 # Interface strings (en, ar, fa, fr, es)
│   ├── scripts/                  # Evidence gate, route check, source checker
│   ├── tests/                    # Playwright specs
│   └── public/                   # Static assets and global CSS
└── .github/workflows/deploy.yml  # CI and deployment
```

---

## RECORDS

Three collections, one Markdown file per record and language:

| Collection | ID format | Files |
|---|---|---|
| Claim autopsies | `CA-YYYY-NNNN` | `ca-2026-0001.md`, `ca-2026-0001.ar.md` |
| Actor records | `ACT-YYYY-NNNN` | `ACT-2026-0001.md`, `ACT-2026-0001.ar.md` |
| Conflict records | `CON-YYYY-NNNN` | `CON-2025-0001.md`, `CON-2025-0001.ar.md` |

- The English file is the record of reference. The Arabic file (`.ar.md`) is its translation and must carry the same `record_id`.
- Each record has one English page (`/autopsies/ca-2026-0001/`) and one Arabic page (`/ar/autopsies/ca-2026-0001/`). If the Arabic file is missing, the Arabic page shows the English text.
- Records point to each other by ID: `conflict_ref`, `actor_ref`, `who_benefits[].actor_ref`, `actors[].actor_id`, `autopsies[]`, `conflicts[]`.

### Editorial status

Every record has an editorial status: `draft`, `under-review` or `published`.

- Autopsies and actors keep it in `status`.
- Conflicts keep it in `editorial_status`. Their `status` field (`active`, `ceasefire`, `ended`, `frozen`) describes the conflict itself, not editorial approval.
- `contested: true` with a `contest_thread` link marks a record whose findings are formally disputed. Readers see a notice and the link.

Start new records from `docs/templates/`; the full field list is in `site/src/content.config.ts`.

---

## PUBLICATION AND EVIDENCE GATES

The schema is deliberately permissive so that drafts can hold incomplete evidence and `[SOURCE NEEDED]` markers. Publication is controlled in two places.

**1. What the site shows** (`site/src/lib/publication.ts`)
- A production build (`npm run build`) contains published records only. Drafts and records under review get no page, no sitemap entry and no search index entry. Links to them render as plain text.
- The local dev server (`npm run dev`) shows every record, under a banner saying it is a local preview.

**2. What may be marked published** (`npm run check:evidence`, no network)
- Fails for every record on unparseable front matter, or a missing, mismatched or duplicate `record_id`.
- Fails for a published record on: a source tier other than Tier 1–3; a URL that is not http(s); a missing source URL, tier or archive link; a Wayback archive link without a snapshot timestamp; any `[SOURCE NEEDED]` or `[ARCHIVE NEEDED]` marker; duplicate evidence IDs; a contested record without a thread; a documented conflict event without a source; a reference to a record that does not exist.
- For drafts it reports how many issues remain; `--record ID` lists them.

Passing the gate does not make a record true. It confirms structure and sourcing; reviewers still check that each source says what the record claims.

**Source checker** (`npm run lint:links`, network)
- Requests every source and archive link, including links inside `sources` lists, and reports each as reachable, unverified (the server refused automated access, e.g. HTTP 403 or 429; check by hand) or broken.
- `--fix` asks the Wayback Machine to archive sources that lack a snapshot, and writes the snapshot URL with its check date (`source_archive_verified`) only after the snapshot loads.
- It is not part of CI, because live sites change and block automated requests.

---

## DEVELOPMENT WORKFLOW

```bash
git clone https://github.com/parallaxin/parallaxin.git
cd parallaxin/site
npm ci
npm run dev              # http://localhost:4321/parallaxin/ — includes unpublished records
```

Checks (the first five run in CI):

```bash
npm run check            # TypeScript and schema check
npm test                 # unit tests (src/**/*.test.ts, scripts/**/*.test.mjs)
npm run check:evidence   # evidence gate
npm run build            # production build into dist/, then Pagefind search index
npm run test:routes      # dist/: one page per published record and language, no unpublished pages
npm run test:e2e         # Playwright, against the dev server
npm run lint:links       # network source check
```

---

## CI AND DEPLOYMENT

`.github/workflows/deploy.yml` runs on every pull request and every push to `main`:

1. `npm ci`
2. `npm run check`
3. `npm test`
4. `npm run check:evidence`
5. `npm run build`
6. `npm run test:routes`

A failure at any step stops the run. Only a push (or manual run) on `main` uploads the `dist/` built by that run and deploys it to GitHub Pages. Pull requests never deploy.

The site is served at `https://parallaxin.github.io/parallaxin/` (`site` and `base` in `site/astro.config.mjs`).

---

## SECURITY AND PRIVACY NOTES

- The site is static: no database, no server code, no user accounts.
- Git history is a public, tamper-evident record of every change to every record.
- Contributions go through GitHub. Contributors may use a pseudonymous account, but GitHub and Git record the account name and the commit author name and email. Check these before committing; the project cannot remove them afterwards.
- Pages load fonts from Google Fonts, so readers' browsers contact Google.

See [SECURITY.md](../SECURITY.md) for reporting vulnerabilities.
