import { useQuery } from '@tanstack/react-query';
import { adaptJobicyJob } from '../adapters/jobicy';
import { adaptRemoteOkResponse } from '../adapters/remoteok';
import { fetchJobicyJobs } from '../clients/jobicy';
import { fetchRemoteOkJobs } from '../clients/remoteok';
import type { Job } from '../types';

type JobSource = 'jobicy' | 'remoteok';

export function useJobs(source: JobSource) {
  return useQuery<Job[]>({
    queryKey: ['jobs', source],
    queryFn: async () => {
      if (source === 'jobicy') {
        const data = await fetchJobicyJobs();
        return data.jobs.map(adaptJobicyJob);
      }

      if (source === 'remoteok') {
        const data = await fetchRemoteOkJobs();
        return adaptRemoteOkResponse(data);
      }

      return [];
    },
    // Данные можно считать свежими 5 минут, чтобы не спамить API при переключении вкладок
    staleTime: 1000 * 60 * 5,
  });
}
