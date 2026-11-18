import { test, expect } from '@playwright/test';

test('about page shows the portrait, the chess photo and the Barcelona banner', async ({ page }) => {
  await page.goto('/about');
  const imgs = page.locator('main img');
  await expect(imgs).toHaveCount(3);
  for (const i of [0, 1, 2]) {
    const img = imgs.nth(i);
    await img.scrollIntoViewIfNeeded();
    expect((await img.getAttribute('alt'))?.length ?? 0).toBeGreaterThan(10);
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  await expect(page.locator('figure.banner figcaption')).toContainText('Barcelona');
});
