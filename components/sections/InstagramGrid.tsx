import Image from 'next/image';
import { gallery } from '../../lib/data';
import s from './InstagramGrid.module.css';

export function InstagramGrid({ count = 6 }: { count?: number }) {
  return (
    <div className={s.grid}>
      {gallery.slice(0, count).map((src) => (
        <Image key={src} src={src} alt="" width={400} height={400} />
      ))}
    </div>
  );
}
