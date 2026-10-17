import { useNavigate, useParams } from 'react-router';
import { useToast } from '../context/ToastContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useVehicle } from '../hooks/useVehicle.js';
import { useVehicles } from '../hooks/useVehicles.js';
import * as vehicleService from '../services/vehicleService.js';
import { toFormValues, validateVehicle } from '../utils/validateVehicle.js';
import PageHeader from '../components/common/PageHeader.jsx';
import VehicleForm from '../components/vehicles/VehicleForm.jsx';
import VehicleNotFound from '../components/vehicles/VehicleNotFound.jsx';

export default function EditVehiclePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const { vehicle, loading, error, notFound } = useVehicle(id);
  const { vehicles } = useVehicles();

  let title = 'Edit vehicle';
  if (vehicle) title = `Edit ${vehicle.plateNumber}`;
  else if (notFound) title = 'Vehicle not found';
  useDocumentTitle(title);

  if (loading) return <p className="muted" role="status">Loading vehicle…</p>;
  if (error || notFound) return <VehicleNotFound id={id} error={error} />;

  async function handleSubmit(values) {
    const saved = await vehicleService.update(vehicle.id, values);
    notify({ message: `Vehicle ${saved.plateNumber} updated.` });
    navigate(`/vehicles/${saved.id}`);
  }

  return (
    <>
      <PageHeader title={`Edit vehicle ${vehicle.plateNumber}`} subtitle={`Vehicle ID: ${vehicle.id}`} />
      <VehicleForm
        key={vehicle.id}
        mode="edit"
        initialValues={toFormValues(vehicle)}
        validate={(values) => validateVehicle(values, { vehicles, original: vehicle })}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/vehicles/${vehicle.id}`)}
      />
    </>
  );
}
