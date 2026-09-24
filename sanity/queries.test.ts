import { describe, expect, it, vi } from 'vitest';
import { evaluate, parse } from 'groq-js';

// defineQuery only tags the string for typegen; the real module pulls in the Next runtime
vi.mock('next-sanity', () => ({ defineQuery: (query: string) => query }));

import {
  allProductsQuery,
  announcementsQuery,
  productsByCategoryQuery,
  siteSettingsQuery,
  storesQuery,
} from './queries';

/** Runs a query the way the Content Lake would, against an in-memory dataset and a fixed "now". */
async function run<T>(query: string, dataset: object[], params: Record<string, unknown> = {}, now = '2026-09-24T12:00:00Z') {
  const tree = parse(query, { params });
  const value = await evaluate(tree, { dataset, params, timestamp: new Date(now) });
  return (await value.get()) as T;
}

describe('announcementsQuery', () => {
  const announcement = (id: string, fields: Record<string, unknown>) => ({
    _id: id,
    _type: 'announcement',
    text: id,
    active: true,
    sortOrder: 100,
    ...fields,
  });
  const ids = async (dataset: object[], now?: string) =>
    (await run<{ _id: string }[]>(announcementsQuery, dataset, {}, now)).map((a) => a._id);

  it('shows an announcement with no dates at all', async () => {
    expect(await ids([announcement('always', {})])).toEqual(['always']);
  });

  it('hides an announcement switched off in Studio, whatever its dates', async () => {
    expect(await ids([announcement('off', { active: false })])).toEqual([]);
  });

  it('waits for the start date', async () => {
    const promo = announcement('promo', { startDate: '2026-09-25T06:00:00Z' });
    expect(await ids([promo], '2026-09-25T05:59:59Z')).toEqual([]);
    expect(await ids([promo], '2026-09-25T06:00:00Z')).toEqual(['promo']);
  });

  it('disappears after the end date', async () => {
    const promo = announcement('promo', { endDate: '2026-09-30T22:00:00Z' });
    expect(await ids([promo], '2026-09-30T22:00:00Z')).toEqual(['promo']);
    expect(await ids([promo], '2026-09-30T22:00:01Z')).toEqual([]);
  });

  it('shows a dated announcement only inside its window', async () => {
    const promo = announcement('promo', { startDate: '2026-10-01T00:00:00Z', endDate: '2026-10-07T00:00:00Z' });
    expect(await ids([promo], '2026-09-30T12:00:00Z')).toEqual([]);
    expect(await ids([promo], '2026-10-03T12:00:00Z')).toEqual(['promo']);
    expect(await ids([promo], '2026-10-08T12:00:00Z')).toEqual([]);
  });

  it('orders by sortOrder and ignores other document types', async () => {
    const dataset = [
      announcement('second', { sortOrder: 20 }),
      announcement('first', { sortOrder: 10 }),
      { _id: 'product-x', _type: 'product', active: true, sortOrder: 1 },
    ];
    expect(await ids(dataset)).toEqual(['first', 'second']);
  });

  it('projects only what the ticker renders', async () => {
    const [a] = await run<Record<string, unknown>[]>(announcementsQuery, [
      announcement('a', { text: 'Jagodzianki', link: '/inne-wypieki', startDate: '2026-01-01T00:00:00Z' }),
    ]);
    expect(a).toEqual({ _id: 'a', text: 'Jagodzianki', link: '/inne-wypieki' });
  });
});

describe('product queries', () => {
  const category = (slug: string) => ({ _id: `category-${slug}`, _type: 'category', slug: { current: slug } });
  const product = (id: string, slug: string, fields: Record<string, unknown> = {}) => ({
    _id: id,
    _type: 'product',
    name: id,
    category: { _type: 'reference', _ref: `category-${slug}` },
    visible: true,
    ...fields,
  });
  const dataset = [
    category('chleby'),
    category('bulki-i-rogale'),
    product('zytni', 'chleby', { sortOrder: 2 }),
    product('orkiszowy', 'chleby', { sortOrder: 1 }),
    product('ukryty', 'chleby', { visible: false }),
    product('kajzerka', 'bulki-i-rogale'),
  ];

  it('lists only visible products of the requested category, in sortOrder', async () => {
    const docs = await run<{ _id: string }[]>(productsByCategoryQuery, dataset, { slug: 'chleby' });
    expect(docs.map((d) => d._id)).toEqual(['orkiszowy', 'zytni']);
  });

  it('resolves the category reference into categorySlug for the mapper', async () => {
    const [doc] = await run<{ categorySlug: string }[]>(productsByCategoryQuery, dataset, { slug: 'bulki-i-rogale' });
    expect(doc.categorySlug).toBe('bulki-i-rogale');
  });

  it('hides products switched off in Studio from the full list too', async () => {
    const docs = await run<{ _id: string }[]>(allProductsQuery, dataset);
    expect(docs.map((d) => d._id)).not.toContain('ukryty');
    expect(docs).toHaveLength(3);
  });

  it('breaks sortOrder ties by name', async () => {
    const tied = [category('chleby'), product('b', 'chleby', { sortOrder: 1 }), product('a', 'chleby', { sortOrder: 1 })];
    const docs = await run<{ _id: string }[]>(allProductsQuery, tied);
    expect(docs.map((d) => d._id)).toEqual(['a', 'b']);
  });
});

describe('storesQuery', () => {
  it('keeps the featured flag the homepage uses to promote a shop', async () => {
    const [store] = await run<Record<string, unknown>[]>(storesQuery, [
      { _id: 'store-1', _type: 'store', city: 'Świdnica', street: 'ul. Składowa 3', hours: 'Pn–Pt 6–18', featured: true },
    ]);
    expect(store.featured).toBe(true);
  });

  it('returns the map location of each shop', async () => {
    const location = { _type: 'geopoint', lat: 50.833898, lng: 16.506576 };
    const [store] = await run<Record<string, unknown>[]>(storesQuery, [
      { _id: 'store-1', _type: 'store', city: 'Świdnica', street: 'ul. Składowa 3', hours: '', location },
    ]);
    expect(store.location).toEqual(location);
  });

  it('returns the opening date and offer the new-shop banner needs', async () => {
    const [store] = await run<Record<string, unknown>[]>(storesQuery, [
      { _id: 'store-2', _type: 'store', city: 'Świdnica', street: 'ul. Głowackiego', hours: '', openingDate: '2026-10-15', openingOffer: 'Gratis' },
    ]);
    expect(store).toMatchObject({ openingDate: '2026-10-15', openingOffer: 'Gratis' });
  });
});

describe('siteSettingsQuery', () => {
  it('reads the singleton only, never a stray draft or copy', async () => {
    const settings = await run<{ phone: string } | null>(siteSettingsQuery, [
      { _id: 'drafts.siteSettings', _type: 'siteSettings', phone: 'szkic' },
      { _id: 'siteSettings-copy', _type: 'siteSettings', phone: 'kopia' },
      { _id: 'siteSettings', _type: 'siteSettings', phone: '503 083 208' },
    ]);
    expect(settings?.phone).toBe('503 083 208');
  });

  it('returns the hero image with its hotspot, which the hero needs for object-position', async () => {
    const hotspot = { x: 0.6, y: 0.4, width: 0.5, height: 0.6 };
    const settings = await run<{ heroImage: { hotspot: unknown } } | null>(siteSettingsQuery, [
      { _id: 'siteSettings', _type: 'siteSettings', heroImage: { _type: 'image', asset: { _ref: 'image-a-10x10-jpg' }, hotspot } },
    ]);
    expect(settings?.heroImage.hotspot).toEqual(hotspot);
  });
});
