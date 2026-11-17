import type { RemoteOkRawJob } from '../types';

export async function fetchRemoteOkJobs(): Promise<RemoteOkRawJob[]> {
  const res = await fetch('https://remoteok.com/api');
  if (!res.ok) throw new Error('Failed to fetch RemoteOK jobs');
  return res.json();
}
