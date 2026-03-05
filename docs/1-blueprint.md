# PROJECT BLUEPRINT: PARALLAXIN 

---

## CORE PHILOSOPHY

> "Facts have weight. We don't balance them against lies."

Not a news site. Not neutral. **Objective.**
The difference: neutrality pretends both sides of a fact are equal. Objectivity follows evidence regardless of who it inconveniences.

---

## TWO PARALLEL TRACKS

```
CONTENT TRACK                    TECHNICAL TRACK
─────────────────                ────────────────────
What we say                      How we say it
How we verify                    How it stays alive
Who can contribute               How it stays ungovernable
Standards of evidence            How it scales without corruption
```

---

## PHASE 0 — FOUNDATION (Before launch)
*Both tracks defined before a single line of code or content*

### Content Side:
- Define **Evidence Standards** (what qualifies as a "fact" on this platform)
  - Primary sources only (documents, video, official statements)
  - No anonymous claims without corroboration
  - Every claim links to verifiable source
  - Inference labeled clearly as inference
- Define **Tone Standards**
  - Strong language ✓ — when facts support it
  - Editorializing ✗ — let facts speak
  - Actors identified by **role and action**, not identity labels
  - No "terrorist" / "freedom fighter" framing — describe the act
- Define **Anti-Capture Rules**
  - No single editor has final say
  - Founder = one contributor, equal to others after launch
  - Disputes resolved by evidence, not consensus voting
  - No advertiser, donor, or sponsor relationship ever (Planning other optionts, when needed)

### Technical Side:
- Choose stack: **static site** (maximum resilience, minimum attack surface)
  - Suggestion: Next.js or Astro → deployed to Vercel/Netlify (free tier)
  - Content in Markdown/MDX → Git repository = audit trail
- Choose repository: GitHub (public, open source from day 1)
- Choose license: Creative Commons Attribution (content) + MIT (code)
- Domain: neutral, non-political, memorable

---

## PHASE 1 — PILOT CONFLICT (Current war as first case)

### Content Side:
- **Structure per conflict:**
  ```
  Conflict Page
  ├── Timeline (verified events, dated, sourced)
  ├── Parties (who, what role, what stated goal, what actual behavior)
  ├── Claims vs Facts (official claim → evidence → verdict)
  ├── Cost Counter (human, economic — updated)
  └── Analysis (labeled clearly: inference from evidence)
  ```
- **"Claim Autopsy" feature** — take an official statement, dissect it against evidence
- Language: English primary + Arabic + as many as community adds -> Multilingual support from day 1

### Technical Side:
- Build static site with above structure
- Automated data pulls where possible (casualty counters, economic indices)
- i18n framework built in from day 1 (not added later)
- Contribution via GitHub Pull Request — full audit trail
- No database needed at this stage — all content in Git

---

## PHASE 2 — OPEN TO COMMUNITY

### Content Side:
- Publish **Contribution Standards** as a document (the "constitution")
- Anyone can submit via PR
- Review process: evidence-based, not identity-based
- Disputes: public, on record, resolved by adding more evidence

### Technical Side:
- GitHub becomes the newsroom
- Automated checks: broken links, missing sources flagged
- Translation workflow: structured so community can add languages
- Mirror capability: anyone can fork and host a copy
  → Cannot be killed by taking down one server

---

## PHASE 3 — UNGOVERNABLE (The goal)

### Content Side:
- Platform "belongs" to its standards, not its founders
- Any attempt to capture it (political, financial, personal) is visible in Git history
- Community forks if captured — the truth survives

### Technical Side:
- IPFS/decentralized hosting option documented
- The codebase is the product — anyone can run an instance
- No login, no accounts, no data collection on readers

---

## ANTI-CAPTURE MECHANISMS (Critical)

| Threat | Defense |
|--------|---------|
| Founder bias | Founder = one contributor, equal weight |
| Donor influence | No donations, no ads, ever (free infrastructure only, for phase 1) |
| Government pressure | Open source + mirroring = can't be silenced |
| Coordinated flooding | Evidence standard = wall against noise |
| Popularity capture | Not democratic — evidence-based, not vote-based |

---

## WHAT MAKES THIS DIFFERENT

| Platform | Problem | Us |
|---------|---------|-----|
| Al Jazeera, BBC | Editorial agenda, audience capture | No audience to please |
| Wikipedia | Consensus-based = politics seep in | Evidence-based |
| Bellingcat | Good, but narrow (OSINT focus) | Broader: analysis + context |
| Twitter/X | Speed over accuracy, owned | Slow and sure, ungovernable |

---

## QUESTIONS to answer (Deep planning needed)

1. **Evidence standard definition** — precise language for what qualifies
2. **Tone guide** — examples of strong-but-objective writing
3. **Governance model** — how disputes are resolved without a leader
4. **Technical stack final decision** — resilience vs. ease of contribution
5. **Launch strategy** — how to seed credibility from day 1
6. **i18n priority** — which languages first, why

---

## RESEARCH NEEDED BEFORE PLANNING SESSION
`research-findings.md`
- [x] Existing open-source fact-checking frameworks (Duke Reporters' Lab, etc.)
- [x] Best static site generators for multilingual content
- [x] How Wikipedia handles dispute resolution (to learn from and improve)
- [x] Decentralized hosting options (IPFS, Arweave) — maturity level
- [x] Legal exposure: hosting conflict content across jurisdictions

---

*This blueprint is a starting point.*
