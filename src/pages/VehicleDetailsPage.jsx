import PageHeader from '../components/common/PageHeader.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function VehicleDetailsPage() {
  useDocumentTitle('Vehicle details');
  return <PageHeader title="Vehicle details" subtitle="Coming soon." />;
}
