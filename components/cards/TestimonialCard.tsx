import type { Testimonial } from '../../lib/types';
import s from './TestimonialCard.module.css';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className={s.card}>
      <div className={s.mark} aria-hidden="true">
        “
      </div>
      <blockquote className={s.text}>{testimonial.text}</blockquote>
      <figcaption className={s.author}>{testimonial.author}</figcaption>
    </figure>
  );
}
