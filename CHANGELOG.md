# Changelog

All notable changes to the Parallaxin project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- **Conflict Record — CON-2025-0001**: Full conflict detail page with timeline, actor grid, antecedents, human/economic cost sections, and related autopsy cross-links.
- **Conflicts schema evolution**: Expanded `config.ts` with typed schemas for actors, timeline events, antecedents, human cost, and economic indicators.
- **i18n improvements**: Explicit fallback logic — missing keys now fall back to English before showing raw key strings. French (`fr.json`) and Spanish (`es.json`) UI string files added.
- **Responsive header**: Media queries for mobile viewports to handle long translated navigation labels without horizontal overflow.

### Changed
- Refactored `Base.astro` and `index.astro` to use the global `t()` translation function for all UI strings.

---

## [0.2.0] — 2026-03-07

Phase 2: Content Expansion & Infrastructure

### Added
- **Actor Records**: `ACT-2026-0001` (Benjamin Netanyahu) and `ACT-2026-0002` (Donald Trump) — identity, stated positions, documented actions, gap analysis.
- **Actor detail page** (`actors/[id].astro`): Side-by-side gap analysis grid contrasting STATED vs DOCUMENTED behavior, personal interests, and draft status banners.
- **About page** (`/about`): Project identity, the Parallax lens metaphor, "Ungovernable by Design" principles.
- **Terms page** (`/terms`): CC-BY 4.0 content license, MIT code license, Netherlands jurisdiction, no-data-collection policy.
- **Security policy** (`SECURITY.md`): Vulnerability reporting via `parallaxin@proton.me`.
- **Architecture documentation** (`docs/8-architecture.md`): Tech stack, project structure, content schemas, development workflow.
- **GitHub workflow templates**: PR template with constitutional compliance checklist; issue templates for error reports, source suggestions, and claim autopsy requests.
- **Source checker script** (`check-sources.mjs`): Deep YAML parsing, HTTP validation with `HEAD`/`GET` fallback, Wayback Machine auto-archival via `--fix` flag.
- **Listing pages**: `/autopsies`, `/actors`, `/conflicts` — handle empty collections gracefully.

### Changed
- Updated `docs/7-status.md` to reflect live GitHub Pages deployment and current content inventory.
- Footer redesigned with structured links to About, Terms, and GitHub.

### Fixed
- **Date coercion**: YAML dates auto-parsing as `Date` objects now handled with `z.coerce.string()` in the content schema.

---

## [0.1.0] — 2026-03-06

Phase 1: First Deploy — the immune system goes live.

### Added
- **Astro 5 project scaffold**: Content collections, Zod schema validation, i18n config (English, Arabic, Farsi), RTL layout support.
- **Constitution page** (`/constitution`): All 10 articles rendered and styled.
- **Claim Autopsy — CA-2026-0001**: "Was Iran weeks away from a nuclear weapon?" Full evidence rendering pipeline with source tier badges, verdict banner, and sequence timeline.
- **Homepage**: Mission statement, evidence legend, content card grid.
- **Evidence color system**: Green (documented), amber (inference), red (source needed), orange (gap) — readers can scan evidence quality at a glance.
- **GitHub Pages deployment**: Live at `https://parallaxin.github.io/parallaxin/`.
- **GitHub Actions CI/CD pipeline** for automated build and deploy.
- **Dual licensing**: MIT for code, CC-BY 4.0 for content.
- **`CONTRIBUTING.md`**: Contribution guidelines and editorial standards.
- **Content templates**: Claim Autopsy, Actor Record, Conflict Record — each enforces the Constitution at the field level.
- **Research sprint**: Verified IAEA reports, Knesset transcripts, declassified NIE key judgments, FEC donor data, and corrected factual inaccuracies in the flagship autopsy.

### Design Decisions
- **Schema as enforcement**: Tier 4 sources are unrepresentable — no enum value exists. The `documented | inference` field on analytical statements enforces Article 3.2 at the data level.
- **Publish checklist as gate**: Every Claim Autopsy carries a checklist object; all booleans must be `true` before status can change from `draft` to `published`.
- **Record IDs over names**: `ACT-2026-0001` instead of actor names — reinforces the archival record aesthetic and avoids URL collisions.
- **Zero tracking**: No analytics, no cookies, no user accounts.

---

[Unreleased]: https://github.com/parallaxin/parallaxin/compare/main...HEAD
[0.2.0]: https://github.com/parallaxin/parallaxin/compare/v0.1.0...main
[0.1.0]: https://github.com/parallaxin/parallaxin/releases/tag/v0.1.0
