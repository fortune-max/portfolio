import { test, expect } from '@playwright/test';

test('/about tells the story and is linked from the header', async ({ page }) => {
  await page.goto('/');
  await page.locator('header a[href="/about"]').click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator('main h1')).toBeVisible();
  const text = await page.locator('main').innerText();
  for (const bit of ['14', 'San Andreas', 'Raspberry Pi', 'Bank of America', 'OneRagtime']) expect(text).toContain(bit);
});
