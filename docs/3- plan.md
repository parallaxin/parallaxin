# Plan

## A few quick observations before diving:

### What's strong:

- The anti-capture philosophy is the real innovation here, not the tech or the content individually — it's the governance model that makes this different from everything else listed in that comparison table
**"Evidence-based, not vote-based"** is the single most important line.

- The Git-as-audit-trail idea is elegant — every edit, every dispute, permanently visible

### Flags:

- The "no donations ever" rule is noble but may create a fragility — free-tier hosting has limits, and if this gains traction, infrastructure costs become real. The constitution needs a mechanism for this that doesn't create capture vectors.

- The "Claim Autopsy" feature is where the real differentiation lives — that's the product, not the timeline or the parties list (those exist elsewhere)

- On Example analysis specifically: `0-framed-analysis-current-conflict.md`

The information quality is genuinely high. The bias isn't in the facts — it's in the framing architecture. Which is exactly what this project is designed to expose. That's a powerful proof of concept sitting right there.

--

## What's ready to build on

- The technical stack decision is essentially made. Astro + Git + Cloudflare Pages is the right call. No debate needed there. The phased resilience approach (centralized → mirrors → decentralized) is pragmatic — don't over-engineer day one.

- The evidence-based dispute resolution model is genuinely novel. That five-step ladder is cleaner than anything Wikipedia, fact-checkers, or newsrooms use. We should refine the language but the logic is sound.

## What's missing — and matters

- The actor-behavior mapping framework needs to be the centerpiece, not a subsection. The research identifies the gap perfectly in that final line — "maps the distance between what powerful actors say and what they do" — but the content schema doesn't yet reflect this as the primary organizing principle. Right now the structure is:
```
Timeline → Parties → Claims vs Facts → Cost → Analysis
```
- It should be:
```
Actor → Stated Position → Documented Actions → Gap Analysis → Sources
```

> The conflict is the context. The actor behavior gap is the product. That inversion changes everything about how the site reads and what makes it irreplaceable.

- The "Claim Autopsy" as mentioned before. This is where a casual reader gets hooked. An academic reads timelines. A citizen reads "your leader said X, here's what actually happened." That must be built out as a first-class content type with its own schema, not a feature within a page.

- Contributor motivation is unaddressed. No accounts, no reputation, no payment — why does someone spend hours writing a well-sourced conflict record? Wikipedia has edit counts and barnstars. Bellingcat has bylines and careers. This platform offers anonymity and nothing else. That's fine philosophically but we need to think about what sustains contribution beyond the initial energy.

- Automation scope is undefined. The original brief mentioned "robotic updates" — casualty counters, economic data, official statements. This is where the platform can do what no human-run site can: continuously pull structured data from reliable APIs and present it without editorial delay. We should define exactly what can be automated, what can't, and the boundary between machine-gathered data and human-analyzed content.

## The Challenges

- "No donations ever" is a principle that sounds permanent but creates a real ceiling. Consider: "No donations that create obligation." There's a difference between a Patreon where 5,000 people give $2/month and a Google News Initiative grant. The first is distributed and ungovernable. The second is a capture vector. The constitution should define what kinds of support are acceptable, not ban all support categorically. Infrastructure has costs. Domains expire. CDN free tiers have limits.

- Hosting jurisdiction deserves more weight than it got. The research correctly identifies Netherlands/Iceland as strong press freedom jurisdictions, but then recommends Cloudflare (US-based) for Phase 1 anyway. Given that the pilot conflict involves US military action, this isn't academic. Cloudflare has complied with US government takedown pressure before. We should consider "European-first" approach even in Phase 1. Bunny.net or Vercel with EU regions are options.

## What does "success" look like, and what does "failure" look like — and are we okay with both?

- If this gets mass adoption, it becomes a target. If it stays small, it's a well-built archive nobody reads. The constitution needs to define what the platform is in both scenarios, because the governance model for 10 contributors is very different from the governance model for 10,000.

---

## Part 1: `PARALLAXIN` IS THE NAME

- The apparent shift in position of an object when viewed from different angles. Same event, different vantage points, we show you all of them and let geometry reveal the real position.
Strong. Intellectual but not obscure. Says: position depends on where you're standing — we show you where everyone is standing.

-  It doesn't claim to show truth. It claims to show you that where you stand changes what you see — and then gives you enough angles to triangulate reality yourself. That's the project. That's the philosophy.

- PARALLAX was obviously taken, parallaxin works. It sounds like a verb — the act of applying parallax. Active, not passive. A lens you use, not a thing you observe.

### Domain:

- `parallaxin.report` or `parallaxin.org` -> both are free.

----

## Part 2: Content Schema — The Actor-Behavior Gap as Product

### Primary Content Unit: The Actor Record

```yaml
actor:
  name: "Benjamin Netanyahu"
  role: "Prime Minister of Israel"
  in_power_since: "2022-12-29"
  
  stated_positions:
    - claim: "Iran is weeks away from a nuclear weapon"
      date: "2025-06-14"
      source: "Knesset address, official transcript"
      source_url: "https://..."
      
  documented_actions:
    - action: "Authorized strikes on Iranian nuclear facilities"
      date: "2025-06-XX"
      source: "IDF official statement + satellite imagery (Planet Labs)"
      source_url: "https://..."
      
  gap_analysis:
    - stated: "Defensive action against imminent nuclear threat"
      documented: "IAEA report (Feb 2026) found no evidence of weaponization timeline"
      gap: "Stated justification not supported by independent verification"
      sources:
        - "IAEA GOV/2026/XX"
        - "Reuters analysis, 2026-02-XX"
      confidence: "high" # high/medium/low based on source quality
      
  personal_interests:
    - interest: "Ongoing corruption trial — postponed indefinitely during wartime"
      source: "Haaretz, Times of Israel court records"
      relevance: "War provides legal and political cover for personal legal exposure"
```

### Secondary Content Unit: The Conflict Record

```yaml
conflict:
  name: "Iran-Israel-US War (2025-2026)"
  status: "active"
  start_date: "2025-06-XX" # or whatever the documented start is
  
  actors: [list of Actor Records]
  
  timeline:
    - event: "US-Israeli airstrikes on Iranian nuclear facilities"
      date: "2025-06-XX"
      sources: [minimum 2 independent sources required]
      
  human_cost:
    civilian_deaths:
      value: XXXX
      source: "UN OCHA / ICRC"
      last_updated: "2026-03-04"
    displaced:
      value: XXXX
      source: "UNHCR"
      
  economic_cost:
    oil_price_impact:
      value: "+XX%"
      source: "Bloomberg/Reuters commodity data"
      
  claim_autopsies: [list of Claim Autopsy records]
```

### First-Class Content Type: The Claim Autopsy

- This is the product. This is what gets shared. This is what a citizen reads.

```yaml
autopsy:
  id: "CA-2026-0042"
  title: "Did Iran have a nuclear weapon 'within weeks'?"
  
  the_claim:
    text: "Iran was weeks away from assembling a nuclear weapon"
    speaker: "Benjamin Netanyahu"
    date: "2025-06-14"
    context: "Justification for preemptive strikes"
    source: "Official Knesset transcript"
    
  the_evidence:
    supporting:
      - source: "Israeli intelligence briefing (leaked to NYT)"
        credibility: "medium — single anonymous source, no corroboration"
    contradicting:
      - source: "IAEA report GOV/2026/XX — no evidence of weaponization program"
        credibility: "high — international body with inspection access"
      - source: "US NIE 2023 assessment — program halted in 2003"
        credibility: "high — US intelligence community consensus"
        
  the_gap:
    summary: "The claim of imminent nuclear capability is not supported by any publicly available independent assessment. The strongest source (IAEA) directly contradicts it."
    
  who_benefits:
    - "Netanyahu: justifies military action, extends wartime political protection"
    - "US administration: justifies military involvement to domestic audience"
    
  confidence_rating: "HIGH — multiple independent high-credibility sources contradict the claim"
  
  last_updated: "2026-03-04"
  contributors: ["git commit hashes"]
```

**This is what gets shared on social media. Not the timeline. Not the actor page.**

- The autopsy. A citizen sees: "Your leader said X. Here's what actually happened. Here's who benefits from you believing it."

----

## Part 3: Evidence Standards — The Constitution's Core

### Tier 1: Primary Sources (strongest)

- Official government documents, transcripts, legislation
- Court records
- International body reports (UN, IAEA, ICC, ICJ)
- Satellite imagery from verifiable providers (Planet Labs, Maxar)
- Video/photo with verified geolocation and timestamp
- Financial disclosures, corporate filings

### Tier 2: Corroborated Reporting (strong)

- Reporting from multiple independent outlets citing named sources
- OSINT analysis with documented methodology
- Academic peer-reviewed research
- Leaked documents verified by multiple outlets independently

### Tier 3: Single-Source Reporting (usable with label)

- Single outlet reporting with named source
- Anonymous source claims corroborated by circumstantial evidence
- Must be labeled: "Single-source — awaiting corroboration"

### Tier 4: Unverifiable (excluded from main content)

- Anonymous claims without corroboration
- Social media posts without verification
- "Sources say" without any named source or outlet
- Self-published claims by conflict parties without independent verification

**Rule: No claim enters the platform without at least Tier 2 sourcing. Tier 3 may appear in Claim Autopsies as "the claim being examined" but never as "established fact."**

----

## Part 4: Tone Guide — Strong but Objective

### Principle: Describe the act. Let the reader judge the actor.

- Wrong (editorial):
    > "Netanyahu cynically exploited the war to avoid his corruption trial."

- Wrong (false neutrality):
    > "Some analysts suggest the war may have had domestic political benefits for the Israeli Prime Minister."
    
- Right (our voice):
    > "Netanyahu's corruption trial was postponed indefinitely on [date], citing wartime emergency provisions. The trial had been scheduled to resume on [date]. His approval ratings rose from X% to Y% following the strikes on Iran. No Israeli Prime Minister has faced a completed corruption trial during wartime."

- The facts carry the weight. The system arranges them so the weight is felt. We don't tell the reader what to conclude. We make the conclusion inescapable by placing the evidence in sequence.

### On language:

- **Never use:** "terrorist," "freedom fighter," "regime," "moderate," "extremist" — these are political labels, not descriptions
- **Always use:** specific descriptions of specific acts. "Armed group that carried out [specific attack] on [date]." "Government that authorized [specific military operation] resulting in [documented casualties]."
- **"Code comments":** where analysis or context is added, it's visually distinct from factual statements — like a developer's comment in code. The reader always knows what is documented fact and what is reasoned inference.

### Format for inference:

```
[DOCUMENTED] On Feb 28, 2026, US and Israeli forces struck targets in Iran.
[DOCUMENTED] IAEA had reported no evidence of weapons-grade enrichment.
[DOCUMENTED] Netanyahu's trial was postponed the same week.
[INFERENCE] The stated justification (imminent nuclear threat) is not 
supported by independent evidence. The timing coincides with domestic 
legal pressure on the Israeli PM. These facts are documented; the 
connection between them is for the reader to evaluate.
```

----

## Part 5: Governance Constitution — Draft Core

### Article 1: Purpose

- This platform exists to document the gap between what powerful actors say and what they do, using verifiable evidence, in plain language, free of charge, in every language possible.

### Article 2: Evidence Over Everything

- No claim is published without sources meeting the Evidence Standard (Tier 2 minimum). No dispute is resolved by vote. Evidence quality is the only currency.

### Article 3: No Capture

- No individual, including the founder/s, may override the Evidence Standard
- No financial relationship (donation, sponsorship, advertising, grant) may be accepted if it creates editorial obligation
- Acceptable support: distributed small contributions (e.g., crowdfunding where no single source exceeds 5% of total), infrastructure donations with no editorial conditions, volunteer labor
- Unacceptable support: foundation grants with reporting requirements, corporate sponsorship, government funding of any kind
- All financial flows, if any exist, are publicly documented in the repository


### Article 4: Transparency

- All content changes are tracked in Git with full history
- All editorial decisions are documented in public issue threads
- All disputes are resolved in public, never in private channels
- The platform's own governance is subject to the same transparency it demands of others

### Article 5: Forkability as Freedom

- If the community believes the platform has been captured, they fork it
- The code is MIT licensed, the content is CC-BY
- No technical or legal mechanism exists to prevent forking
- This is by design — it is the ultimate anti-capture mechanism

### Article 6: Founder Clause

- The founder transitions to regular contributor status upon first community contribution
- The founder holds no veto, no special editing rights, no privileged access
- The founder's contributions are subject to the same Evidence Standard as everyone else

----

## Part 6: Contributor Motivation — The Unsolved Problem

- Anger — they've seen the lies and want to do something. This is the launch fuel. It burns hot but not long.
- Craft — researchers, journalists, OSINT practitioners who take pride in doing the work well. This sustains.
- Portfolio — if the platform gains credibility, having authored a Claim Autopsy or Actor Record becomes a credential. Git history proves authorship.
- Impact — if an autopsy gets cited by a real journalist or a real legal proceeding, that's powerful motivation.

### What the platform provides:

- Git authorship — your contributions are permanently, cryptographically attributed to your identity (pseudonymous if you choose)
- Quality recognition — not upvotes, but a visible marker when your contributed sources are cited by subsequent autopsies (your evidence became foundational)
- No hierarchy — a first-time contributor's evidence is weighed the same as the founder's

### What the platform does NOT provide:

- Reputation scores, karma, badges
- Any form of gamification
- Payment

* This is an honest limitation. The platform will attract a specific kind of contributor — someone who cares more about the record than the recognition. That's a small pool. That's fine. Quality over quantity.

----

## Part 7: Automation Scope

### Automated (machine-gathered, no editorial judgment):

- Casualty counts: pull from UN OCHA, ICRC, WHO APIs where available
- Economic indicators: oil prices, currency movements, trade data from public APIs
- Official statements: scrape/pull from government press offices, UN transcripts
- Satellite imagery timestamps: when new imagery is available from public providers
- Source availability checks: automated broken link detection

### Semi-automated (machine-gathered, human-verified):

- Event detection: flag when multiple sources report the same event → human reviews and creates timeline entry
- Claim detection: flag when an official makes a verifiable claim → human creates Claim Autopsy

### Never automated:

- Gap analysis: the inference that connects documented facts requires human judgment
- Source credibility rating: machines can check if a source exists, not whether it's trustworthy in context
- Tone: the arrangement of facts to make the weight felt is editorial craft

----

## Part 8: Language Priority

- First five, in order:

1. English — global reach, most sources available
2. Arabic — primary affected population in pilot conflict
3. Farsi — Iranian population under information blackout
4. French — significant Arabic-speaking diaspora, African reach
5. Spanish — second largest language by native speakers globally

Next five when community enables:
6. Turkish
7. Russian
8. Chinese (Simplified)
9. Portuguese
10. Hindi

- Rosey workflow means translations are decoupled from code — a translator needs no technical skills, just language skills and commitment to accuracy.

## Part 9: Launch Strategy

### Week 1-2: Build

- Astro site with the schema above
- One complete Conflict Record (current war) with 3-5 Actor Records and 3-5 Claim Autopsies
- English only initially
- Deploy to Cloudflare Pages
- Repository public on GitHub from commit one

### Week 3: Seed
- Post to relevant communities (not as promotion — as "here's a tool, here's the source code, here's how to contribute")
- Targets: r/opensource, Hacker News, journalism-focused communities, OSINT communities
- The pitch isn't "read our site" — it's "here's a framework for documenting what powerful people do vs. what they say, it's open source, help us build it"

### Week 4+: Iterate
- First external contributions via PR
- Arabic translation begins
- Second conflict record if community interest exists


### Credibility from day one:
- The credibility IS the sources and the methodology. There's no institutional brand to leverage. The evidence standard document and the first few Claim Autopsies need to be impeccable — that's the calling card.

----

## Part 10: Success and Failure

### Success looks like:

- A journalist cites a Claim Autopsy in published reporting
- A citizen in an affected region finds information they couldn't access through their local media
- Someone forks the platform and applies it to a conflict we haven't covered
- The framework outlives the founder's involvement

### Failure looks like:

- Nobody contributes beyond the founder
- The content degrades into opinion despite the standards
- A capture attempt succeeds and nobody forks

### Are we okay with both?

- Yes. If it fails, the blueprint exists in a public Git repository. Someone else can try. The idea doesn't die with the instance. If it succeeds, the governance model ensures it doesn't die with the founder.

- The point was never to build a monument. The point was to prove that a machine for documenting the gap between power and truth can be built with existing technology, at zero cost, by anyone, and made unkillable.
