import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { PageHeader } from '../../../components/sections/PageHeader';
import { ProductGrid } from '../../../components/sections/ProductGrid';
import { CtaBand } from '../../../components/sections/CtaBand';
import { getCategoryBySlug, getProductsByCategory, getSiteSettings } from '../../../lib/data';

export const metadata = {
  title: 'Bułki i rogale — Piekarnia Bieżyński',
  description: 'Kajzerki, grahamki, rogale z makiem i bułka alpejska. Świeże od 6:00.',
};

export default async function BulkiPage() {
  const [settings, products, category] = await Promise.all([
    getSiteSettings(),
    getProductsByCategory('bulki-i-rogale'),
    getCategoryBySlug('bulki-i-rogale'),
  ]);
  return (
    <main>
      <Header phone={settings.phone} phoneHref={settings.phoneHref} />
      <PageHeader
        eyebrow="Wypieki"
        title="Bułki i rogale"
        lead="Wyjeżdżają z pieca przed szóstą. Najlepsze, kiedy są jeszcze ciepłe — dlatego warto wpaść wcześnie."
      />
      <Section flush>
        <ProductGrid
          products={products}
          highlightId="product-bulka-alpejska"
          highlightLabel="Nasz hit"
          backdrop={category?.cover}
        />
      </Section>
      <div style={{ height: 'var(--section-y)' }} />
      <CtaBand
        title="Zamówienie na większą okazję?"
        text="Komunia, urodziny, firmowe śniadanie. Zadzwońcie dzień wcześniej, a przygotujemy tyle, ile potrzebujecie."
        action={{ href: settings.phoneHref, label: settings.phone }}
      />
    </main>
  );
}
