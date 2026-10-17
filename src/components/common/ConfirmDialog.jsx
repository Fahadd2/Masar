import { useEffect, useId, useRef } from 'react';
import Button from './Button.jsx';
import styles from './ConfirmDialog.module.css';

/**
 * Modal confirmation on the native <dialog> element (DESIGN §4.1). showModal() traps focus
 * and handles Escape; Cancel gets focus when it opens, and the browser returns focus to the
 * triggering button when it closes.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  busy = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  // Unique ids, so two dialogs on one page never share them.
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector('[data-cancel]')?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function cancel() {
    if (!busy) onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={(event) => {
        event.preventDefault(); // Escape: let React state close the dialog
        cancel();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) cancel(); // backdrop click
      }}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 id={titleId}>{title}</h2>
          <button type="button" className={styles.close} aria-label="Close" onClick={cancel} disabled={busy}>
            ✕
          </button>
        </div>
        <p id={messageId} className={styles.message}>
          {message}
        </p>
        <div className={styles.actions}>
          <Button onClick={cancel} disabled={busy} data-cancel>
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} disabled={busy}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
