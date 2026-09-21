import { Header } from '../../components/layout/Header';
import { Section } from '../../components/layout/Section';
import { PageHeader } from '../../components/sections/PageHeader';
import { ProductGrid } from '../../components/sections/ProductGrid';
import { CtaBand } from '../../components/sections/CtaBand';
import { contact, filtersFor, productsByCategory } from '../../lib/data';

export const metadata = {
  title: 'Chleby — Piekarnia Bieżyński',
  description: 'Chleby na zakwasie, żytnie, pszenne i z dodatkami. 26 rodzajów wypiekanych codziennie.',
};

export default function ChlebyPage() {
  return (
    <main>
      <Header />
      <PageHeader
        eyebrow="Wypieki · 26 rodzajów"
        title="Chleby"
        lead="Większość naszych chlebów rośnie na własnym zakwasie żytnim. Dlatego długo zostają świeże i dobrze się kroją także trzeciego dnia."
      />
      <Section flush>
        <ProductGrid
          products={productsByCategory('chleby')}
          filters={filtersFor('chleby')}
          backdrop="/photos/hero-chleb.jpg"
        />
      </Section>
      <div style={{ height: 'var(--section-y)' }} />
      <CtaBand
        title="Pełna oferta w katalogu"
        text="Wszystkie chleby, bułki i wypieki z opisami i wartościami odżywczymi."
        action={{ href: contact.catalogPdf, label: 'Pobierz katalog PDF' }}
      />
    </main>
  );
}
