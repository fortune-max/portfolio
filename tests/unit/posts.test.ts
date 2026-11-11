import { describe, it, expect } from 'vitest';
import { sortByDateDesc, splitArchive, visiblePosts, readingTime } from '../../src/lib/posts';

type Post = { id: string; data: { pubDate: Date; archive?: boolean; draft?: boolean } };
const p = (d: string, extra: { archive?: boolean; draft?: boolean } = {}): Post => ({ id: d, data: { pubDate: new Date(d), ...extra } });

describe('sortByDateDesc', () => {
  it('orders newest first', () => {
    const out = sortByDateDesc([p('2016-03-01'), p('2026-11-11'), p('2022-12-28')]);
    expect(out.map((x) => x.id)).toEqual(['2026-11-11', '2022-12-28', '2016-03-01']);
  });
  it('does not mutate the input', () => {
    const input = [p('2016-03-01'), p('2026-11-11')];
    sortByDateDesc(input);
    expect(input[0].id).toBe('2016-03-01');
  });
});

describe('splitArchive', () => {
  it('separates archive posts', () => {
    const { current, archive } = splitArchive([p('2026-01-01'), p('2016-01-01', { archive: true })]);
    expect(current.map((x) => x.id)).toEqual(['2026-01-01']);
    expect(archive.map((x) => x.id)).toEqual(['2016-01-01']);
  });
});

describe('visiblePosts', () => {
  const posts = [p('2026-01-01'), p('2026-02-01', { draft: true })];
  it('hides drafts in production', () => expect(visiblePosts(posts, true)).toHaveLength(1));
  it('shows drafts in dev', () => expect(visiblePosts(posts, false)).toHaveLength(2));
});

describe('readingTime', () => {
  it('is 2 minutes for 460 words', () => expect(readingTime('word '.repeat(460))).toBe(2));
  it('is at least 1 minute', () => expect(readingTime('')).toBe(1));
  it('ignores fenced code', () => {
    const code = '```ts\n' + 'token '.repeat(1000) + '\n```\n';
    expect(readingTime(code + 'word '.repeat(230))).toBe(1);
  });
});
