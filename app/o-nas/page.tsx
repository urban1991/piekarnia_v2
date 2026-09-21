import { Header } from '../../components/layout/Header';
import { Section } from '../../components/layout/Section';
import { SectionHeading } from '../../components/layout/SectionHeading';
import { PageHeader } from '../../components/sections/PageHeader';
import { Timeline } from '../../components/sections/Timeline';
import { Button } from '../../components/ui/Button';
import s from './page.module.css';

export const metadata = {
  title: 'O nas — Piekarnia Bieżyński',
  description: 'Rodzinna piekarnia ze Świdnicy od 1991 roku. Własny zakwas, lokalna mąka, cztery sklepy firmowe.',
};

export default function ONasPage() {
  return (
    <main>
      <Header />
      <PageHeader
        eyebrow="O nas · od 1991"
        title="Piekarnia, która wstaje razem z miastem"
        lead="Kiedy Świdnica jeszcze śpi, u nas grzeje się piec. Tak jest od pierwszego dnia i tak ma zostać."
        centered
      />

      <Section flush>
        <div className={s.gallery}>
          <img src="/photos/piekarnia-1.jpg" alt="" />
          <img src="/photos/piekarnia-3.jpg" alt="" />
          <div className={s.placeholder}>zdjęcie rodziny — do dosłania</div>
        </div>
      </Section>

      <Section>
        <div className={s.story}>
          <h2>Nasza historia</h2>
          <div className={s.storyText}>
            <p>
              Firmę założył Jacek Bieżyński w 1991 roku — najpierw był handel artykułami spożywczymi.
              Dziesięć lat później doszła produkcja pieczywa i wyrobów cukierniczych, a z nią pierwszy piec.
            </p>
            <p>
              Od 2010 roku piekarnię prowadzi Wioleta Bieżyńska. W 2015 dołączył syn, Damian — piekarz z
              zamiłowaniem do technologii, który znacząco rozbudował park maszynowy.
            </p>
            <p>
              Sposób pracy się nie zmienił. Zakwas prowadzimy sami, mąkę bierzemy od młynarzy z okolicy, a
              ciasto dostaje tyle godzin, ile potrzebuje.
            </p>
          </div>
        </div>
        <div className={s.timelineSpacing}>
          <Timeline />
        </div>
      </Section>

      <Section tone="surface">
        <div className={s.stats}>
          <div>
            <div className={s.statValue}>100 km</div>
            <div className={s.statLabel}>promień dostaw</div>
            <p className={s.statText}>Nasze pieczywo trafia do sklepów i marketów w całej okolicy Świdnicy.</p>
          </div>
          <div>
            <div className={s.statValue}>200+</div>
            <div className={s.statLabel}>stałych odbiorców</div>
            <p className={s.statText}>Sklepy, markety i punkty gastronomiczne, które zamawiają u nas codziennie.</p>
          </div>
          <div>
            <div className={s.statValue}>4</div>
            <div className={s.statLabel}>sklepy firmowe</div>
            <p className={s.statText}>Świdnica, Jaworzyna Śląska i Bielawa. Wszędzie pieczywo z jednego pieca.</p>
          </div>
        </div>
      </Section>

      <Section>
        <div className={s.ingredients}>
          <img src="/photos/piekarnia-4.jpg" alt="" />
          <div>
            <SectionHeading title="Skąd bierzemy składniki" />
            <p className={s.paragraph}>
              Mąka pochodzi z młynów z Dolnego Śląska. Krótka droga to świeżość, ale też pewność, kto stoi za
              tym, co wkładamy do pieca.
            </p>
            <p className={s.paragraph}>
              Zakwas prowadzimy w piekarni od lat — to on decyduje o smaku chlebów żytnich i mieszanych.
            </p>
            <Button href="/sklepy">Odwiedź nasz sklep</Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
