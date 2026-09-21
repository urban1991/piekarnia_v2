'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Container } from './Container';
import s from './Header.module.css';

const links = [
  { href: '/chleby', label: 'Chleby' },
  { href: '/bulki-i-rogale', label: 'Bułki i rogale' },
  { href: '/inne-wypieki', label: 'Inne wypieki' },
  { href: '/o-nas', label: 'O nas' },
  { href: '/sklepy', label: 'Sklepy' },
  { href: '/kontakt', label: 'Kontakt' },
];

/**
 * variant="onHero"  — transparent header over the cream hero on the homepage (Ink text).
 * variant="onDark"  — transparent header over a dark photo (white text).
 */
export function Header({
  variant = 'solid',
  phone,
  phoneHref,
}: {
  variant?: 'solid' | 'onHero' | 'onDark';
  phone: string;
  phoneHref: string;
}) {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);
  const className = [
    s.header,
    variant !== 'solid' ? s.transparent : '',
    variant === 'onDark' ? s.onDark : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={className}>
      <Container>
        <div className={s.inner}>
          <Link className={s.brand} href="/" aria-label="Piekarnia Bieżyński — strona główna">
            <Image className={s.logo} src="/logo.png" alt="" width={56} height={56} priority />
            <span className={s.wordmark}>Piekarnia Bieżyński</span>
          </Link>

          <nav className={s.nav} aria-label="Nawigacja główna">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname.startsWith(link.href) ? s.active : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <a className={s.phone} href={phoneHref}>
            {phone}
          </a>

          <div className={s.mobileActions}>
            <a className={s.iconBtn} href={phoneHref} aria-label={'Zadzwoń ' + phone}>
              tel
            </a>
            <button
              className={s.burger}
              type="button"
              aria-expanded={open}
              aria-label="Menu"
              onClick={() => setOpen(true)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <div className={s.menu} role="dialog" aria-modal="true">
          <div className={s.menuTop}>
            <Image src="/logo.png" alt="" width={44} height={44} />
            <button className={s.burger} type="button" aria-label="Zamknij" onClick={() => setOpen(false)}>
              <span />
              <span />
            </button>
          </div>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname.startsWith(link.href) ? s.menuActive : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a className={s.menuCall} href={phoneHref}>
            Zadzwoń: {phone}
          </a>
        </div>
      ) : null}
    </header>
  );
}
