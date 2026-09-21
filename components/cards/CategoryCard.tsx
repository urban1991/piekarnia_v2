import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '../../lib/types';
import s from './CategoryCard.module.css';

export function CategoryCard({ category, lead }: { category: Category; lead?: string }) {
  return (
    <Link className={s.card} href={'/' + category.slug}>
      <div className={s.media}>
        <Image src={category.cover} alt="" width={640} height={480} />
      </div>
      <div className={s.body}>
        <h3 className={s.title}>{category.name}</h3>
        <p className={s.lead}>{lead ?? category.lead}</p>
        <span className={s.more}>Zobacz {category.name.toLowerCase()} →</span>
      </div>
    </Link>
  );
}
