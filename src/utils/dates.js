import { SERVICE_DUE_DAYS } from '../constants/vehicle.js';

// All dates are 'YYYY-MM-DD' strings treated as LOCAL calendar dates.
// Never use new Date('YYYY-MM-DD'): it parses as UTC midnight and can shift the day.

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Returns a Date at local midnight, or null if the string is not a real calendar date.
export function parseDate(value) {
  const match = DATE_PATTERN.exec(value ?? '');
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  // Rejects dates like 2026-02-30 that JavaScript would roll over.
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
  return date;
}

export function isValidDate(value) {
  return parseDate(value) !== null;
}

export function toDateString(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// The ONE place that decides what "today" is. Pass `today` (Date or 'YYYY-MM-DD') to fix the date in tests.
export function getToday(today) {
  const base = typeof today === 'string' ? parseDate(today) : today || new Date();
  return new Date(base.getFullYear(), base.getMonth(), base.getDate());
}

// Whole days from today to the date (negative = in the past), or null for an invalid date.
export function daysUntil(value, today) {
  const date = parseDate(value);
  if (!date) return null;
  // Math.round absorbs the one-hour difference on daylight-saving changes.
  return Math.round((date - getToday(today)) / MS_PER_DAY);
}

// 'overdue' | 'dueSoon' | null — REQUIREMENTS §2.4. Retired vehicles never need service.
export function getServiceState(vehicle, today) {
  if (vehicle.status === 'Retired' || !vehicle.nextServiceDate) return null;
  const days = daysUntil(vehicle.nextServiceDate, today);
  if (days === null) return null;
  if (days < 0) return 'overdue';
  if (days <= SERVICE_DUE_DAYS) return 'dueSoon';
  return null;
}
