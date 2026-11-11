# fme.dev

Personal site of Fortune Max-Eguakun: an Astro + MDX static site on Vercel. Only the contact endpoint runs on a server.

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm test           # unit tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright, against a production build)
npm run build      # type-check + build
```

## Content

- **Blog post:** add `src/content/blog/<slug>.mdx` with frontmatter `title`, `description`, `tldr`, `pubDate` (and `draft: true` while writing). Drafts show in dev and are hidden in production.
- **Product page:** `src/content/work/<slug>.mdx`. `order` controls its position on the home page.
- **CV:** `public/cv/Fortune-Max-Eguakun-CV.pdf`, rendered by `npm run cv` from the CV source HTML.

## Environment (Vercel only, never committed)

| Var | Purpose |
|---|---|
| `RESEND_API_KEY` | Sends contact-form messages |
| `CONTACT_TO` | Where messages go |
| `CONTACT_FROM` | Verified sender address |
| `CONTACT_DRY_RUN` | `1` logs messages instead of sending |
