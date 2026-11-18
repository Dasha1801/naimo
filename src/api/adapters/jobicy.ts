import { formatSalary } from '../helper/format-salary';
import type { Job, JobicyRawJob } from '../types';

export function adaptJobicyJob(raw: JobicyRawJob): Job {
  return {
    id: `jobicy-${raw.id}`,
    title: raw.jobTitle,
    company: raw.companyName,
    companyLogo: raw.companyLogo ?? null,
    location: raw.jobGeo,
    salary: formatSalary(raw.salaryMin, raw.salaryMax, raw.salaryCurrency, raw.salaryPeriod),
    url: raw.url,
    source: 'jobicy',
    publishedAt: raw.pubDate,
    isRemote: /remote|anywhere|worldwide/i.test(raw.jobGeo),
    aiScore: null,
    aiSummary: null,
    description: raw.jobDescription,
    excerpt: raw.jobExcerpt,
    tags: raw.jobIndustry ?? [],
    jobTypes: raw.jobType ?? [],
    level: raw.jobLevel ?? null,
  };
}
