import { adaptJobicyJob } from '../adapters/jobicy';
import { adaptRemoteOkResponse } from '../adapters/remoteok';
import { fetchJobicyJobs } from '../clients/jobicy';
import { fetchRemoteOkJobs } from '../clients/remoteok';
import type { JobSource, JobsData } from '../types';

export const jobsQueryKey = (source: JobSource, params: Record<string, any>) => {
  return ['jobs', source, params];
};

export const getJobsQueryFn =
  (source: JobSource, params: Record<string, any>) => async (): Promise<JobsData> => {
    if (source === 'jobicy') {
      const data = await fetchJobicyJobs(params);
      return {
        jobs: data.jobs.map(adaptJobicyJob),
        hasMore: data.hasMore,
      };
    }

    if (source === 'remoteok') {
      const data = await fetchRemoteOkJobs(params);
      return {
        jobs: adaptRemoteOkResponse(data),
        hasMore: false,
      };
    }

    return { jobs: [], hasMore: false };
  };
