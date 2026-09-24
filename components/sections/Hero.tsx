import Image from 'next/image';
import { Button } from '../ui/Button';
import { Container } from '../layout/Container';
import s from './Hero.module.css';

/** Full-bleed hero: photo behind a dark gradient, eyebrow, headline, one line of copy and two actions. */
export function Hero({
  eyebrow,
  title,
  lead,
  image,
  imagePosition,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  /** CSS object-position keeping the photo's focal point in frame, e.g. '62% 30%' */
  imagePosition?: string;
}) {
  return (
    <section className={s.hero}>
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className={s.photo}
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
        />
      ) : null}
      <div className={s.overlay} />
      <Container>
        <div className={s.inner}>
          <div className={s.copy}>
            <div className={s.eyebrow}>{eyebrow}</div>
            <h1 className={s.title}>{title}</h1>
            <p className={s.lead}>{lead}</p>
            <div className={s.actions}>
              <Button href="/chleby">Zobacz wypieki</Button>
              <Button href="/sklepy" variant="ghostOnDark">
                Nasze sklepy
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
