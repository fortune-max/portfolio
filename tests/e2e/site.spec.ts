import { test, expect } from '@playwright/test';

test('/cv offers the PDF, which is a real 2-page PDF', async ({ page, request }) => {
  await page.goto('/cv');
  await expect(page.locator('main a[href="/cv/Fortune-Max-Eguakun-CV.pdf"][download]').first()).toBeVisible();
  const res = await request.get('/cv/Fortune-Max-Eguakun-CV.pdf');
  expect(res.headers()['content-type']).toContain('application/pdf');
  const buf = await res.body();
  expect(buf.subarray(0, 4).toString()).toBe('%PDF');
  expect((buf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length).toBe(2);
});

for (const path of ['/work/nope', '/blog/nope', '/notes']) {
  test(`${path} is a styled 404`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(404);
    await expect(page.locator('header a[href="/contact"]')).toBeVisible();
  });
}

test('no page scrolls horizontally at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  const paths = ['/', '/blog', '/cv', '/contact'];
  await page.goto('/');
  paths.push(...(await page.locator('a[href^="/work/"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')!))])));
  await page.goto('/blog');
  paths.push(...(await page.locator('main a[href^="/blog/"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')!))])));
  for (const p of paths) {
    await page.goto(p);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(over, p).toBeLessThanOrEqual(0);
  }
});

test('sitemap, canonical and og:image on every page', async ({ page, request }) => {
  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
  for (const p of ['/', '/blog', '/cv', '/contact', '/work/oneragtime-v2', '/blog/func-compiler-bugs']) {
    await page.goto(p);
    await expect(page.locator('link[rel=canonical]'), p).toHaveAttribute('href', /^https:\/\/fme\.dev\//);
    await expect(page.locator('meta[property="og:image"]'), p).toHaveAttribute('content', /^https:\/\/fme\.dev\/og\//);
  }
});
