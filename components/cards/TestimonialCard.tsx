import type { Testimonial } from '../../lib/types';
import s from './TestimonialCard.module.css';

function Stars({ rating }: { rating: number }) {
  const count = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <div className={s.stars} aria-label={`Ocena ${count} na 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < count ? s.starOn : s.starOff} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className={s.card}>
      {testimonial.rating ? (
        <Stars rating={testimonial.rating} />
      ) : (
        <div className={s.mark} aria-hidden="true">
          “
        </div>
      )}
      <blockquote className={s.text}>{testimonial.text}</blockquote>
      <figcaption className={s.author}>
        {testimonial.author}
        {testimonial.source ? <span className={s.source}> · {testimonial.source}</span> : null}
      </figcaption>
    </figure>
  );
}
