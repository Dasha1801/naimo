import { useQuery } from '@tanstack/react-query';
import { adaptJobicyJob } from '../adapters/jobicy';
import { adaptRemoteOkResponse } from '../adapters/remoteok';
import { fetchJobicyJobs } from '../clients/jobicy';
import { Job, JobSource } from '../types';
import { fetchRemoteOkJobs } from '../clients/remoteok';

export function useJobs(source: JobSource, params: Record<string, any> = {}) {
  return useQuery<Job[]>({
    queryKey: ['jobs', source, source === 'jobicy' ? params : params.tag],

    queryFn: async () => {
      if (source === 'jobicy') {
        const data = await fetchJobicyJobs(params);
        return data.jobs.map(adaptJobicyJob);
      }

      if (source === 'remoteok') {
        const data = await fetchRemoteOkJobs(params);
        return adaptRemoteOkResponse(data);
      }

      return [];
    },
    placeholderData: (previousData) => previousData,
  });
}
