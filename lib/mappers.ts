import { urlFor } from '../sanity/image';
import type { Category, CategorySlug, Nutrition, Product, SiteSettings, Store } from './types';

export type SanityImageRef = { asset?: { _ref: string }; hotspot?: unknown; crop?: unknown } | null | undefined;

export type ProductDoc = {
  _id: string;
  name: string;
  categorySlug: string;
  weight?: string | null;
  description: string;
  tags?: string[] | null;
  cutout?: SanityImageRef;
  photo?: SanityImageRef;
  nutrition?: Partial<Nutrition> | null;
  visible?: boolean | null;
  sortOrder?: number | null;
};

export type StoreDoc = {
  _id: string;
  city: string;
  street: string;
  label?: string | null;
  hours: string;
  image?: SanityImageRef;
  mapsUrl?: string | null;
  featured?: boolean | null;
};

export type CategoryDoc = {
  _id: string;
  name: string;
  slug: string;
  lead?: string | null;
  cover?: SanityImageRef;
};

export type SettingsDoc = {
  phone?: string | null;
  phoneHref?: string | null;
  email?: string | null;
  address?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  catalogPdf?: string | null;
  legal?: { nota?: string | null; privacy?: string | null; cookies?: string | null } | null;
  heroImage?: SanityImageRef;
  homeGallery?: SanityImageRef[] | null;
  aboutGallery?: SanityImageRef[] | null;
  gallery?: SanityImageRef[] | null;
};

const imageUrl = (ref: SanityImageRef): string => (ref?.asset?._ref ? urlFor(ref).url() : '');

const str = (v: string | null | undefined) => v ?? '';

export function mapProduct(doc: ProductDoc): Product {
  const n = doc.nutrition;
  const nutrition: Nutrition | null =
    n && typeof n.kcal === 'number'
      ? { kcal: n.kcal, fat: str(n.fat), carbs: str(n.carbs), fiber: str(n.fiber), protein: str(n.protein), salt: str(n.salt) }
      : null;
  const photo = imageUrl(doc.photo);
  return {
    id: doc._id,
    category: doc.categorySlug as CategorySlug,
    name: doc.name,
    weight: str(doc.weight),
    tags: doc.tags ?? [],
    description: doc.description,
    image: imageUrl(doc.cutout),
    photo: photo || undefined,
    nutrition,
  };
}

export function mapStore(doc: StoreDoc): Store {
  return {
    id: doc._id,
    city: doc.city,
    street: doc.street,
    label: str(doc.label),
    hours: doc.hours,
    image: imageUrl(doc.image),
    maps: str(doc.mapsUrl),
    featured: !!doc.featured,
  };
}

export function mapCategory(doc: CategoryDoc): Category {
  return { slug: doc.slug as CategorySlug, name: doc.name, lead: str(doc.lead), cover: imageUrl(doc.cover) };
}

export function mapSettings(doc: SettingsDoc | null): SiteSettings {
  return {
    phone: str(doc?.phone),
    phoneHref: str(doc?.phoneHref),
    email: str(doc?.email),
    address: str(doc?.address),
    facebook: str(doc?.facebook),
    instagram: str(doc?.instagram),
    catalogPdf: str(doc?.catalogPdf),
    legal: { nota: str(doc?.legal?.nota), privacy: str(doc?.legal?.privacy), cookies: str(doc?.legal?.cookies) },
    heroImage: imageUrl(doc?.heroImage),
    homeGallery: (doc?.homeGallery ?? []).map(imageUrl),
    aboutGallery: (doc?.aboutGallery ?? []).map(imageUrl),
    gallery: (doc?.gallery ?? []).map(imageUrl).filter(Boolean),
  };
}
