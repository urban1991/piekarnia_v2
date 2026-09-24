import type { MetadataRoute } from 'next';

type Env = Record<string, string | undefined>;

export const SITE_NAME = 'Piekarnia Bieżyński';

/**
 * Absolute origin used for canonical urls, the sitemap and link previews.
 * NEXT_PUBLIC_SITE_URL overrides; otherwise Vercel's production domain, which Vercel switches to the
 * custom domain as soon as one is attached, so nothing needs changing on launch day.
 */
export function siteUrl(env: Env = process.env): string {
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return 'http://localhost:3000';
}

/** Preview deployments (one per pushed branch) must not compete with the real site in search results. */
export function isIndexable(env: Env = process.env): boolean {
  return env.VERCEL_ENV !== 'preview';
}

type Route = { path: string; priority: number; changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']> };

/** Public pages for the sitemap; lib/site.test.ts fails when a page folder is added without an entry here. */
export const INDEXABLE_ROUTES: Route[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/chleby', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/bulki-i-rogale', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/inne-wypieki', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/sklepy', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/kontakt', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/o-nas', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/dokumenty', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/polityka-prywatnosci', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/nota-prawna', priority: 0.2, changeFrequency: 'yearly' },
];
