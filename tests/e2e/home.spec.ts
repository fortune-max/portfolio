import { test, expect } from '@playwright/test';

const ORDER = ['oneragtime-v2', 'mcp-server', 'ai-reports', 'thinclaw', 'cloudstation3'];

for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`first screen at ${vp.width}x${vp.height}`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto('/');
    for (const sel of ['h1', '[data-hero-headline]']) {
      const box = await page.locator(sel).boundingBox();
      expect(box, sel).not.toBeNull();
      expect(box!.y + box!.height, sel).toBeLessThanOrEqual(vp.height);
    }
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    const first = page.locator('[data-product]').first();
    await expect(first).toBeInViewport();
    await expect(first.locator('dd').first()).toBeInViewport();
  });
}

test('five products in order, linking to their pages, alternating tones', async ({ page }) => {
  await page.goto('/');
  const products = page.locator('[data-product]');
  await expect(products).toHaveCount(5);
  expect(await products.evaluateAll((els) => els.map((e) => e.getAttribute('data-product')))).toEqual(ORDER);
  for (const slug of ORDER) await expect(page.locator(`[data-product="${slug}"] a[href="/work/${slug}"]`).first()).toBeVisible();
  const tones = await products.evaluateAll((els) => els.map((e) => (e.className.includes('tone-dark') ? 'd' : 'l')));
  for (let i = 1; i < tones.length; i++) expect(tones[i]).not.toBe(tones[i - 1]);
});

test('awards and more rows', async ({ page }) => {
  await page.goto('/');
  const awards = page.locator('[data-awards] li');
  await expect(awards).toHaveCount(5);
  await expect(awards.first()).toContainText('1,000 TON');
  await expect(page.locator('[data-more] li')).toHaveCount(3);
});

test('no email address on the page', async ({ page }) => {
  await page.goto('/');
  expect(await page.content()).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
});

test('muted text on light bands is readable (AA)', async ({ page }) => {
  await page.goto('/');
  const ratio = await page.locator('.tone-light dt').first().evaluate((el) => {
    const rgb = (c: string) => {
      const n = c.match(/[\d.]+/g)!.slice(0, 3).map(Number);
      return c.startsWith('color(') ? n.map((v) => v * 255) : n; // color-mix() computes to color(srgb 0-1)
    };
    const lum = (c: number[]) => {
      const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    let n: Element | null = el; let bg = 'rgba(0, 0, 0, 0)';
    while (n && (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent')) { bg = getComputedStyle(n).backgroundColor; n = n.parentElement; }
    const [a, b] = [lum(rgb(getComputedStyle(el).color)), lum(rgb(bg))];
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  });
  expect(ratio).toBeGreaterThanOrEqual(4.5);
});
