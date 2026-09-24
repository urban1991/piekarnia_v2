import type { MetadataRoute } from 'next';
import { INDEXABLE_ROUTES, siteUrl } from '../lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl();
  return INDEXABLE_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: path === '/' ? origin : origin + path,
    priority,
    changeFrequency,
  }));
}
