import { STATUSES } from '../constants/vehicle.js';
import { daysUntil, getServiceState } from './dates.js';

// FR-34: count per status, including statuses with zero vehicles.
export function countByStatus(vehicles) {
  const counts = Object.fromEntries(STATUSES.map((status) => [status, 0]));
  for (const vehicle of vehicles) counts[vehicle.status] += 1;
  return counts;
}

// FR-35: overdue or due within 30 days, Retired excluded, earliest date first.
export function getServiceDueList(vehicles, today) {
  return vehicles
    .filter((vehicle) => getServiceState(vehicle, today) !== null)
    .map((vehicle) => ({ ...vehicle, daysUntilService: daysUntil(vehicle.nextServiceDate, today) }))
    .sort((a, b) => a.daysUntilService - b.daysUntilService);
}
