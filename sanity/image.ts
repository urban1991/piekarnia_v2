import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { env } from './env';

const builder = imageUrlBuilder({ projectId: env.projectId, dataset: env.dataset });

export const urlFor = (source: SanityImageSource) => builder.image(source).auto('format');

/**
 * 1200×630 link-preview image (Facebook, WhatsApp, Messenger). Fixed width and height make the CDN crop
 * around the Studio hotspot; JPEG rather than auto-format, since not every link scraper reads WebP.
 */
export const ogImageUrl = (source: SanityImageSource) =>
  builder.image(source).width(1200).height(630).fit('crop').format('jpg').quality(82).url();
