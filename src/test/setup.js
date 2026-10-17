import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { resetVehicleData } from '../services/vehicleService.js';

beforeEach(() => {
  // Every test runs on 2026-10-17 (local noon), the date the seed data and acceptance criteria use,
  // so tests never break as the real date changes. Only Date is mocked; timers stay real.
  vi.setSystemTime(new Date(2026, 9, 17, 12, 0, 0));
  // Every test starts from the 10 seed vehicles.
  resetVehicleData();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

// jsdom does not implement <dialog>.
HTMLDialogElement.prototype.showModal = function showModal() {
  this.open = true;
};
HTMLDialogElement.prototype.close = function close() {
  this.open = false;
  this.dispatchEvent(new Event('close'));
};

// jsdom does not implement scrolling.
window.scrollTo = () => {};
