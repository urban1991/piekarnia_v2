import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import s from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'inverse' | 'ghostOnDark';

type Common = {
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  block?: boolean;
  children: ReactNode;
  className?: string;
};

type AsLink = Common & { href: string } & Omit<ComponentProps<typeof Link>, 'href' | 'className'>;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<'button'>, 'className'>;

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

export function Button(props: AsLink | AsButton) {
  const { variant = 'primary', size = 'md', block, children, className, ...rest } = props as AsLink;
  const classes = cls(s.base, s[variant], s[size], block && s.block, className);

  if ('href' in props && props.href) {
    return (
      <Link className={classes} {...(rest as AsLink)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...(rest as unknown as AsButton)}>
      {children}
    </button>
  );
}
