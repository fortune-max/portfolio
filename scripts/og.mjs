// Renders public/og/default.png (1200×630) with Playwright. Run: node scripts/og.mjs
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
// Inline as data URLs: setContent pages can't load file:// fonts.
const font = (p) => `data:font/woff2;base64,${readFileSync(path.join(root, 'node_modules', p)).toString('base64')}`;

const html = `<!doctype html><html><head><style>
@font-face { font-family: F; src: url(${font('@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2')}) format('woff2-variations'); font-weight: 100 900; }
@font-face { font-family: M; src: url(${font('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2')}); }
body { margin:0; width:1200px; height:630px; background:#0d0f0e; color:#f4f4f0; font-family:F; display:flex; flex-direction:column; justify-content:space-between; padding:64px 72px; box-sizing:border-box; }
.m { font-family:M; font-size:22px; letter-spacing:.14em; opacity:.75; display:flex; justify-content:space-between; }
h1 { font-weight:900; font-size:92px; line-height:1.0; margin:0; letter-spacing:-.01em; }
em { color:#b6f23a; font-style:normal; }
</style></head><body>
<div class="m"><span>FORTUNE MAX-EGUAKUN</span><span>FME.DEV</span></div>
<h1>I make messy,<br>live systems<br><em>boring to run.</em></h1>
<div class="m"><span>SENIOR FULL-STACK ENGINEER · BARCELONA</span></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(root, 'public/og/default.png') });
await browser.close();
console.log('wrote public/og/default.png');
