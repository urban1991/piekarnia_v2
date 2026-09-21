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
    defineField({
      name: 'legal',
      title: 'Dokumenty prawne (linki do PDF)',
      type: 'object',
      fields: [
        defineField({ name: 'nota', title: 'Nota prawna', type: 'url' }),
        defineField({ name: 'privacy', title: 'Polityka prywatności', type: 'url' }),
        defineField({ name: 'cookies', title: 'Polityka cookies', type: 'url' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria (Instagram, „O nas”)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Ustawienia strony' }) },
});
