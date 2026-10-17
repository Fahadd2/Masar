import styles from './EmptyState.module.css';

const ICONS = { search: '🔍', car: '🚗', calendar: '📅', lock: '🔒', alert: '⚠️' };

// Centred message for "nothing to show" cases. `headingLevel` lets full pages use an <h1>.
export default function EmptyState({ title, message, icon, action, headingLevel = 2 }) {
  const Heading = `h${headingLevel}`;
  return (
    <div className={styles.empty}>
      {icon && (
        <div className={styles.icon} aria-hidden="true">
          {ICONS[icon]}
        </div>
      )}
      <Heading className={styles.title}>{title}</Heading>
      {message && <p className={styles.message}>{message}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
