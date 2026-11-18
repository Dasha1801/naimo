import type { JobicyResponse } from '../types';

export async function fetchJobicyJobs(params: Record<string, any> = {}): Promise<JobicyResponse> {
  const url = new URL('https://jobicy.com/api/jobs');

  const finalParams = { count: 20, ...params };

  Object.entries(finalParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch Jobicy jobs');
  return res.json();
}
