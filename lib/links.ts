/**
 * A link a manager may put on the site: a page of this site ("/chleby") or a full http(s) address.
 * "//host" and "/\host" start with a slash but browsers resolve them to another site, "www.…"
 * without a scheme would become a broken relative link, and whitespace or control characters
 * are stripped by the URL parser ("/\t/host" opens //host), so they are rejected outright.
 */
export function isSafeLink(link: string): boolean {
  if (/[\s\u0000-\u001f\u007f]/.test(link)) return false;
  return /^\/(?![/\\])|^https?:\/\//i.test(link);
}
