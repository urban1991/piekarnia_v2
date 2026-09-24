/**
 * One-off migration: data/products.json + remote images → Sanity dataset. Already run on
 * production; kept for reference and for seeding a fresh, empty dataset.
 *
 * NOT safe to re-run on a live dataset: createOrReplace replaces whole documents, which would
 * wipe everything edited in Studio since (store locations, opening dates, hero crop, product
 * edits…). The script therefore refuses to touch a dataset that already has content unless
 * called with --force. Run: npx tsx --env-file=.env.local scripts/seed-sanity.ts [--force]
 *
 * Order matters so references resolve: categories → products → stores →
 * testimonials → history → siteSettings.
 *
 * Image fetches are fault-tolerant: a failing/timing-out/404ing WordPress
 * image is skipped (with a warning) rather than aborting the whole run; every
 * skipped URL is collected and reported in a summary block at the end.
 */
import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  throw new Error('Ustaw NEXT_PUBLIC_SANITY_PROJECT_ID i SANITY_API_WRITE_TOKEN w .env.local');
}

const client = createClient({ projectId, dataset, token, apiVersion: '2026-09-01', useCdn: false });

type RawNutrition = {
  kcal: number;
  fat: string;
  carbs: string;
  fiber: string;
  protein: string;
  salt: string;
};

type RawProduct = {
  id: string;
  category: string;
  name: string;
  weight: string;
  tags: string[];
  description: string;
  image: string;
  photo?: string;
  nutrition: RawNutrition | null;
};

type RawStore = {
  id: string;
  city: string;
  street: string;
  label: string;
  hours: string;
  image: string;
  maps: string;
};

type Raw = {
  categories: { slug: string; name: string; lead: string; intro: string; cover: string }[];
  products: RawProduct[];
  stores: RawStore[];
  contact: {
    phone: string;
    email: string;
    address: string;
    facebook: string;
    instagram: string;
    catalogPdf: string;
  };
  history: { year: string; title: string; text: string }[];
  testimonials: { text: string; author: string; rating?: number; source?: string }[];
  gallery: string[];
};

const raw: Raw = JSON.parse(readFileSync(resolve(process.cwd(), 'data/products.json'), 'utf8'));

const FEATURED_STORE_ID = 'swidnica-skladowa';

type SanityImage = { _type: 'image'; asset: { _type: 'reference'; _ref: string } };

const assetCache = new Map<string, string>(); // url -> asset _id
const skipped: { url: string; reason: string }[] = [];
const tally: Record<string, number> = {};

function bump(type: string) {
  tally[type] = (tally[type] ?? 0) + 1;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Upload a remote image once (cached by URL), tolerating network failures, timeouts and 404s. */
async function uploadImage(url: string | undefined): Promise<SanityImage | undefined> {
  if (!url) return undefined;
  const cached = assetCache.get(url);
  if (cached) return { _type: 'image', asset: { _type: 'reference', _ref: cached } };

  const maxAttempts = 3; // 1 try + up to 2 retries
  let lastReason = 'nieznany błąd';
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) {
        lastReason = `HTTP ${res.status}`;
        if (res.status === 404) break; // won't succeed on retry
      } else {
        const buffer = Buffer.from(await res.arrayBuffer());
        const filename = url.split('/').pop() ?? 'image';
        const asset = await client.assets.upload('image', buffer, { filename });
        assetCache.set(url, asset._id);
        console.log(`  ↑ ${filename}`);
        return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
      }
    } catch (err) {
      lastReason = err instanceof Error ? err.message : String(err);
    }
    if (attempt < maxAttempts) await sleep(500 * attempt);
  }
  console.warn(`  ! pominięto ${url} (${lastReason})`);
  skipped.push({ url, reason: lastReason });
  return undefined;
}

/** data/products.json routes cut-out (no-background) vs real-photo images by URL extension. */
function classify(url: string | undefined): 'cutout' | 'photo' | undefined {
  if (!url) return undefined;
  const clean = url.split('?')[0]!.toLowerCase();
  if (clean.endsWith('.png')) return 'cutout';
  if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) return 'photo';
  return undefined;
}

async function uploadProductImages(p: RawProduct): Promise<{ cutout?: SanityImage; photo?: SanityImage }> {
  const candidates = [p.image, p.photo].filter((u): u is string => Boolean(u));
  let cutoutUrl: string | undefined;
  let photoUrl: string | undefined;
  for (const url of candidates) {
    const kind = classify(url);
    if (kind === 'cutout' && !cutoutUrl) cutoutUrl = url;
    if (kind === 'photo' && !photoUrl) photoUrl = url;
  }
  const [cutout, photo] = await Promise.all([uploadImage(cutoutUrl), uploadImage(photoUrl)]);
  return { cutout, photo };
}

type ImageArrayItem = SanityImage & { _key: string };

async function toImageArray(urls: string[]): Promise<ImageArrayItem[]> {
  const items: ImageArrayItem[] = [];
  for (const url of urls) {
    const img = await uploadImage(url);
    // unique per item: the ref's tail is only "-WxH-ext", identical for same-sized photos
    if (img) items.push({ ...img, _key: `${items.length}-${img.asset._ref.split('-')[1].slice(0, 8)}` });
  }
  return items;
}

/** Stops a second run from overwriting Studio edits; see the header. */
async function refuseIfDatasetHasContent() {
  if (process.argv.includes('--force')) return;
  const existing = await client.fetch<number>('count(*[_type in ["category", "product", "store", "siteSettings"]])');
  if (existing > 0) {
    console.error(
      `Zbiór danych ma już ${existing} dokumentów. Ten skrypt nadpisałby zmiany zrobione w Studio.\n` +
        'Jeśli naprawdę chcesz zastąpić całą treść danymi z data/products.json, uruchom go z --force.',
    );
    process.exit(1);
  }
}

async function run() {
  await refuseIfDatasetHasContent();
  console.log('Kategorie');
  for (const [i, c] of raw.categories.entries()) {
    await client.createOrReplace({
      _id: `category-${c.slug}`,
      _type: 'category',
      name: c.name,
      slug: { _type: 'slug', current: c.slug },
      lead: c.lead,
      intro: c.intro,
      cover: await uploadImage(c.cover),
      sortOrder: i,
    });
    bump('category');
    console.log(`  ✓ ${c.name}`);
  }

  console.log('Produkty');
  for (const [i, p] of raw.products.entries()) {
    const { cutout, photo } = await uploadProductImages(p);
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
      cutout,
      photo,
      nutrition: p.nutrition ?? undefined,
    });
    bump('product');
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
      featured: s.id === FEATURED_STORE_ID,
      hours: s.hours,
      image: await uploadImage(s.image),
      mapsUrl: s.maps,
      sortOrder: (i + 1) * 10,
    });
    bump('store');
    console.log(`  ✓ ${s.city}, ${s.street}`);
  }

  console.log('Opinie');
  for (const [i, t] of raw.testimonials.entries()) {
    await client.createOrReplace({
      _id: `testimonial-${i + 1}`,
      _type: 'testimonial',
      text: t.text,
      author: t.author,
      // only what the source really says: a made-up rating or source would be a fake review
      ...(t.rating ? { rating: t.rating } : {}),
      ...(t.source ? { source: t.source } : {}),
      sortOrder: (i + 1) * 10,
    });
    bump('testimonial');
  }
  console.log(`  ✓ ${raw.testimonials.length} opinii`);

  console.log('Historia');
  for (const [i, h] of raw.history.entries()) {
    await client.createOrReplace({
      _id: `history-${i + 1}`,
      _type: 'historyEntry',
      year: h.year,
      title: h.title,
      text: h.text,
      sortOrder: (i + 1) * 10,
    });
    bump('historyEntry');
  }
  console.log(`  ✓ ${raw.history.length} wpisów`);

  console.log('Ustawienia strony');
  const heroImage = await uploadImage(raw.categories[0]?.cover);
  const homeGallery = await toImageArray(raw.gallery.slice(0, 2));
  const aboutGallery = await toImageArray(raw.gallery.slice(2, 5));
  const gallery = await toImageArray(raw.gallery);

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    phone: raw.contact.phone,
    email: raw.contact.email,
    address: raw.contact.address,
    facebook: raw.contact.facebook,
    instagram: raw.contact.instagram,
    catalogPdf: raw.contact.catalogPdf,
    heroImage,
    homeGallery,
    aboutGallery,
    gallery,
  });
  bump('siteSettings');
  console.log('  ✓ siteSettings');

  console.log('\nPodsumowanie utworzonych dokumentów:');
  for (const [type, count] of Object.entries(tally)) {
    console.log(`  ${type}: ${count}`);
  }

  if (skipped.length > 0) {
    console.log('\nPOMINIĘTE ZDJĘCIA (do uzupełnienia w Studio):');
    for (const { url, reason } of skipped) {
      console.log(`  - ${url} (${reason})`);
    }
  }

  console.log('\nGotowe.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
