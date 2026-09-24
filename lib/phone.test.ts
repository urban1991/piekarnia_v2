import { describe, expect, it } from 'vitest';
import { telHref } from './phone';

describe('telHref', () => {
  it.each([
    ['503 083 208', 'tel:+48503083208'],
    ['503-083-208', 'tel:+48503083208'],
    ['(74) 852 11 22', 'tel:+48748521122'],
    ['+48 503 083 208', 'tel:+48503083208'],
    ['48 503 083 208', 'tel:+48503083208'],
    ['0048 503 083 208', 'tel:+48503083208'],
    ['+420 123 456 789', 'tel:+420123456789'],
    // trunk zero and an area code in brackets, as printed on old signs
    ['(0-74) 852 11 22', 'tel:+48748521122'],
    ['0 74 852 11 22', 'tel:+48748521122'],
    // only the number itself is dialled: extensions and a second number are left out
    ['503 083 208 wew. 12', 'tel:+48503083208'],
    ['503 083 208 / 74 852 11 22', 'tel:+48503083208'],
    ['tel. 503 083 208', 'tel:+48503083208'],
  ])('%s → %s', (phone, href) => {
    expect(telHref(phone)).toBe(href);
  });

  it.each(['', 'brak', 'brak 1', '503 083', '12345678901234567', '+48 503'])('gives no link for %j, which is not a dialable number', (value) => {
    expect(telHref(value)).toBe('');
  });
});
