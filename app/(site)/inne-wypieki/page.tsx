import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { PageHeader } from '../../../components/sections/PageHeader';
import { ProductGrid } from '../../../components/sections/ProductGrid';
import { CtaBand } from '../../../components/sections/CtaBand';
import { getProductsByCategory, getSiteSettings } from '../../../lib/data';

export const metadata = {
  title: 'Inne wypieki — Piekarnia Bieżyński',
  description: 'Chałki, pączki, drożdżówki, makowce i babki. Część wypiekamy sezonowo.',
};

export default async function InneWypiekiPage() {
  const [settings, products] = await Promise.all([
    getSiteSettings(),
    getProductsByCategory('inne-wypieki'),
  ]);
  return (
    <main>
      <Header phone={settings.phone} phoneHref={settings.phoneHref} />
      <PageHeader
        eyebrow="Wypieki"
        title="Inne wypieki"
        lead="Chałki, pączki, drożdżówki, makowce i babki. Część wypiekamy tylko w wybrane dni albo sezonowo — najlepiej zapytać w sklepie."
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
