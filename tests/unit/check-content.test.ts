import { describe, it, expect } from 'vitest';
import { findHits, GENERIC_PATTERNS, parseDenylist } from '../../scripts/check-content.mjs';

describe('content guard', () => {
  const deny = parseDenylist('# comment\nLeo\n\nAcme Fund\n');
  it('parses non-empty, non-comment lines', () => expect(deny.length).toBe(2));
  it('matches denylist terms as whole words, case-insensitively', () => {
    expect(findHits('<p>thanks leo!</p>', deny)).toHaveLength(1);
    expect(findHits('<p>Galileo and Leonardo</p>', deny)).toHaveLength(0);
    expect(findHits('the ACME FUND III', deny)).toHaveLength(1);
  });
  it('generic patterns catch emails, banned wording and wallets', () => {
    expect(findHits('mail me: a.b@example.com', GENERIC_PATTERNS)).toHaveLength(1);
    expect(findHits('I single-handedly did it', GENERIC_PATTERNS)).toHaveLength(1);
    expect(findHits('our search index was idle', GENERIC_PATTERNS)).toHaveLength(1);
    expect(findHits('see my.thinclaw.dev', GENERIC_PATTERNS)).toHaveLength(1);
    expect(findHits('EQBHetRF-kPDEbtbar64cAMKru-SJkBJAcz997VL8-E9IoMH', GENERIC_PATTERNS)).toHaveLength(1);
  });
  it('does not flag CSS at-rules', () => expect(findHits('@media (min-width: 1px) { }', GENERIC_PATTERNS)).toHaveLength(0));
  it('never includes the matched term in hit output', () => {
    const [hit] = findHits('hello leo', deny);
    expect(JSON.stringify(hit)).not.toMatch(/leo/i);
  });
});

describe('content guard covers PDFs', () => {
  it('extracts text from the public CV so it can be scanned', async () => {
    const { pdfText } = await import('../../scripts/check-content.mjs');
    const text = pdfText('public/cv/Fortune-Max-Eguakun-CV.pdf');
    expect(text).toMatch(/Fortune Max-Eguakun/);
  });
});
