import type { ReactNode } from 'react';
import s from './Grid.module.css';

export function Grid({ cols = 3, children }: { cols?: 2 | 3 | 4 | 6; children: ReactNode }) {
  return <div className={s.grid + ' ' + s['cols' + cols]}>{children}</div>;
}
