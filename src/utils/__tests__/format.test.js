import { describe, expect, it } from 'vitest';
import { formatDate, formatKm, formatSAR, plural } from '../format.js';

describe('format', () => {
  it('formatKm adds thousands separators and "km"', () => {
    expect(formatKm(68450)).toBe('68,450 km');
    expect(formatKm(0)).toBe('0 km');
  });

  it('formatSAR shows two decimals with the SAR prefix', () => {
    expect(formatSAR(98500)).toBe('SAR 98,500.00');
    expect(formatSAR(0.5)).toBe('SAR 0.50');
    expect(formatSAR(112000.5)).toBe('SAR 112,000.50');
  });

  it('formatDate shows "DD Mon YYYY"', () => {
    expect(formatDate('2022-03-15')).toBe('15 Mar 2022');
    expect(formatDate('2026-11-05')).toBe('05 Nov 2026');
  });

  it('formatDate shows a dash for empty or invalid dates', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate('')).toBe('—');
    expect(formatDate('2026-02-30')).toBe('—');
  });

  it('plural adds "s" except for 1', () => {
    expect(plural(1, 'day')).toBe('1 day');
    expect(plural(0, 'day')).toBe('0 days');
    expect(plural(7, 'vehicle')).toBe('7 vehicles');
  });
});
