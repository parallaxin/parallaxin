# Build Log

## Phase 1: Setup (Done)

### Name - Parallaxin

- PARALLAX was obviously taken
- Changed the name in all files

### New Accounts: (With VPN -- no need for TOR) (Pending)

- Anonymouse: [parallaxin@proton.me] - ProtonMail (Blocked from Github without adding recovery email in protonmail)
- Anonymouse: [parallaxin@tutamail.com] - Tutamail (Waiting for 48 hours for verification)
- Git: [EMAIL_ADDRESS] - GitHub
- Domain check: parallaxin.report — perfect. $6.98/yr. The TLD does half the explaining.

### Templates

- Three templates. Each enforces the Constitution at the field level. Key decisions embedded in them:
1. Archive URL is mandatory on every source — links die, evidence must not
2. The checklist at the bottom of every Claim Autopsy — runs before any publish
3. Conflict Record does not describe actors — it references them. One source of truth per actor
4. "Who benefits" is not accusation — it's documented context, labeled as such
5. Framing note in the Conflict Record explicitly flags that start date selection is an editorial act

- These go into parallaxin/docs/templates/.

### Four Draft Reports: (In progress)

- (Not in the repo yet, untill approving workflow, commit docs, commit scaffold, then edit and commit reports)

-  The narrative is decomposed.
What these need before they move to under-review:

- Every [SOURCE NEEDED] flag is a sourcing task — I counted roughly 40 across all four files. The priority ones that unlock the most:

1. IAEA GOV/2026/XX report — spine of CA-2026-0001 and ACT-2026-0001
2. Knesset transcript June 14, 2025 — the claim itself
3. US NIE 2023 on Iran — declassified version
4. Netanyahu trial court records — PI-001
5. FEC donor data — Trump PI-002

- One thing worth noting: DA-002 in ACT-2026-0002 already has a live Tier 1 source URL — the 2018 JCPOA withdrawal presidential memorandum from the White House archive. That's the only confirmed link in the batch. Everything else needs verification.

----

## Phase 2: Astro Scaffold (In progress)

- The repo needs its skeleton — folder structure, i18n config, content collections. 

### Part 1: Git Identity Setup (Pending)

- Consider a token for github - local IDEs.

```powershell
# Run from E:\co\parallaxin
# Configure Git for this repo ONLY — does not affect your global config

git init
git config user.name "parallaxin-contrib"
git config user.email "YOUR_PROTONMAIL@proton.me"

# Verify it's local only
git config --local --list | Select-String "user"

# First commit: the docs that already exist
git add docs/
git commit -m "docs: planning documents, templates, constitution, build log"
```

----

### Part 2: Astro Scaffold Script (Done)
Run scaffold.ps1 in E:\co\parallaxin. It creates the full project structure, writes all config files, and installs dependencies.

### Part 3: Post-scaffold Git commit
```powershell
cd E:\co\parallaxin
git add .
git commit -m "scaffold: Astro project structure, content schemas, i18n, CI/CD

- Content collections enforce Constitution Article 2 at the schema level
- Tier 4 sources are unrepresentable by design
- i18n: English, Arabic, Farsi from day one
- RTL support built into layout and styles
- Source checker script for CI pipeline
- GitHub Actions for automated build and deploy
- MIT (code) + CC-BY 4.0 (content) licenses
- Zero tracking, zero analytics, zero user accounts"
```
#### Three things to note about design decisions embedded in this scaffold:

1. The schema IS the constitution enforcement. Tier 4 sources literally cannot be entered — there's no enum value for them. The type: 'documented' | 'inference' field on every analytical statement forces the Constitution's Article 3.2 separation at the data level, not just the editorial level. A contributor physically cannot submit a gap analysis without classifying it.

2. The publish checklist is a gate, not a suggestion. Every Claim Autopsy has a checklist object. Before status changes from draft to published, every boolean must be true. This can be enforced in CI — a GitHub Action that rejects any PR changing status to published if the checklist is incomplete.

3. The CSS tells the story. The color system — green for documented, amber for inference, red for source-needed, orange for gaps — means a reader can scan a page and immediately see the evidence landscape. A page full of green is well-sourced. A page with red flags is a draft. This is the "code comments" principle made visual.

----

## Phase 2.5: Evaluate and Refine (In progress)

- Clean execution. 

### What's solid
The file tree is exactly what it should be. Constitution in docs, schema in code, templates enforcing the constitution at the field level. The separation is correct.

### Parallaxin works.

- The -in suffix actually adds something — it implies participation, looking in, being in the lens. Not just observing from outside. Happy accident or not, it's fine. parallaxin.report is a strong domain. 

### The build log is a good practice.

- It becomes part of the transparency record — anyone who forks can see exactly how decisions were made and in what order.

### On the account situation
The 48-hour Tutamail wait is normal. While waiting:

- Git works locally without GitHub. Commit everything now with a placeholder email, then amend later with git commit --amend --reset-author once the account is live. Will not let account setup delay the commit history.

- When GitHub is ready, use a fine-grained personal access token scoped to only this repository. Not a classic token. Not SSH keys tied to main identity.

### On the 40 source gaps (x) `docs\6-confirmed-sources.md`
This is the real work now. The scaffold is scaffolding. The content is the product. 

#### Tier 1 — unlock everything else:

- IAEA reports — These are publicly available at iaea.org/board-reports. The GOV/ document numbers are searchable. This is your spine.
- Knesset transcripts — The Knesset publishes official records. Hebrew originals with some English. Find the specific session.
- US NIE 2023 — The declassified Key Judgments are public. The full report isn't, but the Key Judgments are what you need for the claim autopsy.

#### Tier 2 — strengthen the actor records:

- Netanyahu trial records — Israeli court system publishes some records. Haaretz and Times of Israel have detailed trial coverage with dates.
- FEC data — fec.gov is fully public and searchable. Campaign contributions, PAC data, all Tier 1 primary sources.

#### Tier 3 — can wait for community:

- Everything else. The first publish doesn't need all 40 filled. It needs the Claim Autopsy to be airtight, and the Actor Records to have enough documented actions to make the gap analysis credible. Five strong sources beat forty weak ones.

### One thing to watch (x)
- site/src/styles/ directory that's empty and a site/public/styles/ directory with global.css.

- The Astro layout references /styles/global.css which resolves from public/. That's correct. But the empty src/styles/ might confuse a future contributor. **Added a README.md to site/src/styles/ to clarify this.**

### npx and package.json are ready

```powershell
PS E:\co\parallaxin> npm run dev

> parallaxin@0.1.0 dev
> astro dev

16:42:50 [WARN] Missing pages directory: src/pages
16:42:50 [types] Generated 1ms
16:42:50 [content] Syncing content
16:42:51 [WARN] Missing pages directory: src/pages
16:42:51 [WARN] Missing pages directory: src/pages
16:42:51 [WARN] Missing pages directory: src/pages
16:42:51 [WARN] Missing pages directory: src/pages
16:42:51 [content] Synced content

 astro  v5.18.0 ready in 260 ms

┃ Local    http://localhost:4321/
┃ Network  use --host to expose
```

### Commited.

### Research Sprints (Done)
- Initial priority gaps in `docs/6-confirmed-sources.md` filled with verified data.
- Confirmed declassified 2023 NIE key judgments.
- Confirmed PM Netanyahu's June 14, 2025 address.
- Documented "Operation Midnight Hammer" (US June 22 strikes).
- Verified Miriam Adelson's $100M+ contributions to pro-Trump PACs.

### Next move
Astro is running. The warnings are expected — no pages yet, that's next.
Research sprints done — the NIE, Knesset address, Operation Midnight Hammer, FEC data. That's the spine of CA-2026-0001 fully sourceable now.
Next move: the pages directory.
We need three things to get to a working preview:

src/pages/index.astro — the homepage
src/pages/autopsies/[id].astro — claim autopsy page
First real content: CA-2026-0001 populated with confirmed sources
--

## Phase 3: Content & Layout (In progress)

### Four files ready. Here's where each one goes:

##### Content:

- `CA-2026-0001-final.md` → `site/src/content/autopsies/CA-2026-0001.md` (new)

##### Pages:

- `index.astro` → `site/src/pages/index.astro` (updated)
- `autopsy-id.astro` → `site/src/pages/autopsies/[id].astro` (new)

##### Styles:

- `global.css` → `site/public/styles/global.css` (updated)


- One important note on CA-2026-0001: The sequence field is a multiline string in YAML. Astro's content collection will need it parsed correctly — if there are render issues, wrap it in a <pre> with line splitting, which the autopsy page already does.

### Quick edits to run first preview (x)

1. astro.config.mjs imports MDX but it's not installed (x)
`package.json` doesn't have `@astrojs/mdx`. Scaffold's `astro.config` imports it. This will crash on build. Since content is `.md` not `.mdx`, remove it for now:

Replaced `site/astro.config.mjs`

2. `config.ts` is too complex for first run (x)
Original schema was architecturally correct but practically fragile — deeply nested YAML objects with URL validation will break on drafts where half the fields say [SOURCE NEEDED]. We need a schema that enforces the constitution but lets drafts exist.

Replaced `site/src/content/config.ts`

- Why these changes: The original schema validated URLs strictly — which means every `[SOURCE NEEDED]` placeholder would crash the build. This version uses `.default('[SOURCE NEEDED]')` and `.optional()` on fields that drafts won't have yet. The constitutional enforcement stays: Tier 4 is still unrepresentable, documented/inference labeling is still required. But drafts can exist and render.

* When we move to published status, the CI pipeline should run stricter validation. That's a Phase 2 enforcement — a script that checks published content against the strict schema. Don't block the first preview on it.

3. Base.astro has template literal issues (x)
- Scaffold used backtick template literals inside Astro frontmatter, which can collide with Astro's own template syntax. 

Replaced `site/src/layouts/Base.astro`

- Key change: String concatenation instead of template literals for pageTitle. Avoids any interpolation conflicts.

4. i18n utils.ts path aliases may not resolve (x)
- Astro 5's path aliases from tsconfig.json sometimes don't resolve in `.astro` files depending on the integration. The safe approach for first run is relative imports. The Base.astro above already uses `../i18n/utils` instead of `@i18n/utils`.

-  [id].astro page uses relative imports (confirmed)

5. Content collection query in [id].astro (x)
For the dynamic autopsy page to work, it needs to both generate static paths and query content. This is the pattern that works in Astro 5:

- Verify site/src/pages/autopsies/[id].astro structure 

6. Added styles to global.css for the new elements (x)

7. File Renames (Critical — nothing renders without these) (x)
```powershell
# The page must use square brackets for dynamic routing
Rename-Item "site\src\pages\autopsies\autopsy-id.astro" "[id].astro"

# The content filename becomes the entry ID — drop "-final"
Rename-Item "site\src\content\autopsies\CA-2026-0001-final.md" "CA-2026-0001.md"
```

- Without [id].astro, Astro doesn't know it's a dynamic route. Without the rename of the content file, the slug/ID becomes CA-2026-0001-final which won't match any links.

8. config.ts — Rewritten to Match What Exists (x)
- The content file is excellent. The page template is well-built. The schema should serve them, not fight them.
Replaced: the definitive version:

9. The [id].astro Routing (x)
In Astro 5, content collection entries expose `.id` (derived from filename). After renaming the file to `CA-2026-0001.md`, the `id` will be `CA-2026-0001`.

- Fixed the routing issue by changing autopsy.slug to autopsy.id in the getStaticPaths function. This aligns with Astro 5's content collection API where .id is the reliable identifier derived from the filename.

10. Index Page Filter (x)
Same issue — the index page filters by `data.status === 'published` only

- Fixed the index page filter to include "under-review" status alongside "published" status. This will allow the content file with status "under-review" to appear on the first render.


11. One YAML check in Content File (x)

- The YAML validation passed successfully. 

✅ YAML Syntax: The file parses correctly without errors.
✅ [ARCHIVE NEEDED] Placeholders: All 7 instances are properly quoted:
Line 19: "[ARCHIVE NEEDED — archive.ph]" (with em dash, still valid since quoted)
Lines 30, 38, 48, 56, 64, 107, 115: "[ARCHIVE NEEDED]"
✅ Sequence Field Indentation: The | block scalar is used correctly with consistent 2-space indentation for all content lines relative to the sequence: key.
The YAML structure is valid and ready for use.

```powershell
# Quick YAML syntax check — install if needed: npm install -g yaml-lint
npx yaml-lint site/src/content/autopsies/CA-2026-0001.md
```
Or in Node:

```powershell
node -e "const fs=require('fs'); const yaml=require('yaml'); const f=fs.readFileSync('site/src/content/autopsies/CA-2026-0001.md','utf8'); const fm=f.split('---')[1]; try{yaml.parse(fm);console.log('YAML OK')}catch(e){console.error(e.message)}"
```
Will need npm install yaml in site/ first to use the second approach.



### First Preview

- ![alt text](image.png)

- The homepage is rendering. The card is there. The data is flowing. The 404 on click-through is a routing mismatch — fixable in two minutes.

#### The Problem

```
[router] no matching static path was found for requested path `/autopsies/ca-2026-0001`
```

- This means getStaticPaths() either returned no paths or returned a path that doesn't match ca-2026-0001. The most likely cause: Astro 5's content layer uses .id not .slug, and the value may not match what the index page links to.

- Diagnose First
Add this temporarily to [id].astro to see exactly what Astro gives you:
```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';

export async function getStaticPaths() {
  const autopsies = await getCollection('autopsies');
  
  // DEBUG — check terminal output
  autopsies.forEach(a => {
    console.log('--- AUTOPSY ENTRY ---');
    console.log('  id:', a.id);
    console.log('  slug:', a.slug);
    console.log('  filePath:', a.filePath);
    console.log('  data.record_id:', a.data.record_id);
    console.log('  data.status:', a.data.status);
  });

  return autopsies.map((autopsy) => ({
    params: { id: autopsy.id },
    props: { autopsy },
  }));
}

const { autopsy } = Astro.props;
const data = autopsy.data;
---
```

✅ Step 1: Renamed content file from CA-2026-0001.md to ca-2026-0001.md ✅ Step 2: Already using autopsy.id in [id].astro getStaticPaths ✅ Step 3: Changed index.astro card link from autopsy.slug to autopsy.id ✅ Step 4: Already showing all autopsies (no status filter) in [id].astro debug version

- Fixed the routing issue by stripping the .md extension:

✅ [id].astro: Updated getStaticPaths to use autopsy.id.replace('.md', '') ✅ index.astro: Updated card link to use autopsy.id.replace('.md', '')

The URL will now be clean: /autopsies/ca-2026-0001 without the .md extension, matching the route parameter expected by the dynamic route.

#### Checklist (TODO)

The sequence block — does each [DOCUMENTED] / [INFERENCE] line get its colored tag? The page splits on \n and checks line.startsWith('[DOCUMENTED]'). If the YAML | scalar adds or strips whitespace differently than expected, the tags won't render.

Source tier badges — the CSS uses .source-tier--tier-1 but the content has source_tier: "Tier 1". The page generates the class with ev.source_tier?.toLowerCase().replace(' ', '-') which produces tier-1. That matches. Good.

The verdict banner — should show red (NO) with high confidence green. Verify the class mapping works with the string "no" from claim_supported_by_evidence.

RTL readiness — not needed yet for English, but verify [dir="rtl"] blockquote doesn't break the LTR layout. It shouldn't — it's selector-scoped.

#### What Renders Now vs. What's Missing
Working:
- Homepage at / ✅
- Autopsy page at /autopsies/ca-2026-0001.md ✅ (will be clean URL after fix)
- Full evidence rendering pipeline ✅
- 404s — all expected, no content or pages yet:

| Route | Why it 404s | Priority |
|-------|-------------|----------|
| /constitution | No page exists | High — it's in the nav |
| /conflicts | No listing page, no content files | Medium |
| /actors | No listing page, no content files | Medium |
| /autopsies | No listing page (only [id].astro) | Medium |

#### Next Priority: Constitution Page
It's the most linked-to page on the site and it's in the nav. Simple static page:

- Createed site/src/pages/constitution.astro ✅

----

### Closing Phase 3
- Homepage renders with card → click navigates cleanly
- Autopsy page renders fully
- Constitution link in nav works
- Conflicts/Actors show empty states (correct — no content yet)

- `docs\7-status.md`