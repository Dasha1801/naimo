import { JobList } from '@/components/JobList/JobList';

import type { JobSource } from '@/api/types';
import { JobHeader } from '../JobHeader/JobHeader';
import { ScrollToTop } from '../ScrollToTop/ScrollToTop';
import styles from './JobsPage.module.scss';

interface JobsPageProps {
  source: JobSource;
}

export function JobsPage({ source }: JobsPageProps) {
  return (
    <main className={styles.jobsPage}>
      <section>
        <JobHeader />
        <JobList source={source} />
      </section>
      <ScrollToTop />
    </main>
  );
}
