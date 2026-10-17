import { Link } from 'react-router';
import { SORTABLE_COLUMNS } from '../../utils/filterVehicles.js';
import { formatDate, formatKm } from '../../utils/format.js';
import Button from '../common/Button.jsx';
import StatusBadge from './StatusBadge.jsx';
import ServiceTag from './ServiceTag.jsx';
import styles from './VehicleTable.module.css';

function SortableHeader({ column, sortBy, sortDirection, onSortChange }) {
  const active = sortBy === column;
  const nextDirection = active && sortDirection === 'asc' ? 'desc' : 'asc';
  let ariaSort = 'none';
  if (active) ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
  return (
    <th scope="col" aria-sort={ariaSort}>
      <button type="button" className={styles.sortButton} onClick={() => onSortChange(column, nextDirection)}>
        {SORTABLE_COLUMNS[column]}
        <span aria-hidden="true" className={styles.sortIcon}>
          {active ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
        </span>
      </button>
    </th>
  );
}

function Actions({ vehicle, canManage, onDeleteRequest }) {
  const plate = <span className="visually-hidden"> {vehicle.plateNumber}</span>;
  return (
    <div className={styles.actions}>
      <Button variant="ghost" to={`/vehicles/${vehicle.id}`}>
        View{plate}
      </Button>
      {canManage && (
        <>
          <Button variant="ghost" to={`/vehicles/${vehicle.id}/edit`}>
            Edit{plate}
          </Button>
          {onDeleteRequest && (
            <Button variant="ghost" className={styles.deleteButton} onClick={() => onDeleteRequest(vehicle)}>
              Delete{plate}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

function NextService({ vehicle }) {
  return (
    <span className={styles.service}>
      <span className="numeric">{formatDate(vehicle.nextServiceDate)}</span>
      <ServiceTag nextServiceDate={vehicle.nextServiceDate} status={vehicle.status} />
    </span>
  );
}

// Renders the vehicles it is given: a table on desktop, cards on mobile (FR-6 – FR-10, DESIGN §2.2).
export default function VehicleTable({ vehicles, sortBy, sortDirection, onSortChange, canManage, onDeleteRequest }) {
  const headerProps = { sortBy, sortDirection, onSortChange };

  return (
    <>
      {/* Desktop and tablet */}
      <div className={`card ${styles.tableWrap}`}>
        <table className={styles.table}>
          <caption className="visually-hidden">Vehicles</caption>
          <thead>
            <tr>
              <SortableHeader column="plateNumber" {...headerProps} />
              <SortableHeader column="make" {...headerProps} />
              <th scope="col">Model</th>
              <SortableHeader column="year" {...headerProps} />
              <th scope="col">Type</th>
              <th scope="col">Assigned driver</th>
              <th scope="col">Department</th>
              <SortableHeader column="mileage" {...headerProps} />
              <th scope="col">Status</th>
              <SortableHeader column="nextServiceDate" {...headerProps} />
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>
                  <Link to={`/vehicles/${vehicle.id}`} className="plate">
                    {vehicle.plateNumber}
                  </Link>
                </td>
                <td>{vehicle.make}</td>
                <td>{vehicle.model}</td>
                <td className="numeric">{vehicle.year}</td>
                <td>{vehicle.type}</td>
                <td className={vehicle.assignedDriver ? '' : 'muted'}>{vehicle.assignedDriver || 'Unassigned'}</td>
                <td>{vehicle.department}</td>
                <td className={`numeric ${styles.right}`}>{formatKm(vehicle.mileage)}</td>
                <td>
                  <StatusBadge status={vehicle.status} size="sm" />
                </td>
                <td>
                  <NextService vehicle={vehicle} />
                </td>
                <td>
                  <Actions vehicle={vehicle} canManage={canManage} onDeleteRequest={onDeleteRequest} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: sort control + cards (DESIGN §5.5) */}
      <div className={styles.mobile}>
        <div className={styles.mobileSort}>
          <label htmlFor="mobile-sort">Sort by</label>
          <select
            id="mobile-sort"
            className="input"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value, sortDirection)}
          >
            {Object.entries(SORTABLE_COLUMNS).map(([column, label]) => (
              <option key={column} value={column}>
                {label}
              </option>
            ))}
          </select>
          <Button
            onClick={() => onSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc')}
            aria-label={`Sort direction: ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
          >
            {sortDirection === 'asc' ? '▲ Asc' : '▼ Desc'}
          </Button>
        </div>
        <ul className={styles.cards}>
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className={`card ${styles.cardItem}`}>
              <div className={styles.cardTop}>
                <Link to={`/vehicles/${vehicle.id}`} className={`plate ${styles.cardPlate}`}>
                  {vehicle.plateNumber}
                </Link>
                <StatusBadge status={vehicle.status} size="sm" />
              </div>
              <p>
                {vehicle.make} {vehicle.model} {vehicle.year} · {vehicle.type}
              </p>
              <p className={vehicle.assignedDriver ? '' : 'muted'}>{vehicle.assignedDriver || 'Unassigned'}</p>
              <p className="muted">
                {vehicle.department} · <span className="numeric">{formatKm(vehicle.mileage)}</span>
              </p>
              <p>
                Service: <NextService vehicle={vehicle} />
              </p>
              <Actions vehicle={vehicle} canManage={canManage} onDeleteRequest={onDeleteRequest} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
