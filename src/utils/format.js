import { parseDate } from './dates.js';

const integerFormat = new Intl.NumberFormat('en-US');
const moneyFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

// 68450 -> "68,450 km"
export function formatKm(km) {
  return `${integerFormat.format(km)} km`;
}

// 98500 -> "SAR 98,500.00"
export function formatSAR(amount) {
  return `SAR ${moneyFormat.format(amount)}`;
}

// '2022-03-15' -> "15 Mar 2022"; empty or invalid -> "—"
export function formatDate(value) {
  const date = parseDate(value);
  return date ? dateFormat.format(date) : '—';
}

// (1, 'day') -> "1 day"; (3, 'day') -> "3 days"
export function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}
