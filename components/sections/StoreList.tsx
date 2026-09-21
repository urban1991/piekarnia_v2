import { stores } from '../../lib/data';
import s from './StoreList.module.css';

export function StoreList({ disclaimer }: { disclaimer?: string }) {
  return (
    <div>
      <div className={s.list}>
        {stores.map((store) => (
          <div key={store.id} className={s.row}>
            <div>
              <div className={s.street}>
                {store.city}, {store.street}
              </div>
              <div className={s.label}>{store.label}</div>
            </div>
            <div className={s.hours}>{store.hours}</div>
          </div>
        ))}
      </div>
      {disclaimer ? <p className={s.disclaimer}>{disclaimer}</p> : null}
    </div>
  );
}
