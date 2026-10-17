// Search, filter and sort — pure functions (DESIGN §6.2 rule 5).

// FR-29 – FR-31: case-insensitive substring search on plate, make, model and driver, AND-ed with filters.
export function filterVehicles(vehicles, { q = '', status = 'All', type = 'All' } = {}) {
  const query = q.trim().toLowerCase();
  return vehicles.filter((vehicle) => {
    if (status !== 'All' && vehicle.status !== status) return false;
    if (type !== 'All' && vehicle.type !== type) return false;
    if (!query) return true;
    return [vehicle.plateNumber, vehicle.make, vehicle.model, vehicle.assignedDriver].some((value) =>
      (value || '').toLowerCase().includes(query),
    );
  });
}

export const SORTABLE_COLUMNS = {
  plateNumber: 'Plate',
  make: 'Make',
  year: 'Year',
  mileage: 'Mileage',
  nextServiceDate: 'Next service',
};

const isEmpty = (value) => value === null || value === undefined || value === '';

// FR-10. Empty values (e.g. no next service date) always go last, in either direction.
export function sortVehicles(vehicles, sortBy = 'plateNumber', direction = 'asc') {
  const sign = direction === 'desc' ? -1 : 1;
  return [...vehicles].sort((a, b) => {
    const x = a[sortBy];
    const y = b[sortBy];
    if (isEmpty(x) || isEmpty(y)) return Number(isEmpty(x)) - Number(isEmpty(y));
    const result = typeof x === 'number' ? x - y : String(x).localeCompare(String(y));
    return result * sign;
  });
}
