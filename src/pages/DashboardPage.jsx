import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useVehicles } from '../hooks/useVehicles.js';
import { countByStatus, getServiceDueList } from '../utils/fleetStats.js';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import ServiceDueList from '../components/dashboard/ServiceDueList.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import styles from './DashboardPage.module.css';

const STATUS_CARDS = [
  { status: 'Available', tone: 'available' },
  { status: 'In Use', tone: 'inUse' },
  { status: 'Under Maintenance', tone: 'maintenance' },
  { status: 'Retired', tone: 'retired' },
];

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  // Fetched fresh on every visit, so counts reflect this session's changes (FR-37).
  const { vehicles, loading, error, reload } = useVehicles();

  let content;
  if (loading) {
    content = <p className="muted" role="status">Loading dashboard…</p>;
  } else if (error) {
    content = (
      <EmptyState icon="alert" title="Couldn't load vehicles." action={<Button onClick={reload}>Try again</Button>} />
    );
  } else {
    const counts = countByStatus(vehicles);
    content = (
      <>
        <div className={styles.stats}>
          <div className={styles.total}>
            <StatCard label="Total vehicles" value={vehicles.length} to="/vehicles" caption="View all" />
          </div>
          {STATUS_CARDS.map(({ status, tone }) => (
            <StatCard
              key={status}
              label={status}
              value={counts[status]}
              tone={tone}
              to={`/vehicles?status=${encodeURIComponent(status)}`}
              caption="View"
            />
          ))}
        </div>
        <ServiceDueList vehicles={getServiceDueList(vehicles)} />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of the company fleet" />
      {content}
    </>
  );
}
