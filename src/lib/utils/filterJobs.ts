import type { Job } from '@/api/types';

export function filterJobs(jobs: Job[], search: string): Job[] {
  if (!search) return jobs;
  const q = search.toLowerCase();
  return jobs.filter((job) => {
    const haystack = [
      job.title,
      job.company,
      job.location,
      job.excerpt,
      ...job.tags,
      ...job.jobTypes,
      job.level ?? '',
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
