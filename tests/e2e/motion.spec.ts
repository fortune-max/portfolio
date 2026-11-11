import { test, expect } from '@playwright/test';

test('reduced motion: nothing animates and headings are fully visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
  expect(running).toBe(0);
  const opacities = await page.locator('h1, h2').evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(opacities.length).toBeGreaterThan(0);
  for (const o of opacities) expect(o).toBe('1');
});

test('base layout: header, footer and SEO tags', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header a[href="/contact"]')).toContainText('Say hi');
  await expect(page.locator('footer a[href="https://github.com/fortune-max"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://fme.dev/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/default\.png$/);
});
