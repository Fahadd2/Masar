import PageHeader from '../components/common/PageHeader.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function VehicleListPage() {
  useDocumentTitle('Vehicles');
  return <PageHeader title="Vehicles" subtitle="Coming soon." />;
}
