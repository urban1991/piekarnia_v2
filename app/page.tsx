import { Header } from '../components/layout/Header';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/layout/SectionHeading';
import { Grid } from '../components/ui/Grid';
import { Button } from '../components/ui/Button';
import { Hero } from '../components/sections/Hero';
import { FeatureBand } from '../components/sections/FeatureBand';
import { MapEmbed } from '../components/sections/MapEmbed';
import { StoreList } from '../components/sections/StoreList';
import { InstagramGrid } from '../components/sections/InstagramGrid';
import { CategoryCard } from '../components/cards/CategoryCard';
import { TestimonialCard } from '../components/cards/TestimonialCard';
import { categories, contact, testimonials } from '../lib/data';
import s from './page.module.css';

const features = [
  {
    title: 'Codziennie świeże',
    text: 'Pieczemy na miejscu, każdej nocy. Rano na półkach jest tylko to, co wyszło z pieca kilka godzin wcześniej.',
  },
  {
    title: 'Lokalne surowce',
    text: 'Mąkę bierzemy od młynarzy z okolicy. Krótka droga, znane twarze.',
  },
  {
    title: 'Własne receptury',
    text: 'Każdy wypiek robimy według naszych przepisów. Niektóre są starsze niż sama piekarnia.',
  },
  {
    title: 'Blisko Ciebie',
    text: 'Cztery sklepy firmowe w Świdnicy, Jaworzynie Śląskiej i Bielawie. Zawsze po drodze.',
  },
];

export default function HomePage() {
  return (
    <main>
      <div className={s.heroWrap}>
        <Header variant="onDark" />
        <Hero
          eyebrow="Piekarnia rodzinna od 1991 · Świdnica"
          title="Chleb, który pachnie jak w domu."
          lead="Pieczemy każdej nocy, żeby rano na Waszym stole leżał świeży bochenek. Na własnym zakwasie, z mąki od okolicznych młynarzy, bez pośpiechu."
          image="/photos/piekarnia-1.jpg"
          stats={[
            { value: '4 sklepy', label: 'Świdnica, Jaworzyna, Bielawa' },
            { value: 'od 6:00', label: 'Świeże pieczywo codziennie' },
            { value: 'od 1991', label: 'Trzy dekady w rodzinie' },
          ]}
          badge={{ mark: 'Śr', title: 'Tylko w środy', text: 'Chleb kukurydziany' }}
        />
      </div>

      <Section>
        <SectionHeading
          title="Co dziś wyjęliśmy z pieca"
          action={{ href: contact.catalogPdf, label: 'Katalog PDF →' }}
        />
        <Grid cols={3}>
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </Grid>
      </Section>

      <Section tone="surface">
        <div className={s.about}>
          <div className={s.aboutImages}>
            <img className={s.aboutOffset} src="/photos/piekarnia-3.jpg" alt="" />
            <img src="/photos/piekarnia-2.jpg" alt="" />
          </div>
          <div>
            <SectionHeading eyebrow="O nas" title="Rodzinna piekarnia, w której liczy się czas" />
            <p className={s.paragraph}>
              Jacek Bieżyński założył firmę w 1991 roku. Dziś piekarnię prowadzi Wioleta Bieżyńska, a przy
              piecach stoi syn Damian. Receptury zostały te same: własny zakwas, mąka od okolicznych
              młynarzy, ciasto, które dostaje tyle godzin, ile potrzebuje.
            </p>
            <p className={s.paragraph}>
              Nasze pieczywo trafia do ponad 200 odbiorców w promieniu 100 km — i do Was, w czterech
              sklepach firmowych.
            </p>
            <Button href="/o-nas" variant="secondary">
              Poznaj naszą historię
            </Button>
          </div>
        </div>
      </Section>

      <Section>
        <div className={s.stores}>
          <div>
            <SectionHeading eyebrow="Nasze sklepy" title="Blisko Ciebie, od świtu" />
            <div className={s.storeListSpacing}>
              <StoreList disclaimer="godziny przykładowe — do potwierdzenia" />
            </div>
          </div>
          <MapEmbed />
        </div>
      </Section>

      <FeatureBand title="Dlaczego warto do nas wpaść" features={features} />

      <Section>
        <h2 className={s.centeredTitle}>Co mówią nasi klienci</h2>
        <Grid cols={3}>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} />
          ))}
        </Grid>
      </Section>

      <Section flush>
        <div className={s.instagram}>
          <SectionHeading
            title="Z naszego pieca na Instagramie"
            action={{ href: contact.instagram, label: '@piekarniabiezynski →' }}
          />
          <InstagramGrid />
        </div>
      </Section>
    </main>
  );
}
