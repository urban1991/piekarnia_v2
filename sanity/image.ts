import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import type { ImageLoaderProps } from 'next/image';
import { env } from './env';

const builder = imageUrlBuilder({ projectId: env.projectId, dataset: env.dataset });

export const urlFor = (source: SanityImageSource) => builder.image(source).auto('format');

/**
 * next/image loader for URLs that already point at cdn.sanity.io.
 * Adds width/quality; keeps hotspot params that urlFor() put in the URL.
 */
export function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 80));
  url.searchParams.set('auto', 'format');
  return url.toString();
}

export const isSanityUrl = (src: string) => src.startsWith('https://cdn.sanity.io/');
