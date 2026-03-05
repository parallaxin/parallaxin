// scripts/check-sources.mjs
// Validates that all source URLs in content files are reachable
// Run: node scripts/check-sources.mjs

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const CONTENT_DIR = 'src/content';
const URL_REGEX = /url:\s*["']?(https?:\/\/[^\s"']+)/g;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter(e => e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.mdx')))
    .map(e => join(e.parentPath || e.path, e.name));
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
    return { url, status: res.status, ok: res.ok };
  } catch (e) {
    return { url, status: 0, ok: false, error: e.message };
  }
}

async function main() {
  const files = await getFiles(CONTENT_DIR);
  console.log(Checking sources in  content files...\n);
  
  let total = 0, broken = 0;
  
  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const urls = [...content.matchAll(URL_REGEX)].map(m => m[1]);
    
    for (const url of urls) {
      total++;
      const result = await checkUrl(url);
      if (!result.ok) {
        broken++;
        console.log(  BROKEN [] ${file});
        console.log(         ${url});
        if (result.error) console.log(         ${result.error});
      }
    }
  }
  
  console.log(\n${total} sources checked. ${broken} broken.);
  process.exit(broken > 0 ? 1 : 0);
}

main();
