import { Wrapper } from '@/components/ui/Wrapper/Wrapper';
import * as Avatar from '@radix-ui/react-avatar';
import * as Separator from '@radix-ui/react-separator';
import * as Tooltip from '@radix-ui/react-tooltip';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Briefcase, ExternalLink, MapPin, Sparkles } from 'lucide-react';
import styles from './JobCard.module.scss';

export interface Job {
  id: string;
  title: string;
  company: string;
  salary: string | null;
  url: string;
  source: string;
  publishedAt: string;
  isRemote: boolean;
  aiScore: number | null;
  aiSummary: string | null;
}

interface JobCardProps {
  job: Job;
}

function getCompanyInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    hh: styles.sourceHh,
    remoteok: styles.sourceRemoteok,
    linkedin: styles.sourceLinkedin,
    test: styles.sourceTest,
  };
  return colors[source] ?? styles.sourceDefault;
}

function getScoreColor(score: number): string {
  if (score >= 80) return styles.scoreHigh;
  if (score >= 60) return styles.scoreMedium;
  return styles.scoreLow;
}

export function JobCard({ job }: JobCardProps) {
  const publishedDate = new Date(job.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true, locale: ru });
  const initials = getCompanyInitials(job.company);

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className={styles.card}>
        <Wrapper gap="lg" className={styles.mainInfo}>
          {/* Аватар компании */}
          <Avatar.Root className={styles.avatar}>
            <Avatar.Image
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=2563eb&color=fff&size=128`}
              alt={job.company}
              className={styles.avatarImage}
            />
            <Avatar.Fallback className={styles.avatarFallback}>{initials}</Avatar.Fallback>
          </Avatar.Root>

          {/* Основная информация */}
          <Wrapper direction="column" gap="sm" className={styles.content}>
            {/* Заголовок */}
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.titleLink}
            >
              <h3 className={styles.title}>{job.title}</h3>
              <ExternalLink size={16} className={styles.externalIcon} />
            </a>

            {/* Мета-информация */}
            <Wrapper align="center" gap="sm" wrap className={styles.metaRow}>
              <span className={styles.company}>{job.company}</span>
              <Separator.Root orientation="vertical" className={styles.separator} />
              <Wrapper align="center" gap="xs" className={styles.timeAgo}>
                <Briefcase size={14} />
                <span>{timeAgo}</span>
              </Wrapper>
              {job.isRemote && (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Wrapper align="center" gap="xs" className={styles.badge}>
                      <MapPin size={12} />
                      <span>Удалёнка</span>
                    </Wrapper>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className={styles.tooltip} sideOffset={5}>
                      Вакансия предполагает полностью удалённую работу
                      <Tooltip.Arrow className={styles.tooltipArrow} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )}
            </Wrapper>

            {/* AI Summary */}
            {job.aiSummary && (
              <Wrapper align="flex-start" gap="xs" className={styles.aiSummary}>
                <Sparkles size={14} className={styles.sparkleIcon} />
                <span>{job.aiSummary}</span>
              </Wrapper>
            )}

            {/* Теги */}
            <Wrapper gap="sm" wrap className={styles.tags}>
              <span className={`${styles.sourceBadge} ${getSourceColor(job.source)}`}>
                {job.source.toUpperCase()}
              </span>
              {job.aiScore !== null && (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Wrapper
                      align="center"
                      gap="xs"
                      className={`${styles.scoreBadge} ${getScoreColor(job.aiScore)}`}
                    >
                      <Sparkles size={12} />
                      <span>AI: {job.aiScore}/100</span>
                    </Wrapper>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className={styles.tooltip} sideOffset={5}>
                      Оценка соответствия вакансии вашему профилю
                      <Tooltip.Arrow className={styles.tooltipArrow} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )}
            </Wrapper>
          </Wrapper>
        </Wrapper>

        {/* Зарплата */}
        {job.salary && (
          <Wrapper direction="column" align="flex-end" gap="xs" className={styles.salaryBlock}>
            <span className={styles.salaryLabel}>Зарплата</span>
            <span className={styles.salary}>{job.salary}</span>
          </Wrapper>
        )}
      </div>
    </Tooltip.Provider>
  );
}
