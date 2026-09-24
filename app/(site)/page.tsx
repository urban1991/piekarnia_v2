import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Header } from '../../components/layout/Header';
import { Section } from '../../components/layout/Section';
import { SectionHeading } from '../../components/layout/SectionHeading';
import { Grid } from '../../components/ui/Grid';
import { Button } from '../../components/ui/Button';
import { Hero } from '../../components/sections/Hero';
import { FeatureBand } from '../../components/sections/FeatureBand';
import { StoreMap } from '../../components/sections/StoreMap';
import { StoreList } from '../../components/sections/StoreList';
import { InstagramGrid } from '../../components/sections/InstagramGrid';
import { AnnouncementBar } from '../../components/sections/AnnouncementBar';
import { NewStorePromo } from '../../components/sections/NewStorePromo';
import { CategoryCard } from '../../components/cards/CategoryCard';
import { TestimonialCarousel } from '../../components/sections/TestimonialCarousel';
import { getAnnouncements, getCategories, getSiteSettings, getStores, getTestimonials } from '../../lib/data';
import { showDevNotes } from '../../lib/devNotes';
import { promotedStore, todayInWarsaw } from '../../lib/opening';
import s from './page.module.css';

// Announcement dates and shop opening dates are evaluated at render time, so the page must
// revalidate periodically for them to change without a Studio publish (a publish still clears
// the cache immediately via the webhook, in parallel).
export const revalidate = 3600;

export const metadata = {
  alternates: { canonical: '/' },
};

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
    text: 'Sklepy firmowe w Świdnicy, Jaworzynie Śląskiej i Bielawie. Zawsze po drodze.',
  },
];

export default async function HomePage() {
  const [settings, categories, testimonials, announcements, stores] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getTestimonials(),
    getAnnouncements(),
    getStores(),
  ]);
  const today = todayInWarsaw();
  const promotion = promotedStore(stores, today);
  return (
    <main>
      <div
        className={s.heroWrap}
        // the hero leaves room for the ticker below it; with no active announcement there is no ticker
        style={announcements.length ? undefined : ({ '--announcement-h': '0px' } as CSSProperties)}
      >
        <Header variant="onDark" phone={settings.phone} phoneHref={settings.phoneHref} />
        <Hero
          eyebrow="Piekarnia rodzinna od 1991 · Świdnica"
          title="Chleb, który pachnie jak w domu."
          lead="Pieczemy każdej nocy na własnym zakwasie — rano bochenek czeka już na półce."
          image={settings.heroImage}
          imagePosition={settings.heroImagePosition}
        />
      </div>
      <AnnouncementBar announcements={announcements} />
      {promotion ? (
        <Section>
          <NewStorePromo promotion={promotion} fallbackImage={settings.heroImage} showAllStores />
        </Section>
      ) : null}

      <Section>
        <SectionHeading
          title="Co dziś wyjęliśmy z pieca"
          action={{ href: settings.catalogPdf, label: 'Katalog PDF →' }}
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
            {settings.homeGallery[0] ? (
              <Image className={s.aboutOffset} src={settings.homeGallery[0]} alt="" width={600} height={340} />
            ) : null}
            {settings.homeGallery[1] ? (
              <Image src={settings.homeGallery[1]} alt="" width={600} height={340} />
            ) : null}
          </div>
          <div>
            <SectionHeading eyebrow="O nas" title="Rodzinna piekarnia, w której liczy się czas" />
            <p className={s.paragraph}>
              Jacek Bieżyński założył firmę w 1991 roku. Dziś piekarnię prowadzi Wioleta Bieżyńska, a przy
              piecach stoi syn Damian. Receptury zostały te same: własny zakwas, mąka od okolicznych
              młynarzy, ciasto, które dostaje tyle godzin, ile potrzebuje.
            </p>
            <p className={s.paragraph}>
              Nasze pieczywo trafia do ponad 200 odbiorców w promieniu 100 km — i do Was, w naszych
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
              <StoreList disclaimer={showDevNotes ? 'godziny przykładowe — do potwierdzenia' : undefined} />
            </div>
          </div>
          <StoreMap stores={stores} />
        </div>
      </Section>

      <FeatureBand title="Dlaczego warto do nas wpaść" features={features} />

      <Section>
        <h2 className={s.centeredTitle}>Co mówią nasi klienci</h2>
        <TestimonialCarousel testimonials={testimonials} />
      </Section>

      <Section flush>
        <div className={s.instagram}>
          <SectionHeading
            title="Z naszego pieca na Instagramie"
            action={{ href: settings.instagram, label: '@piekarniabiezynski →' }}
          />
          <InstagramGrid images={settings.gallery} />
        </div>
      </Section>
    </main>
  );
}
