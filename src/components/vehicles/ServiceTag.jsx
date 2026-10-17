import { getServiceState } from '../../utils/dates.js';
import styles from './ServiceTag.module.css';

// "Overdue" / "Due soon" tag (FR-9); renders nothing otherwise.
export default function ServiceTag({ nextServiceDate, status }) {
  const state = getServiceState({ nextServiceDate, status });
  if (state === 'overdue') return <span className={`${styles.tag} ${styles.overdue}`}>Overdue</span>;
  if (state === 'dueSoon') return <span className={`${styles.tag} ${styles.dueSoon}`}>Due soon</span>;
  return null;
}
