import { beforeEach, describe, expect, it, vi } from 'vitest';

const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));

vi.mock('../sanity/client', () => ({ client: { fetch }, SANITY_TAG: 'sanity' }));
vi.mock('../sanity/env', () => ({ env: { projectId: 'abc123', dataset: 'production', apiVersion: '2026-09-01' } }));
vi.mock('next-sanity', () => ({ defineQuery: (query: string) => query }));

import * as data from './data';

const product = (id: string, tags: string[]) => ({ _id: id, name: id, categorySlug: 'chleby', description: '', tags });

beforeEach(() => {
  fetch.mockReset();
  fetch.mockResolvedValue([]);
});

describe('data layer', () => {
  const getters: [string, () => Promise<unknown>][] = [
    ['getCategories', () => data.getCategories()],
    ['getProductsByCategory', () => data.getProductsByCategory('chleby')],
    ['getAllProducts', () => data.getAllProducts()],
    ['getStores', () => data.getStores()],
    ['getTestimonials', () => data.getTestimonials()],
    ['getHistory', () => data.getHistory()],
    ['getSiteSettings', () => data.getSiteSettings()],
    ['getAnnouncements', () => data.getAnnouncements()],
  ];

  it.each(getters)('%s tags its fetch so a Studio publish clears it, and never serves stale CDN data', async (_, get) => {
    await get();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][2]).toEqual({ next: { tags: ['sanity'] }, cacheMode: 'noStale' });
  });

  it('asks for one category by its slug', async () => {
    await data.getProductsByCategory('bulki-i-rogale');
    expect(fetch.mock.calls[0][1]).toEqual({ slug: 'bulki-i-rogale' });
  });

  it('builds the filter chips from the category products: "all" first, each tag once, in first-seen order', async () => {
    fetch.mockResolvedValue([
      product('zytni', ['Na zakwasie', 'Żytnie']),
      product('orkisz', ['Na zakwasie', 'Orkiszowe']),
      product('bez', []),
    ]);
    expect(await data.getFiltersFor('chleby')).toEqual(['Wszystkie', 'Na zakwasie', 'Żytnie', 'Orkiszowe']);
  });

  it('still renders when the settings document does not exist yet', async () => {
    fetch.mockResolvedValue(null);
    const settings = await data.getSiteSettings();
    expect(settings.phone).toBe('');
    expect(settings.heroImage).toBe('');
    expect(settings.gallery).toEqual([]);
  });

  it('finds a category by slug and returns undefined for an unknown one', async () => {
    fetch.mockResolvedValue([{ _id: 'category-chleby', name: 'Chleby', slug: 'chleby' }]);
    expect((await data.getCategoryBySlug('chleby'))?.name).toBe('Chleby');
    expect(await data.getCategoryBySlug('pizza')).toBeUndefined();
  });
});
