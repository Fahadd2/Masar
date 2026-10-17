import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

const AUTO_DISMISS_MS = 4000;

// Disappears after 4 s; the timer pauses while the toast is hovered or focused.
// `onDismiss(id)` must be stable (it is: ToastContext's dismiss).
export default function Toast({ id, type, message, onDismiss }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setTimeout(() => onDismiss(id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [paused, id, onDismiss]);

  return (
    <div
      className={`${styles.toast} ${type === 'error' ? styles.error : styles.success}`}
      role={type === 'error' ? 'alert' : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span aria-hidden="true">{type === 'error' ? '⚠️' : '✓'}</span>
      <p className={styles.message}>{message}</p>
      <button type="button" className={styles.close} aria-label="Dismiss notification" onClick={() => onDismiss(id)}>
        ✕
      </button>
    </div>
  );
}
