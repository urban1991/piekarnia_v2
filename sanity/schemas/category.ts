import { defineField, defineType } from 'sanity';

export const CATEGORY_SLUGS = ['chleby', 'bulki-i-rogale', 'inne-wypieki'] as const;

export const category = defineType({
  name: 'category',
  title: 'Kategoria',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nazwa', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Adres (slug)',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) =>
        r.required().custom((slug) =>
          slug?.current && (CATEGORY_SLUGS as readonly string[]).includes(slug.current)
            ? true
            : 'Dozwolone: ' + CATEGORY_SLUGS.join(', '),
        ),
      readOnly: true,
    }),
    defineField({ name: 'lead', title: 'Zajawka', type: 'text', rows: 3 }),
    defineField({ name: 'cover', title: 'Zdjęcie', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { title: 'name', media: 'cover' } },
});
