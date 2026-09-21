import type { SchemaTypeDefinition } from 'sanity';
import { category } from './category';
import { product } from './product';
import { store } from './store';
import { testimonial } from './testimonial';
import { historyEntry } from './historyEntry';
import { siteSettings } from './siteSettings';

export const schemaTypes: SchemaTypeDefinition[] = [category, product, store, testimonial, historyEntry, siteSettings];
