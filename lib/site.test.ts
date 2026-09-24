import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { INDEXABLE_ROUTES, isIndexable, siteUrl } from './site';

describe('siteUrl', () => {
  it('prefers an explicit NEXT_PUBLIC_SITE_URL, without a trailing slash', () => {
    expect(siteUrl({ NEXT_PUBLIC_SITE_URL: 'https://biezynski.pl/', VERCEL_PROJECT_PRODUCTION_URL: 'x.vercel.app' })).toBe(
      'https://biezynski.pl',
    );
  });

  it("follows Vercel's production domain, which becomes the custom domain once one is attached", () => {
    expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'piekarnia-v2.vercel.app' })).toBe('https://piekarnia-v2.vercel.app');
  });

  it('falls back to the local dev server', () => {
    expect(siteUrl({})).toBe('http://localhost:3000');
  });
});

describe('isIndexable', () => {
  it('lets search engines into production and local builds', () => {
    expect(isIndexable({ VERCEL_ENV: 'production' })).toBe(true);
    expect(isIndexable({})).toBe(true);
  });

  it('keeps preview deployments (every pushed branch) out of search results', () => {
    expect(isIndexable({ VERCEL_ENV: 'preview' })).toBe(false);
  });
});

describe('INDEXABLE_ROUTES', () => {
  const siteDir = join(__dirname, '..', 'app', '(site)');
  const NOT_INDEXED = new Set(['design-system']);
  const pageRoutes = [
    '/',
    ...readdirSync(siteDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(join(siteDir, d.name, 'page.tsx')) && !NOT_INDEXED.has(d.name))
      .map((d) => `/${d.name}`),
  ];

  it('lists every public page, so a new page cannot silently miss the sitemap', () => {
    expect([...INDEXABLE_ROUTES.map((r) => r.path)].sort()).toEqual([...pageRoutes].sort());
  });

  it.each(pageRoutes)('%s declares its own canonical url', (route) => {
    const file = route === '/' ? join(siteDir, 'page.tsx') : join(siteDir, route.slice(1), 'page.tsx');
    expect(readFileSync(file, 'utf8')).toContain(`canonical: '${route}'`);
  });
});
