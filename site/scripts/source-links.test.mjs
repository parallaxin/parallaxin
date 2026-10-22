import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'node:http';
import { classify, checkUrl, collectLinks, archiveGaps, snapshotFromSave } from './source-links.mjs';

let server;
let base;

beforeAll(async () => {
  server = http.createServer((req, res) => {
    const code = { '/ok': 200, '/blocked': 403, '/missing': 404, '/no-head': req.method === 'HEAD' ? 405 : 200 }[req.url];
    if (req.url === '/slow') return setTimeout(() => res.end(), 2000);
    res.statusCode = code ?? 500;
    res.end();
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});

afterAll(() => {
  server.closeAllConnections();
  server.close();
});

describe('classify', () => {
  it('treats refused access as unverified, not valid', () => {
    expect(classify(200)).toBe('ok');
    expect(classify(403)).toBe('unverified');
    expect(classify(429)).toBe('unverified');
    expect(classify(404)).toBe('broken');
    expect(classify(500)).toBe('broken');
  });
});

describe('checkUrl against a local server', () => {
  it('reports 200, 403 and 404', async () => {
    expect((await checkUrl(`${base}/ok`)).result).toBe('ok');
    expect((await checkUrl(`${base}/blocked`)).result).toBe('unverified');
    expect((await checkUrl(`${base}/missing`)).result).toBe('broken');
  });

  it('retries with GET when HEAD is rejected', async () => {
    expect(await checkUrl(`${base}/no-head`)).toMatchObject({ status: 200, result: 'ok' });
  });

  it('reports a timeout as broken', async () => {
    expect(await checkUrl(`${base}/slow`, { timeout: 200 })).toMatchObject({ result: 'broken', error: 'timeout' });
  });
});

describe('collectLinks', () => {
  it('finds URL fields, archive links, and links inside source strings; skips markers', () => {
    const data = {
      the_claim: { source_url: 'https://a.example/claim', source_archive_url: '[ARCHIVE NEEDED]' },
      timeline: [{ sources: ['Reuters https://b.example/story, 2025', 'Interview notes'] }],
      evidence: [{ source_url: '[SOURCE NEEDED]', source_archive_url: 'https://web.archive.org/web/20260101000000/https://c.example' }],
    };
    expect(collectLinks(data).map(l => [l.url, l.kind])).toEqual([
      ['https://a.example/claim', 'source'],
      ['https://b.example/story', 'source'],
      ['https://web.archive.org/web/20260101000000/https://c.example', 'archive'],
    ]);
  });
});

describe('archives', () => {
  it('flags missing, marker and timestamp-less archive links', () => {
    const data = {
      a: { source_url: 'https://x.example/1' },
      b: { source_url: 'https://x.example/2', source_archive_url: '[ARCHIVE NEEDED]' },
      c: { source_url: 'https://x.example/3', source_archive_url: 'https://web.archive.org/web/https://x.example/3' },
      d: { source_url: 'https://x.example/4', source_archive_url: 'https://web.archive.org/web/20260101000000/https://x.example/4' },
      e: { source_url: '[SOURCE NEEDED]' },
    };
    expect(archiveGaps(data).map(g => g.path)).toEqual([['a'], ['b'], ['c']]);
  });

  it('builds a snapshot URL only from a timestamped save location', () => {
    expect(snapshotFromSave('https://x.example', '/web/20260301123456/https://x.example'))
      .toBe('https://web.archive.org/web/20260301123456/https://x.example');
    expect(snapshotFromSave('https://x.example', null)).toBeNull();
    expect(snapshotFromSave('https://x.example', '/web/https://x.example')).toBeNull();
  });
});
