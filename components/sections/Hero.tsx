import Image from 'next/image';
import { Button } from '../ui/Button';
import { Container } from '../layout/Container';
import s from './Hero.module.css';

export type HeroStat = { value: string; label: string };

/** Full-bleed hero: photo behind a dark gradient, white copy, stats and an optional floating badge. */
export function Hero({
  eyebrow,
  title,
  lead,
  image,
  stats = [],
  badge,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  stats?: HeroStat[];
  badge?: { mark: string; title: string; text: string };
}) {
  return (
    <section className={s.hero}>
      {image ? <Image src={image} alt="" fill priority sizes="100vw" className={s.photo} /> : null}
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

          <div className={s.bottom}>
            {stats.length ? (
              <dl className={s.stats}>
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className={s.statValue}>{stat.value}</dt>
                    <dd className={s.statLabel}>{stat.label}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {badge ? (
              <div className={s.badge}>
                <span className={s.badgeMark} aria-hidden="true">
                  {badge.mark}
                </span>
                <span>
                  <span className={s.badgeTitle}>{badge.title}</span>
                  <span className={s.badgeText}>{badge.text}</span>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
