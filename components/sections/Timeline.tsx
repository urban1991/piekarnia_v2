import { getHistory } from '../../lib/data';
import s from './Timeline.module.css';

export async function Timeline() {
  const history = await getHistory();
  return (
    <div className={s.grid}>
      {history.map((entry) => (
        <div key={entry.year} className={s.item}>
          <div className={s.year}>{entry.year}</div>
          <div>
            <div className={s.title}>{entry.title}</div>
            <p className={s.text}>{entry.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
