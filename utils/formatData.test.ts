import { describe, test, expect } from 'vitest';
import { formatCurrencyAmount, formatUpperSnakeCaseToTitleString, extractTime, extractDate } from './formatData';

describe('formatCurrencyAmount', () => {
  test('formats currency correctly', () => {
    expect(formatCurrencyAmount({ currency: 'USD', minorUnits: 12345 })).toBe('US$123.45');
    expect(formatCurrencyAmount({ currency: 'CAD', minorUnits: 12345 })).toBe('CA$123.45');
    expect(formatCurrencyAmount({ currency: 'GBP', minorUnits: 50001 })).toBe('£500.01');
    expect(formatCurrencyAmount({ currency: 'EUR', minorUnits: 1999 })).toBe('€19.99');
  });
});

describe('formatUpperSnakeCaseToTitleString', () => {
  test('converts UPPER_SNAKE_CASE to Title Case', () => {
    expect(formatUpperSnakeCaseToTitleString('HELLO')).toBe('Hello')
    expect(formatUpperSnakeCaseToTitleString('HELLO_WORLD')).toBe('Hello World');
    expect(formatUpperSnakeCaseToTitleString('TEST_CASE_EXAMPLE')).toBe('Test Case Example');
  });

  test('returns empty string for empty input', () => {
    expect(formatUpperSnakeCaseToTitleString('')).toBe('');
  });
});

describe('extractTime', () => {
  test('extracts time from ISO string', () => {
    const isoString = '2025-03-18T15:30:00Z';
    const formattedTime = extractTime(isoString);
    expect(formattedTime).toBe('15:30');
  });

  test('returns empty string for empty input', () => {
    expect(extractTime('')).toBe('');
  });

  test('handles invalid date input', () => {
    expect(extractTime('awrowijr')).toBe('Invalid Date');
  });
});

describe('extractDate', () => {
  test('extracts date from ISO string', () => {
    const isoString = '2025-03-18T15:30:00Z';
    const formattedDate = extractDate(isoString);
    expect(formattedDate).toBe('Tuesday 18 March');
  });

  test('returns empty string for empty input', () => {
    expect(extractTime('')).toBe('');
  });

  test('handles invalid date input', () => {
    expect(extractTime('awrowijr')).toBe('Invalid Date');
  });
})
