import { Outlet } from 'react-router';
import ToastRegion from '../common/ToastRegion.jsx';
import Navbar from './Navbar.jsx';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <>
      <a href="#main" className={styles.skipLink}>
        Skip to main content
      </a>
      <Navbar />
      <main id="main" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      {/* Lives outside the routes so toasts survive navigation. */}
      <ToastRegion />
    </>
  );
}
