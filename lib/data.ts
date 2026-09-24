import { cache } from 'react';
import { client, SANITY_TAG } from '../sanity/client';
import {
  allProductsQuery,
  announcementsQuery,
  categoriesQuery,
  historyQuery,
  productsByCategoryQuery,
  siteSettingsQuery,
  storesQuery,
  testimonialsQuery,
} from '../sanity/queries';
import { ALL_TAGS } from './productSearch';
import { mapAnnouncement, mapCategory, mapProduct, mapSettings, mapStore } from './mappers';
import type { AnnouncementDoc, CategoryDoc, ProductDoc, SettingsDoc, StoreDoc } from './mappers';
import type { Announcement, Category, CategorySlug, HistoryEntry, Product, SiteSettings, Store, Testimonial } from './types';

const fetchOptions = { next: { tags: [SANITY_TAG] }, cacheMode: 'noStale' as const };

export const getCategories = cache(async (): Promise<Category[]> => {
  const docs = await client.fetch<CategoryDoc[]>(categoriesQuery, {}, fetchOptions);
  return docs.map(mapCategory);
});

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export const getProductsByCategory = cache(async (slug: CategorySlug): Promise<Product[]> => {
  const docs = await client.fetch<ProductDoc[]>(productsByCategoryQuery, { slug }, fetchOptions);
  return docs.map(mapProduct);
});

export async function getAllProducts(): Promise<Product[]> {
  const docs = await client.fetch<ProductDoc[]>(allProductsQuery, {}, fetchOptions);
  return docs.map(mapProduct);
}

export async function getFiltersFor(slug: CategorySlug): Promise<string[]> {
  const tags = new Set<string>();
  (await getProductsByCategory(slug)).forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return [ALL_TAGS, ...Array.from(tags)];
}

export const getStores = cache(async (): Promise<Store[]> => {
  const docs = await client.fetch<StoreDoc[]>(storesQuery, {}, fetchOptions);
  return docs.map(mapStore);
});

export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch<Testimonial[]>(testimonialsQuery, {}, fetchOptions);
}

export async function getHistory(): Promise<HistoryEntry[]> {
  return client.fetch<HistoryEntry[]>(historyQuery, {}, fetchOptions);
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const doc = await client.fetch<SettingsDoc | null>(siteSettingsQuery, {}, fetchOptions);
  return mapSettings(doc);
});

export const getAnnouncements = cache(async (): Promise<Announcement[]> => {
  const docs = await client.fetch<AnnouncementDoc[]>(announcementsQuery, {}, fetchOptions);
  return docs.map(mapAnnouncement);
});
