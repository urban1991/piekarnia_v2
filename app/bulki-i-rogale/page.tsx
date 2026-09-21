import { Header } from '../../components/layout/Header';
import { Section } from '../../components/layout/Section';
import { PageHeader } from '../../components/sections/PageHeader';
import { ProductGrid } from '../../components/sections/ProductGrid';
import { CtaBand } from '../../components/sections/CtaBand';
import { contact, productsByCategory } from '../../lib/data';

export const metadata = {
  title: 'Bułki i rogale — Piekarnia Bieżyński',
  description: 'Kajzerki, grahamki, rogale z makiem i bułka alpejska. Świeże od 6:00.',
};

export default function BulkiPage() {
  return (
    <main>
      <Header />
      <PageHeader
        eyebrow="Wypieki"
        title="Bułki i rogale"
        lead="Wyjeżdżają z pieca przed szóstą. Najlepsze, kiedy są jeszcze ciepłe — dlatego warto wpaść wcześnie."
      />
      <Section flush>
        <ProductGrid
          products={productsByCategory('bulki-i-rogale')}
          highlightId="bulka-alpejska"
          highlightLabel="Nasz hit"
          backdrop="/photos/bulki.jpg"
        />
      </Section>
      <div style={{ height: 'var(--section-y)' }} />
      <CtaBand
        title="Zamówienie na większą okazję?"
        text="Komunia, urodziny, firmowe śniadanie. Zadzwońcie dzień wcześniej, a przygotujemy tyle, ile potrzebujecie."
        action={{ href: contact.phoneHref, label: contact.phone }}
      />
    </main>
  );
}
