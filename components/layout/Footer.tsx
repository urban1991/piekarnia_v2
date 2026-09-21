import Image from 'next/image';
import Link from 'next/link';
import { Container } from './Container';
import { getSiteSettings } from '../../lib/data';
import s from './Footer.module.css';

export async function Footer() {
  const contact = await getSiteSettings();
  return (
    <footer className={s.footer}>
      <Container>
        <div className={s.grid}>
          <div>
            <div className={s.brand}>
              <Image className={s.logo} src="/logo.png" alt="" width={48} height={48} />
              <span className={s.wordmark}>Piekarnia Bieżyński</span>
            </div>
            <p className={s.about}>Rodzinna piekarnia ze Świdnicy. Pieczemy codziennie od świtu.</p>
          </div>

          <div className={s.col}>
            <b>Wypieki</b>
            <Link href="/chleby">Chleby</Link>
            <Link href="/bulki-i-rogale">Bułki i rogale</Link>
            <Link href="/inne-wypieki">Inne wypieki</Link>
            <a href={contact.catalogPdf}>Katalog PDF</a>
          </div>

          <div className={s.col}>
            <b>Piekarnia</b>
            <Link href="/o-nas">O nas</Link>
            <Link href="/sklepy">Sklepy firmowe</Link>
            <Link href="/kontakt">Kontakt</Link>
          </div>

          <div className={s.col}>
            <b>Kontakt</b>
            <a className={s.strong} href={contact.phoneHref}>
              tel. {contact.phone}
            </a>
            <span>{contact.address}</span>
            <div className={s.social}>
              <a href={contact.facebook}>Facebook</a>
              <a href={contact.instagram}>Instagram</a>
            </div>
          </div>
        </div>

        <div className={s.bottom}>
          <span>© {new Date().getFullYear()} Piekarnia Bieżyński</span>
          <div className={s.legal}>
            <Link href="/dokumenty">Nota prawna</Link>
            <Link href="/dokumenty">Polityka prywatności</Link>
            <Link href="/dokumenty">Polityka cookies</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
