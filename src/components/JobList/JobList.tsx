'use client';

import { useJobs } from '@/api/hooks/use-jobs';
import { JobSource } from '@/api/types';
import { QueryState } from '@/components/ui/QueryState/QueryState';
import { useSearchQuery } from '@/lib/hooks/useSearchQuery';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Button, Flex } from '@radix-ui/themes';
import { ChevronDown } from 'lucide-react';
import { JobCard } from '../JobCard/JobCard';

interface JobListProps {
  source: JobSource;
}

export function JobList({ source }: JobListProps) {
  const { params, setParams } = useSearchQuery();
  const { data: jobs, isLoading, isError, refetch } = useJobs(source, params);
  const count = Number(params.count) || 20;
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

  const hasMore = source === 'jobicy' && jobs.length >= count;

  const handleShowMore = () => setParams({ count: count + 20 });

  return (
    <>
      <Tooltip.Provider delayDuration={200}>
        <Flex direction="column" gap="3">
          {jobs?.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </Flex>
      </Tooltip.Provider>
      {hasMore && (
        <Flex justify="end" mt="6">
          <Button size="3" variant="soft" onClick={handleShowMore} disabled={isLoading}>
            Показать ещё
            <ChevronDown size={16} />
          </Button>
        </Flex>
      )}
    </>
  );
}
