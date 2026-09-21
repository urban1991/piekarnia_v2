# Panel menadżera na Sanity — projekt

Data: 2026-09-21
Status: do akceptacji

## Cel

Menadżerowie piekarni mają samodzielnie dodawać, edytować, ukrywać i usuwać produkty,
wgrywać zdjęcia z komputera oraz edytować dane sklepów (adres, godziny). Bez udziału
programisty i bez deployu.

## Decyzje

| Pytanie | Decyzja |
| --- | --- |
| Hosting strony | Vercel |
| CMS | Sanity (plan Free), Studio osadzone w aplikacji pod `/studio` |
| Logowanie menadżerów | Konta Sanity; zapraszane e-mailem przez właściciela projektu |
| Role | Administrator (właściciel) i Editor (menadżerowie). Editor edytuje wszystkie typy treści, nie zarządza kontami. Ograniczenie Editora tylko do produktów wymaga planu płatnego i jest poza zakresem. |
| Zdjęcia | Sanity Assets + CDN obrazów; `next/image` z loaderem Sanity |
| Źródło prawdy | Wyłącznie Sanity. `data/products.json` zostaje w repo tylko jako źródło migracji i jest usuwany po pierwszym imporcie na produkcję. |
| Odświeżanie strony | Strony statyczne, `revalidateTag` wywołany webhookiem Sanity po publikacji |

## Zakres

W zakresie:

- schematy treści w Sanity,
- Studio pod `/studio` z polskim układem i pogrupowaną listą produktów,
- odczyt treści z Sanity w `lib/data.ts` z zachowaniem obecnego interfejsu,
- migracja obecnych danych i zdjęć do Sanity,
- webhook odświeżający cache,
- dokumentacja uruchomienia dla właściciela.

Poza zakresem:

- podgląd wersji roboczych na stronie (Visual Editing / draft mode),
- ograniczanie uprawnień per typ treści,
- wielojęzyczność,
- zamówienia online.

## Model treści

Wszystkie pola z etykietami po polsku. `[w]` = wymagane.

### `category` (Kategoria)

- `name` string [w]
- `slug` slug z `name` [w] — wartości: `chleby`, `bulki-i-rogale`, `inne-wypieki`
- `lead` text — zajawka na karcie kategorii
- `cover` image — zdjęcie kategorii
- `sortOrder` number

Kategorie odpowiadają trasom strony, więc Studio blokuje ich usuwanie i tworzenie
nowych (lista jest zamknięta; nowa kategoria wymaga nowej strony w kodzie).

### `product` (Produkt)

- `name` string [w]
- `category` reference → `category` [w]
- `weight` string — np. `500 g` lub `350 / 500 / 600 g`
- `description` text [w]
- `tags` array of string — z podpowiedziami: Na zakwasie, Żytnie, Pszenne, Z dodatkami, Sezonowo
- `cutout` image — wycinanka PNG bez tła, pokazywana na tle Sand / przygaszonym zdjęciu
- `photo` image z hotspotem — prawdziwa fotografia; gdy ustawiona, karta pokazuje ją na cały kadr
- `nutrition` object: `kcal` number, `fat`, `carbs`, `fiber`, `protein`, `salt` string — wartości na 100 g
- `visible` boolean, domyślnie `true` — ukrywa produkt na stronie bez kasowania
- `sortOrder` number — kolejność w siatce, uzupełniana z drag-and-drop w Studio

Walidacja: `name` 2–80 znaków, `description` do 300 znaków, co najmniej jedno z `cutout` / `photo`
jest zalecane (ostrzeżenie, nie blokada).

### `store` (Sklep)

- `city` string [w]
- `street` string [w]
- `label` string — np. „Sklep przy piekarni"
- `hours` text [w] — wpisywane ręcznie, np. `Pn–Pt 6:00–18:00 · Sb 6:00–14:00 · Nd zamknięte`
- `image` image z hotspotem
- `mapsUrl` url
- `sortOrder` number

### `testimonial` (Opinia)

- `text` text [w]
- `author` string [w]

### `historyEntry` (Wpis w historii)

- `year` string [w]
- `title` string [w]
- `text` text [w]
- `sortOrder` number

### `siteSettings` (Ustawienia strony) — dokument pojedynczy

- `phone` string, `phoneHref` string
- `email` string
- `address` string
- `facebook` url, `instagram` url
- `catalogPdf` file lub url
- `legal` object: `nota`, `privacy`, `cookies` — file lub url
- `gallery` array of image — zdjęcia do siatki Instagram i sekcji „O nas"

## Studio

- `sanity.config.ts` w katalogu głównym, `app/studio/[[...tool]]/page.tsx` renderuje `NextStudio`.
- Struktura panelu (Structure Tool):
  1. Produkty → podlisty per kategoria, sortowanie ręczne (`orderable-document-list` lub `sortOrder`)
  2. Sklepy
  3. Opinie
  4. Historia
  5. Ustawienia strony (singleton, bez tworzenia/usuwania)
- Kategorie ukryte w menu głównym; dostępne tylko przez referencję w produkcie i przez `/studio/desk/category` dla administratora.
- Język interfejsu: polski (`@sanity/locale-pl-pl`).
- Podgląd karty produktu w liście: nazwa, kategoria, waga, miniatura, znacznik „ukryty".

## Odczyt danych w aplikacji

- `sanity/client.ts` — klient `next-sanity` z `useCdn: true` dla produkcji.
- `sanity/queries.ts` — zapytania GROQ z `defineQuery`, filtr `visible == true` dla stron publicznych.
- `sanity/image.ts` — `urlFor()` i loader dla `next/image`.
- `lib/data.ts` — zamiast importu JSON eksportuje funkcje asynchroniczne o tych samych nazwach:
  `getCategories`, `getProductsByCategory(slug)`, `getFiltersFor(slug)`, `getStores`,
  `getTestimonials`, `getHistory`, `getSiteSettings`. Każde zapytanie taguje cache
  (`next: { tags: ['sanity'] }`).
- Komponenty i strony: bez zmian w JSX poza `await` na danych i podmianą `img` na
  `next/image` z loaderem Sanity tam, gdzie źródłem jest Sanity.
- `lib/types.ts` — typy generowane z `sanity typegen`, obecne typy domenowe zostają jako
  warstwa dla komponentów (mapowanie w `lib/data.ts`).

## Odświeżanie

- `app/api/revalidate/route.ts` — przyjmuje webhook Sanity (POST), weryfikuje podpis
  `SANITY_WEBHOOK_SECRET` (`@sanity/webhook`), wywołuje `revalidateTag('sanity')`.
- Webhook w Sanity: trigger na create/update/delete dla wszystkich typów, tylko dataset `production`.
- Strony pozostają prerenderowane; po publikacji zmiana jest widoczna po pierwszym żądaniu.

## Migracja danych

`scripts/seed-sanity.ts` (uruchamiany raz przez `npx tsx`):

1. Czyta `data/products.json`.
2. Tworzy kategorie z deterministycznymi `_id` (`category-chleby` itd.).
3. Dla każdego produktu pobiera obraz z URL WordPressa, wgrywa jako asset (`cutout` dla PNG,
   `photo` dla JPG), tworzy dokument `product-<id>` z `sortOrder` według kolejności w JSON.
4. Sklepy, opinie, historia, ustawienia (galeria pobierana i wgrywana jako assety).
5. Idempotentny: `createOrReplace`, więc można uruchomić ponownie.

Po migracji `data/products.json` i `public/photos` nie są już czytane przez aplikację.
`public/logo.png` zostaje w repo.

## Zmienne środowiskowe

    NEXT_PUBLIC_SANITY_PROJECT_ID
    NEXT_PUBLIC_SANITY_DATASET=production
    NEXT_PUBLIC_SANITY_API_VERSION=2026-09-01
    SANITY_API_WRITE_TOKEN        # tylko do skryptu migracji, nie w Vercel
    SANITY_WEBHOOK_SECRET

## Obsługa błędów

- Brak połączenia z Sanity przy buildzie: build się nie powiedzie z jasnym komunikatem
  o brakującej zmiennej lub błędzie sieci. Nie ma cichego fallbacku do JSON.
- Produkt bez obrazu: karta pokazuje tło Sand bez obrazka (jak dziś dla „Innych wypieków").
- Webhook ze złym podpisem: 401, bez odświeżania.
- Przekroczenie limitów planu Free: Sanity wysyła e-mail przy 80% i 100%. Statyczne strony
  ograniczają zużycie API do publikacji, więc ryzyko jest małe; opisane w README.

## Testowanie

- Vitest: mapowanie dokumentów Sanity → typy domenowe (`lib/data.ts`), weryfikacja podpisu
  webhooka (podpis poprawny / zły / brak).
- `next build` przechodzi z danymi z Sanity.
- Ręczny scenariusz akceptacyjny: zalogowany Editor dodaje produkt ze zdjęciem, publikuje,
  produkt widoczny na stronie kategorii; przełącza `visible` na off, produkt znika;
  edytuje godziny sklepu, zmiana widoczna na `/sklepy` i na stronie głównej.

## Kroki po stronie właściciela

1. Konto na sanity.io, `npx sanity init` w repo (projekt + dataset `production`).
2. Zaproszenie menadżerów z rolą Editor (Manage → Members).
3. Token write do migracji (Manage → API → Tokens), użyty raz lokalnie.
4. Webhook (Manage → API → Webhooks) na `https://<domena>/api/revalidate` z sekretem.
5. Zmienne środowiskowe w Vercel.

## Struktura plików (nowe)

    sanity.config.ts
    sanity.cli.ts
    sanity/schemas/{category,product,store,testimonial,historyEntry,siteSettings}.ts
    sanity/schemas/index.ts
    sanity/structure.ts
    sanity/client.ts
    sanity/queries.ts
    sanity/image.ts
    app/studio/[[...tool]]/page.tsx
    app/api/revalidate/route.ts
    scripts/seed-sanity.ts
    docs/ADMIN.md               # instrukcja dla menadżerów po polsku
