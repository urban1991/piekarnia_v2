/**
 * Registered company details for the legal pages, copied from the bakery's privacy policy
 * (PDF of January 2025). Kept in code, not Studio: these change only with a legal update.
 */
export const COMPANY = {
  name: 'Piekarnia Cukiernia Bieżyński – Wioleta Bieżyńska sp.k.',
  street: 'ul. Składowa 3',
  postalCode: '58-100',
  city: 'Świdnica',
  court: 'Sąd Rejonowy dla Wrocławia-Fabrycznej we Wrocławiu, IX Wydział Gospodarczy Krajowego Rejestru Sądowego',
  krs: '0001125230',
  nip: '884-282-83-47',
  regon: '529560130',
  /** contact for personal-data matters, as given in the January 2025 privacy policy (to be confirmed) */
  privacyEmail: 'biezynski@op.pl',
} as const;

/** Shown under both legal documents; change it together with their content. */
export const LEGAL_UPDATED = '24 września 2026';
