import type { Metadata } from 'next';
import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { PageHeader } from '../../../components/sections/PageHeader';
import { ProductGrid } from '../../../components/sections/ProductGrid';
import { CtaBand } from '../../../components/sections/CtaBand';
import { getCategoryBySlug, getProductsByCategory, getSiteSettings } from '../../../lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('inne-wypieki');
  return {
    alternates: { canonical: '/inne-wypieki' },
    title: `${category?.name ?? 'Inne wypieki'} — Piekarnia Bieżyński`,
    description: category?.intro || 'Chałki, pączki, drożdżówki, makowce i babki. Część wypiekamy sezonowo.',
  };
}

export default async function InneWypiekiPage() {
  const [settings, products, category] = await Promise.all([
    getSiteSettings(),
    getProductsByCategory('inne-wypieki'),
    getCategoryBySlug('inne-wypieki'),
  ]);
  return (
    <main>
      <Header phone={settings.phone} phoneHref={settings.phoneHref} />
      <PageHeader
        eyebrow="Wypieki"
        title={category?.name ?? 'Inne wypieki'}
        lead={category?.intro}
      />
      <Section flush>
        <ProductGrid products={products} />
      </Section>
      <div style={{ height: 'var(--section-y)' }} />
      <CtaBand
        title="Ciasto na niedzielę albo uroczystość"
        text="Zamówienia przyjmujemy telefonicznie, najlepiej dwa dni wcześniej."
        action={{ href: settings.phoneHref, label: 'Zadzwoń: ' + settings.phone }}
      />
    </main>
  );
}
