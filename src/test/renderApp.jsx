import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from '../App.jsx';
import { ROLES } from '../constants/vehicle.js';
import { RoleProvider } from '../context/RoleContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';

// The fixed "today" used by every test (see setup.js).
export const TEST_TODAY = '2026-10-17';

// Renders the whole app at `route` with the same providers as main.jsx.
export function renderApp(route = '/', { role = ROLES.ADMIN } = {}) {
  // delay: null types without waiting between keystrokes, which keeps form tests fast.
  const user = userEvent.setup({ delay: null });
  const result = render(
    <RoleProvider initialRole={role}>
      <ToastProvider>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </ToastProvider>
    </RoleProvider>,
  );
  return { user, ...result };
}
