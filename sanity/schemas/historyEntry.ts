import { defineField, defineType } from 'sanity';

export const historyEntry = defineType({
  name: 'historyEntry',
  title: 'Wpis w historii',
  type: 'document',
  fields: [
    defineField({ name: 'year', title: 'Rok', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Tytuł', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'text', title: 'Treść', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'year', subtitle: 'title' } },
});
