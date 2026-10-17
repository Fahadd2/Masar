import { describe, expect, it } from 'vitest';
import seedVehicles from '../../data/seedVehicles.js';
import { filterVehicles, sortVehicles } from '../filterVehicles.js';

const plates = (vehicles) => vehicles.map((v) => v.plateNumber);

describe('filterVehicles', () => {
  it('returns everything with no search or filters', () => {
    expect(filterVehicles(seedVehicles)).toHaveLength(10);
    expect(filterVehicles(seedVehicles, { q: '   ', status: 'All', type: 'All' })).toHaveLength(10);
  });

  it('searches the model case-insensitively (AC-7.1)', () => {
    expect(plates(filterVehicles(seedVehicles, { q: 'hil' }))).toEqual(['KSA 4821']);
    expect(plates(filterVehicles(seedVehicles, { q: 'HILUX' }))).toEqual(['KSA 4821']);
  });

  it('searches the assigned driver (AC-7.2)', () => {
    expect(plates(filterVehicles(seedVehicles, { q: 'qahtani' }))).toEqual(['KSA 4821']);
  });

  it('searches the plate number (AC-7.3)', () => {
    expect(plates(filterVehicles(seedVehicles, { q: '4821' }))).toEqual(['KSA 4821']);
    expect(plates(filterVehicles(seedVehicles, { q: 'ksa 48' }))).toEqual(['KSA 4821']);
  });

  it('searches the make', () => {
    expect(filterVehicles(seedVehicles, { q: 'toyota' })).toHaveLength(4);
  });

  it('filters by status and by type', () => {
    expect(filterVehicles(seedVehicles, { status: 'In Use' })).toHaveLength(4);
    expect(filterVehicles(seedVehicles, { type: 'Pickup' })).toHaveLength(3);
    expect(filterVehicles(seedVehicles, { status: 'Retired' })).toHaveLength(1);
  });

  it('combines search and filters with AND logic (AC-7.4)', () => {
    expect(plates(filterVehicles(seedVehicles, { status: 'In Use', type: 'Pickup' }))).toEqual(['KSA 4821', 'HDA 2045']);
    expect(plates(filterVehicles(seedVehicles, { q: 'toyota', type: 'Van' }))).toEqual(['ZGU 6630']);
  });

  it('returns an empty list when nothing matches (AC-7.5)', () => {
    expect(filterVehicles(seedVehicles, { q: 'corolla', status: 'Retired', type: 'SUV' })).toEqual([]);
  });
});

describe('sortVehicles', () => {
  it('sorts by plate ascending and descending', () => {
    expect(plates(sortVehicles(seedVehicles, 'plateNumber', 'asc'))[0]).toBe('BVS 9081');
    expect(plates(sortVehicles(seedVehicles, 'plateNumber', 'desc'))[0]).toBe('ZGU 6630');
  });

  it('sorts numbers numerically', () => {
    expect(sortVehicles(seedVehicles, 'year', 'asc')[0].year).toBe(2018);
    expect(sortVehicles(seedVehicles, 'mileage', 'desc').map((v) => v.mileage).slice(0, 2)).toEqual([312600, 241800]);
    expect(sortVehicles(seedVehicles, 'mileage', 'asc')[0].mileage).toBe(18350);
  });

  it('sorts by next service date and keeps empty dates last in both directions', () => {
    const asc = plates(sortVehicles(seedVehicles, 'nextServiceDate', 'asc'));
    const desc = plates(sortVehicles(seedVehicles, 'nextServiceDate', 'desc'));
    expect(asc[0]).toBe('TXE 7712');
    expect(asc.at(-1)).toBe('NAJ 1198');
    expect(desc[0]).toBe('ELK 4417');
    expect(desc.at(-1)).toBe('NAJ 1198');
  });

  it('does not change the input array', () => {
    const before = plates(seedVehicles);
    sortVehicles(seedVehicles, 'mileage', 'desc');
    expect(plates(seedVehicles)).toEqual(before);
  });
});
