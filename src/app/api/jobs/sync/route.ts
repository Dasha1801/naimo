import { db } from '@/lib/db';
import { jobs } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

interface RemoteOkJob {
  id?: string | number;
  position?: string;
  company?: string;
  tags?: string[];
  salary_min?: number;
  salary_max?: number;
  url?: string;
  date?: string;
  epoch?: string | number;
}

const DEV_TAGS = /react|next|javascript|typescript|frontend|web|node/i;

/**
 * RemoteOK отдаёт дату как ISO-строку в `date` и как unix-секунды в `epoch`.
 * Поддерживаем оба формата, при провале — текущая дата.
 */
function parsePublishedDate(date?: string, epoch?: string | number): Date {
  if (date) {
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const seconds = Number(epoch);
  if (Number.isFinite(seconds) && seconds > 0) {
    const parsed = new Date(seconds * 1000);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
}

function formatSalary(min?: number, max?: number): string | null {
  if (min && max) return `$${min.toLocaleString('en-US')} - $${max.toLocaleString('en-US')}`;
  if (min) return `от $${min.toLocaleString('en-US')}`;
  if (max) return `до $${max.toLocaleString('en-US')}`;
  return null;
}

export async function GET() {
  try {
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Naimo/1.0 (https://github.com/yourusername/naimo)',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`RemoteOK API error: ${response.status} ${response.statusText}`);
    }

    const data: RemoteOkJob[] = await response.json();

    // Первый элемент — служебная запись (legal/реклама), без id
    const vacancies = data.slice(1).filter((item) => item?.id);

    const jobsToInsert = vacancies
      .filter((vacancy) => (vacancy.tags ?? []).some((tag) => DEV_TAGS.test(tag)))
      .map((vacancy) => ({
        // Префикс источника защищает от коллизий id между разными API
        id: `remoteok:${vacancy.id}`,
        title: vacancy.position?.trim() || 'Без названия',
        company: vacancy.company?.trim() || 'Неизвестная компания',
        salary: formatSalary(vacancy.salary_min, vacancy.salary_max),
        url: vacancy.url || `https://remoteok.com/remote-jobs/${vacancy.id}`,
        source: 'remoteok',
        publishedAt: parsePublishedDate(vacancy.date, vacancy.epoch),
        isRemote: true,
        aiScore: null,
        aiSummary: null,
      }));

    if (jobsToInsert.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Нет подходящих вакансий для сохранения',
      });
    }

    await db.insert(jobs).values(jobsToInsert).onConflictDoNothing();

    return NextResponse.json({
      success: true,
      message: `Синхронизировано ${jobsToInsert.length} вакансий`,
      count: jobsToInsert.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}