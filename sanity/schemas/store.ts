import { defineField, defineType } from 'sanity';

export const store = defineType({
  name: 'store',
  title: 'Sklep',
  type: 'document',
  fields: [
    defineField({ name: 'city', title: 'Miasto', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'street', title: 'Ulica i numer', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Etykieta', type: 'string', description: 'np. „Sklep przy piekarni”' }),
    defineField({
      name: 'hours',
      title: 'Godziny otwarcia',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
      description: 'np. „Pn–Pt 6:00–18:00 · Sb 6:00–14:00 · Nd zamknięte”',
    }),
    defineField({ name: 'image', title: 'Zdjęcie', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'mapsUrl', title: 'Link do map Google', type: 'url' }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', initialValue: 100 }),
  ],
  preview: {
    select: { city: 'city', street: 'street', media: 'image' },
    prepare: ({ city, street, media }) => ({ title: `${city}, ${street}`, media }),
  },
});
