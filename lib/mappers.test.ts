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

  it('maps heroImage to a url, and to an empty string when the doc is missing', () => {
    expect(mapSettings({ heroImage: img('h1') }).heroImage).toContain('h1-800x600.png');
    expect(mapSettings(null).heroImage).toBe('');
  });

  it('maps homeGallery without dropping missing entries, preserving indices', () => {
    const s = mapSettings({ homeGallery: [img('a'), {}] });
    expect(s.homeGallery).toEqual([expect.stringContaining('a-800x600.png'), '']);
    expect(mapSettings(null).homeGallery).toEqual([]);
  });
});
