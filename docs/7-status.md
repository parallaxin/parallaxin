# PARALLAXIN — Project Status
## As of 2026-03-05 ~19:00 UTC

---

## WHAT EXISTS AND WORKS

### Infrastructure
- [x] Astro 5.18 project scaffold — running, builds clean
- [x] Content collection schema (config.ts) — validates, matches content
- [x] i18n framework — English, Arabic, Farsi strings ready
- [x] RTL support in layout and CSS
- [x] GitHub Actions CI/CD pipeline defined
- [x] Licenses: MIT (code), CC-BY 4.0 (content)
- [x] Source checker script (check-sources.mjs)
- [x] IBM Plex Sans/Mono typography, dark theme, evidence color system

### Pages Rendering
- [x] Homepage (/) — mission, legend, card grid, about section
- [x] Constitution (/constitution) — all 10 articles, styled
- [x] Claim Autopsy (/autopsies/ca-2026-0001.md) — full render with evidence

### Content
- [x] CA-2026-0001 — "Was Iran weeks away from a nuclear weapon?" — COMPLETE, under-review
- [x] Constitution v1.0 — ratified, rendered
- [x] 6-confirmed-sources.md — research sprint complete

### Documents
- [x] 0-framed-analysis (raw X/Grok/Web analysis — reference only)
- [x] 1-blueprint.md
- [x] 2-research-findings.md
- [x] 3-plan.md 
- [x] 4-constitution.md (canonical source)
- [x] 5-build-log.md
- [x] 6-confirmed-sources.md
- [x] Templates: actor-record, claim-autopsy, conflict-record

---

## KNOWN ISSUES — MUST FIX BEFORE DEPLOY

### P0 (Blocking)
- [x] **Autopsy URL has `.md` extension** — route is `/autopsies/ca-2026-0001.md` instead of `/autopsies/ca-2026-0001`
  - Fix: In `[id].astro` getStaticPaths, use `autopsy.id.replace('.md', '')` 
  - Fix: In `index.astro` card link, same `.replace('.md', '')`
  - Astro 5 includes `.md` in the `.id` property; `.slug` does not

### P1 (Before publish)
- [~] **Archive URLs** — 7 instances of `[ARCHIVE NEEDED]` in CA-2026-0001
  - Use archive.ph or web.archive.org to create snapshots of all source URLs
- [x] **Remove debug console.logs** from `[id].astro` getStaticPaths
- [ ] **Empty collections warnings** — conflicts/ and actors/ directories have no content files
  - Add placeholder files
- [x] **`site\scripts\check-sources.mjs`** We're manually verifying URLs one by one. This doesn't scale and introduces human error.
The check-sources.mjs script already exists in the scaffold. It needs to do three things automatically:

Validate — HTTP check every URL in every content file
Flag — anything returning non-200, [SOURCE NEEDED], or [ARCHIVE NEEDED]
Archive — auto-submit valid URLs to archive.ph and write the archive URL back to the file 

`tmp\links.md`
- [ ] **Revist design & content:**
  - Content workflow
  - Frontpage revist (menus, colors, buttons, etc)
  - Visual ID - final (logo, favicon, etc)

### P2 (Before community launch)  
- [ ] `/autopsies` listing page (currently 404)
- [ ] `/conflicts` listing page (currently 404)
- [ ] `/actors` listing page (currently 404)
- [ ] Navigation links to non-existent pages should be conditional or lead to "coming soon"

---

## CONTENT — DRAFTED BUT NOT IN REPO YET `tmp\raw-reports`

- [ ] ACT-2026-0001 — Netanyahu actor record (drafted, needs source URLs)
- [ ] ACT-2026-0002 — Trump actor record (drafted, needs source URLs)  
- [ ] CON-2025-0001 — Conflict record (drafted, needs source URLs)
- Approximately 40 [SOURCE NEEDED] flags across all draft files
- Priority sources identified in 6-confirmed-sources.md

---

## ACCOUNTS & INFRASTRUCTURE

- [x] ProtonMail: parallaxin@proton.me — created
- [x] GitHub account & Repo
- [ ] Domain: parallaxin.report — identified, \$6.98/yr, not purchased
- [x] GitHub token (fine-grained, repo-scoped) — after account setup
- [ ] Consider third email provider as backup

---

## ARCHITECTURE DECISIONS — SETTLED

| Decision | Choice | Rationale |
|----------|--------|-----------|
| SSG | Astro 5 | Zero JS default, built-in i18n, static output |
| Content format | Markdown in Git | Audit trail, community contribution via PR |
| Hosting Phase 1 | Cloudflare Pages or GitHub Pages | Free, CDN, DDoS protection |
| Content schema | YAML frontmatter | Validated by Zod in config.ts |
| Dispute resolution | Evidence-based, not vote-based | Constitution Article 4 |
| Funding model | No obligation funding only | Constitution Article 5 |
| Governance | Founder = regular contributor post-launch | Constitution Article 6 |

---

## PHASE ROADMAP

### Phase 1: First Deploy (CURRENT)
- Fix P0 URL issue (x)
- Archive all source URLs ( )
- Push to GitHub ( )
- Deploy to free hosting
- One complete Claim Autopsy live

### Phase 2: Content Expansion  
- Actor records (Netanyahu, Trump) published
- Conflict record published
- Listing pages for /conflicts, /actors, /autopsies
- Additional Claim Autopsies

### Phase 3: Community
- Announce on r/opensource, Hacker News, OSINT communities
- Contribution guide published
- First external PR accepted
- Arabic translation begins

### Phase 4: Resilience
- Mirror documentation
- IPFS/Arweave archival for finalized records
- EU-based hosting option evaluated

---

## KEY DESIGN PRINCIPLES TO PRESERVE

1. **Actor-Behavior Gap is the product** — not timelines, not news
2. **Claim Autopsy is the shareable unit** — what citizens read and share
3. **Schema enforces constitution** — Tier 4 unrepresentable by design
4. **Evidence color system** — green=documented, amber=inference, red=gap
5. **No framing by omission** — Article 3.4, start dates are editorial acts
6. **Forkability is the anti-capture mechanism** — not governance committees

---

*This document is the handoff. Any context, starts here.*