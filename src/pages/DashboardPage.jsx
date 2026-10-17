import PageHeader from '../components/common/PageHeader.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  return <PageHeader title="Dashboard" subtitle="Coming soon." />;
}
