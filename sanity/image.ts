import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { env } from './env';

const builder = imageUrlBuilder({ projectId: env.projectId, dataset: env.dataset });

export const urlFor = (source: SanityImageSource) => builder.image(source).auto('format');
