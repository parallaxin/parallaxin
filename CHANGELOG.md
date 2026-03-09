# Changelog

All notable changes to the Parallaxin project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

---

## [0.3.0] — 2026-03-10

### Phase 3: Full Arabic Implementation & Test Suite

This phase marks the completion of the first full parallel localization (Arabic) and the introduction of automated verification to ensure long-term stability.

### Added
- **Full Arabic Version (Phase 2.5/3)**:
  - 8 mirror pages in `src/pages/ar/` covering all core routes (Constitution, About, Terms, Listings, Details).
  - Parallel Arabic content records (`.ar.md`) for all flagship autopsies, actors, and conflicts.
  - Interactive language switcher (EN | عربي) in the header with intelligent route mapping.
  - Comprehensive RTL CSS system with logical property mapping and specific overrides for timelines and gap analysis grids.
- **Automated Test Suite**:
  - **Vitest** for unit testing i18n logic, fallback mechanisms, and directionality detection.
  - **Playwright** for E2E verification of RTL layouts, cross-language routing, and homepage integrity.
  - Standardized `test`, `test:ui`, and `test:e2e` scripts.
- **Conflict Record — CON-2025-0001**: Full conflict detail page with expanded schemas for timeline, human cost, and economic indicators.
- **i18n Fallback Logic**: Explicit fallback to English for missing keys/content to ensure no raw keys are ever shown to the user.

### Changed
- **Arabic Localization Polish**: Refined homepage phrasing and corrected sensitive terminology (e.g., using «مناضل» in the Constitution).
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
