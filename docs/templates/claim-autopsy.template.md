---
# PARALLAXIN — CLAIM AUTOPSY TEMPLATE
# This is the product. This is what gets shared.
# A citizen reads this and sees: your leader said X. Here is what the evidence shows.
# Write it so a person with no background can follow every step.
# Every step must be sourceable. Every inference must be labeled.
# If you cannot source it, it does not appear here.

schema_version: "1.0"
record_type: "claim_autopsy"
record_id: "CA-[YYYY]-[SEQUENCE]"             # e.g. CA-2026-0001
conflict_ref: ""                              # [REQUIRED] Conflict Record ID this belongs to
actor_ref: ""                                 # [REQUIRED] Actor Record ID of the claim's author
last_updated: "YYYY-MM-DD"                    # [REQUIRED]
contributors: []                              # Git commit hashes — auto-populated

---

## THE CLAIM
# Exactly what was said, by whom, when, and in what context.
# Quote directly when a transcript exists. Summarize only when full source is linked.
# This is not our framing. This is their words.

title: ""                                     # [REQUIRED] Plain-language question this autopsy answers
                                              # e.g. "Did Iran have a nuclear weapon 'within weeks'?"

the_claim:
  text: ""                                    # [REQUIRED] The exact claim or close summary
  speaker: ""                                 # [REQUIRED] Full name and role
  date: "YYYY-MM-DD"                          # [REQUIRED]
  context: ""                                 # [REQUIRED] Where it was said and why
  source_description: ""                      # [REQUIRED] e.g. "Official Knesset transcript"
  source_url: ""                              # [REQUIRED]
  source_archive_url: ""                      # [REQUIRED]
  source_tier: ""                             # [REQUIRED] Tier 1 preferred for the claim itself

---

## THE EVIDENCE
# All evidence relevant to this claim — supporting and contradicting.
# Do not select only contradicting evidence. Document everything.
# Credibility rating is based on source tier and independence — explain your rating.

the_evidence:

  supporting:
    - evidence_id: "SUP-001"
      description: ""                         # [REQUIRED] What this source says and why it supports the claim
      source_description: ""                  # [REQUIRED]
      source_url: ""                          # [REQUIRED]
      source_archive_url: ""                  # [REQUIRED]
      source_tier: ""                         # [REQUIRED]
      credibility_note: ""                    # [REQUIRED] e.g. "Single anonymous source, no corroboration"

  contradicting:
    - evidence_id: "CON-001"
      description: ""                         # [REQUIRED] What this source says and why it contradicts the claim
      source_description: ""                  # [REQUIRED]
      source_url: ""                          # [REQUIRED]
      source_archive_url: ""                  # [REQUIRED]
      source_tier: ""                         # [REQUIRED]
      credibility_note: ""                    # [REQUIRED] e.g. "International body with inspection access"

---

## THE SEQUENCE
# This is the core of the autopsy.
# Documented facts arranged in chronological order.
# [DOCUMENTED] and [INFERENCE] labels are mandatory — see Constitution Article 3.2.
# Write so the weight is felt without instruction — see Constitution Article 3.3.
# No editorializing. No conclusions stated. The sequence does the work.

sequence: |
  [DOCUMENTED] ...
  [DOCUMENTED] ...
  [DOCUMENTED] ...
  [INFERENCE] ...

---

## THE GAP
# One paragraph. The distance between the claim and the evidence.
# Do not tell the reader what to conclude.
# State what the evidence shows and what it does not show.
# Label every inference.

gap_summary: ""                               # [REQUIRED]

---

## WHO BENEFITS
# Documented interests that may explain why this claim was made.
# [REQUIRED]: Each entry must reference an Actor Record or a documented source.
# This is not accusation. It is documented context.
# "Who benefits" does not mean "who is guilty." The reader evaluates.

who_benefits:

  - actor_ref: ""                             # [REQUIRED] Actor Record ID
    documented_interest: ""                   # [REQUIRED] The specific interest
    relevance: ""                             # [REQUIRED] How it connects to this claim
    source_description: ""
    source_url: ""
    source_archive_url: ""
    source_tier: ""

---

## VERDICT
# Not guilty/innocent. Not true/false.
# A structured summary of what the evidence supports, what it contradicts,
# and what remains genuinely unknown.

evidence_assessment:
  claim_supported_by_evidence: ""             # [REQUIRED] yes / no / partially / insufficient evidence
  strongest_contradicting_source: ""          # [REQUIRED] The single most credible contradicting source
  strongest_supporting_source: ""             # [IF EXISTS] The single most credible supporting source
  what_remains_unknown: ""                    # [REQUIRED] What evidence would change this assessment

confidence_rating: ""                         # [REQUIRED] high / medium / low
confidence_rationale: ""                      # [REQUIRED] Why

---

## RECORD STATUS

status: "draft"                               # draft / under-review / published / contested
contested: false
contest_thread: ""
review_notes: ""

# BEFORE PUBLISHING THIS AUTOPSY, CONFIRM:
# [ ] Every claim has a source URL
# [ ] Every source URL has an archive URL
# [ ] Every source has a tier rating
# [ ] Every inference is labeled [INFERENCE]
# [ ] Every documented fact is labeled [DOCUMENTED]
# [ ] The title is a plain-language question any citizen can understand
# [ ] The sequence section requires no prior knowledge to follow
# [ ] No labels used that violate Constitution Article 3.1
# [ ] No editorializing in gap_summary — facts only, sequence does the work
