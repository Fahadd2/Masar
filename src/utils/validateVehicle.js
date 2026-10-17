import { DEPARTMENTS, PLATE_LETTERS, STATUSES, VEHICLE_TYPES } from '../constants/vehicle.js';
import { getToday, parseDate } from './dates.js';
import { formatKm } from './format.js';

// Validation rules from REQUIREMENTS §2.2, shared by the Add/Edit form and vehicleService.

export const PLATE_PATTERN = new RegExp(`^[${PLATE_LETTERS}]{3} [0-9]{4}$`);
const MAKE_PATTERN = /^[\p{L} -]+$/u;
const MODEL_PATTERN = /^[\p{L}\p{N} -]+$/u;
const DRIVER_PATTERN = /^[\p{L} '-]+$/u;
const WHOLE_NUMBER = /^\d+$/;
const PRICE_PATTERN = /^\d+(\.\d{1,2})?$/;

export const MAX_LENGTHS = { plateNumber: 8, make: 30, model: 30, assignedDriver: 50 };

// Empty values for the Add form. Status defaults to Available (V-ST-3).
export const EMPTY_VEHICLE = {
  plateNumber: '',
  make: '',
  model: '',
  year: '',
  type: '',
  assignedDriver: '',
  department: '',
  mileage: '',
  status: 'Available',
  purchaseDate: '',
  purchasePrice: '',
  nextServiceDate: '',
};

const text = (value) => String(value ?? '').trim();

// Converts a stored vehicle into form values (all strings).
export function toFormValues(vehicle) {
  const values = {};
  for (const field of Object.keys(EMPTY_VEHICLE)) {
    values[field] = vehicle[field] === null || vehicle[field] === undefined ? '' : String(vehicle[field]);
  }
  return values;
}

// Converts valid form values into the stored shape: trimmed text, upper-case plate, numbers, null date.
export function normalizeVehicle(values) {
  return {
    plateNumber: text(values.plateNumber).toUpperCase(),
    make: text(values.make),
    model: text(values.model),
    year: Number(values.year),
    type: values.type,
    assignedDriver: text(values.assignedDriver),
    department: values.department,
    mileage: Number(values.mileage),
    status: values.status,
    purchaseDate: text(values.purchaseDate),
    purchasePrice: Number(values.purchasePrice),
    nextServiceDate: text(values.nextServiceDate) || null,
  };
}

/**
 * Returns an object of { field: message } for every broken rule; empty when valid.
 * @param values   form values (strings) or a vehicle-like object
 * @param vehicles existing vehicles, for the unique plate rule (V-PL-4)
 * @param original the stored vehicle when editing (V-PL-4, V-MI-4)
 * @param today    optional fixed "today" for tests
 */
export function validateVehicle(values, { vehicles = [], original = null, today } = {}) {
  const errors = {};
  const now = getToday(today);
  const maxYear = now.getFullYear() + 1;

  const plate = text(values.plateNumber).toUpperCase();
  if (!plate) {
    errors.plateNumber = 'Plate number is required.';
  } else if (!PLATE_PATTERN.test(plate)) {
    errors.plateNumber = 'Plate number must look like ABD 1234, using only the letters A B D E G H J K L N R S T U V X Z.';
  } else if (vehicles.some((v) => v.plateNumber.toUpperCase() === plate && v.id !== original?.id)) {
    errors.plateNumber = `A vehicle with plate ${plate} already exists.`;
  }

  const make = text(values.make);
  if (!make) errors.make = 'Make is required.';
  else if (make.length < 2 || make.length > 30 || !MAKE_PATTERN.test(make)) errors.make = 'Make must be 2–30 letters.';

  const model = text(values.model);
  if (!model) errors.model = 'Model is required.';
  else if (model.length > 30) errors.model = 'Model must be at most 30 characters.';
  else if (!MODEL_PATTERN.test(model)) errors.model = 'Model may contain only letters, digits, spaces and hyphens.';

  const yearText = text(values.year);
  const year = Number(yearText);
  const yearIsValid = WHOLE_NUMBER.test(yearText) && year >= 1990 && year <= maxYear;
  if (!yearText) errors.year = 'Year is required.';
  else if (!yearIsValid) errors.year = `Year must be between 1990 and ${maxYear}.`;

  if (!VEHICLE_TYPES.includes(values.type)) errors.type = 'Select a vehicle type.';

  const status = values.status;
  if (!STATUSES.includes(status)) errors.status = 'Select a status.';

  const driver = text(values.assignedDriver);
  if (status === 'In Use' && !driver) {
    errors.assignedDriver = 'A vehicle that is In Use must have an assigned driver.';
  } else if (status === 'Retired' && driver) {
    errors.assignedDriver = 'A Retired vehicle cannot have an assigned driver.';
  } else if (driver && (driver.length < 3 || driver.length > 50 || !DRIVER_PATTERN.test(driver))) {
    errors.assignedDriver = 'Driver name must be 3–50 letters (spaces, hyphens and apostrophes allowed).';
  }

  if (!DEPARTMENTS.includes(values.department)) errors.department = 'Select a department.';

  const mileageText = text(values.mileage);
  const mileage = Number(mileageText);
  if (!mileageText) {
    errors.mileage = 'Mileage is required.';
  } else if (!WHOLE_NUMBER.test(mileageText) || mileage > 2000000) {
    errors.mileage = 'Mileage must be a whole number between 0 and 2,000,000 km.';
  } else if (original && mileage < original.mileage) {
    errors.mileage = `Mileage cannot be lower than the current ${formatKm(original.mileage)}.`;
  }

  const purchaseDateText = text(values.purchaseDate);
  const purchaseDate = parseDate(purchaseDateText);
  if (!purchaseDateText) {
    errors.purchaseDate = 'Purchase date is required.';
  } else if (!purchaseDate) {
    errors.purchaseDate = 'Enter a valid purchase date.';
  } else if (purchaseDate > now) {
    errors.purchaseDate = 'Purchase date cannot be in the future.';
  } else if (yearIsValid && purchaseDate < new Date(year - 1, 0, 1)) {
    errors.purchaseDate = `Purchase date cannot be before 1 January ${year - 1} for a ${year} model.`;
  }

  const priceText = text(values.purchasePrice);
  const price = Number(priceText);
  if (!priceText) {
    errors.purchasePrice = 'Purchase price is required.';
  } else if (!PRICE_PATTERN.test(priceText) || price <= 0 || price > 10000000) {
    errors.purchasePrice = 'Purchase price must be between 0.01 and 10,000,000 SAR, with at most 2 decimals.';
  }

  const serviceText = text(values.nextServiceDate);
  const serviceDate = parseDate(serviceText);
  if (!serviceText) {
    if (status !== 'Retired') errors.nextServiceDate = 'Next service date is required.';
  } else if (!serviceDate) {
    errors.nextServiceDate = 'Enter a valid next service date.';
  } else if (purchaseDate && serviceDate <= purchaseDate) {
    errors.nextServiceDate = 'Next service date must be after the purchase date.';
  }

  return errors;
}
