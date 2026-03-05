import { defineCollection, z } from 'astro:content';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SOURCE SCHEMA â€” enforces Article 2
// Every source must have a URL and an archive
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const sourceSchema = z.object({
  description: z.string(),
  url: z.string().url(),
  archive_url: z.string().url().optional(),  // Required before publish â€” optional during draft
  tier: z.enum(['primary', 'corroborated', 'single-source']),
  // Tier 4 (unverifiable) is not representable â€” by design
  accessed: z.string(),  // ISO date
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CONFLICT RECORDS â€” CON-YYYY-NNNN
// The context. References actors, does not describe them.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const conflicts = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^CON-\d{4}-\d{4}$/),
    title: z.string(),
    status: z.enum(['active', 'ceasefire', 'ended', 'frozen']),
    start_date: z.string(),
    start_date_note: z.string().optional(),
    // Constitution 3.4: "Choosing where a story begins is an editorial act"
    framing_note: z.string().default(
      'The selection of a start date is an editorial act. See timeline for documented antecedents.'
    ),
    regions: z.array(z.string()),
    actors: z.array(z.string()),  // References to actor IDs: ACT-YYYY-NNNN
    autopsies: z.array(z.string()).default([]),  // References to CA-YYYY-NNNN
    human_cost: z.object({
      civilian_deaths: z.object({
        value: z.string(),  // String to allow "10,000+" or "unknown"
        source: sourceSchema,
        last_updated: z.string(),
      }).optional(),
      displaced: z.object({
        value: z.string(),
        source: sourceSchema,
        last_updated: z.string(),
      }).optional(),
      military_deaths: z.object({
        value: z.string(),
        source: sourceSchema,
        last_updated: z.string(),
      }).optional(),
    }).optional(),
    economic_cost: z.object({
      summary: z.string(),
      sources: z.array(sourceSchema),
    }).optional(),
    timeline: z.array(z.object({
      date: z.string(),
      event: z.string(),
      type: z.enum(['documented', 'inference']),  // Constitution 3.2
      sources: z.array(sourceSchema),
    })),
    last_updated: z.string(),
    status_note: z.enum(['draft', 'published', 'under-review']).default('draft'),
  }),
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ACTOR RECORDS â€” ACT-YYYY-NNNN
// The product: stated position vs documented action
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const actors = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^ACT-\d{4}-\d{4}$/),
    name: z.string(),
    role: z.string(),
    // Constitution 3.1: describe by role and action, not identity labels
    in_power_since: z.string().optional(),
    affiliation: z.string().optional(),
    conflicts: z.array(z.string()),  // CON-YYYY-NNNN references

    stated_positions: z.array(z.object({
      claim: z.string(),
      date: z.string(),
      context: z.string(),
      source: sourceSchema,
    })),

    documented_actions: z.array(z.object({
      action: z.string(),
      date: z.string(),
      impact: z.string().optional(),
      sources: z.array(sourceSchema),
    })),

    gap_analysis: z.array(z.object({
      stated: z.string(),
      documented: z.string(),
      gap: z.string(),
      type: z.enum(['documented', 'inference']),  // Constitution 3.2
      confidence: z.enum(['high', 'medium', 'low']),
      sources: z.array(sourceSchema),
    })),

    personal_interests: z.array(z.object({
      interest: z.string(),
      relevance: z.string(),
      type: z.enum(['documented', 'inference']),
      sources: z.array(sourceSchema),
    })).optional(),

    last_updated: z.string(),
    status_note: z.enum(['draft', 'published', 'under-review']).default('draft'),
  }),
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CLAIM AUTOPSIES â€” CA-YYYY-NNNN
// The shareable product. What gets cited.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const autopsies = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^CA-\d{4}-\d{4}$/),
    title: z.string(),
    conflict: z.string(),  // CON-YYYY-NNNN
    actor: z.string(),     // ACT-YYYY-NNNN (primary claimant)

    the_claim: z.object({
      text: z.string(),
      speaker: z.string(),
      speaker_role: z.string(),
      date: z.string(),
      context: z.string(),
      source: sourceSchema,
    }),

    the_evidence: z.object({
      supporting: z.array(z.object({
        summary: z.string(),
        source: sourceSchema,
        credibility_note: z.string(),
      })).default([]),
      contradicting: z.array(z.object({
        summary: z.string(),
        source: sourceSchema,
        credibility_note: z.string(),
      })).default([]),
    }),

    the_gap: z.object({
      summary: z.string(),
      // Constitution 3.2: this is always inference, labeled as such
      type: z.literal('inference'),
    }),

    who_benefits: z.array(z.object({
      actor: z.string(),  // ACT-YYYY-NNNN
      benefit: z.string(),
      // Constitution: "Who benefits" is documented context, not accusation
      type: z.enum(['documented', 'inference']),
      source: sourceSchema.optional(),
    })),

    confidence: z.enum(['high', 'medium', 'low']),
    confidence_basis: z.string(),

    // Pre-publish checklist â€” Constitution Article 2 enforcement
    publish_checklist: z.object({
      all_sources_tier2_minimum: z.boolean().default(false),
      all_sources_archived: z.boolean().default(false),
      inference_labeled: z.boolean().default(false),
      no_identity_labels: z.boolean().default(false),
      gap_analysis_sourced: z.boolean().default(false),
    }).optional(),

    last_updated: z.string(),
    status_note: z.enum(['draft', 'published', 'under-review']).default('draft'),
  }),
});

export const collections = { conflicts, actors, autopsies };
