import { describe, expect, it } from 'vitest';
import {
  JUST_OPENED_DAYS,
  countdownLabel,
  formatOpeningDate,
  isOpen,
  openingBadge,
  openingPhase,
  promotedStore,
  storesNoun,
  todayInWarsaw,
} from './opening';
import type { Store } from './types';

const store = (id: string, openingDate: string | null = null): Store => ({
  id,
  city: 'Świdnica',
  street: `ul. ${id}`,
  label: '',
  hours: '',
  image: '',
  maps: '',
  featured: false,
  location: null,
  openingDate,
  openingOffer: '',
});

describe('todayInWarsaw', () => {
  it('uses the Polish calendar day, not UTC', () => {
    // 23:30 UTC on 14 October is already 01:30 on 15 October in Warsaw (CEST, UTC+2)
    expect(todayInWarsaw(new Date('2026-10-14T23:30:00Z'))).toBe('2026-10-15');
    expect(todayInWarsaw(new Date('2026-10-14T21:59:00Z'))).toBe('2026-10-14');
  });

  it('follows the switch to winter time', () => {
    // after 25 October Warsaw is UTC+1
    expect(todayInWarsaw(new Date('2026-11-02T22:59:00Z'))).toBe('2026-11-02');
    expect(todayInWarsaw(new Date('2026-11-02T23:00:00Z'))).toBe('2026-11-03');
  });
});

describe('openingPhase', () => {
  it('treats a shop without an opening date as a regular open shop', () => {
    expect(openingPhase(null, '2026-10-01')).toEqual({ phase: 'open', days: 0 });
  });

  it('counts down the days before opening', () => {
    expect(openingPhase('2026-10-15', '2026-10-03')).toEqual({ phase: 'upcoming', days: 12 });
    expect(openingPhase('2026-10-15', '2026-10-14')).toEqual({ phase: 'upcoming', days: 1 });
  });

  it(`celebrates the opening for ${JUST_OPENED_DAYS} days, starting on the day itself`, () => {
    expect(openingPhase('2026-10-15', '2026-10-15')).toEqual({ phase: 'justOpened', days: 0 });
    expect(openingPhase('2026-10-15', '2026-10-28')).toEqual({ phase: 'justOpened', days: 13 });
  });

  it('then becomes an ordinary shop', () => {
    expect(openingPhase('2026-10-15', '2026-10-29').phase).toBe('open');
    expect(openingPhase('2025-01-10', '2026-10-01').phase).toBe('open');
  });

  it('counts calendar days across the clock change and month ends', () => {
    expect(openingPhase('2026-11-02', '2026-10-24')).toEqual({ phase: 'upcoming', days: 9 });
  });
});

describe('isOpen', () => {
  it('is false only before the opening date', () => {
    expect(isOpen(store('a'), '2026-10-01')).toBe(true);
    expect(isOpen(store('a', '2026-10-15'), '2026-10-14')).toBe(false);
    expect(isOpen(store('a', '2026-10-15'), '2026-10-15')).toBe(true);
  });
});

describe('countdownLabel', () => {
  it.each([
    [0, 'dziś'],
    [1, 'jutro'],
    [2, 'za 2 dni'],
    [5, 'za 5 dni'],
    [21, 'za 21 dni'],
  ])('%i → %s', (days, label) => {
    expect(countdownLabel(days)).toBe(label);
  });
});

describe('formatOpeningDate', () => {
  it('writes the day and the month in Polish, in the genitive', () => {
    expect(formatOpeningDate('2026-10-15')).toBe('15 października');
    expect(formatOpeningDate('2026-10-01')).toBe('1 października');
  });

  it('does not slip to the previous day on a server running in UTC or behind it', () => {
    expect(formatOpeningDate('2026-11-01')).toBe('1 listopada');
  });
});

describe('storesNoun', () => {
  it.each([
    [1, 'sklep firmowy'],
    [2, 'sklepy firmowe'],
    [4, 'sklepy firmowe'],
    [5, 'sklepów firmowych'],
    [12, 'sklepów firmowych'],
    [14, 'sklepów firmowych'],
    [22, 'sklepy firmowe'],
    [25, 'sklepów firmowych'],
  ])('%i %s', (n, noun) => {
    expect(storesNoun(n)).toBe(noun);
  });
});

describe('promotedStore', () => {
  it('promotes nothing when no shop has an opening date', () => {
    expect(promotedStore([store('a'), store('b')], '2026-10-01')).toBeNull();
  });

  it('promotes the upcoming shop with its countdown', () => {
    const next = store('glowackiego', '2026-10-15');
    expect(promotedStore([store('a'), next], '2026-10-03')).toEqual({ store: next, phase: 'upcoming', days: 12 });
  });

  it('keeps promoting a shop during its first two weeks', () => {
    const fresh = store('glowackiego', '2026-10-15');
    expect(promotedStore([fresh], '2026-10-20')).toEqual({ store: fresh, phase: 'justOpened', days: 5 });
  });

  it('stops once the celebration is over', () => {
    expect(promotedStore([store('glowackiego', '2026-10-15')], '2026-11-30')).toBeNull();
  });

  it('prefers the soonest upcoming shop, and an upcoming one over one already open', () => {
    const later = store('later', '2026-12-01');
    const sooner = store('sooner', '2026-11-10');
    const opened = store('opened', '2026-10-25');
    expect(promotedStore([later, opened, sooner], '2026-10-30')?.store.id).toBe('sooner');
  });
});

describe('openingBadge', () => {
  it('announces the date before opening, "new" for two weeks, then nothing', () => {
    const shop = store('glowackiego', '2026-10-15');
    expect(openingBadge(shop, '2026-10-01')).toBe('Otwarcie 15 października');
    expect(openingBadge(shop, '2026-10-15')).toBe('Nowy sklep');
    expect(openingBadge(shop, '2026-10-28')).toBe('Nowy sklep');
    expect(openingBadge(shop, '2026-10-29')).toBe('');
  });

  it('never badges an established shop', () => {
    expect(openingBadge(store('skladowa'), '2026-10-01')).toBe('');
  });
});
