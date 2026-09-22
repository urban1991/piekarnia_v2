import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Opinia',
  type: 'document',
  fields: [
    defineField({ name: 'text', title: 'Treść', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'author', title: 'Autor', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'rating',
      title: 'Ocena (gwiazdki)',
      type: 'number',
      initialValue: 5,
      validation: (r) => r.min(1).max(5).integer(),
      options: { list: [1, 2, 3, 4, 5] },
    }),
    defineField({ name: 'source', title: 'Źródło', type: 'string', description: 'np. „Google”, „Facebook”', initialValue: 'Google' }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', initialValue: 100 }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'text', rating: 'rating' },
    prepare: ({ title, subtitle, rating }) => ({ title: rating ? `${'★'.repeat(rating)} ${title}` : title, subtitle }),
  },
});
