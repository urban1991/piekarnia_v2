import { createClient } from 'next-sanity';
import { env } from './env';

export const client = createClient({
  projectId: env.projectId,
  dataset: env.dataset,
  apiVersion: env.apiVersion,
  useCdn: true,
  perspective: 'published',
});

/** Cache tag used by every public query; the webhook revalidates it. */
export const SANITY_TAG = 'sanity';
