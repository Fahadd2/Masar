import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../test/renderApp.jsx';

// Fills the Add form with valid values; `overrides` replaces single fields.
async function fillForm(user, overrides = {}) {
  const values = {
    plateNumber: 'abd 1234',
    make: 'Kia',
    model: 'Sportage',
    year: '2025',
    mileage: '1200',
    purchasePrice: '112000.50',
    assignedDriver: 'Omar Al-Zahrani',
    ...overrides,
  };
  await user.type(screen.getByLabelText(/plate number/i), values.plateNumber);
  await user.type(screen.getByLabelText(/^make/i), values.make);
  await user.type(screen.getByLabelText(/^model/i), values.model);
  await user.type(screen.getByLabelText(/^year/i), values.year);
  await user.selectOptions(screen.getByLabelText(/^type/i), 'SUV');
  await user.selectOptions(screen.getByLabelText(/^status/i), 'In Use');
  await user.selectOptions(screen.getByLabelText(/^department/i), 'Sales');
  await user.type(screen.getByLabelText(/assigned driver/i), values.assignedDriver);
  await user.type(screen.getByLabelText(/mileage/i), values.mileage);
  fireEvent.change(screen.getByLabelText(/next service date/i), { target: { value: '2027-03-01' } });
  fireEvent.change(screen.getByLabelText(/^purchase date/i), { target: { value: '2025-02-10' } });
  await user.type(screen.getByLabelText(/purchase price/i), values.purchasePrice);
}

describe('Add vehicle (US-4)', () => {
  it('adds a vehicle, shows a toast and opens its details page (AC-4.1, AC-4.7)', async () => {
    const { user } = renderApp('/vehicles/new');
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Save vehicle' }));

    expect(await screen.findByRole('heading', { level: 1, name: /ABD 1234/ })).toBeInTheDocument();
    expect(screen.getByText('Vehicle ABD 1234 added.')).toBeInTheDocument();
    expect(screen.getByText('Vehicle ID: 11')).toBeInTheDocument();
    expect(screen.getByText('SAR 112,000.50')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /back to vehicles/i }));
    expect(await screen.findByText('Showing 11 of 11 vehicles')).toBeInTheDocument();
  });

  it('shows a focused error summary on an empty submit and saves nothing (FR-18)', async () => {
    const { user } = renderApp('/vehicles/new');
    await user.click(screen.getByRole('button', { name: 'Save vehicle' }));

    const summary = screen.getByText('Please fix 10 errors before saving:').parentElement;
    expect(summary).toHaveFocus();
    expect(within(summary).getByRole('link', { name: 'Plate number is required.' })).toBeInTheDocument();
    expect(screen.getByLabelText(/plate number/i)).toHaveAttribute('aria-invalid', 'true');

    // Each summary link moves focus to its field.
    await user.click(within(summary).getByRole('link', { name: 'Make is required.' }));
    expect(screen.getByLabelText(/^make/i)).toHaveFocus();
  });

  it('rejects a plate with a non-Saudi letter (AC-4.2) and a duplicate plate (AC-4.3)', async () => {
    const { user } = renderApp('/vehicles/new');
    const plate = screen.getByLabelText(/plate number/i);

    await user.type(plate, 'abc 1234');
    await user.tab();
    expect(
      screen.getAllByText(/Plate number must look like ABD 1234, using only the letters A B D E G H J K L N R S T U V X Z\./),
    ).not.toHaveLength(0);

    await user.clear(plate);
    await user.type(plate, 'ksa 4821');
    expect(await screen.findByText('A vehicle with plate KSA 4821 already exists.')).toBeInTheDocument();
  });

  it('requires a driver when the status is In Use (AC-4.4)', async () => {
    const { user } = renderApp('/vehicles/new');
    await fillForm(user, { assignedDriver: ' ' });
    await user.clear(screen.getByLabelText(/assigned driver/i));
    await user.click(screen.getByRole('button', { name: 'Save vehicle' }));
    expect(screen.getAllByText('A vehicle that is In Use must have an assigned driver.')).toHaveLength(2);
  });

  it('exposes required fields to assistive technology (NFR-2)', async () => {
    const { user } = renderApp('/vehicles/new');
    expect(screen.getByLabelText(/plate number/i)).toHaveAttribute('aria-required', 'true');
    const driver = screen.getByLabelText(/assigned driver/i);
    expect(driver).not.toHaveAttribute('aria-required');
    await user.selectOptions(screen.getByLabelText(/^status/i), 'In Use');
    expect(driver).toHaveAttribute('aria-required', 'true');
  });

  it('Cancel returns to the list without adding (AC-4.6)', async () => {
    const { user } = renderApp('/vehicles/new');
    await user.type(screen.getByLabelText(/plate number/i), 'ABD 1234');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(await screen.findByText('Showing 10 of 10 vehicles')).toBeInTheDocument();
  });
});
