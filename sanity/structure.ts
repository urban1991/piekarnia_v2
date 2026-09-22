import type { StructureResolver } from 'sanity/structure';
import { CATEGORY_SLUGS } from './schemas/category';
import { SITE_SETTINGS_ID } from './schemas/siteSettings';

const CATEGORY_TITLES: Record<(typeof CATEGORY_SLUGS)[number], string> = {
  chleby: 'Chleby',
  'bulki-i-rogale': 'Bułki i rogale',
  'inne-wypieki': 'Inne wypieki',
};

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Treść')
    .items([
      S.listItem()
        .title('Produkty')
        .child(
          S.list()
            .title('Produkty')
            .items([
              ...CATEGORY_SLUGS.map((slug) =>
                S.listItem()
                  .title(CATEGORY_TITLES[slug])
                  .child(
                    S.documentTypeList('product')
                      .title(CATEGORY_TITLES[slug])
                      .filter('_type == "product" && category->slug.current == $slug')
                      .params({ slug })
                      .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                      .initialValueTemplates([
                        S.initialValueTemplateItem('product-in-category', { categoryId: `category-${slug}` }),
                      ]),
                  ),
              ),
              S.divider(),
              S.documentTypeListItem('product').title('Wszystkie produkty'),
            ]),
        ),
      S.documentTypeListItem('category')
        .title('Kategorie')
        .child(
          S.documentTypeList('category')
            .title('Kategorie')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }]),
        ),
      S.listItem()
        .title('Ogłoszenia')
        .child(
          S.documentTypeList('announcement')
            .title('Ogłoszenia')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }]),
        ),
      S.listItem()
        .title('Sklepy')
        .child(
          S.documentTypeList('store')
            .title('Sklepy')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }]),
        ),
      S.listItem()
        .title('Opinie')
        .child(
          S.documentTypeList('testimonial')
            .title('Opinie')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }]),
        ),
      S.listItem()
        .title('Historia')
        .child(
          S.documentTypeList('historyEntry')
            .title('Historia')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }]),
        ),
      S.divider(),
      S.listItem()
        .title('Ustawienia strony')
        .child(S.document().schemaType('siteSettings').documentId(SITE_SETTINGS_ID)),
    ]);

/** Types hidden from the "create new" menu; categories are fixed, settings is a singleton. */
export const HIDDEN_FROM_NEW = new Set(['category', 'siteSettings']);
