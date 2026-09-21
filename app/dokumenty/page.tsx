import { Header } from '../../components/layout/Header';
import { Section } from '../../components/layout/Section';
import { PageHeader } from '../../components/sections/PageHeader';
import { contact } from '../../lib/data';
import s from './page.module.css';

export const metadata = {
  title: 'Nota prawna i polityki — Piekarnia Bieżyński',
  description: 'Nota prawna, polityka prywatności i polityka cookies.',
};

const documents = [
  { title: 'Nota prawna', text: 'Dane firmy, warunki korzystania z serwisu.', href: contact.legal.nota },
  {
    title: 'Polityka prywatności',
    text: 'Jak przetwarzamy dane osobowe i jakie masz prawa.',
    href: contact.legal.privacy,
  },
  { title: 'Polityka cookies', text: 'Jakich plików cookie używamy i jak je wyłączyć.', href: contact.legal.cookies },
];

const toc = [
  'Administrator danych',
  'Zakres przetwarzanych danych',
  'Cele i podstawy prawne',
  'Odbiorcy danych',
  'Okres przechowywania',
  'Twoje prawa',
  'Pliki cookie',
  'Kontakt',
];

export default function DokumentyPage() {
  return (
    <main>
      <Header />
      <PageHeader
        eyebrow="Dokumenty"
        title="Nota prawna i polityki"
        lead="Dokumenty do wglądu i pobrania. Wersja obowiązująca to plik PDF — tekst na stronie jest tożsamy z jego treścią."
      />

      <Section flush>
        <div className={s.cards}>
          {documents.map((doc) => (
            <a key={doc.title} className={s.card} href={doc.href}>
              <span className={s.cardTitle}>{doc.title}</span>
              <span className={s.cardText}>{doc.text}</span>
              <span className={s.cardLink}>Otwórz PDF →</span>
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <div className={s.layout}>
          <nav className={s.toc} aria-label="Na tej stronie">
            <span className={s.tocTitle}>Na tej stronie</span>
            {toc.map((item, index) => (
              <a key={item} href={'#sekcja-' + (index + 1)}>
                {index + 1}. {item}
              </a>
            ))}
          </nav>

          <article className={s.article}>
            <p className={s.todo}>treść prawna do wklejenia z obecnych plików PDF</p>

            <section id="sekcja-1">
              <h2>1. Administrator danych</h2>
              <p>
                Administratorem danych osobowych jest Piekarnia Bieżyński z siedzibą w Świdnicy, ul. Składowa
                3. Kontakt w sprawach danych: tel. {contact.phone}.
              </p>
            </section>

            <section id="sekcja-2">
              <h2>2. Zakres przetwarzanych danych</h2>
              <ul>
                <li>imię i dane kontaktowe podane w formularzu,</li>
                <li>treść wiadomości,</li>
                <li>adres IP i informacje o przeglądarce.</li>
              </ul>
            </section>

            <section id="sekcja-7">
              <h2>7. Pliki cookie</h2>
              <div className={s.table}>
                <div className={s.tableHead}>
                  <span>Nazwa</span>
                  <span>Cel</span>
                  <span>Czas</span>
                </div>
                <div className={s.tableRow}>
                  <span>cookie_consent</span>
                  <span>Zapis zgody</span>
                  <span>12 miesięcy</span>
                </div>
                <div className={s.tableRow}>
                  <span>_ga</span>
                  <span>Statystyki odwiedzin</span>
                  <span>24 miesiące</span>
                </div>
              </div>
            </section>
          </article>
        </div>
      </Section>
    </main>
  );
}
