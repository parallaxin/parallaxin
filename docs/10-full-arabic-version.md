# Design: Full Arabic Version

**Date**: 2026-03-09
**Status**: Approved
**Scope**: Full parallel mirror of the English site in Arabic

## Principle

One site, two languages, same structure. Every page at `/path` has an Arabic equivalent at `/ar/path`. Same evidence, same standards, same navigation. The language changes — the rigor doesn't.

This is also the reference implementation for the community translation workflow described in `docs/9-translation-guide.md` Section 7 of the build log.

## What Already Exists

- `ar.json` — all UI strings translated (nav, labels, badges, footer)
- `Base.astro` — `dir="rtl"` and `lang="ar"` wiring via `getDirection()`
- IBM Plex Sans Arabic font loaded in `global.css`
- Astro i18n config has `ar` in locales array
- RTL CSS: font override, blockquote border, checklist alignment

## Scope

### 8 Page Templates (Arabic variants)

| Route | Source to mirror |
|-------|-----------------|
| `/ar/` | `index.astro` |
| `/ar/constitution` | `constitution.astro` |
| `/ar/about` | `about.astro` |
| `/ar/terms` | `terms.astro` |
| `/ar/autopsies` | `autopsies/index.astro` |
| `/ar/autopsies/[id]` | `autopsies/[id].astro` |
| `/ar/actors` + `/ar/actors/[id]` | `actors/index.astro`, `actors/[id].astro` |
| `/ar/conflicts` + `/ar/conflicts/[id]` | `conflicts/index.astro`, `conflicts/[id].astro` |

### 4 Content Files (Arabic translations)

| File | Source |
|------|--------|
| `ca-2026-0001.ar.md` | `ca-2026-0001.md` |
| `ACT-2026-0001.ar.md` | `ACT-2026-0001.md` |
| `ACT-2026-0002.ar.md` | `ACT-2026-0002.md` |
| `CON-2025-0001.ar.md` | `CON-2025-0001.md` |

### 1 Language Switcher

Header component: `EN | عربي` — links to the equivalent page in the other language.

### RTL CSS Fixes

- Grid layouts (`.about-grid`, `.card-grid`) — logical properties or RTL overrides
- Table `text-align: left` → `[dir="rtl"] th { text-align: right }`
- Any remaining `margin-left`/`padding-left` that should flip

## Translation Rules

1. **Source URLs are NEVER translated.** Links point to original-language documents.
2. **Evidence tags rendered in Arabic.** `[DOCUMENTED]` → `[موثّق]`, `[INFERENCE]` → `[استنتاج]`
3. **Record IDs stay unchanged.** `CA-2026-0001`, not Arabic equivalents.
4. **MSA with project tone.** Formal but direct. No flowery rhetoric.
5. **`translation_meta` frontmatter** on every `.ar.md` file:
   ```yaml
   translation_meta:
     source_locale: "en"
     source_file: "ca-2026-0001.md"
     source_hash: "<git-hash>"
     translated_by: "parallaxin"
     translation_date: "2026-03-09"
     status: "translated"
   ```

## What Stays English

- Record IDs (CA-, ACT-, CON-)
- Source URLs and archive URLs
- Git metadata and filenames
- File naming convention (`.ar.md` suffix)

## What This Does NOT Include

- Other language pages (fa, fr, es) — infrastructure supports them later
- New content records
- CI translation-staleness checks (documented for Phase 2)
- Automated translation tooling

## Community Translation Precedent

This Arabic version serves as the template for future community translations:
- File naming: `{id}.{locale}.md`
- Frontmatter: full `translation_meta` block
- Review process: translator produces draft, reviewer validates evidence terminology
- The PR for this work becomes the reference contribution for `docs/9-translation-guide.md`

---

# Full Arabic Version — Implementation Plan

**Goal:** Ship a full Arabic mirror of Parallaxin — every page, every content record, RTL-polished — as the reference implementation for community translations.

**Architecture:** Arabic pages live under `site/src/pages/ar/`, mirroring the English structure. Arabic content files use `.ar.md` suffix (e.g., `ca-2026-0001.ar.md`). The existing `Base.astro` layout already supports `locale="ar"` with RTL direction. A language switcher in the header connects the two versions.

**Tech Stack:** Astro 5, existing i18n utils (`t()`, `getDirection()`), `ar.json` UI strings (already complete), CSS `[dir="rtl"]` selectors.

---

## Task 1: RTL CSS Fixes

**Files:**
- Modify: `site/public/styles/global.css`

**Step 1: Add missing RTL overrides**

Add these rules at the end of `global.css`, after the existing `[dir="rtl"]` rules:

```css
/* ═══ RTL SUPPORT ═══ */

/* Tables: flip text alignment */
[dir="rtl"] th,
[dir="rtl"] td {
  text-align: right;
}

/* Timeline: flip track to right side */
[dir="rtl"] .timeline-track {
  padding-left: 0;
  padding-right: 2rem;
}
[dir="rtl"] .timeline-track::before {
  left: auto;
  right: 0.5rem;
}
[dir="rtl"] .timeline-marker {
  left: auto;
  right: -1.75rem;
}

/* Border-left items: flip to border-right */
[dir="rtl"] .stated-item,
[dir="rtl"] .action-item,
[dir="rtl"] .antecedent-item,
[dir="rtl"] .evidence-item {
  padding-left: 1rem;
  padding-right: 1.25rem;
  border-left: none;
  border-right-width: 3px;
  border-right-style: solid;
}
[dir="rtl"] .stated-item { border-right-color: var(--color-text-muted); }
[dir="rtl"] .action-item { border-right-color: var(--color-documented); }
[dir="rtl"] .antecedent-item { border-right-color: var(--color-documented); }
[dir="rtl"] .antecedent-item--inference { border-right-color: var(--color-inference); }
[dir="rtl"] .evidence-item--supporting { border-right-color: var(--color-documented); }
[dir="rtl"] .evidence-item--contradicting { border-right-color: var(--color-gap); }

/* Gap analysis: flip border-left */
[dir="rtl"] .gap-item {
  border-left: none;
  border-right: 4px solid;
}

/* Verdict banner: flip border-left */
[dir="rtl"] .verdict-banner {
  border-left: none;
  border-right: 4px solid;
}
[dir="rtl"] .verdict--no { border-right-color: var(--color-gap); }
[dir="rtl"] .verdict--yes { border-right-color: var(--color-documented); }
[dir="rtl"] .verdict--partial { border-right-color: var(--color-inference); }
[dir="rtl"] .verdict--insufficient { border-right-color: var(--color-contested); }

/* Framing note: flip border */
[dir="rtl"] .framing-note {
  border-left: none;
  border-right: 4px solid var(--color-inference);
}

/* Gap block: flip border */
[dir="rtl"] .gap-block {
  border-left: none;
  border-right: 4px solid var(--color-gap);
}

/* Gap comparison: flip stated/documented border */
[dir="rtl"] .gap-stated-block {
  border-right: none;
  border-left: 1px solid var(--color-border);
}

/* Draft banner: flip border */
[dir="rtl"] .draft-banner {
  border-left: none;
  border-right: 4px solid var(--color-inference);
}

/* Personal interests: flip border */
[dir="rtl"] .interest-item--documented {
  border-left: none;
  border-right: 3px solid var(--color-documented);
}
[dir="rtl"] .interest-item--inference {
  border-left: none;
  border-right: 3px solid var(--color-inference);
}

/* About section list items: flip dash position */
[dir="rtl"] .about-col li {
  padding-left: 0;
  padding-right: 1rem;
}
[dir="rtl"] .about-col li::before {
  left: auto;
  right: 0;
}

/* Breadcrumb arrow direction */
[dir="rtl"] .actor-breadcrumb span:not(.actor-record-id),
[dir="rtl"] .conflict-breadcrumb span:not(.conflict-record-id),
[dir="rtl"] .autopsy-breadcrumb span:not(.autopsy-id) {
  /* The → character naturally reads wrong in RTL */
}

/* Confidence margin flip */
[dir="rtl"] .gap-confidence {
  margin-left: 0;
  margin-right: auto;
}

/* Constitution preamble border */
[dir="rtl"] .preamble {
  border-left: none;
  border-right: 4px solid var(--color-inference);
}
```

**Step 2: Verify build**

Run: `cd site && npm run build`
Expected: Exit 0, no CSS errors.

**Step 3: Commit**

```bash
git add site/public/styles/global.css
git commit -m "style: add comprehensive RTL CSS overrides for Arabic version"
```

---

## Task 2: Language Switcher in Base.astro

**Files:**
- Modify: `site/src/layouts/Base.astro`

**Step 1: Add language switcher logic and link**

In the frontmatter, add path computation for the alternate locale:

```typescript
// After: const base = import.meta.env.BASE_URL;

// Language switcher: compute alternate locale path
const isArabic = locale === 'ar';
const pathWithoutBase = currentPath.replace(base, '');
const altLocalePath = isArabic
  ? base + pathWithoutBase.replace(/^ar\/?/, '')  // Strip /ar/ prefix for English
  : base + 'ar/' + pathWithoutBase;               // Add /ar/ prefix for Arabic
const altLocaleLabel = isArabic ? 'EN' : 'عربي';
```

In the nav (after the GitHub link), add:

```html
<a href={altLocalePath} class="site-nav-lang">
  {altLocaleLabel}
</a>
```

Also update footer links for Arabic pages — the About and Terms links need to point to `/ar/about` and `/ar/terms` when on Arabic pages:

```html
<a href={isArabic ? base + 'ar/about' : base + 'about'}>{t(locale, 'site.nav.about')}</a> ·
<a href={isArabic ? base + 'ar/terms' : base + 'terms'}>Terms</a> ·
```

And update nav links to be locale-aware. Each nav `<a>` should prefix with `ar/` when `isArabic`:

```html
<a href={base + (isArabic ? 'ar/' : '') + 'conflicts'} ...>
<a href={base + (isArabic ? 'ar/' : '') + 'actors'} ...>
<a href={base + (isArabic ? 'ar/' : '') + 'autopsies'} ...>
<a href={base + (isArabic ? 'ar/' : '') + 'constitution'} ...>
```

**Step 2: Add CSS for language switcher**

In `global.css`, add:

```css
.site-nav-lang {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 2px;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: border-color 0.15s, color 0.15s;
}
.site-nav-lang:hover {
  border-color: var(--color-documented);
  color: var(--color-documented);
}
```

**Step 3: Verify build**

Run: `cd site && npm run build`
Expected: Exit 0. English pages show "عربي" link, Arabic pages (once created) show "EN" link.

**Step 4: Commit**

```bash
git add site/src/layouts/Base.astro site/public/styles/global.css
git commit -m "feat: add language switcher (EN/عربي) to header navigation"
```

---

## Task 3: Arabic Homepage

**Files:**
- Create: `site/src/pages/ar/index.astro`

**Step 1: Create the Arabic homepage**

This mirrors `site/src/pages/index.astro` with:
- `locale = 'ar'`
- All hardcoded English text translated to Arabic (MSA, project tone)
- Card links pointing to `/ar/autopsies/...`, `/ar/actors/...`, `/ar/conflicts/...`
- Arrow text `← اقرأ التشريح` (flipped for RTL)
- Same content queries (same English content rendered — Arabic content comes later)

Key translations for hardcoded strings on homepage:

| English | Arabic |
|---------|--------|
| "Parallaxin documents the gap between the stated positions and documented actions of powerful actors..." | "يوثّق بارالاكسين المسافة بين المواقف المُعلنة والأفعال الموثّقة لأصحاب السلطة — حكومات، قوى عسكرية، وأفراد تؤثر قراراتهم في حياة البشر على نطاق واسع." |
| "Every claim is sourced. Every inference is labeled. No editorials. No ads. No accounts required." | "كل ادعاء موثّق بمصدر. كل استنتاج مُعلَّم. بلا تحرير رأي. بلا إعلانات. بلا حسابات." |
| "Read the Constitution →" | "← اقرأ الدستور" |
| "CONTESTED — single-source or disputed, awaiting corroboration" | "مُتنازَع عليه — مصدر واحد أو محل خلاف، بانتظار التأكيد" |
| "Official claims examined against available evidence. The record that answers: what did the evidence actually show?" | "ادعاءات رسمية تُفحص في ضوء الأدلة المتاحة. السجل الذي يجيب: ماذا أظهرت الأدلة فعلاً؟" |
| "First autopsies are under review. Check back shortly." | "التشريحات الأولى قيد المراجعة. عُد قريباً." |
| "Read autopsy →" | "← اقرأ التشريح" |
| "Documented timelines, actor records, and human cost. Updated when new evidence is verified." | "جداول زمنية موثّقة، وسجلات أطراف، وتكلفة بشرية. يُحدَّث عند التحقق من أدلة جديدة." |
| "Conflict records are being sourced and verified." | "سجلات النزاعات قيد التوثيق والتحقق." |
| "View conflict record →" | "← عرض سجل النزاع" |
| "Stated positions. Documented actions. The gap between them." | "مواقف مُعلنة. أفعال موثّقة. المسافة بينهما." |
| "Actor records are being verified." | "سجلات الأطراف قيد التحقق." |
| "View actor record →" | "← عرض سجل الطرف" |
| "What this is. What it is not." | "ما هو هذا. وما ليس كذلك." |
| "What Parallaxin is" | "ما هو بارالاكسين" |
| "What Parallaxin is not" | "ما ليس بارالاكسين" |
| (all 10 bullet points in the about section) | (translated — see full file) |
| "GitHub — contribute or fork" | "GitHub — ساهم أو انسخ المشروع" |
| "high/medium/low confidence" | "ثقة عالية / ثقة متوسطة / ثقة منخفضة" |
| "Evidence:" | "الأدلة:" |
| "From ... — ongoing" | "من ... — مستمر" |

All links must use `base + 'ar/...'` prefix for internal navigation.

For content that comes from data (record titles, names, etc.) — these stay in English for now since the content files are English. When Arabic content files are created (Task 7), the Arabic detail pages will use those instead.

**Step 2: Verify build**

Run: `cd site && npm run build`
Expected: Exit 0. `/ar/` route renders.

**Step 3: Commit**

```bash
git add site/src/pages/ar/index.astro
git commit -m "feat: add Arabic homepage — full mirror of English version"
```

---

## Task 4: Arabic Structural Pages

**Files:**
- Create: `site/src/pages/ar/constitution.astro`
- Create: `site/src/pages/ar/about.astro`
- Create: `site/src/pages/ar/terms.astro`

**Step 1: Create Arabic Constitution page**

Mirror `site/src/pages/constitution.astro` with full Arabic translation of all 10 articles. Key translations:

- "The Parallaxin Constitution" → "دستور بارالاكسين"
- "Version 1.0 — Ratified before the first line of code" → "الإصدار 1.0 — أُقِرّ قبل كتابة أول سطر برمجي"
- All articles translated maintaining legal/formal MSA register
- Evidence tier table: tier names stay English ("Tier 1"), descriptions translated
- Article 8.2 specifically mentions Arabic — this is a self-referential moment

Each page imports `Base.astro` with `locale="ar"` and links point to `ar/` prefixed paths.

**Step 2: Create Arabic About page**

Mirror `site/src/pages/about.astro`. Key sections:
- "The Lens Metaphor" → "استعارة العدسة"
- "Ungovernable by Design" → "مُصمَّم ليكون خارج السيطرة"
- "Git as Audit Trail" → "Git كسجل مراجعة دائم"

**Step 3: Create Arabic Terms page**

Mirror `site/src/pages/terms.astro`. Legal language in formal MSA.

**Step 4: Verify build**

Run: `cd site && npm run build`
Expected: Exit 0. `/ar/constitution`, `/ar/about`, `/ar/terms` all render.

**Step 5: Commit**

```bash
git add site/src/pages/ar/constitution.astro site/src/pages/ar/about.astro site/src/pages/ar/terms.astro
git commit -m "feat: add Arabic structural pages (constitution, about, terms)"
```

---

## Task 5: Arabic Listing Pages

**Files:**
- Create: `site/src/pages/ar/autopsies/index.astro`
- Create: `site/src/pages/ar/actors/index.astro`
- Create: `site/src/pages/ar/conflicts/index.astro`

**Step 1: Create Arabic listing pages**

Each mirrors its English counterpart with:
- `locale = 'ar'` passed to Base.astro
- `t(locale, ...)` for UI strings that exist in `ar.json`
- Hardcoded English descriptions translated to Arabic
- Card links point to `base + 'ar/autopsies/...'` etc.
- Arrow text flipped: `← اقرأ التشريح` instead of `Read autopsy →`

These pages query the SAME content collections (English content). The data (titles, names) renders in English — this is expected. Arabic content records (Task 7) will be linked from Arabic detail pages.

Key translations for listing page descriptions:

**Autopsies listing:**
- "Claim Autopsies" → "تشريح الادعاءات"
- Description paragraph → translated
- Empty state text → translated
- "confidence" → from `ar.json` evidence keys

**Actors listing:**
- "Actor Records" → "سجلات الأطراف"
- Description → translated
- Empty state → translated

**Conflicts listing:**
- "Conflict Records" → "سجلات النزاعات"
- Framing note → from `ar.json` (`content.framing_notice`)
- Description → translated

**Step 2: Verify build**

Run: `cd site && npm run build`
Expected: Exit 0. All three listing pages render under `/ar/`.

**Step 3: Commit**

```bash
git add site/src/pages/ar/autopsies/index.astro site/src/pages/ar/actors/index.astro site/src/pages/ar/conflicts/index.astro
git commit -m "feat: add Arabic listing pages (autopsies, actors, conflicts)"
```

---

## Task 6: Arabic Detail Pages

**Files:**
- Create: `site/src/pages/ar/autopsies/[id].astro`
- Create: `site/src/pages/ar/actors/[id].astro`
- Create: `site/src/pages/ar/conflicts/[id].astro`

**Step 1: Create Arabic autopsy detail page**

This is the most complex page. Mirror `site/src/pages/autopsies/[id].astro` with:
- `locale = 'ar'`, `dir = 'rtl'`
- **Content resolution strategy**: For each English autopsy ID (e.g., `ca-2026-0001`), check if an Arabic content file exists (`ca-2026-0001.ar.md`). If yes, use Arabic content. If no, fall back to English content. This allows gradual translation.

```typescript
// In getStaticPaths:
const allAutopsies = await getCollection('autopsies');
// Get base IDs (strip .ar suffix if present, strip .md)
const englishAutopsies = allAutopsies.filter(a => !a.id.includes('.ar'));

return englishAutopsies.map((autopsy) => {
  const baseId = autopsy.id.replace('.md', '');
  // Look for Arabic version
  const arabicVersion = allAutopsies.find(a =>
    a.id.replace('.md', '') === baseId + '.ar'
  );
  return {
    params: { id: baseId },
    props: { autopsy: arabicVersion || autopsy, isTranslated: !!arabicVersion },
  };
});
```

All section titles translated:
- "The Claim" → "الادعاء"
- "The Evidence" → "الأدلة"
- "Supporting the claim" → "أدلة مؤيدة للادعاء"
- "Contradicting the claim" → "أدلة مناقضة للادعاء"
- "The Sequence" → "التسلسل الزمني"
- "The Gap" → "الفجوة"
- "Who Benefits" → "من يستفيد"
- "Evidence Assessment" → "تقييم الأدلة"
- "Evidence is missing or incorrect?" → "هل هناك أدلة ناقصة أو غير صحيحة؟"
- "Submit a correction via GitHub →" → "← أرسل تصحيحاً عبر GitHub"
- "Credibility note:" → "ملاحظة المصداقية:"
- "Confidence:" → "الثقة:"
- "Claim supported by evidence:" → "هل يدعم الدليل الادعاء:"
- "DOCUMENTED" → "موثّق" (in sequence tags)
- "INFERENCE" → "استنتاج" (in sequence tags)

Breadcrumbs: `بارالاكسين → تشريح الادعاءات → CA-2026-0001`

**Step 2: Create Arabic actor detail page**

Mirror `site/src/pages/actors/[id].astro` with same content resolution strategy.

Section titles:
- "Stated Positions" → "المواقف المُعلنة"
- "Documented Actions" → "الأفعال الموثّقة"
- "Gap Analysis" → "تحليل الفجوة"
- "STATED" → "المُعلَن"
- "DOCUMENTED" → "الموثّق"
- "THE GAP" → "الفجوة"
- "Personal Interests" → "المصالح الشخصية"
- "Review Notes" → "ملاحظات المراجعة"
- "DRAFT" → "مسودة"
- "In power since" → "في السلطة منذ"

**Step 3: Create Arabic conflict detail page**

Mirror `site/src/pages/conflicts/[id].astro` with same content resolution strategy.

Section titles:
- "Actors" → "الأطراف"
- "Timeline" → "الجدول الزمني"
- "Antecedents" → "السوابق"
- "Human Cost" → "التكلفة البشرية"
- "Economic Cost" → "التكلفة الاقتصادية"
- "Related Claim Autopsies" → "تشريحات الادعاءات ذات الصلة"
- "FRAMING NOTE — ARTICLE 3.4" → "ملاحظة تأطير — المادة 3.4"
- "Civilian Deaths" → "وفيات مدنيين"
- "Combatant Deaths" → "وفيات مقاتلين"
- "Displaced" → "نازحون"
- "Injured" → "مصابون"
- "Entered:" → "دخل النزاع:"
- "Outcome:" → "النتيجة:"
- "Relevance:" → "الصلة:"
- "Documented antecedents. Not background color. Causally connected events." → "سوابق موثّقة. ليست خلفية تزيينية. أحداث مرتبطة سببياً."

**Step 4: Verify build**

Run: `cd site && npm run build`
Expected: Exit 0. Detail pages render at `/ar/autopsies/ca-2026-0001`, `/ar/actors/ACT-2026-0001`, etc. (using English content as fallback since Arabic content not yet created).

**Step 5: Commit**

```bash
git add site/src/pages/ar/autopsies/[id].astro site/src/pages/ar/actors/[id].astro site/src/pages/ar/conflicts/[id].astro
git commit -m "feat: add Arabic detail pages with fallback content resolution"
```

---

## Task 7: Arabic Content Files

**Files:**
- Create: `site/src/content/autopsies/ca-2026-0001.ar.md`
- Create: `site/src/content/actors/ACT-2026-0001.ar.md`
- Create: `site/src/content/actors/ACT-2026-0002.ar.md`
- Create: `site/src/content/conflicts/CON-2025-0001.ar.md`

**Step 1: Get git hash of English source files**

Run: `git log -1 --format="%H" -- site/src/content/autopsies/ca-2026-0001.md`
(Repeat for each file — needed for `translation_meta.source_hash`)

**Step 2: Create Arabic autopsy — ca-2026-0001.ar.md**

This is the flagship translation. Rules:
- All frontmatter field VALUES translated to Arabic (titles, descriptions, gap_summary, credibility notes, etc.)
- Field KEYS stay in English (they're schema-enforced)
- `source_url`, `source_archive_url` — UNCHANGED (always original language)
- `source_description` — translated to Arabic
- `source_tier` — stays as "Tier 1", "Tier 2" etc. (schema values)
- `record_id`, `conflict_ref`, `actor_ref` — UNCHANGED
- Evidence tags in `sequence` field: `[موثّق]` and `[استنتاج]` instead of `[DOCUMENTED]` and `[INFERENCE]`
- Add `translation_meta` block to frontmatter

Key content translations:

| Field | English | Arabic |
|-------|---------|--------|
| title | "Was Iran weeks away from a nuclear weapon?" | "هل كانت إيران على بُعد أسابيع من سلاح نووي؟" |
| the_claim.text | "Iran posed an imminent nuclear threat..." | "شكّلت إيران تهديداً نووياً وشيكاً يستلزم عملاً عسكرياً فورياً..." |
| gap_summary | (full paragraph) | (full Arabic translation) |
| sequence lines | Each `[DOCUMENTED]` / `[INFERENCE]` line | Translated with `[موثّق]` / `[استنتاج]` tags |

**Step 3: Create Arabic actor records**

`ACT-2026-0001.ar.md` (Netanyahu) and `ACT-2026-0002.ar.md` (Trump):
- Names stay in English + Arabic: `name: "بنيامين نتنياهو (Benjamin Netanyahu)"`
- Roles translated: "رئيس وزراء إسرائيل"
- All stated_positions.claim text translated
- All documented_actions.action text translated
- All gap_analysis text translated
- Personal interests translated
- Source URLs unchanged

**Step 4: Create Arabic conflict record**

`CON-2025-0001.ar.md`:
- `name: "حرب إيران-إسرائيل-الولايات المتحدة (2025–الآن)"`
- `framing_note` translated
- All timeline event descriptions translated
- All antecedent descriptions translated
- Human/economic cost labels translated
- Geography stays in Arabic: already natural — "إيران", "إسرائيل", "لبنان", etc.

**Step 5: Verify build**

Run: `cd site && npm run build`
Expected: Exit 0. Arabic content renders on Arabic detail pages. Page count increases by the number of new routes.

**Step 6: Commit**

```bash
git add site/src/content/autopsies/ca-2026-0001.ar.md site/src/content/actors/ACT-2026-0001.ar.md site/src/content/actors/ACT-2026-0002.ar.md site/src/content/conflicts/CON-2025-0001.ar.md
git commit -m "feat: add Arabic content translations (1 autopsy, 2 actors, 1 conflict)

Translation rules applied:
- Source URLs preserved in original language
- Record IDs unchanged
- Evidence tags: [موثّق] / [استنتاج]
- translation_meta frontmatter on all files
- MSA register, project tone maintained"
```

---

## Task 8: Build Verification & Final Polish

**Files:**
- Possibly modify: various files for bug fixes discovered during verification

**Step 1: Full build**

Run: `cd site && npm run build`
Expected: Exit 0. Count total pages — should be roughly double the English count.

**Step 2: Dev server manual verification**

Run: `cd site && npm run dev`

Check these routes:
- [ ] `/ar/` — Homepage renders in Arabic, RTL layout correct
- [ ] `/ar/constitution` — All 10 articles in Arabic
- [ ] `/ar/about` — About page in Arabic
- [ ] `/ar/terms` — Terms page in Arabic
- [ ] `/ar/autopsies` — Listing shows content
- [ ] `/ar/autopsies/ca-2026-0001` — Full autopsy in Arabic
- [ ] `/ar/actors` — Listing shows actors
- [ ] `/ar/actors/ACT-2026-0001` — Actor detail in Arabic
- [ ] `/ar/conflicts` — Listing shows conflicts
- [ ] `/ar/conflicts/CON-2025-0001` — Conflict detail in Arabic
- [ ] Language switcher: EN ↔ عربي toggles correctly on all pages
- [ ] RTL: no visual breaks, borders on correct side, timeline flipped

**Step 3: Fix any issues discovered**

**Step 4: Update ar.json if any new keys were needed**

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Arabic version — full site mirror with RTL support

- 8 Arabic page templates mirroring English structure
- 4 Arabic content translations (autopsy, 2 actors, conflict)
- Language switcher (EN/عربي) in header
- Comprehensive RTL CSS overrides
- translation_meta frontmatter on all content files
- Reference implementation for community translation workflow"
```

---

## Execution Notes

**Parallelizable tasks:**
- Tasks 1 + 2 can run in parallel (CSS and Base.astro are independent)
- Tasks 3 + 5 can run in parallel (structural pages and listing pages are independent)
- Task 7 (content translation) is the heaviest — it's pure translation work

**Dependencies:**
- Task 2 (language switcher) must complete before Task 3+ (so Arabic pages have working nav)
- Task 6 (detail pages) must complete before Task 7 (content files need pages to render on)
- Task 8 depends on all others

**Critical path:** 1 → 2 → 3/4/5 → 6 → 7 → 8
