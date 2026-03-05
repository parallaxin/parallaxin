---
# PARALLAXIN — CONFLICT RECORD TEMPLATE
# The conflict is context. The actor behavior is the product.
# This record is the container. Actor Records and Claim Autopsies are the content.
# Every event in the timeline requires minimum Tier 2 sourcing.
# Dates must be documented, not estimated. If disputed, say so explicitly.

schema_version: "1.0"
record_type: "conflict"
record_id: "CON-[YYYY]-[SEQUENCE]"            # e.g. CON-2025-0001
last_updated: "YYYY-MM-DD"                    # [REQUIRED]
contributors: []                              # Git commit hashes — auto-populated

---

## IDENTIFICATION

name: ""                                      # [REQUIRED] Factual name — no framing labels
status: ""                                    # [REQUIRED] active / concluded / frozen
start_date: "YYYY-MM-DD"                      # [REQUIRED] First documented military/armed event
end_date: "YYYY-MM-DD"                        # [IF CONCLUDED]
geography: []                                 # [REQUIRED] Countries/regions directly involved

# FRAMING NOTE:
# "Start date" is the first documented event in THIS conflict record's scope.
# If this conflict has documented antecedents, they are listed under CONTEXT below.
# Choosing where a conflict "begins" is an editorial act — see Constitution Article 3.4.
# We document the chain, not a convenient starting point.

---

## ACTORS
# List of Actor Record IDs involved in this conflict.
# Do not describe actors here — their records do that.
# Classify by documented role in this conflict only.

actors:

  - actor_id: ""                              # [REQUIRED] Reference to Actor Record
    role_in_conflict: ""                      # [REQUIRED] e.g. "Initiating military force" / "Responding force" / "Proxy force" / "Mediating party"
    entered_conflict_date: "YYYY-MM-DD"       # [IF KNOWN]
    entry_documentation: ""                   # [REQUIRED] Source documenting their involvement

---

## TIMELINE
# Chronological record of documented events.
# Each event: specific, sourced, described without labels.
# Minimum 2 independent sources per event where possible. Tier noted explicitly.
# If only one source exists, label: "Single-source — awaiting corroboration."

timeline:

  - event_id: "EVT-001"
    date: "YYYY-MM-DD"                        # [REQUIRED]
    time: ""                                  # [IF KNOWN] UTC preferred
    location: ""                              # [REQUIRED] As specific as documented
    actor_ref: ""                             # [REQUIRED] Actor Record ID of responsible party
    description: ""                           # [REQUIRED] What happened. Specific. No labels.
    outcome: ""                               # [IF KNOWN] Documented immediate result
    
    sources:
      - description: ""
        url: ""
        archive_url: ""
        tier: ""
      - description: ""
        url: ""
        archive_url: ""
        tier: ""
    
    single_source: false                      # true if only one source exists — triggers label

---

## CONTEXT
# Documented antecedents to this conflict.
# Not background color. Documented events that causally connect to the current conflict.
# Same sourcing standards as timeline. Same labeling rules.

antecedents:

  - event_id: "ANT-001"
    date: "YYYY-MM-DD"
    description: ""                           # [REQUIRED]
    relevance: ""                             # [REQUIRED] Why this is included — documented causal link
    sources:
      - description: ""
        url: ""
        archive_url: ""
        tier: ""

---

## HUMAN COST
# Figures from international bodies or verified independent sources only.
# Never use figures from conflict parties without independent corroboration.
# Always show the source and the date of the count — these change.

human_cost:

  civilian_deaths:
    value: null                               # [IF DOCUMENTED] Number or range
    source_description: ""
    source_url: ""
    source_archive_url: ""
    source_tier: ""
    count_date: "YYYY-MM-DD"                  # Date this figure was reported
    notes: ""                                 # e.g. "Figure contested by [party] — see [source]"

  combatant_deaths:
    value: null
    source_description: ""
    source_url: ""
    source_archive_url: ""
    source_tier: ""
    count_date: "YYYY-MM-DD"
    notes: ""

  displaced:
    value: null
    source_description: ""
    source_url: ""
    source_archive_url: ""
    source_tier: ""
    count_date: "YYYY-MM-DD"
    notes: ""

  injured:
    value: null
    source_description: ""
    source_url: ""
    source_archive_url: ""
    source_tier: ""
    count_date: "YYYY-MM-DD"
    notes: ""

---

## ECONOMIC COST
# Automated where possible. Human-verified before publication.
# Source every figure. Round numbers are a red flag — note when figures are estimates.

economic_cost:

  - indicator: ""                             # e.g. "Brent crude price change since conflict start"
    value: ""                                 # e.g. "+18% ($14.20/barrel)"
    baseline_date: "YYYY-MM-DD"
    measurement_date: "YYYY-MM-DD"
    source_description: ""
    source_url: ""
    source_tier: ""

---

## CLAIM AUTOPSIES
# List of Claim Autopsy IDs attached to this conflict.
# Autopsies are first-class records — they live in their own files.
# This is the index.

claim_autopsies: []                           # List of CA record IDs e.g. [CA-2026-0001, CA-2026-0002]

---

## RECORD STATUS

status: "draft"                               # draft / under-review / published / contested
contested: false
contest_thread: ""
review_notes: ""
