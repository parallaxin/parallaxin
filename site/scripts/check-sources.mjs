import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import YAML from 'yaml';

const CONTENT_DIR = 'src/content';
const FIX_MODE = process.argv.includes('--fix');

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter(e => e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.mdx')))
    .map(e => join(e.parentPath || e.path, e.name));
}

async function checkUrl(url) {
  if (url.startsWith('[SOURCE NEEDED]')) return { ok: false, skip: true, reason: 'Marker: [SOURCE NEEDED]' };
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' };
  try {
    const res = await fetch(url, { method: 'HEAD', headers, signal: AbortSignal.timeout(5000) });
    return { url, status: res.status, ok: res.ok || res.status === 403 }; // Treat 403 as 'likely exists but blocked'
  } catch (e) {
    try {
      const res = await fetch(url, { method: 'GET', headers, signal: AbortSignal.timeout(5000) });
      return { url, status: res.status, ok: res.ok || res.status === 403 };
    } catch (e2) {
      return { url, status: 0, ok: false, error: e2.message };
    }
  }
}

async function archiveUrl(url) {
  console.log(`  > Archiving: ${url}...`);
  try {
    const saveUrl = `https://web.archive.org/save/${url}`;
    const res = await fetch(saveUrl, {
      signal: AbortSignal.timeout(30000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    console.log(`    Save Status: ${res.status}`);
    if (res.ok || res.status === 302) {
      const machineId = res.headers.get('x-app-server') || res.headers.get('server') || 'unknown';
      const location = res.headers.get('location') || '';
      const timestampMatch = location.match(/\/web\/(\d+)\//);
      const timestamp = timestampMatch ? timestampMatch[1] : (res.headers.get('x-archive-orig-date') || 'unknown');
      console.log(`    Archived OK: ${machineId} (ID: ${timestamp})`);
      return {
        archiveUrl: `https://web.archive.org/web/${url}`,
        machineId,
        timestamp
      };
    }
    console.log(`    Archive failed with status: ${res.status}`);
    return null;
  } catch (e) {
    console.error(`  !! Archive failed: ${e.message}`);
    return null;
  }
}

function collectUrls(obj, path = '') {
  let results = [];
  if (!obj || typeof obj !== 'object') return results;

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      results = results.concat(collectUrls(item, `${path}[${i}]`));
    });
    return results;
  }

  for (const key in obj) {
    if (key === 'source_url' || (key.endsWith('_url') && !key.includes('archive'))) {
      const archiveKey = key === 'source_url' ? 'source_archive_url' : key.replace('_url', '_archive_url');
      const machineKey = key === 'source_url' ? 'source_archive_machine_id' : key.replace('_url', '_archive_machine_id');
      const idKey = key === 'source_url' ? 'source_archive_id' : key.replace('_url', '_archive_id');
      results.push({
        key,
        archiveKey: obj[archiveKey] !== undefined ? archiveKey : null,
        machineKey: machineKey,
        idKey: idKey,
        url: obj[key],
        archiveUrl: obj[archiveKey],
        parent: obj
      });
    } else if (typeof obj[key] === 'object') {
      results = results.concat(collectUrls(obj[key], `${path}.${key}`));
    }
  }
  return results;
}

async function main() {
  const files = await getFiles(CONTENT_DIR);
  console.log(`\nPARALLAXIN SOURCE CHECKER (Mode: ${FIX_MODE ? 'FIX/ARCHIVE' : 'REPORT'})\n`);

  let globalStats = { total: 0, ok: 0, broken: 0, missingArchive: 0, missingSource: 0, archived: 0 };

  for (const file of files) {
    const rawContent = await readFile(file, 'utf-8');
    const parts = rawContent.split('---');
    if (parts.length < 3) continue;

    let frontmatter;
    try {
      frontmatter = YAML.parse(parts[1]);
    } catch (e) {
      console.error(`  !! YAML Parse Error in ${file}: ${e.message}`);
      continue;
    }
    const items = collectUrls(frontmatter);

    if (items.length === 0) continue;

    console.log(`\nFile: ${file}`);
    let fileChanged = false;

    for (const item of items) {
      if (!item.url || typeof item.url !== 'string') continue;

      if (item.url.startsWith('[SOURCE NEEDED]')) {
        console.log(`  [MISSING] ${item.key}: Source needed`);
        globalStats.missingSource++;
        continue;
      }

      globalStats.total++;
      const check = await checkUrl(item.url);

      if (check.ok) {
        globalStats.ok++;
        const archiveNeeded = !item.archiveUrl || item.archiveUrl.includes('NEEDED');

        if (archiveNeeded) {
          console.log(`  [OK/UNC]  ${item.url} -> Archive needed (Status: ${check.status})`);
          globalStats.missingArchive++;

          if (FIX_MODE) {
            const archiveInfo = await archiveUrl(item.url);
            if (archiveInfo && item.archiveKey) {
              item.parent[item.archiveKey] = archiveInfo.archiveUrl;
              if (item.machineKey) item.parent[item.machineKey] = archiveInfo.machineId;
              if (item.idKey) item.parent[item.idKey] = archiveInfo.timestamp;
              fileChanged = true;
              globalStats.archived++;
              console.log(`  [FIXED]   Archived to wayback (Machine: ${archiveInfo.machineId})`);
              await new Promise(r => setTimeout(r, 15000)); // sleep to avoid rate limits
            }
          }
        } else {
          console.log(`  [OK]      ${item.url}`);
        }
      } else {
        globalStats.broken++;
        console.log(`  [BROKEN]  ${item.url} (${check.status || check.error})`);
      }
    }

    if (fileChanged && FIX_MODE) {
      const newContent = `---\n${YAML.stringify(frontmatter)}---\n${parts.slice(2).join('---')}`;
      await writeFile(file, newContent, 'utf-8');
      console.log(`  [SAVED]   File updated with archive URLs.`);
    }
  }

  console.log(`\n--- FINAL REPORT ---`);
  console.log(`Total URLs:      ${globalStats.total}`);
  console.log(`Valid:           ${globalStats.ok}`);
  console.log(`Broken:          ${globalStats.broken}`);
  console.log(`Missing Archive: ${globalStats.missingArchive}`);
  console.log(`[SOURCE NEEDED]: ${globalStats.missingSource}`);
  if (FIX_MODE) {
    console.log(`Auto-Archived:   ${globalStats.archived}`);
  }
  console.log(`--------------------\n`);

  if (globalStats.broken > 0) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
