import raw from '../data/products.json';
import type { Category, HistoryEntry, Product, Store, Testimonial } from './types';

export const categories = raw.categories as Category[];
export const products = raw.products as Product[];
export const stores = raw.stores as Store[];
export const testimonials = raw.testimonials as Testimonial[];
export const history = raw.history as HistoryEntry[];
export const gallery = raw.gallery as string[];
export const contact = raw.contact;

export const productsByCategory = (slug: Category['slug']) =>
  products.filter((p) => p.category === slug);

export const categoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const filtersFor = (slug: Category['slug']) => {
  const tags = new Set<string>();
  productsByCategory(slug).forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return ['Wszystkie', ...Array.from(tags)];
};
