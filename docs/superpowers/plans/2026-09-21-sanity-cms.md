> **Dokument historyczny.** Opisuje stan z 21 września 2026; od tego czasu m.in. pole `phoneHref` zastąpiono linkiem wyliczanym z numeru (`lib/phone.ts`), linki do PDF-ów — podstronami `/polityka-prywatnosci` i `/nota-prawna`, a kategorie dostały pole `intro`. Aktualny opis: `README.md` i `docs/ADMIN.md`.

# Panel menadżera na Sanity — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menadżerowie piekarni edytują produkty, sklepy, opinie i ustawienia strony w Sanity Studio pod `/studio`; strona publiczna czyta treść z Sanity i odświeża się po publikacji.

**Architecture:** Sanity (dataset `production`) jest jedynym źródłem treści. Studio jest osadzone w aplikacji Next.js. `lib/data.ts` zachowuje obecne nazwy funkcji, ale staje się asynchroniczne i mapuje dokumenty Sanity na istniejące typy domenowe, więc komponenty zmieniają się minimalnie. Webhook Sanity wywołuje `revalidateTag('sanity')`.

**Tech Stack:** Next.js 15.5 (App Router), React 19, `sanity` 4, `next-sanity`, `@sanity/image-url`, `@sanity/webhook` (przez `next-sanity/webhook`), `@sanity/locale-pl-pl`, Vitest, `tsx` do skryptu migracji.

**Spec:** `docs/superpowers/specs/2026-09-21-sanity-cms-design.md`

## Global Constraints

- Dataset: `production`. Zmienne: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET=production`, `NEXT_PUBLIC_SANITY_API_VERSION=2026-09-01`, `SANITY_API_WRITE_TOKEN` (tylko lokalnie), `SANITY_WEBHOOK_SECRET`.
- Etykiety pól w Studio po polsku. Interfejs Studio po polsku.
- Kategorie: zamknięta lista `chleby`, `bulki-i-rogale`, `inne-wypieki`, `_id` = `category-<slug>`.
- Strony publiczne pokazują tylko `visible == true`.
- Tag cache: `sanity` dla wszystkich zapytań. Brak fallbacku do JSON.
- Stylowanie: CSS Modules, tokeny z `styles/tokens.css`. Bez nowych bibliotek UI.
- Komendy weryfikacyjne: `npx tsc --noEmit`, `npx vitest run`, `npx next build`. Nie uruchamiać `next build` gdy działa `next dev` (wspólny katalog `.next`).
- Commity po każdym zadaniu. Repozytorium nie ma jeszcze commitów: Task 0 robi pierwszy.

---

## Struktura plików

Nowe:

    sanity.config.ts                         konfiguracja Studio (schematy, struktura, język)
    sanity.cli.ts                            projectId/dataset dla CLI (typegen, deploy)
    sanity/env.ts                            odczyt zmiennych środowiskowych z walidacją
    sanity/client.ts                         klient next-sanity (odczyt, CDN)
    sanity/image.ts                          urlFor() + loader dla next/image
    sanity/queries.ts                        zapytania GROQ (defineQuery)
    sanity/structure.ts                      Structure Tool: produkty per kategoria, singleton ustawień
    sanity/schemas/index.ts                  eksport tablicy schematów
    sanity/schemas/category.ts
    sanity/schemas/product.ts
    sanity/schemas/store.ts
    sanity/schemas/testimonial.ts
    sanity/schemas/historyEntry.ts
    sanity/schemas/siteSettings.ts
    app/studio/[[...tool]]/page.tsx          NextStudio
    app/studio/layout.tsx                    layout bez stopki serwisu
    app/api/revalidate/route.ts              webhook → revalidateTag
    lib/mappers.ts                           dokument Sanity → typ domenowy (czyste funkcje, testowane)
    lib/mappers.test.ts
    app/api/revalidate/route.test.ts
    scripts/seed-sanity.ts                   jednorazowa migracja z data/products.json
    vitest.config.ts
    docs/ADMIN.md                            instrukcja dla menadżerów
    .env.example

Modyfikowane:

    package.json                             zależności, skrypty test/seed/typegen
    next.config.ts                           remotePatterns cdn.sanity.io
    lib/types.ts                             Product.photo/cutout jako URL, Store bez zmian, SiteSettings
    lib/data.ts                              async, Sanity zamiast JSON
    components/cards/ProductCard.tsx         obrazy z Sanity przez loader
    components/cards/CategoryCard.tsx        j.w.
    components/cards/StoreCard.tsx           j.w.
    components/sections/InstagramGrid.tsx    galeria z siteSettings
    components/sections/StoreList.tsx        async
    components/sections/Timeline.tsx         async
    components/layout/Footer.tsx             async, contact z siteSettings
    components/layout/Header.tsx             contact jako prop (client component)
    app/layout.tsx                           przekazuje settings do Footer
    app/page.tsx, app/chleby/page.tsx, app/bulki-i-rogale/page.tsx,
    app/inne-wypieki/page.tsx, app/o-nas/page.tsx, app/sklepy/page.tsx,
    app/kontakt/page.tsx, app/dokumenty/page.tsx, app/design-system/page.tsx
    README.md

Usuwane po migracji (Task 8): `data/products.json`, `public/photos/`.

---

### Task 0: Pierwszy commit i projekt Sanity

**Files:**
- Create: `.env.example`, `.env.local` (nie w repo)
- Modify: `.gitignore`

**Interfaces:**
- Produces: zmienne środowiskowe czytane przez `sanity/env.ts` w Task 1.

- [ ] **Step 1: Pierwszy commit obecnego stanu aplikacji**

```bash
cd /Users/ninectrl/WebstormProjects/piekarnia_v2
git add -A
git commit -m "feat: initial Next.js implementation of the Bieżyński design system

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

- [ ] **Step 2: Utworzyć projekt Sanity (krok właściciela, interaktywny)**

Uruchomić w terminalu użytkownika (loguje przez przeglądarkę):

```bash
npx sanity@latest init --env --bare
```

Odpowiedzi: nowy projekt o nazwie `Piekarnia Biezynski`, dataset `production`, visibility `public`.
Polecenie zapisuje `NEXT_PUBLIC_SANITY_PROJECT_ID` i `NEXT_PUBLIC_SANITY_DATASET` do `.env`.
Przenieść je do `.env.local` i dopisać:

```
NEXT_PUBLIC_SANITY_API_VERSION=2026-09-01
SANITY_WEBHOOK_SECRET=zmien-mnie
```

- [ ] **Step 3: `.env.example` i `.gitignore`**

`.env.example`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-09-01
# tylko lokalnie, do scripts/seed-sanity.ts — nie dodawać w Vercel
SANITY_API_WRITE_TOKEN=
# ten sam sekret wpisany w Sanity → Manage → API → Webhooks
SANITY_WEBHOOK_SECRET=
```

Do `.gitignore` dopisać linię `.env` (obecny wpis `.env*.local` nie łapie `.env` tworzonego przez `sanity init`).

- [ ] **Step 4: Commit**

```bash
git add .env.example .gitignore
git commit -m "chore: sanity env template

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 1: Zależności, konfiguracja Studio, pusty Studio pod /studio

**Files:**
- Create: `sanity/env.ts`, `sanity/client.ts`, `sanity/image.ts`, `sanity.config.ts`, `sanity.cli.ts`, `sanity/schemas/index.ts`, `app/studio/[[...tool]]/page.tsx`, `app/studio/layout.tsx`, `vitest.config.ts`
- Modify: `package.json`, `next.config.ts`, `tsconfig.json`

**Interfaces:**
- Produces: `client` (`sanity/client.ts`), `urlFor(source)` i `sanityImageLoader` (`sanity/image.ts`), `env` (`sanity/env.ts`), `schemaTypes` (`sanity/schemas/index.ts`, na razie pusta tablica).

- [ ] **Step 1: Instalacja**

```bash
npm install sanity next-sanity @sanity/image-url @sanity/locale-pl-pl @sanity/webhook styled-components
npm install -D vitest tsx @types/node
```

`styled-components` jest peer dependency pakietu `sanity`.

- [ ] **Step 2: Skrypty w `package.json`**

Dodać do `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest",
"seed:sanity": "tsx --env-file=.env.local scripts/seed-sanity.ts",
"typegen": "sanity schema extract --enforce-required-fields && sanity typegen generate"
```

- [ ] **Step 3: `sanity/env.ts`**

```ts
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Brak zmiennej środowiskowej ${name}. Skopiuj .env.example do .env.local i uzupełnij.`);
  }
  return value;
}

export const env = {
  projectId: required('NEXT_PUBLIC_SANITY_PROJECT_ID', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  dataset: required('NEXT_PUBLIC_SANITY_DATASET', process.env.NEXT_PUBLIC_SANITY_DATASET),
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-09-01',
};
```

- [ ] **Step 4: `sanity/client.ts`**

```ts
import { createClient } from 'next-sanity';
import { env } from './env';

export const client = createClient({
  projectId: env.projectId,
  dataset: env.dataset,
  apiVersion: env.apiVersion,
  useCdn: true,
  perspective: 'published',
});

/** Cache tag used by every public query; the webhook revalidates it. */
export const SANITY_TAG = 'sanity';
```

- [ ] **Step 5: `sanity/image.ts`**

```ts
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { ImageLoaderProps } from 'next/image';
import { env } from './env';

const builder = imageUrlBuilder({ projectId: env.projectId, dataset: env.dataset });

export const urlFor = (source: SanityImageSource) => builder.image(source).auto('format');

/**
 * next/image loader for URLs that already point at cdn.sanity.io.
 * Adds width/quality; keeps hotspot params that urlFor() put in the URL.
 */
export function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 80));
  url.searchParams.set('auto', 'format');
  return url.toString();
}

export const isSanityUrl = (src: string) => src.startsWith('https://cdn.sanity.io/');
```

- [ ] **Step 6: `sanity/schemas/index.ts`** (na razie puste, Task 2 wypełni)

```ts
import type { SchemaTypeDefinition } from 'sanity';

export const schemaTypes: SchemaTypeDefinition[] = [];
```

- [ ] **Step 7: `sanity.config.ts` i `sanity.cli.ts`**

`sanity.config.ts`:

```ts
'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { plPLLocale } from '@sanity/locale-pl-pl';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'piekarnia',
  title: 'Piekarnia Bieżyński',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool(), plLocale()],
  schema: { types: schemaTypes },
});

function plLocale() {
  return plPLLocale();
}
```

`sanity.cli.ts`:

```ts
import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
```

- [ ] **Step 8: Trasa Studio**

`app/studio/layout.tsx`:

```tsx
import type { ReactNode } from 'react';

export const metadata = { title: 'Studio — Piekarnia Bieżyński', robots: { index: false } };

/** Studio renders its own chrome; skip the site Footer from the root layout. */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return <div style={{ minHeight: '100vh' }}>{children}</div>;
}
```

`app/studio/[[...tool]]/page.tsx`:

```tsx
import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export const dynamic = 'force-static';
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

Stopka z root layoutu nadal renderuje się pod Studio. W Task 6 root layout przestanie renderować `Footer` dla ścieżek `/studio` (przenosimy `Footer` do layoutu grupy `(site)`).

- [ ] **Step 9: `next.config.ts`** — dodać domenę CDN

```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'www.biezynski.swidnica.pl' },
    { protocol: 'https', hostname: 'cdn.sanity.io' },
  ],
},
```

- [ ] **Step 10: `vitest.config.ts` i tsconfig**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { environment: 'node', include: ['**/*.test.ts'], exclude: ['node_modules', '.next'] },
});
```

W `tsconfig.json` dodać `"vitest.config.ts"`, `"sanity.config.ts"`, `"sanity.cli.ts"`, `"scripts/**/*.ts"` do `include` (glob `**/*.ts` już je obejmuje; upewnić się, że `exclude` nie wycina `scripts`).

- [ ] **Step 11: Weryfikacja**

```bash
npx tsc --noEmit
```
Expected: 0 błędów.

Uruchomić `npm run dev` w terminalu użytkownika, otworzyć `http://localhost:3000/studio`. Expected: ekran logowania Sanity, po zalogowaniu pusty panel „No document types".

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat(sanity): embed Studio at /studio with client and image helpers

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Schematy treści i struktura Studio

**Files:**
- Create: `sanity/schemas/category.ts`, `sanity/schemas/product.ts`, `sanity/schemas/store.ts`, `sanity/schemas/testimonial.ts`, `sanity/schemas/historyEntry.ts`, `sanity/schemas/siteSettings.ts`, `sanity/structure.ts`
- Modify: `sanity/schemas/index.ts`, `sanity.config.ts`

**Interfaces:**
- Produces: typy dokumentów `category`, `product`, `store`, `testimonial`, `historyEntry`, `siteSettings` z polami dokładnie jak niżej. Task 3 (zapytania) i Task 7 (seed) opierają się na tych nazwach pól.

- [ ] **Step 1: `sanity/schemas/category.ts`**

```ts
import { defineField, defineType } from 'sanity';

export const CATEGORY_SLUGS = ['chleby', 'bulki-i-rogale', 'inne-wypieki'] as const;

export const category = defineType({
  name: 'category',
  title: 'Kategoria',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nazwa', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Adres (slug)',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) =>
        r.required().custom((slug) =>
          slug?.current && (CATEGORY_SLUGS as readonly string[]).includes(slug.current)
            ? true
            : 'Dozwolone: ' + CATEGORY_SLUGS.join(', '),
        ),
      readOnly: true,
    }),
    defineField({ name: 'lead', title: 'Zajawka', type: 'text', rows: 3 }),
    defineField({ name: 'cover', title: 'Zdjęcie', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { title: 'name', media: 'cover' } },
});
```

- [ ] **Step 2: `sanity/schemas/product.ts`**

```ts
import { defineField, defineType } from 'sanity';

export const TAG_OPTIONS = ['Na zakwasie', 'Żytnie', 'Pszenne', 'Z dodatkami', 'Sezonowo'];

export const product = defineType({
  name: 'product',
  title: 'Produkt',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Podstawowe', default: true },
    { name: 'media', title: 'Zdjęcia' },
    { name: 'nutrition', title: 'Wartości odżywcze' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nazwa',
      type: 'string',
      group: 'basic',
      validation: (r) => r.required().min(2).max(80),
    }),
    defineField({
      name: 'category',
      title: 'Kategoria',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'basic',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'weight',
      title: 'Waga',
      type: 'string',
      group: 'basic',
      description: 'np. „500 g” albo „350 / 500 / 600 g”',
    }),
    defineField({
      name: 'description',
      title: 'Opis',
      type: 'text',
      rows: 3,
      group: 'basic',
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: 'tags',
      title: 'Tagi',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'basic',
      options: { list: TAG_OPTIONS, layout: 'tags' },
    }),
    defineField({
      name: 'visible',
      title: 'Widoczny na stronie',
      type: 'boolean',
      group: 'basic',
      initialValue: true,
      description: 'Wyłącz, żeby ukryć produkt (np. sezonowy) bez kasowania.',
    }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', group: 'basic', initialValue: 100 }),
    defineField({
      name: 'cutout',
      title: 'Wycinanka (PNG bez tła)',
      type: 'image',
      group: 'media',
      description: 'Pokazywana na jasnym tle. Jeśli dodasz też fotografię, karta użyje fotografii.',
    }),
    defineField({
      name: 'photo',
      title: 'Fotografia',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      description: 'Prawdziwe zdjęcie, pokazywane na cały kadr karty.',
    }),
    defineField({
      name: 'nutrition',
      title: 'Wartości odżywcze (100 g)',
      type: 'object',
      group: 'nutrition',
      fields: [
        defineField({ name: 'kcal', title: 'kcal', type: 'number' }),
        defineField({ name: 'fat', title: 'Tłuszcz', type: 'string' }),
        defineField({ name: 'carbs', title: 'Węglowodany', type: 'string' }),
        defineField({ name: 'fiber', title: 'Błonnik', type: 'string' }),
        defineField({ name: 'protein', title: 'Białko', type: 'string' }),
        defineField({ name: 'salt', title: 'Sól', type: 'string' }),
      ],
      options: { collapsible: true, collapsed: false },
    }),
  ],
  validation: (r) =>
    r.custom((doc) =>
      doc?.cutout || doc?.photo ? true : { message: 'Dodaj wycinankę albo fotografię.', level: 'warning' as const },
    ),
  preview: {
    select: { title: 'name', subtitle: 'weight', media: 'photo', cutout: 'cutout', visible: 'visible', category: 'category.name' },
    prepare({ title, subtitle, media, cutout, visible, category }) {
      return {
        title: visible === false ? `${title} (ukryty)` : title,
        subtitle: [category, subtitle].filter(Boolean).join(' · '),
        media: media ?? cutout,
      };
    },
  },
});
```

Jeśli `validation` na poziomie dokumentu z `level: 'warning'` nie kompiluje się w zainstalowanej wersji `sanity`, użyć `r.custom(...)` zwracającego string i `.warning()`:
`validation: (r) => r.custom((doc) => (doc?.cutout || doc?.photo ? true : 'Dodaj wycinankę albo fotografię.')).warning()`.

- [ ] **Step 3: `sanity/schemas/store.ts`**

```ts
import { defineField, defineType } from 'sanity';

export const store = defineType({
  name: 'store',
  title: 'Sklep',
  type: 'document',
  fields: [
    defineField({ name: 'city', title: 'Miasto', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'street', title: 'Ulica i numer', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Etykieta', type: 'string', description: 'np. „Sklep przy piekarni”' }),
    defineField({
      name: 'hours',
      title: 'Godziny otwarcia',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
      description: 'np. „Pn–Pt 6:00–18:00 · Sb 6:00–14:00 · Nd zamknięte”',
    }),
    defineField({ name: 'image', title: 'Zdjęcie', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'mapsUrl', title: 'Link do map Google', type: 'url' }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', initialValue: 100 }),
  ],
  preview: {
    select: { city: 'city', street: 'street', media: 'image' },
    prepare: ({ city, street, media }) => ({ title: `${city}, ${street}`, media }),
  },
});
```

- [ ] **Step 4: `sanity/schemas/testimonial.ts` i `historyEntry.ts`**

```ts
// testimonial.ts
import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Opinia',
  type: 'document',
  fields: [
    defineField({ name: 'text', title: 'Treść', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'author', title: 'Autor', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'author', subtitle: 'text' } },
});
```

```ts
// historyEntry.ts
import { defineField, defineType } from 'sanity';

export const historyEntry = defineType({
  name: 'historyEntry',
  title: 'Wpis w historii',
  type: 'document',
  fields: [
    defineField({ name: 'year', title: 'Rok', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Tytuł', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'text', title: 'Treść', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'year', subtitle: 'title' } },
});
```

- [ ] **Step 5: `sanity/schemas/siteSettings.ts`**

```ts
import { defineField, defineType } from 'sanity';

export const SITE_SETTINGS_ID = 'siteSettings';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Ustawienia strony',
  type: 'document',
  fields: [
    defineField({ name: 'phone', title: 'Telefon (wyświetlany)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phoneHref', title: 'Telefon (link tel:)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', title: 'E-mail', type: 'string' }),
    defineField({ name: 'address', title: 'Adres', type: 'string' }),
    defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
    defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
    defineField({ name: 'catalogPdf', title: 'Katalog PDF (link)', type: 'url' }),
    defineField({
      name: 'legal',
      title: 'Dokumenty prawne (linki do PDF)',
      type: 'object',
      fields: [
        defineField({ name: 'nota', title: 'Nota prawna', type: 'url' }),
        defineField({ name: 'privacy', title: 'Polityka prywatności', type: 'url' }),
        defineField({ name: 'cookies', title: 'Polityka cookies', type: 'url' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria (Instagram, „O nas”)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Ustawienia strony' }) },
});
```

- [ ] **Step 6: `sanity/schemas/index.ts`**

```ts
import type { SchemaTypeDefinition } from 'sanity';
import { category } from './category';
import { product } from './product';
import { store } from './store';
import { testimonial } from './testimonial';
import { historyEntry } from './historyEntry';
import { siteSettings } from './siteSettings';

export const schemaTypes: SchemaTypeDefinition[] = [category, product, store, testimonial, historyEntry, siteSettings];
```

- [ ] **Step 7: `sanity/structure.ts`**

```ts
import type { StructureResolver } from 'sanity/structure';
import { CATEGORY_SLUGS } from './schemas/category';
import { SITE_SETTINGS_ID } from './schemas/siteSettings';

const CATEGORY_TITLES: Record<(typeof CATEGORY_SLUGS)[number], string> = {
  chleby: 'Chleby',
  'bulki-i-rogale': 'Bułki i rogale',
  'inne-wypieki': 'Inne wypieki',
};

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Treść')
    .items([
      S.listItem()
        .title('Produkty')
        .child(
          S.list()
            .title('Produkty')
            .items([
              ...CATEGORY_SLUGS.map((slug) =>
                S.listItem()
                  .title(CATEGORY_TITLES[slug])
                  .child(
                    S.documentTypeList('product')
                      .title(CATEGORY_TITLES[slug])
                      .filter('_type == "product" && category._ref == $categoryId')
                      .params({ categoryId: `category-${slug}` })
                      .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                      .initialValueTemplates([
                        S.initialValueTemplateItem('product-in-category', { categoryId: `category-${slug}` }),
                      ]),
                  ),
              ),
              S.divider(),
              S.documentTypeListItem('product').title('Wszystkie produkty'),
            ]),
        ),
      S.documentTypeListItem('store').title('Sklepy'),
      S.documentTypeListItem('testimonial').title('Opinie'),
      S.documentTypeListItem('historyEntry').title('Historia'),
      S.divider(),
      S.listItem()
        .title('Ustawienia strony')
        .child(S.document().schemaType('siteSettings').documentId(SITE_SETTINGS_ID)),
    ]);

/** Types hidden from the "create new" menu; categories are fixed, settings is a singleton. */
export const HIDDEN_FROM_NEW = new Set(['category', 'siteSettings']);
```

- [ ] **Step 8: Podpiąć strukturę, szablon i blokady w `sanity.config.ts`**

Zastąpić całą zawartość:

```ts
'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { plPLLocale } from '@sanity/locale-pl-pl';
import { schemaTypes } from './sanity/schemas';
import { HIDDEN_FROM_NEW, structure } from './sanity/structure';

export default defineConfig({
  name: 'piekarnia',
  title: 'Piekarnia Bieżyński',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool({ structure }), plPLLocale()],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter((t) => !HIDDEN_FROM_NEW.has(t.schemaType)),
      {
        id: 'product-in-category',
        title: 'Produkt w kategorii',
        schemaType: 'product',
        parameters: [{ name: 'categoryId', type: 'string' }],
        value: (params: { categoryId: string }) => ({
          category: { _type: 'reference', _ref: params.categoryId },
          visible: true,
        }),
      },
    ],
  },
  document: {
    actions: (prev, { schemaType }) =>
      schemaType === 'category' || schemaType === 'siteSettings'
        ? prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish')
        : prev,
  },
});
```

- [ ] **Step 9: Weryfikacja w Studio**

```bash
npx tsc --noEmit
```
Expected: 0 błędów.

W przeglądarce `http://localhost:3000/studio`: menu Treść → Produkty → Chleby (pusta lista), przycisk „+” tworzy produkt z ustawioną kategorią (referencja wskazuje na nieistniejący jeszcze dokument `category-chleby`, to w porządku do czasu seeda). Interfejs po polsku. W menu „Utwórz nowy” nie ma Kategorii ani Ustawień.

- [ ] **Step 10: Commit**

```bash
git add sanity sanity.config.ts
git commit -m "feat(sanity): content schemas and Studio structure

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Mapowanie dokumentów na typy domenowe (TDD)

**Files:**
- Create: `lib/mappers.ts`, `lib/mappers.test.ts`
- Modify: `lib/types.ts`

**Interfaces:**
- Consumes: kształt dokumentów z Task 2.
- Produces:
  - `type SanityImageRef = { asset?: { _ref: string }; hotspot?: {...}; crop?: {...} } | null`
  - `mapProduct(doc: ProductDoc): Product`, `mapStore(doc: StoreDoc): Store`, `mapCategory(doc: CategoryDoc): Category`, `mapSettings(doc: SettingsDoc | null): SiteSettings`
  - `SiteSettings` w `lib/types.ts`.
  - Task 4 używa tych mapperów po zapytaniach GROQ.

- [ ] **Step 1: Rozszerzyć `lib/types.ts`**

Dodać na końcu:

```ts
export type SiteSettings = {
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  catalogPdf: string;
  legal: { nota: string; privacy: string; cookies: string };
  /** image URLs (cdn.sanity.io) */
  gallery: string[];
};
```

Pola `Product.image` i `Product.photo` oraz `Category.cover`, `Store.image` pozostają stringami URL; mappery zamieniają assety na URL-e z `urlFor`.

- [ ] **Step 2: Test — `lib/mappers.test.ts`**

```ts
import { describe, expect, it, vi } from 'vitest';

vi.mock('../sanity/env', () => ({ env: { projectId: 'abc123', dataset: 'production', apiVersion: '2026-09-01' } }));

import { mapCategory, mapProduct, mapSettings, mapStore } from './mappers';

const img = (id: string) => ({ _type: 'image', asset: { _ref: `image-${id}-800x600-png` } });

describe('mapProduct', () => {
  it('maps a full product and turns image refs into cdn URLs', () => {
    const p = mapProduct({
      _id: 'product-chleb-zytni',
      name: 'Chleb żytni',
      categorySlug: 'chleby',
      weight: '450 g',
      description: 'Opis',
      tags: ['Żytnie'],
      cutout: img('aaa'),
      photo: img('bbb'),
      nutrition: { kcal: 207, fat: '1,42 g', carbs: '48,48 g', fiber: '4,34 g', protein: '4,95 g', salt: '2,8 g' },
      visible: true,
      sortOrder: 3,
    });
    expect(p.id).toBe('product-chleb-zytni');
    expect(p.category).toBe('chleby');
    expect(p.image).toMatch(/^https:\/\/cdn\.sanity\.io\/images\/abc123\/production\/aaa-800x600\.png/);
    expect(p.photo).toMatch(/bbb-800x600\.png/);
    expect(p.nutrition?.kcal).toBe(207);
    expect(p.tags).toEqual(['Żytnie']);
  });

  it('fills defaults for missing optional fields', () => {
    const p = mapProduct({
      _id: 'x',
      name: 'Chałka',
      categorySlug: 'inne-wypieki',
      description: 'Pleciona',
    });
    expect(p.weight).toBe('');
    expect(p.tags).toEqual([]);
    expect(p.image).toBe('');
    expect(p.photo).toBeUndefined();
    expect(p.nutrition).toBeNull();
  });

  it('treats nutrition without kcal as absent', () => {
    const p = mapProduct({ _id: 'x', name: 'A', categorySlug: 'chleby', description: 'd', nutrition: { fat: '1 g' } });
    expect(p.nutrition).toBeNull();
  });
});

describe('mapStore / mapCategory', () => {
  it('maps store with image and maps link', () => {
    const s = mapStore({ _id: 'store-1', city: 'Świdnica', street: 'ul. Składowa 3', label: 'Sklep', hours: 'Pn–Pt 6–18', image: img('ccc'), mapsUrl: 'https://maps.google.com/?q=x' });
    expect(s.id).toBe('store-1');
    expect(s.image).toContain('ccc-800x600.png');
    expect(s.maps).toBe('https://maps.google.com/?q=x');
  });

  it('maps category with slug and cover', () => {
    const c = mapCategory({ _id: 'category-chleby', name: 'Chleby', slug: 'chleby', lead: 'Lead', cover: img('ddd') });
    expect(c).toMatchObject({ slug: 'chleby', name: 'Chleby', lead: 'Lead' });
    expect(c.cover).toContain('ddd-800x600.png');
  });
});

describe('mapSettings', () => {
  it('returns empty strings when settings document is missing', () => {
    const s = mapSettings(null);
    expect(s.phone).toBe('');
    expect(s.gallery).toEqual([]);
    expect(s.legal).toEqual({ nota: '', privacy: '', cookies: '' });
  });

  it('maps gallery images to urls', () => {
    const s = mapSettings({ phone: '503 083 208', phoneHref: 'tel:+48503083208', gallery: [img('e1'), img('e2')] });
    expect(s.gallery).toHaveLength(2);
    expect(s.gallery[0]).toContain('e1-800x600.png');
  });
});
```

- [ ] **Step 3: Uruchomić test, oczekiwać porażki**

```bash
npx vitest run lib/mappers.test.ts
```
Expected: FAIL — `Cannot find module './mappers'`.

- [ ] **Step 4: Implementacja `lib/mappers.ts`**

```ts
import { urlFor } from '../sanity/image';
import type { Category, CategorySlug, Nutrition, Product, SiteSettings, Store } from './types';

export type SanityImageRef = { asset?: { _ref: string }; hotspot?: unknown; crop?: unknown } | null | undefined;

export type ProductDoc = {
  _id: string;
  name: string;
  categorySlug: string;
  weight?: string | null;
  description: string;
  tags?: string[] | null;
  cutout?: SanityImageRef;
  photo?: SanityImageRef;
  nutrition?: Partial<Nutrition> | null;
  visible?: boolean | null;
  sortOrder?: number | null;
};

export type StoreDoc = {
  _id: string;
  city: string;
  street: string;
  label?: string | null;
  hours: string;
  image?: SanityImageRef;
  mapsUrl?: string | null;
};

export type CategoryDoc = {
  _id: string;
  name: string;
  slug: string;
  lead?: string | null;
  cover?: SanityImageRef;
};

export type SettingsDoc = {
  phone?: string | null;
  phoneHref?: string | null;
  email?: string | null;
  address?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  catalogPdf?: string | null;
  legal?: { nota?: string | null; privacy?: string | null; cookies?: string | null } | null;
  gallery?: SanityImageRef[] | null;
};

const imageUrl = (ref: SanityImageRef): string => (ref?.asset?._ref ? urlFor(ref).url() : '');

const str = (v: string | null | undefined) => v ?? '';

export function mapProduct(doc: ProductDoc): Product {
  const n = doc.nutrition;
  const nutrition: Nutrition | null =
    n && typeof n.kcal === 'number'
      ? { kcal: n.kcal, fat: str(n.fat), carbs: str(n.carbs), fiber: str(n.fiber), protein: str(n.protein), salt: str(n.salt) }
      : null;
  const photo = imageUrl(doc.photo);
  return {
    id: doc._id,
    category: doc.categorySlug as CategorySlug,
    name: doc.name,
    weight: str(doc.weight),
    tags: doc.tags ?? [],
    description: doc.description,
    image: imageUrl(doc.cutout),
    photo: photo || undefined,
    nutrition,
  };
}

export function mapStore(doc: StoreDoc): Store {
  return {
    id: doc._id,
    city: doc.city,
    street: doc.street,
    label: str(doc.label),
    hours: doc.hours,
    image: imageUrl(doc.image),
    maps: str(doc.mapsUrl),
  };
}

export function mapCategory(doc: CategoryDoc): Category {
  return { slug: doc.slug as CategorySlug, name: doc.name, lead: str(doc.lead), cover: imageUrl(doc.cover) };
}

export function mapSettings(doc: SettingsDoc | null): SiteSettings {
  return {
    phone: str(doc?.phone),
    phoneHref: str(doc?.phoneHref),
    email: str(doc?.email),
    address: str(doc?.address),
    facebook: str(doc?.facebook),
    instagram: str(doc?.instagram),
    catalogPdf: str(doc?.catalogPdf),
    legal: { nota: str(doc?.legal?.nota), privacy: str(doc?.legal?.privacy), cookies: str(doc?.legal?.cookies) },
    gallery: (doc?.gallery ?? []).map(imageUrl).filter(Boolean),
  };
}
```

- [ ] **Step 5: Uruchomić testy**

```bash
npx vitest run lib/mappers.test.ts
```
Expected: 7 testów PASS. Jeśli URL z `urlFor().url()` różni się formatem od oczekiwanego w teście (np. brak `?auto=format`), dopasować `toMatch`/`toContain` w teście do rzeczywistego prefiksu `https://cdn.sanity.io/images/abc123/production/aaa-800x600.png`, nie zmieniać implementacji.

- [ ] **Step 6: Commit**

```bash
git add lib/mappers.ts lib/mappers.test.ts lib/types.ts
git commit -m "feat(sanity): map Sanity documents to domain types

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Zapytania GROQ i asynchroniczne `lib/data.ts`

**Files:**
- Create: `sanity/queries.ts`
- Modify: `lib/data.ts` (pełna podmiana)

**Interfaces:**
- Consumes: `client`, `SANITY_TAG` (Task 1), mappery (Task 3).
- Produces (wszystkie `async`):
  - `getCategories(): Promise<Category[]>`
  - `getCategoryBySlug(slug: string): Promise<Category | undefined>`
  - `getProductsByCategory(slug: CategorySlug): Promise<Product[]>`
  - `getFiltersFor(slug: CategorySlug): Promise<string[]>`
  - `getStores(): Promise<Store[]>`
  - `getTestimonials(): Promise<Testimonial[]>`
  - `getHistory(): Promise<HistoryEntry[]>`
  - `getSiteSettings(): Promise<SiteSettings>`
  - `getAllProducts(): Promise<Product[]>` (design-system page)

- [ ] **Step 1: `sanity/queries.ts`**

```ts
import { defineQuery } from 'next-sanity';

const productProjection = `{
  _id, name, "categorySlug": category->slug.current, weight, description, tags,
  cutout, photo, nutrition, visible, sortOrder
}`;

export const categoriesQuery = defineQuery(
  `*[_type == "category"] | order(sortOrder asc) { _id, name, "slug": slug.current, lead, cover }`,
);

export const productsByCategoryQuery = defineQuery(
  `*[_type == "product" && visible == true && category->slug.current == $slug] | order(sortOrder asc, name asc) ${productProjection}`,
);

export const allProductsQuery = defineQuery(
  `*[_type == "product" && visible == true] | order(sortOrder asc, name asc) ${productProjection}`,
);

export const storesQuery = defineQuery(
  `*[_type == "store"] | order(sortOrder asc) { _id, city, street, label, hours, image, mapsUrl }`,
);

export const testimonialsQuery = defineQuery(`*[_type == "testimonial"] | order(sortOrder asc) { text, author }`);

export const historyQuery = defineQuery(`*[_type == "historyEntry"] | order(sortOrder asc) { year, title, text }`);

export const siteSettingsQuery = defineQuery(
  `*[_type == "siteSettings" && _id == "siteSettings"][0] { phone, phoneHref, email, address, facebook, instagram, catalogPdf, legal, gallery }`,
);
```

- [ ] **Step 2: Nowy `lib/data.ts`**

```ts
import { client, SANITY_TAG } from '../sanity/client';
import {
  allProductsQuery,
  categoriesQuery,
  historyQuery,
  productsByCategoryQuery,
  siteSettingsQuery,
  storesQuery,
  testimonialsQuery,
} from '../sanity/queries';
import { mapCategory, mapProduct, mapSettings, mapStore } from './mappers';
import type { CategoryDoc, ProductDoc, SettingsDoc, StoreDoc } from './mappers';
import type { Category, CategorySlug, HistoryEntry, Product, SiteSettings, Store, Testimonial } from './types';

const fetchOptions = { next: { tags: [SANITY_TAG] } } as const;

export async function getCategories(): Promise<Category[]> {
  const docs = await client.fetch<CategoryDoc[]>(categoriesQuery, {}, fetchOptions);
  return docs.map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getProductsByCategory(slug: CategorySlug): Promise<Product[]> {
  const docs = await client.fetch<ProductDoc[]>(productsByCategoryQuery, { slug }, fetchOptions);
  return docs.map(mapProduct);
}

export async function getAllProducts(): Promise<Product[]> {
  const docs = await client.fetch<ProductDoc[]>(allProductsQuery, {}, fetchOptions);
  return docs.map(mapProduct);
}

export async function getFiltersFor(slug: CategorySlug): Promise<string[]> {
  const tags = new Set<string>();
  (await getProductsByCategory(slug)).forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return ['Wszystkie', ...Array.from(tags)];
}

export async function getStores(): Promise<Store[]> {
  const docs = await client.fetch<StoreDoc[]>(storesQuery, {}, fetchOptions);
  return docs.map(mapStore);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch<Testimonial[]>(testimonialsQuery, {}, fetchOptions);
}

export async function getHistory(): Promise<HistoryEntry[]> {
  return client.fetch<HistoryEntry[]>(historyQuery, {}, fetchOptions);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const doc = await client.fetch<SettingsDoc | null>(siteSettingsQuery, {}, fetchOptions);
  return mapSettings(doc);
}
```

Jeśli `client.fetch` w zainstalowanej wersji `next-sanity` nie przyjmuje `next.tags` w trzecim argumencie w tej formie, użyć `{ next: { tags: [SANITY_TAG] } }` zgodnie z sygnaturą `FilteredResponseQueryOptions` z `next-sanity` (sprawdzić `node_modules/next-sanity/dist/index.d.ts`).

- [ ] **Step 3: Weryfikacja typów**

```bash
npx tsc --noEmit
```
Expected: błędy tylko w plikach, które importują stare eksporty (`categories`, `products`, `stores`, `contact`, `gallery`, `history`, `testimonials`, `productsByCategory`, `filtersFor`). To lista do Task 5 i 6. Zapisać ją w notatce do następnego zadania.

- [ ] **Step 4: Commit**

```bash
git add sanity/queries.ts lib/data.ts
git commit -m "feat(sanity): GROQ queries and async data layer

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Komponenty czytają dane z props lub async

**Files:**
- Modify: `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `components/sections/StoreList.tsx`, `components/sections/Timeline.tsx`, `components/sections/InstagramGrid.tsx`, `components/cards/ProductCard.tsx`, `components/cards/CategoryCard.tsx`, `components/cards/StoreCard.tsx`, `components/sections/Hero.tsx`, `app/design-system/page.tsx` (tylko import Header)

**Interfaces:**
- Consumes: `getStores`, `getHistory`, `getSiteSettings` (Task 4); `sanityImageLoader`, `isSanityUrl` (Task 1).
- Produces:
  - `Header({ variant, phone, phoneHref })` — client component bez importu danych.
  - `Footer()` — async server component, sam pobiera ustawienia.
  - `StoreList({ disclaimer })`, `Timeline()` — async server components.
  - `InstagramGrid({ images, count })` — `images: string[]` z props.
  - `SanityImage` helper wewnątrz każdego card: `<Image loader={isSanityUrl(src) ? sanityImageLoader : undefined} ... />`.

- [ ] **Step 1: `Header.tsx` — telefon z props**

Usunąć `import { contact } from '../../lib/data';`. Zmienić sygnaturę:

```tsx
export function Header({
  variant = 'solid',
  phone,
  phoneHref,
}: {
  variant?: 'solid' | 'onHero' | 'onDark';
  phone: string;
  phoneHref: string;
}) {
```

Zamienić wszystkie `contact.phone` → `phone`, `contact.phoneHref` → `phoneHref` (4 miejsca: link desktop, przycisk `tel`, aria-label, `menuCall`).

- [ ] **Step 2: `Footer.tsx` — async**

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { Container } from './Container';
import { getSiteSettings } from '../../lib/data';
import s from './Footer.module.css';

export async function Footer() {
  const contact = await getSiteSettings();
  return (
    /* JSX bez zmian — używa contact.catalogPdf, contact.phoneHref, contact.phone, contact.address, contact.facebook, contact.instagram */
  );
}
```

Zachować całe obecne JSX; zmienia się tylko nagłówek funkcji i źródło `contact`.

- [ ] **Step 3: `StoreList.tsx` i `Timeline.tsx` — async**

```tsx
// StoreList.tsx: zamiast `import { stores } ...`
import { getStores } from '../../lib/data';
export async function StoreList({ disclaimer }: { disclaimer?: string }) {
  const stores = await getStores();
  /* reszta JSX bez zmian */
}
```

```tsx
// Timeline.tsx
import { getHistory } from '../../lib/data';
export async function Timeline() {
  const history = await getHistory();
  /* reszta JSX bez zmian */
}
```

- [ ] **Step 4: `InstagramGrid.tsx` — zdjęcia z props i loader Sanity**

```tsx
import Image from 'next/image';
import { isSanityUrl, sanityImageLoader } from '../../sanity/image';
import s from './InstagramGrid.module.css';

export function InstagramGrid({ images, count = 6 }: { images: string[]; count?: number }) {
  return (
    <div className={s.grid}>
      {images.slice(0, count).map((src) => (
        <Image key={src} src={src} alt="" width={400} height={400} loader={isSanityUrl(src) ? sanityImageLoader : undefined} />
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Loader Sanity w kartach i hero**

W `ProductCard.tsx`, `CategoryCard.tsx`, `StoreCard.tsx`, `Hero.tsx`: dodać `import { isSanityUrl, sanityImageLoader } from '../../sanity/image';` i do każdego `<Image src={X} ...>` dodać `loader={isSanityUrl(X) ? sanityImageLoader : undefined}`. W `ProductCard` dotyczy dwóch `<Image>` (`product.photo!` i `product.image`).

- [ ] **Step 6: `app/design-system/page.tsx` — Header z props**

Zamienić trzy wystąpienia `<Header />`, `<Header variant="onDark" />` na wersje z `phone={settings.phone} phoneHref={settings.phoneHref}`; `settings` pochodzi z `await getSiteSettings()` (pełna przebudowa tej strony jest w Task 6, Step 8; tu tylko zapewnić kompilację nagłówka).

- [ ] **Step 7: Weryfikacja**

```bash
npx tsc --noEmit
```
Expected: błędy pozostały wyłącznie w `app/**/page.tsx` i `app/layout.tsx` (stare importy z `lib/data`). Komponenty kompilują się.

- [ ] **Step 8: Commit**

```bash
git add components app/design-system/page.tsx
git commit -m "refactor: components take Sanity data via props or async fetch

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Strony pobierają dane z Sanity

**Files:**
- Create: `app/(site)/layout.tsx`
- Move: `app/page.tsx`, `app/page.module.css`, `app/chleby`, `app/bulki-i-rogale`, `app/inne-wypieki`, `app/o-nas`, `app/sklepy`, `app/kontakt`, `app/dokumenty`, `app/design-system` → pod `app/(site)/`
- Modify: `app/layout.tsx`, wszystkie przeniesione `page.tsx`

**Interfaces:**
- Consumes: wszystkie funkcje z Task 4, komponenty z Task 5.
- Produces: grupa tras `(site)` z `Footer`; root layout bez `Footer` (Studio nie dostaje stopki).

- [ ] **Step 1: Grupa tras `(site)`**

```bash
cd /Users/ninectrl/WebstormProjects/piekarnia_v2/app
mkdir "(site)"
git mv page.tsx page.module.css chleby bulki-i-rogale inne-wypieki o-nas sklepy kontakt dokumenty design-system "(site)/"
```

Ścieżki importów w przeniesionych plikach: `../components/...` → `../../components/...` (dla `(site)/page.tsx`), `../../components/...` → `../../../components/...` (dla podkatalogów). To samo dla `lib`.

`app/(site)/layout.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Footer } from '../../components/layout/Footer';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
```

`app/layout.tsx`: usunąć import i render `<Footer />`; reszta bez zmian.

- [ ] **Step 2: `app/(site)/page.tsx`**

Zmienić nagłówek na `export default async function HomePage()` i na początku:

```tsx
const [settings, categories, testimonials] = await Promise.all([getSiteSettings(), getCategories(), getTestimonials()]);
```

Import: `import { getCategories, getSiteSettings, getTestimonials } from '../../lib/data';`. Podmiany w JSX:
- `<Header variant="onHero" />` → `<Header variant="onHero" phone={settings.phone} phoneHref={settings.phoneHref} />`
- `contact.catalogPdf` → `settings.catalogPdf`, `contact.instagram` → `settings.instagram`
- `<InstagramGrid />` → `<InstagramGrid images={settings.gallery} />`
- Hero `image="/photos/hero-chleb.jpg"` → `image={categories[0]?.cover ?? ''}` (zdjęcie kategorii Chleby to obecne hero)
- Sekcja „O nas”: dwa `<img src="/photos/...">` → `settings.gallery[0]`, `settings.gallery[1]` przez `<Image loader=...>` z `sanityImageLoader`, `width={600} height={340}`; gdy brak, nie renderować obrazka.

- [ ] **Step 3: Strony kategorii (`chleby`, `bulki-i-rogale`, `inne-wypieki`)**

Wzór dla `chleby/page.tsx`:

```tsx
import { Header } from '../../../components/layout/Header';
import { Section } from '../../../components/layout/Section';
import { PageHeader } from '../../../components/sections/PageHeader';
import { ProductGrid } from '../../../components/sections/ProductGrid';
import { CtaBand } from '../../../components/sections/CtaBand';
import { getCategoryBySlug, getFiltersFor, getProductsByCategory, getSiteSettings } from '../../../lib/data';

export const metadata = { /* bez zmian */ };

export default async function ChlebyPage() {
  const [settings, products, filters, category] = await Promise.all([
    getSiteSettings(),
    getProductsByCategory('chleby'),
    getFiltersFor('chleby'),
    getCategoryBySlug('chleby'),
  ]);
  return (
    <main>
      <Header phone={settings.phone} phoneHref={settings.phoneHref} />
      <PageHeader eyebrow={`Wypieki · ${products.length} rodzajów`} title="Chleby" lead="..." />
      <Section flush>
        <ProductGrid products={products} filters={filters} backdrop={category?.cover} />
      </Section>
      <div style={{ height: 'var(--section-y)' }} />
      <CtaBand title="Pełna oferta w katalogu" text="..." action={{ href: settings.catalogPdf, label: 'Pobierz katalog PDF' }} />
    </main>
  );
}
```

`bulki-i-rogale`: bez `filters`, z `highlightId="product-bulka-alpejska"` (id po seedzie to `product-<stare id>`), `backdrop={category?.cover}`, akcja CTA `{ href: settings.phoneHref, label: settings.phone }`.
`inne-wypieki`: bez `filters` i `backdrop`; CTA `{ href: settings.phoneHref, label: 'Zadzwoń: ' + settings.phone }`.

- [ ] **Step 4: `o-nas/page.tsx`**

`async`, pobiera `settings`; `<Header phone... />`; galeria: `settings.gallery[2]`, `settings.gallery[3]` przez `<Image loader>` `width={800} height={420}`; sekcja składników: `settings.gallery[4]`. Placeholder „zdjęcie rodziny — do dosłania” zostaje.

- [ ] **Step 5: `sklepy/page.tsx`, `kontakt/page.tsx`, `dokumenty/page.tsx`**

- `sklepy`: `const [settings, stores] = await Promise.all([getSiteSettings(), getStores()]);` — `stores.map(...)` bez zmian, CTA używa `settings.phoneHref`.
- `kontakt`: `const contact = await getSiteSettings();` — JSX bez zmian (te same nazwy pól); dopisek „adres e-mail i NIP — do uzupełnienia” renderować tylko gdy `!contact.email`.
- `dokumenty`: `const contact = await getSiteSettings();`, tablica `documents` budowana wewnątrz funkcji z `contact.legal.*`.

- [ ] **Step 6: `design-system/page.tsx`**

`async`; `const [settings, categories, products, stores, testimonials] = await Promise.all([...])`; `sampleProduct = products.find((p) => p.id === 'product-chleb-zytni-firmowy') ?? products[0]`; `contact.*` → `settings.*`; `stores[0]`, `categories[0]`, `testimonials[0]` z pobranych danych. Backdrop w demo ProductCard: `categories[0]?.cover`.

- [ ] **Step 7: Weryfikacja typów**

```bash
npx tsc --noEmit
```
Expected: 0 błędów. `data/products.json` i `public/photos` nie są już importowane nigdzie (sprawdzić: `grep -rn "products.json\|/photos/" app components lib` → brak wyników poza `scripts/`).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: pages read content from Sanity; site route group with footer

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Build jeszcze nie przejdzie (pusta baza), to celowe. Task 7 zasila dane.

---

### Task 7: Skrypt migracji danych do Sanity

**Files:**
- Create: `scripts/seed-sanity.ts`

**Interfaces:**
- Consumes: kształt `data/products.json`, schematy z Task 2, `SANITY_API_WRITE_TOKEN`.
- Produces: dokumenty `category-<slug>`, `product-<id>`, `store-<id>`, `testimonial-<n>`, `history-<n>`, `siteSettings` w datasetcie `production`.

- [ ] **Step 1: Token write (krok właściciela)**

sanity.io → Manage → projekt → API → Tokens → Add API token, nazwa `seed`, uprawnienia `Editor`. Wpisać do `.env.local` jako `SANITY_API_WRITE_TOKEN`.

- [ ] **Step 2: `scripts/seed-sanity.ts`**

```ts
/**
 * One-off migration: data/products.json + remote images → Sanity dataset.
 * Idempotent (createOrReplace). Run: npm run seed:sanity
 */
import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) throw new Error('Ustaw NEXT_PUBLIC_SANITY_PROJECT_ID i SANITY_API_WRITE_TOKEN w .env.local');

const client = createClient({ projectId, dataset, token, apiVersion: '2026-09-01', useCdn: false });

type Raw = {
  categories: { slug: string; name: string; lead: string; cover: string }[];
  products: {
    id: string; category: string; name: string; weight: string; tags: string[]; description: string;
    image: string; photo?: string; nutrition: null | { kcal: number; fat: string; carbs: string; fiber: string; protein: string; salt: string };
  }[];
  stores: { id: string; city: string; street: string; label: string; hours: string; image: string; maps: string }[];
  contact: { phone: string; phoneHref: string; email: string; address: string; facebook: string; instagram: string; catalogPdf: string; legal: { nota: string; privacy: string; cookies: string } };
  history: { year: string; title: string; text: string }[];
  testimonials: { text: string; author: string }[];
  gallery: string[];
};

const raw: Raw = JSON.parse(readFileSync(resolve(process.cwd(), 'data/products.json'), 'utf8'));

const assetCache = new Map<string, string>();

async function uploadImage(url: string): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string } } | undefined> {
  if (!url) return undefined;
  if (!assetCache.has(url)) {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ! pominięto obraz ${url} (${res.status})`);
      return undefined;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = url.split('/').pop() ?? 'image';
    const asset = await client.assets.upload('image', buffer, { filename });
    assetCache.set(url, asset._id);
    console.log(`  ↑ ${filename}`);
  }
  return { _type: 'image', asset: { _type: 'reference', _ref: assetCache.get(url)! } };
}

async function run() {
  console.log('Kategorie');
  for (const [i, c] of raw.categories.entries()) {
    await client.createOrReplace({
      _id: `category-${c.slug}`,
      _type: 'category',
      name: c.name,
      slug: { _type: 'slug', current: c.slug },
      lead: c.lead,
      cover: await uploadImage(c.cover),
      sortOrder: i,
    });
  }

  console.log('Produkty');
  for (const [i, p] of raw.products.entries()) {
    await client.createOrReplace({
      _id: `product-${p.id}`,
      _type: 'product',
      name: p.name,
      category: { _type: 'reference', _ref: `category-${p.category}` },
      weight: p.weight,
      description: p.description,
      tags: p.tags,
      visible: true,
      sortOrder: (i + 1) * 10,
      cutout: await uploadImage(p.image),
      photo: await uploadImage(p.photo ?? ''),
      nutrition: p.nutrition ?? undefined,
    });
    console.log(`  ✓ ${p.name}`);
  }

  console.log('Sklepy');
  for (const [i, s] of raw.stores.entries()) {
    await client.createOrReplace({
      _id: `store-${s.id}`,
      _type: 'store',
      city: s.city,
      street: s.street,
      label: s.label,
      hours: s.hours,
      image: await uploadImage(s.image),
      mapsUrl: s.maps,
      sortOrder: (i + 1) * 10,
    });
  }

  console.log('Opinie i historia');
  for (const [i, t] of raw.testimonials.entries()) {
    await client.createOrReplace({ _id: `testimonial-${i + 1}`, _type: 'testimonial', ...t, sortOrder: (i + 1) * 10 });
  }
  for (const [i, h] of raw.history.entries()) {
    await client.createOrReplace({ _id: `history-${i + 1}`, _type: 'historyEntry', ...h, sortOrder: (i + 1) * 10 });
  }

  console.log('Ustawienia');
  const gallery = [];
  for (const url of raw.gallery) {
    const img = await uploadImage(url);
    if (img) gallery.push({ ...img, _key: assetCache.get(url)!.slice(-12) });
  }
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    phone: raw.contact.phone,
    phoneHref: raw.contact.phoneHref,
    email: raw.contact.email,
    address: raw.contact.address,
    facebook: raw.contact.facebook,
    instagram: raw.contact.instagram,
    catalogPdf: raw.contact.catalogPdf,
    legal: raw.contact.legal,
    gallery,
  });

  console.log('Gotowe.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Zależność `@sanity/client` jest instalowana razem z `next-sanity`; jeśli `import` nie rozwiązuje się, `npm install @sanity/client`.

- [ ] **Step 3: Uruchomić migrację**

```bash
npm run seed:sanity
```
Expected: log z „✓” dla 45 produktów, 4 sklepów, uploady obrazów; brak wyjątków. Obrazy, których serwer WordPressa nie odda (404), są pominięte z ostrzeżeniem; zanotować listę do ręcznego uzupełnienia w Studio.

- [ ] **Step 4: Sprawdzić w Studio**

`http://localhost:3000/studio` → Produkty → Chleby: 26 pozycji z miniaturami; Ustawienia strony wypełnione; galeria 11 zdjęć.

- [ ] **Step 5: Build i podgląd**

Zatrzymać `next dev` (Ctrl-C w zakładce terminala), potem:

```bash
npx next build
```
Expected: exit 0, wszystkie trasy prerenderowane; `/studio` jako statyczna.

Uruchomić `npm run dev` ponownie; sprawdzić `/`, `/chleby` (wyszukiwarka i filtry działają), `/sklepy`, `/design-system`.

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-sanity.ts
git commit -m "feat(sanity): one-off seed script migrating products.json and images

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Webhook odświeżania (TDD)

**Files:**
- Create: `app/api/revalidate/route.ts`, `app/api/revalidate/route.test.ts`

**Interfaces:**
- Consumes: `SANITY_TAG` (Task 1), `SANITY_WEBHOOK_SECRET`.
- Produces: `POST /api/revalidate` → 200 `{ revalidated: true, tag: 'sanity' }`; 401 przy złym podpisie; 500 gdy brak sekretu.

- [ ] **Step 1: Test — `app/api/revalidate/route.test.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const revalidateTag = vi.fn();
vi.mock('next/cache', () => ({ revalidateTag }));

const parseBody = vi.fn();
vi.mock('next-sanity/webhook', () => ({ parseBody }));

import { POST } from './route';

const request = () => new Request('http://localhost/api/revalidate', { method: 'POST', body: '{}' });

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SANITY_WEBHOOK_SECRET = 'sekret';
  });

  it('returns 500 when the secret is not configured', async () => {
    delete process.env.SANITY_WEBHOOK_SECRET;
    const res = await POST(request());
    expect(res.status).toBe(500);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('returns 401 on invalid signature and does not revalidate', async () => {
    parseBody.mockResolvedValue({ isValidSignature: false, body: null });
    const res = await POST(request());
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('revalidates the sanity tag on a valid signature', async () => {
    parseBody.mockResolvedValue({ isValidSignature: true, body: { _type: 'product' } });
    const res = await POST(request());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ revalidated: true, tag: 'sanity' });
    expect(revalidateTag).toHaveBeenCalledWith('sanity');
    expect(parseBody).toHaveBeenCalledWith(expect.anything(), 'sekret', true);
  });
});
```

- [ ] **Step 2: Uruchomić, oczekiwać porażki**

```bash
npx vitest run app/api/revalidate
```
Expected: FAIL — brak modułu `./route`.

- [ ] **Step 3: Implementacja `app/api/revalidate/route.ts`**

```ts
import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';
import { SANITY_TAG } from '../../../sanity/client';

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ message: 'Brak SANITY_WEBHOOK_SECRET' }, { status: 500 });
  }

  const { isValidSignature } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) {
    return Response.json({ message: 'Nieprawidłowy podpis' }, { status: 401 });
  }

  revalidateTag(SANITY_TAG);
  return Response.json({ revalidated: true, tag: SANITY_TAG });
}
```

Jeśli `parseBody` w zainstalowanej wersji wymaga `NextRequest`, zmienić typ parametru na `NextRequest` z `next/server`; test tworzy zwykły `Request`, więc w teście owinąć: `new NextRequest(request())`.

Import `SANITY_TAG` z `sanity/client.ts` uruchamia `env.ts`, który rzuci błąd bez zmiennych. W teście dodać na górze:
`vi.mock('../../../sanity/client', () => ({ SANITY_TAG: 'sanity' }));`

- [ ] **Step 4: Uruchomić testy**

```bash
npx vitest run
```
Expected: wszystkie PASS (mappery + webhook).

- [ ] **Step 5: Webhook w Sanity (krok właściciela)**

sanity.io → Manage → API → Webhooks → Create:
- URL: `https://<domena-vercel>/api/revalidate`
- Dataset: `production`
- Trigger on: Create, Update, Delete
- Filter: `_type in ["product","category","store","testimonial","historyEntry","siteSettings"]`
- Projection: `{_type}`
- HTTP method: POST, API version: `v2021-03-25` (domyślna)
- Secret: wartość `SANITY_WEBHOOK_SECRET`

Lokalnie można sprawdzić przez `curl -X POST http://localhost:3000/api/revalidate` → 401 (brak podpisu), co potwierdza, że trasa działa.

- [ ] **Step 6: Commit**

```bash
git add app/api/revalidate
git commit -m "feat(sanity): webhook route revalidating the sanity cache tag

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Sprzątanie, dokumentacja, wdrożenie

**Files:**
- Delete: `data/products.json`, `public/photos/`
- Create: `docs/ADMIN.md`
- Modify: `README.md`, `.env.example` (bez zmian, tylko sprawdzić), `scripts/seed-sanity.ts` (nagłówek komentarza)

**Interfaces:**
- Produces: repo bez lokalnych danych treści; dokumentacja dla menadżerów i deploy.

- [ ] **Step 1: Usunąć dane lokalne**

Skrypt seed czyta `data/products.json`. Po migracji na produkcję plik jest zbędny. Zachować go w historii gita (jest w Task 0), usunąć z drzewa:

```bash
git rm -r data public/photos
```

W `scripts/seed-sanity.ts` zmienić komentarz nagłówkowy na: „Historyczny skrypt migracji; `data/products.json` jest w historii gita (commit z Task 0). Do ponownego użycia przywrócić plik: `git show <sha>:data/products.json > data/products.json`."

```bash
npx tsc --noEmit
```
Expected: 0 błędów (skrypt czyta plik w runtime, nie importuje go).

- [ ] **Step 2: `docs/ADMIN.md`**

```markdown
# Panel menadżera — instrukcja

Panel: **https://<domena>/studio** (logowanie kontem Sanity, zaproszenie przychodzi e-mailem).

## Dodawanie produktu

1. Treść → Produkty → wybierz kategorię (Chleby / Bułki i rogale / Inne wypieki).
2. Kliknij „+" u góry listy. Kategoria jest już ustawiona.
3. Wypełnij: Nazwa, Waga, Opis, Tagi. W zakładce „Zdjęcia" wgraj wycinankę (PNG bez tła) albo fotografię.
   Jeśli dodasz obie, na stronie pokaże się fotografia.
4. Zakładka „Wartości odżywcze": kcal jako liczba, resztę tekstem (np. „1,3 g").
5. Kliknij **Publikuj** (prawy dolny róg). Zmiana pojawia się na stronie w ciągu kilku sekund.

## Ukrywanie produktu

Otwórz produkt → wyłącz „Widoczny na stronie" → Publikuj. Produkt zostaje w panelu, znika ze strony.

## Kolejność

Pole „Kolejność" (mniejsza liczba = wyżej). Lista w panelu jest sortowana tak samo.

## Sklepy

Treść → Sklepy → edytuj godziny, adres, zdjęcie, link do Google Maps → Publikuj.

## Ustawienia strony

Telefon, e-mail, adres, linki social, katalog PDF, dokumenty prawne, galeria zdjęć (strona główna i „O nas").

## Dobre praktyki

- Zdjęcia: JPG do 2 MB, min. 1200 px szerokości. Wycinanki: PNG z przezroczystym tłem.
- Nie kasuj kategorii ani ustawień strony (panel to blokuje).
- Wersja robocza nie jest widoczna na stronie do czasu kliknięcia „Publikuj".
- Historia zmian: ikona zegara w nagłówku dokumentu; można cofnąć do wcześniejszej wersji.
```

- [ ] **Step 3: `README.md`**

Sekcja „Uruchomienie": dodać kroki `cp .env.example .env.local`, uzupełnienie zmiennych, `npm run dev`, Studio pod `/studio`. Sekcja „Struktura": dopisać `sanity/`, `app/studio`, `app/api/revalidate`, `scripts/seed-sanity.ts`; usunąć `data/` i `public/photos`. Sekcja „Obrazy": zastąpić opisem CDN Sanity. Dodać sekcję „Wdrożenie na Vercel": import repo, zmienne `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_WEBHOOK_SECRET` (bez tokena write); po deployu dodać domenę Vercel do CORS origins w Sanity (Manage → API → CORS origins, z „Allow credentials") — inaczej Studio pod `/studio` nie zaloguje się. Link do `docs/ADMIN.md`. Sekcja „Do potwierdzenia przez klienta": usunąć punkty o mapie i Instagramie jako zależne od panelu, zostawić godziny, składy, e-mail/NIP, zdjęcia, treści prawne.

- [ ] **Step 4: Pełna weryfikacja**

Zatrzymać `next dev`, potem:

```bash
npx tsc --noEmit && npx vitest run && npx next build
```
Expected: wszystkie trzy exit 0.

Scenariusz akceptacyjny (dev server, przeglądarka):
1. `/studio` → Produkty → Chleby → „+” → nazwa „Test chleb”, opis, fotografia z dysku → Publikuj.
2. `/chleby` → produkt widoczny na końcu listy, wyszukiwarka znajduje „test”.
3. W Studio wyłączyć „Widoczny” → Publikuj → `/chleby` po odświeżeniu bez produktu.
4. Sklepy → zmienić godziny pierwszego sklepu → Publikuj → `/sklepy` i `/` pokazują nowe godziny.
5. Usunąć „Test chleb” w Studio.

Lokalnie webhook nie dociera; odświeżenie wymusza `next dev` (bez cache) albo `curl -X POST` z podpisem. Na produkcji sprawdzić po wdrożeniu punkty 1–4 ponownie.

- [ ] **Step 5: Commit i push**

```bash
git add -A
git commit -m "docs: admin guide, README for Sanity setup; drop local content files

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Push i deploy na Vercel wykonuje właściciel (repo `urban1991/piekarnia_v2`, gałąź `master`).
