// Network check of every source and archive link in the content.
// Exit 1 when a file cannot be parsed or a link is broken.
// --strict  also exit 1 when a server refuses automated access (unverified)
// --fix     archive sources that lack a snapshot, after confirming the
//           snapshot loads; writes the snapshot URL and the check date
// Structural rules (markers, tiers, references) live in check-evidence.mjs.
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import YAML from 'yaml';
import { checkUrl, collectLinks, archiveGaps, archiveUrl, pathLabel } from './source-links.mjs';

const CONTENT_DIR = 'src/content';
const FIX_MODE = process.argv.includes('--fix');
const STRICT = process.argv.includes('--strict');
const FRONT_MATTER = /^(﻿?---\r?\n)([\s\S]*?)(\r?\n---)/;

const files = (await readdir(CONTENT_DIR, { withFileTypes: true, recursive: true }))
  .filter(e => e.isFile() && /\.mdx?$/.test(e.name))
  .map(e => join(e.parentPath, e.name));

const stats = { ok: 0, unverified: 0, broken: 0, parseErrors: 0, archived: 0 };
const cache = new Map();
const today = new Date().toISOString().slice(0, 10);

console.log(`\nPARALLAXIN SOURCE CHECKER (${FIX_MODE ? 'fix' : 'report'} mode)\n`);

for (const file of files) {
  const raw = await readFile(file, 'utf8');
  const match = raw.match(FRONT_MATTER);
  const doc = match && YAML.parseDocument(match[2]);
  if (!doc || doc.errors.length) {
    stats.parseErrors++;
    console.log(`File: ${file}\n  [PARSE]      ${doc ? doc.errors[0].message.split('\n')[0] : 'missing front matter'}`);
    continue;
  }
  const data = doc.toJS() ?? {};
  const links = collectLinks(data);
  if (!links.length) continue;

  console.log(`File: ${file}`);
  for (const link of links) {
    if (!cache.has(link.url)) cache.set(link.url, await checkUrl(link.url));
    const check = cache.get(link.url);
    stats[check.result]++;
    if (check.result !== 'ok') {
      const why = check.error ?? check.status;
      console.log(`  [${check.result.toUpperCase()}]${' '.repeat(12 - check.result.length)}${pathLabel(link.path)} ${link.url} (${why})`);
    }
  }

  if (FIX_MODE) {
    let changed = false;
    for (const gap of archiveGaps(data)) {
      if (cache.get(gap.url)?.result !== 'ok') continue;
      const snapshot = await archiveUrl(gap.url).catch(() => null);
      if (!snapshot) {
        console.log(`  [NOT SAVED]  ${pathLabel(gap.path)} ${gap.url}`);
        continue;
      }
      doc.setIn([...gap.path, 'source_archive_url'], snapshot);
      doc.setIn([...gap.path, 'source_archive_verified'], today);
      changed = true;
      stats.archived++;
      console.log(`  [ARCHIVED]   ${pathLabel(gap.path)} ${snapshot}`);
      await new Promise(r => setTimeout(r, 15000)); // Wayback rate limit
    }
    if (changed) {
      const yaml = String(doc).replace(/\n$/, '');
      await writeFile(file, raw.replace(FRONT_MATTER, (_, open, _body, close) => open + yaml + close), 'utf8');
    }
  }
}

console.log(`\n--- REPORT ---`);
console.log(`Reachable:   ${stats.ok}`);
console.log(`Unverified:  ${stats.unverified}  (server refused automated access; check by hand)`);
console.log(`Broken:      ${stats.broken}`);
console.log(`Parse errors: ${stats.parseErrors}`);
if (FIX_MODE) console.log(`Archived:    ${stats.archived}`);
console.log('Reachable means the page loads, not that it supports the claim.\n');

if (stats.broken || stats.parseErrors || (STRICT && stats.unverified)) process.exit(1);
