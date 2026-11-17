'use client';

import { useJobs } from '@/api/hooks/use-jobs';
import { JobSource } from '@/api/types';
import { QueryState } from '@/components/ui/QueryState/QueryState';
import { filterJobs } from '@/lib/utils/filterJobs';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Flex } from '@radix-ui/themes';
import { JobCard } from '../JobCard/JobCard';

interface JobListProps {
  source: JobSource;
  search?: string;
}

export function JobList({ source, search = '' }: JobListProps) {
  const { data: jobs, isLoading, isError, refetch } = useJobs(source);

  if (isLoading) {
    return <QueryState type="loading" />;
  }

  if (isError) {
    return (
      <QueryState
        type="error"
        title="Не удалось загрузить вакансии"
        description="Проверьте подключение к интернету или попробуйте позже."
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
        description="Здесь появятся актуальные предложения от работодателей."
      />
    );
  }

  const filtered = filterJobs(jobs, search);

  if (!filtered.length) {
    return (
      <QueryState
        type="empty"
        title="Ничего не найдено"
        description={`По запросу «${search}» вакансии не найдены. Попробуйте изменить запрос.`}
      />
    );
  }

  return (
    <Tooltip.Provider delayDuration={200}>
      <Flex direction="column" gap="3">
        {filtered.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </Flex>
    </Tooltip.Provider>
  );
}
