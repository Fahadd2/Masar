import { STATUSES, VEHICLE_TYPES } from '../../constants/vehicle.js';
import Button from '../common/Button.jsx';
import styles from './FilterBar.module.css';

// Toolbar with the search box (children), Status and Type filters, and Clear (FR-30 – FR-32).
export default function FilterBar({ status, type, onStatusChange, onTypeChange, onClearAll, hasActiveFilters, children }) {
  return (
    <div className={`card ${styles.bar}`}>
      <div className={styles.search}>{children}</div>
      <div className={styles.filters}>
        <div className={styles.field}>
          <label htmlFor="status-filter" className={styles.label}>
            Status
          </label>
          <select
            id="status-filter"
            className="input"
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            <option value="All">All statuses</option>
            {STATUSES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="type-filter" className={styles.label}>
            Type
          </label>
          <select id="type-filter" className="input" value={type} onChange={(event) => onTypeChange(event.target.value)}>
            <option value="All">All types</option>
            {VEHICLE_TYPES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        {hasActiveFilters && (
          <Button className={styles.clear} onClick={onClearAll}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
