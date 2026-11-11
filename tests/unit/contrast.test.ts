import { describe, it, expect } from 'vitest';
import { contrastRatio } from '../../src/lib/contrast';

describe('contrastRatio', () => {
  it('accent on dark passes AA', () => expect(contrastRatio('#b6f23a', '#0d0f0e')).toBeGreaterThanOrEqual(4.5));
  it('accent on light passes AA', () => expect(contrastRatio('#3c7a00', '#f4f4f0')).toBeGreaterThanOrEqual(4.5));
  it('paper on ink passes AAA', () => expect(contrastRatio('#f4f4f0', '#0d0f0e')).toBeGreaterThanOrEqual(7));
  it('white on black is 21', () => expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1));
  it('is symmetric', () => expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1));
});
