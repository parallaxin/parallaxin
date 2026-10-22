// Checks the built site (dist/) for publication and language routing:
// - every published record has exactly one English page and one Arabic page
// - unpublished records (draft, under review) have no page and no sitemap entry
// - no `.ar` record pages exist under any route
// - each page declares its language and its switcher links to the counterpart
// Run after `npm run build`.
import { readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

const BASE = '/parallaxin/';
const DIST = 'dist';
const TYPES = ['autopsies', 'actors', 'conflicts'];

const errors = [];

// English records only; their editorial status decides publication.
async function records(type) {
  const dir = join('src/content', type);
  const files = (await readdir(dir)).filter(f => /\.mdx?$/.test(f) && !/\.ar\.mdx?$/.test(f));
  return Promise.all(files.map(async f => {
    const text = await readFile(join(dir, f), 'utf8');
    const match = text.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const data = match ? YAML.parse(match[1]) : {};
    const status = (type === 'conflicts' ? data.editorial_status : data.status) ?? 'draft';
    return { id: f.replace(/\.mdx?$/, ''), published: status === 'published' };
  }));
}

async function routeDirs(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter(e => e.isDirectory()).map(e => e.name);
}

async function checkPage(path, lang, switcherHref) {
  if (!existsSync(path)) {
    errors.push(`missing ${path}`);
    return;
  }
  const html = await readFile(path, 'utf8');
  if (!html.includes(`<html lang="${lang}"`)) errors.push(`${path}: expected lang="${lang}"`);
  if (!html.includes(`href="${switcherHref}"`)) errors.push(`${path}: no language switcher link to ${switcherHref}`);
}

const sitemap = existsSync(join(DIST, 'sitemap-0.xml')) ? await readFile(join(DIST, 'sitemap-0.xml'), 'utf8') : '';
let published = 0;

for (const type of TYPES) {
  const recs = await records(type);
  const publishedIds = recs.filter(r => r.published).map(r => r.id);
  for (const tree of [join(DIST, type), join(DIST, 'ar', type)]) {
    for (const dir of await routeDirs(tree)) {
      if (dir.endsWith('.ar')) errors.push(`unexpected Arabic-suffixed route ${join(tree, dir)}`);
      else if (!publishedIds.includes(dir)) errors.push(`page for unpublished or unknown record ${join(tree, dir)}`);
    }
  }
  for (const { id, published: isPublished } of recs) {
    if (isPublished) {
      published++;
      await checkPage(join(DIST, type, id, 'index.html'), 'en', `${BASE}ar/${type}/${id}/`);
      await checkPage(join(DIST, 'ar', type, id, 'index.html'), 'ar', `${BASE}${type}/${id}/`);
    } else if (sitemap.includes(`/${type}/${id}/`)) {
      errors.push(`sitemap lists unpublished record ${type}/${id}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} routing error(s)`);
  process.exit(1);
}
console.log(`Routes OK: ${published} published record(s), each with one English and one Arabic page; no unpublished pages.`);
