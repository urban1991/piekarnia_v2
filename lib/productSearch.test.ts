import { describe, expect, it } from 'vitest';
import { ALL_TAGS, filterProducts, normalizeSearch } from './productSearch';
import type { Product } from './types';

const product = (id: string, fields: Partial<Product> = {}): Product => ({
  id,
  category: 'chleby',
  name: id,
  weight: '500 g',
  tags: [],
  description: '',
  image: '',
  nutrition: null,
  ...fields,
});

const ids = (products: Product[]) => products.map((p) => p.id);

const products = [
  product('zytni', { name: 'Chleb żytni', tags: ['Żytnie', 'Na zakwasie'], description: 'Ciemny, wilgotny miąższ.' }),
  product('orkisz', { name: 'Chleb orkiszowy', tags: ['Na zakwasie'], description: 'Z mąki orkiszowej.' }),
  product('kajzerka', { name: 'Bułka kajzerka', tags: ['Pszenne'], description: 'Chrupiąca skórka.' }),
];

describe('normalizeSearch', () => {
  it('drops case and Polish diacritics, including ł which does not decompose', () => {
    expect(normalizeSearch('ŻÓŁĆ Gęślą Jaźń')).toBe('zolc gesla jazn');
    expect(normalizeSearch('Bułka')).toBe('bulka');
  });
});

describe('filterProducts', () => {
  it('returns everything for the "all" chip and an empty query', () => {
    expect(ids(filterProducts(products, ALL_TAGS, ''))).toEqual(['zytni', 'orkisz', 'kajzerka']);
  });

  it('filters by the active tag chip', () => {
    expect(ids(filterProducts(products, 'Na zakwasie', ''))).toEqual(['zytni', 'orkisz']);
  });

  it('finds products typed without Polish letters', () => {
    expect(ids(filterProducts(products, ALL_TAGS, 'zytni'))).toEqual(['zytni']);
    expect(ids(filterProducts(products, ALL_TAGS, 'bulka'))).toEqual(['kajzerka']);
  });

  it('matches regardless of case and surrounding spaces', () => {
    expect(ids(filterProducts(products, ALL_TAGS, '  ORKISZ '))).toEqual(['orkisz']);
  });

  it('searches the description and the tags, not just the name', () => {
    expect(ids(filterProducts(products, ALL_TAGS, 'chrupiaca'))).toEqual(['kajzerka']);
    expect(ids(filterProducts(products, ALL_TAGS, 'pszenne'))).toEqual(['kajzerka']);
  });

  it('applies the tag and the query together', () => {
    expect(ids(filterProducts(products, 'Na zakwasie', 'chleb'))).toEqual(['zytni', 'orkisz']);
    expect(ids(filterProducts(products, 'Pszenne', 'chleb'))).toEqual([]);
  });

  it('returns nothing, not everything, when nothing matches', () => {
    expect(filterProducts(products, ALL_TAGS, 'pizza')).toEqual([]);
  });
});
