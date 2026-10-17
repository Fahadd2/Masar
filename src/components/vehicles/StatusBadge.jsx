import styles from './StatusBadge.module.css';

const TONES = {
  Available: styles.available,
  'In Use': styles.inUse,
  'Under Maintenance': styles.maintenance,
  Retired: styles.retired,
};

// Coloured pill with the status text, so colour is never the only signal (FR-7, NFR-8).
export default function StatusBadge({ status, size = 'md' }) {
  return (
    <span className={`${styles.badge} ${TONES[status]} ${size === 'sm' ? styles.sm : ''}`}>
      <span className={styles.dot} aria-hidden="true" />
      {status}
    </span>
  );
}
