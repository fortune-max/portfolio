import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import matter from 'gray-matter';

const POSTS = ['func-compiler-bugs', 'rewrite-without-big-bang', 'mcp-server-llms-dont-misuse', 'shipping-with-previews-and-agents'];
const load = (s: string) => {
  const raw = readFileSync(`src/content/blog/${s}.mdx`, 'utf8');
  return { raw, ...matter(raw) };
};
const proseWords = (body: string) =>
  body.replace(/```[\s\S]*?```/g, ' ').replace(/^import .*$/gm, ' ').split(/\s+/).filter(Boolean).length;

describe('launch posts', () => {
  for (const s of POSTS) {
    describe(s, () => {
      it('exists', () => expect(existsSync(`src/content/blog/${s}.mdx`)).toBe(true));
      it('is 600–1,500 words of prose', () => {
        const n = proseWords(load(s).content);
        expect(n).toBeGreaterThanOrEqual(600);
        expect(n).toBeLessThanOrEqual(1500);
      });
      it('has a code block', () => expect(load(s).content).toMatch(/```/));
      it('avoids forbidden wording', () => expect(load(s).raw).not.toMatch(/search index|single-?handed|\bsolo\b/i));
    });
  }
  it('at most one post uses the "What I\'d do differently" template', () => {
    expect(POSTS.filter((s) => /^## What I'd do differently/m.test(load(s).content)).length).toBeLessThanOrEqual(1);
  });
  it('FunC post leaks no wallet or transaction data', () => {
    expect(load('func-compiler-bugs').raw).not.toMatch(/\b[EU]Q[A-Za-z0-9_-]{40,}|tonviewer|tonscan/);
  });
});
