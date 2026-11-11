import { test, expect } from '@playwright/test';

test('/blog lists current posts, then the 2016 archive', async ({ page }) => {
  const res = await page.goto('/blog');
  expect(res?.status()).toBe(200);
  const archive = page.locator('[data-archive]');
  await expect(archive.locator('h2')).toHaveText('Archive (2016)');
  await expect(archive.locator('li a')).toHaveCount(3);
});

test('archive post page renders with meta line and origin note', async ({ page }) => {
  await page.goto('/blog/2016-piano-tiles-bot');
  await expect(page.locator('main h1')).toHaveText('Python script that plays Piano Tiles');
  await expect(page.locator('main .meta')).toHaveText(/\d{4} · \d+ min read/);
  await expect(page.locator('main article')).toContainText('Originally published on slaycode.wordpress.com');
});

test('current posts show a TL;DR before the body and code scrolls inside its box', async ({ page, request }) => {
  await page.goto('/blog');
  const current = page.locator('[data-current] li a');
  const n = await current.count();
  test.skip(n === 0, 'no current posts yet');
  const href = await current.first().getAttribute('href');
  await page.goto(href!);
  await expect(page.locator('main [data-tldr]')).toBeVisible();
  const pre = page.locator('main article pre').first();
  if (await pre.count()) expect(await pre.evaluate((e) => getComputedStyle(e).overflowX)).toBe('auto');
});

test('rss.xml is valid XML with one item per current post', async ({ page, request }) => {
  const res = await request.get('/rss.xml');
  expect(res.headers()['content-type']).toContain('xml');
  const xml = await res.text();
  await page.goto('/blog');
  const current = await page.locator('[data-current] li a').count();
  const items = await page.evaluate((x) => {
    const doc = new DOMParser().parseFromString(x, 'application/xml');
    if (doc.querySelector('parsererror')) return -1;
    return doc.querySelectorAll('item').length;
  }, xml);
  expect(items).toBe(current);
});
