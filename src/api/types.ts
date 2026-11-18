export type JobSource = 'jobicy' | 'remoteok';

// Единый интерфейс — то, что видит UI
export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null; // новое: логотип из API
  location: string; // новое: гео (было только isRemote)
  salary: string | null; // строка, как ждёт JobCard
  url: string;
  source: JobSource; // было string
  publishedAt: string; // было postedAt — приводим к JobCard
  isRemote: boolean;
  aiScore: number | null;
  aiSummary: string | null;
  // новые поля для «больше данных»
  description: string; // HTML или текст
  excerpt: string; // краткое описание
  tags: string[]; // industry / tags
  jobTypes: string[]; // Full-Time, Contract...
  level: string | null; // Senior / Any
}

// ---- сырые типы Jobicy ----
export interface JobicyRawJob {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  jobGeo: string;
  jobDescription: string;
  jobExcerpt: string;
  jobIndustry: string[];
  jobType: string[];
  jobLevel?: string;
  pubDate: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
}

export interface JobicyResponse {
  jobs: JobicyRawJob[];
  hasMore: boolean;
}

// ---- сырые типы RemoteOK ----
export interface RemoteOkRawJob {
  id: string;
  slug: string;
  position?: string; // у метаданных (первый элемент) отсутствует
  company?: string;
  location?: string;
  description?: string;
  url?: string;
  apply_url?: string;
  date?: string;
  tags?: string[];
  salary_min?: number;
  salary_max?: number;
  legal?: string;
}

export type JobsData = {
  hasMore: boolean;
  jobs: Job[];
};
