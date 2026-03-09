# PARALLAXIN

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE-CODE)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE-CONTENT)
[![Community Standard: Parallaxin](https://img.shields.io/badge/Community%20Standard-Parallaxin-green.svg)](docs/4-constitution.md)
[![Deploy to GitHub Pages](https://github.com/parallaxin/parallaxin/actions/workflows/deploy.yml/badge.svg)](https://github.com/parallaxin/parallaxin/actions/workflows/deploy.yml)
[![Last Commit](https://img.shields.io/github/last-commit/parallaxin/parallaxin)](https://github.com/parallaxin/parallaxin/commits/main)
[![Changelog](https://img.shields.io/badge/Changelog-Keep%20a%20Changelog-blue.svg)](CHANGELOG.md)
[![Security Policy](https://img.shields.io/badge/Security-Policy-red.svg)](SECURITY.md)


A lens for documenting the gap between what powerful actors say and what they do.

**Live Site:** [parallaxin.github.io/parallaxin](https://parallaxin.github.io/parallaxin/)

**Read the [Constitution](docs/4-constitution.md) first.**

## Current Status

- **Live:** Landing page, 2 actor records, 1 claim autopsy, and 1 conflict record.
- **Languages:** Full parallel mirror in **Arabic** (`/ar/`) with RTL support. UI support for French and Spanish.
- **Infrastructure:** Astro 5 SSG, i18n fallback logic, automated source validation, and **Vitest/Playwright test suite**.
- **Documentation:** Full constitution, architecture overview, and contribution guidelines in place.


## Structure

- `docs/` — Planning documents, templates, constitution, and architecture notes.
- `site/` — Astro static site (the platform).
- `CHANGELOG.md` — Public-facing release notes.
- `CONTRIBUTING.md` — Guidelines for evidence standards and code contributions.
- `SECURITY.md` — Vulnerability reporting and scope.
- `LICENSE-CODE` / `LICENSE-CONTENT` — MIT and CC-BY 4.0 respectively.


## Quick Start for Contributors

1. **Fork** the repository.
2. **Clone** your fork locally.
3. **Explore** the `docs/` folder to understand the project mission.
4. **Develop** the site:
   ```bash
   cd site
   npm install
   npm run dev
   ```
5. **Run Tests**:
   ```bash
   npm run test      # Vitest unit tests
   npm run test:e2e  # Playwright E2E tests
   ```
6. **Submit** a Pull Request with your changes.

## Contributing

We welcome contributions that strengthen the evidence landscape. All contributions via pull request must adhere to the **Evidence Standard (Constitution, Article 2)**.

- **Factual Corrections:** Open an issue using the "Error Report" template.
- **Source Suggestions:** Help us fill `[SOURCE NEEDED]` gaps.
- **Code:** See `site/` for the Astro implementation.

No accounts needed to read. No data collected from readers. Zero tracking.


## Licenses

- Code: [MIT](LICENSE-CODE)
- Content: [CC-BY 4.0](LICENSE-CONTENT)

## Deploy

```bash
cd site
npm install
npm run build    # Output: site/dist/
npm run preview  # Local preview
```
