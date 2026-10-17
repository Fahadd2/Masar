import { useNavigate } from 'react-router';
import { useToast } from '../context/ToastContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useVehicles } from '../hooks/useVehicles.js';
import * as vehicleService from '../services/vehicleService.js';
import { EMPTY_VEHICLE, validateVehicle } from '../utils/validateVehicle.js';
import PageHeader from '../components/common/PageHeader.jsx';
import VehicleForm from '../components/vehicles/VehicleForm.jsx';

export default function AddVehiclePage() {
  useDocumentTitle('Add vehicle');
  const navigate = useNavigate();
  const { notify } = useToast();
  // The current list lets the form flag duplicate plates before saving (V-PL-4).
  const { vehicles } = useVehicles();

  async function handleSubmit(values) {
    const vehicle = await vehicleService.create(values);
    notify({ message: `Vehicle ${vehicle.plateNumber} added.` });
    navigate(`/vehicles/${vehicle.id}`);
  }

  return (
    <>
      <PageHeader title="Add vehicle" />
      <VehicleForm
        mode="add"
        initialValues={EMPTY_VEHICLE}
        validate={(values) => validateVehicle(values, { vehicles })}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/vehicles')}
      />
    </>
  );
}
