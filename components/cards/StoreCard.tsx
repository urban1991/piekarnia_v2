import Image from 'next/image';
import type { Store } from '../../lib/types';
import s from './StoreCard.module.css';

export function StoreCard({ store }: { store: Store }) {
  return (
    <article className={s.card}>
      {store.image ? <Image src={store.image} alt="" width={520} height={340} /> : null}
      <div className={s.body}>
        <div className={s.kicker}>
          {store.city} · {store.label}
        </div>
        <div className={s.street}>{store.street}</div>
        <p className={s.hours}>{store.hours}</p>
        <a className={s.link} href={store.maps} target="_blank" rel="noreferrer">
          Nawiguj →
        </a>
      </div>
    </article>
  );
}
