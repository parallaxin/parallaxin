# Contributing to Parallaxin

Parallaxin is governed by its [Constitution](docs/4-constitution.md). Every contribution is subject to the Evidence Standard (Article 2). Every contributor — including the founder — is equal (Article 6).

---

## Three Ways to Contribute

### 1. Report an Error (Easiest)
You found something wrong — a broken source, a misquoted claim, a factual error.

**How:** [Open an issue](https://github.com/parallaxin/parallaxin/issues/new) with:
- Which record (e.g., CA-2026-0001)
- What's wrong
- What the correction should be, with a source URL

That's it. Someone will review and fix it.

---

### 2. Suggest a Source or Claim
You know of a primary source that strengthens or contradicts an existing record. Or you've identified an official claim that deserves an autopsy.

**How:** [Open an issue](https://github.com/parallaxin/parallaxin/issues/new) with:
- The source URL
- What it documents
- Which record it relates to (or "new claim autopsy" if it's a new topic)
- The source tier you believe it qualifies for:
  - **Tier 1**: Official documents, court records, international body reports, verified imagery
  - **Tier 2**: Multiple independent outlets with named sources, peer-reviewed research
  - **Tier 3**: Single outlet, single source — labeled as such

Tier 4 (anonymous, unverified, "sources say") is excluded. Don't submit it.

---

### 3. Submit a Record (Advanced)
You want to write or edit a Claim Autopsy, Actor Record, or Conflict Record directly.

**How:**
1. Fork this repository
2. Content lives in `site/src/content/` as Markdown files with YAML frontmatter
3. Use the templates in `docs/templates/` as your starting structure
4. Every factual claim needs a source URL and a tier rating
5. Every inference must be labeled `[INFERENCE]` — never disguised as fact
6. Submit a pull request

**Your PR will be reviewed against:**
- [ ] Every claim has a source URL
- [ ] Every source has a tier rating
- [ ] Every inference is labeled
- [ ] No identity labels (Article 3.1) — describe acts, not identities
- [ ] No editorializing — facts in sequence, reader concludes

Templates are in [`docs/templates/`](docs/templates/):
- `claim-autopsy.template.md`
- `actor-record.template.md`
- `conflict-record.template.md`

---

## What We Don't Accept

- Opinion without evidence
- Sources that cannot be independently verified
- Identity labels: "terrorist," "freedom fighter," "regime," "moderate," "extremist"
- Content that advocates for policy, sides, or outcomes
- Anything that violates the [Evidence Standard](docs/4-constitution.md#article-2-the-evidence-standard)

---

## Translations

Parallaxin supports multiple languages. Translation files are in `site/src/i18n/`.

To add or improve a translation:
1. Copy `site/src/i18n/en.json` as your starting point
2. Translate the values (not the keys)
3. Submit a PR

Current languages: English, Arabic, Farsi. Priority additions: French, Spanish, Turkish, Russian.

---

## Code Contributions

The site is built with [Astro 5](https://astro.build/). To run locally:

```bash
cd site
npm install
npm run dev
```

Code is MIT licensed. Content is CC-BY 4.0.

## One Rule Above All

- Evidence quality is the only currency here. Not seniority, not volume of contributions, not reputation. A first-time contributor's sourced correction overrides the founder's unsourced claim.

- If you believe the platform has been captured or is violating its own Constitution — fork it. That's not a bug. That's the design.
