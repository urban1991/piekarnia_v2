import type { ElementType, ReactNode } from 'react';
import s from './Container.module.css';

export function Container({
  children,
  as: Tag = 'div',
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return <Tag className={s.container + (className ? ' ' + className : '')}>{children}</Tag>;
}
