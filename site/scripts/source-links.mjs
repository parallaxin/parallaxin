// Network checks for source and archive links. Reachability only:
// a page that loads does not prove that it supports the claim.

import { isWayback } from './evidence-rules.mjs';

const USER_AGENT ='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const MARKER = /\[(SOURCE|ARCHIVE) NEEDED[^\]]*\]/;
const URL_IN_TEXT = /https?:\/\/[^\s\]"'<>]+/g;
const WAYBACK_SNAPSHOT = /^https:\/\/web\.archive\.org\/web\/\d{14}\//;

/**
 * ok: the server returned the page (2xx after redirects)
 * unverified: the server refused automated access (401, 403, 429); check by hand
 * broken: not found, server error, or no response
 */
export function classify(status) {
  if (status >= 200 && status < 400) return 'ok';
  if (status === 401 || status === 403 || status === 429) return 'unverified';
  return 'broken';
}

export async function checkUrl(url, { timeout = 10000, fetchImpl = fetch } = {}) {
  const attempt = async (method) => {
    const res = await fetchImpl(url, { method, redirect: 'follow', headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(timeout) });
    return res.status;
  };
  let status;
  try {
    status = await attempt('HEAD');
    // Some servers reject HEAD; retry with GET before judging the link.
    if (classify(status) !== 'ok') status = await attempt('GET');
  } catch {
    try {
      status = await attempt('GET');
    } catch (e) {
      return { url, status: 0, result: 'broken', error: e.name === 'TimeoutError' ? 'timeout' : e.message };
    }
  }
  return { url, status, result: classify(status) };
}

function walk(value, path, visit) {
  if (Array.isArray(value)) value.forEach((v, i) => walk(v, [...path, i], visit));
  else if (value && typeof value === 'object') {
    visit(value, path);
    for (const [k, v] of Object.entries(value)) walk(v, [...path, k], visit);
  }
}

export function pathLabel(path) {
  return path.map((p, i) => (typeof p === 'number' ? `[${p}]` : i ? `.${p}` : p)).join('');
}

/** Every checkable link in a record's front matter: [{ path, url, kind }]. */
export function collectLinks(data) {
  const links = [];
  walk(data, [], (obj, path) => {
    for (const [key, value] of Object.entries(obj)) {
      if ((key.endsWith('_url') || key === 'contest_thread') && typeof value === 'string' && value.trim() && !MARKER.test(value)) {
        links.push({ path: [...path, key], url: value.trim(), kind: key.includes('archive') ? 'archive' : 'source' });
      }
      if (key === 'sources' && Array.isArray(value)) {
        value.forEach((text, i) => {
          if (typeof text !== 'string') return;
          for (const url of text.match(URL_IN_TEXT) ?? []) {
            links.push({ path: [...path, key, i], url: url.replace(/[.,;)]+$/, ''), kind: 'source' });
          }
        });
      }
    }
  });
  return links;
}

/** Objects whose source_url has no usable archive snapshot: [{ path, url }]. */
export function archiveGaps(data) {
  const gaps = [];
  walk(data, [], (obj, path) => {
    const url = obj.source_url;
    if (typeof url !== 'string' || !/^https?:\/\//.test(url)) return;
    const archive = obj.source_archive_url;
    const usable = typeof archive === 'string' && /^https?:\/\//.test(archive)
      && (!isWayback(archive) || WAYBACK_SNAPSHOT.test(archive));
    if (!usable) gaps.push({ path, url });
  });
  return gaps;
}

/** Snapshot URL from a Wayback save response, or null when it names no snapshot. */
export function snapshotFromSave(url, location) {
  const ts = location?.match(/\/web\/(\d{14})\//)?.[1];
  return ts ? `https://web.archive.org/web/${ts}/${url}` : null;
}

/**
 * Asks the Wayback Machine to save `url`, then confirms the snapshot loads.
 * Returns the snapshot URL, or null. A save response alone is not proof.
 */
export async function archiveUrl(url, { fetchImpl = fetch } = {}) {
  const res = await fetchImpl(`https://web.archive.org/save/${url}`, {
    redirect: 'manual',
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(60000),
  });
  const snapshot = snapshotFromSave(url, res.headers.get('location') ?? res.headers.get('content-location'));
  if (!snapshot) return null;
  const check = await checkUrl(snapshot, { timeout: 30000, fetchImpl });
  return check.result === 'ok' ? snapshot : null;
}
