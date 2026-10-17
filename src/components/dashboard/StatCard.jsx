import { Link } from 'react-router';
import styles from './StatCard.module.css';

// Dashboard metric; the whole card is a link when `to` is given (FR-33, FR-34, FR-38).
export default function StatCard({ label, value, tone = 'neutral', to, caption }) {
  const content = (
    <>
      <span className={styles.label}>{label}</span>
      <span className={`${styles.value} numeric`}>{value}</span>
      {caption && (
        <span className={styles.caption}>
          {caption}
          {to && <span aria-hidden="true"> →</span>}
        </span>
      )}
    </>
  );
  const className = `card ${styles.card} ${styles[tone]}`;
  return to ? (
    <Link to={to} className={`${className} ${styles.link}`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
