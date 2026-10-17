import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Success/error notifications shown by ToastRegion (FR-46, DESIGN §5.3).
const ToastContext = createContext(null);
const MAX_TOASTS = 3;
let nextToastId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  // notify({ message, type: 'success' | 'error' }) — newest on top, at most 3 visible.
  const notify = useCallback(({ message, type = 'success' }) => {
    const toast = { id: nextToastId++, message, type };
    setToasts((current) => [toast, ...current].slice(0, MAX_TOASTS));
  }, []);

  const value = useMemo(() => ({ toasts, notify, dismiss }), [toasts, notify, dismiss]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  return useContext(ToastContext);
}
