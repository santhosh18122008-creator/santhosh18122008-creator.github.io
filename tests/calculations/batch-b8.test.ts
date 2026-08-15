import { describe, it, expect } from 'vitest';
import { convertCurrency } from '../../src/lib/calculations/currency';
import { generateCitation } from '../../src/lib/utilities/citation';

describe('convertCurrency', () => {
  const rates = { EUR: 0.9, GBP: 0.8, JPY: 150 };
  it('100 USD to EUR = 90', () => {
    expect(convertCurrency(100, 'USD', 'EUR', rates).value).toBe(90);
  });
  it('90 EUR to USD = 100', () => {
    expect(convertCurrency(90, 'EUR', 'USD', rates).value).toBe(100);
  });
  it('EUR to GBP = cross rate', () => {
    expect(convertCurrency(100, 'EUR', 'GBP', rates).value).toBeCloseTo(88.88, 1);
  });
  it('blocks negative', () => { expect(convertCurrency(-10, 'USD', 'EUR', rates).success).toBe(false); });
});

describe('generateCitation', () => {
  it('APA Book formats correctly', () => {
    const r = generateCitation('Smith, J.', 'The Book', '2020', 'Penguin', '', 'apa', 'book');
    expect(r).toContain('*The Book*');
    expect(r).toContain('(2020)');
  });
  it('MLA Website formats correctly', () => {
    const r = generateCitation('Doe, J.', 'Article', '2023', 'NYT', 'nyt.com', 'mla', 'website');
    expect(r).toContain('"Article."');
    expect(r).toContain('nyt.com');
  });
});
