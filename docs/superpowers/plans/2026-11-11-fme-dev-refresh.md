# fme.dev Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild fme.dev in place as an Astro + MDX site: an editorial, dark-first home page of shipped products, five product deep dives, a blog with three launch posts and a 2016 archive, a CV download and a contact form. The goal is for a recruiter to read "senior engineer who ships real products" in 30 seconds.

**Architecture:** Astro 7 static site. Content lives in typed content collections (`work`, `blog`) as MDX in the repo. Only `/api/contact` is server-rendered (`export const prerender = false`, `@astrojs/vercel` adapter). Styling is plain CSS with design tokens as custom properties. Fonts are self-hosted via Fontsource. Unit tests use Vitest and end-to-end tests run Playwright against `astro preview`.

**Tech Stack:** astro@7, @astrojs/mdx@8, @astrojs/vercel@11, @astrojs/rss@4, @astrojs/sitemap@3, @astrojs/check, @vercel/analytics, resend@6, @fontsource-variable/fraunces, @fontsource/jetbrains-mono, vitest@5, @playwright/test. Node 24.

**Spec:** `docs/superpowers/specs/2026-11-11-fme-dev-refresh-design.md` (read it before any task; the reference mockup is `docs/superpowers/specs/assets/2026-11-11-direction-mockups.html`, option 1).

**Astro version note:** Astro 7 is newer than some training data. Before Task 1, read the installed docs (`node_modules/astro/README.md` and https://docs.astro.build) for the content-collections API (`src/content.config.ts`, `glob` loader, `render()`) and on-demand routes (`prerender = false`). Where this plan names an API and the installed version differs, follow the installed version and note the change in the commit message.

## Global Constraints

- All work is on branch `fme-refresh`. **Never push, deploy or open a PR without Fortune's explicit go-ahead in chat.** The repo is public, so pushing publishes drafts. Production (fme.dev) changes only after Fortune approves the preview (spec §8b).
- Colours: dark `#0d0f0e`, light `#f4f4f0`, accent on dark `#b6f23a`, accent on light `#3c7a00` (adjust darker only if the contrast test fails). No other accent colour.
- Fonts: Fraunces (display, weight 900), JetBrains Mono (all small text: nav, labels, metrics, pills, captions). Blog body about 18px, measure 65–75ch.
- No loader, no scroll-jacking, no content hidden until an animation or JS runs. Respect `prefers-reduced-motion`. No theme toggle. No terminal UI. No skill bars. No photo gallery.
- Responsive from 360px wide with no horizontal scroll.
- No email address anywhere in the repo or the built site. Contact goes through `/contact` only.
- Content rules (spec §5), verbatim: no OneRagtime fund names, client/LP names, colleague names, exact costs, internal hostnames or internal screenshots; rounded numbers and percentages only; don't describe the company's internal problems or bugs. Role wording is "proposed, led and built", never "single-handedly" or "solo" for OneRagtime work. ThinClaw: principles only, no URLs except https://github.com/fortune-max/thinclaw-showcase. The secondary-market feature is not presented as used. Light-Seeking Turtle and Pursuit Graph are not featured. The "search index used 0 times" story appears nowhere.
- Sources for copy: `../research/findings.md`, `../blog/IDEAS.md`, `../cv/build.py`, `../github/thinclaw-showcase/README.md` (paths relative to the repo root). Never copy wallet addresses, transaction links or the bounty chat text.
- Commits end with the attribution line from the session's system reminder.

## Review Focus

1. **JavaScript disabled:** every page's content is visible, and the contact form still submits (plain POST, then a redirect to `/contact?sent=1`). Test in Task 9.
2. **360px phone width:** no page scrolls horizontally, including long code blocks in posts, which scroll inside their own box. Test in Task 10.
3. **Hostile contact input:** malformed JSON or form bodies, missing fields, a 50 KB message, and newlines in the name or email (header injection) return 400 with an error and never 500. The honeypot returns a fake success. Tests in Task 9.
4. **Unknown routes:** `/work/nope`, `/blog/nope` and the old `/notes` return the styled 404 page with status 404. Test in Task 10.
5. **Reduced motion:** with `prefers-reduced-motion: reduce`, no element has a running animation or transition on load. Test in Task 2.

---

### Task 1: Replace Remix with an Astro skeleton

**Files:**
- Delete: `app/`, `remix.config.js`, `remix.env.d.ts`, `codegen.ts`, `declarations.d.ts`, `tailwind.config.js`, `package-lock.json`
- Rewrite: `package.json`, `tsconfig.json`, `README.md`, `.gitignore`
- Create: `astro.config.mjs`, `src/pages/index.astro` (placeholder), `vitest.config.ts`, `playwright.config.ts`, `tests/e2e/smoke.spec.ts`, `tests/unit/.gitkeep`
- Keep: `public/favicon.ico`, `docs/`

**Interfaces:**
- Produces: npm scripts `dev`, `build` (`astro check && astro build`), `preview`, `test` (vitest run), `test:e2e` (playwright test), `check:content` (Task 10). Playwright `webServer` runs `npm run build && npm run preview -- --port 4321`, with `baseURL` `http://localhost:4321`.

- [ ] **Step 1:** `git checkout -b fme-refresh`, then delete the Remix files listed above.
- [ ] **Step 2:** Install the Tech Stack packages at the versions above. Configure `astro.config.mjs` with `site: 'https://fme.dev'`, integrations `mdx()` and `sitemap()`, and `adapter: vercel()` (static output by default). Add Playwright Chromium (`npx playwright install chromium`).
- [ ] **Step 3: Write the failing smoke test** in `tests/e2e/smoke.spec.ts`: `test('home responds', ...)` expects `page.goto('/')` to return status 200 and `page.locator('h1')` to have count 1.
- [ ] **Step 4:** Run `npm run test:e2e`. Expected: FAIL (no h1 yet, or the build fails).
- [ ] **Step 5:** Make `src/pages/index.astro` render `<h1>Fortune Max-Eguakun</h1>`. Rewrite `README.md` (what the site is, `npm run dev`, how to add a post, where the CV PDF comes from, the env vars from Task 9).
- [ ] **Step 6:** Run `npm run build && npm run test:e2e`. Expected: PASS.
- [ ] **Step 7:** Commit: `chore: replace Remix + Hygraph with Astro skeleton`.

### Task 2: Design tokens, fonts and the base layout

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/MonoLabel.astro`, `src/components/Pill.astro`, `src/components/MetricsCard.astro`, `src/components/Band.astro`, `src/lib/contrast.ts`, `public/og/default.png`
- Test: `tests/unit/contrast.test.ts`, `tests/e2e/motion.spec.ts`

**Interfaces:**
- Produces:
  - `BaseLayout` props `{ title: string; description: string; ogImage?: string; canonicalPath?: string }`. Renders the head (title `"<title> · Fortune Max-Eguakun"` except on home, meta description, canonical `https://fme.dev<path>`, OG and Twitter tags, default OG `/og/default.png`), Vercel analytics, `SiteHeader`, `<main>`, `SiteFooter`.
  - `Band` props `{ tone: 'dark' | 'light'; id?: string }`: a full-width section that sets the colour tokens for its children, so the accent switches between `#b6f23a` and `#3c7a00` automatically.
  - `MonoLabel` props `{ index?: number; text: string }` renders `— 01 / TEXT`. `Pill` takes `{ text: string }`. `MetricsCard` takes `{ metrics: { label: string; value: string }[] }`.
  - `contrastRatio(fg: string, bg: string): number` (WCAG 2.1 relative luminance on hex colours).
  - `SiteHeader`: name on the left (links to `/`), and on the right "Barcelona · Say hi ↗" linking to `/contact`, plus Work · Writing · CV links. `SiteFooter`: GitHub, LinkedIn, Contact, Download CV (URLs from spec §4).

- [ ] **Step 1: Write the failing tests.**
  - `contrast.test.ts`: `contrastRatio('#b6f23a','#0d0f0e') >= 4.5`, `contrastRatio('#3c7a00','#f4f4f0') >= 4.5`, `contrastRatio('#f4f4f0','#0d0f0e') >= 7`, and `contrastRatio('#ffffff','#000000')` ≈ 21.
  - `motion.spec.ts`: with `page.emulateMedia({ reducedMotion: 'reduce' })` on `/`, `document.getAnimations().filter(a => a.playState === 'running').length === 0`, and every `h1, h2` has computed `opacity === '1'`.
- [ ] **Step 2:** Run `npm test` and `npm run test:e2e`. Expected: FAIL.
- [ ] **Step 3:** Implement `contrastRatio`. Write the tokens: `--ink`, `--paper`, `--accent`, `--muted`, `--rule`, plus type scale and spacing. `Band` swaps `--fg/--bg/--accent` per tone. Import Fontsource in `global.css` (`font-display: swap`). Decorative motion only: a short fade or translate on hover, and no entrance animation that starts from `opacity: 0`. Wrap all motion in `@media (prefers-reduced-motion: no-preference)`. Make a 1200×630 `public/og/default.png` (dark background, name in Fraunces, the hero line, accent green). Render it from a small HTML file with Playwright's screenshot; keep the generator in `scripts/og.mjs`.
- [ ] **Step 4:** Use `BaseLayout` in the placeholder index. Run the tests. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: design tokens, fonts and base layout`.

### Task 3: Content collections and post helpers

**Files:**
- Create: `src/content.config.ts`, `src/lib/posts.ts`, `src/content/work/.gitkeep`, `src/content/blog/.gitkeep`
- Test: `tests/unit/posts.test.ts`

**Interfaces:**
- Produces:
  - Collection `work` (MDX, `src/content/work/*.mdx`) schema: `{ title: string; order: number; label: string /* mono label, e.g. "OneRagtime v2" */; headline: string; strike?: string /* the struck-through phrase inside headline */; summary: string /* 1–2 sentences for home */; role: string; period: string; stack: string[]; metrics: {label:string; value:string}[] /* 2–4 */; links?: {label:string; href:string}[] }`.
  - Collection `blog` (MDX, `src/content/blog/*.mdx`) schema: `{ title: string; description: string; tldr: string; pubDate: Date; archive?: boolean /* default false */; originalUrl?: string; draft?: boolean /* default false */ }`.
  - `src/lib/posts.ts`: `sortByDateDesc<T extends {data:{pubDate:Date}}>(posts: T[]): T[]`, `splitArchive<T extends {data:{archive?:boolean}}>(posts: T[]): { current: T[]; archive: T[] }`, `visiblePosts<T extends {data:{draft?:boolean}}>(posts: T[], isProd: boolean): T[]` (drafts hidden when `isProd`), `readingTime(text: string): number` (whole minutes at 230 wpm, minimum 1, ignoring fenced code blocks).

- [ ] **Step 1: Write the failing tests** in `posts.test.ts`: sorting puts 2026 before 2022 before 2016. `splitArchive` separates `archive: true`. `visiblePosts` drops drafts only when `isProd === true`. `readingTime('word '.repeat(460)) === 2`, `readingTime('') === 1`, and a 1,000-word fenced code block adds 0.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement the helpers and the collection config (`glob` loader, Zod schemas as above).
- [ ] **Step 4:** Run `npm test && npm run build`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: work and blog content collections`.

### Task 4: Product content (five MDX files and diagrams)

**Files:**
- Create: `src/content/work/{oneragtime-v2,mcp-server,ai-reports,thinclaw,cloudstation3}.mdx`, `src/components/diagrams/{StranglerFig,McpFlow,ReportPipeline,AgentPrinciples,StreamPipeline}.astro`
- Test: `tests/unit/work-content.test.ts`

**Interfaces:**
- Consumes: the `work` schema (Task 3).
- Produces: five entries with `order` 1–5 in the spec §6 order. Each body has exactly these `##` sections in order: `The problem`, `What I built`, `How it works` (embeds the diagram component), `The hard parts` (2–4 `###` subsections), `Numbers`, `Stack`. Diagrams are inline SVG. They use `currentColor` and the CSS tokens, have a `<title>` and `role="img"`, and use generic labels only (spec §4).

- [ ] **Step 1: Write the failing test** `work-content.test.ts`. Read the five files with `fs` and parse the frontmatter with `gray-matter` (dev dependency). Assert: the five slugs exist; `order` values are exactly [1..5]; each body contains the six `##` headings in order; `The hard parts` has 2–4 `###`; each `metrics` has 2–4 items; the ThinClaw body and frontmatter contain no `http` URL other than `https://github.com/fortune-max/thinclaw-showcase`; no OneRagtime file matches `/single-?handed|\bsolo\b/i`; no file matches `/search index/i`.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Write the five MDX files from spec §6 facts and the sources in Global Constraints, in Fortune's voice (spec §6 "Voice"). Use about 600–1,000 words per page. Headlines follow the before→after-with-strike pattern. OneRagtime v2's is fixed by the spec: headline `Rewrite a live platform. No big bang.` with `strike: "big bang"`. Write the others in the same shape. Links: CloudStation3 → repo and YouTube demo; ThinClaw → showcase repo only; OneRagtime pages → none.
- [ ] **Step 4:** Write the five diagram components.
- [ ] **Step 5:** Run `npm test && npm run build`. Expected: PASS.
- [ ] **Step 6:** Commit: `content: five product deep dives with diagrams`.

### Task 5: Home page

**Files:**
- Create: `src/components/Hero.astro`, `src/components/ProductSection.astro`, `src/components/WritingList.astro`, `src/components/Awards.astro`, `src/components/MoreRow.astro`, `src/data/awards.ts`, `src/data/more.ts`
- Modify: `src/pages/index.astro`
- Test: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: `BaseLayout`, `Band`, `MonoLabel`, `Pill`, `MetricsCard` (Task 2); `work` and `blog` collections plus `sortByDateDesc`, `splitArchive` and `visiblePosts` (Task 3).
- Produces: `awards: { title: string; detail: string; date: string }[]` (the five items in spec §6, in that order). `more: { title: string; detail: string }[]` (DocuSign, Skylight, FortFund, per spec §6). `ProductSection` props `{ entry: CollectionEntry<'work'>; index: number; tone: 'dark'|'light' }`. The headline renders `strike` inside `<s>`. `WritingList` props `{ posts: CollectionEntry<'blog'>[] }`: the first post is larger (featured), with up to 3 posts and archive posts excluded. If there are no posts, the section is not rendered.

Hero copy (spec §4, verbatim drafts): h1 is `Fortune Max-Eguakun`. The headline is `I make messy, live systems <em>boring to run</em>.` with the `em` in the accent colour. The lede is `Senior full-stack engineer. Breaking things since 2014, shipping them for a living since 2023. Right now I'm building the platform ~450 investors use to back startups.`

- [ ] **Step 1: Write the failing tests** in `home.spec.ts`:
  - At viewport 1440×900 and 390×844: the h1 and headline text are inside the initial viewport (`boundingBox().y + height <= viewport height`). After `window.scrollBy(0, innerHeight)`, the first `[data-product]` section and its first metric value are visible.
  - There are exactly 5 `[data-product]` sections, in order oneragtime-v2, mcp-server, ai-reports, thinclaw, cloudstation3, each with a link to `/work/<slug>`. Section tones alternate.
  - The awards list has 5 items and the first contains "1,000 TON". The More row has 3 items.
  - The page text contains no `@` email pattern (`/[\w.+-]+@[\w-]+\.[\w.]+/`).
- [ ] **Step 2:** Run `npm run test:e2e -- home`. Expected: FAIL.
- [ ] **Step 3:** Build the components and the page: Hero (dark) → products alternating light/dark → Writing → Awards → More. The layout matches the mockup option 1: a two-column product section (text | metrics card) that stacks below 720px.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: home page`.

### Task 6: Product page template

**Files:**
- Create: `src/pages/work/[slug].astro`, `src/layouts/ProseLayout.astro`, `src/styles/prose.css`
- Test: `tests/e2e/work.spec.ts`

**Interfaces:**
- Consumes: the `work` collection, `BaseLayout`, `MonoLabel`, `Pill`, `MetricsCard`.
- Produces: `ProseLayout` props `{ title: string; description: string; label: string; meta: string /* mono line under title */ }` with a slot. Task 7 reuses it for blog posts. `prose.css` has the 18px body, a 68ch measure, styled `h2/h3`, a code block with `overflow-x: auto`, blockquotes and figures.

- [ ] **Step 1: Write the failing tests:** each of the 5 `/work/<slug>` pages returns 200 and has an h1 equal to the frontmatter title, the six h2s in order, one `svg[role=img]`, the stack pills, and a "← All work" link to `/#work`. The ThinClaw page has exactly one external link, to the showcase repo.
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3:** Implement `getStaticPaths` over the `work` collection. The header shows label, headline (with strike), role · period, and the metrics card. The body is rendered MDX. Next/previous product links go at the bottom.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: product deep-dive pages`.

### Task 7: Blog: index, post pages, RSS and the 2016 archive

**Files:**
- Create: `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/pages/rss.xml.ts`, `src/content/blog/2016-mtk-adb.mdx`, `src/content/blog/2016-piano-tiles-bot.mdx`, `src/content/blog/2016-steg.mdx`
- Modify: `astro.config.mjs` (Shiki theme)
- Test: `tests/e2e/blog.spec.ts`

**Interfaces:**
- Consumes: the `blog` collection, the helpers from Task 3, and `ProseLayout` (Task 6).
- Produces: `/blog` (current posts newest first, then an "Archive (2016)" heading and the archive posts), `/blog/<slug>`, and `/rss.xml` (current, non-draft posts only, with title, link, pubDate and description).

- [ ] **Step 1:** Fetch the three slaycode.wordpress.com posts with WebFetch. Convert each to MDX with `archive: true`, the original `pubDate`, `originalUrl`, and the note "Originally published on slaycode.wordpress.com, 2016." at the top. Keep the text as written: they are Fortune's own posts. If a post can't be fetched, create the entry with only frontmatter and a body that links to `originalUrl`.
- [ ] **Step 2: Write the failing tests:** `/blog` shows the "Archive (2016)" heading with 3 links under it. A post page has an h1, a mono meta line matching `/\d{4} · \d+ min read/`, and a TL;DR block (`[data-tldr]`) before the body (archive posts may omit it). `/rss.xml` returns `content-type` containing `xml` and parses as XML (`DOMParser`), and its `<item>` count equals the number of current non-draft posts. A `pre` block in a post has computed `overflow-x` of `auto`.
- [ ] **Step 3:** Run the tests. Expected: FAIL.
- [ ] **Step 4:** Implement the pages and RSS. Shiki uses a dark theme that matches the palette (e.g. `vitesse-dark`), and the background uses the `--ink` token. Drafts are visible in `dev` and hidden in production builds via `visiblePosts(posts, import.meta.env.PROD)`.
- [ ] **Step 5:** Run the tests. Expected: PASS.
- [ ] **Step 6:** Commit: `feat: blog, RSS and 2016 archive`.

### Task 8: The three launch posts

**Files:**
- Create: `src/content/blog/func-compiler-bugs.mdx`, `src/content/blog/rewrite-without-big-bang.mdx`, `src/content/blog/mcp-server-llms-dont-misuse.mdx`
- Test: `tests/unit/blog-content.test.ts`

**Interfaces:**
- Consumes: the `blog` schema and the voice rules in `../blog/IDEAS.md` ("Voice: slaycode, grown up"): TL;DR, real snippets and numbers, a "What I'd do differently" ending, 800–1,500 words.

- [ ] **Step 1: Write the failing test** `blog-content.test.ts`: the three files exist. For each, the word count outside code fences is between 800 and 1,500, it contains the heading `## What I'd do differently`, `tldr` is non-empty, and there is at least one fenced code block. No post matches `/search index|single-?handed|\bsolo\b/i`. The FunC post does not match `/UQ|EQ[A-Za-z0-9_-]{40,}|tonviewer|tonscan/` (no wallet or transaction data).
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Write `func-compiler-bugs.mdx` (pubDate 2026-11-11, so it's newest and featured on home). The title is close to "Three FunC bug reports: a false alarm, 1,000 TON and a changed compiler default". Use the three-report arc and the PoC from `../blog/IDEAS.md` "#11 source notes" and `../blog/sources/ton-report_2.fc`.
- [ ] **Step 4:** Write `rewrite-without-big-bang.mdx` (IDEAS #2) and `mcp-server-llms-dont-misuse.mdx` (IDEAS #4), with pubDates 2026-11-04 and 2026-10-28. Code snippets are illustrative and written fresh for the post. Never paste code from the OneRagtime repos.
- [ ] **Step 5:** Run `npm test && npm run build`. Expected: PASS.
- [ ] **Step 6:** Commit: `content: three launch posts`.

### Task 9: Contact form and API

**Files:**
- Create: `src/lib/contact.ts`, `src/pages/api/contact.ts`, `src/pages/contact.astro`, `.env.example`
- Test: `tests/unit/contact.test.ts`, `tests/e2e/contact.spec.ts`

**Interfaces:**
- Produces:
  - `type ContactInput = { name: string; email: string; message: string; website?: string /* honeypot */ }`
  - `validateContact(raw: unknown): { ok: true; value: ContactInput } | { ok: false; errors: Record<string,string> }`. Rules: name 1–100 chars, no `\r` or `\n`. Email matches a basic pattern, ≤254 chars, no `\r` or `\n`. Message 10–5,000 chars. Strings are trimmed.
  - `isBot(input: ContactInput): boolean`: true when `website` is non-empty.
  - `createRateLimiter(limit: number, windowMs: number): (key: string, now?: number) => boolean`: in-memory and best-effort per instance; returns false once there are more than `limit` hits in the window. Use 5 per 10 minutes per IP.
  - `sendContact(input: ContactInput, env: { RESEND_API_KEY?: string; CONTACT_TO?: string; CONTACT_FROM?: string; CONTACT_DRY_RUN?: string }): Promise<void>`. In dry-run mode (or with no API key in dev) it logs and resolves. It sends with Resend with `replyTo` set to the visitor's email and subject `fme.dev: message from <name>`.
  - `POST /api/contact` (`export const prerender = false`) accepts `application/json` (returns JSON `{ok:true}` or `{ok:false, errors}`, status 200, 400 or 429) and `application/x-www-form-urlencoded` (303 redirect to `/contact?sent=1` or `/contact?error=1`). Bot submissions return the success response but don't send. Any thrown error returns 500 with `{ok:false}` and is logged without the message body.
  - `.env.example` lists `RESEND_API_KEY=`, `CONTACT_TO=`, `CONTACT_FROM=`, `CONTACT_DRY_RUN=1` with empty values. Real values exist only in Vercel env vars, which Fortune sets.
- [ ] **Step 1: Write the failing unit tests:** valid input passes; each of missing name, `"a\nBcc: x"` in name, `"x@y.com\r\n"` as email, a 9-char message, a 5,001-char message, `null`, a string, and `{}` fail with the right error key; `isBot` is true for `website: 'x'`; the rate limiter allows 5 then blocks the 6th and resets after the window (pass `now`).
- [ ] **Step 2: Write the failing e2e tests** (the Playwright webServer env sets `CONTACT_DRY_RUN=1`): the form with JS disabled (`test.use({ javaScriptEnabled: false })`) submits, lands on `/contact?sent=1` and shows "Thanks" text. A JSON POST with a 50 KB message returns 400. A malformed JSON body returns 400. A honeypot-filled POST returns 200 `{ok:true}`. The `/contact` page source contains no email address.
- [ ] **Step 3:** Run both suites. Expected: FAIL.
- [ ] **Step 4:** Implement `contact.ts`, the endpoint and the page. The form has three labelled fields and a visually hidden `website` field (`tabindex="-1" autocomplete="off"`, hidden with an off-screen class rather than `display:none`). With JS, the form submits via `fetch` and shows inline errors. Without JS, the native POST still works.
- [ ] **Step 5:** Run both suites. Expected: PASS.
- [ ] **Step 6:** Commit: `feat: contact form with honeypot, validation and rate limit`.

### Task 10: CV page, 404, content guard and launch checks

**Files:**
- Create: `scripts/render-cv.mjs`, `public/cv/Fortune-Max-Eguakun-CV.pdf`, `src/pages/cv.astro`, `src/pages/404.astro`, `scripts/check-content.mjs`, `tests/e2e/site.spec.ts`
- Outside the repo (never commit): `../blog/denylist.txt`

**Interfaces:**
- Produces: `npm run cv` (runs `scripts/render-cv.mjs`, which renders `../cv/cv-general.html` with Playwright Chromium `page.pdf({ format: 'A4', printBackground: true })` into `public/cv/Fortune-Max-Eguakun-CV.pdf`). `npm run check:content` runs `node scripts/check-content.mjs dist`, which scans every `.html` and `.xml` file in `dist/` and exits 1 on any match. It checks the in-repo generic patterns (an email regex, `/single-?handed/i`, `/search index/i`, `/thinclaw\.dev/i`, TON wallet `/\b[EU]Q[A-Za-z0-9_-]{46}\b/`) and, when present, each non-empty line of the file named by env `DENYLIST_FILE` (default `../blog/denylist.txt`) as a case-insensitive literal. The denylist path and its contents are never printed or committed, only `file:line` of each hit.

- [ ] **Step 1:** Create `../blog/denylist.txt` from `../research/findings.md`: OneRagtime fund names, LP and client names, colleague names, internal hostnames, and the domain of the ThinClaw dashboard, one per line. It lives outside the repo because the repo is public.
- [ ] **Step 2: Write the failing e2e tests** in `site.spec.ts`:
  - `/cv` has a download link to `/cv/Fortune-Max-Eguakun-CV.pdf`. Fetching that returns `application/pdf`, the body starts with `%PDF`, and it contains exactly 2 `/Type /Page` objects (not counting `/Pages`).
  - `/work/nope`, `/blog/nope` and `/notes` return status 404 and show the site header.
  - At 360px width, for `/`, each `/work/*`, `/blog`, each `/blog/*`, `/cv` and `/contact`: `document.documentElement.scrollWidth <= innerWidth`.
  - `/sitemap-index.xml` exists. Every page has `link[rel=canonical]` starting with `https://fme.dev/` and an `og:image`.
- [ ] **Step 3:** Run the tests. Expected: FAIL.
- [ ] **Step 4:** Implement `render-cv.mjs` and run it. The CV page has a short line, the download button, and an `<object>` inline view with a link fallback. The 404 page uses `BaseLayout` and has a short line in Fortune's voice plus links home. Write `check-content.mjs`.
- [ ] **Step 5:** Run `npm run build && npm run check:content && npm test && npm run test:e2e`. Expected: all PASS with 0 content-guard hits.
- [ ] **Step 6:** Run Lighthouse (`npx lighthouse http://localhost:4321/ --only-categories=performance,accessibility --preset=desktop` and the same for `/blog/func-compiler-bugs`, plus the mobile default). Expected: performance ≥ 95 and accessibility ≥ 95. Fix any shortfall before committing.
- [ ] **Step 7:** Commit: `feat: CV download, 404, content guard`.

### Task 11: Preview handoff (requires Fortune's go-ahead)

- [ ] **Step 1:** Stop and ask Fortune in chat for permission to push `fme-refresh` to the public repo (drafts become publicly visible on GitHub) and to create a Vercel preview. Do nothing in this task without a clear yes.
- [ ] **Step 2:** After the yes: push the branch. Fortune sets these Vercel env vars for Preview: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` (a verified Resend sender), and `CONTACT_DRY_RUN` unset. Check that the Vercel project's framework preset is now Astro.
- [ ] **Step 3:** On the preview URL, rerun the Task 10 Lighthouse checks, send one real test message through the form, and confirm it arrives.
- [ ] **Step 4:** Give Fortune the preview URL and a review checklist: hero copy, each product page, the three posts, the CV PDF, and the archive posts. Production merge happens only after their approval (spec §8b).
