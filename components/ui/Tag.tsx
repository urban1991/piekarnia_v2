import type { ReactNode } from 'react';
import s from './Tag.module.css';

export function Tag({
  children,
  tone = 'brand',
}: {
  children: ReactNode;
  tone?: 'brand' | 'neutral' | 'solid';
}) {
  return <span className={s.tag + ' ' + s[tone]}>{children}</span>;
}
