import { describe, expect, it } from 'vitest';
import seedVehicles from '../../data/seedVehicles.js';
import { DEPARTMENTS, PLATE_LETTERS, VEHICLE_TYPES } from '../../constants/vehicle.js';
import { EMPTY_VEHICLE, normalizeVehicle, toFormValues, validateVehicle } from '../validateVehicle.js';

const TODAY = '2026-10-17';

// A valid "In Use" vehicle as form values; each test changes one thing.
function valid(overrides = {}) {
  return {
    plateNumber: 'ABD 1234',
    make: 'Kia',
    model: 'Sportage',
    year: '2025',
    type: 'SUV',
    assignedDriver: 'Omar Al-Zahrani',
    department: 'Sales',
    mileage: '1200',
    status: 'In Use',
    purchaseDate: '2025-02-10',
    purchasePrice: '112000.50',
    nextServiceDate: '2027-03-01',
    ...overrides,
  };
}

function errorsFor(overrides, context = {}) {
  return validateVehicle(valid(overrides), { today: TODAY, ...context });
}

const KSA_4821 = seedVehicles.find((v) => v.plateNumber === 'KSA 4821');

describe('validateVehicle', () => {
  it('returns no errors for a valid vehicle', () => {
    expect(errorsFor({})).toEqual({});
  });

  it('accepts every seed vehicle when editing it', () => {
    for (const vehicle of seedVehicles) {
      expect(validateVehicle(toFormValues(vehicle), { vehicles: seedVehicles, original: vehicle, today: TODAY })).toEqual({});
    }
  });

  it('reports every required field for an empty form', () => {
    const errors = validateVehicle(EMPTY_VEHICLE, { today: TODAY });
    expect(Object.keys(errors).sort()).toEqual(
      ['plateNumber', 'make', 'model', 'year', 'type', 'department', 'mileage', 'purchaseDate', 'purchasePrice', 'nextServiceDate'].sort(),
    );
  });

  describe('plateNumber', () => {
    it('V-PL-1: is required (spaces count as empty)', () => {
      expect(errorsFor({ plateNumber: '' }).plateNumber).toBe('Plate number is required.');
      expect(errorsFor({ plateNumber: '   ' }).plateNumber).toBe('Plate number is required.');
    });

    it('V-PL-2: is upper-cased before validation', () => {
      expect(errorsFor({ plateNumber: 'abd 1234' }).plateNumber).toBeUndefined();
      expect(errorsFor({ plateNumber: '  abd 1234  ' }).plateNumber).toBeUndefined();
    });

    it('V-PL-3: accepts all 17 Saudi plate letters', () => {
      expect(PLATE_LETTERS).toBe('ABDEGHJKLNRSTUVXZ');
      for (const letters of ['ABD', 'EGH', 'JKL', 'NRS', 'TUV', 'XZA']) {
        expect(errorsFor({ plateNumber: `${letters} 0001` }).plateNumber).toBeUndefined();
      }
    });

    it.each(['ABC 1234', 'ABQ 1234', 'ABI 1234', 'OAB 1234', 'AB 1234', 'ABDE 1234', 'ABD1234', 'ABD 123', 'ABD 12345', 'ABD-1234', '123 ABDE'])(
      'V-PL-3: rejects "%s"',
      (plateNumber) => {
        expect(errorsFor({ plateNumber }).plateNumber).toBe(
          'Plate number must look like ABD 1234, using only the letters A B D E G H J K L N R S T U V X Z.',
        );
      },
    );

    it('V-PL-4: rejects a duplicate plate when adding (case-insensitive)', () => {
      expect(errorsFor({ plateNumber: 'ksa 4821' }, { vehicles: seedVehicles }).plateNumber).toBe(
        'A vehicle with plate KSA 4821 already exists.',
      );
    });

    it("V-PL-4: allows a vehicle's own plate when editing it", () => {
      expect(errorsFor({ plateNumber: 'KSA 4821', mileage: '70000' }, { vehicles: seedVehicles, original: KSA_4821 }).plateNumber).toBeUndefined();
    });

    it("V-PL-4: rejects another vehicle's plate when editing", () => {
      expect(errorsFor({ plateNumber: 'RJD 1507', mileage: '70000' }, { vehicles: seedVehicles, original: KSA_4821 }).plateNumber).toBe(
        'A vehicle with plate RJD 1507 already exists.',
      );
    });
  });

  describe('make', () => {
    it('V-MK-1: is required', () => {
      expect(errorsFor({ make: '' }).make).toBe('Make is required.');
    });

    it.each(['K', 'A'.repeat(31), 'K1a', 'Kia!'])('V-MK-2/3: rejects "%s"', (make) => {
      expect(errorsFor({ make }).make).toBe('Make must be 2–30 letters.');
    });

    it.each(['Ki', 'Mercedes-Benz', 'Land Rover', 'تويوتا', 'A'.repeat(30)])('accepts "%s"', (make) => {
      expect(errorsFor({ make }).make).toBeUndefined();
    });
  });

  describe('model', () => {
    it('V-MD-1: is required', () => {
      expect(errorsFor({ model: '' }).model).toBe('Model is required.');
    });

    it('V-MD-2: is at most 30 characters', () => {
      expect(errorsFor({ model: 'M'.repeat(31) }).model).toBe('Model must be at most 30 characters.');
      expect(errorsFor({ model: 'M'.repeat(30) }).model).toBeUndefined();
    });

    it('V-MD-3: allows letters, digits, spaces and hyphens only', () => {
      for (const model of ['F-150', 'D-Max', 'Land Cruiser', 'X5']) {
        expect(errorsFor({ model }).model).toBeUndefined();
      }
      expect(errorsFor({ model: 'Model@1' }).model).toBe('Model may contain only letters, digits, spaces and hyphens.');
    });
  });

  describe('year', () => {
    it('V-YR-1: is required', () => {
      expect(errorsFor({ year: '' }).year).toBe('Year is required.');
    });

    it.each(['1989', '2028', '2025.5', 'abc', '-2020'])('V-YR-2/3: rejects %s (range 1990 – current year + 1)', (year) => {
      expect(errorsFor({ year }).year).toBe('Year must be between 1990 and 2027.');
    });

    it('V-YR-3: accepts the range limits', () => {
      expect(errorsFor({ year: '1990', purchaseDate: '1990-05-01' }).year).toBeUndefined();
      expect(errorsFor({ year: '2027' }).year).toBeUndefined();
    });
  });

  describe('type', () => {
    it('V-TY-1/2: must be one of the vehicle types', () => {
      expect(errorsFor({ type: '' }).type).toBe('Select a vehicle type.');
      expect(errorsFor({ type: 'Bus' }).type).toBe('Select a vehicle type.');
      for (const type of VEHICLE_TYPES) expect(errorsFor({ type }).type).toBeUndefined();
    });
  });

  describe('assignedDriver', () => {
    it('V-DR-1: is required when the status is In Use', () => {
      expect(errorsFor({ status: 'In Use', assignedDriver: '' }).assignedDriver).toBe(
        'A vehicle that is In Use must have an assigned driver.',
      );
    });

    it('is optional for Available and Under Maintenance', () => {
      expect(errorsFor({ status: 'Available', assignedDriver: '' }).assignedDriver).toBeUndefined();
      expect(errorsFor({ status: 'Under Maintenance', assignedDriver: '' }).assignedDriver).toBeUndefined();
    });

    it('V-DR-2: must be empty when the status is Retired', () => {
      expect(errorsFor({ status: 'Retired', assignedDriver: 'Ali Saleh' }).assignedDriver).toBe(
        'A Retired vehicle cannot have an assigned driver.',
      );
      expect(errorsFor({ status: 'Retired', assignedDriver: '' }).assignedDriver).toBeUndefined();
    });

    it.each(['Al', 'A'.repeat(51), 'Ali2', 'Ali@Saleh'])('V-DR-3: rejects "%s"', (assignedDriver) => {
      expect(errorsFor({ assignedDriver }).assignedDriver).toBe(
        'Driver name must be 3–50 letters (spaces, hyphens and apostrophes allowed).',
      );
    });

    it.each(["O'Neil", 'Abdullah Al-Qahtani', 'عبدالله القحطاني'])('V-DR-3: accepts "%s"', (assignedDriver) => {
      expect(errorsFor({ assignedDriver }).assignedDriver).toBeUndefined();
    });
  });

  describe('department', () => {
    it('V-DP-1/2: must be one of the departments', () => {
      expect(errorsFor({ department: '' }).department).toBe('Select a department.');
      expect(errorsFor({ department: 'HR' }).department).toBe('Select a department.');
      for (const department of DEPARTMENTS) expect(errorsFor({ department }).department).toBeUndefined();
    });
  });

  describe('mileage', () => {
    it('V-MI-1: is required', () => {
      expect(errorsFor({ mileage: '' }).mileage).toBe('Mileage is required.');
    });

    it.each(['-5', '1.5', '2000001', 'abc'])('V-MI-2/3: rejects %s', (mileage) => {
      expect(errorsFor({ mileage }).mileage).toBe('Mileage must be a whole number between 0 and 2,000,000 km.');
    });

    it('V-MI-3: accepts 0 and 2,000,000', () => {
      expect(errorsFor({ mileage: '0' }).mileage).toBeUndefined();
      expect(errorsFor({ mileage: '2000000' }).mileage).toBeUndefined();
    });

    it('V-MI-4: may not decrease when editing', () => {
      const context = { vehicles: seedVehicles, original: KSA_4821 };
      expect(errorsFor({ plateNumber: 'KSA 4821', mileage: '68449' }, context).mileage).toBe(
        'Mileage cannot be lower than the current 68,450 km.',
      );
      expect(errorsFor({ plateNumber: 'KSA 4821', mileage: '68450' }, context).mileage).toBeUndefined();
    });

    it('V-MI-4: does not apply when adding', () => {
      expect(errorsFor({ mileage: '0' }, { vehicles: seedVehicles }).mileage).toBeUndefined();
    });
  });

  describe('status', () => {
    it('V-ST-1/2: must be one of the statuses', () => {
      expect(errorsFor({ status: '' }).status).toBe('Select a status.');
      expect(errorsFor({ status: 'Lost' }).status).toBe('Select a status.');
    });

    it('V-ST-3: the Add form defaults to Available', () => {
      expect(EMPTY_VEHICLE.status).toBe('Available');
    });
  });

  describe('purchaseDate', () => {
    it('V-PD-1: is required', () => {
      expect(errorsFor({ purchaseDate: '' }).purchaseDate).toBe('Purchase date is required.');
    });

    it('V-PD-2: must be a real calendar date', () => {
      expect(errorsFor({ purchaseDate: '2025-02-30' }).purchaseDate).toBe('Enter a valid purchase date.');
      expect(errorsFor({ purchaseDate: '10/02/2025' }).purchaseDate).toBe('Enter a valid purchase date.');
    });

    it('V-PD-3: may be today but not in the future', () => {
      expect(errorsFor({ purchaseDate: '2026-10-17', nextServiceDate: '2027-01-01' }).purchaseDate).toBeUndefined();
      expect(errorsFor({ purchaseDate: '2026-10-18' }).purchaseDate).toBe('Purchase date cannot be in the future.');
    });

    it('V-PD-4: may not be before 1 January of (year − 1)', () => {
      expect(errorsFor({ year: '2025', purchaseDate: '2023-12-31' }).purchaseDate).toBe(
        'Purchase date cannot be before 1 January 2024 for a 2025 model.',
      );
      expect(errorsFor({ year: '2025', purchaseDate: '2024-01-01' }).purchaseDate).toBeUndefined();
    });
  });

  describe('purchasePrice', () => {
    it('V-PP-1: is required', () => {
      expect(errorsFor({ purchasePrice: '' }).purchasePrice).toBe('Purchase price is required.');
    });

    it.each(['0', '-1', '10000000.01', '1.234', 'abc'])('V-PP-2/3: rejects %s', (purchasePrice) => {
      expect(errorsFor({ purchasePrice }).purchasePrice).toBe(
        'Purchase price must be between 0.01 and 10,000,000 SAR, with at most 2 decimals.',
      );
    });

    it.each(['0.01', '95000.5', '10000000'])('accepts %s', (purchasePrice) => {
      expect(errorsFor({ purchasePrice }).purchasePrice).toBeUndefined();
    });
  });

  describe('nextServiceDate', () => {
    it('V-NS-1: is required unless the vehicle is Retired', () => {
      expect(errorsFor({ nextServiceDate: '' }).nextServiceDate).toBe('Next service date is required.');
      expect(errorsFor({ status: 'Retired', assignedDriver: '', nextServiceDate: '' })).toEqual({});
    });

    it('V-NS-2: must be a real calendar date', () => {
      expect(errorsFor({ nextServiceDate: '2027-13-01' }).nextServiceDate).toBe('Enter a valid next service date.');
    });

    it('V-NS-3: must be after the purchase date', () => {
      expect(errorsFor({ nextServiceDate: '2025-02-10' }).nextServiceDate).toBe(
        'Next service date must be after the purchase date.',
      );
      expect(errorsFor({ nextServiceDate: '2025-01-01' }).nextServiceDate).toBe(
        'Next service date must be after the purchase date.',
      );
    });

    it('V-NS-4: may be in the past (overdue)', () => {
      expect(errorsFor({ nextServiceDate: '2025-06-01' }).nextServiceDate).toBeUndefined();
    });
  });
});

describe('normalizeVehicle and toFormValues', () => {
  it('trims text, upper-cases the plate, converts numbers and empty service date to null', () => {
    const vehicle = normalizeVehicle(valid({ plateNumber: ' abd 1234 ', make: ' Kia ', nextServiceDate: '' }));
    expect(vehicle).toMatchObject({ plateNumber: 'ABD 1234', make: 'Kia', year: 2025, mileage: 1200, purchasePrice: 112000.5 });
    expect(vehicle.nextServiceDate).toBeNull();
  });

  it('ignores unknown fields such as id', () => {
    expect(normalizeVehicle({ ...valid(), id: 99, extra: 'x' })).not.toHaveProperty('id');
  });

  it('converts a stored vehicle to string form values', () => {
    const retired = seedVehicles.find((v) => v.status === 'Retired');
    expect(toFormValues(retired)).toMatchObject({ year: '2018', mileage: '241800', nextServiceDate: '' });
  });
});
