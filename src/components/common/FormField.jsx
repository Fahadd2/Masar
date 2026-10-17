import styles from './FormField.module.css';

// Label + control + hint + error. The hint and error get ids "<id>-hint" and "<id>-error"
// so the control (children) can point at them with aria-describedby.
export default function FormField({ id, label, required = false, hint, error, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          <span aria-hidden="true">! </span>
          {error}
        </p>
      )}
    </div>
  );
}
