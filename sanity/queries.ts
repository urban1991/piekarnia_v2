import { defineQuery } from 'next-sanity';

const productProjection = `{
  _id, name, "categorySlug": category->slug.current, weight, description, tags,
  cutout, photo, nutrition, visible, sortOrder
}`;

export const categoriesQuery = defineQuery(
  `*[_type == "category"] | order(sortOrder asc) { _id, name, "slug": slug.current, lead, cover }`,
);

export const productsByCategoryQuery = defineQuery(
  `*[_type == "product" && visible == true && category->slug.current == $slug] | order(sortOrder asc, name asc) ${productProjection}`,
);

export const allProductsQuery = defineQuery(
  `*[_type == "product" && visible == true] | order(sortOrder asc, name asc) ${productProjection}`,
);

export const storesQuery = defineQuery(
  `*[_type == "store"] | order(sortOrder asc) { _id, city, street, label, hours, image, mapsUrl, featured }`,
);

export const testimonialsQuery = defineQuery(`*[_type == "testimonial"] | order(sortOrder asc) { text, author, rating, source }`);

export const historyQuery = defineQuery(`*[_type == "historyEntry"] | order(sortOrder asc) { year, title, text }`);

export const announcementsQuery = defineQuery(
  `*[_type == "announcement" && active == true
     && (!defined(startDate) || dateTime(startDate) <= dateTime(now()))
     && (!defined(endDate) || dateTime(endDate) >= dateTime(now()))
   ] | order(sortOrder asc) { _id, text, link }`,
);

export const siteSettingsQuery = defineQuery(
  `*[_type == "siteSettings" && _id == "siteSettings"][0] { phone, phoneHref, email, address, facebook, instagram, catalogPdf, legal, heroImage, homeGallery, aboutGallery, gallery }`,
);
