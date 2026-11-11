import { describe, it, expect } from 'vitest';
import { validateContact, isBot, createRateLimiter } from '../../src/lib/contact';

const valid = { name: 'Ada', email: 'ada@example.com', message: 'Hello there, nice site!' };

describe('validateContact', () => {
  it('accepts valid input and trims it', () => {
    const r = validateContact({ name: '  Ada ', email: ' ada@example.com ', message: '  Hello there, nice site!  ' });
    expect(r).toEqual({ ok: true, value: { ...valid, website: '' } });
  });
  it.each([
    ['missing name', { ...valid, name: '' }, 'name'],
    ['header injection in name', { ...valid, name: 'a\nBcc: x@y.com' }, 'name'],
    ['CRLF in email', { ...valid, email: 'x@y.com\r\n' }, 'email'],
    ['bad email', { ...valid, email: 'not-an-email' }, 'email'],
    ['short message', { ...valid, message: '123456789' }, 'message'],
    ['long message', { ...valid, message: 'x'.repeat(5001) }, 'message'],
    ['long name', { ...valid, name: 'x'.repeat(101) }, 'name'],
  ])('rejects %s', (_l, input, key) => {
    const r = validateContact(input);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors).toHaveProperty(key);
  });
  it.each([null, 'a string', 42, {}, []])('rejects non-object input %j', (input) => {
    expect(validateContact(input).ok).toBe(false);
  });
  it('rejects non-string fields', () => {
    expect(validateContact({ ...valid, name: { $ne: 1 } }).ok).toBe(false);
  });
});

describe('isBot', () => {
  it('flags a filled honeypot', () => expect(isBot({ ...valid, website: 'http://spam' })).toBe(true));
  it('passes an empty honeypot', () => expect(isBot({ ...valid, website: '' })).toBe(false));
});

describe('createRateLimiter', () => {
  it('allows 5 per window, blocks the 6th, resets after the window', () => {
    const allow = createRateLimiter(5, 600_000);
    for (let i = 0; i < 5; i++) expect(allow('1.2.3.4', 1000 + i)).toBe(true);
    expect(allow('1.2.3.4', 2000)).toBe(false);
    expect(allow('5.6.7.8', 2000)).toBe(true);
    expect(allow('1.2.3.4', 1000 + 600_001)).toBe(true);
  });
});
