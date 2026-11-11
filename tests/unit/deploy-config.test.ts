import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

it('vercel.json pins the Astro framework preset', () => {
  expect(JSON.parse(readFileSync('vercel.json', 'utf8')).framework).toBe('astro');
});
