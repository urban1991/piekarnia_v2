# Piekarnia Bieżyński — redesign (Next.js)

Kierunek wizualny **„Ciepło rzemieślnicze”**: czerwień #A6192E z logo jako akcent, kremowe tła,
serif Libre Caslon Text w nagłówkach, Source Sans 3 w tekście.

Źródło projektu: Claude Design — projekt „Redesign piekarni Bieżyński” (plik `Design System.dc.html`).

## Uruchomienie

```bash
npm install
npm run dev
```

Podgląd design systemu (tokeny + wszystkie komponenty): `http://localhost:3000/design-system`.

## Struktura

    styles/tokens.css        wszystkie zmienne (kolory, typografia, spacing, radius, breakpointy)
    styles/globals.css       reset + elementy bazowe, importuje tokens.css
    lib/types.ts             typy domenowe (Product, Store, Category, ...)
    lib/data.ts              odczyt data/products.json + helpery (productsByCategory, filtersFor)
    data/products.json       treść pobrana z biezynski.swidnica.pl (produkty, sklepy, historia, opinie)
    components/ui/           Button, Tag, FilterChips, Grid
    components/layout/       Header, Footer, Container, Section, SectionHeading
    components/cards/        CategoryCard, ProductCard, StoreCard, TestimonialCard
    components/sections/     Hero, PageHeader, FeatureBand, CtaBand, MapEmbed, StoreList,
                             InstagramGrid, Timeline, ContactForm, ProductGrid
    app/                     7 stron App Routera + /design-system
    public/                  logo + zdjęcia (photos/)

Stylowanie: **CSS Modules**, bez bibliotek. Fonty ładuje `next/font/google` w `app/layout.tsx`
i wstrzykuje je do `--font-serif` / `--font-sans` w `tokens.css`.

## Komponenty — jak używać

    <Section tone="cream|surface|brand" flush>       sekcja + kontener, padding z --section-y
    <SectionHeading eyebrow title lead action />     nagłówek sekcji (wariant split z linkiem)
    <Button href variant="primary|secondary|inverse|ghostOnDark" size="md|sm" block />
    <ProductGrid products filters highlightId highlightLabel />   client: filtrowanie po tagach
    <Header variant="solid|onHero" />                onHero = przezroczysty nad hero (strona główna)
    <MapEmbed src />                                 bez src rysuje placeholder mapy

## Obrazy

Zdjęcia produktów w `data/products.json` wskazują na obecną stronę WordPress
(`next.config.ts` ma `remotePatterns` dla `www.biezynski.swidnica.pl`). Zdjęcia wnętrza
i logo są w `public/`.

## Do potwierdzenia przez klienta

1. **Godziny otwarcia sklepów** — obecna strona ich nie podaje; w `products.json` są wartości przykładowe.
2. **Składy produktów** — strona podaje tylko wartości odżywcze na 100 g.
3. **Adres e-mail, pełna nazwa firmy, NIP** — brak na stronie.
4. **Zdjęcia** części pozycji z „Innych wypieków” oraz zdjęcie rodziny na „O nas”.
5. **Mapa** — embed Google Maps z czterema punktami (`<MapEmbed src=... />`).
6. **Treści prawne** — istnieją tylko jako PDF-y.
7. **Instagram** — feed z API czy 6 ręcznie wybranych zdjęć.
