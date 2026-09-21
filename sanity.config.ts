'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { plPLLocale } from '@sanity/locale-pl-pl';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'piekarnia',
  title: 'Piekarnia Bieżyński',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool(), plLocale()],
  schema: { types: schemaTypes },
});

function plLocale() {
  return plPLLocale();
}
