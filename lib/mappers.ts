import { ogImageUrl, urlFor } from '../sanity/image';
import { telHref } from './phone';
import type { Announcement, Category, CategorySlug, Nutrition, Product, SiteSettings, Store } from './types';

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
  location?: { _type?: string; lat?: number; lng?: number; alt?: number } | null;
  openingDate?: string | null;
  openingOffer?: string | null;
};

export type CategoryDoc = {
  _id: string;
  name: string;
  slug: string;
  lead?: string | null;
  intro?: string | null;
  cover?: SanityImageRef;
};

export type AnnouncementDoc = {
  _id: string;
  text: string;
  link?: string | null;
};

export type SettingsDoc = {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  catalogPdf?: string | null;
  heroImage?: SanityImageRef;
  homeGallery?: SanityImageRef[] | null;
  aboutGallery?: SanityImageRef[] | null;
  gallery?: SanityImageRef[] | null;
};

const imageUrl = (ref: SanityImageRef): string => (ref?.asset?._ref ? urlFor(ref).url() : '');

type Hotspot = { x?: number; y?: number } | null | undefined;
type Crop = { left?: number; right?: number; top?: number; bottom?: number } | null | undefined;

/**
 * Studio hotspot → CSS `object-position`, so an `object-fit: cover` image keeps the chosen spot in frame
 * (the url itself carries no hotspot: that only applies when the url asks for a fixed width and height).
 * The hotspot is stored relative to the full image while the url is already cropped, hence the rescale.
 */
const objectPosition = (ref: SanityImageRef): string => {
  const hotspot = ref?.hotspot as Hotspot;
  const crop = ref?.crop as Crop;
  const axis = (value: number | undefined, start = 0, end = 0) => {
    const within = typeof value === 'number' ? (value - start) / (1 - start - end) : 0.5;
    return `${Math.round(Math.min(1, Math.max(0, within)) * 1000) / 10}%`;
  };
  return `${axis(hotspot?.x, crop?.left, crop?.right)} ${axis(hotspot?.y, crop?.top, crop?.bottom)}`;
};

const str = (v: string | null | undefined) => v ?? '';

/** Google Maps directions to the shop (a plain link: no API key, nothing loaded until tapped). */
const directionsUrl = (doc: StoreDoc): string => {
  const { lat, lng } = doc.location ?? {};
  const destination = typeof lat === 'number' && typeof lng === 'number' ? `${lat},${lng}` : `${doc.street}, ${doc.city}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
};

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
    maps: doc.mapsUrl || directionsUrl(doc),
    featured: !!doc.featured,
    location: typeof doc.location?.lat === 'number' && typeof doc.location?.lng === 'number'
      ? { lat: doc.location.lat, lng: doc.location.lng }
      : null,
    openingDate: doc.openingDate || null,
    openingOffer: (doc.openingOffer ?? '').trim(),
  };
}

export function mapCategory(doc: CategoryDoc): Category {
  return {
    slug: doc.slug as CategorySlug,
    name: doc.name,
    lead: str(doc.lead),
    intro: doc.intro?.trim() || str(doc.lead),
    cover: imageUrl(doc.cover),
  };
}

export function mapAnnouncement(doc: AnnouncementDoc): Announcement {
  return { id: doc._id, text: doc.text, link: doc.link || undefined };
}

export function mapSettings(doc: SettingsDoc | null): SiteSettings {
  return {
    phone: str(doc?.phone),
    phoneHref: telHref(str(doc?.phone)),
    email: str(doc?.email),
    address: str(doc?.address),
    facebook: str(doc?.facebook),
    instagram: str(doc?.instagram),
    catalogPdf: str(doc?.catalogPdf),
    heroImage: imageUrl(doc?.heroImage),
    heroImagePosition: objectPosition(doc?.heroImage),
    ogImage: doc?.heroImage?.asset?._ref ? ogImageUrl(doc.heroImage) : '',
    homeGallery: (doc?.homeGallery ?? []).map(imageUrl),
    aboutGallery: (doc?.aboutGallery ?? []).map(imageUrl),
    gallery: (doc?.gallery ?? []).map(imageUrl).filter(Boolean),
  };
}
