import { describe, expect, it } from 'vitest';
import { MARQUEE_SPEED, cardsPerView, carouselPages, marqueeCopies, marqueeDuration } from './layoutMath';

describe('marqueeCopies', () => {
  it('needs a single copy when the list is already wider than the bar', () => {
    expect(marqueeCopies(390, 900)).toBe(1);
  });

  it('adds copies until one half covers the bar', () => {
    expect(marqueeCopies(1440, 500)).toBe(3);
    expect(marqueeCopies(1500, 500)).toBe(3);
    expect(marqueeCopies(1501, 500)).toBe(4);
  });

  it('falls back to one copy before layout has a width to measure', () => {
    expect(marqueeCopies(1440, 0)).toBe(1);
    expect(marqueeCopies(0, 0)).toBe(1);
    expect(marqueeCopies(1440, Number.NaN)).toBe(1);
  });
});

describe('cardsPerView', () => {
  it('counts cards that fit, with the gap only between them', () => {
    // 3 × 360 + 2 × 24 = 1128: three cards fill the track exactly
    expect(cardsPerView(1128, 360, 24)).toBe(3);
  });

  it('rounds, so a sliver of the next card does not count as a whole one', () => {
    expect(cardsPerView(1200, 360, 24)).toBe(3);
    expect(cardsPerView(342, 320, 16)).toBe(1);
  });

  it('shows at least one card, even before layout', () => {
    expect(cardsPerView(0, 0, 0)).toBe(1);
    expect(cardsPerView(200, 360, 24)).toBe(1);
  });
});

describe('carouselPages', () => {
  it('has one snap position per card on phones', () => {
    expect(carouselPages(5, 1)).toBe(5);
  });

  it('stops when the last card is in view', () => {
    expect(carouselPages(5, 3)).toBe(3);
  });

  it('keeps a single page when everything fits, or when there are no cards', () => {
    expect(carouselPages(3, 3)).toBe(1);
    expect(carouselPages(2, 3)).toBe(1);
    expect(carouselPages(0, 1)).toBe(1);
  });
});

describe('marqueeDuration', () => {
  it('keeps the text moving at the same speed whatever its length', () => {
    expect(marqueeDuration(MARQUEE_SPEED * 40)).toBe(40);
    expect(marqueeDuration(MARQUEE_SPEED * 80)).toBe(80);
  });

  it('never races a short announcement across the bar', () => {
    expect(marqueeDuration(100)).toBe(12);
    expect(marqueeDuration(0)).toBe(12);
  });
});
