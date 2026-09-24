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
  ])('%s → %s', (phone, href) => {
    expect(telHref(phone)).toBe(href);
  });

  it('gives no link for an empty or digit-less value', () => {
    expect(telHref('')).toBe('');
    expect(telHref('brak')).toBe('');
  });
});
