import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageHeader } from '../components/sections/PageHeader';
import { Button } from '../components/ui/Button';
import { getSiteSettings } from '../lib/data';
import s from './not-found.module.css';

export const metadata = {
  title: 'Nie ma takiej strony — Piekarnia Bieżyński',
};

/**
 * Site-wide 404. It renders under the root layout only (outside the (site) group),
 * so the header and footer are added here explicitly.
 */
export default async function NotFound() {
  const settings = await getSiteSettings();
  return (
    <>
      <main>
        <Header phone={settings.phone} phoneHref={settings.phoneHref} />
        <PageHeader
          centered
          eyebrow="Błąd 404"
          title="Tej strony u nas nie ma"
          lead="Może zmieniła adres przy przeprowadzce na nową stronę, a może w linku jest literówka. Chleb na pewno jeszcze jest."
        />
        <div className={s.actions}>
          <Button href="/chleby">Zobacz wypieki</Button>
          <Button href="/sklepy" variant="secondary">
            Nasze sklepy
          </Button>
          <Button href="/" variant="secondary">
            Strona główna
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
