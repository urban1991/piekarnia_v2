import { Header } from '../../components/layout/Header';
import { Section } from '../../components/layout/Section';
import { PageHeader } from '../../components/sections/PageHeader';
import { ProductGrid } from '../../components/sections/ProductGrid';
import { CtaBand } from '../../components/sections/CtaBand';
import { contact, productsByCategory } from '../../lib/data';

export const metadata = {
  title: 'Inne wypieki — Piekarnia Bieżyński',
  description: 'Chałki, pączki, drożdżówki, makowce i babki. Część wypiekamy sezonowo.',
};

export default function InneWypiekiPage() {
  return (
    <main>
      <Header />
      <PageHeader
        eyebrow="Wypieki"
        title="Inne wypieki"
        lead="Chałki, pączki, drożdżówki, makowce i babki. Część wypiekamy tylko w wybrane dni albo sezonowo — najlepiej zapytać w sklepie."
      />
      <Section flush>
        <ProductGrid products={productsByCategory('inne-wypieki')} />
      </Section>
      <div style={{ height: 'var(--section-y)' }} />
      <CtaBand
        title="Ciasto na niedzielę albo uroczystość"
        text="Zamówienia przyjmujemy telefonicznie, najlepiej dwa dni wcześniej."
        action={{ href: contact.phoneHref, label: 'Zadzwoń: ' + contact.phone }}
      />
    </main>
  );
}
