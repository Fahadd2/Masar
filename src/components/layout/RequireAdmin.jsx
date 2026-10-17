import { useRole } from '../../context/RoleContext.jsx';
import AccessDeniedPage from '../../pages/AccessDeniedPage.jsx';

// Route guard for Admin-only pages. Shows Access denied in place, without changing the URL (FR-45).
// UI only — not a security control (REQUIREMENTS §7.3).
export default function RequireAdmin({ children }) {
  const { isAdmin } = useRole();
  return isAdmin ? children : <AccessDeniedPage />;
}
