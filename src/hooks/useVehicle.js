import { useEffect, useState } from 'react';
import * as vehicleService from '../services/vehicleService.js';

// Loads one vehicle by id. `notFound` is true when the id does not exist.
export function useVehicle(id) {
  // `loadedId` tells us whether the stored result belongs to the current id.
  const [state, setState] = useState({ loadedId: null, vehicle: null, error: null });

  useEffect(() => {
    let active = true;
    vehicleService.getById(id).then(
      (vehicle) => active && setState({ loadedId: id, vehicle, error: null }),
      (error) => active && setState({ loadedId: id, vehicle: null, error }),
    );
    return () => {
      active = false;
    };
  }, [id]);

  const loading = state.loadedId !== id;
  return {
    vehicle: loading ? null : state.vehicle,
    loading,
    error: loading ? null : state.error,
    notFound: !loading && !state.error && state.vehicle === null,
  };
}
