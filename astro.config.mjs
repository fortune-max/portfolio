// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';

// E2E builds use the Node adapter because @astrojs/vercel can't run `astro preview`.
const e2e = process.env.E2E === '1';

export default defineConfig({
  site: 'https://fme.dev',
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],
  adapter: e2e ? node({ mode: 'standalone' }) : vercel(),
});
