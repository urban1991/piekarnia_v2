'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TestimonialCard } from '../cards/TestimonialCard';
import type { Testimonial } from '../../lib/types';
import s from './TestimonialCarousel.module.css';

/**
 * Horizontal, scroll-snapping carousel. Native scrolling (swipe on touch, trackpad on desktop),
 * arrows and dots on top. No autoplay: reviews are read, not watched.
 */
export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  /** cardWidth + gap in px, cached on resize so the scroll handler never touches layout. */
  const stepRef = useRef(0);
  const [active, setActive] = useState(0);
  const [perView, setPerView] = useState<number | null>(null);

  const pages = Math.max(1, testimonials.length - (perView ?? 1) + 1);

  const remeasure = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.firstElementChild) return;
    const cardWidth = (track.firstElementChild as HTMLElement).offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0');
    const step = cardWidth + gap;
    stepRef.current = step;
    setPerView(Math.max(1, Math.round((track.clientWidth + gap) / step)));
    setActive(step ? Math.round(track.scrollLeft / step) : 0);
  }, []);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    const step = stepRef.current;
    if (!track || !step) return;
    setActive(Math.round(track.scrollLeft / step));
  }, []);

  useEffect(() => {
    remeasure();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', remeasure);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', remeasure);
    };
  }, [remeasure, onScroll]);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    const step = stepRef.current;
    if (!track || !step) return;
    const clamped = Math.max(0, Math.min(pages - 1, index));
    setActive(clamped);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: clamped * step, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const goPrev = () => {
    if (active <= 0) return;
    scrollTo(active - 1);
  };

  const goNext = () => {
    if (active >= pages - 1) return;
    scrollTo(active + 1);
  };

  if (!testimonials.length) return null;

  return (
    <div className={s.wrap} aria-roledescription="karuzela" aria-label="Opinie klientów">
      <div ref={trackRef} className={s.track}>
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.author + index} className={s.slide}>
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>

      {perView !== null && pages > 1 ? (
        <div className={s.controls}>
          <button
            type="button"
            className={s.arrow}
            aria-label="Poprzednia opinia"
            aria-disabled={active <= 0}
            onClick={goPrev}
          >
            ←
          </button>
          <div className={s.dots} aria-label="Opinie">
            {Array.from({ length: pages }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Opinia ${index + 1}`}
                aria-current={index === active ? 'true' : undefined}
                className={s.dot + (index === active ? ' ' + s.dotActive : '')}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className={s.arrow}
            aria-label="Następna opinia"
            aria-disabled={active >= pages - 1}
            onClick={goNext}
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  );
}
