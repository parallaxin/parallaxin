# Build Log

## Phase 1: Setup (Done)

### Name - Parallaxin

- PARALLAX was obviously taken
- Changed the name in all docs

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

- Clean execution. The fixes made to the script are exactly right — PowerShell's ${} interpolation in here-strings is a known trap, and catching it before first run saves hours. Good engineering discipline.


### What's solid
The file tree is exactly what it should be. Constitution in docs, schema in code, templates enforcing the constitution at the field level. The separation is correct.

### Parallaxin works.

- The -in suffix actually adds something — it implies participation, looking in, being in the lens. Not just observing from outside. Happy accident or not, it's fine. parallaxin.report is a strong domain. Buy it.

### The build log is a good practice.

- Keep it. It becomes part of the transparency record — anyone who forks can see exactly how decisions were made and in what order.

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

- The Astro layout references /styles/global.css which resolves from public/. That's correct. But the empty src/styles/ might confuse a future contributor. Added a README.md to site/src/styles/ to clarify this.

### Next move
While waiting on Tutamail: (I'm considering using a different email provider & clean files metadata maybe? Don't have to be extra cautious afterall)

```powershell
cd E:\co\parallaxin
git init
git config user.name "parallaxin-contrib"
git config user.email "placeholder@parallaxin.report"

git add docs/
git commit -m "docs: constitution, blueprint, research, plan, templates, build log"

git add site/ .github/ .gitignore README.md LICENSE-CODE LICENSE-CONTENT scaffold.ps1
git commit -m "scaffold: astro project, content schemas, i18n, CI/CD pipeline"
```