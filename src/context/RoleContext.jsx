import { createContext, useContext, useMemo, useState } from 'react';
import { ROLES } from '../constants/vehicle.js';

// Simulated role for demonstration only — NOT a security control (REQUIREMENTS §7.3).
const RoleContext = createContext(null);

// FR-42: start as Admin so every feature is visible straight away. `initialRole` is for tests.
export function RoleProvider({ children, initialRole = ROLES.ADMIN }) {
  const [role, setRole] = useState(initialRole);
  const value = useMemo(() => ({ role, setRole, isAdmin: role === ROLES.ADMIN }), [role]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}
