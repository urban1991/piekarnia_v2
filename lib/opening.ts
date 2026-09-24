import type { Store } from './types';

/** How long after opening day the homepage keeps celebrating a new shop. */
export const JUST_OPENED_DAYS = 14;

export type OpeningPhase = 'upcoming' | 'justOpened' | 'open';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Today's calendar date in Poland as YYYY-MM-DD. The server runs in UTC, which would flip
 * "tomorrow" to "today" an hour or two late (or early) around midnight.
 */
export function todayInWarsaw(now: Date = new Date()): string {
  // assembled from parts rather than relying on some locale happening to format as YYYY-MM-DD
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: 'year' | 'month' | 'day') => parts.find((p) => p.type === type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

/** Whole calendar days from one YYYY-MM-DD to another; both read as UTC midnights, so DST cannot skew it. */
const daysBetween = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS);

/** Where a shop stands relative to its opening date; `days` counts down before and up after. */
export function openingPhase(openingDate: string | null, today: string): { phase: OpeningPhase; days: number } {
  if (!openingDate) return { phase: 'open', days: 0 };
  const until = daysBetween(today, openingDate);
  if (until > 0) return { phase: 'upcoming', days: until };
  const since = Math.abs(until); // not -until: on opening day that would be -0
  return { phase: since < JUST_OPENED_DAYS ? 'justOpened' : 'open', days: since };
}

/** A shop is open from its opening day on; shops without a date always are. */
export const isOpen = (store: Store, today: string) => openingPhase(store.openingDate, today).phase !== 'upcoming';

/** "dziś", "jutro", "za 12 dni". Polish uses "dni" for every count from 2 up. */
export function countdownLabel(days: number): string {
  if (days <= 0) return 'dziś';
  if (days === 1) return 'jutro';
  return `za ${days} dni`;
}

/** "15 października": formatted in UTC so the date string is never shifted to the previous day. */
export function formatOpeningDate(date: string): string {
  return new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(date));
}

/** Polish plural for "company shop": 1 sklep firmowy, 2–4 sklepy firmowe, 5+ sklepów firmowych (but 22 sklepy). */
export function storesNoun(n: number): string {
  if (n === 1) return 'sklep firmowy';
  const lastTwo = n % 100;
  const last = n % 10;
  return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'sklepy firmowe' : 'sklepów firmowych';
}

export type Promotion = { store: Store; phase: 'upcoming' | 'justOpened'; days: number };

/**
 * The shop the new-shop banner should advertise: the soonest upcoming one, else one opened
 * within the last two weeks, else none (and the banner is not rendered).
 */
export function promotedStore(stores: Store[], today: string): Promotion | null {
  const withPhase = stores.map((store) => ({ store, ...openingPhase(store.openingDate, today) }));
  const upcoming = withPhase.filter((s) => s.phase === 'upcoming').sort((a, b) => a.days - b.days)[0];
  if (upcoming) return { store: upcoming.store, phase: 'upcoming', days: upcoming.days };
  const fresh = withPhase.filter((s) => s.phase === 'justOpened').sort((a, b) => a.days - b.days)[0];
  return fresh ? { store: fresh.store, phase: 'justOpened', days: fresh.days } : null;
}

/** Short badge for lists, cards and the map: before opening and during the first two weeks, '' otherwise. */
export function openingBadge(store: Store, today: string): string {
  const { phase } = openingPhase(store.openingDate, today);
  if (phase === 'upcoming') return `Otwarcie ${formatOpeningDate(store.openingDate!)}`;
  if (phase === 'justOpened') return 'Nowy sklep';
  return '';
}
