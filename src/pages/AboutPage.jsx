import PageHeader from '../components/common/PageHeader.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function AboutPage() {
  useDocumentTitle('About');
  return <PageHeader title="About" subtitle="Coming soon." />;
}
