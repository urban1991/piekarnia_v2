import { describe, expect, it } from 'vitest';
import { checkStoreLocation } from './store';

describe('checkStoreLocation', () => {
  it('accepts an empty location: the shop is then simply left off the map', () => {
    expect(checkStoreLocation(undefined)).toBe(true);
  });

  it.each([
    ['Świdnica, Składowa', { lat: 50.833898, lng: 16.506576 }],
    ['Bielawa', { lat: 50.682972, lng: 16.62175 }],
    ['Gdańsk', { lat: 54.352, lng: 18.646 }],
  ])('accepts a point in Poland (%s)', (_, point) => {
    expect(checkStoreLocation(point)).toBe(true);
  });

  it('catches latitude and longitude pasted the wrong way round', () => {
    expect(checkStoreLocation({ lat: 16.506576, lng: 50.833898 })).toMatch(/zamienion/);
  });

  it('rejects a point outside Poland, e.g. a sign lost while copying', () => {
    expect(checkStoreLocation({ lat: -50.83, lng: 16.5 })).not.toBe(true);
  });
});
