// Renders the General CV (../cv/cv-general.html) to public/cv/Fortune-Max-Eguakun-CV.pdf. Run: npm run cv
import { chromium } from '@playwright/test';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.resolve(root, process.env.CV_SOURCE ?? '../cv/cv-general.html');
const out = path.join(root, 'public/cv/Fortune-Max-Eguakun-CV.pdf');
mkdirSync(path.dirname(out), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle' });
// Public variant: this PDF ships in a public repo and site, so phone and email are swapped for the contact form.
const leaks = await page.evaluate(() => {
  document.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
    a.setAttribute('href', 'https://fme.dev/contact');
    a.textContent = 'fme.dev/contact';
  });
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    n.nodeValue = n.nodeValue.replace(/\s*·?\s*\+\d[\d\s]{7,}\d\s*·?/g, ' · ');
  }
  const text = document.body.innerText;
  return { email: /[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(text), phone: /\+\d[\d\s]{7,}\d/.test(text) };
});
if (leaks.email || leaks.phone) throw new Error(`public CV still contains contact details: ${JSON.stringify(leaks)}`);
await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`wrote ${path.relative(root, out)}`);
