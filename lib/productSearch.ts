import type { Product } from './types';

/** The filter chip that means "no tag filter". */
export const ALL_TAGS = 'Wszystkie';

/**
 * Lower-cases and strips Polish diacritics, so "zytni" finds "Żytni" and "bulka" finds "Bułka".
 * NFD splits most accented letters into base + combining mark; ł has no decomposition, hence the extra step.
 */
export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l');
}

/** Products matching the active tag chip and the search box (name, description and tags). */
export function filterProducts(products: Product[], tag: string, query: string): Product[] {
  const byTag = tag === ALL_TAGS ? products : products.filter((p) => p.tags.includes(tag));
  const q = normalizeSearch(query.trim());
  if (!q) return byTag;
  return byTag.filter((p) => normalizeSearch([p.name, p.description, ...p.tags].join(' ')).includes(q));
}
