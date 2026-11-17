import { formatSalary } from '../helper/format-salary';
import type { Job, RemoteOkRawJob } from '../types';

export function adaptRemoteOkJob(raw: RemoteOkRawJob): Job {
  const location = raw.location || 'Remote';

  return {
    id: `remoteok-${raw.id}`,
    title: raw.position ?? '',
    company: raw.company ?? 'Unknown',
    companyLogo: null,
    location,
    salary: formatSalary(raw.salary_min, raw.salary_max, 'USD', 'yearly'),
    url: raw.url ?? raw.apply_url ?? '#',
    source: 'remoteok',
    publishedAt: raw.date ?? new Date().toISOString(),
    isRemote: true, // RemoteOK по определению remote
    aiScore: null,
    aiSummary: null,
    description: raw.description ?? '',
    excerpt: stripHtml(raw.description ?? '').slice(0, 220),
    tags: raw.tags ?? [],
    jobTypes: [],
    level: null,
  };
}

// RemoteOK присылает массив, первый элемент — метаданные (legal/last_updated)
export function adaptRemoteOkResponse(rawArray: RemoteOkRawJob[]): Job[] {
  return rawArray
    .filter((item): item is RemoteOkRawJob => Boolean(item.position))
    .map(adaptRemoteOkJob);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
