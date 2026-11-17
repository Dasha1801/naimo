import * as Avatar from '@radix-ui/react-avatar';
import * as Separator from '@radix-ui/react-separator';
import * as Tooltip from '@radix-ui/react-tooltip';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Briefcase, ExternalLink, GraduationCap, MapPin, Sparkles, Tag } from 'lucide-react';

import type { Job } from '@/api/types';
import { getCompanyInitials } from '@/lib/utils/getCompanyInitials';
import { Flex } from '@radix-ui/themes';
import styles from './JobCard.module.scss';

interface JobCardProps {
  job: Job;
}

function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    jobicy: styles.sourceJobicy,
    remoteok: styles.sourceRemoteok,
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
  const avatarSrc =
    job.companyLogo ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=2563eb&color=fff&size=128`;

  const visibleTags = job.tags.slice(0, 4);

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className={styles.card}>
        <Flex gap="var(--spacing-lg)" className={styles.mainInfo}>
          <Avatar.Root className={styles.avatar}>
            <Avatar.Image src={avatarSrc} alt={job.company} className={styles.avatarImage} />
            <Avatar.Fallback className={styles.avatarFallback}>{initials}</Avatar.Fallback>
          </Avatar.Root>

          <Flex direction="column" gap="var(--spacing-sm)" className={styles.content}>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.titleLink}
            >
              <h3 className={styles.title}>{job.title}</h3>
              <ExternalLink size={16} className={styles.externalIcon} />
            </a>

            <Flex align="center" gap="var(--spacing-sm)" wrap="wrap" className={styles.metaRow}>
              <span className={styles.company}>{job.company}</span>
              <Separator.Root orientation="vertical" className={styles.separator} />

              {job.location && (
                <>
                  <Flex align="center" gap="var(--spacing-xs)" className={styles.location}>
                    <MapPin size={14} />
                    <span>{job.location}</span>
                  </Flex>
                  <Separator.Root orientation="vertical" className={styles.separator} />
                </>
              )}

              <Flex align="center" gap="var(--spacing-xs)" className={styles.timeAgo}>
                <Briefcase size={14} />
                <span>{timeAgo}</span>
              </Flex>

              {job.level && (
                <>
                  <Separator.Root orientation="vertical" className={styles.separator} />
                  <Flex align="center" gap="var(--spacing-xs)" className={styles.level}>
                    <GraduationCap size={14} />
                    <span>{job.level}</span>
                  </Flex>
                </>
              )}

              {job.isRemote && (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Flex align="center" gap="var(--spacing-xs)" className={styles.badge}>
                      <MapPin size={12} />
                      <span>Удалёнка</span>
                    </Flex>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className={styles.tooltip} sideOffset={5}>
                      Вакансия предполагает полностью удалённую работу
                      <Tooltip.Arrow className={styles.tooltipArrow} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )}
            </Flex>

            {job.excerpt && <p className={styles.excerpt}>{job.excerpt}</p>}

            {job.aiSummary && (
              <Flex align="start" gap="var(--spacing-xs)" className={styles.aiSummary}>
                <Sparkles size={14} className={styles.sparkleIcon} />
                <span>{job.aiSummary}</span>
              </Flex>
            )}

            <Flex gap="var(--spacing-sm)" wrap="wrap" className={styles.tags}>
              <span className={`${styles.sourceBadge} ${getSourceColor(job.source)}`}>
                {job.source.toUpperCase()}
              </span>

              {job.jobTypes.map((t) => (
                <span key={t} className={styles.typeBadge}>
                  {t}
                </span>
              ))}

              {Array.from(new Set(visibleTags)).map((tag) => (
                <span key={tag} className={styles.tagBadge}>
                  <Tag size={10} />
                  {tag}
                </span>
              ))}

              {job.tags.length > visibleTags.length && (
                <span className={styles.tagMore}>+{job.tags.length - visibleTags.length}</span>
              )}

              {job.aiScore !== null && (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Flex
                      align="center"
                      gap="var(--spacing-xs)"
                      className={`${styles.scoreBadge} ${getScoreColor(job.aiScore)}`}
                    >
                      <Sparkles size={12} />
                      <span>AI: {job.aiScore}/100</span>
                    </Flex>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className={styles.tooltip} sideOffset={5}>
                      Оценка соответствия вакансии вашему профилю
                      <Tooltip.Arrow className={styles.tooltipArrow} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )}
            </Flex>
          </Flex>
        </Flex>

        {job.salary && (
          <Flex
            direction="column"
            align="end"
            gap="var(--spacing-xs)"
            className={styles.salaryBlock}
          >
            <span className={styles.salaryLabel}>Зарплата</span>
            <span className={styles.salary}>{job.salary}</span>
          </Flex>
        )}
      </div>
    </Tooltip.Provider>
  );
}
