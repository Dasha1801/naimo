import type { JobicyResponse } from '../types';

export async function fetchJobicyJobs(): Promise<JobicyResponse> {
  const res = await fetch('https://jobicy.com/api/jobs?count=20');
  if (!res.ok) throw new Error('Failed to fetch Jobicy jobs');
  return res.json();
}
