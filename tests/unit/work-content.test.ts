import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import matter from 'gray-matter';

const SLUGS = ['oneragtime-v2', 'mcp-server', 'ai-reports', 'thinclaw', 'cloudstation3'];
const ONERAGTIME = ['oneragtime-v2', 'mcp-server', 'ai-reports'];
const H2 = ['The problem', 'What I built', 'How it works', 'The hard parts', 'Numbers', 'Stack'];
const SHOWCASE = 'https://github.com/fortune-max/thinclaw-showcase';

const load = (slug: string) => {
  const path = `src/content/work/${slug}.mdx`;
  const raw = readFileSync(path, 'utf8');
  return { raw, ...matter(raw) };
};

describe('work content', () => {
  it('has all five product files', () => {
    for (const s of SLUGS) expect(existsSync(`src/content/work/${s}.mdx`), s).toBe(true);
  });

  it('orders products 1..5 in spec order', () => {
    expect(SLUGS.map((s) => load(s).data.order)).toEqual([1, 2, 3, 4, 5]);
  });

  for (const slug of SLUGS) {
    describe(slug, () => {
      it('has the six sections in order', () => {
        const heads = [...load(slug).content.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
        expect(heads).toEqual(H2);
      });
      it('has 2–4 hard parts', () => {
        const body = load(slug).content;
        const hard = body.split('## The hard parts')[1].split('## Numbers')[0];
        const n = (hard.match(/^### /gm) ?? []).length;
        expect(n).toBeGreaterThanOrEqual(2);
        expect(n).toBeLessThanOrEqual(4);
      });
      it('has 2–4 metrics', () => {
        const m = load(slug).data.metrics;
        expect(m.length).toBeGreaterThanOrEqual(2);
        expect(m.length).toBeLessThanOrEqual(4);
      });
      it('never mentions the search-index story', () => {
        expect(load(slug).raw).not.toMatch(/search index/i);
      });
    });
  }

  it('ThinClaw links only to the showcase repo', () => {
    const urls = load('thinclaw').raw.match(/https?:\/\/[^\s()\[\]"'>]+/g) ?? [];
    expect(urls.every((u) => u === SHOWCASE)).toBe(true);
    expect(urls.length).toBeGreaterThan(0);
  });

  it('OneRagtime pages never say solo or single-handedly', () => {
    for (const s of ONERAGTIME) expect(load(s).raw, s).not.toMatch(/single-?handed|\bsolo\b/i);
  });
});
