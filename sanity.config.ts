'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { plPLLocale } from '@sanity/locale-pl-pl';
import { schemaTypes } from './sanity/schemas';
import { HIDDEN_FROM_NEW, structure } from './sanity/structure';

export default defineConfig({
  name: 'piekarnia',
  title: 'Piekarnia Bieżyński',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool({ structure }), plPLLocale()],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter((t) => !HIDDEN_FROM_NEW.has(t.schemaType)),
      {
        id: 'product-in-category',
        title: 'Produkt w kategorii',
        schemaType: 'product',
        parameters: [{ name: 'categoryId', type: 'string' }],
        value: (params: { categoryId: string }) => ({
          category: { _type: 'reference', _ref: params.categoryId },
          visible: true,
        }),
      },
    ],
  },
  document: {
    actions: (prev, { schemaType }) =>
      schemaType === 'category' || schemaType === 'siteSettings'
        ? prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish')
        : prev,
  },
});
