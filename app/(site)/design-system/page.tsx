import Image from 'next/image';
import { Header } from '../../../components/layout/Header';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Button } from '../../../components/ui/Button';
import { Tag } from '../../../components/ui/Tag';
import { CategoryCard } from '../../../components/cards/CategoryCard';
import { ProductCard } from '../../../components/cards/ProductCard';
import { StoreCard } from '../../../components/cards/StoreCard';
import { TestimonialCard } from '../../../components/cards/TestimonialCard';
import { ContactForm } from '../../../components/sections/ContactForm';
import { CtaBand } from '../../../components/sections/CtaBand';
import { MapEmbed } from '../../../components/sections/MapEmbed';
import {
  getCategories,
  getSiteSettings,
  getAllProducts,
  getStores,
  getTestimonials,
} from '../../../lib/data';
import { DesignSystemChips } from './DesignSystemChips';
import s from './page.module.css';

export const metadata = {
  title: 'Design system — Piekarnia Bieżyński',
  description: 'Kolory, typografia, spacing i komponenty. Kierunek „Ciepło rzemieślnicze”.',
  robots: { index: false },
};

const colors = [
  { name: 'Brand red', token: '--color-brand', hex: '#A6192E', use: 'CTA, eyebrow, linki, akcenty' },
  { name: 'Brand red dark', token: '--color-brand-dark', hex: '#8A1426', use: 'hover przycisków' },
  { name: 'Brand tint', token: '--color-brand-tint', hex: '#F6E3E5', use: 'tło tagów, focus ring' },
  { name: 'Cream', token: '--color-bg', hex: '#F7F1E8', use: 'tło strony' },
  { name: 'Surface', token: '--color-surface', hex: '#FFFFFF', use: 'karty, sekcje naprzemienne' },
  { name: 'Sand', token: '--color-sand', hex: '#EFE6D8', use: 'separatory w kartach, tła pomocnicze' },
  { name: 'Line', token: '--color-line', hex: '#D9CDBD', use: 'obramowania, linie list' },
  { name: 'Ink', token: '--color-ink', hex: '#221B18', use: 'tekst główny, stopka' },
  { name: 'Ink soft', token: '--color-ink-soft', hex: '#5E524B', use: 'akapity, opisy' },
  { name: 'Ink muted', token: '--color-ink-muted', hex: '#7A6B60', use: 'podpisy, meta' },
];

const typeScale = [
  { name: 'display', spec: 'serif 64 / 1.06 / -0.01em', cls: s.tDisplay, text: 'Chleb, który pachnie jak w domu.' },
  { name: 'h1', spec: 'serif 60 / 1.05', cls: s.tH1, text: 'Chleby na zakwasie' },
  { name: 'h2', spec: 'serif 44 / 1.1 (mobile 30)', cls: s.tH2, text: 'Rodzinna piekarnia, w której liczy się czas' },
  { name: 'h3', spec: 'serif 26 / 1.2', cls: s.tH3, text: 'Chleb żytni na zakwasie' },
  { name: 'lead', spec: 'sans 19 / 1.55 · ink-soft', cls: s.tLead, text: 'Pieczemy każdej nocy, żeby rano na Waszym stole leżał świeży bochenek.' },
  { name: 'body', spec: 'sans 17 / 1.6', cls: s.tBody, text: 'Mąkę, masło i jajka bierzemy od dostawców z okolicy, bo wiemy, kto za nimi stoi.' },
  { name: 'small', spec: 'sans 15 / 1.5 · ink-soft', cls: s.tSmall, text: 'Na zakwasie, żytnie, pszenne i mieszane. Skórka chrupie, środek długo zostaje wilgotny.' },
  { name: 'caption', spec: 'sans 13 / 1.5 · ink-muted', cls: s.tCaption, text: 'Wartość odżywcza 100 g · 234 kcal' },
];

const spaces = [
  [1, 4], [2, 8], [3, 12], [4, 16], [6, 24], [8, 32], [12, 48], [16, 64], [24, 96],
];

const radii = [
  { token: '--radius-sm 12', use: 'zdjęcia w siatce IG, inputy', r: 12 },
  { token: '--radius-md 16', use: 'małe karty, zdjęcia', r: 16 },
  { token: '--radius-lg 20', use: 'karty produktów', r: 20 },
  { token: '--radius-xl 24', use: 'formularz, mapa', r: 24 },
  { token: '--radius-pill 999', use: 'przyciski, chipy', r: 999 },
];

function Heading({ n, title, lead }: { n: string; title: string; lead?: string }) {
  return (
    <div>
      <div className={s.num}>{n}</div>
      <h2 className={s.h2}>{title}</h2>
      {lead ? <p className={s.sectionLead}>{lead}</p> : null}
    </div>
  );
}

export default async function DesignSystemPage() {
  const [settings, categories, products, stores, testimonials] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getAllProducts(),
    getStores(),
    getTestimonials(),
  ]);
  const sampleProduct = products.find((p) => p.id === 'product-chleb-zytni-firmowy') ?? products[0];

  return (
    <main>
      <Header phone={settings.phone} phoneHref={settings.phoneHref} />
      <div className={s.page}>
        <header className={s.intro}>
          <div className={s.brandRow}>
            <Image src="/logo.png" alt="" width={56} height={56} />
            <span className={s.wordmark}>Piekarnia Bieżyński</span>
          </div>
          <h1 className={s.h1}>Design system · kierunek „Ciepło rzemieślnicze”</h1>
          <p className={s.introLead}>
            Czerwień z logo jako akcent, kremowe tła, serif w nagłówkach. Wszystkie wartości poniżej
            odpowiadają zmiennym w <code className={s.code}>styles/tokens.css</code>.
          </p>
          <nav className={s.toc}>
            <a href="#kolory">Kolory</a>
            <a href="#typografia">Typografia</a>
            <a href="#spacing">Spacing i siatka</a>
            <a href="#ksztalt">Kształt i cień</a>
            <a href="#przyciski">Przyciski</a>
            <a href="#nawigacja">Nawigacja</a>
            <a href="#karty">Karty</a>
            <a href="#formularze">Formularze</a>
            <a href="#sekcje">Sekcje</a>
            <a href="#stopka">Stopka</a>
          </nav>
        </header>

        <section id="kolory" className={s.section}>
          <Heading n="01" title="Kolory" />
          <div className={s.swatches}>
            {colors.map((c) => (
              <div key={c.token} className={s.swatch}>
                <div className={s.swatchColor} style={{ background: c.hex }} />
                <div className={s.swatchBody}>
                  <div className={s.swatchName}>{c.name}</div>
                  <div className={s.meta}>{c.token} · {c.hex}</div>
                  <div className={s.meta}>{c.use}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={s.panel + ' ' + s.twoCol}>
            <div>
              <b className={s.ink}>Zasada użycia czerwieni.</b> Jeden akcent na ekran w polu widzenia: CTA
              lub eyebrow lub link. Pełne czerwone płaszczyzny tylko dla sekcji „Dlaczego warto” i pasków
              CTA — nigdy dwie obok siebie.
            </div>
            <div>
              <b className={s.ink}>Kontrast.</b> Ink na Cream 13,6:1 · Ink soft na Cream 6,1:1 · Biały na
              Brand red 7,3:1 · Brand red na Cream 5,6:1. Ink muted (#7A6B60) tylko dla tekstu ≥ 13 px.
            </div>
          </div>
        </section>

        <section id="typografia" className={s.section}>
          <Heading n="02" title="Typografia" />
          <div className={s.twoColGrid}>
            <div className={s.panel}>
              <div className={s.fontSample + ' ' + s.serif}>Libre Caslon Text</div>
              <div className={s.meta}>--font-serif · nagłówki, liczby, cytaty · 400 (i 400 italic). Nigdy bold.</div>
            </div>
            <div className={s.panel}>
              <div className={s.fontSample} style={{ fontWeight: 500 }}>Source Sans 3</div>
              <div className={s.meta}>--font-sans · tekst, UI, nawigacja · 400 / 500 / 600</div>
            </div>
          </div>
          <div className={s.panel + ' ' + s.typeTable}>
            {typeScale.map((t) => (
              <div key={t.name} className={s.typeRow}>
                <div className={s.meta}>
                  {t.name}
                  <br />
                  {t.spec}
                </div>
                <div className={t.cls}>{t.text}</div>
              </div>
            ))}
            <div className={s.typeRow}>
              <div className={s.meta}>
                eyebrow
                <br />
                sans 12 / 600 / .14em / uppercase · brand
              </div>
              <div className={s.eyebrow}>Piekarnia rodzinna · Świdnica</div>
            </div>
          </div>
        </section>

        <section id="spacing" className={s.section}>
          <Heading n="03" title="Spacing i siatka" />
          <div className={s.twoColGrid}>
            <div className={s.panel + ' ' + s.spaceList}>
              <div className={s.swatchName}>Skala 4 px · --space-N</div>
              {spaces.map(([n, px]) => (
                <div key={n} className={s.spaceRow}>
                  <span>{n} · {px}</span>
                  <div className={s.spaceBar} style={{ width: px }} />
                </div>
              ))}
            </div>
            <div className={s.panel + ' ' + s.rules}>
              <div><b className={s.ink}>Kontener.</b> max-width 1280, padding boczny 64 (desktop) · 32 (tablet) · 20 (mobile).</div>
              <div><b className={s.ink}>Sekcja.</b> padding pionowy 96 (desktop) · 64 (mobile). Sekcje naprzemiennie Cream / Surface; czerwona nie częściej niż co trzecia.</div>
              <div><b className={s.ink}>Siatka kart.</b> 3 kolumny, gap 28 (desktop) · 2 kolumny gap 20 (tablet) · 1 kolumna gap 16 (mobile). Sklepy: 4 kolumny gap 20.</div>
              <div><b className={s.ink}>Breakpointy.</b> sm 640 · md 900 · lg 1200.</div>
              <div><b className={s.ink}>Header.</b> 88 px desktop, 64 px mobile; na stronie głównej przezroczysty nad hero, na podstronach z dolną linią 1 px Line.</div>
            </div>
          </div>
        </section>

        <section id="ksztalt" className={s.section}>
          <Heading n="04" title="Kształt i cień" />
          <div className={s.radii}>
            {radii.map((r) => (
              <div key={r.token} className={s.radiusBox} style={{ borderRadius: r.r }}>
                <b className={s.ink}>{r.token}</b>
                <span className={s.meta}>{r.use}</span>
              </div>
            ))}
          </div>
          <div className={s.twoColGrid}>
            <div className={s.panel + ' ' + s.float}>
              <b>--shadow-float</b>
              <div className={s.meta}>
                0 12px 40px rgba(60,30,10,.14) · tylko dla elementów „unoszących się” nad zdjęciem (badge
                na hero). Karty nie mają cienia.
              </div>
            </div>
            <div className={s.arc}>łuk hero: radius 280 280 24 24 (mobile 175 175 20 20)</div>
          </div>
        </section>

        <section id="przyciski" className={s.section}>
          <Heading
            n="05"
            title="Przyciski i linki"
            lead="Pill, 16 px / 600, padding 16×28. Wysokość 52 px (md) · 44 px (sm). Fokus: ring 3 px Brand tint + 1 px Brand."
          />
          <div className={s.panel + ' ' + s.buttonPanel}>
            <div className={s.buttonGrid}>
              <div />
              <div className={s.meta}>default</div>
              <div className={s.meta}>hover</div>
              <div className={s.meta}>focus</div>
              <div className={s.meta}>disabled</div>

              <div className={s.rowLabel}>Primary</div>
              <Button href="#">Zobacz wypieki</Button>
              <span className={s.btnHover}><Button href="#">Zobacz wypieki</Button></span>
              <span className={s.btnFocus}><Button href="#">Zobacz wypieki</Button></span>
              <Button type="button" disabled>Zobacz wypieki</Button>

              <div className={s.rowLabel}>Secondary</div>
              <Button href="#" variant="secondary">Nasze sklepy</Button>
              <span className={s.btnHoverSecondary}><Button href="#" variant="secondary">Nasze sklepy</Button></span>
              <span className={s.btnFocusSecondary}><Button href="#" variant="secondary">Nasze sklepy</Button></span>
              <Button type="button" variant="secondary" disabled>Nasze sklepy</Button>

              <div className={s.rowLabel}>Inverse (na czerwieni)</div>
              <div className={s.onBrand}><Button href="#" variant="inverse" size="sm">Katalog PDF</Button></div>
              <div className={s.onBrand + ' ' + s.btnHoverInverse}><Button href="#" variant="inverse" size="sm">Katalog PDF</Button></div>
              <div className={s.onBrand + ' ' + s.btnFocusInverse}><Button href="#" variant="inverse" size="sm">Katalog PDF</Button></div>
              <div />

              <div className={s.rowLabel}>Text link</div>
              <a className={s.textLink} href="#">Pełny katalog →</a>
              <a className={s.textLink + ' ' + s.textLinkHover} href="#">Pełny katalog →</a>
              <a className={s.textLink + ' ' + s.textLinkFocus} href="#">Pełny katalog →</a>
              <div />
            </div>

            <div className={s.chipRows}>
              <div className={s.rowLabel}>Chip (filtr)</div>
              <DesignSystemChips />
              <div className={s.rowLabel}>Tag</div>
              <div className={s.tagRow}>
                <Tag>Na zakwasie</Tag>
                <Tag tone="neutral">450 g</Tag>
                <Tag tone="neutral">Tylko środa</Tag>
              </div>
            </div>
          </div>
        </section>

        <section id="nawigacja" className={s.section}>
          <Heading n="06" title="Nawigacja" />
          <div className={s.stack}>
            <div className={s.demoCard}>
              <div className={s.demoLabel}>Header · podstrona (solid, linia dolna) · aktywny link = Brand 600</div>
              <div className={s.demoHeaderSolid}>
                <Header phone={settings.phone} phoneHref={settings.phoneHref} />
              </div>
            </div>
            <div className={s.demoDark}>
              <div className={s.demoLabel + ' ' + s.demoLabelDark}>
                Header · strona główna (przezroczysty nad hero) — wariant „onDark”
              </div>
              <div className={s.demoHeaderDark}>
                <Header variant="onDark" phone={settings.phone} phoneHref={settings.phoneHref} />
              </div>
            </div>
            <div className={s.mobileRow}>
              <div className={s.demoCard}>
                <div className={s.demoLabel}>Mobile header 64 px</div>
                <div className={s.mobileHeader}>
                  <Image src="/logo.png" alt="" width={44} height={44} />
                  <div className={s.mobileActions}>
                    <span className={s.iconBtn}>tel</span>
                    <span className={s.burger}><i /><i /></span>
                  </div>
                </div>
              </div>
              <div className={s.demoCard + ' ' + s.demoCream}>
                <div className={s.demoLabel}>Mobile menu (otwarte) · pełny ekran, serif 28</div>
                <div className={s.mobileMenu}>
                  <a className={s.mobileActive} href="#">Chleby</a>
                  <a href="#">Bułki i rogale</a>
                  <a href="#">Inne wypieki</a>
                  <a href="#">O nas</a>
                  <a href="#">Sklepy</a>
                  <a href="#">Kontakt</a>
                  <Button href={settings.phoneHref} block>Zadzwoń: {settings.phone}</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="karty" className={s.section}>
          <Heading
            n="07"
            title="Karty"
            lead="Wszystkie karty: Surface, radius 20, bez cienia, bez obramowania. Hover: zdjęcie scale 1.03 (300 ms), tytuł → Brand."
          />
          <div className={s.threeCol}>
            <div className={s.labeled}>
              <div className={s.meta}>CategoryCard</div>
              <CategoryCard category={categories[0]} lead="Na zakwasie, żytnie, pszenne i mieszane." />
            </div>
            <div className={s.labeled}>
              <div className={s.meta}>ProductCard · PNG na przygaszonym zdjęciu</div>
              <ProductCard product={sampleProduct} backdrop={categories[0]?.cover} />
            </div>
            <div className={s.labeled}>
              <div className={s.meta}>StoreCard</div>
              <StoreCard store={stores[0]} />
            </div>
          </div>
          <div className={s.threeCol}>
            <div className={s.labeled}>
              <div className={s.meta}>TestimonialCard</div>
              <TestimonialCard testimonial={{ text: 'Chleb na zakwasie smakuje jak domowy. Naprawdę warto!', author: testimonials[0].author }} />
            </div>
            <div className={s.labeled}>
              <div className={s.meta}>FeatureItem (na czerwieni)</div>
              <div className={s.featureItem}>
                <div className={s.featureInner}>
                  <div className={s.featureTitle}>Codziennie świeże</div>
                  <p className={s.featureText}>Pieczemy na miejscu, każdej nocy.</p>
                </div>
              </div>
            </div>
            <div className={s.labeled}>
              <div className={s.meta}>StatItem + StoreRow</div>
              <div className={s.statCard}>
                <div>
                  <div className={s.statValue}>4 sklepy</div>
                  <div className={s.statLabel}>Świdnica, Jaworzyna, Bielawa</div>
                </div>
                <div className={s.storeRow}>
                  <div>
                    <div className={s.storeStreet}>{stores[0].city}, {stores[0].street}</div>
                    <div className={s.statLabel}>{stores[0].label}</div>
                  </div>
                  <div className={s.storeHours}>Pn–Pt 6:00–18:00<br />Sb 6:00–14:00</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="formularze" className={s.section}>
          <Heading n="08" title="Formularze" />
          <div className={s.panel + ' ' + s.inputs}>
            <label className={s.field}>
              Default
              <input className={s.input} placeholder="Jan" />
            </label>
            <label className={s.field}>
              Focus
              <input className={s.input + ' ' + s.inputFocus} defaultValue="Jan Kowalski" />
            </label>
            <label className={s.field + ' ' + s.fieldError}>
              Error
              <input className={s.input + ' ' + s.inputError} defaultValue="503" />
              <span className={s.errorText}>Podaj pełny numer lub adres e-mail.</span>
            </label>
            <label className={s.field + ' ' + s.fieldDisabled}>
              Disabled
              <input className={s.input} disabled placeholder="—" />
            </label>
          </div>
          <div className={s.labeled}>
            <div className={s.meta}>ContactForm · walidacja po stronie klienta</div>
            <div className={s.formDemo}>
              <ContactForm />
            </div>
          </div>
        </section>

        <section id="sekcje" className={s.section}>
          <Heading n="09" title="Wzorce sekcji" />
          <div className={s.stack}>
            <div className={s.panel}>
              <div className={s.meta + ' ' + s.demoNote}>SectionHeading · split (tytuł + link)</div>
              <SectionHeading title="Co dziś wyjęliśmy z pieca" action={{ href: '#', label: 'Pełny katalog →' }} />
            </div>
            <div className={s.panel}>
              <div className={s.meta + ' ' + s.demoNote}>SectionHeading · eyebrow + h2 + lead</div>
              <SectionHeading
                eyebrow="O nas"
                title="Rodzinna piekarnia, w której liczy się czas"
                lead="Łączymy receptury, które przekazano nam w domu, z tym, czego uczy nas dzisiejsze rzemiosło."
              />
            </div>
            <div className={s.roundedBand}>
              <CtaBand
                title="Pełna oferta w katalogu"
                text="Wszystkie chleby, bułki i wypieki z opisami — do pobrania."
                action={{ href: settings.catalogPdf, label: 'Pobierz katalog PDF' }}
              />
            </div>
            <div className={s.panel}>
              <div className={s.meta + ' ' + s.demoNote}>MapEmbed · placeholder (docelowo iframe Google Maps, radius 20)</div>
              <div className={s.mapDemo}>
                <MapEmbed />
              </div>
            </div>
          </div>
        </section>

        <section id="stopka" className={s.section}>
          <Heading n="10" title="Stopka" />
          <p className={s.meta}>
            Stopka globalna renderuje się pod każdą stroną (także tą). Linki: Line na Ink (7,1:1); hover →
            biały. Dolny pasek: #8F8177 na Ink (4,6:1).
          </p>
        </section>
      </div>
    </main>
  );
}
