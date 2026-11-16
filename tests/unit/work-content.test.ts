import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import matter from 'gray-matter';

const SLUGS = ['oneragtime-v2', 'mcp-server', 'ai-reports', 'thinclaw', 'cloudstation3'];
const ONERAGTIME = ['oneragtime-v2', 'mcp-server', 'ai-reports'];
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
      it('has at least three sections', () => {
        const heads = [...load(slug).content.matchAll(/^## (.+)$/gm)];
        expect(heads.length).toBeGreaterThanOrEqual(3);
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

  it('pages do not all share one template: no two have the same section headings', () => {
    const shapes = SLUGS.map((s) => [...load(s).content.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim()).join('|'));
    expect(new Set(shapes).size).toBe(SLUGS.length);
  });

  it('only one product headline uses a strikethrough', () => {
    expect(SLUGS.filter((s) => load(s).data.strike).length).toBeLessThanOrEqual(1);
  });

  it('ThinClaw links only to the showcase repo', () => {
    const urls = load('thinclaw').raw.match(/https?:\/\/[^\s()\[\]"'>]+/g) ?? [];
    expect(urls.every((u) => u === SHOWCASE)).toBe(true);
    expect(urls.length).toBeGreaterThan(0);
  });

  it('OneRagtime pages never say solo or single-handedly', () => {
    for (const s of ONERAGTIME) expect(load(s).raw, s).not.toMatch(/single-?handed|\bsolo\b/i);
  });
});
