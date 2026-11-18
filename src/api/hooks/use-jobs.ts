import { useQuery } from '@tanstack/react-query';
import type { JobSource } from '../types';
import { getJobsQueryFn, jobsQueryKey } from '../options/jobs';

export function useJobs(source: JobSource, params: Record<string, any> = {}) {
  return useQuery({
    queryKey: jobsQueryKey(source, params),
    queryFn: getJobsQueryFn(source, params),
    placeholderData: (previousData) => previousData,
  });
}
