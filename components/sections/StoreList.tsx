import { getStores } from '../../lib/data';
import { Tag } from '../ui/Tag';
import s from './StoreList.module.css';

const MAIN_STORE_ID = 'store-swidnica-skladowa';

export async function StoreList({ disclaimer }: { disclaimer?: string }) {
  const stores = await getStores();
  const ordered = [...stores].sort((a, b) => (a.id === MAIN_STORE_ID ? -1 : b.id === MAIN_STORE_ID ? 1 : 0));

  return (
    <div>
      <div className={s.list}>
        {ordered.map((store) => {
          const main = store.id === MAIN_STORE_ID;
          return (
            <div key={store.id} className={s.row + (main ? ' ' + s.main : '')}>
              <div>
                <div className={s.street}>
                  {store.city}, {store.street}
                  {main ? <Tag tone="solid">Sklep główny</Tag> : null}
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
