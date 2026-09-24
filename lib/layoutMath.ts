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
