import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import ToastRegion from '../common/ToastRegion.jsx';
import Navbar from './Navbar.jsx';
import styles from './Layout.module.css';

export default function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const previousPathname = useRef(pathname);

  // After client-side navigation, move focus to the new page so keyboard and
  // screen-reader users start at its content. Comparing with the previous path (instead of
  // skipping the first run) also stays correct when StrictMode runs effects twice.
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a href="#main" className={styles.skipLink}>
        Skip to main content
      </a>
      <Navbar />
      <main id="main" ref={mainRef} className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      {/* Lives outside the routes so toasts survive navigation. */}
      <ToastRegion />
    </>
  );
}
