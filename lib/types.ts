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
};

export type Testimonial = { text: string; author: string };

export type HistoryEntry = { year: string; title: string; text: string };
