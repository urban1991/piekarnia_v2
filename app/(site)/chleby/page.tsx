import type { Metadata } from 'next';
import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { PageHeader } from '../../../components/sections/PageHeader';
import { ProductGrid } from '../../../components/sections/ProductGrid';
import { CtaBand } from '../../../components/sections/CtaBand';
import { getCategoryBySlug, getFiltersFor, getProductsByCategory, getSiteSettings } from '../../../lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('chleby');
  return {
    alternates: { canonical: '/chleby' },
    title: `${category?.name ?? 'Chleby'} — Piekarnia Bieżyński`,
    description: category?.intro || 'Chleby na zakwasie, żytnie, pszenne i z dodatkami, wypiekane codziennie.',
  };
}

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
        title={category?.name ?? 'Chleby'}
        lead={category?.intro}
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
