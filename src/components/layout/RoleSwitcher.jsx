import { useRole } from '../../context/RoleContext.jsx';
import { ROLES } from '../../constants/vehicle.js';
import styles from './RoleSwitcher.module.css';

const DEMO_NOTE = 'Simulated role for demonstration only — not a security control.';

// Two-segment control built from native radio buttons (DESIGN §7.1).
export default function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <div className={styles.switcher}>
      <span className={styles.demoTag} title={DEMO_NOTE}>
        Demo
      </span>
      <div role="radiogroup" aria-label="Role (demo)" className={styles.group}>
        {[ROLES.VIEWER, ROLES.ADMIN].map((option) => (
          <label key={option} className={role === option ? `${styles.option} ${styles.selected}` : styles.option}>
            <input
              type="radio"
              name="role"
              value={option}
              checked={role === option}
              onChange={() => setRole(option)}
              className="visually-hidden"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
