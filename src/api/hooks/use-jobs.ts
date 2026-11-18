import { useQuery } from '@tanstack/react-query';
import { adaptJobicyJob } from '../adapters/jobicy';
import { adaptRemoteOkResponse } from '../adapters/remoteok';
import { fetchJobicyJobs } from '../clients/jobicy';
import { fetchRemoteOkJobs } from '../clients/remoteok';
import { JobSource, JobsData } from '../types';

export function useJobs(source: JobSource, params: Record<string, any> = {}) {
  return useQuery<JobsData>({
    queryKey: ['jobs', source, source === 'jobicy' ? params : params.tag],

    queryFn: async () => {
      if (source === 'jobicy') {
        const data = await fetchJobicyJobs(params);
        return { jobs: data.jobs.map(adaptJobicyJob), hasMore: data.hasMore };
      }

      if (source === 'remoteok') {
        const data = await fetchRemoteOkJobs(params);
        return { jobs: adaptRemoteOkResponse(data), hasMore: false };
      }

      return { jobs: [], hasMore: false };
    },
    placeholderData: (previousData) => previousData,
  });
}
