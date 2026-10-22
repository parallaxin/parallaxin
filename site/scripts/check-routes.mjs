// Checks the built site (dist/) for language routing:
// - every record has exactly one English page and one Arabic page
// - no `.ar` record pages exist under any route
// - each page declares its language and its switcher links to the counterpart
// Run after `npm run build`.
import { readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const BASE = '/parallaxin/';
const DIST = 'dist';
const TYPES = ['autopsies', 'actors', 'conflicts'];

const errors = [];

async function recordIds(type) {
  const files = await readdir(join('src/content', type));
  return [...new Set(files.filter(f => /\.mdx?$/.test(f)).map(f => f.replace(/(\.ar)?\.mdx?$/, '')))];
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

for (const type of TYPES) {
  const ids = await recordIds(type);
  for (const tree of [join(DIST, type), join(DIST, 'ar', type)]) {
    for (const dir of await routeDirs(tree)) {
      if (dir.endsWith('.ar')) errors.push(`unexpected Arabic-suffixed route ${join(tree, dir)}`);
      else if (!ids.includes(dir)) errors.push(`route with no record ${join(tree, dir)}`);
    }
  }
  for (const id of ids) {
    await checkPage(join(DIST, type, id, 'index.html'), 'en', `${BASE}ar/${type}/${id}/`);
    await checkPage(join(DIST, 'ar', type, id, 'index.html'), 'ar', `${BASE}${type}/${id}/`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} routing error(s)`);
  process.exit(1);
}
console.log('Routes OK: one English and one Arabic page per record.');
