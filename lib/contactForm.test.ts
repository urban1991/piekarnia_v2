import { describe, expect, it } from 'vitest';
import { isReachable, validateContact } from './contactForm';

const valid = { name: 'Jan', contact: '503 083 208', message: 'Poproszę 20 chlebów na sobotę.' };

describe('isReachable', () => {
  it.each(['503083208', '503 083 208', '503-083-208', '+48 503 083 208', '74 852 11 22'])('accepts the phone number %s', (value) => {
    expect(isReachable(value)).toBe(true);
  });

  it.each(['jan@example.com', 'ab@o2.pl', '  jan@wp.pl  '])('accepts the e-mail %s, however short', (value) => {
    expect(isReachable(value)).toBe(true);
  });

  it.each(['', '   ', '503 083', 'jan', 'jan@wp', 'jan kowalski@wp.pl', 'zadzwońcie proszę'])('rejects %j', (value) => {
    expect(isReachable(value)).toBe(false);
  });
});

describe('validateContact', () => {
  it('passes a complete form', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('reports every missing field at once, in Polish', () => {
    expect(validateContact({ name: ' ', contact: '12', message: '' })).toEqual({
      name: 'Podaj imię.',
      contact: 'Podaj pełny numer lub adres e-mail.',
      message: 'Napisz wiadomość.',
    });
  });

  it('treats whitespace-only fields as empty', () => {
    expect(validateContact({ ...valid, message: '  \n ' })).toEqual({ message: 'Napisz wiadomość.' });
  });
});
