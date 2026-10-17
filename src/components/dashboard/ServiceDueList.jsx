import { Link } from 'react-router';
import { SERVICE_DUE_DAYS } from '../../constants/vehicle.js';
import { formatDate, plural } from '../../utils/format.js';
import ServiceTag from '../vehicles/ServiceTag.jsx';
import styles from './ServiceDueList.module.css';

function dueText(days) {
  if (days < 0) return `${plural(-days, 'day')} overdue`;
  if (days === 0) return 'today';
  return `in ${plural(days, 'day')}`;
}

// Vehicles needing service within 30 days (FR-35, FR-36). `vehicles` come from getServiceDueList().
export default function ServiceDueList({ vehicles }) {
  const count = vehicles.length;
  return (
    <section className={`card ${styles.panel}`} aria-labelledby="service-due-title">
      <div className={styles.header}>
        <h2 id="service-due-title">Service due in the next {SERVICE_DUE_DAYS} days</h2>
        {count > 0 && (
          <p className="muted">
            {plural(count, 'vehicle')} {count === 1 ? 'needs' : 'need'} service within {SERVICE_DUE_DAYS} days
          </p>
        )}
      </div>

      {count === 0 ? (
        <p className={styles.empty}>No services due in the next {SERVICE_DUE_DAYS} days.</p>
      ) : (
        <ul className={styles.list}>
          {vehicles.map((vehicle) => (
            <li key={vehicle.id}>
              <Link to={`/vehicles/${vehicle.id}`} className={styles.row}>
                <span className="plate">{vehicle.plateNumber}</span>
                <span>
                  {vehicle.make} {vehicle.model}
                </span>
                <span className="numeric">{formatDate(vehicle.nextServiceDate)}</span>
                <span className={styles.due}>
                  {dueText(vehicle.daysUntilService)}
                  <ServiceTag nextServiceDate={vehicle.nextServiceDate} status={vehicle.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
