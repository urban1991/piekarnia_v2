import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { PageHeader } from '../../../components/sections/PageHeader';
import { ProductGrid } from '../../../components/sections/ProductGrid';
import { CtaBand } from '../../../components/sections/CtaBand';
import { getCategoryBySlug, getFiltersFor, getProductsByCategory, getSiteSettings } from '../../../lib/data';

export const metadata = {
  alternates: { canonical: '/chleby' },
  title: 'Chleby — Piekarnia Bieżyński',
  description: 'Chleby na zakwasie, żytnie, pszenne i z dodatkami. 26 rodzajów wypiekanych codziennie.',
};

export default async function ChlebyPage() {
  const [settings, products, filters, category] = await Promise.all([
    getSiteSettings(),
    getProductsByCategory('chleby'),
    getFiltersFor('chleby'),
    getCategoryBySlug('chleby'),
  ]);
  return (
    <main>
      <Header phone={settings.phone} phoneHref={settings.phoneHref} />
      <PageHeader
        eyebrow={`Wypieki · ${products.length} rodzajów`}
        title="Chleby"
        lead="Większość naszych chlebów rośnie na własnym zakwasie żytnim. Dlatego długo zostają świeże i dobrze się kroją także trzeciego dnia."
      />
      <Section flush>
        <ProductGrid products={products} filters={filters} backdrop={category?.cover} />
      </Section>
      <div style={{ height: 'var(--section-y)' }} />
      <CtaBand
        title="Pełna oferta w katalogu"
        text="Wszystkie chleby, bułki i wypieki z opisami i wartościami odżywczymi."
        action={{ href: settings.catalogPdf, label: 'Pobierz katalog PDF' }}
      />
    </main>
  );
}
