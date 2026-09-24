import { defineField, defineType } from 'sanity';

type Point = { lat?: number; lng?: number } | undefined;

/** Rough box around Poland: enough to catch swapped or mistyped coordinates, not a border check. */
const POLAND = { lat: [49, 55], lng: [14, 24.2] } as const;
const within = (v: number | undefined, [min, max]: readonly [number, number]) => typeof v === 'number' && v >= min && v <= max;

export function checkStoreLocation(point: Point): true | string {
  if (!point) return true;
  if (within(point.lat, POLAND.lat) && within(point.lng, POLAND.lng)) return true;
  if (within(point.lng, POLAND.lat) && within(point.lat, POLAND.lng)) {
    return 'Współrzędne są zamienione: Latitude to ok. 50,8, a Longitude ok. 16,5.';
  }
  return 'Ten punkt nie leży w Polsce — sprawdź, czy liczby skopiowały się w całości.';
}

export const store = defineType({
  name: 'store',
  title: 'Sklep',
  type: 'document',
  fields: [
    defineField({ name: 'city', title: 'Miasto', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'street', title: 'Ulica i numer', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Etykieta', type: 'string', description: 'np. „Sklep przy piekarni”' }),
    defineField({
      name: 'featured',
      title: 'Sklep główny (wyróżniony)',
      type: 'boolean',
      initialValue: false,
      description: 'Zaznacz dla jednego sklepu — pokazuje się jako duża karta na stronie Sklepy i pierwszy na liście.',
    }),
    defineField({
      name: 'hours',
      title: 'Godziny otwarcia',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
      description: 'Oddzielaj wiersze kropką „·”, średnikiem albo nową linią, np. „Pn–Pt 6:00–18:00 · Sb 6:00–14:00 · Nd zamknięte”',
    }),
    defineField({ name: 'image', title: 'Zdjęcie', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'location',
      title: 'Lokalizacja na mapie',
      type: 'geopoint',
      validation: (r) => r.custom((point) => checkStoreLocation(point as Point)),
      description:
        'Pinezka na mapie sklepów. W Google Maps kliknij prawym przyciskiem na sklep i kliknij współrzędne, żeby je skopiować: pierwsza liczba (np. 50.8339) to Latitude, druga (np. 16.5066) to Longitude. Altitude zostaw puste. Puste = sklep nie pojawi się na mapie.',
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Link do map Google',
      type: 'url',
      description: 'Przycisk „Nawiguj”. Puste = trasa wyznaczana z lokalizacji albo adresu.',
    }),
    defineField({ name: 'sortOrder', title: 'Kolejność', type: 'number', initialValue: 100 }),
  ],
  preview: {
    select: { city: 'city', street: 'street', media: 'image' },
    prepare: ({ city, street, media }) => ({ title: `${city}, ${street}`, media }),
  },
});
