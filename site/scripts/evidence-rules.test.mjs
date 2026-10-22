import { describe, it, expect } from 'vitest';
import { parseRecord, publicationProblems, integrityProblems, references } from './evidence-rules.mjs';

const source = (extra = {}) => ({
  evidence_id: 'E1',
  description: 'd',
  source_description: 's',
  source_url: 'https://example.org/doc',
  source_archive_url: 'https://web.archive.org/web/20260301000000/https://example.org/doc',
  source_tier: 'Tier 1',
  ...extra,
});

const autopsy = (evidence = [source()], extra = {}) => ({
  record_id: 'CA-2026-0001',
  status: 'published',
  conflict_ref: 'CON-2025-0001',
  actor_ref: 'ACT-2026-0001',
  the_claim: {
    text: 't', speaker: 's', date: '2026-01-01',
    source_url: 'https://example.org/claim',
    source_archive_url: 'https://archive.ph/abc12',
    source_tier: 'Tier 1',
  },
  the_evidence: { supporting: [], contradicting: evidence },
  ...extra,
});

const problems = (data) => publicationProblems('autopsies', data);

describe('publicationProblems', () => {
  it('accepts a fully sourced autopsy', () => {
    expect(problems(autopsy())).toEqual([]);
  });

  it('rejects Tier 4 and unknown tiers', () => {
    expect(problems(autopsy([source({ source_tier: 'Tier 4' })]))).toContain(
      'the_evidence.contradicting[0].source_tier: tier must be Tier 1, 2 or 3');
  });

  it('rejects javascript: and other non-http URLs', () => {
    expect(problems(autopsy([source({ source_url: 'javascript:alert(1)' })]))).toContain(
      'the_evidence.contradicting[0].source_url: not an http(s) URL');
  });

  it('rejects empty sources and markers', () => {
    const result = problems(autopsy([source({ source_url: '', source_archive_url: '[ARCHIVE NEEDED]' })]));
    expect(result).toContain('the_evidence.contradicting[0].source_url: missing');
    expect(result).toContain('the_evidence.contradicting[0].source_archive_url: contains [ARCHIVE NEEDED]');
  });

  it('recognises marker variants', () => {
    expect(problems(autopsy([source({ source_archive_url: '[ARCHIVE NEEDED — archive.ph]' })]))).toContain(
      'the_evidence.contradicting[0].source_archive_url: contains [ARCHIVE NEEDED — archive.ph]');
  });

  it('rejects a Wayback link without a snapshot timestamp', () => {
    expect(problems(autopsy([source({ source_archive_url: 'https://web.archive.org/web/https://example.org/doc' })]))).toContain(
      'the_evidence.contradicting[0].source_archive_url: Wayback link has no snapshot timestamp');
  });

  it('rejects duplicate evidence IDs', () => {
    expect(problems(autopsy([source(), source()]))).toContain('the_evidence: duplicate evidence_id E1');
  });

  it('requires a thread for contested records', () => {
    expect(problems(autopsy([source()], { contested: true }))).toContain('contest_thread: required when contested');
  });

  it('rejects markers in the body', () => {
    expect(publicationProblems('autopsies', autopsy(), 'Text [SOURCE NEEDED]')).toContain('body: contains [SOURCE NEEDED]');
  });

  it('requires sources on documented conflict events, not inferences', () => {
    const conflict = {
      timeline: [
        { date: '2025-01-01', description: 'a', type: 'documented', sources: [] },
        { date: '2025-01-02', description: 'b', type: 'inference', sources: [] },
      ],
    };
    expect(publicationProblems('conflicts', conflict)).toEqual(['timeline[0].sources: documented event has no source']);
  });

  it('flags unsafe links inside source strings', () => {
    const conflict = { timeline: [{ date: '2025-01-01', description: 'a', sources: ['See javascript:alert(1)'] }] };
    expect(publicationProblems('conflicts', conflict)).toEqual(['timeline[0].sources[0]: unsafe or invalid link javascript:alert(1)']);
  });

  it('requires sources on actor positions and actions', () => {
    const actor = { stated_positions: [{ claim: 'c', date: '2026', source_tier: 'Tier 1' }] };
    expect(publicationProblems('actors', actor)).toEqual(['stated_positions[0].source_url: missing']);
  });
});

describe('integrityProblems', () => {
  it('flags mismatched and duplicate record IDs', () => {
    const result = integrityProblems('actors', [
      { file: 'ACT-2026-0001.md', data: { record_id: 'ACT-2026-0001' } },
      { file: 'ACT-2026-0001.ar.md', data: { record_id: 'ACT-2026-0001' } },
      { file: 'ACT-2026-0002.md', data: { record_id: 'ACT-2026-0001' } },
      { file: 'ACT-2026-0003.md', data: {} },
    ]);
    expect(result).toEqual([
      'actors/ACT-2026-0002.md: record_id ACT-2026-0001 does not match file name',
      'actors/ACT-2026-0002.md: duplicate record_id ACT-2026-0001 (also ACT-2026-0001.md)',
      'actors/ACT-2026-0003.md: missing record_id',
    ]);
  });
});

describe('parseRecord and references', () => {
  it('reads front matter and the body', () => {
    const { data, body } = parseRecord('﻿---\r\nrecord_id: X\r\n---\r\nBody');
    expect(data.record_id).toBe('X');
    expect(body).toBe('Body');
  });

  it('throws on invalid YAML', () => {
    expect(() => parseRecord('---\nkey: [unclosed\n---\n')).toThrow();
  });

  it('lists the records an autopsy points to', () => {
    expect(references('autopsies', autopsy([], { who_benefits: [{ actor_ref: 'ACT-2026-0002' }] }))).toEqual({
      conflicts: ['CON-2025-0001'],
      actors: ['ACT-2026-0001', 'ACT-2026-0002'],
    });
  });
});
