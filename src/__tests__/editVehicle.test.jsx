import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../test/renderApp.jsx';

describe('Edit vehicle (US-5)', () => {
  it('pre-fills the form and saves a change (AC-5.1, AC-5.2, AC-5.3)', async () => {
    const { user } = renderApp('/vehicles/1/edit');
    const mileage = await screen.findByLabelText(/mileage/i);

    expect(screen.getByRole('heading', { level: 1, name: 'Edit vehicle KSA 4821' })).toBeInTheDocument();
    expect(screen.getByText('Vehicle ID: 1')).toBeInTheDocument();
    expect(screen.getByLabelText(/plate number/i)).toHaveValue('KSA 4821');
    expect(mileage).toHaveValue(68450);

    await user.clear(mileage);
    await user.type(mileage, '69100');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText('Vehicle KSA 4821 updated.')).toBeInTheDocument();
    expect(await screen.findByText('69,100 km')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to vehicles/i })).toBeInTheDocument();
  });

  it('rejects a lower mileage (AC-5.5)', async () => {
    const { user } = renderApp('/vehicles/1/edit');
    const mileage = await screen.findByLabelText(/mileage/i);
    await user.clear(mileage);
    await user.type(mileage, '60000');
    await user.tab();
    expect(screen.getByText('Mileage cannot be lower than the current 68,450 km.')).toBeInTheDocument();
  });

  it("rejects another vehicle's plate (AC-5.4)", async () => {
    const { user } = renderApp('/vehicles/1/edit');
    const plate = await screen.findByLabelText(/plate number/i);
    await user.clear(plate);
    await user.type(plate, 'RJD 1507');
    await user.tab();
    expect(await screen.findByText('A vehicle with plate RJD 1507 already exists.')).toBeInTheDocument();
  });

  it('Cancel returns to the details page without saving (AC-5.6)', async () => {
    const { user } = renderApp('/vehicles/1/edit');
    const mileage = await screen.findByLabelText(/mileage/i);
    await user.clear(mileage);
    await user.type(mileage, '99999');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(await screen.findByText('68,450 km')).toBeInTheDocument();
  });

  it('clears and disables the driver when the status becomes Retired (V-DR-2)', async () => {
    const { user } = renderApp('/vehicles/1/edit');
    await user.selectOptions(await screen.findByLabelText(/^status/i), 'Retired');
    const driver = screen.getByLabelText(/assigned driver/i);
    expect(driver).toHaveValue('');
    expect(driver).toBeDisabled();
  });

  it('shows "Vehicle not found" for an unknown id', async () => {
    renderApp('/vehicles/999/edit');
    expect(await screen.findByRole('heading', { level: 1, name: 'Vehicle not found' })).toBeInTheDocument();
  });
});
