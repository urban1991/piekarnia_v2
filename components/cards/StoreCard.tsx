import Image from 'next/image';
import { Tag } from '../ui/Tag';
import { openingBadge, todayInWarsaw } from '../../lib/opening';
import type { Store } from '../../lib/types';
import s from './StoreCard.module.css';

/** City is the headline: the bakery has shops in three towns, so the town must never be missed. */
export function StoreCard({ store }: { store: Store }) {
  const badge = openingBadge(store, todayInWarsaw());
  return (
    <article className={s.card}>
      <div className={s.media}>
        {store.image ? (
          <>
            <Image src={store.image} alt="" width={520} height={340} />
            <span className={s.cityBadge} aria-hidden="true">
              {store.city}
            </span>
          </>
        ) : null}
      </div>
      <div className={s.body}>
        {badge ? (
          <div className={s.badge}>
            <Tag tone="solid">{badge}</Tag>
          </div>
        ) : null}
        <h3 className={s.city}>{store.city}</h3>
        <div className={s.street}>{store.street}</div>
        <div className={s.label}>{store.label}</div>
        <p className={s.hours}>{store.hours}</p>
        {store.maps ? (
          <a className={s.link} href={store.maps} target="_blank" rel="noreferrer">
            Nawiguj →
          </a>
        ) : null}
      </div>
    </article>
  );
}
