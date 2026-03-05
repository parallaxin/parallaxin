---
# PARALLAXIN — ACTOR RECORD TEMPLATE
# Every field marked [REQUIRED] must be populated before publication.
# Every field marked [IF KNOWN] is published when available, omitted when not.
# Never leave a field blank. If unknown, write: "Not publicly documented."
# All source URLs must be archived (archive.org or archive.ph) before submission.

schema_version: "1.0"
record_type: "actor"
record_id: "ACT-[YYYY]-[SEQUENCE]"           # e.g. ACT-2026-0001
last_updated: "YYYY-MM-DD"                    # [REQUIRED]
contributors: []                              # Git commit hashes — auto-populated

---

## IDENTITY

name: ""                                      # [REQUIRED] Full legal name
aliases: []                                   # [IF KNOWN] Known aliases, titles
role: ""                                      # [REQUIRED] Current role/position
role_since: "YYYY-MM-DD"                      # [IF KNOWN]
institution: ""                               # [REQUIRED] Government / org / military
nationality: ""                               # [REQUIRED]
jurisdiction: ""                              # [REQUIRED] Where their decisions have legal force

---

## STATED POSITIONS
# What this actor has publicly claimed, on record.
# Each entry requires: the exact claim, the date, the context, and a Tier 1 or Tier 2 source.
# Do NOT paraphrase. Summarize only when full transcript is linked.

stated_positions:

  - claim_id: "SP-001"
    claim: ""                                 # [REQUIRED] The stated position, in their words or close summary
    date: "YYYY-MM-DD"                        # [REQUIRED]
    context: ""                               # [REQUIRED] Where/why it was said (e.g. "UN General Assembly address")
    source_description: ""                    # [REQUIRED] e.g. "Official transcript, Prime Minister's Office"
    source_url: ""                            # [REQUIRED]
    source_archive_url: ""                    # [REQUIRED]
    source_tier: ""                           # [REQUIRED] Tier 1 / Tier 2 / Tier 3 — see Constitution Article 2

---

## DOCUMENTED ACTIONS
# What this actor has verifiably done.
# Each entry requires minimum Tier 2 sourcing.
# Describe the act specifically. No labels, no characterizations — see Constitution Article 3.1.

documented_actions:

  - action_id: "DA-001"
    action: ""                                # [REQUIRED] Specific act: what, when, against whom/what
    date: "YYYY-MM-DD"                        # [REQUIRED]
    location: ""                              # [IF KNOWN]
    outcome: ""                               # [IF KNOWN] Documented result of the action
    source_description: ""                    # [REQUIRED]
    source_url: ""                            # [REQUIRED]
    source_archive_url: ""                    # [REQUIRED]
    source_tier: ""                           # [REQUIRED]

---

## GAP ANALYSIS
# The distance between stated positions and documented actions.
# [DOCUMENTED] facts only. [INFERENCE] labeled explicitly.
# This section is the product. It must be written with precision.

gap_entries:

  - gap_id: "GAP-001"
    stated_ref: "SP-001"                      # [REQUIRED] Reference to stated_positions entry
    action_ref: "DA-001"                      # [REQUIRED] Reference to documented_actions entry
    
    documented_facts: |                       # [REQUIRED] Only verified facts, each with inline source ref
      [DOCUMENTED] ...
      [DOCUMENTED] ...
      
    inference: |                              # [REQUIRED if inference exists] Clearly labeled reasoning
      [INFERENCE] ...
      
    gap_summary: ""                           # [REQUIRED] One paragraph. No editorializing. Facts in sequence.
    
    confidence: ""                            # [REQUIRED] high / medium / low
    confidence_rationale: ""                  # [REQUIRED] Why this confidence level
    
    sources:
      - description: ""
        url: ""
        archive_url: ""
        tier: ""

---

## PERSONAL INTERESTS
# Documented factors that may influence this actor's decisions.
# [REQUIRED]: Each entry must have a source. No speculation without documentation.
# This is not character assassination. It is context. Document it like everything else.

personal_interests:

  - interest_id: "PI-001"
    interest: ""                              # [REQUIRED] The specific interest (legal, financial, political)
    documentation: ""                         # [REQUIRED] How it is documented
    relevance: ""                             # [REQUIRED] Why it is relevant to their actions
    source_description: ""
    source_url: ""
    source_archive_url: ""
    source_tier: ""

---

## RECORD STATUS

status: "draft"                               # draft / under-review / published / contested
contested: false                              # true if any claim in this record is under dispute
contest_thread: ""                            # Link to public dispute thread if contested
review_notes: ""                              # Internal notes for reviewers — removed before publication
