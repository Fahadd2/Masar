import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROLES } from '../constants/vehicle.js';
import { renderApp } from '../test/renderApp.jsx';

// Plate links in the desktop table, in display order.
function tablePlates() {
  const table = screen.getByRole('table', { name: 'Vehicles' });
  return within(table)
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);
}

describe('Vehicle list: search and filter (US-7)', () => {
  it('searches as you type (AC-7.1 – AC-7.3)', async () => {
    const { user } = renderApp('/vehicles');
    await screen.findByText('Showing 10 of 10 vehicles');
    const search = screen.getByLabelText('Search vehicles');

    await user.type(search, 'hil');
    expect(tablePlates()).toEqual(['KSA 4821']);
    expect(screen.getByText('Showing 1 of 10 vehicles')).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'qahtani');
    expect(tablePlates()).toEqual(['KSA 4821']);
  });

  it('combines status and type filters (AC-7.4) and clears them (AC-7.6)', async () => {
    const { user } = renderApp('/vehicles');
    await screen.findByText('Showing 10 of 10 vehicles');

    await user.selectOptions(screen.getByLabelText('Status'), 'In Use');
    await user.selectOptions(screen.getByLabelText('Type'), 'Pickup');
    expect(tablePlates()).toEqual(['HDA 2045', 'KSA 4821']);

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByText('Showing 10 of 10 vehicles')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toHaveValue('All');
  });

  it('shows an empty state when nothing matches (AC-7.5)', async () => {
    const { user } = renderApp('/vehicles?q=corolla');
    expect(await screen.findByRole('heading', { name: 'No vehicles match your search' })).toBeInTheDocument();
    expect(screen.getByText('Nothing matches "corolla".')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear search and filters' }));
    expect(screen.getByText('Showing 10 of 10 vehicles')).toBeInTheDocument();
  });

  it('reads filters from the URL (FR-38)', async () => {
    renderApp('/vehicles?status=Retired');
    await screen.findByText('Showing 1 of 10 vehicles');
    expect(tablePlates()).toEqual(['NAJ 1198']);
  });

  it('sorts by clicking a column header (FR-10)', async () => {
    const { user } = renderApp('/vehicles');
    await screen.findByText('Showing 10 of 10 vehicles');
    await user.click(screen.getByRole('button', { name: /^Mileage/ }));
    expect(tablePlates()[0]).toBe('ELK 4417');
    await user.click(screen.getByRole('button', { name: /^Mileage/ }));
    expect(tablePlates()[0]).toBe('BVS 9081');
  });
});

describe('Dashboard (US-8)', () => {
  it('shows the AC-8.1 counts and the AC-8.2 service list', async () => {
    renderApp('/');
    expect(await screen.findByRole('link', { name: /Total vehicles\s*10/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^In Use\s*4/ })).toHaveAttribute('href', '/vehicles?status=In%20Use');
    expect(screen.getByText('5 vehicles need service within 30 days')).toBeInTheDocument();
    expect(screen.getByText('7 days overdue')).toBeInTheDocument();
    expect(document.title).toBe('Dashboard — Masar');
  });
});

describe('Roles (US-10)', () => {
  it('starts as Admin with all controls visible (AC-10.1)', async () => {
    renderApp('/vehicles');
    await screen.findByText('Showing 10 of 10 vehicles');
    expect(screen.getByRole('radio', { name: 'Admin' })).toBeChecked();
    expect(screen.getAllByRole('link', { name: /add vehicle/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'Delete KSA 4821' }).length).toBeGreaterThan(0);
  });

  it('Viewer sees no Add, Edit or Delete controls (AC-10.2)', async () => {
    const { user } = renderApp('/vehicles');
    await screen.findByText('Showing 10 of 10 vehicles');
    await user.click(screen.getByRole('radio', { name: 'Viewer' }));

    expect(screen.queryByRole('link', { name: /add vehicle/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^Edit/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Delete KSA/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'View KSA 4821' }).length).toBeGreaterThan(0);
  });

  it('Viewer sees Access denied on /vehicles/new (AC-10.4)', () => {
    renderApp('/vehicles/new', { role: ROLES.VIEWER });
    expect(screen.getByRole('heading', { level: 1, name: 'Access denied' })).toBeInTheDocument();
    expect(screen.getByText(/You need the Admin role to add or edit vehicles\./)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save vehicle' })).not.toBeInTheDocument();
    expect(document.title).toBe('Access denied — Masar');
  });

  it('switching to Viewer on the edit form replaces it with Access denied (FR-45)', async () => {
    const { user } = renderApp('/vehicles/1/edit');
    await screen.findByLabelText(/mileage/i);
    await user.click(screen.getByRole('radio', { name: 'Viewer' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Access denied' })).toBeInTheDocument();
  });
});

describe('Other pages', () => {
  it('shows the 404 page for an unknown route (FR-5)', () => {
    renderApp('/does-not-exist');
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByText('The page "/does-not-exist" does not exist.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to Dashboard' })).toHaveAttribute('href', '/');
  });

  it('About shows the team member name and student ID (FR-39)', () => {
    renderApp('/about');
    expect(screen.getByRole('cell', { name: 'Fahad Alharbi' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '222110987' })).toBeInTheDocument();
    expect(screen.getByText('Course: SE411')).toBeInTheDocument();
  });

  it('shows the vehicle details with formatted values (FR-13, FR-14)', async () => {
    renderApp('/vehicles/1');
    expect(await screen.findByText('SAR 98,500.00')).toBeInTheDocument();
    expect(screen.getByText('15 Mar 2022')).toBeInTheDocument();
    expect(screen.getByText('Abdullah Al-Qahtani')).toBeInTheDocument();
    expect(document.title).toBe('KSA 4821 — Masar');
  });

  it('shows "Vehicle not found" for an unknown id (FR-15)', async () => {
    renderApp('/vehicles/abc');
    expect(await screen.findByRole('heading', { level: 1, name: 'Vehicle not found' })).toBeInTheDocument();
  });

  it('the navbar shows the Masar logo and highlights the current page (FR-2, FR-47)', () => {
    renderApp('/about');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Masar' })).toHaveAttribute('href', '/');
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
  });
});
