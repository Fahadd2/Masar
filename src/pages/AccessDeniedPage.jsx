import PageHeader from '../components/common/PageHeader.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function AccessDeniedPage() {
  useDocumentTitle('Access denied');
  return <PageHeader title="Access denied" subtitle="Coming soon." />;
}
