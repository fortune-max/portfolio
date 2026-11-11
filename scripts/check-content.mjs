#!/usr/bin/env node
// Scans built HTML/XML for content that must never ship (spec §5).
// Usage: node scripts/check-content.mjs dist   (env DENYLIST_FILE, default ../blog/denylist.txt)
// The private denylist lives outside this public repo; hits are reported as file:line only.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const GENERIC_PATTERNS = [
  { id: 'email', re: /[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}\b/gi },
  { id: 'single-handed', re: /single-?handed/gi },
  { id: 'search-index-story', re: /search index/gi },
  { id: 'thinclaw-host', re: /\bthinclaw\.dev\b/gi },
  { id: 'ton-wallet', re: /\b[EU]Q[A-Za-z0-9_-]{46}\b/g },
];

export function parseDenylist(text) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((term, i) => ({ id: `denylist#${i + 1}`, re: new RegExp(`(?<![\\w-])${escape(term)}(?![\\w-])`, 'gi') }));
}

/** Returns [{ id, line }] for every match. Never returns the matched text. */
export function findHits(text, patterns) {
  const hits = [];
  const lines = text.split('\n');
  for (const { id, re } of patterns) {
    lines.forEach((l, i) => {
      re.lastIndex = 0;
      if (re.test(l)) hits.push({ id, line: i + 1 });
    });
  }
  return hits;
}

function* walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(html|xml)$/.test(f)) yield p;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const dir = process.argv[2] ?? 'dist';
  const denyFile = process.env.DENYLIST_FILE ?? '../blog/denylist.txt';
  const patterns = [...GENERIC_PATTERNS];
  if (existsSync(denyFile)) patterns.push(...parseDenylist(readFileSync(denyFile, 'utf8')));
  else console.warn('check-content: no denylist file found; running generic patterns only');
  let total = 0;
  for (const file of walk(dir)) {
    for (const h of findHits(readFileSync(file, 'utf8'), patterns)) {
      console.log(`${path.relative(dir, file)}:${h.line} ${h.id}`);
      total++;
    }
  }
  console.log(total ? `check-content: ${total} hit(s)` : 'check-content: clean');
  process.exit(total ? 1 : 0);
}
