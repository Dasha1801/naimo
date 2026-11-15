import { db } from '@/lib/db';
import { jobs } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Читаем все вакансии, сортируем по дате публикации (новые сначала)
    const allJobs = await db
      .select()
      .from(jobs)
      .orderBy(desc(jobs.publishedAt))
      .limit(50); // Ограничиваем 50 для производительности

    return NextResponse.json({
      success: true,
      data: allJobs,
      count: allJobs.length,
    });
  } catch (error) {
    console.error('❌ Ошибка чтения вакансий:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}