import Link from 'next/link';
import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Button } from '../../../components/ui/Button';
import { CopyButton } from '../../../components/ui/CopyButton';
import { getSiteSettings, getStores } from '../../../lib/data';
import { isOpen, todayInWarsaw } from '../../../lib/opening';
import s from './page.module.css';

export const metadata = {
  alternates: { canonical: '/kontakt' },
  title: 'Kontakt — Piekarnia Bieżyński',
  description: 'Telefon 503 083 208, ul. Składowa 3 w Świdnicy. Zamówienia na uroczystości, pytania o skład i współpraca hurtowa.',
};

// a shop appears in the list below from its opening day
export const revalidate = 3600;

const topics = [
  {
    title: 'Zamówienia na uroczystości',
    text: 'Więcej chlebów, bułek albo ciast na wesele, komunię czy spotkanie w firmie.',
  },
  {
    title: 'Skład i alergeny',
    text: 'Powiemy, co jest w środku każdego wypieku.',
  },
  {
    title: 'Współpraca hurtowa',
    text: 'Dostarczamy pieczywo do sklepów i gastronomii w promieniu 100 km od Świdnicy.',
  },
];

export default async function KontaktPage() {
  const [contact, stores] = await Promise.all([getSiteSettings(), getStores()]);
  const today = todayInWarsaw();
  const openStores = stores.filter((store) => isOpen(store, today));

  return (
    <main>
      <Header phone={contact.phone} phoneHref={contact.phoneHref} />
      <Section>
        <div className={s.layout}>
          <div className={s.primary}>
            <SectionHeading
              eyebrow="Kontakt"
              title="Zadzwoń albo napisz"
              lead="Najszybciej załatwisz sprawę telefonicznie — odbieramy od 6:00."
            />

            <Button href={contact.phoneHref} className={s.call}>
              Zadzwoń: {contact.phone}
            </Button>

            <dl className={s.details}>
              {contact.email ? (
                <div>
                  <dt className={s.label}>E-mail</dt>
                  <dd className={s.emailRow}>
                    <a className={s.email} href={`mailto:${contact.email}`}>
                      {contact.email}
                    </a>
                    <CopyButton value={contact.email} />
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className={s.label}>Piekarnia i sklep główny</dt>
                <dd>Piekarnia Bieżyński, {contact.address}</dd>
              </div>
              <div>
                <dt className={s.label}>Media społecznościowe</dt>
                <dd className={s.social}>
                  <a href={contact.facebook} target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                  <a href={contact.instagram} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className={s.aside}>
            <section className={s.card} aria-labelledby="kontakt-sprawy">
              <h2 id="kontakt-sprawy" className={s.cardTitle}>
                W czym pomożemy
              </h2>
              <ul className={s.topics}>
                {topics.map((topic) => (
                  <li key={topic.title}>
                    <strong>{topic.title}</strong>
                    <span>{topic.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={s.card} aria-labelledby="kontakt-sklepy">
              <h2 id="kontakt-sklepy" className={s.cardTitle}>
                Nasze sklepy
              </h2>
              <ul className={s.stores}>
                {openStores.map((store) => (
                  <li key={store.id}>
                    <span>
                      <span className={s.city}>{store.city}</span> {store.street}
                    </span>
                    <a href={store.maps} target="_blank" rel="noreferrer">
                      Wyznacz trasę →
                    </a>
                  </li>
                ))}
              </ul>
              <Link className={s.more} href="/sklepy">
                Godziny otwarcia i mapa →
              </Link>
            </section>
          </div>
        </div>
      </Section>
    </main>
  );
}
