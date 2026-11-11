import { test, expect } from '@playwright/test';

const valid = { name: 'Ada', email: 'ada@example.com', message: 'Hello there, nice site!' };
// Each test uses its own client IP so the in-memory rate limiter doesn't leak between tests.
const ip = (n: number) => ({ 'x-forwarded-for': `10.0.0.${n}` });

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('form posts natively and lands on the thanks state', async ({ page }) => {
    await page.goto('/contact');
    await page.fill('input[name=name]', valid.name);
    await page.fill('input[name=email]', valid.email);
    await page.fill('textarea[name=message]', valid.message);
    await page.click('button[type=submit]');
    await expect(page).toHaveURL(/\/contact\?sent=1$/);
    await expect(page.locator('main')).toContainText('Thanks');
  });
});

test('with JavaScript, shows inline thanks without leaving the page', async ({ page }) => {
  await page.goto('/contact');
  await page.fill('input[name=name]', valid.name);
  await page.fill('input[name=email]', valid.email);
  await page.fill('textarea[name=message]', valid.message);
  await page.click('button[type=submit]');
  await expect(page.locator('[data-status]')).toContainText('Thanks');
  await expect(page).toHaveURL(/\/contact$/);
});

test('JSON: valid → 200', async ({ request }) => {
  const r = await request.post('/api/contact', { data: valid, headers: ip(1) });
  expect(r.status()).toBe(200);
  expect(await r.json()).toEqual({ ok: true });
});

test('JSON: 50 KB message → 400', async ({ request }) => {
  const r = await request.post('/api/contact', { data: { ...valid, message: 'x'.repeat(50_000) }, headers: ip(2) });
  expect(r.status()).toBe(400);
  expect((await r.json()).errors).toHaveProperty('message');
});

test('JSON: malformed body → 400', async ({ request }) => {
  const r = await request.post('/api/contact', { data: '{not json', headers: { ...ip(3), 'content-type': 'application/json' } });
  expect(r.status()).toBe(400);
});

test('JSON: header injection in name → 400', async ({ request }) => {
  const r = await request.post('/api/contact', { data: { ...valid, name: 'a\nBcc: x@y.com' }, headers: ip(4) });
  expect(r.status()).toBe(400);
});

test('honeypot gets a fake success', async ({ request }) => {
  const r = await request.post('/api/contact', { data: { ...valid, website: 'http://spam' }, headers: ip(5) });
  expect(r.status()).toBe(200);
  expect(await r.json()).toEqual({ ok: true });
});

test('rate limit: 6th request from one IP → 429', async ({ request }) => {
  for (let i = 0; i < 5; i++) expect((await request.post('/api/contact', { data: valid, headers: ip(6) })).status()).toBe(200);
  expect((await request.post('/api/contact', { data: valid, headers: ip(6) })).status()).toBe(429);
});

test('unsupported content type → 415', async ({ request }) => {
  const r = await request.post('/api/contact', { data: 'hi', headers: { ...ip(7), 'content-type': 'text/plain' } });
  expect(r.status()).toBe(415);
});

test('contact page source contains no email address', async ({ request }) => {
  const html = await (await request.get('/contact')).text();
  expect(html).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
});
