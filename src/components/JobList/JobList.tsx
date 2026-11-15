'use client';

import { useQuery } from '@tanstack/react-query';
import { JobCard } from '../JobCard/JobCard';

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string | null;
  url: string;
  source: string;
  publishedAt: string;
  isRemote: boolean;
  aiScore: number | null;
  aiSummary: string | null;
}

async function fetchJobs(): Promise<Job[]> {
  const response = await fetch('/api/jobs');
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch jobs');
  }

  return data.data;
}

export function JobList() {
  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Загрузка вакансий...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        Ошибка: {error.message}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-muted)' }}>
        Вакансий пока нет. Нажмите "Синхронизировать" для загрузки данных.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          title={job.title}
          company={job.company}
          salary={job.salary || undefined}
          remote={job.isRemote}
        />
      ))}
    </div>
  );
}
