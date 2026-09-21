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

const fetchOptions = { next: { tags: [SANITY_TAG] } };

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
