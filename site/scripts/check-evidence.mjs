// Deterministic evidence gate (no network). Fails when:
// - a record file cannot be parsed, or record IDs are missing, mismatched or duplicated
// - a published record breaks the Evidence Standard rules in evidence-rules.mjs
// - a published record points to a record that does not exist
// Drafts and records under review are reported, not failed.
// Usage: node scripts/check-evidence.mjs [--record CA-2026-0001]
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { TYPES, parseRecord, editorialStatus, publicationProblems, references, integrityProblems } from './evidence-rules.mjs';

const CONTENT_DIR = 'src/content';
const only = process.argv.includes('--record') ? process.argv[process.argv.indexOf('--record') + 1]?.toUpperCase() : null;

const errors = [];
const pending = [];
const records = [];

for (const type of TYPES) {
  const files = [];
  for (const file of (await readdir(join(CONTENT_DIR, type))).filter(f => /\.mdx?$/.test(f))) {
    try {
      const { data, body } = parseRecord(await readFile(join(CONTENT_DIR, type, file), 'utf8'));
      files.push({ file, data, body });
    } catch (e) {
      errors.push(`${type}/${file}: cannot parse front matter (${e.message.split('\n')[0]})`);
    }
  }
  errors.push(...integrityProblems(type, files));
  records.push(...files.map(f => ({ type, ...f })));
}

const known = new Set(records.map(r => r.data.record_id?.toUpperCase()));

for (const { type, file, data, body } of records) {
  if (only && data.record_id?.toUpperCase() !== only) continue;
  const problems = publicationProblems(type, data, body);
  for (const [collection, ids] of Object.entries(references(type, data))) {
    for (const id of ids.filter(Boolean)) {
      if (!known.has(id.toUpperCase())) problems.push(`references ${collection} ${id}, which does not exist`);
    }
  }
  const status = editorialStatus(type, data);
  const lines = problems.map(p => `${type}/${file}: ${p}`);
  if (status === 'published') errors.push(...lines);
  else pending.push({ label: `${type}/${file} (${status})`, lines });
}

for (const { label, lines } of pending) {
  if (only) {
    console.log(`${label}: ${lines.length} issue(s) block publication`);
    lines.forEach(l => console.log(`  ${l}`));
  } else if (lines.length) {
    console.log(`${label}: ${lines.length} issue(s) block publication`);
  }
}

if (errors.length) {
  console.error(`\n${errors.join('\n')}\n\n${errors.length} evidence gate error(s)`);
  process.exit(1);
}
console.log('\nEvidence gate OK: no published record breaks the Evidence Standard checks.');
