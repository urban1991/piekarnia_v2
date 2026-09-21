import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Tag } from '../ui/Tag';
import { NutritionDisclosure } from './NutritionDisclosure';
import type { Product } from '../../lib/types';
import s from './ProductCard.module.css';

export function ProductCard({
  product,
  badge,
  backdrop,
}: {
  product: Product;
  badge?: string;
  /** URL of a bakery photo shown, veiled, behind the cut-out product PNG */
  backdrop?: string;
}) {
  const hasPhoto = !!product.photo;
  const mediaStyle =
    backdrop && !hasPhoto
      ? ({ ['--media-photo' as string]: 'url(' + backdrop + ')' } as CSSProperties)
      : undefined;
  const mediaClass = [
    s.media,
    hasPhoto ? s.mediaCover : '',
    backdrop && !hasPhoto ? s.mediaPhoto : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={s.card}>
      <div className={mediaClass} style={mediaStyle}>
        {hasPhoto ? (
          <Image
            src={product.photo!}
            alt={product.name}
            width={640}
            height={480}
          />
        ) : product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={520}
            height={400}
          />
        ) : null}
        {badge ? (
          <span className={s.badge}>
            <Tag tone="solid">{badge}</Tag>
          </span>
        ) : null}
      </div>

      <div className={s.body}>
        <div className={s.head}>
          <h3>{product.name}</h3>
          {product.weight ? <span className={s.weight}>{product.weight}</span> : null}
        </div>

        <p className={s.desc}>{product.description}</p>

        {product.tags.length ? (
          <div className={s.tags}>
            {product.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        ) : null}

        {product.nutrition ? <NutritionDisclosure nutrition={product.nutrition} /> : null}
      </div>
    </article>
  );
}
