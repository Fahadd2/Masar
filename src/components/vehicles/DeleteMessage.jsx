// Confirmation text for deleting a vehicle (FR-26).
export default function DeleteMessage({ vehicle }) {
  return (
    <>
      Delete vehicle <strong className="plate">{vehicle.plateNumber}</strong> — {vehicle.make} {vehicle.model}? This
      cannot be undone.
    </>
  );
}
