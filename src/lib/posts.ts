type Dated = { data: { pubDate: Date } };
type Archivable = { data: { archive?: boolean } };
type Draftable = { data: { draft?: boolean } };

export function sortByDateDesc<T extends Dated>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function splitArchive<T extends Archivable>(posts: T[]): { current: T[]; archive: T[] } {
  return {
    current: posts.filter((p) => !p.data.archive),
    archive: posts.filter((p) => p.data.archive),
  };
}

export function visiblePosts<T extends Draftable>(posts: T[], isProd: boolean): T[] {
  return isProd ? posts.filter((p) => !p.data.draft) : posts;
}

const WPM = 230;

/** Whole minutes at 230 wpm, minimum 1, ignoring fenced code blocks. */
export function readingTime(text: string): number {
  const prose = text.replace(/```[\s\S]*?```/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}
