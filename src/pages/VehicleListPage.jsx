import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { STATUSES, VEHICLE_TYPES } from '../constants/vehicle.js';
import { useRole } from '../context/RoleContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useVehicles } from '../hooks/useVehicles.js';
import * as vehicleService from '../services/vehicleService.js';
import { filterVehicles, sortVehicles } from '../utils/filterVehicles.js';
import Button from '../components/common/Button.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import DeleteMessage from '../components/vehicles/DeleteMessage.jsx';
import FilterBar from '../components/vehicles/FilterBar.jsx';
import SearchBar from '../components/vehicles/SearchBar.jsx';
import VehicleTable from '../components/vehicles/VehicleTable.jsx';

export default function VehicleListPage() {
  useDocumentTitle('Vehicles');
  const { isAdmin } = useRole();
  const { vehicles, loading, error, reload } = useVehicles();
  const [sort, setSort] = useState({ by: 'plateNumber', direction: 'asc' });
  const { notify } = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Close the dialog if the role switches to Viewer while it is open (DESIGN §7.3).
  if (!isAdmin && deleteTarget) setDeleteTarget(null);

  async function confirmDelete() {
    setDeleting(true);
    try {
      await vehicleService.remove(deleteTarget.id);
      notify({ message: `Vehicle ${deleteTarget.plateNumber} deleted.` });
    } catch {
      notify({ type: 'error', message: `Vehicle ${deleteTarget.plateNumber} no longer exists.` });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
      reload();
    }
  }

  // Search and filters live in the URL (?q=&status=&type=) so dashboard links and back/forward work.
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const status = STATUSES.includes(searchParams.get('status')) ? searchParams.get('status') : 'All';
  const type = VEHICLE_TYPES.includes(searchParams.get('type')) ? searchParams.get('type') : 'All';
  const hasActiveFilters = q !== '' || status !== 'All' || type !== 'All';

  function updateParam(name, value) {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === 'All') next.delete(name);
    else next.set(name, value);
    setSearchParams(next, { replace: true });
  }

  function clearAll() {
    setSearchParams({}, { replace: true });
  }

  const shown = sortVehicles(filterVehicles(vehicles, { q, status, type }), sort.by, sort.direction);

  let content;
  if (loading) {
    content = <p className="muted" role="status">Loading vehicles…</p>;
  } else if (error) {
    content = (
      <EmptyState
        icon="alert"
        title="Couldn't load vehicles."
        action={<Button onClick={reload}>Try again</Button>}
      />
    );
  } else if (vehicles.length === 0) {
    content = (
      <EmptyState
        icon="car"
        title="No vehicles yet"
        message={isAdmin ? null : 'An administrator can add vehicles.'}
        action={
          isAdmin && (
            <Button variant="primary" to="/vehicles/new">
              + Add Vehicle
            </Button>
          )
        }
      />
    );
  } else if (shown.length === 0) {
    content = (
      <EmptyState
        icon="search"
        title="No vehicles match your search"
        message={describeFilters(q, status, type)}
        action={<Button onClick={clearAll}>Clear search and filters</Button>}
      />
    );
  } else {
    content = (
      <VehicleTable
        vehicles={shown}
        sortBy={sort.by}
        sortDirection={sort.direction}
        onSortChange={(by, direction) => setSort({ by, direction })}
        canManage={isAdmin}
        onDeleteRequest={setDeleteTarget}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Vehicles"
        subtitle={loading ? ' ' : `Showing ${shown.length} of ${vehicles.length} vehicles`}
        actions={
          isAdmin && (
            <Button variant="primary" to="/vehicles/new">
              + Add Vehicle
            </Button>
          )
        }
      />
      <FilterBar
        status={status}
        type={type}
        onStatusChange={(value) => updateParam('status', value)}
        onTypeChange={(value) => updateParam('type', value)}
        onClearAll={clearAll}
        hasActiveFilters={hasActiveFilters}
      >
        <SearchBar value={q} onChange={(value) => updateParam('q', value)} />
      </FilterBar>
      <div aria-live="polite" className="visually-hidden">
        {!loading && `${shown.length} vehicles shown`}
      </div>
      {content}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete vehicle?"
        message={deleteTarget && <DeleteMessage vehicle={deleteTarget} />}
        confirmLabel="Delete vehicle"
        tone="danger"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

// e.g. 'Nothing matches "corolla" with Status: Retired, Type: SUV.'
function describeFilters(q, status, type) {
  const parts = [];
  if (status !== 'All') parts.push(`Status: ${status}`);
  if (type !== 'All') parts.push(`Type: ${type}`);
  const search = q ? ` "${q}"` : '';
  const filters = parts.length ? ` with ${parts.join(', ')}` : '';
  return `Nothing matches${search}${filters}.`;
}
