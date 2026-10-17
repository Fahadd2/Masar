import { beforeEach, describe, expect, it, vi } from 'vitest';

// A fresh copy of the module (and its in-memory data) for every test.
let service;
beforeEach(async () => {
  vi.resetModules();
  service = await import('../vehicleService.js');
});

const newVehicle = (overrides = {}) => ({
  plateNumber: 'abd 1234',
  make: ' Kia ',
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
});

describe('vehicleService', () => {
  it('has no simulated latency under the test runner', () => {
    expect(service.SIMULATED_LATENCY_MS).toBe(0);
  });

  describe('getAll', () => {
    it('resolves the 10 seed vehicles', async () => {
      const vehicles = await service.getAll();
      expect(vehicles).toHaveLength(10);
      expect(vehicles.map((v) => v.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('returns copies, so changing the result does not change stored data', async () => {
      const first = await service.getAll();
      first[0].plateNumber = 'CHANGED';
      first.pop();
      const second = await service.getAll();
      expect(second).toHaveLength(10);
      expect(second[0].plateNumber).toBe('KSA 4821');
    });
  });

  describe('getById', () => {
    it('finds a vehicle by numeric or string id', async () => {
      expect((await service.getById(1)).plateNumber).toBe('KSA 4821');
      expect((await service.getById('3')).plateNumber).toBe('LNB 3390');
    });

    it('resolves null for unknown or non-numeric ids', async () => {
      expect(await service.getById(999)).toBeNull();
      expect(await service.getById('abc')).toBeNull();
      expect(await service.getById('1.5')).toBeNull();
    });

    it('returns a copy', async () => {
      const vehicle = await service.getById(1);
      vehicle.mileage = 0;
      expect((await service.getById(1)).mileage).toBe(68450);
    });
  });

  describe('create', () => {
    it('stores a normalised vehicle with id 11', async () => {
      const created = await service.create(newVehicle());
      expect(created).toMatchObject({ id: 11, plateNumber: 'ABD 1234', make: 'Kia', year: 2025, purchasePrice: 112000.5 });
      expect(await service.getAll()).toHaveLength(11);
      expect((await service.getById(11)).plateNumber).toBe('ABD 1234');
    });

    it('returns a copy of the stored vehicle', async () => {
      const created = await service.create(newVehicle());
      created.make = 'Changed';
      expect((await service.getById(created.id)).make).toBe('Kia');
    });

    it('ignores an id supplied by the caller', async () => {
      const created = await service.create({ ...newVehicle(), id: 1 });
      expect(created.id).toBe(11);
    });

    it('rejects invalid data with ValidationError and stores nothing', async () => {
      const error = await service.create(newVehicle({ plateNumber: 'ABC 1234', mileage: '' })).catch((e) => e);
      expect(error).toBeInstanceOf(service.ValidationError);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ValidationError');
      expect(Object.keys(error.fieldErrors)).toEqual(['plateNumber', 'mileage']);
      expect(await service.getAll()).toHaveLength(10);
    });

    it('rejects a duplicate plate', async () => {
      const error = await service.create(newVehicle({ plateNumber: 'ksa 4821' })).catch((e) => e);
      expect(error.fieldErrors.plateNumber).toBe('A vehicle with plate KSA 4821 already exists.');
    });
  });

  describe('nextId (AC-4.7)', () => {
    it('never reuses an id after a delete', async () => {
      expect((await service.create(newVehicle())).id).toBe(11);
      await service.remove(11);
      expect((await service.create(newVehicle())).id).toBe(12);
    });

    it('does not reuse the highest seed id', async () => {
      await service.remove(10);
      expect((await service.create(newVehicle())).id).toBe(11);
    });
  });

  describe('update', () => {
    it('replaces the fields and keeps the id', async () => {
      const original = await service.getById(1);
      const updated = await service.update(1, { ...original, id: 50, mileage: '69100', assignedDriver: 'Sami Al-Harbi' });
      expect(updated).toMatchObject({ id: 1, mileage: 69100, assignedDriver: 'Sami Al-Harbi' });
      expect((await service.getById(1)).mileage).toBe(69100);
      expect(await service.getById(50)).toBeNull();
    });

    it('rejects a mileage decrease with ValidationError', async () => {
      const original = await service.getById(1);
      const error = await service.update(1, { ...original, mileage: 100 }).catch((e) => e);
      expect(error).toBeInstanceOf(service.ValidationError);
      expect(error.fieldErrors.mileage).toBe('Mileage cannot be lower than the current 68,450 km.');
      expect((await service.getById(1)).mileage).toBe(68450);
    });

    it('rejects an unknown id with NotFoundError', async () => {
      const error = await service.update(999, newVehicle()).catch((e) => e);
      expect(error).toBeInstanceOf(service.NotFoundError);
      expect(error.name).toBe('NotFoundError');
      expect(error.id).toBe(999);
    });
  });

  describe('remove', () => {
    it('deletes the vehicle', async () => {
      await service.remove(3);
      expect(await service.getById(3)).toBeNull();
      expect(await service.getAll()).toHaveLength(9);
    });

    it('rejects an unknown id with NotFoundError', async () => {
      await expect(service.remove(999)).rejects.toBeInstanceOf(service.NotFoundError);
      await service.remove(3);
      await expect(service.remove(3)).rejects.toThrow('Vehicle 3 was not found.');
    });
  });

  describe('isPlateTaken', () => {
    it('checks plates case-insensitively, optionally excluding one vehicle', async () => {
      expect(await service.isPlateTaken('ksa 4821')).toBe(true);
      expect(await service.isPlateTaken('KSA 4821', 1)).toBe(false);
      expect(await service.isPlateTaken('ABD 1234')).toBe(false);
    });
  });
});
