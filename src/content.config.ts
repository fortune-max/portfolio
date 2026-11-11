import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int().positive(),
    label: z.string(),
    headline: z.string(),
    strike: z.string().optional(),
    summary: z.string(),
    role: z.string(),
    period: z.string(),
    stack: z.array(z.string()).min(1),
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).min(2).max(4),
    links: z.array(z.object({ label: z.string(), href: z.url() })).optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tldr: z.string(),
    pubDate: z.coerce.date(),
    archive: z.boolean().default(false),
    originalUrl: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, blog };
