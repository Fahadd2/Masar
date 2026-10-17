import { PROJECT, TEAM_MEMBERS } from '../data/teamMembers.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import PageHeader from '../components/common/PageHeader.jsx';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  useDocumentTitle('About');
  return (
    <>
      <PageHeader title="About" />

      <section className={`card ${styles.project}`} aria-labelledby="project-name">
        <h2 id="project-name">
          {PROJECT.name} — {PROJECT.subtitle}
        </h2>
        <p className="muted">Course: {PROJECT.course}</p>
        <p>{PROJECT.description}</p>
      </section>

      <h2 className={styles.teamTitle}>Team</h2>
      <div className="card">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Student ID</th>
            </tr>
          </thead>
          <tbody>
            {TEAM_MEMBERS.map((member) => (
              <tr key={member.studentId}>
                <td>{member.name}</td>
                <td className="numeric">{member.studentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
