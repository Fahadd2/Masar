import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useRole } from '../../context/RoleContext.jsx';
import { APP_NAME } from '../../constants/vehicle.js';
import RoleSwitcher from './RoleSwitcher.jsx';
import styles from './Navbar.module.css';

function NavItem({ to, active, onClick, children }) {
  return (
    <li>
      <Link
        to={to}
        className={active ? `${styles.link} ${styles.active}` : styles.link}
        aria-current={active ? 'page' : undefined}
        onClick={onClick}
      >
        {children}
      </Link>
    </li>
  );
}

export default function Navbar() {
  const { isAdmin } = useRole();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // "Vehicles" covers the list, details and edit pages; "Add Vehicle" has its own item (DESIGN §1.2).
  const isAddPage = pathname === '/vehicles/new';
  const isVehiclesPage = pathname.startsWith('/vehicles') && !isAddPage;

  return (
    <header className={styles.header} onKeyDown={(event) => event.key === 'Escape' && closeMenu()}>
      <nav className={styles.nav} aria-label="Main">
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          {APP_NAME}
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>

        <div id="main-menu" className={menuOpen ? `${styles.menu} ${styles.open}` : styles.menu}>
          <ul className={styles.links}>
            <NavItem to="/" active={pathname === '/'} onClick={closeMenu}>
              Dashboard
            </NavItem>
            <NavItem to="/vehicles" active={isVehiclesPage} onClick={closeMenu}>
              Vehicles
            </NavItem>
            {isAdmin && (
              <NavItem to="/vehicles/new" active={isAddPage} onClick={closeMenu}>
                Add Vehicle
              </NavItem>
            )}
            <NavItem to="/about" active={pathname === '/about'} onClick={closeMenu}>
              About
            </NavItem>
          </ul>
          <RoleSwitcher />
        </div>
      </nav>
    </header>
  );
}
