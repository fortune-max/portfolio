import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { sortByDateDesc, splitArchive, visiblePosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = sortByDateDesc(splitArchive(visiblePosts(await getCollection('blog'), import.meta.env.PROD)).current);
  return rss({
    title: 'Fortune Max-Eguakun',
    description: 'Notes on rewrites, LLM tooling, compilers and the occasional hack.',
    site: context.site!,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.description, pubDate: p.data.pubDate, link: `/blog/${p.id}` })),
  });
}
