import { defineField, defineType } from 'sanity';
import { isSafeLink } from '../../lib/links';

/** Studio rule for the announcement link; see isSafeLink. */
export function checkAnnouncementLink(link?: string): true | string {
  if (!link) return true;
  return isSafeLink(link) ? true : 'Zacznij od / (strona tego serwisu, np. /chleby) albo od https://';
}

/** Document-level rule: an announcement's window must not end before (or when) it starts. */
export function endsAfterStart(startDate?: string, endDate?: string): true | string {
  if (!startDate || !endDate) return true;
  return new Date(endDate).getTime() > new Date(startDate).getTime()
    ? true
    : 'Data „Pokazuj do” musi być późniejsza niż „Pokazuj od”.';
}

export const announcement = defineType({
  name: 'announcement',
  title: 'Ogłoszenie',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Treść',
      type: 'string',
      validation: (r) => r.required().max(120),
      description: 'Krótko — pasek przewija się w pętli, np. „Od poniedziałku wracają jagodzianki”.',
    }),
    defineField({
      name: 'link',
      title: 'Link (opcjonalnie)',
      type: 'string',
      validation: (r) => r.custom((link) => checkAnnouncementLink(link as string | undefined)),
      description: 'Adres strony, np. /chleby albo pełny https://…',
    }),
    defineField({
      name: 'startDate',
      title: 'Pokazuj od',
      type: 'datetime',
      description: 'Puste = od zaraz.',
    }),
    defineField({
      name: 'endDate',
      title: 'Pokazuj do',
      type: 'datetime',
      description: 'Puste = bez końca.',
    }),
    defineField({ name: 'active', title: 'Włączone', type: 'boolean', initialValue: true }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', initialValue: 100 }),
  ],
  validation: (r) =>
    r.custom((doc) => endsAfterStart(doc?.startDate as string | undefined, doc?.endDate as string | undefined)),
  preview: {
    select: { title: 'text', startDate: 'startDate', endDate: 'endDate', active: 'active' },
    prepare({ title, startDate, endDate, active }: { title?: string; startDate?: string; endDate?: string; active?: boolean }) {
      const fmt = (iso: string) => new Date(iso).toLocaleDateString('pl-PL');
      let subtitle: string;
      if (active === false) {
        subtitle = 'Wyłączone';
      } else if (startDate && endDate) {
        subtitle = `od ${fmt(startDate)} do ${fmt(endDate)}`;
      } else if (startDate) {
        subtitle = `od ${fmt(startDate)}`;
      } else if (endDate) {
        subtitle = `do ${fmt(endDate)}`;
      } else {
        subtitle = 'zawsze';
      }
      return { title, subtitle };
    },
  },
});
