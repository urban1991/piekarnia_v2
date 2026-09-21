import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Opinia',
  type: 'document',
  fields: [
    defineField({ name: 'text', title: 'Treść', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'author', title: 'Autor', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'author', subtitle: 'text' } },
});
