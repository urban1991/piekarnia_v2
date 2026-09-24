/**
 * A link a manager may put on the site: a page of this site ("/chleby") or a full http(s) address.
 * "//host" and "/\host" start with a slash but browsers resolve them to another site, and
 * "www.…" without a scheme would become a broken relative link.
 */
export function isSafeLink(link: string): boolean {
  return /^\/(?![/\\])|^https?:\/\//i.test(link);
}
