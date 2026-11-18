import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Job } from '@/api/types';
import { JobCard } from './JobCard';

// Мокаем утилиту инициальов
vi.mock('@/lib/utils/getCompanyInitials', () => ({
  getCompanyInitials: () => 'AC',
}));

// Мокаем date-fns, чтобы результат не зависел от текущего времени
vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 дня назад',
}));
vi.mock('date-fns/locale', () => ({ ru: {} }));

const baseJob: Job = {
  id: '1',
  title: 'Senior Frontend Developer',
  company: 'Acme Corp',
  url: 'https://example.com/job/1',
  source: 'jobicy',
  publishedAt: '2026-11-16T10:00:00.000Z',
  location: 'Москва',
  level: 'senior',
  isRemote: true,
  excerpt: 'Краткое описание вакансии',
  aiSummary: 'Хорошо подходит под ваш профиль',
  tags: ['react', 'typescript', 'nextjs', 'vitest', 'css'],
  jobTypes: ['full-time'],
  salary: '$5000',
  aiScore: 85,
  companyLogo: null,
} as Job;

function renderCard(overrides: Partial<Job> = {}) {
  return render(<JobCard job={{ ...baseJob, ...overrides }} />);
}

describe('JobCard', () => {
  it('рендерит заголовок, компанию и ссылку с корректными атрибутами', () => {
    renderCard();

    const link = screen.getByRole('link', { name: /senior frontend developer/i });
    expect(link).toHaveAttribute('href', 'https://example.com/job/1');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('рендерит локацию, уровень и отметку об удалёнке при наличии данных', () => {
    renderCard();

    expect(screen.getByText('Москва')).toBeInTheDocument();
    expect(screen.getByText('senior')).toBeInTheDocument();
    expect(screen.getByText('Удалёнка')).toBeInTheDocument();
  });

  it('не рендерит локацию, уровень и удалёнку, если данных нет', () => {
    renderCard({ location: '', level: null, isRemote: false });

    expect(screen.queryByText('Москва')).not.toBeInTheDocument();
    expect(screen.queryByText('senior')).not.toBeInTheDocument();
    expect(screen.queryByText('Удалёнка')).not.toBeInTheDocument();
  });

  it('рендерит excerpt и aiSummary при наличии', () => {
    renderCard();

    expect(screen.getByText('Краткое описание вакансии')).toBeInTheDocument();
    expect(screen.getByText('Хорошо подходит под ваш профиль')).toBeInTheDocument();
  });

  it('не рендерит excerpt и aiSummary, если они пустые', () => {
    renderCard({ aiSummary: null, excerpt: '' });

    expect(screen.queryByText('Краткое описание вакансии')).not.toBeInTheDocument();
    expect(screen.queryByText('Хорошо подходит под ваш профиль')).not.toBeInTheDocument();
  });

  it('обрезает теги до 4 и показывает счётчик оставшихся', () => {
    renderCard();

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('nextjs')).toBeInTheDocument();
    expect(screen.getByText('vitest')).toBeInTheDocument();
    // 5-й тег не рендерится
    expect(screen.queryByText('css')).not.toBeInTheDocument();
    // счётчик +1
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('не показывает счётчик, если тегов 4 или меньше', () => {
    renderCard({ tags: ['react', 'typescript'] });

    expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
  });

  it('рендерит AI-скор, если он задан', () => {
    renderCard({ aiScore: 85 });

    expect(screen.getByText('AI: 85/100')).toBeInTheDocument();
  });

  it('не рендерит AI-скор, если он null', () => {
    renderCard({ aiScore: null });

    expect(screen.queryByText(/AI:/)).not.toBeInTheDocument();
  });

  it('рендерит блок зарплаты при наличии', () => {
    renderCard();

    expect(screen.getByText('Зарплата')).toBeInTheDocument();
    expect(screen.getByText('$5000')).toBeInTheDocument();
  });

  it('не рендерит блок зарплаты, если salary отсутствует', () => {
    renderCard({ salary: null });

    expect(screen.queryByText('Зарплата')).not.toBeInTheDocument();
  });

  it('показывает SOURCE в верхнем регистре', () => {
    renderCard({ source: 'remoteok' });
    expect(screen.getByText('REMOTEOK')).toBeInTheDocument();
  });
});
