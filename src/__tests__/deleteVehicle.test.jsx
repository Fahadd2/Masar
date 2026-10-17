import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import * as vehicleService from '../services/vehicleService.js';
import { renderApp } from '../test/renderApp.jsx';

// The list renders a table and (hidden by CSS on desktop) mobile cards, so names appear twice.
const firstDeleteButton = (plate) => screen.getAllByRole('button', { name: `Delete ${plate}` })[0];

describe('Delete vehicle (US-6)', () => {
  it('Cancel closes the dialog and keeps the vehicle (AC-6.1, AC-6.2)', async () => {
    const { user } = renderApp('/vehicles');
    await screen.findByText('Showing 10 of 10 vehicles');

    await user.click(firstDeleteButton('KSA 4821'));
    const dialog = screen.getByRole('dialog', { name: 'Delete vehicle?' });
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveTextContent('Delete vehicle KSA 4821 — Toyota Hilux? This cannot be undone.');
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus();

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(dialog).not.toHaveAttribute('open');
    expect(screen.getByText('Showing 10 of 10 vehicles')).toBeInTheDocument();
  });

  it('confirming removes the vehicle from the list (AC-6.3)', async () => {
    const { user } = renderApp('/vehicles');
    await screen.findByText('Showing 10 of 10 vehicles');

    await user.click(firstDeleteButton('KSA 4821'));
    const dialog = screen.getByRole('dialog', { name: 'Delete vehicle?' });
    await user.click(within(dialog).getByRole('button', { name: 'Delete vehicle' }));

    expect(await screen.findByText('Vehicle KSA 4821 deleted.')).toBeInTheDocument();
    expect(await screen.findByText('Showing 9 of 9 vehicles')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'KSA 4821' })).not.toBeInTheDocument();
  });

  it('reports a vehicle that was already deleted', async () => {
    const { user } = renderApp('/vehicles');
    await screen.findByText('Showing 10 of 10 vehicles');
    await user.click(firstDeleteButton('KSA 4821'));
    await vehicleService.remove(1); // deleted elsewhere while the dialog is open

    await user.click(screen.getByRole('button', { name: 'Delete vehicle' }));
    expect(await screen.findByText('Vehicle KSA 4821 no longer exists.')).toBeInTheDocument();
    expect(await screen.findByText('Showing 9 of 9 vehicles')).toBeInTheDocument();
  });

  it('closes the dialog when the role switches to Viewer (DESIGN §7.3)', async () => {
    const { user } = renderApp('/vehicles');
    await screen.findByText('Showing 10 of 10 vehicles');
    await user.click(firstDeleteButton('KSA 4821'));
    const dialog = screen.getByRole('dialog', { name: 'Delete vehicle?' });

    await user.click(screen.getByRole('radio', { name: 'Viewer' }));
    expect(dialog).not.toHaveAttribute('open');

    // Switching back does not reopen it.
    await user.click(screen.getByRole('radio', { name: 'Admin' }));
    expect(dialog).not.toHaveAttribute('open');
  });

  it('deleting from the details page returns to the list (AC-6.4)', async () => {
    const { user } = renderApp('/vehicles/3');
    await user.click(await screen.findByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Delete vehicle' }));

    expect(await screen.findByText('Vehicle LNB 3390 deleted.')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 1, name: 'Vehicles' })).toBeInTheDocument();
    expect(await screen.findByText('Showing 9 of 9 vehicles')).toBeInTheDocument();
  });
});
