import type { Metadata } from 'next';
import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { PageHeader } from '../../../components/sections/PageHeader';
import { ProductGrid } from '../../../components/sections/ProductGrid';
import { CtaBand } from '../../../components/sections/CtaBand';
import { getCategoryBySlug, getProductsByCategory, getSiteSettings } from '../../../lib/data';

/** Used when the category document is missing in Studio (it cannot be deleted there, but the dataset could be empty). */
const FALLBACK = { name: 'Bułki i rogale', intro: 'Kajzerki, grahamki, rogale z makiem i bułka alpejska. Świeże od 6:00.' };

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('bulki-i-rogale');
  return {
    alternates: { canonical: '/bulki-i-rogale' },
    title: `${category?.name ?? FALLBACK.name} — Piekarnia Bieżyński`,
    description: category?.intro || FALLBACK.intro,
  };
}

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
        title={category?.name ?? FALLBACK.name}
        lead={category?.intro || FALLBACK.intro}
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
