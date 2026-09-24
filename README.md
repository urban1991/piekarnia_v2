# Piekarnia Bieżyński — redesign (Next.js)

Kierunek wizualny **„Ciepło rzemieślnicze”**: czerwień #A6192E z logo jako akcent, kremowe tła,
serif Libre Caslon Text w nagłówkach, Source Sans 3 w tekście.

Źródło projektu: Claude Design — projekt „Redesign piekarni Bieżyński” (plik `Design System.dc.html`).

## Uruchomienie

```bash
cp .env.example .env.local
```

Uzupełnić w `.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
`NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_WRITE_TOKEN` (tylko lokalnie, do skryptów),
`SANITY_WEBHOOK_SECRET`. Opcjonalnie `NEXT_PUBLIC_SITE_URL` — adres używany w sitemap,
canonicalach i podglądach linków; bez niego brana jest domena produkcyjna z Vercela
(`VERCEL_PROJECT_PRODUCTION_URL`, po podpięciu własnej domeny — ta domena).

Flaga `NEXT_PUBLIC_SHOW_DEV_NOTES=true` pokazuje na stronie robocze notatki (np. „godziny
przykładowe — do potwierdzenia”) — ustaw na `false` albo usuń przed startem produkcyjnym.

```bash
npm install
npm run dev
```

Podgląd design systemu (tokeny + wszystkie komponenty): `http://localhost:3000/design-system`.
Panel menadżera (Sanity Studio): `http://localhost:3000/studio` — patrz `docs/ADMIN.md`.

## Struktura

    styles/tokens.css        wszystkie zmienne (kolory, typografia, spacing, radius, breakpointy)
    styles/globals.css       reset + elementy bazowe, importuje tokens.css
    lib/types.ts             typy domenowe (Product, Store, Category, ...)
    lib/data.ts              async odczyt z Sanity (GROQ) + helpery (productsByCategory, filtersFor)
    sanity/                  konfiguracja klienta, env, obrazy, GROQ queries, schematy, structure Studio
    app/studio/              Sanity Studio pod /studio
    app/api/revalidate/      webhook Sanity odświeżający cache (revalidateTag)
    lib/opening.ts           daty otwarcia nowych sklepów (strefa Europe/Warsaw), odmiana liczby sklepów
    lib/site.ts              adres strony, lista stron do sitemap
    scripts/seed-sanity.ts   jednorazowa migracja data/products.json → Sanity (już wykonana; odmawia pracy
                             na zbiorze z treścią, bo nadpisałaby zmiany ze Studio — tylko z --force)
    data/products.json       (tylko do migracji, usuwane po seedzie) treść pobrana z biezynski.swidnica.pl
    public/photos/           (tylko do migracji, usuwane po seedzie) zdjęcia wgrywane przez seed do Sanity
    components/ui/           Button, Tag, FilterChips, Grid, CopyButton
    components/layout/       Header, Footer, Container, Section, SectionHeading
    components/cards/        CategoryCard, ProductCard, StoreCard, TestimonialCard
    components/sections/     Hero, PageHeader, FeatureBand, CtaBand, StoreMap, StoreList, NewStorePromo,
                             AnnouncementBar, InstagramGrid, Timeline, ProductGrid, LegalDocument
    app/(site)/              strony App Routera (grupa z layoutem/stopką) + /design-system
    public/                  logo + zdjęcia

Stylowanie: **CSS Modules**, bez bibliotek. Fonty ładuje `next/font/google` w `app/layout.tsx`
i wstrzykuje je do `--font-serif` / `--font-sans` w `tokens.css`.

### Kategorie

Dokumenty `category` mają stałe id: `category-chleby`, `category-bulki-i-rogale`,
`category-inne-wypieki` — nadaje je seed. Studio filtruje listy produktów per kategoria po
`category->slug.current`, a szablon nowego produktu w danej kategorii nadal używa tych stałych id
jako wartości początkowej. Nie twórz kategorii ręcznie w Studio — id musi się zgadzać.

## Komponenty — jak używać

    <Section tone="cream|surface|brand" flush>       sekcja + kontener, padding z --section-y
    <SectionHeading eyebrow title lead action />     nagłówek sekcji (wariant split z linkiem)
    <Button href variant="primary|secondary|inverse|ghostOnDark" size="md|sm" block />
    <ProductGrid products filters highlightId highlightLabel />   client: filtrowanie po tagach
    <Header variant="solid|onHero" />                onHero = przezroczysty nad hero (strona główna)
    <StoreMap stores />                              OpenStreetMap (Leaflet), pinezki z pola „Lokalizacja” sklepów
    <NewStorePromo promotion fallbackImage />        reklama nowego sklepu; promotion z promotedStore() w lib/opening.ts
    <AnnouncementBar announcements />                pasek ogłoszeń w pętli, daty ustawiane w Studio

## Obrazy

Zdjęcia produktów, sklepów i galerii są przechowywane w Sanity i serwowane z CDN Sanity
(`sanity/image.ts` buduje URL-e przez `@sanity/image-url`; `next.config.ts` ma `remotePatterns`
dla `cdn.sanity.io`). Zdjęcia wnętrza i logo poza treścią zarządzaną w Studio są w `public/`.

## Wdrożenie na Vercel

1. Zaimportować repo w Vercel.
2. Ustawić zmienne środowiskowe (Project Settings → Environment Variables):
   `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`,
   `SANITY_WEBHOOK_SECRET` (jako Secret) — **bez** `SANITY_API_WRITE_TOKEN` (token zapisu potrzebny tylko
   lokalnie do skryptów).
   Strony zależne od daty (`/`, `/sklepy`, `/o-nas`, `/kontakt`) mają `revalidate = 3600`: po upływie godziny pierwsze
   wejście dostaje jeszcze poprzednią wersję i uruchamia przebudowę w tle. Gdyby to przeszkadzało, można
   dodać Vercel Cron wywołujący `revalidatePath` (było w historii: commit „feat(cron)”).
3. Po deployu dodać domenę Vercel do listy CORS origins w Sanity: Manage → API → CORS origins,
   z zaznaczoną opcją „Allow credentials” — bez tego Studio pod `/studio` nie zaloguje się na produkcji.
4. Skonfigurować webhook w Sanity (Manage → API → Webhooks) wskazujący na `/api/revalidate`
   z tym samym sekretem co `SANITY_WEBHOOK_SECRET`.

Panel menadżera opisany jest w [`docs/ADMIN.md`](docs/ADMIN.md).

## Do potwierdzenia przez klienta

1. **Godziny otwarcia sklepów** — obecna strona ich nie podaje; w danych są wartości przykładowe.
2. **Składy produktów** — strona podaje tylko wartości odżywcze na 100 g.
3. **Adres e-mail** — strona Kontakt pokazuje `piekarnia@biezynski.pl` (Ustawienia strony w Studio), polityka
   prywatności podaje `biezynski@op.pl` (z PDF-u, `lib/company.ts`). Potwierdzić, który jest właściwy.
4. **Zdjęcia** części pozycji z „Innych wypieków” oraz zdjęcie rodziny na „O nas”.
5. **Treści prawne** — `/polityka-prywatnosci` i `/nota-prawna` (tekst w kodzie, dane spółki w `lib/company.ts`)
   przygotowane na podstawie PDF-ów ze stycznia 2025; do przejrzenia przez prawnika, w tym adres e-mail
   do spraw danych osobowych.
