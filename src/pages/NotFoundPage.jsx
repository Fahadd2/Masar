import { useLocation } from 'react-router';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import Button from '../components/common/Button.jsx';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  const { pathname } = useLocation();
  return (
    <div className={styles.page}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1>Page not found</h1>
      {/* The path is rendered as text, never as HTML (NFR-22). */}
      <p className="muted">The page &quot;{pathname}&quot; does not exist.</p>
      <div className={styles.actions}>
        <Button variant="primary" to="/">
          Go to Dashboard
        </Button>
        <Button to="/vehicles">View vehicles</Button>
      </div>
    </div>
  );
}
