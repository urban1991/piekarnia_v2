/**
 * How many copies of the announcement list one marquee half needs so that it is at least as wide
 * as the bar; otherwise the track runs out of content on the right before the loop wraps.
 */
export function marqueeCopies(barWidth: number, listWidth: number): number {
  if (!(listWidth > 0)) return 1;
  return Math.max(1, Math.ceil(barWidth / listWidth));
}

/** Cards fully visible at once in a scroll-snap track (each step is card width + gap). */
export function cardsPerView(trackWidth: number, cardWidth: number, gap: number): number {
  const step = cardWidth + gap;
  if (!(step > 0)) return 1;
  return Math.max(1, Math.round((trackWidth + gap) / step));
}

/** Scroll positions (dots) a carousel can snap to: the last one shows the final `perView` cards. */
export function carouselPages(count: number, perView: number): number {
  return Math.max(1, count - perView + 1);
}

/** Marquee speed in px per second; one loop moves the track by one half. */
export const MARQUEE_SPEED = 50;
const MIN_MARQUEE_SECONDS = 12;

/** Loop duration for a half this wide, so every announcement scrolls at the same, readable speed. */
export function marqueeDuration(halfWidth: number): number {
  return Math.max(MIN_MARQUEE_SECONDS, halfWidth / MARQUEE_SPEED);
}
