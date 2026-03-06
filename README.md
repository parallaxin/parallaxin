# PARALLAXIN

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE-CODE)
[![Deploy to GitHub Pages](https://github.com/parallaxin/parallaxin/actions/workflows/deploy.yml/badge.svg)](https://github.com/parallaxin/parallaxin/actions/workflows/deploy.yml)
[![Last Commit](https://img.shields.io/github/last-commit/parallaxin/parallaxin)](https://github.com/parallaxin/parallaxin/commits/main)

A lens for documenting the gap between what powerful actors say and what they do.

**Live Site:** [parallaxin.github.io/parallaxin](https://parallaxin.github.io/parallaxin/)

**Read the [Constitution](docs/4-constitution.md) first.**

## Current Status

- **Live:** Landing page and initial actor reports.
- **In Progress:** Expanding actor database and refining evidence standards.

## Structure

- `docs/` — Planning documents, templates, constitution
- `site/` — Astro static site (the platform)
- `CONSTITUTION.md` — Governing document (symlink to docs/4-constitution.md)

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
5. **Submit** a Pull Request with your changes.

## Contributing

All contributions via pull request. All contributions subject to the Evidence Standard (Constitution, Article 2).

No accounts needed to read. No data collected from readers.

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
