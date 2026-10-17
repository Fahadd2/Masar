import PageHeader from '../components/common/PageHeader.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function AddVehiclePage() {
  useDocumentTitle('Add vehicle');
  return <PageHeader title="Add vehicle" subtitle="Coming soon." />;
}
