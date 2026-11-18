import type { RemoteOkRawJob } from '../types';

export async function fetchRemoteOkJobs(
  params: Record<string, any> = {},
): Promise<RemoteOkRawJob[]> {
  const url = new URL('https://remoteok.com/api');

  if (params.tag) {
    url.searchParams.set('tags', params.tag);
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch RemoteOK jobs');
  return res.json();
}
