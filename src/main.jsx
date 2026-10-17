// Global styles first, so component CSS Modules can override them.
import './styles/tokens.css';
import './styles/global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { RoleProvider } from './context/RoleContext.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoleProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RoleProvider>
  </StrictMode>,
);
