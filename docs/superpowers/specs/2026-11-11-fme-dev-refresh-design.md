# fme.dev refresh: design

**Date:** 2026-11-11
**Owner:** Fortune Max-Eguakun
**Repo:** `fortune-max/portfolio` (public), deployed on Vercel at https://fme.dev

## 1. Intent

Fortune is job hunting for senior full-stack, fintech or AI-friendly roles (in Spain, or remote). They need a new job before their Spanish visa expires at the end of April 2027. The current fme.dev was last updated in September 2023. It still presents them as a new full-stack developer, with self-rated skill bars and a terminal-styled "> About.txt" layout.

**What a recruiter or hiring manager should take away within 30 seconds of landing (in the user's words): "I'm a senior engineer who ships real products."**

Everything on the site serves that sentence. The site should still feel personal and have some attitude, rather than reading like a template portfolio.

## 2. Goals, non-goals, anti-goals

**Goals**
- The home page shows shipped products with concrete outcomes and numbers on first paint.
- Each flagship product has a deep-dive page that can back up an interview conversation ("walk me through the rewrite").
- A blog where Fortune writes in their own voice. New posts are MDX files in the repo, published with `git push`.
- A one-click CV download.
- It looks clearly like Fortune's own site, not a copy of anyone else's.

**Non-goals**
- A CMS. Hygraph is removed and content lives in the repo.
- A terminal, shell emulator or command-line UI. The user explicitly dropped the terminal concept: the site should be "techy but not exclusive".
- Self-rated skill bars and percentages. They are removed and not replaced with another skill rating.
- The old Polaroid photo gallery. The user did not ask for it, so it is dropped (my call).

**Anti-goals (failure even if it technically works)**
- Content that only appears after a loader, scroll-jacking or blur-in animations. A recruiter skimming for 30 seconds must be able to read everything without scrolling tricks.
- Leaking confidential employer details (see §5).
- Leaking ThinClaw details that would help someone copy it (see §5).
- Looking like leo-fezard.dev. Leo is a junior colleague the user is onboarding, so a lookalike site would read as copying.
- Any mention of the "search index used 0 times" bug story. The user rejected it as an article and as a mention.

## 3. Visual direction (decided by the user: "editorial, dark-first")

Reference mockup: `docs/superpowers/specs/assets/2026-11-11-direction-mockups.html`, **option 1** (open it in a browser; options 2 and 3 were rejected). The inspiration came from leo-fezard.dev's editorial scale (huge display type, a small monospace companion font, one accent colour, alternating dark and light bands, one bold statement per project, the tech stack as pills). It is re-cut with a different palette, voice and purpose.

- **Type:** a heavy slab or soft serif for display (Fraunces Black in the mockup; the variable axes may be tuned). A monospace for all small text: nav, section labels ("— 01 / ONERAGTIME V2"), metrics, stack pills, captions (JetBrains Mono in the mockup). Body text for long-form blog reading should be comfortable at about 18px with a 65–75ch measure. The builder chooses whether body text uses the serif at text optical size or a neutral sans.
- **Colour:** near-black (`#0d0f0e`) and warm off-white (`#f4f4f0`) bands alternating. A single **acid-green** accent (`#b6f23a`) on dark backgrounds, with a darker green (around `#3c7a00`) on light backgrounds so it passes WCAG AA. The green means "live, healthy, shipped". No other accent colour.
- **Product sections:** each has a numbered mono label, a before→after headline with a strikethrough ("Rewrite a live platform. No ~~big bang~~."), a short paragraph, stack pills, and a small bordered metrics card (label left, value right).
- **Motion:** decoration only (subtle reveal, hover states). Respect `prefers-reduced-motion`. Nothing is hidden until an animation runs.
- **Dark mode:** the design is already dark-first with light bands. Build one fixed theme, with no theme toggle (my call).
- Responsive down to 360px phone width.

## 4. Information architecture

### `/` Home
1. **Hero (dark).** Top bar: name on the left, "Barcelona · Say hi ↗" on the right (mailto or LinkedIn). Then the headline. Draft: "I make messy, live systems **boring to run**." The last phrase is in the accent colour. Below it, 2–3 sentences in Fortune's voice. Draft: "Senior full-stack engineer. Breaking things since 2014, shipping them for a living since 2023. Right now I'm building the platform ~450 investors use to back startups."
2. **Product sections**, numbered 01–0N, alternating light and dark bands. Each links to its `/work/<slug>` page.
3. **Writing:** the latest 3 posts (title, date, one line). The newest one is shown larger as the "featured" post. There is no separate featured slot, so whichever post ships first gets that spot (my call).
4. **Awards / side quests:** a compact list (see §6). It shows the competitive programming and bug-bounty personality.
5. **Footer:** GitHub (https://github.com/fortune-max), LinkedIn (https://www.linkedin.com/in/fortune-max-eguakun/), Contact (the form), "Download CV".

### `/work/<slug>` Product pages
Template: problem → what I built (and my role) → one diagram → the hard parts (2–4 short subsections) → numbers → stack → links (repo or demo, only where public). Length is roughly a 3–5 minute read.

**Sources (my call):** the builder may use technical detail from `../research/findings.md`, `../blog/IDEAS.md` and `../cv/build.py`, filtered through §5. "Hard parts" are framed as engineering problems Fortune solved (e.g. keeping the legacy and new systems on the same tables during a migration, making LLM output cite its sources), never as company failings or incidents. Diagrams show the architecture *pattern* (legacy API ↔ new frontend ↔ new backend ↔ shared DB, LLM ↔ MCP ↔ read-only DB) with generic labels: no internal hostnames, service names, vendor account details or data.

### `/blog` and `/blog/<slug>`
- The index lists posts newest first. A separate **"Archive (2016)"** group at the bottom holds the three old slaycode.wordpress.com posts (MTK ADB, Piano Tiles bot, Steg). The builder decides whether to import their text as MDX (preferred, with a note "originally published on slaycode.wordpress.com, 2016") or just link out. If the text cannot be fetched, link out.
- Post page: title in the display serif, date and reading time in mono, then the body. Code blocks use syntax highlighting that fits the palette. Each post starts with a one-line TL;DR.
- RSS feed at `/rss.xml`.
- Launch content: at least one real post is needed, or the blog index must not appear empty. See §8 for which posts.

### `/cv`
Serves `public/cv/Fortune-Max-Eguakun-CV.pdf` (download plus inline view). The source is the **General** CV variant. The builder renders `../cv/cv-general.html` (generated by `../cv/build.py`, same content as the General Google Doc) to an A4 PDF with headless Chrome and commits it (my call). The user checks the PDF during the launch review. No placeholder PDF ever reaches production.

### `/contact`: contact form (decided by the user)
No email address is shown anywhere on the site. "Say hi ↗" and the footer link to a contact form (name, email, message). Submissions go to a single Vercel serverless function (Astro endpoint with the Vercel adapter in hybrid mode; every other page stays static), which forwards to Fortune's inbox through a transactional email API (e.g. Resend). Spam protection: a honeypot field, server-side validation and a rate limit, plus an invisible challenge such as Cloudflare Turnstile if spam shows up. API keys live only in Vercel env vars. The destination address is an env var and never appears in the repo.

### `/notes`: removed
The old `/notes` proxy pointed at a notes API on Railway that no longer exists (fme.dev/notes returns Railway's "Application not found", checked 2026-11-11). The routes are deleted and not replaced.

## 5. Content rules (hard constraints)

- **OneRagtime (current employer):** no fund names, client or LP names, colleague names, exact costs, internal hostnames or screenshots of internal tools. Rounded numbers and percentages only. Don't describe the company's internal problems or bugs.
- **Role wording:** "proposed, led and built". Never "single-handedly" or "solo" for OneRagtime work.
- **ThinClaw:** principles only, mirroring https://github.com/fortune-max/thinclaw-showcase/blob/main/README.md. No URLs, dashboard links, architecture specifics or anything that helps someone reverse-engineer or clone it. Link to the showcase repo only.
- **Secondary-market feature:** built but never launched. Don't present it as used, or leave it out.
- Research projects (Light-Seeking Turtle, Pursuit Graph): don't feature them.

## 6. Content inventory (facts the builder may use)

**Hero / bio:** senior full-stack engineer, Barcelona. Programming since 2014. At OneRagtime (a VC/fintech platform) since Apr 2023: intern → full-stack developer (Apr 2024) → senior full-stack developer (Sep 2025). MEng, Harbour.Space (Front-End Development major, Data Science minor), 2022–2024.

**Products (home order; my call):**
1. **OneRagtime v2** (slug `oneragtime-v2`): proposed, led and built most of a strangler-fig rewrite of a live VC platform. New SPAs on the legacy API, a backend over the legacy tables, a 99.1% parity harness, surface-by-surface cutovers, an AWS → Railway move at ~95% lower infra cost, MySQL → Postgres. ~450 active investors, ~€97M raised across funds on the platform, ~4,000 tests. Stack: Django, Postgres, Nuxt/Vue, Railway.
2. **MCP server** (`mcp-server`): gives LLMs safe access to the platform. Field projection, mapping of guessed field names, row caps and statement timeouts. Used by the whole 12-person business team.
3. **AI reporting pipeline** (`ai-reports`): drafts quarterly portfolio reports with per-figure citations (dynamic Pydantic schemas). About 4 h → 10–15 min of review per report, ~100 analyst-hours saved per quarter, and it has drafted almost all reports since Q3 2025.
4. **ThinClaw** (`thinclaw`): multi-user agentic assistant over chat. Solo, Mar 2026–now. ~38k lines of TypeScript, ~840 tests, 19 plugins, closed source, private beta. Use only the principles in the showcase README.
5. **CloudStation3** (`cloudstation3`): PS3 games streamed to the browser (shared memory, NVENC, WebRTC). MEng capstone, MIT-licensed. Repo: https://github.com/fortune-max/cloudstation3, demo video: https://youtu.be/Ei86aeKOFcs.
- Optional extras on a "More" row, without full pages: DocuSign automation (≈20 → ~300 e-signatures/year), Skylight student-records system (2019 → 2026, 5 departments), FortFund (a savings-incentive/remittance app).

**Awards / side quests:**
- TON Blockchain bug bounty, 1,000 TON (≈$2,400 at the time): FunC compiler bug, reported 28 Dec 2022 and fixed by the TON team the next day. A second FunC report (Jan 2024, asm argument evaluation order) earned 250 TON and helped make `compute-asm-ltr` the default in FunC 0.5.0.
- TON Smart Challenge 3, $2,000: 5/5 tasks (Dec 2022)
- Google Hash Code 2022 qualification: 3rd in Nigeria and Ireland (Feb 2022)
- GDG Dublin DevFest 2019 hackathon: 1st place (Nov 2019)
- IEEEXtreme 11.0: 3rd in Nigeria (Oct 2017)

**Voice:** first person, casual, a little self-deprecating (like the 2016 slaycode posts), but every claim backed by a number or a concrete detail. Blog planning notes: `../blog/IDEAS.md` (outside this repo, in the user's interview folder).

## 7. How it gets made (decided by the user)

- **Astro + MDX**, rebuilt in place in this repo. Remix, Hygraph, graphql-codegen and Framer are removed. Content collections (typed frontmatter) hold blog posts and product pages.
- Static output on **Vercel** (hybrid: only the contact endpoint is server-rendered), same project and domain. Keep `@vercel/analytics` (or its Astro equivalent).
- Fonts are self-hosted (e.g. via `@fontsource`) to avoid a third-party font request.
- Minimal client JS. Interactive bits, if any, go in Astro islands.
- SEO basics: per-page title and description, Open Graph image (a generated or static card per page is fine), sitemap, canonical URLs.

## 8. Left to the builder / open items

- Exact copy, beyond the drafts and facts above, written to the voice and rules in §5–6. The user reviews it.
- Diagrams on product pages: an inline SVG style that fits the palette.
- Launch blog posts: the user approved writing articles. Current first batch from `IDEAS.md`: "Rewriting a live fintech platform without a big-bang release" (#2), "Designing an MCP server that LLMs don't misuse" (#4), and "I found a compiler bug for $2,400" (#11). The homepage's featured essay is one of #2 or #11.

## 8b. Launch process (my call)

Work happens on a branch, with Vercel preview deploys. **Nothing goes to production (fme.dev) until Fortune has reviewed and approved all copy, product pages, posts and the CV PDF on a preview URL.** This follows the standing rule to ask before publishing anything externally. The old site stays live until then.

## 9. Success check

- On a 1440×900 and a 390×844 viewport, the first screen shows the name, the one-line pitch, and (by the first scroll) at least one product with a number.
- Lighthouse performance and accessibility ≥ 95 on `/` and a blog post.
- `/cv` downloads a PDF. The contact form delivers a test message, and the honeypot rejects bot submissions. `/rss.xml` validates.
- A keyword search of the built output finds none of the forbidden items in §5.
