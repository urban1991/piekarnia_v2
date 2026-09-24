export type ContactFields = { name: string; contact: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Polish numbers have 9 digits; spaces, dashes and a +48 prefix are fine. */
const MIN_PHONE_DIGITS = 9;

/** A reply channel is valid as an e-mail address or as a phone number with at least 9 digits. */
export function isReachable(contact: string): boolean {
  const value = contact.trim();
  return EMAIL.test(value) || value.replace(/\D/g, '').length >= MIN_PHONE_DIGITS;
}

/** Field errors in Polish, keyed by input name; an empty object means the form can be sent. */
export function validateContact(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  if (!fields.name.trim()) errors.name = 'Podaj imię.';
  if (!isReachable(fields.contact)) errors.contact = 'Podaj pełny numer lub adres e-mail.';
  if (!fields.message.trim()) errors.message = 'Napisz wiadomość.';
  return errors;
}
