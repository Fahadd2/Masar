import { useCallback, useEffect, useState } from 'react';
import * as vehicleService from '../services/vehicleService.js';

// Loads all vehicles. Call reload() after a change to fetch fresh data.
export function useVehicles() {
  const [state, setState] = useState({ vehicles: [], loading: true, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    vehicleService.getAll().then(
      (vehicles) => active && setState({ vehicles, loading: false, error: null }),
      (error) => active && setState({ vehicles: [], loading: false, error }),
    );
    return () => {
      active = false;
    };
  }, [version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}
