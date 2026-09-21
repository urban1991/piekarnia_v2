import Image from 'next/image';
import { Button } from '../ui/Button';
import { Container } from '../layout/Container';
import { isSanityUrl, sanityImageLoader } from '../../sanity/image';
import s from './Hero.module.css';

export type HeroStat = { value: string; label: string };

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
    <Container>
      <div className={s.hero}>
        <div>
          <div className={s.eyebrow}>{eyebrow}</div>
          <h1 className={s.title}>{title}</h1>
          <p className={s.lead}>{lead}</p>
          <div className={s.actions}>
            <Button href="/chleby">Zobacz wypieki</Button>
            <Button href="/sklepy" variant="secondary">
              Nasze sklepy
            </Button>
          </div>
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
        </div>

        <div className={s.media}>
          <Image
            src={image}
            alt=""
            width={900}
            height={1120}
            priority
            loader={isSanityUrl(image) ? sanityImageLoader : undefined}
          />
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
  );
}
