import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { ContactForm } from '../../../components/sections/ContactForm';
import { getSiteSettings } from '../../../lib/data';
import s from './page.module.css';

export const metadata = {
  alternates: { canonical: '/kontakt' },
  title: 'Kontakt — Piekarnia Bieżyński',
  description: 'Telefon 503 083 208, ul. Składowa 3 w Świdnicy. Zamówienia i współpraca hurtowa.',
};

export default async function KontaktPage() {
  const contact = await getSiteSettings();
  return (
    <main>
      <Header phone={contact.phone} phoneHref={contact.phoneHref} />
      <Section>
        <div className={s.layout}>
          <div>
            <SectionHeading
              eyebrow="Kontakt"
              title="Napisz albo zadzwoń"
              lead="Większe zamówienie na uroczystość, pytanie o skład albo współpraca hurtowa? Odbieramy od 6:00."
            />
            <dl className={s.details}>
              <div>
                <dt className={s.label}>Telefon</dt>
                <dd className={s.value}>
                  <a href={contact.phoneHref}>{contact.phone}</a>
                </dd>
              </div>
              <div>
                <dt className={s.label}>Piekarnia</dt>
                <dd>Piekarnia Bieżyński, {contact.address}</dd>
              </div>
              <div>
                <dt className={s.label}>Social</dt>
                <dd className={s.social}>
                  <a href={contact.facebook}>Facebook</a>
                  <a href={contact.instagram}>Instagram</a>
                </dd>
              </div>
            </dl>
            {!contact.email ? <p className={s.todo}>adres e-mail i NIP — do uzupełnienia</p> : null}
          </div>
          <ContactForm />
        </div>
      </Section>
    </main>
  );
}
