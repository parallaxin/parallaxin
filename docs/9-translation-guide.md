# Parallaxin Translation Guide

## Three Layers

### Layer 1: UI Strings (JSON files)
- Location: site/src/i18n/{locale}.json
- Skill needed: language fluency
- Update trigger: new UI features
- Fallback: missing keys show English

### Layer 2: Structural Pages (astro files)
- Location: site/src/pages/{locale}/
- Skill needed: language fluency + understanding of the Constitution
- Update trigger: English page changes
- Tracking: translation_source_hash in frontmatter
- Staleness: CI flags when English source hash changes

### Layer 3: Content Records (markdown files)
- Location: site/src/content/{collection}/{id}.{locale}.md
- Skill needed: language fluency + evidence standard understanding
- Update trigger: English record updated
- Tracking: translation_meta in frontmatter
- Review: required before publish — two-person (translator + reviewer)
- Rule: source URLs are NEVER translated — evidence stays in original language

## Priority Languages
1. English (canonical)
2. Arabic (primary affected population)
3. Farsi (Iranian population, information access)
4. French (Arabic diaspora, African reach)
5. Spanish (global reach)
6. Turkish, Russian, Chinese, Portuguese, Hindi (community-driven)

## Translation Principles
- Accuracy over fluency — a slightly awkward but accurate translation
  is better than a smooth but imprecise one
- Evidence terms are defined in the Constitution and must be translated
  consistently: DOCUMENTED, INFERENCE, Tier 1/2/3, etc.
- The editorial voice (Article 3.3) must be preserved: strong but not
  editorial, factual arrangement not opinion
- When in doubt, leave the English term with a parenthetical translation
  rather than risk semantic drift