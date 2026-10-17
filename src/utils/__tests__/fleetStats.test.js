import { describe, expect, it } from 'vitest';
import seedVehicles from '../../data/seedVehicles.js';
import { countByStatus, getServiceDueList } from '../fleetStats.js';

const TODAY = '2026-10-17';

describe('countByStatus', () => {
  it('matches AC-8.1 for the seed data', () => {
    expect(seedVehicles).toHaveLength(10);
    expect(countByStatus(seedVehicles)).toEqual({
      Available: 3,
      'In Use': 4,
      'Under Maintenance': 2,
      Retired: 1,
    });
  });

  it('includes statuses with zero vehicles', () => {
    expect(countByStatus([])).toEqual({ Available: 0, 'In Use': 0, 'Under Maintenance': 0, Retired: 0 });
  });
});

describe('getServiceDueList', () => {
  it('matches AC-8.2: 5 vehicles, earliest first, TXE 7712 overdue', () => {
    const list = getServiceDueList(seedVehicles, TODAY);
    expect(list.map((v) => [v.plateNumber, v.daysUntilService])).toEqual([
      ['TXE 7712', -7],
      ['DRT 5560', 5],
      ['LNB 3390', 11],
      ['KSA 4821', 19],
      ['ZGU 6630', 26],
    ]);
  });

  it('excludes Retired vehicles even when their date is in the window', () => {
    const retired = { ...seedVehicles[8], status: 'Retired', nextServiceDate: '2026-10-20' };
    expect(getServiceDueList([retired], TODAY)).toEqual([]);
  });

  it('uses the system date when no override is given', () => {
    expect(getServiceDueList(seedVehicles)).toHaveLength(5);
  });
});
