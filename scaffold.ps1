# scaffold.ps1 — Parallaxin Astro project setup
# Run from E:\co\parallaxin

$ErrorActionPreference = "Stop"
$root = "E:\co\parallaxin"
Set-Location $root

Write-Host "=== PARALLAXIN SCAFFOLD ===" -ForegroundColor Cyan
Write-Host "Building site structure..." -ForegroundColor Yellow

# ─────────────────────────────────────
# ROOT FILES
# ─────────────────────────────────────

# README
@"
# PARALLAXIN

A lens for documenting the gap between what powerful actors say and what they do.

**Read the [Constitution](docs/4-constitution.md) first.**

## Structure

- ``docs/`` — Planning documents, templates, constitution
- ``site/`` — Astro static site (the platform)
- ``CONSTITUTION.md`` — Governing document (symlink to docs/4-constitution.md)

## Contributing

All contributions via pull request. All contributions subject to the Evidence Standard (Constitution, Article 2).

No accounts needed to read. No data collected from readers.

## Licenses

- Code: [MIT](LICENSE-CODE)
- Content: [CC-BY 4.0](LICENSE-CONTENT)

## Deploy

``bash
cd site
npm install
npm run build    # Output: site/dist/
npm run preview  # Local preview
``
"@ | Out-File -Encoding utf8 "$root\README.md"

# MIT License (Code)
@"
MIT License

Copyright (c) 2026 Parallaxin Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"@ | Out-File -Encoding utf8 "$root\LICENSE-CODE"

# CC-BY 4.0 (Content)
@"
Creative Commons Attribution 4.0 International License

All content in this repository (text, analysis, translations) is licensed
under the Creative Commons Attribution 4.0 International License.

You are free to:
- Share: copy and redistribute the material in any medium or format
- Adapt: remix, transform, and build upon the material for any purpose

Under the following terms:
- Attribution: You must give appropriate credit, provide a link to the
  license, and indicate if changes were made.

Full license text: https://creativecommons.org/licenses/by/4.0/legalcode
"@ | Out-File -Encoding utf8 "$root\LICENSE-CONTENT"

# ─────────────────────────────────────
# DIRECTORY STRUCTURE
# ─────────────────────────────────────

$dirs = @(
  "site\src\content\conflicts",
  "site\src\content\actors",
  "site\src\content\autopsies",
  "site\src\layouts",
  "site\src\components",
  "site\src\pages\conflicts",
  "site\src\pages\actors",
  "site\src\pages\autopsies",
  "site\src\pages\ar",
  "site\src\pages\fa",
  "site\public\styles",
  "site\src\i18n",
  "site\public\fonts",
  ".github\workflows"
)

foreach ($dir in $dirs) {
  New-Item -ItemType Directory -Force -Path "$root\$dir" | Out-Null
  Write-Host "  Created: $dir" -ForegroundColor DarkGray
}

# ─────────────────────────────────────
# SITE CONFIG FILES
# ─────────────────────────────────────

# package.json
@"
{
  "name": "parallaxin",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "description": "Documenting the gap between what power says and what power does",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && npx pagefind --site dist",
    "preview": "astro preview",
    "check": "astro check",
    "lint:links": "node scripts/check-sources.mjs"
  },
  "dependencies": {
    "astro": "^5.4.0",
    "@astrojs/mdx": "^4.1.0"
  },
  "devDependencies": {
    "pagefind": "^1.3.0",
    "typescript": "^5.7.0"
  }
}
"@ | Out-File -Encoding utf8 "$root\site\package.json"

# tsconfig.json
@"
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@content/*": ["src/content/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@i18n/*": ["src/i18n/*"]
    }
  }
}
"@ | Out-File -Encoding utf8 "$root\site\tsconfig.json"

# astro.config.mjs
@"
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://parallaxin.report',
  integrations: [mdx()],
  output: 'static',
  build: {
    format: 'directory'
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar', 'fa', 'fr', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
"@ | Out-File -Encoding utf8 "$root\site\astro.config.mjs"

# ─────────────────────────────────────
# CONTENT COLLECTION SCHEMA
# This is where the Constitution meets the code
# ─────────────────────────────────────

@"
import { defineCollection, z } from 'astro:content';

// ════════════════════════════════════════
// SOURCE SCHEMA — enforces Article 2
// Every source must have a URL and an archive
// ════════════════════════════════════════

const sourceSchema = z.object({
  description: z.string(),
  url: z.string().url(),
  archive_url: z.string().url().optional(),  // Required before publish — optional during draft
  tier: z.enum(['primary', 'corroborated', 'single-source']),
  // Tier 4 (unverifiable) is not representable — by design
  accessed: z.string(),  // ISO date
});

// ════════════════════════════════════════
// CONFLICT RECORDS — CON-YYYY-NNNN
// The context. References actors, does not describe them.
// ════════════════════════════════════════

const conflicts = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^CON-\d{4}-\d{4}$/),
    title: z.string(),
    status: z.enum(['active', 'ceasefire', 'ended', 'frozen']),
    start_date: z.string(),
    start_date_note: z.string().optional(),
    // Constitution 3.4: "Choosing where a story begins is an editorial act"
    framing_note: z.string().default(
      'The selection of a start date is an editorial act. See timeline for documented antecedents.'
    ),
    regions: z.array(z.string()),
    actors: z.array(z.string()),  // References to actor IDs: ACT-YYYY-NNNN
    autopsies: z.array(z.string()).default([]),  // References to CA-YYYY-NNNN
    human_cost: z.object({
      civilian_deaths: z.object({
        value: z.string(),  // String to allow "10,000+" or "unknown"
        source: sourceSchema,
        last_updated: z.string(),
      }).optional(),
      displaced: z.object({
        value: z.string(),
        source: sourceSchema,
        last_updated: z.string(),
      }).optional(),
      military_deaths: z.object({
        value: z.string(),
        source: sourceSchema,
        last_updated: z.string(),
      }).optional(),
    }).optional(),
    economic_cost: z.object({
      summary: z.string(),
      sources: z.array(sourceSchema),
    }).optional(),
    timeline: z.array(z.object({
      date: z.string(),
      event: z.string(),
      type: z.enum(['documented', 'inference']),  // Constitution 3.2
      sources: z.array(sourceSchema),
    })),
    last_updated: z.string(),
    status_note: z.enum(['draft', 'published', 'under-review']).default('draft'),
  }),
});

// ════════════════════════════════════════
// ACTOR RECORDS — ACT-YYYY-NNNN
// The product: stated position vs documented action
// ════════════════════════════════════════

const actors = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^ACT-\d{4}-\d{4}$/),
    name: z.string(),
    role: z.string(),
    // Constitution 3.1: describe by role and action, not identity labels
    in_power_since: z.string().optional(),
    affiliation: z.string().optional(),
    conflicts: z.array(z.string()),  // CON-YYYY-NNNN references

    stated_positions: z.array(z.object({
      claim: z.string(),
      date: z.string(),
      context: z.string(),
      source: sourceSchema,
    })),

    documented_actions: z.array(z.object({
      action: z.string(),
      date: z.string(),
      impact: z.string().optional(),
      sources: z.array(sourceSchema),
    })),

    gap_analysis: z.array(z.object({
      stated: z.string(),
      documented: z.string(),
      gap: z.string(),
      type: z.enum(['documented', 'inference']),  // Constitution 3.2
      confidence: z.enum(['high', 'medium', 'low']),
      sources: z.array(sourceSchema),
    })),

    personal_interests: z.array(z.object({
      interest: z.string(),
      relevance: z.string(),
      type: z.enum(['documented', 'inference']),
      sources: z.array(sourceSchema),
    })).optional(),

    last_updated: z.string(),
    status_note: z.enum(['draft', 'published', 'under-review']).default('draft'),
  }),
});

// ════════════════════════════════════════
// CLAIM AUTOPSIES — CA-YYYY-NNNN
// The shareable product. What gets cited.
// ════════════════════════════════════════

const autopsies = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^CA-\d{4}-\d{4}$/),
    title: z.string(),
    conflict: z.string(),  // CON-YYYY-NNNN
    actor: z.string(),     // ACT-YYYY-NNNN (primary claimant)

    the_claim: z.object({
      text: z.string(),
      speaker: z.string(),
      speaker_role: z.string(),
      date: z.string(),
      context: z.string(),
      source: sourceSchema,
    }),

    the_evidence: z.object({
      supporting: z.array(z.object({
        summary: z.string(),
        source: sourceSchema,
        credibility_note: z.string(),
      })).default([]),
      contradicting: z.array(z.object({
        summary: z.string(),
        source: sourceSchema,
        credibility_note: z.string(),
      })).default([]),
    }),

    the_gap: z.object({
      summary: z.string(),
      // Constitution 3.2: this is always inference, labeled as such
      type: z.literal('inference'),
    }),

    who_benefits: z.array(z.object({
      actor: z.string(),  // ACT-YYYY-NNNN
      benefit: z.string(),
      // Constitution: "Who benefits" is documented context, not accusation
      type: z.enum(['documented', 'inference']),
      source: sourceSchema.optional(),
    })),

    confidence: z.enum(['high', 'medium', 'low']),
    confidence_basis: z.string(),

    // Pre-publish checklist — Constitution Article 2 enforcement
    publish_checklist: z.object({
      all_sources_tier2_minimum: z.boolean().default(false),
      all_sources_archived: z.boolean().default(false),
      inference_labeled: z.boolean().default(false),
      no_identity_labels: z.boolean().default(false),
      gap_analysis_sourced: z.boolean().default(false),
    }).optional(),

    last_updated: z.string(),
    status_note: z.enum(['draft', 'published', 'under-review']).default('draft'),
  }),
});

export const collections = { conflicts, actors, autopsies };
"@ | Out-File -Encoding utf8 "$root\site\src\content\config.ts"

# ─────────────────────────────────────
# i18n FOUNDATION
# ─────────────────────────────────────

# English strings
@"
{
  "site": {
    "title": "Parallaxin",
    "tagline": "What power says. What power does. The distance between.",
    "nav": {
      "conflicts": "Conflicts",
      "actors": "Actors",
      "autopsies": "Claim Autopsies",
      "about": "About",
      "constitution": "Constitution"
    }
  },
  "content": {
    "documented": "DOCUMENTED",
    "inference": "INFERENCE",
    "source_needed": "SOURCE NEEDED",
    "last_updated": "Last updated",
    "confidence": "Confidence",
    "sources": "Sources",
    "stated": "Stated position",
    "documented_action": "Documented action",
    "the_gap": "The gap",
    "who_benefits": "Who benefits from this claim",
    "draft_notice": "DRAFT — This record has not completed the Evidence Standard review. Sources marked [SOURCE NEEDED] require verification before publication.",
    "framing_notice": "The selection of a start date is an editorial act. Events have documented antecedents. See full timeline."
  },
  "evidence": {
    "tier1": "Primary source",
    "tier2": "Corroborated",
    "tier3": "Single-source — awaiting corroboration",
    "high": "High confidence",
    "medium": "Medium confidence",
    "low": "Low confidence"
  },
  "footer": {
    "license_code": "Code: MIT License",
    "license_content": "Content: CC-BY 4.0",
    "constitution_link": "Governed by the Parallaxin Constitution",
    "no_tracking": "No tracking. No accounts. No data collected."
  }
}
"@ | Out-File -Encoding utf8 "$root\site\src\i18n\en.json"

# Arabic strings
@"
{
  "site": {
    "title": "بارالاكسين",
    "tagline": "ما تقوله السلطة. ما تفعله السلطة. المسافة بينهما.",
    "nav": {
      "conflicts": "النزاعات",
      "actors": "الأطراف",
      "autopsies": "تشريح الادعاءات",
      "about": "عن المنصة",
      "constitution": "الدستور"
    }
  },
  "content": {
    "documented": "موثّق",
    "inference": "استنتاج",
    "source_needed": "مصدر مطلوب",
    "last_updated": "آخر تحديث",
    "confidence": "مستوى الثقة",
    "sources": "المصادر",
    "stated": "الموقف المُعلَن",
    "documented_action": "الفعل الموثّق",
    "the_gap": "الفجوة",
    "who_benefits": "من يستفيد من هذا الادعاء",
    "draft_notice": "مسودة — لم يكتمل التحقق من المصادر بعد. المصادر المعلّمة [مصدر مطلوب] تحتاج تأكيداً قبل النشر.",
    "framing_notice": "اختيار تاريخ البداية هو قرار تحريري. للأحداث سوابق موثّقة. راجع الجدول الزمني الكامل."
  },
  "evidence": {
    "tier1": "مصدر أولي",
    "tier2": "مؤكّد من مصادر متعددة",
    "tier3": "مصدر واحد — بانتظار التأكيد",
    "high": "ثقة عالية",
    "medium": "ثقة متوسطة",
    "low": "ثقة منخفضة"
  },
  "footer": {
    "license_code": "الكود: رخصة MIT",
    "license_content": "المحتوى: CC-BY 4.0",
    "constitution_link": "تحكمه دستور بارالاكسين",
    "no_tracking": "بدون تتبع. بدون حسابات. بدون جمع بيانات."
  }
}
"@ | Out-File -Encoding utf8 "$root\site\src\i18n\ar.json"

# Farsi strings
@"
{
  "site": {
    "title": "پارالاکسین",
    "tagline": ".آنچه قدرت می‌گوید. آنچه قدرت انجام می‌دهد. فاصله میان این دو",
    "nav": {
      "conflicts": "درگیری‌ها",
      "actors": "بازیگران",
      "autopsies": "کالبدشکافی ادعاها",
      "about": "درباره",
      "constitution": "اساسنامه"
    }
  },
  "content": {
    "documented": "مستند",
    "inference": "استنباط",
    "source_needed": "منبع مورد نیاز",
    "last_updated": "آخرین به‌روزرسانی",
    "confidence": "سطح اطمینان",
    "sources": "منابع",
    "stated": "موضع اعلام‌شده",
    "documented_action": "اقدام مستند",
    "the_gap": "شکاف",
    "who_benefits": "چه کسی از این ادعا سود می‌برد",
    "draft_notice": "پیش‌نویس — بررسی استاندارد شواهد کامل نشده است. منابع نشان‌گذاری‌شده نیاز به تأیید دارند.",
    "framing_notice": "انتخاب تاریخ شروع یک تصمیم تحریریه‌ای است. رویدادها پیشینه مستند دارند. جدول زمانی کامل را ببینید."
  },
  "evidence": {
    "tier1": "منبع اولیه",
    "tier2": "تأیید شده از منابع متعدد",
    "tier3": "تک‌منبع — در انتظار تأیید",
    "high": "اطمینان بالا",
    "medium": "اطمینان متوسط",
    "low": "اطمینان پایین"
  },
  "footer": {
    "license_code": "MIT کد: مجوز",
    "license_content": "CC-BY 4.0 :محتوا",
    "constitution_link": "تحت حاکمیت اساسنامه پارالاکسین",
    "no_tracking": ".بدون ردیابی. بدون حساب کاربری. بدون جمع‌آوری داده"
  }
}
"@ | Out-File -Encoding utf8 "$root\site\src\i18n\fa.json"

# i18n utility
@"
import en from './en.json';
import ar from './ar.json';
import fa from './fa.json';

const translations: Record<string, typeof en> = { en, ar, fa };

export type Locale = 'en' | 'ar' | 'fa' | 'fr' | 'es';

export const defaultLocale: Locale = 'en';

export const rtlLocales: Locale[] = ['ar', 'fa'];

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale] || translations[defaultLocale];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return isRtl(locale) ? 'rtl' : 'ltr';
}
"@ | Out-File -Encoding utf8 "$root\site\src\i18n\utils.ts"

# ─────────────────────────────────────
# BASE LAYOUT
# ─────────────────────────────────────

@"
---
import { t, getDirection, type Locale } from '@i18n/utils';

interface Props {
  title?: string;
  locale?: Locale;
}

const { title, locale = 'en' } = Astro.props;
const dir = getDirection(locale);
const siteTitle = t(locale, 'site.title');
const pageTitle = title ? ` `${title} | `${siteTitle}` : siteTitle;
---

<!DOCTYPE html>
<html lang={locale} dir={dir}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={t(locale, 'site.tagline')} />
  
  <!-- No tracking. Constitution Article 7.4 -->
  <!-- No analytics scripts. Ever. -->
  
  <title>{pageTitle}</title>
  <link rel="stylesheet" href="/styles/global.css" />
</head>
<body>
  <header>
    <nav>
      <a href="/" class="site-title">{siteTitle}</a>
      <span class="tagline">{t(locale, 'site.tagline')}</span>
      <div class="nav-links">
        <a href="/conflicts">{t(locale, 'site.nav.conflicts')}</a>
        <a href="/actors">{t(locale, 'site.nav.actors')}</a>
        <a href="/autopsies">{t(locale, 'site.nav.autopsies')}</a>
        <a href="/constitution">{t(locale, 'site.nav.constitution')}</a>
      </div>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer>
    <p>{t(locale, 'footer.constitution_link')}</p>
    <p>{t(locale, 'footer.license_code')} · {t(locale, 'footer.license_content')}</p>
    <p class="no-tracking">{t(locale, 'footer.no_tracking')}</p>
  </footer>
</body>
</html>
"@ | Out-File -Encoding utf8 "$root\site\src\layouts\Base.astro"

# ─────────────────────────────────────
# GLOBAL STYLES
# ─────────────────────────────────────

@"
/* Parallaxin — Global Styles */
/* Design principle: readable, fast, works everywhere */

:root {
  --color-bg: #0a0a0a;
  --color-surface: #141414;
  --color-border: #2a2a2a;
  --color-text: #e0e0e0;
  --color-text-muted: #888;
  --color-accent: #4a9eff;
  --color-documented: #4ade80;
  --color-inference: #fbbf24;
  --color-source-needed: #ef4444;
  --color-gap: #f97316;
  --font-body: system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'Cascadia Code', 'Fira Code', monospace;
  --max-width: 800px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
}

html {
  font-size: 18px;
  line-height: 1.7;
}

body {
  font-family: var(--font-body);
  background: var(--color-bg);
  color: var(--color-text);
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* RTL support */
[dir="rtl"] {
  font-family: 'Noto Sans Arabic', var(--font-body);
}

/* Navigation */
header nav {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.site-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
}

.tagline {
  display: block;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.nav-links a {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.9rem;
}

.nav-links a:hover {
  text-decoration: underline;
}

/* Content type badges */
.badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-documented {
  background: rgba(74, 222, 128, 0.15);
  color: var(--color-documented);
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.badge-inference {
  background: rgba(251, 191, 36, 0.15);
  color: var(--color-inference);
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.badge-source-needed {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-source-needed);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-gap {
  background: rgba(249, 115, 22, 0.15);
  color: var(--color-gap);
  border: 1px solid rgba(249, 115, 22, 0.3);
}

/* Draft notice */
.draft-notice {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-left: 4px solid var(--color-source-needed);
  padding: 1rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

/* Framing notice — Constitution 3.4 */
.framing-notice {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-left: 4px solid var(--color-inference);
  padding: 1rem;
  margin-bottom: 2rem;
  font-size: 0.85rem;
  font-style: italic;
}

/* Source citations */
.source {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.source a {
  color: var(--color-accent);
}

.source .tier {
  opacity: 0.7;
}

/* Gap analysis blocks */
.gap-block {
  border-left: 4px solid var(--color-gap);
  padding: 1rem;
  margin: 1.5rem 0;
  background: rgba(249, 115, 22, 0.05);
}

.gap-block .stated { color: var(--color-text-muted); }
.gap-block .actual { color: var(--color-text); }
.gap-block .gap-summary { 
  color: var(--color-gap); 
  font-weight: 600;
  margin-top: 0.5rem;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.9rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

[dir="rtl"] th,
[dir="rtl"] td {
  text-align: right;
}

th {
  color: var(--color-text-muted);
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
}

/* Footer */
footer {
  margin-top: 4rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.no-tracking {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  opacity: 0.5;
}

/* Headings */
h1 { font-size: 1.8rem; margin-bottom: 1rem; }
h2 { font-size: 1.4rem; margin: 2rem 0 0.75rem; color: var(--color-accent); }
h3 { font-size: 1.1rem; margin: 1.5rem 0 0.5rem; }

a { color: var(--color-accent); }

/* Code comments — Constitution 3.5 */
.context-note {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-text-muted);
  border-left: 2px solid var(--color-border);
  padding-left: 1rem;
  margin: 1rem 0;
}

.context-note::before {
  content: "// ";
  opacity: 0.5;
}
"@ | Out-File -Encoding utf8 "$root\site\public\styles\global.css"

# ─────────────────────────────────────
# HOME PAGE
# ─────────────────────────────────────

@"
---
import Base from '@layouts/Base.astro';
---

<Base title="Home">
  <h1>Parallaxin</h1>
  <p class="tagline">What power says. What power does. The distance between.</p>

  <section>
    <h2>What this is</h2>
    <p>
      A platform that documents the gap between the stated positions and 
      the documented actions of powerful actors — governments, militaries, 
      institutions, and the individuals who command them.
    </p>
    <p>
      We are not neutral. We are <strong>objective</strong>. The difference: 
      neutrality pretends both sides of a fact are equal. Objectivity follows 
      evidence regardless of who it inconveniences.
    </p>
    <p>
      Every claim is sourced. Every source is linked. Every inference is labeled.
      <a href="/constitution">Read the Constitution.</a>
    </p>
  </section>

  <section>
    <h2>Active Conflicts</h2>
    <p><em>Pilot records in development. First conflict record deploying soon.</em></p>
    <!-- Dynamic listing will go here -->
  </section>

  <section>
    <h2>How this works</h2>
    <ul>
      <li><strong>Conflict Records</strong> — the documented timeline and context of active conflicts</li>
      <li><strong>Actor Records</strong> — what powerful actors say vs. what they do</li>
      <li><strong>Claim Autopsies</strong> — official claims dissected against primary evidence</li>
    </ul>
    <p>
      All content is open source. All changes are tracked in Git. 
      All contributions are reviewed against the 
      <a href="/constitution">Evidence Standard</a>.
    </p>
  </section>
</Base>
"@ | Out-File -Encoding utf8 "$root\site\src\pages\index.astro"

# ─────────────────────────────────────
# SOURCE CHECKER SCRIPT
# ─────────────────────────────────────

New-Item -ItemType Directory -Force -Path "$root\site\scripts" | Out-Null

@"
// scripts/check-sources.mjs
// Validates that all source URLs in content files are reachable
// Run: node scripts/check-sources.mjs

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const CONTENT_DIR = 'src/content';
const URL_REGEX = /url:\s*["']?(https?:\/\/[^\s"']+)/g;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter(e => e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.mdx')))
    .map(e => join(e.parentPath || e.path, e.name));
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
    return { url, status: res.status, ok: res.ok };
  } catch (e) {
    return { url, status: 0, ok: false, error: e.message };
  }
}

async function main() {
  const files = await getFiles(CONTENT_DIR);
  console.log(`Checking sources in ${files.length} content files...\n`);
  
  let total = 0, broken = 0;
  
  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const urls = [...content.matchAll(URL_REGEX)].map(m => m[1]);
    
    for (const url of urls) {
      total++;
      const result = await checkUrl(url);
      if (!result.ok) {
        broken++;
        console.log(`  BROKEN [${result.status}] `${file}`);
        console.log(`         `${url}`);
        if (result.error) console.log(`         `${result.error}`);
      }
    }
  }
  
  console.log(`\n`${total} sources checked. `${broken} broken.`);
  process.exit(broken > 0 ? 1 : 0);
}

main();
"@ | Out-File -Encoding utf8 "$root\site\scripts\check-sources.mjs"

# ─────────────────────────────────────
# GITHUB ACTIONS — CI/CD
# ─────────────────────────────────────

@"
name: Build & Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: site/package-lock.json
      
      - name: Install dependencies
        working-directory: site
        run: npm ci
      
      - name: Check sources
        working-directory: site
        run: npm run lint:links
        continue-on-error: true  # Don't block on broken external links
      
      - name: Build
        working-directory: site
        run: npm run build
      
      - name: Upload artifact
        if: github.ref == 'refs/heads/main'
        uses: actions/upload-pages-artifact@v3
        with:
          path: site/dist

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: `${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
"@ | Out-File -Encoding utf8 "$root\.github\workflows\deploy.yml"

# ─────────────────────────────────────
# .gitignore
# ─────────────────────────────────────

@"
# Dependencies
site/node_modules/

# Build output
site/dist/
site/.astro/

# Environment
.env
.env.*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/settings.json
.idea/
"@ | Out-File -Encoding utf8 "$root\.gitignore"

# ─────────────────────────────────────
# DONE
# ─────────────────────────────────────

Write-Host ""
Write-Host "=== SCAFFOLD COMPLETE ===" -ForegroundColor Green
Write-Host ""
Write-Host "Structure:" -ForegroundColor Yellow
Write-Host "  parallaxin/"
Write-Host "  |-- docs/             (existing planning docs)"
Write-Host "  |-- site/"
Write-Host "  |   |-- src/"
Write-Host "  |   |   |-- content/  (conflicts, actors, autopsies)"
Write-Host "  |   |   |-- layouts/  (Base.astro)"
Write-Host "  |   |   |-- pages/    (index + routing)"
Write-Host "  |   |   |-- components/"
Write-Host "  |   |   `-- i18n/     (en, ar, fa + utilities)"
Write-Host "  |   |-- public/"
Write-Host "  |   |   |-- styles/"
Write-Host "  |   |   `-- fonts/"
Write-Host "  |   |-- scripts/      (source checker)"
Write-Host "  |   `-- package.json"
Write-Host "  |-- .github/workflows/ (CI/CD)"
Write-Host "  |-- README.md"
Write-Host "  |-- LICENSE-CODE       (MIT)"
Write-Host "  `-- LICENSE-CONTENT    (CC-BY 4.0)"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. cd site"
Write-Host "  2. npm install"
Write-Host "  3. npm run dev        (local preview at localhost:4321)"
Write-Host "  4. Start writing content records in src/content/"
Write-Host ""
Write-Host "The Constitution governs everything above." -ForegroundColor Yellow