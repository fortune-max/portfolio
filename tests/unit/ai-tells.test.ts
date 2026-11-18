import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

// Phrases that make copy read as machine-written. Keep the site free of them.
const TELLS = [
  /the general lesson/i, /headline lesson/i, /the trick (that|is)/i, /is a suggestion/i, /here's what/i,
  /here's the thing/i, /game[- ]changer/i, /\bdelve\b/i, /\bseamless(ly)?\b/i, /\brobust\b/i, /\bleverag(e|ing)\b/i,
  /end[- ]to[- ]end/i, /AI-native/i, /the best kind of/i, /that's the right failure mode/i, /no fluff/i,
  /boring to run/i,
];
const ALLOW_SLOGAN = new Set(['src/components/Hero.astro', 'src/pages/index.astro']);

function* files(dir: string): Generator<string> {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(astro|mdx|ts)$/.test(f)) yield p;
  }
}

describe('copy has no AI tells', () => {
  for (const file of files('src')) {
    it(file, () => {
      const text = readFileSync(file, 'utf8');
      for (const re of TELLS) {
        if (re.source === 'boring to run' && ALLOW_SLOGAN.has(file)) continue;
        expect(text, `${re}`).not.toMatch(re);
      }
    });
  }
});
