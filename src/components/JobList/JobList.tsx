'use client';

import { useQuery } from '@tanstack/react-query';

import { JobCard, type Job } from '@/components/JobCard/JobCard';
import { QueryState } from '@/components/ui/QueryState/QueryState';
import { Wrapper } from '@/components/ui/Wrapper/Wrapper';

interface JobListProps {
  onSync?: () => void;
  syncing?: boolean;
}

async function fetchJobs(): Promise<Job[]> {
  const response = await fetch('/api/jobs');
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Не удалось загрузить вакансии');
  }

  return data.data;
}

export function JobList({ onSync, syncing = false }: JobListProps) {
  const {
    data: jobs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  if (isLoading) {
    return <QueryState type="loading" />;
  }

  if (error) {
    return (
      <QueryState
        type="error"
        title="Не удалось загрузить вакансии"
        description={error.message}
        action={{
          label: 'Попробовать снова',
          onClick: () => refetch(),
        }}
      />
    );
  }

  if (!jobs?.length) {
    return (
      <QueryState
        type="empty"
        title="Пока нет вакансий"
        description="Здесь появятся актуальные предложения от работодателей. Синхронизируйте вакансии, чтобы начать поиск."
        action={
          onSync
            ? {
                label: 'Загрузить вакансии',
                onClick: onSync,
                loading: syncing,
              }
            : undefined
        }
      />
    );
  }

  return (
    <Wrapper direction="column" gap="md">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </Wrapper>
  );
}
