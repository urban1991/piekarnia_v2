/**
 * tel: link from the phone number as a manager types it in Studio ("503 083 208").
 * Derived rather than entered separately, so the displayed number and the one that is dialled
 * can never drift apart. Only the first number-like run is used, so "wew. 12" or a second
 * number after "/" are left out; anything that is not a dialable number gives ''.
 */
export function telHref(phone: string): string {
  const run = phone.match(/(\+|00)?\s*[\d(][\d\s().-]*/)?.[0];
  if (!run) return '';
  const international = /^(\+|00)/.test(run.trim());
  let digits = run.replace(/\D/g, '');
  if (international) {
    digits = digits.replace(/^00/, '');
    return digits.length >= 7 && digits.length <= 15 ? `tel:+${digits}` : '';
  }
  // Polish landline/mobile: optional trunk 0 or country code 48 in front of the 9 digits
  if (digits.length === 10 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 11 && digits.startsWith('48')) digits = digits.slice(2);
  return digits.length === 9 ? `tel:+48${digits}` : '';
}
