import Image from 'next/image';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
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
  const hours = store.hours.split(' · ');

  return (
    <article className={s.card}>
      <div className={s.media}>
        {store.image ? <Image src={store.image} alt="" width={1200} height={800} priority /> : null}
      </div>
      <div className={s.body}>
        <div className={s.tags}>
          <Tag tone="solid">Sklep główny</Tag>
          <Tag tone="neutral">{store.label}</Tag>
        </div>
        <h2 className={s.title}>
          {store.city}, {store.street}
        </h2>
        <p className={s.lead}>
          Tu pieczemy i tu jest największy wybór. Pieczywo trafia na półkę prosto z pieca, a rano
          znajdziesz wszystko, co wypiekamy tego dnia.
        </p>
        <dl className={s.hours}>
          {hours.map((line) => {
            const [day, ...rest] = line.split(' ');
            return (
              <div key={line}>
                <dt>{day}</dt>
                <dd>{rest.join(' ')}</dd>
              </div>
            );
          })}
        </dl>
        {disclaimer ? <p className={s.disclaimer}>{disclaimer}</p> : null}
        <div className={s.actions}>
          <Button href={store.maps} target="_blank" rel="noreferrer">
            Nawiguj do sklepu
          </Button>
          <Button href={phoneHref} variant="secondary">
            {phone}
          </Button>
        </div>
      </div>
    </article>
  );
}
