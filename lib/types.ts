export type Nutrition = {
  kcal: number;
  fat: string;
  carbs: string;
  fiber: string;
  protein: string;
  salt: string;
};

export type CategorySlug = 'chleby' | 'bulki-i-rogale' | 'inne-wypieki';

export type Product = {
  id: string;
  category: CategorySlug;
  name: string;
  /** e.g. "500 g" or "350 / 500 / 600 g" */
  weight: string;
  tags: string[];
  description: string;
  /** cut-out PNG (no background) shown over Sand / a veiled backdrop */
  image: string;
  /** optional real photograph; when set the card shows it full-bleed instead of the cut-out */
  photo?: string;
  nutrition: Nutrition | null;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  lead: string;
  cover: string;
};

export type Store = {
  id: string;
  city: string;
  street: string;
  label: string;
  /** PLACEHOLDER hours until confirmed by the bakery */
  hours: string;
  image: string;
  maps: string;
  featured: boolean;
};

export type Testimonial = {
  text: string;
  author: string;
  /** 1–5, optional (shown as stars) */
  rating?: number | null;
  /** e.g. "Google" */
  source?: string | null;
};

export type HistoryEntry = { year: string; title: string; text: string };

export type Announcement = { id: string; text: string; link?: string };

export type SiteSettings = {
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  catalogPdf: string;
  legal: { nota: string; privacy: string; cookies: string };
  /** hero image URL (cdn.sanity.io); '' when unset */
  heroImage: string;
  /** CSS object-position from the Studio hotspot, e.g. '62% 30%'; '50% 50%' when unset */
  heroImagePosition: string;
  /** 1200×630 JPEG link preview cut from the hero around its hotspot; '' when there is no hero */
  ogImage: string;
  /** "O nas" images shown on the homepage; missing trailing entries are simply absent (array may be shorter) */
  homeGallery: string[];
  /** images shown on the "O nas" page; missing trailing entries are simply absent (array may be shorter) */
  aboutGallery: string[];
  /** image URLs (cdn.sanity.io) */
  gallery: string[];
};
