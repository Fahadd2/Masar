import { useToast } from '../../context/ToastContext.jsx';
import Toast from './Toast.jsx';
import styles from './Toast.module.css';

// Live region, so screen readers announce toasts without moving focus.
export default function ToastRegion() {
  const { toasts, dismiss } = useToast();
  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} id={toast.id} type={toast.type} message={toast.message} onDismiss={dismiss} />
      ))}
    </div>
  );
}
