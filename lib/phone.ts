/**
 * tel: link from the phone number as a manager types it in Studio ("503 083 208").
 * Derived rather than entered separately, so the displayed number and the one that is dialled
 * can never drift apart. A bare 9-digit number is Polish (+48).
 */
export function telHref(phone: string): string {
  const international = /^\s*(\+|00)/.test(phone);
  const digits = phone.replace(/\D/g, '').replace(/^00/, '');
  if (!digits) return '';
  if (international) return `tel:+${digits}`;
  if (digits.length === 9) return `tel:+48${digits}`;
  if (digits.length === 11 && digits.startsWith('48')) return `tel:+${digits}`;
  return `tel:${digits}`;
}
