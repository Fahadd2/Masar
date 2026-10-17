import { useEffect } from 'react';
import { APP_NAME } from '../constants/vehicle.js';

// Sets the browser tab title to "<title> — Masar" (FR-47, DESIGN §3.6).
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${APP_NAME}` : APP_NAME;
  }, [title]);
}
