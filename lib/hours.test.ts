import { describe, expect, it } from 'vitest';
import { parseHours } from './hours';

describe('parseHours', () => {
  it('splits a middle-dot separated string into day/time rows', () => {
    expect(parseHours('Pn–Pt 6:00–18:00 · Sb 6:00–14:00 · Nd zamknięte')).toEqual([
      { day: 'Pn–Pt', time: '6:00–18:00' },
      { day: 'Sb', time: '6:00–14:00' },
      { day: 'Nd', time: 'zamknięte' },
    ]);
  });

  it('splits newline-separated input', () => {
    expect(parseHours('Pn–Pt 6:00–18:00\nSb 6:00–14:00')).toEqual([
      { day: 'Pn–Pt', time: '6:00–18:00' },
      { day: 'Sb', time: '6:00–14:00' },
    ]);
  });

  it('handles a single-word line with no time', () => {
    expect(parseHours('Zamknięte')).toEqual([{ day: 'Zamknięte', time: '' }]);
  });

  it('returns an empty array for an empty string', () => {
    expect(parseHours('')).toEqual([]);
  });
});
