import { describe, expect, it, vi } from 'vitest';

vi.mock('../sanity/env', () => ({ env: { projectId: 'abc123', dataset: 'production', apiVersion: '2026-09-01' } }));

import { mapAnnouncement, mapCategory, mapProduct, mapSettings, mapStore } from './mappers';

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
    expect(s.featured).toBe(false);
  });

  it('maps store.featured to true when set', () => {
    const s = mapStore({ _id: 'store-2', city: 'Świdnica', street: 'ul. Składowa 3', label: 'Sklep', hours: 'Pn–Pt 6–18', featured: true });
    expect(s.featured).toBe(true);
  });

  it('keeps the map location, dropping the Sanity type and altitude', () => {
    const s = mapStore({
      _id: 'store-3',
      city: 'Bielawa',
      street: 'ul. Piłsudskiego 74',
      hours: '',
      location: { _type: 'geopoint', lat: 50.682972, lng: 16.62175, alt: 0 },
    });
    expect(s.location).toEqual({ lat: 50.682972, lng: 16.62175 });
    expect(mapStore({ _id: 'store-4', city: 'Bielawa', street: 'x', hours: '' }).location).toBeNull();
  });

  it('passes the opening date and offer through, empty for an established shop', () => {
    const fresh = mapStore({
      _id: 'store-glowackiego',
      city: 'Świdnica',
      street: 'ul. Głowackiego',
      hours: '',
      openingDate: '2026-10-15',
      openingOffer: '  Drożdżówka gratis  ',
    });
    expect(fresh.openingDate).toBe('2026-10-15');
    expect(fresh.openingOffer).toBe('Drożdżówka gratis');

    const old = mapStore({ _id: 'store-1', city: 'Bielawa', street: 'x', hours: '' });
    expect(old.openingDate).toBeNull();
    expect(old.openingOffer).toBe('');
  });

  it('falls back to Google Maps directions when no maps link was entered', () => {
    const byPoint = mapStore({ _id: 's', city: 'Bielawa', street: 'ul. Piłsudskiego 74', hours: '', location: { lat: 50.682972, lng: 16.62175 } });
    expect(byPoint.maps).toBe('https://www.google.com/maps/dir/?api=1&destination=50.682972%2C16.62175');

    const byAddress = mapStore({ _id: 's', city: 'Jaworzyna Śląska', street: 'ul. Wolności 15D', hours: '' });
    const url = new URL(byAddress.maps);
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/dir/');
    expect(url.searchParams.get('destination')).toBe('ul. Wolności 15D, Jaworzyna Śląska');
  });

  it('maps the category page intro, falling back to the card lead when it is empty', () => {
    const base = { _id: 'category-chleby', name: 'Chleby', slug: 'chleby', lead: 'Krótko na kartę.' };
    expect(mapCategory({ ...base, intro: 'Dłuższy opis na stronę.' }).intro).toBe('Dłuższy opis na stronę.');
    expect(mapCategory({ ...base, intro: '  ' }).intro).toBe('Krótko na kartę.');
    expect(mapCategory(base).intro).toBe('Krótko na kartę.');
  });

  it('maps category with slug and cover', () => {
    const c = mapCategory({ _id: 'category-chleby', name: 'Chleby', slug: 'chleby', lead: 'Lead', cover: img('ddd') });
    expect(c).toMatchObject({ slug: 'chleby', name: 'Chleby', lead: 'Lead' });
    expect(c.cover).toContain('ddd-800x600.png');
  });
});

describe('mapAnnouncement', () => {
  it('maps an announcement with a link', () => {
    const a = mapAnnouncement({ _id: 'announcement-1', text: 'Od poniedziałku wracają jagodzianki', link: '/chleby' });
    expect(a).toEqual({ id: 'announcement-1', text: 'Od poniedziałku wracają jagodzianki', link: '/chleby' });
  });

  it('drops a link that would lead off-site or nowhere, keeping the text', () => {
    for (const link of ['//evil.example', '/\\evil.example', 'javascript:alert(1)', 'www.facebook.com']) {
      const a = mapAnnouncement({ _id: 'a', text: 'Promocja', link });
      expect(a).toEqual({ id: 'a', text: 'Promocja', link: undefined });
    }
  });

  it('maps an announcement without a link to undefined, for both empty string and null', () => {
    expect(mapAnnouncement({ _id: 'announcement-2', text: 'Zmiana godzin', link: '' }).link).toBeUndefined();
    expect(mapAnnouncement({ _id: 'announcement-3', text: 'Zmiana godzin', link: null }).link).toBeUndefined();
  });
});

describe('mapSettings', () => {
  it('returns empty strings when settings document is missing', () => {
    const s = mapSettings(null);
    expect(s.phone).toBe('');
    expect(s.gallery).toEqual([]);
  });

  it('derives the tel: link from the phone number, so the two cannot drift apart', () => {
    expect(mapSettings({ phone: '503 083 208' }).phoneHref).toBe('tel:+48503083208');
    expect(mapSettings(null).phoneHref).toBe('');
  });

  it('maps gallery images to urls', () => {
    const s = mapSettings({ phone: '503 083 208', gallery: [img('e1'), img('e2')] });
    expect(s.gallery).toHaveLength(2);
    expect(s.gallery[0]).toContain('e1-800x600.png');
  });

  it('maps heroImage to a url, and to an empty string when the doc is missing', () => {
    expect(mapSettings({ heroImage: img('h1') }).heroImage).toContain('h1-800x600.png');
    expect(mapSettings(null).heroImage).toBe('');
  });

  it('turns the hero hotspot into a CSS object-position, centred when unset', () => {
    const hotspot = { x: 0.62, y: 0.3, width: 0.4, height: 0.4 };
    expect(mapSettings({ heroImage: { ...img('h1'), hotspot } }).heroImagePosition).toBe('62% 30%');
    expect(mapSettings({ heroImage: img('h1') }).heroImagePosition).toBe('50% 50%');
    expect(mapSettings(null).heroImagePosition).toBe('50% 50%');
  });

  it('derives a 1200×630 JPEG link-preview image from the hero, cropped around its hotspot', () => {
    const hotspot = { x: 0.9, y: 0.5, width: 0.1, height: 0.1 };
    const url = new URL(mapSettings({ heroImage: { ...img('h1'), hotspot } }).ogImage);
    expect(url.pathname).toContain('h1-800x600.png');
    expect(url.searchParams.get('w')).toBe('1200');
    expect(url.searchParams.get('h')).toBe('630');
    expect(url.searchParams.get('fm')).toBe('jpg');
    // 800×600 → 1200:630 keeps full width and cuts the height; the hotspot decides which band survives
    expect(url.searchParams.get('rect')).toMatch(/^0,\d+,800,\d+$/);
    expect(mapSettings(null).ogImage).toBe('');
  });

  it('measures the hero hotspot within the cropped area, since the url is already cropped', () => {
    const crop = { left: 0.2, right: 0, top: 0, bottom: 0.5 };
    const hotspot = { x: 0.6, y: 0.25, width: 0.2, height: 0.2 };
    expect(mapSettings({ heroImage: { ...img('h1'), crop, hotspot } }).heroImagePosition).toBe('50% 50%');
  });

  it('maps homeGallery without dropping missing entries, preserving indices', () => {
    const s = mapSettings({ homeGallery: [img('a'), {}] });
    expect(s.homeGallery).toEqual([expect.stringContaining('a-800x600.png'), '']);
    expect(mapSettings(null).homeGallery).toEqual([]);
  });
});
