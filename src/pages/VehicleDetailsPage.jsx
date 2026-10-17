import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useRole } from '../context/RoleContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useVehicle } from '../hooks/useVehicle.js';
import { getToday } from '../utils/dates.js';
import { formatDate, formatKm, formatSAR, plural } from '../utils/format.js';
import Button from '../components/common/Button.jsx';
import DeleteVehicleDialog from '../components/vehicles/DeleteVehicleDialog.jsx';
import StatusBadge from '../components/vehicles/StatusBadge.jsx';
import ServiceTag from '../components/vehicles/ServiceTag.jsx';
import VehicleNotFound from '../components/vehicles/VehicleNotFound.jsx';
import styles from './VehicleDetailsPage.module.css';

function Section({ title, children }) {
  return (
    <section className={`card ${styles.section}`}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <dl className={styles.list}>{children}</dl>
    </section>
  );
}

function Item({ label, children }) {
  return (
    <div className={styles.item}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const { isAdmin } = useRole();
  const { vehicle, loading, error, notFound } = useVehicle(id);
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  let title = 'Vehicle';
  if (vehicle) title = vehicle.plateNumber;
  else if (notFound) title = 'Vehicle not found';
  useDocumentTitle(title);

  if (loading) return <p className="muted" role="status">Loading vehicle…</p>;
  if (error || notFound) return <VehicleNotFound id={id} error={error} />;

  const age = getToday().getFullYear() - vehicle.year;

  return (
    <>
      <Link to="/vehicles" className={styles.back}>
        <span aria-hidden="true">← </span>Back to vehicles
      </Link>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <span className="plate">{vehicle.plateNumber}</span>
            <StatusBadge status={vehicle.status} />
          </h1>
          <p className="muted">
            {vehicle.make} {vehicle.model} {vehicle.year} · {vehicle.type}
          </p>
        </div>
        {isAdmin && (
          <div className={styles.actions}>
            <Button to={`/vehicles/${vehicle.id}/edit`}>Edit</Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        <Section title="Vehicle">
          <Item label="Plate number">
            <span className="plate">{vehicle.plateNumber}</span>
          </Item>
          <Item label="Make">{vehicle.make}</Item>
          <Item label="Model">{vehicle.model}</Item>
          <Item label="Year">
            {vehicle.year} ({plural(age, 'yr')})
          </Item>
          <Item label="Type">{vehicle.type}</Item>
        </Section>

        <Section title="Assignment">
          <Item label="Status">
            <StatusBadge status={vehicle.status} />
          </Item>
          <Item label="Assigned driver">{vehicle.assignedDriver || <span className="muted">Unassigned</span>}</Item>
          <Item label="Department">{vehicle.department}</Item>
        </Section>

        <Section title="Usage and service">
          <Item label="Mileage">
            <span className="numeric">{formatKm(vehicle.mileage)}</span>
          </Item>
          <Item label="Next service">
            <span className={styles.service}>
              {vehicle.nextServiceDate ? formatDate(vehicle.nextServiceDate) : <span className="muted">Not scheduled</span>}
              <ServiceTag nextServiceDate={vehicle.nextServiceDate} status={vehicle.status} />
            </span>
          </Item>
        </Section>

        <Section title="Purchase">
          <Item label="Purchase date">{formatDate(vehicle.purchaseDate)}</Item>
          <Item label="Purchase price">
            <span className="numeric">{formatSAR(vehicle.purchasePrice)}</span>
          </Item>
        </Section>
      </div>

      <p className={`muted ${styles.id}`}>Vehicle ID: {vehicle.id}</p>

      <DeleteVehicleDialog
        vehicle={confirmOpen ? vehicle : null}
        onCancel={() => setConfirmOpen(false)}
        onDone={() => navigate('/vehicles')}
      />
    </>
  );
}
