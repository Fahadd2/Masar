import { describe, expect, it } from 'vitest';
import { daysUntil, getServiceState, getToday, isValidDate, parseDate, toDateString } from '../dates.js';

const TODAY = '2026-10-17';

describe('parseDate', () => {
  it('parses YYYY-MM-DD as a local calendar date (not UTC)', () => {
    const date = parseDate('2026-10-17');
    expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([2026, 9, 17, 0]);
  });

  it.each(['2026-02-30', '2026-13-01', '2026-2-3', '17/10/2026', '', null, undefined])('returns null for %s', (value) => {
    expect(parseDate(value)).toBeNull();
  });

  it('accepts 29 February only in leap years', () => {
    expect(isValidDate('2028-02-29')).toBe(true);
    expect(isValidDate('2027-02-29')).toBe(false);
  });
});

describe('toDateString', () => {
  it('formats a Date as zero-padded YYYY-MM-DD', () => {
    expect(toDateString(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('getToday', () => {
  it('uses the system date by default (fixed to 2026-10-17 in tests)', () => {
    expect(toDateString(getToday())).toBe('2026-10-17');
    expect(getToday().getHours()).toBe(0);
  });

  it('accepts an override as a string or a Date', () => {
    expect(toDateString(getToday('2025-01-31'))).toBe('2025-01-31');
    expect(toDateString(getToday(new Date(2024, 5, 1, 18, 30)))).toBe('2024-06-01');
  });
});

describe('daysUntil', () => {
  it('counts whole days from today', () => {
    expect(daysUntil('2026-10-10', TODAY)).toBe(-7);
    expect(daysUntil('2026-10-17', TODAY)).toBe(0);
    expect(daysUntil('2026-10-22', TODAY)).toBe(5);
    expect(daysUntil('2026-11-12', TODAY)).toBe(26);
  });

  it('works across a year boundary', () => {
    expect(daysUntil('2027-01-01', '2026-12-31')).toBe(1);
  });

  it('returns null for an invalid date', () => {
    expect(daysUntil('not a date', TODAY)).toBeNull();
  });
});

describe('getServiceState', () => {
  const vehicle = (nextServiceDate, status = 'In Use') => ({ nextServiceDate, status });

  it('is "overdue" before today', () => {
    expect(getServiceState(vehicle('2026-10-16'), TODAY)).toBe('overdue');
  });

  it('is "dueSoon" from today up to 30 days ahead', () => {
    expect(getServiceState(vehicle('2026-10-17'), TODAY)).toBe('dueSoon');
    expect(getServiceState(vehicle('2026-11-16'), TODAY)).toBe('dueSoon');
  });

  it('is null after 30 days', () => {
    expect(getServiceState(vehicle('2026-11-17'), TODAY)).toBeNull();
  });

  it('is null for Retired vehicles and missing dates', () => {
    expect(getServiceState(vehicle('2026-10-01', 'Retired'), TODAY)).toBeNull();
    expect(getServiceState(vehicle(null), TODAY)).toBeNull();
  });
});
