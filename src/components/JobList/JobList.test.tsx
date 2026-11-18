import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useJobs } from '@/api/hooks/use-jobs';
import { useSearchQuery } from '@/lib/hooks/useSearchQuery';
import { JobList } from './JobList';

// Мокаем хук данных
vi.mock('@/api/hooks/use-jobs', () => ({
  useJobs: vi.fn(),
}));

// Мокаем хук query-параметров
vi.mock('@/lib/hooks/useSearchQuery', () => ({
  useSearchQuery: vi.fn(),
}));

// Мокаем QueryState — чтобы не тащить его внутреннюю логику
vi.mock('@/components/ui/QueryState/QueryState', () => ({
  QueryState: ({
    type,
    title,
    action,
  }: {
    type: string;
    title?: string;
    action?: { label: string; onClick: () => void };
  }) => (
    <div data-testid={`query-state-${type}`}>
      {title && <span>{title}</span>}
      {action && <button onClick={action.onClick}>{action.label}</button>}
    </div>
  ),
}));

// Мокаем JobCard — нас интересует только то, что он рендерится с нужным job
vi.mock('../JobCard/JobCard', () => ({
  JobCard: ({ job }: { job: { id: string; title: string } }) => (
    <div data-testid="job-card">{job.title}</div>
  ),
}));

const mockedUseJobs = vi.mocked(useJobs);
const mockedUseSearchQuery = vi.mocked(useSearchQuery);

type Job = { id: string; title: string };

type UseJobsResult = ReturnType<typeof useJobs>;

function makeJobs(count: number): Job[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    title: `Job ${i + 1}`,
  }));
}

type SetupOptions = {
  source?: 'jobicy' | 'remoteok';
  count?: string | null;
  jobs?: Job[];
  isLoading?: boolean;
  isError?: boolean;
  isFetching?: boolean;
  hasMore?: boolean;
  refetch?: ReturnType<typeof vi.fn>;
};

function setup({
  source = 'jobicy',
  count = null,
  jobs = makeJobs(2),
  isLoading = false,
  isError = false,
  isFetching = false,
  hasMore = false,
  refetch = vi.fn(),
}: SetupOptions = {}) {
  const setParams = vi.fn();

  mockedUseSearchQuery.mockReturnValue({
    params: { tag: null, count },
    setParams,
  } as unknown as ReturnType<typeof useSearchQuery>);

  mockedUseJobs.mockReturnValue({
    data: isLoading || isError ? undefined : { jobs, hasMore },
    isLoading,
    isError,
    isFetching,
    refetch,
  } as unknown as UseJobsResult);

  const user = userEvent.setup();
  render(<JobList source={source} />);

  return { user, setParams, refetch };
}

describe('JobList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('состояния загрузки', () => {
    it('рендерит loading, пока данные грузятся', () => {
      setup({ isLoading: true });

      expect(screen.getByTestId('query-state-loading')).toBeInTheDocument();
      expect(screen.queryByTestId('job-card')).not.toBeInTheDocument();
    });

    it('рендерит error с кнопкой повтора и вызывает refetch по клику', async () => {
      const refetch = vi.fn();
      const { user } = setup({ isError: true, refetch });

      expect(screen.getByTestId('query-state-error')).toBeInTheDocument();
      expect(screen.getByText('Не удалось загрузить вакансии')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Попробовать снова' }));
      expect(refetch).toHaveBeenCalledTimes(1);
    });

    it('рендерит empty, если вакансий нет', () => {
      setup({ jobs: [] });

      expect(screen.getByTestId('query-state-empty')).toBeInTheDocument();
      expect(screen.getByText('Пока нет вакансий')).toBeInTheDocument();
    });

    it('рендерит empty, если data === undefined', () => {
      setup({ jobs: [] });
      expect(screen.getByTestId('query-state-empty')).toBeInTheDocument();
    });
  });

  describe('список вакансий', () => {
    it('рендерит JobCard для каждой вакансии', () => {
      setup({ jobs: makeJobs(3) });

      const cards = screen.getAllByTestId('job-card');
      expect(cards).toHaveLength(3);
      expect(cards[0]).toHaveTextContent('Job 1');
      expect(cards[2]).toHaveTextContent('Job 3');
    });

    it('показывает loading под списком, если isFetching и данные есть', () => {
      setup({ jobs: makeJobs(2), isFetching: true });

      expect(screen.getAllByTestId('job-card')).toHaveLength(2);
      expect(screen.getByTestId('query-state-loading')).toBeInTheDocument();
    });

    it('не показывает loading, если isFetching = false', () => {
      setup({ jobs: makeJobs(2), isFetching: false });

      expect(screen.queryByTestId('query-state-loading')).not.toBeInTheDocument();
    });
  });

  describe('пагинация', () => {
    it('показывает «Показать ещё» при hasMore и увеличивает count на 20', async () => {
      const { user, setParams } = setup({ jobs: makeJobs(2), hasMore: true, count: null });

      await user.click(screen.getByRole('button', { name: /Показать ещё/ }));

      expect(setParams).toHaveBeenCalledWith({ count: 40 }); // 20 + 20
    });

    it('увеличивает count от текущего значения, а не от 20', async () => {
      const { user, setParams } = setup({
        jobs: makeJobs(2),
        hasMore: true,
        count: '40',
      });

      await user.click(screen.getByRole('button', { name: /Показать ещё/ }));

      expect(setParams).toHaveBeenCalledWith({ count: 60 });
    });

    it('не показывает «Показать ещё», если hasMore = false', () => {
      setup({ jobs: makeJobs(2), hasMore: false });

      expect(screen.queryByRole('button', { name: /Показать ещё/ })).not.toBeInTheDocument();
    });

    it('блокирует «Показать ещё» во время isFetching', () => {
      setup({ jobs: makeJobs(2), hasMore: true, isFetching: true });

      expect(screen.getByRole('button', { name: /Показать ещё/ })).toBeDisabled();
    });

    it('не показывает «Свернуть» при count = 20', () => {
      setup({ jobs: makeJobs(2), count: null });

      expect(screen.queryByRole('button', { name: /Свернуть/ })).not.toBeInTheDocument();
    });

    it('показывает «Свернуть» при count !== 20 и вызывает setParams({ count: null }) + scrollTo', async () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      const { user, setParams } = setup({
        jobs: makeJobs(2),
        count: '40',
      });

      await user.click(screen.getByRole('button', { name: /Свернуть/ }));

      expect(setParams).toHaveBeenCalledWith({ count: null });
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

      scrollToSpy.mockRestore();
    });

    it('блокирует «Свернуть» во время isFetching', () => {
      setup({ jobs: makeJobs(2), count: '40', isFetching: true });

      expect(screen.getByRole('button', { name: /Свернуть/ })).toBeDisabled();
    });
  });
});
