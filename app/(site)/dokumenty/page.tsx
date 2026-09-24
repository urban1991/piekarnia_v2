import Link from 'next/link';
import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { PageHeader } from '../../../components/sections/PageHeader';
import { getSiteSettings } from '../../../lib/data';
import s from './page.module.css';

export const metadata = {
  alternates: { canonical: '/dokumenty' },
  title: 'Dokumenty — Piekarnia Bieżyński',
  description: 'Nota prawna i polityka prywatności Piekarni Bieżyński.',
};

const documents = [
  {
    title: 'Polityka prywatności',
    text: 'Jakie dane przetwarzamy, gdy odwiedzasz stronę albo się z nami kontaktujesz, i jakie masz prawa. Także o plikach cookies — strona ich nie używa.',
    href: '/polityka-prywatnosci',
  },
  {
    title: 'Nota prawna',
    text: 'Kto prowadzi stronę, dane spółki i zasady korzystania z serwisu.',
    href: '/nota-prawna',
  },
];

export default async function DokumentyPage() {
  const settings = await getSiteSettings();
  return (
    <main>
      <Header phone={settings.phone} phoneHref={settings.phoneHref} />
      <PageHeader eyebrow="Dokumenty" title="Nota prawna i prywatność" lead="Zasady korzystania ze strony i to, jak dbamy o Twoje dane." />

      <Section flush>
        <div className={s.cards}>
          {documents.map((doc) => (
            <Link key={doc.href} className={s.card} href={doc.href}>
              <span className={s.cardTitle}>{doc.title}</span>
              <span className={s.cardText}>{doc.text}</span>
              <span className={s.cardLink}>Czytaj →</span>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
