import Image from 'next/image';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import { parseHours } from '../../lib/hours';
import type { Store } from '../../lib/types';
import s from './FeaturedStore.module.css';

/** Large card for the flagship shop (the one next to the bakery). */
export function FeaturedStore({
  store,
  phone,
  phoneHref,
  disclaimer,
}: {
  store: Store;
  phone: string;
  phoneHref: string;
  disclaimer?: string;
}) {
  const hours = parseHours(store.hours);

  return (
    <article className={s.card}>
      <div className={s.media}>
        {store.image ? (
          <Image
            src={store.image}
            alt=""
            width={1200}
            height={800}
            priority
            sizes="(max-width: 1100px) 100vw, 50vw"
          />
        ) : null}
      </div>
      <div className={s.body}>
        <div className={s.tags}>
          <Tag tone="solid">Sklep główny</Tag>
          <Tag tone="neutral">{store.label}</Tag>
        </div>
        <div className={s.city}>{store.city}</div>
        <h2 className={s.title}>{store.street}</h2>
        <p className={s.lead}>
          Tu pieczemy i tu jest największy wybór. Pieczywo trafia na półkę prosto z pieca, a rano
          znajdziesz wszystko, co wypiekamy tego dnia.
        </p>
        {hours.length ? (
          <dl className={s.hours}>
            {hours.map(({ day, time }) => (
              <div key={day + time}>
                <dt>{day}</dt>
                {time ? <dd>{time}</dd> : null}
              </div>
            ))}
          </dl>
        ) : (
          <p className={s.hoursPlain}>{store.hours}</p>
        )}
        {disclaimer ? <p className={s.disclaimer}>{disclaimer}</p> : null}
        <div className={s.actions}>
          {store.maps ? (
            <Button href={store.maps} target="_blank" rel="noreferrer">
              Nawiguj do sklepu
            </Button>
          ) : null}
          <Button href={phoneHref} variant="secondary">
            {phone}
          </Button>
        </div>
      </div>
    </article>
  );
}
