import { defineField, defineType } from 'sanity';

export const SITE_SETTINGS_ID = 'siteSettings';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Ustawienia strony',
  type: 'document',
  fields: [
    defineField({ name: 'phone', title: 'Telefon (wyświetlany)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phoneHref', title: 'Telefon (link tel:)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', title: 'E-mail', type: 'string' }),
    defineField({ name: 'address', title: 'Adres', type: 'string' }),
    defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
    defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
    defineField({ name: 'catalogPdf', title: 'Katalog PDF (link)', type: 'url' }),
    defineField({ name: 'heroImage', title: 'Zdjęcie hero (strona główna)', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'homeGallery',
      title: 'Zdjęcia „O nas” na stronie głównej',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'aboutGallery',
      title: 'Zdjęcia strony „O nas”',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (r) => r.max(3),
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria Instagram (strona główna)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Ustawienia strony' }) },
});
