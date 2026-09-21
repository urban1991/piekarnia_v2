import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { PageHeader } from '../../../components/sections/PageHeader';
import { MapEmbed } from '../../../components/sections/MapEmbed';
import { CtaBand } from '../../../components/sections/CtaBand';
import { Grid } from '../../../components/ui/Grid';
import { StoreCard } from '../../../components/cards/StoreCard';
import { getSiteSettings, getStores } from '../../../lib/data';
import s from './page.module.css';

export const metadata = {
  title: 'Sklepy firmowe — Piekarnia Bieżyński',
  description: 'Cztery sklepy firmowe: Świdnica (Składowa 3, Kazimierza Wielkiego 5), Jaworzyna Śląska, Bielawa.',
};

export default async function SklepyPage() {
  const [settings, stores] = await Promise.all([getSiteSettings(), getStores()]);
  return (
    <main>
      <Header phone={settings.phone} phoneHref={settings.phoneHref} />
      <PageHeader
        eyebrow="Sklepy firmowe"
        title="Gdzie nas znaleźć"
        lead="Cztery sklepy w Świdnicy, Jaworzynie Śląskiej i Bielawie. Wszędzie to samo pieczywo — z jednego pieca na Składowej."
      />

      <Section flush>
        <MapEmbed />
        <div className={s.cards}>
          <Grid cols={4}>
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </Grid>
        </div>
        <p className={s.disclaimer}>
          godziny przykładowe — obecna strona ich nie podaje, prosimy o potwierdzenie
        </p>
      </Section>

      <div style={{ height: 'var(--section-y)' }} />

      <CtaBand
        title="Współpraca hurtowa"
        text="Dostarczamy do sklepów i punktów gastronomicznych w promieniu 100 km od Świdnicy."
        action={{ href: settings.phoneHref, label: 'Porozmawiajmy' }}
      />
    </main>
  );
}
