import Image from 'next/image';
import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { CtaBand } from '../../../components/sections/CtaBand';
import { Timeline } from '../../../components/sections/Timeline';
import { Button } from '../../../components/ui/Button';
import { getSiteSettings, getStores } from '../../../lib/data';
import { showDevNotes } from '../../../lib/devNotes';
import { isOpen, storesNoun, todayInWarsaw } from '../../../lib/opening';
import s from './page.module.css';

export const metadata = {
  alternates: { canonical: '/o-nas' },
  title: 'O nas — Piekarnia Bieżyński',
  description: 'Rodzinna piekarnia ze Świdnicy od 1991 roku. Własny zakwas, lokalna mąka, własne sklepy firmowe.',
};

// the shop count only includes shops past their opening date
export const revalidate = 3600;

const people = [
  { initials: 'JB', name: 'Jacek Bieżyński', role: 'Założyciel', text: 'Zaczął w 1991 roku od handlu, dziesięć lat później postawił pierwszy piec.' },
  { initials: 'WB', name: 'Wioleta Bieżyńska', role: 'Prowadzi piekarnię od 2010', text: 'Rozwija ofertę i pilnuje, żeby rodzinne receptury zostały takie, jakie były.' },
  { initials: 'DB', name: 'Damian Bieżyński', role: 'Piekarz, drugie pokolenie', text: 'Od 2015 przy piecach. Łączy rzemiosło z nowoczesnym parkiem maszynowym.' },
];

const principles = [
  { title: 'Własny zakwas', text: 'Prowadzimy go w piekarni od lat. To on decyduje o smaku chlebów żytnich i mieszanych.' },
  { title: 'Mąka z Dolnego Śląska', text: 'Z młynów z okolicy. Krótka droga to świeżość i pewność, kto stoi za tym, co wkładamy do pieca.' },
  { title: 'Czas', text: 'Ciasto dostaje tyle godzin, ile potrzebuje. Nie przyspieszamy tego, czego przyspieszyć się nie da.' },
];

export default async function ONasPage() {
  const [settings, stores] = await Promise.all([getSiteSettings(), getStores()]);
  const [photoMain, photoSmall, photoPrinciples] = settings.aboutGallery;
  const today = todayInWarsaw();
  const openStores = stores.filter((store) => isOpen(store, today)).length;
  return (
    <main>
      <Header phone={settings.phone} phoneHref={settings.phoneHref} />

      <section className={s.intro}>
        <div className={s.introInner}>
          <div className={s.introCopy}>
            <div className={s.eyebrow}>O nas · od 1991</div>
            <h1 className={s.introTitle}>Piekarnia, która wstaje razem z miastem</h1>
            <p className={s.introLead}>
              Kiedy Świdnica jeszcze śpi, u nas grzeje się piec. Tak jest od pierwszego dnia i tak ma zostać.
            </p>
            <div className={s.introActions}>
              <Button href="/chleby">Zobacz wypieki</Button>
              <Button href="/sklepy" variant="secondary">
                Nasze sklepy
              </Button>
            </div>
          </div>
          <div className={s.introMedia}>
            {photoMain ? (
              <Image
                className={s.introPhotoMain}
                src={photoMain}
                alt=""
                width={900}
                height={1100}
                priority
                sizes="(max-width: 1100px) 100vw, 50vw"
              />
            ) : (
              <div className={s.introPhotoMain + ' ' + s.placeholder} />
            )}
            {photoSmall ? (
              <Image
                className={s.introPhotoSmall}
                src={photoSmall}
                alt=""
                width={600}
                height={600}
                sizes="(max-width: 1100px) 100vw, 50vw"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className={s.stats}>
        <div className={s.statsInner}>
          <div className={s.stat}>
            <div className={s.statValue}>1991</div>
            <div className={s.statLabel}>rok założenia</div>
          </div>
          <div className={s.stat}>
            <div className={s.statValue}>{openStores}</div>
            <div className={s.statLabel}>{storesNoun(openStores)}</div>
          </div>
          <div className={s.stat}>
            <div className={s.statValue}>200+</div>
            <div className={s.statLabel}>stałych odbiorców</div>
          </div>
          <div className={s.stat}>
            <div className={s.statValue}>100 km</div>
            <div className={s.statLabel}>promień dostaw</div>
          </div>
        </div>
      </section>

      <Section>
        <div className={s.story}>
          <div className={s.storyHead}>
            <SectionHeading eyebrow="Nasza historia" title="Trzy dekady, jeden piec" />
            <p className={s.storyLead}>
              Firmę założył Jacek Bieżyński w 1991 roku. Dziś prowadzi ją Wioleta Bieżyńska, a przy piecach stoi
              syn Damian. Zmieniały się maszyny i sklepy. Sposób pracy został ten sam.
            </p>
          </div>
          <Timeline />
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Ludzie" title="Kto za tym stoi" />
        <div className={s.people}>
          {people.map((person) => (
            <div key={person.name} className={s.person}>
              <div className={s.avatar} aria-hidden="true">
                {person.initials}
              </div>
              <div className={s.personName}>{person.name}</div>
              <div className={s.personRole}>{person.role}</div>
              <p className={s.personText}>{person.text}</p>
            </div>
          ))}
        </div>
        {showDevNotes ? <p className={s.todo}>zdjęcia rodziny — do dosłania przez piekarnię</p> : null}
      </Section>

      <Section>
        <div className={s.principles}>
          <div className={s.principlesMedia}>
            {photoPrinciples ? (
              <Image
                src={photoPrinciples}
                alt=""
                width={900}
                height={700}
                sizes="(max-width: 1100px) 100vw, 50vw"
              />
            ) : (
              <div className={s.placeholder} />
            )}
          </div>
          <div>
            <SectionHeading eyebrow="Jak pracujemy" title="Trzy rzeczy, których nie zmieniamy" />
            <ol className={s.principleList}>
              {principles.map((item, index) => (
                <li key={item.title} className={s.principle}>
                  <span className={s.principleNum}>0{index + 1}</span>
                  <div>
                    <div className={s.principleTitle}>{item.title}</div>
                    <p className={s.principleText}>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Wpadnij do nas rano"
        text="Sklepy w Świdnicy, Jaworzynie Śląskiej i Bielawie. Świeże pieczywo od 6:00."
        action={{ href: '/sklepy', label: 'Zobacz sklepy' }}
      />
    </main>
  );
}
