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
  const [active, setActive] = useState(0);
  const [perView, setPerView] = useState(1);

  const pages = Math.max(1, testimonials.length - perView + 1);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.firstElementChild) return;
    const cardWidth = (track.firstElementChild as HTMLElement).offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0');
    setPerView(Math.max(1, Math.round((track.clientWidth + gap) / (cardWidth + gap))));
    setActive(Math.round(track.scrollLeft / (cardWidth + gap)));
  }, []);

  useEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => measure();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track || !track.firstElementChild) return;
    const cardWidth = (track.firstElementChild as HTMLElement).offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0');
    const clamped = Math.max(0, Math.min(pages - 1, index));
    setActive(clamped);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: clamped * (cardWidth + gap), behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  if (!testimonials.length) return null;

  return (
    <div className={s.wrap}>
      <div ref={trackRef} className={s.track} aria-live="polite">
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.author + index} className={s.slide}>
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>

      {pages > 1 ? (
        <div className={s.controls}>
          <button
            type="button"
            className={s.arrow}
            aria-label="Poprzednia opinia"
            onClick={() => scrollTo(active - 1)}
            disabled={active <= 0}
          >
            ←
          </button>
          <div className={s.dots} role="tablist" aria-label="Opinie">
            {Array.from({ length: pages }).map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Opinia ${index + 1}`}
                className={s.dot + (index === active ? ' ' + s.dotActive : '')}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className={s.arrow}
            aria-label="Następna opinia"
            onClick={() => scrollTo(active + 1)}
            disabled={active >= pages - 1}
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  );
}
