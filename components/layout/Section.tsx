import type { ReactNode } from 'react';
import { Container } from './Container';
import s from './Section.module.css';

export function Section({
  children,
  tone = 'cream',
  flush,
  id,
}: {
  children: ReactNode;
  tone?: 'cream' | 'surface' | 'brand';
  flush?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={[s.section, s[tone], flush ? s.flush : ''].join(' ').trim()}>
      <Container>{children}</Container>
    </section>
  );
}
