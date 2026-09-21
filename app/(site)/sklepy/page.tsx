import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { PageHeader } from '../../../components/sections/PageHeader';
import { FeaturedStore } from '../../../components/sections/FeaturedStore';
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

const MAIN_STORE_ID = 'store-swidnica-skladowa';

export default async function SklepyPage() {
  const [settings, stores] = await Promise.all([getSiteSettings(), getStores()]);
  const main = stores.find((store) => store.id === MAIN_STORE_ID) ?? stores[0];
  const others = stores.filter((store) => store.id !== main?.id);

  return (
    <main>
      <Header phone={settings.phone} phoneHref={settings.phoneHref} />
      <PageHeader
        eyebrow="Sklepy firmowe"
        title="Gdzie nas znaleźć"
        lead="Cztery sklepy w Świdnicy, Jaworzynie Śląskiej i Bielawie. Wszędzie to samo pieczywo — z jednego pieca na Składowej."
      />

      <Section flush>
        {main ? (
          <FeaturedStore
            store={main}
          phone={settings.phone}
          phoneHref={settings.phoneHref}
            disclaimer="godziny przykładowe — do potwierdzenia"
          />
        ) : null}
      </Section>

      <Section>
        <SectionHeading eyebrow="Pozostałe sklepy" title="Blisko Ciebie" />
        <div className={s.cards}>
          <Grid cols={3}>
            {others.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </Grid>
        </div>
        <div className={s.map}>
          <MapEmbed />
        </div>
      </Section>

      <CtaBand
        title="Współpraca hurtowa"
        text="Dostarczamy do sklepów i punktów gastronomicznych w promieniu 100 km od Świdnicy."
        action={{ href: settings.phoneHref, label: 'Porozmawiajmy' }}
      />
    </main>
  );
}
