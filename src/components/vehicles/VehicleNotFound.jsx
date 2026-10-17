import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';

// Shown by the details and edit pages when the id does not exist or loading failed (FR-15, FR-24).
export default function VehicleNotFound({ id, error }) {
  return (
    <EmptyState
      icon="alert"
      headingLevel={1}
      title={error ? "Couldn't load this vehicle." : 'Vehicle not found'}
      message={error ? null : `There is no vehicle with ID "${id}".`}
      action={<Button to="/vehicles">Back to vehicles</Button>}
    />
  );
}
