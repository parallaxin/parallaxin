// Evidence Standard rules that can be checked without the network.
// A published record must pass every rule (Constitution, Article 2).
// Drafts may break them; the gate reports what still blocks publication.
import YAML from 'yaml';

export const TYPES = ['autopsies', 'actors', 'conflicts'];
// [SOURCE NEEDED], [ARCHIVE NEEDED], and variants such as [ARCHIVE NEEDED — archive.ph]
const MARKER = /\[(SOURCE|ARCHIVE) NEEDED[^\]]*\]/g;

function markers(text) {
  return [...new Set(text.match(MARKER) ?? [])];
}
const TIER = /^Tier [123]$/;
const WAYBACK_SNAPSHOT = /^https:\/\/web\.archive\.org\/web\/\d{14}\//;

export function parseRecord(text) {
  const match = text.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n([\s\S]*))?$/);
  if (!match) throw new Error('missing front matter');
  return { data: YAML.parse(match[1]) ?? {}, body: match[2] ?? '' };
}

export function editorialStatus(type, data) {
  return (type === 'conflicts' ? data.editorial_status : data.status) ?? 'draft';
}

export function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function isWayback(value) {
  try {
    return new URL(value).hostname === 'web.archive.org';
  } catch {
    return false;
  }
}

function present(value) {
  return typeof value === 'string' && value.trim() !== '';
}

// Visit every string in the front matter with its path, e.g. the_evidence.supporting[0].source_url
function walk(value, path, visit) {
  if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`, visit));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k, visit);
  } else if (typeof value === 'string') visit(value, path);
}

function checkSourced(item, path, problems, { archive = false } = {}) {
  if (!present(item?.source_url)) problems.push(`${path}.source_url: missing`);
  if (!present(item?.source_tier)) problems.push(`${path}.source_tier: missing`);
  if (archive && !present(item?.source_archive_url)) problems.push(`${path}.source_archive_url: missing`);
}

/** Problems that block publication of one record file. */
export function publicationProblems(type, data, body = '') {
  const problems = [];

  walk(data, '', (value, path) => {
    const key = path.replace(/\[\d+\]$/, '').split('.').pop();
    const found = markers(value);
    for (const marker of found) problems.push(`${path}: contains ${marker}`);
    if ((key.endsWith('_url') || key === 'contest_thread') && present(value) && !found.length) {
      if (!isHttpUrl(value)) problems.push(`${path}: not an http(s) URL`);
      else if (key === 'source_archive_url' && isWayback(value) && !WAYBACK_SNAPSHOT.test(value)) {
        problems.push(`${path}: Wayback link has no snapshot timestamp`);
      }
    }
    if (key === 'source_tier' && !TIER.test(value)) problems.push(`${path}: tier must be Tier 1, 2 or 3`);
    if (key === 'sources') {
      for (const url of (value.match(/\b[a-z][a-z0-9+.-]*:[^\s\]]+/gi) ?? []).map(u => u.replace(/[.,;]+$/, ''))) {
        if (/^(?:https?|javascript|data|vbscript|file):/i.test(url) && !isHttpUrl(url)) {
          problems.push(`${path}: unsafe or invalid link ${url}`);
        }
      }
    }
  });

  for (const marker of markers(body)) problems.push(`body: contains ${marker}`);

  if (type === 'autopsies') {
    checkSourced(data.the_claim, 'the_claim', problems, { archive: true });
    for (const side of ['supporting', 'contradicting']) {
      (data.the_evidence?.[side] ?? []).forEach((ev, i) => checkSourced(ev, `the_evidence.${side}[${i}]`, problems, { archive: true }));
    }
    const ids = [...(data.the_evidence?.supporting ?? []), ...(data.the_evidence?.contradicting ?? [])].map(ev => ev.evidence_id);
    for (const id of new Set(ids.filter((id, i) => ids.indexOf(id) !== i))) problems.push(`the_evidence: duplicate evidence_id ${id}`);
    if (data.contested && !present(data.contest_thread)) problems.push('contest_thread: required when contested');
  }

  if (type === 'actors') {
    (data.stated_positions ?? []).forEach((sp, i) => checkSourced(sp, `stated_positions[${i}]`, problems));
    (data.documented_actions ?? []).forEach((da, i) => checkSourced(da, `documented_actions[${i}]`, problems));
  }

  if (type === 'conflicts') {
    for (const list of ['timeline', 'antecedents']) {
      (data[list] ?? []).forEach((ev, i) => {
        if ((ev.type ?? 'documented') === 'documented' && !(ev.sources ?? []).some(present)) {
          problems.push(`${list}[${i}].sources: documented event has no source`);
        }
      });
    }
  }

  return problems;
}

/** Record IDs this record points to, by collection. */
export function references(type, data) {
  if (type === 'autopsies') {
    return {
      conflicts: [data.conflict_ref],
      actors: [data.actor_ref, ...(data.who_benefits ?? []).map(wb => wb.actor_ref)],
    };
  }
  if (type === 'actors') return { conflicts: data.conflicts ?? [] };
  return { actors: (data.actors ?? []).map(a => a.actor_id), autopsies: data.autopsies ?? [] };
}

/**
 * Checks one collection's files: [{ file, data }].
 * Every record needs a unique record_id matching its file name, and an
 * Arabic file must describe the same record as its English file.
 */
export function integrityProblems(type, files) {
  const problems = [];
  const seen = new Map();
  for (const { file, data } of files) {
    const base = file.replace(/(\.ar)?\.mdx?$/, '');
    if (!present(data.record_id)) {
      problems.push(`${type}/${file}: missing record_id`);
      continue;
    }
    if (data.record_id.toUpperCase() !== base.toUpperCase()) {
      problems.push(`${type}/${file}: record_id ${data.record_id} does not match file name`);
    }
    if (/\.ar\.mdx?$/.test(file)) continue;
    if (seen.has(data.record_id)) problems.push(`${type}/${file}: duplicate record_id ${data.record_id} (also ${seen.get(data.record_id)})`);
    seen.set(data.record_id, file);
  }
  return problems;
}
