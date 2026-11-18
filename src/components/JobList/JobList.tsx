'use client';

import { useJobs } from '@/api/hooks/use-jobs';
import { JobSource } from '@/api/types';
import { QueryState } from '@/components/ui/QueryState/QueryState';
import { useSearchQuery } from '@/lib/hooks/useSearchQuery';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Button, Flex } from '@radix-ui/themes';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { JobCard } from '../JobCard/JobCard';

interface JobListProps {
  source: JobSource;
}

export function JobList({ source }: JobListProps) {
  const { params, setParams } = useSearchQuery();
  const { data, isLoading, isError, refetch, isFetching } = useJobs(source, params);
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

  if (!data?.jobs.length) {
    return (
      <QueryState
        type="empty"
        title="Пока нет вакансий"
        description="Здесь появятся актуальные предложения от работодателей."
      />
    );
  }

  const handleShowMore = () => setParams({ count: count + 20 });
  const handleCollapse = () => {
    setParams({ count: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Tooltip.Provider delayDuration={200}>
        <Flex direction="column" gap="3">
          {data?.jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {isFetching && <QueryState type="loading" />}
        </Flex>
      </Tooltip.Provider>

      <Flex justify="end" mt="6" gap="var(--space-3)">
        {count !== 20 && (
          <Button size="3" variant="soft" onClick={handleCollapse} disabled={isFetching}>
            Свернуть
            <ArrowUp size={16} />
          </Button>
        )}
        {data.hasMore && (
          <Button size="3" variant="soft" onClick={handleShowMore} disabled={isFetching}>
            Показать ещё
            <ArrowDown size={16} />
          </Button>
        )}
      </Flex>
    </>
  );
}
