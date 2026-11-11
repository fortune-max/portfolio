import { test, expect } from '@playwright/test';

const PAGES: Record<string, string> = {
  'oneragtime-v2': 'OneRagtime v2',
  'mcp-server': 'MCP server',
  'ai-reports': 'AI reporting pipeline',
  thinclaw: 'ThinClaw',
  cloudstation3: 'CloudStation3',
};
const H2 = ['The problem', 'What I built', 'How it works', 'The hard parts', 'Numbers', 'Stack'];

for (const [slug, title] of Object.entries(PAGES)) {
  test(`/work/${slug} renders the template`, async ({ page }) => {
    const res = await page.goto(`/work/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveText(title);
    expect(await page.locator('main article h2').allTextContents()).toEqual(H2);
    await expect(page.locator('main svg[role="img"]')).toHaveCount(1);
    expect(await page.locator('main .pill').count()).toBeGreaterThan(0);
    await expect(page.locator('main a[href="/#work"]').first()).toContainText('All work');
  });
}

test('ThinClaw links out only to the showcase repo', async ({ page }) => {
  await page.goto('/work/thinclaw');
  const ext = await page.locator('main a[href^="http"]').evaluateAll((as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).href))]);
  expect(ext).toEqual(['https://github.com/fortune-max/thinclaw-showcase']);
});
