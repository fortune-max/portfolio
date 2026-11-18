import { describe, it, expect } from 'vitest';
import { builtWith } from '../../src/lib/stack';

describe('builtWith', () => {
  it('joins several items with commas and "and"', () => expect(builtWith(['Django', 'PostgreSQL', 'Vue 3', 'Celery'])).toBe('Built with Django, PostgreSQL, Vue 3 and Celery'));
  it('handles two items', () => expect(builtWith(['C++', 'Python'])).toBe('Built with C++ and Python'));
  it('handles one item', () => expect(builtWith(['TypeScript'])).toBe('Built with TypeScript'));
  it('returns an empty string for no items', () => expect(builtWith([])).toBe(''));
});
