import styles from './JobCard.module.scss';

interface JobCardProps {
  title: string;
  company: string;
  salary?: string;
  remote: boolean;
}

export function JobCard({ title, company, salary, remote }: JobCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.company}>{company}</p>
      {salary && <p className={styles.salary}>{salary}</p>}
      {remote && <span className={styles.badge}>Удалёнка</span>}
    </div>
  );
}
