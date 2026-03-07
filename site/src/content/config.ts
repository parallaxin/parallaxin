import { defineCollection, z } from 'astro:content';

// ════════════════════════════════════════════════════════════
// PARALLAXIN CONTENT SCHEMA
// 
// This schema enforces the Constitution at the data level:
// - Tier 4 (unverifiable) sources are not representable
// - Every evidence item requires a tier classification
// - Inference vs documented distinction is structurally required
// - Draft content can exist; publish requires checklist pass
//
// The schema matches the actual content structure produced by
// the editorial process. If content structure evolves, this
// file evolves with it — checked against the Constitution.
// ════════════════════════════════════════════════════════════

// Shared: evidence item used in supporting/contradicting arrays
const evidenceItemSchema = z.object({
  evidence_id: z.string(),
  description: z.string(),
  source_description: z.string(),
  source_url: z.string(),
  source_archive_url: z.string().default('[ARCHIVE NEEDED]'),
  source_tier: z.string(),  // "Tier 1", "Tier 2", "Tier 3"
  credibility_note: z.string().optional(),
});

// Shared: who-benefits item
const beneficiarySchema = z.object({
  actor_ref: z.string(),
  documented_interest: z.string(),
  relevance: z.string(),
  source_description: z.string().optional(),
  source_url: z.string().optional(),
  source_archive_url: z.string().default('[ARCHIVE NEEDED]'),
  source_tier: z.string().optional(),
});

// ════════════════════════════════════════
// CLAIM AUTOPSIES — CA-YYYY-NNNN
// The shareable product. What gets cited.
// ════════════════════════════════════════

const autopsies = defineCollection({
  type: 'content',
  schema: z.object({
    // Identity
    schema_version: z.string().default('1.0'),
    record_type: z.string().default('claim_autopsy'),
    record_id: z.string(),
    conflict_ref: z.string(),
    actor_ref: z.string(),
    last_updated: z.coerce.string(),
    contributors: z.array(z.string()).default([]),

    // Content
    title: z.string(),

    the_claim: z.object({
      text: z.string(),
      speaker: z.string(),
      date: z.coerce.string(),
      context: z.string().optional(),
      source_description: z.string().optional(),
      source_url: z.string().optional(),
      source_archive_url: z.string().default('[ARCHIVE NEEDED]'),
      source_tier: z.string().optional(),
    }),

    the_evidence: z.object({
      supporting: z.array(evidenceItemSchema).default([]),
      contradicting: z.array(evidenceItemSchema).default([]),
    }),

    sequence: z.string().optional(),
    gap_summary: z.string(),

    who_benefits: z.array(beneficiarySchema).default([]),

    evidence_assessment: z.object({
      claim_supported_by_evidence: z.string(),
      strongest_contradicting_source: z.string(),
      strongest_supporting_source: z.string().optional(),
      what_remains_unknown: z.string().optional(),
    }),

    confidence_rating: z.enum(['high', 'medium', 'low']),
    confidence_rationale: z.string().optional(),

    // Status and review
    status: z.enum(['draft', 'under-review', 'published']).default('draft'),
    contested: z.boolean().default(false),
    contest_thread: z.string().default(''),
    review_notes: z.string().optional(),
  }),
});

// ════════════════════════════════════════
// CONFLICTS — CON-YYYY-NNNN
// ════════════════════════════════════════

// Actors in conflict — flexible for drafts
const conflictActorSchema = z.object({
  actor_id: z.string(),                    // ACT-YYYY-NNNN
  role_in_conflict: z.string(),
  entered_date: z.coerce.string().optional(),
  documentation: z.string().optional(),
  source_url: z.string().optional(),
  source_tier: z.string().optional(),
});

// Timeline events — sources as strings, not full source objects
const timelineEventSchema = z.object({
  event_id: z.string().optional(),
  date: z.coerce.string(),
  description: z.string(),
  type: z.enum(['documented', 'inference']).default('documented'),
  outcome: z.string().optional(),
  sources: z.array(z.string()).default([]),  // URLs or descriptions
  source_tier: z.string().optional(),
});

// Antecedents — causally connected prior events
const antecedentSchema = z.object({
  date: z.coerce.string(),
  description: z.string(),
  relevance: z.string().optional(),
  type: z.enum(['documented', 'inference']).default('documented'),
  sources: z.array(z.string()).default([]),
  source_tier: z.string().optional(),
});

// Human cost — every field optional, every field sourced
const humanCostSchema = z.object({
  civilian_deaths: z.object({
    value: z.string(),
    source: z.string().optional(),
    source_url: z.string().optional(),
    last_updated: z.coerce.string().optional(),
  }).optional(),
  combatant_deaths: z.object({
    value: z.string(),
    source: z.string().optional(),
    source_url: z.string().optional(),
    last_updated: z.coerce.string().optional(),
  }).optional(),
  displaced: z.object({
    value: z.string(),
    source: z.string().optional(),
    source_url: z.string().optional(),
    last_updated: z.coerce.string().optional(),
  }).optional(),
  injured: z.object({
    value: z.string(),
    source: z.string().optional(),
    source_url: z.string().optional(),
    last_updated: z.coerce.string().optional(),
  }).optional(),
}).optional();

// Economic cost indicators
const economicIndicatorSchema = z.object({
  indicator: z.string(),
  value: z.string(),
  source: z.string().optional(),
  source_url: z.string().optional(),
});

const conflicts = defineCollection({
  type: 'content',
  schema: z.object({
    schema_version: z.string().default('1.0'),
    record_type: z.string().default('conflict_record'),
    record_id: z.string(),
    name: z.string(),
    status: z.enum(['active', 'ceasefire', 'ended', 'frozen']).default('active'),
    start_date: z.coerce.string(),
    end_date: z.coerce.string().optional(),
    framing_note: z.string().default(
      'The selection of a start date is an editorial act. Events have documented antecedents. See full timeline.'
    ),
    geography: z.array(z.string()).default([]),

    // Enriched from z.array(z.string())
    actors: z.array(conflictActorSchema).default([]),

    // Enriched from basic timeline
    timeline: z.array(timelineEventSchema).default([]),

    // New
    antecedents: z.array(antecedentSchema).default([]),

    // Typed from z.any()
    human_cost: humanCostSchema,
    economic_cost: z.array(economicIndicatorSchema).default([]),

    autopsies: z.array(z.string()).default([]),
    last_updated: z.coerce.string(),
    review_notes: z.string().optional(),
  }),
});

// ════════════════════════════════════════
// ACTORS — ACT-YYYY-NNNN
// ════════════════════════════════════════

const actors = defineCollection({
  type: 'content',
  schema: z.object({
    schema_version: z.string().default('1.0'),
    record_type: z.string().default('actor_record'),
    record_id: z.string(),
    name: z.string(),
    role: z.string(),
    institution: z.string().optional(),
    in_power_since: z.coerce.string().optional(),
    affiliation: z.string().optional(),
    conflicts: z.array(z.string()).default([]),
    stated_positions: z.array(z.object({
      claim: z.string(),
      date: z.string(),
      context: z.string().optional(),
      source_description: z.string().optional(),
      source_url: z.string().optional(),
      source_tier: z.string().optional(),
    })).default([]),
    documented_actions: z.array(z.object({
      action: z.string(),
      date: z.coerce.string(),
      impact: z.string().optional(),
      source_description: z.string().optional(),
      source_url: z.string().optional(),
      source_tier: z.string().optional(),
    })).default([]),
    gap_analysis: z.array(z.object({
      stated: z.string(),
      documented: z.string(),
      gap: z.string(),
      type: z.enum(['documented', 'inference']).default('inference'),
      confidence: z.enum(['high', 'medium', 'low']).default('medium'),
      sources: z.array(z.string()).default([]),
    })).default([]),
    personal_interests: z.array(z.object({
      id: z.string().optional(),
      interest: z.string(),
      relevance: z.string(),
      type: z.enum(['documented', 'inference']).default('documented'),
      source_description: z.string().optional(),
      source_url: z.string().optional(),
    })).default([]),
    status: z.enum(['draft', 'under-review', 'published']).default('draft'),
    last_updated: z.coerce.string(),
    review_notes: z.string().optional(),
  }),
});

export const collections = { conflicts, actors, autopsies };