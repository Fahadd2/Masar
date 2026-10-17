import PageHeader from '../components/common/PageHeader.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function EditVehiclePage() {
  useDocumentTitle('Edit vehicle');
  return <PageHeader title="Edit vehicle" subtitle="Coming soon." />;
}
