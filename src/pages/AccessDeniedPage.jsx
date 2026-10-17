import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import styles from './AccessDeniedPage.module.css';

// Shown in place of Admin-only pages for Viewers (FR-45, DESIGN §7.4).
// No "switch to Admin" shortcut: it should behave like the real 403 page in Part 2.
export default function AccessDeniedPage() {
  useDocumentTitle('Access denied');
  return (
    <>
      <EmptyState
        icon="lock"
        headingLevel={1}
        title="Access denied"
        message={
          <>
            You need the Admin role to add or edit vehicles.
            <br />
            You are currently using the Viewer role.
          </>
        }
        action={
          <>
            <Button to="/vehicles">Back to vehicles</Button>
            <Button to="/">Go to Dashboard</Button>
          </>
        }
      />
      <p className={styles.note}>
        <span aria-hidden="true">ℹ️ </span>
        <strong>Demo note:</strong> roles in Part 1 are simulated. Use the role switcher in the navbar to change role.
        This is not a security control.
      </p>
    </>
  );
}
