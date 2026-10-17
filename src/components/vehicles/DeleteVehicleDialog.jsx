import { useEffect, useState } from 'react';
import { useRole } from '../../context/RoleContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as vehicleService from '../../services/vehicleService.js';
import ConfirmDialog from '../common/ConfirmDialog.jsx';

/**
 * Asks for confirmation, deletes the vehicle and shows the result as a toast (FR-25 – FR-28).
 * `vehicle` is the vehicle to delete, or null when the dialog is closed.
 * `onCancel()` runs when the user cancels; `onDone()` runs after the delete attempt.
 */
export default function DeleteVehicleDialog({ vehicle, onCancel, onDone }) {
  const { isAdmin } = useRole();
  const { notify } = useToast();
  const [deleting, setDeleting] = useState(false);

  // Close the dialog if the role switches to Viewer while it is open (DESIGN §7.3).
  useEffect(() => {
    if (vehicle && !isAdmin) onCancel();
  }, [vehicle, isAdmin, onCancel]);

  async function confirmDelete() {
    setDeleting(true);
    try {
      await vehicleService.remove(vehicle.id);
      notify({ message: `Vehicle ${vehicle.plateNumber} deleted.` });
    } catch (error) {
      const message =
        error instanceof vehicleService.NotFoundError
          ? `Vehicle ${vehicle.plateNumber} no longer exists.`
          : `Vehicle ${vehicle.plateNumber} could not be deleted. Please try again.`;
      notify({ type: 'error', message });
    }
    setDeleting(false);
    onDone();
  }

  return (
    <ConfirmDialog
      open={vehicle !== null && isAdmin}
      title="Delete vehicle?"
      message={
        vehicle && (
          <>
            Delete vehicle <strong className="plate">{vehicle.plateNumber}</strong> — {vehicle.make} {vehicle.model}?
            This cannot be undone.
          </>
        )
      }
      confirmLabel="Delete vehicle"
      tone="danger"
      busy={deleting}
      onConfirm={confirmDelete}
      onCancel={onCancel}
    />
  );
}
