import Image from 'next/image';
import s from './InstagramGrid.module.css';

export function InstagramGrid({ images, count = 6 }: { images: string[]; count?: number }) {
  return (
    <div className={s.grid}>
      {images.slice(0, count).map((src) => (
        <Image key={src} src={src} alt="" width={400} height={400} />
      ))}
    </div>
  );
}
