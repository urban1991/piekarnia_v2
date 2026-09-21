import { defineField, defineType } from 'sanity';

export const TAG_OPTIONS = ['Na zakwasie', 'Żytnie', 'Pszenne', 'Z dodatkami', 'Sezonowo'];

export const product = defineType({
  name: 'product',
  title: 'Produkt',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Podstawowe', default: true },
    { name: 'media', title: 'Zdjęcia' },
    { name: 'nutrition', title: 'Wartości odżywcze' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nazwa',
      type: 'string',
      group: 'basic',
      validation: (r) => r.required().min(2).max(80),
    }),
    defineField({
      name: 'category',
      title: 'Kategoria',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'basic',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'weight',
      title: 'Waga',
      type: 'string',
      group: 'basic',
      description: 'np. „500 g” albo „350 / 500 / 600 g”',
    }),
    defineField({
      name: 'description',
      title: 'Opis',
      type: 'text',
      rows: 3,
      group: 'basic',
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: 'tags',
      title: 'Tagi',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'basic',
      options: { list: TAG_OPTIONS, layout: 'tags' },
    }),
    defineField({
      name: 'visible',
      title: 'Widoczny na stronie',
      type: 'boolean',
      group: 'basic',
      initialValue: true,
      description: 'Wyłącz, żeby ukryć produkt (np. sezonowy) bez kasowania.',
    }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', group: 'basic', initialValue: 100 }),
    defineField({
      name: 'cutout',
      title: 'Wycinanka (PNG bez tła)',
      type: 'image',
      group: 'media',
      description: 'Pokazywana na jasnym tle. Jeśli dodasz też fotografię, karta użyje fotografii.',
    }),
    defineField({
      name: 'photo',
      title: 'Fotografia',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      description: 'Prawdziwe zdjęcie, pokazywane na cały kadr karty.',
    }),
    defineField({
      name: 'nutrition',
      title: 'Wartości odżywcze (100 g)',
      type: 'object',
      group: 'nutrition',
      fields: [
        defineField({ name: 'kcal', title: 'kcal', type: 'number' }),
        defineField({ name: 'fat', title: 'Tłuszcz', type: 'string' }),
        defineField({ name: 'carbs', title: 'Węglowodany', type: 'string' }),
        defineField({ name: 'fiber', title: 'Błonnik', type: 'string' }),
        defineField({ name: 'protein', title: 'Białko', type: 'string' }),
        defineField({ name: 'salt', title: 'Sól', type: 'string' }),
      ],
      options: { collapsible: true, collapsed: false },
    }),
  ],
  validation: (r) =>
    r.custom((doc) =>
      doc?.cutout || doc?.photo ? true : { message: 'Dodaj wycinankę albo fotografię.', level: 'warning' as const },
    ),
  preview: {
    select: { title: 'name', subtitle: 'weight', media: 'photo', cutout: 'cutout', visible: 'visible', category: 'category.name' },
    prepare({ title, subtitle, media, cutout, visible, category }) {
      return {
        title: visible === false ? `${title} (ukryty)` : title,
        subtitle: [category, subtitle].filter(Boolean).join(' · '),
        media: media ?? cutout,
      };
    },
  },
});
