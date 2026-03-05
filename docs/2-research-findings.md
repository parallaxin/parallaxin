# RESEARCH FINDINGS

## FRAMING NOTE
This platform does not claim to hold "truth."
It is a **lens** — structured, sourced, ungovernable.
Audiences hold conclusions. We hold evidence.

---

## 1. EXISTING FACT-CHECKING INFRASTRUCTURE
*What exists — what we learn from it — where the gaps are*

### What exists:
- **Duke Reporters' Lab**: Tracks 443 active fact-checking projects globally (2025). Created ClaimReview/MediaReview — a structured tagging system now used by ~500 fact-checkers worldwide. Dataset of 240,000+ verified claims, free to access.
- **IFCN (International Fact-Checking Network)**: Code of principles. Signatories must prove non-partisanship, transparency of funding, methodology.
- **Bellingcat**: OSINT-focused. Strong on geolocation, verification of images/video in conflict zones.
- **MediaVault**: Archives fact-checked social media posts. Now run by Maldita.es + Full Fact.

### Critical gap they all share:
- All depend on institutional funding (Google News Initiative, Facebook Journalism Project, foundations)
- Funding = potential capture, even if indirect
- Most focus on claim-by-claim debunking, not **systemic analysis of actor behavior and interests**
- None explicitly map the gap between stated goals and actual actions of conflict parties
- Wikipedia-style consensus fails on politically contested facts — edit wars are documented and severe on Israel/Palestine, Ukraine, etc.

### What we take from this:
- ClaimReview schema is useful as a **source-tagging standard** — we can adopt it
- The model of "here is the claim, here is the evidence, here is the verdict" works for simple claims
- We go further: "here is the actor, here is their stated goal, here is their documented behavior, here is the gap"

---

## 2. TECHNICAL STACK — RECOMMENDATION

### Winner: **Astro** (static site generator)

**Why Astro over alternatives:**
- Zero JavaScript shipped by default → fastest possible load globally, including low-bandwidth regions
- Built-in i18n support → multilingual from day one, not bolted on later
- Framework-agnostic: contributors can use React, Vue, Svelte — no lock-in
- Content in Markdown/MDX → stored in Git → full audit trail of every change
- Deploys to Vercel/Netlify/Cloudflare Pages — all free tier, all with CDN (Phase 1)
- Static output = minimal attack surface, no database to breach

**Hugo** is faster to build at scale, has better native i18n, and is more mature — worth considering if content volume becomes very large. Tradeoff: Go templating has steeper learning curve for contributors.

**Next.js** is overkill — designed for dynamic apps. Adds complexity and SSR security surface we don't need.

### Recommended stack:
```
Content:    Markdown/MDX files in Git
Framework:  Astro 5.x
i18n:       Astro built-in + Rosey for translation workflow
Search:     Pagefind (fully static, no external service)
Hosting:    Cloudflare Pages (free, global CDN, strong DDoS protection)
Repo:       GitHub (public, MIT license for code, CC-BY for content)
CI/CD:      GitHub Actions (automated build + deploy on PR merge)
```

### Translation workflow:
Rosey decouples translation from the SSG — community translators work on translation files, not code. This is critical for community scaling.

---

## 3. GOVERNANCE — LEARNING FROM WIKIPEDIA'S FAILURES

### What Wikipedia does:
- Consensus-based dispute resolution
- Escalation ladder: Talk page → Third opinion → Dispute Resolution Noticeboard → Request for Comment → Arbitration Committee
- ArbCom has binding authority on conduct, not content

### Wikipedia's documented failures on contested topics:
- Edit wars on politically sensitive articles (Israel/Palestine, Ukraine) are severe and persistent
- 85% of Dispute Resolution Noticeboard cases close without resolution
- Consensus = majority opinion, which can be captured by organized groups
- "Neutral point of view" policy can be gamed to launder a framing as neutral

### Our model — evidence-based, not consensus-based:

**Key principle**: Disputes are resolved by evidence, not votes.

```
Dispute resolution ladder:
1. Claim is challenged → challenger must provide counter-evidence
2. Both claims reviewed against primary sources only
3. If sources conflict → both documented with source quality rating
4. If one source is clearly stronger (official record vs. anonymous claim) → stronger source prevails
5. If genuinely ambiguous → labeled "contested, see sources" — not resolved by vote
6. No single editor (including founder/s) can override this process
```

**Anti-gaming mechanisms:**
- No user accounts needed to read
- Contributions via GitHub PR — all public, all signed with Git identity
- No "reputation points" or seniority — evidence quality is the only currency
- Organized flooding attempt? → evidence standard is the wall. Opinions without sources are rejected at PR review stage.

---

## 4. DECENTRALIZED HOSTING — RESILIENCE LAYER

### Phase 1 (launch): Centralized but redundant
- Primary: Cloudflare Pages (free, global, DDoS resistant)
- The GitHub repository itself IS the backup — anyone can fork and redeploy in minutes
- This is sufficient for Phase 1 and removes complexity

### Phase 2 (community growth): Add mirrors
- Document how to self-host an instance (simple: clone repo → deploy to any static host)
- Community members in different countries can run mirrors
- Cannot be killed by taking down one server

### Phase 3 (if suppression attempts occur): Decentralized
- **IPFS**: Free, distributed, content-addressed (file fetched by hash, not location)
  - Risk: without pinning service (Pinata etc.), files can disappear if no node hosts them
  - Pinning services rely on AWS — not truly decentralized
- **Arweave**: Pay once (~$0.01-0.05 per KB), stored permanently (~200 years)
  - Best for archival: once published, cannot be altered or removed
  - Ideal for "frozen" historical records of conflicts
  - 512MB per transaction limit — sufficient for text-based content
  - Small node base compared to IPFS — less resilient today

**Recommendation**: IPFS + Arweave combination when needed
- IPFS for active distribution
- Arweave for permanent archiving of finalized conflict records

---

## 5. LEGAL EXPOSURE — RISK MAP

### Real risks:
1. **Defamation**: Claiming a specific individual did a specific act without sufficient evidence. Mitigation: always cite primary sources, label inference as inference, describe acts not identities.

2. **DMCA/Copyright**: Using images, video, documents from news orgs. Mitigation: link to sources, don't embed copyrighted material, use CC-licensed or public domain assets only.

3. **SLAPP suits** (Strategic Lawsuits Against Public Participation): Powerful actors using expensive litigation to silence. Real risk for conflict content. Mitigation: open source + distributed hosting makes it harder to shut a single target/node. Bellingcat has faced this — they survived by operating from the Netherlands.

4. **Government pressure on hosting provider**: Most likely attack vector. Mitigation: decentralized mirrors, open source code so community can rebuild anywhere.

5. **Terrorist content laws**: EU requires takedown within 1 hour for designated terrorist content. Risk: conflict documentation could be miscategorized. Mitigation: clear journalistic framing, no glorification, factual description of acts.

### Key legal insight:
- International humanitarian law **explicitly protects** journalistic reporting of conflict
- "Reporting does not amount to direct participation in hostilities" (Article 19, 2025)
- A platform that describes acts factually, cites primary sources, and makes no calls to action is operating within established press freedom protections
- **Hosting jurisdiction matters:** Netherlands, Iceland, and similar jurisdictions have strong press freedom protections and limited exposure to US/UK government pressure

### Recommendation:
- Phase 1: Cloudflare Pages (US-based, some risk, but scale and DDoS protection worth it)
- Long term: Consider EU-based hosting (Netherlands/Iceland) for primary, with mirrors
- Open source mirroring is the ultimate legal defense — the content cannot be killed

---

## SYNTHESIS: KEY DECISIONS FOR THE PLANNING SESSION

### Decisions already clear from research:
1. **Stack**: Astro + GitHub + Cloudflare Pages
2. **Content format**: Markdown in Git = audit trail + community contribution
3. **i18n**: Built-in from day one via Astro + Rosey workflow
4. **Dispute resolution**: Evidence-based, not consensus-based
5. **Resilience**: GitHub mirroring Phase 1, IPFS/Arweave Phase 3

### Decisions needing analysis:
1. **Content schema**: Precise structure of a "conflict record" — what fields are required, what is optional
2. **Evidence standard**: Exact language for what qualifies as a primary source
3. **Tone guide**: What does "strong but objective" look like in practice? Examples needed.
4. **Governance constitution**: The document that governs the platform, written before launch
5. **Launch strategy**: How do you establish credibility from day 1? Who are the first contributors? How do you seed with the current conflict as pilot?
6. **Branding**: No "truth" branding. What name communicates "lens, not oracle"? -> `PARALLAXIN`?
7. **Language priority**: Which 5-10 languages first? English and Arabic for start "the current scope WEST/EAST". What else?

---

## APPENDIX: WHAT MAKES THIS DIFFERENT FROM EVERYTHING ELSE

| Platform | Primary failure | Us |
|---------|----------------|-----|
| Al Jazeera / BBC / Fox | Institutional agenda + audience capture | No audience to please, no revenue to protect |
| Wikipedia | Consensus = capturable by organized groups | Evidence standard, not vote |
| Bellingcat | Excellent but narrow (OSINT verification) | Broader: actor analysis + interest mapping + evidence |
| Duke/IFCN | Funded by Google/Meta/foundations | Zero external funding, ever |
| Twitter/X | Speed + ownership + algorithm | Slow and permanent, ungovernable |
| Academic journals | Paywalled, slow, jargon | Public, fast enough, plain language |

**The gap we fill**: 
A platform that maps the distance between what powerful actors *say* and what they *do*, using only verifiable primary sources, in plain language, available in every major language, that cannot be bought, captured, or killed.

---

*Research complete.*
