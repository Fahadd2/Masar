import seedVehicles from '../data/seedVehicles.js';
import { normalizeVehicle, validateVehicle } from '../utils/validateVehicle.js';

// The ONLY module that reads or changes vehicle data (DESIGN §6.2, contract in §6.3).
// Part 1 keeps the data in memory; Part 2 replaces these function bodies with fetch() calls.

// Small delay so loading states are visible; 0 under the test runner.
export const SIMULATED_LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 150;

export class ValidationError extends Error {
  constructor(fieldErrors) {
    super('The vehicle data is not valid.');
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export class NotFoundError extends Error {
  constructor(id) {
    super(`Vehicle ${id} was not found.`);
    this.name = 'NotFoundError';
    this.id = id;
  }
}

// Private, module-scoped state.
const vehicles = structuredClone(seedVehicles);
// Starts at (highest seed id + 1) and only ever increases, so ids are never reused.
let nextId = Math.max(0, ...vehicles.map((vehicle) => vehicle.id)) + 1;

// Runs `work` after the simulated delay and resolves with a copy of its result,
// so callers can never mutate stored data. Errors thrown by `work` reject the Promise.
function respond(work) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(structuredClone(work()));
      } catch (error) {
        reject(error);
      }
    }, SIMULATED_LATENCY_MS);
  });
}

// Returns the array index of the vehicle, or -1 (also for ids like "abc").
function indexOf(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return -1;
  return vehicles.findIndex((vehicle) => vehicle.id === numericId);
}

function throwIfInvalid(input, original) {
  const errors = validateVehicle(input, { vehicles, original });
  if (Object.keys(errors).length > 0) throw new ValidationError(errors);
}

export function getAll() {
  return respond(() => vehicles);
}

// Resolves null when the vehicle does not exist.
export function getById(id) {
  return respond(() => vehicles[indexOf(id)] ?? null);
}

export function create(input) {
  return respond(() => {
    throwIfInvalid(input, null);
    const vehicle = { id: nextId++, ...normalizeVehicle(input) };
    vehicles.push(vehicle);
    return vehicle;
  });
}

export function update(id, input) {
  return respond(() => {
    const index = indexOf(id);
    if (index === -1) throw new NotFoundError(id);
    const original = vehicles[index];
    throwIfInvalid(input, original);
    vehicles[index] = { id: original.id, ...normalizeVehicle(input) };
    return vehicles[index];
  });
}

export function remove(id) {
  return respond(() => {
    const index = indexOf(id);
    if (index === -1) throw new NotFoundError(id);
    vehicles.splice(index, 1); // nextId is not changed
  });
}

export function isPlateTaken(plate, excludeId) {
  const normalized = String(plate).trim().toUpperCase();
  return respond(() =>
    vehicles.some((vehicle) => vehicle.plateNumber === normalized && vehicle.id !== Number(excludeId)),
  );
}
