import { useQuery } from '@tanstack/react-query';
import { adaptJobicyJob } from '../adapters/jobicy';
import { adaptRemoteOkResponse } from '../adapters/remoteok';
import { Job, JobSource } from '../types';

export function useJobs(source: JobSource, tag: string = '') {
  return useQuery<Job[]>({
    queryKey: ['jobs', source, tag],

    queryFn: async () => {
      if (source === 'jobicy') {
        const url = new URL('https://jobicy.com/api/jobs');
        url.searchParams.set('count', '20');
        if (tag) url.searchParams.set('tag', tag);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Ошибка Jobicy');
        return (await res.json()).jobs.map(adaptJobicyJob);
      }

      if (source === 'remoteok') {
        const url = new URL('https://remoteok.com/api');
        if (tag) url.searchParams.set('tags', tag);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Ошибка RemoteOK');
        const data = await res.json();
        return adaptRemoteOkResponse(data);
      }

      return [];
    },
    placeholderData: (previousData) => previousData,
  });
}
