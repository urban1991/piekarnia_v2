import { getStores } from '../../lib/data';
import { Tag } from '../ui/Tag';
import { openingBadge, todayInWarsaw } from '../../lib/opening';
import s from './StoreList.module.css';

export async function StoreList({ disclaimer }: { disclaimer?: string }) {
  const stores = await getStores();
  const ordered = [...stores].sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
  const today = todayInWarsaw();

  return (
    <div>
      <div className={s.list}>
        {ordered.map((store) => {
          const main = store.featured;
          const badge = openingBadge(store, today);
          return (
            <div key={store.id} className={s.row + (main ? ' ' + s.main : '')}>
              <div>
                <div className={s.street}>
                  <span className={s.city}>{store.city}</span>
                  <span>{store.street}</span>
                  {main ? <Tag tone="solid">Sklep główny</Tag> : null}
                  {badge ? <Tag tone="brand">{badge}</Tag> : null}
                </div>
                <div className={s.label}>{store.label}</div>
              </div>
              <div className={s.hours}>{store.hours}</div>
              {main ? (
                <a className={s.link} href={store.maps} target="_blank" rel="noreferrer">
                  Nawiguj →
                </a>
              ) : null}
            </div>
          );
        })}
      </div>
      {disclaimer ? <p className={s.disclaimer}>{disclaimer}</p> : null}
    </div>
  );
}
