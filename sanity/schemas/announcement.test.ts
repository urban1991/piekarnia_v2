import { describe, expect, it } from 'vitest';
import { endsAfterStart } from './announcement';

describe('endsAfterStart', () => {
  it('accepts an open-ended or undated announcement', () => {
    expect(endsAfterStart(undefined, undefined)).toBe(true);
    expect(endsAfterStart('2026-10-01T06:00:00Z', undefined)).toBe(true);
    expect(endsAfterStart(undefined, '2026-10-07T20:00:00Z')).toBe(true);
  });

  it('accepts a window that ends after it starts', () => {
    expect(endsAfterStart('2026-10-01T06:00:00Z', '2026-10-07T20:00:00Z')).toBe(true);
  });

  it('rejects a window that ends before it starts, with a message the manager can act on', () => {
    expect(endsAfterStart('2026-10-07T20:00:00Z', '2026-10-01T06:00:00Z')).toMatch(/Pokazuj do.*późniejsza/);
  });

  it('rejects a zero-length window, which would never be shown', () => {
    expect(endsAfterStart('2026-10-01T06:00:00Z', '2026-10-01T06:00:00Z')).not.toBe(true);
  });

  it('compares instants, not strings, across time zones', () => {
    // 08:00 in Warsaw (CEST) is 06:00 UTC, so this ends one hour after it starts
    expect(endsAfterStart('2026-10-01T06:00:00Z', '2026-10-01T09:00:00+02:00')).toBe(true);
  });
});
