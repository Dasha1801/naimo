import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSearchQuery } from '@/lib/hooks/useSearchQuery';
import { usePathname } from 'next/navigation';
import { JobHeader } from './JobHeader';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/lib/hooks/useSearchQuery', () => ({
  useSearchQuery: vi.fn(),
}));

const mockedUsePathname = vi.mocked(usePathname);
const mockedUseSearchQuery = vi.mocked(useSearchQuery);

type SetupOptions = {
  pathname?: string;
  tag?: string | null;
};

function setup({ pathname = '/', tag = null }: SetupOptions = {}) {
  const setParams = vi.fn();
  mockedUsePathname.mockReturnValue(pathname);
  mockedUseSearchQuery.mockReturnValue({
    params: { tag, count: null },
    setParams,
  } as unknown as ReturnType<typeof useSearchQuery>);

  const user = userEvent.setup();
  render(<JobHeader />);

  return { user, setParams };
}

// TabNav.Link из Radix Themes дублирует текст в скрытом span для анимации,
// из-за чего accessible name = "JobicyJobicy". Поэтому ищем по подстроке.
function getTabLink(label: 'Jobicy' | 'RemoteOK') {
  return screen.getByRole('link', { name: new RegExp(label) });
}

function getSearchInput() {
  return screen.getByLabelText('Поиск вакансий') as HTMLInputElement;
}

function getClearButton() {
  return screen.getByRole('button', { name: 'Очистить поиск' });
}

function getSearchButton() {
  return screen.getByRole('button', { name: 'Найти' });
}

describe('JobHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('табы навигации', () => {
    it('рендерит оба таба с корректными href без tag', () => {
      setup();

      expect(getTabLink('Jobicy')).toHaveAttribute('href', '/');
      expect(getTabLink('RemoteOK')).toHaveAttribute('href', '/remoteok');
    });

    it('добавляет ?tag= к href, если tag задан', () => {
      setup({ tag: 'react' });

      expect(getTabLink('Jobicy')).toHaveAttribute('href', '/?tag=react');
      expect(getTabLink('RemoteOK')).toHaveAttribute('href', '/remoteok?tag=react');
    });

    it('кодирует tag в href', () => {
      setup({ tag: 'c++ developer' });

      expect(getTabLink('Jobicy')).toHaveAttribute('href', '/?tag=c%2B%2B%20developer');
    });

    it('помечает активным Jobicy при pathname = /', () => {
      setup({ pathname: '/' });

      expect(getTabLink('Jobicy')).toHaveAttribute('aria-current', 'page');
      expect(getTabLink('RemoteOK')).not.toHaveAttribute('aria-current');
    });

    it('помечает активным RemoteOK при pathname = /remoteok', () => {
      setup({ pathname: '/remoteok' });

      expect(getTabLink('RemoteOK')).toHaveAttribute('aria-current', 'page');
      expect(getTabLink('Jobicy')).not.toHaveAttribute('aria-current');
    });
  });

  describe('поле ввода', () => {
    it('инициализирует поле ввода значением tag', () => {
      setup({ tag: 'python' });

      expect(getSearchInput()).toHaveValue('python');
    });

    it('обновляет поле ввода при вводе, но не вызывает setParams', async () => {
      const { user, setParams } = setup();
      const input = getSearchInput();

      await user.type(input, 'react');

      expect(input).toHaveValue('react');
      expect(setParams).not.toHaveBeenCalled();
    });

    it('вызывает setParams с tag и сбрасывает count по Enter', async () => {
      const { user, setParams } = setup();
      const input = getSearchInput();

      await user.type(input, 'react{Enter}');

      expect(setParams).toHaveBeenCalledWith({ tag: 'react', count: null });
      expect(setParams).toHaveBeenCalledTimes(1);
    });
  });

  describe('кнопки очистки и поиска', () => {
    it('не показывает кнопки при пустом поле', () => {
      setup();

      expect(screen.queryByRole('button', { name: 'Очистить поиск' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Найти' })).not.toBeInTheDocument();
    });

    it('показывает кнопки очистки и поиска при непустом поле', async () => {
      const { user } = setup();

      await user.type(getSearchInput(), 'react');

      expect(getClearButton()).toBeInTheDocument();
      expect(getSearchButton()).toBeInTheDocument();
    });

    it('очищает поле и вызывает setParams({ tag: null, count: null })', async () => {
      const { user, setParams } = setup({ tag: 'react' });
      const input = getSearchInput();

      await user.click(getClearButton());

      expect(input).toHaveValue('');
      expect(setParams).toHaveBeenCalledWith({ tag: null, count: null });
    });

    it('вызывает setParams с текущим значением поля по клику на «Найти»', async () => {
      const { user, setParams } = setup();
      const input = getSearchInput();

      await user.type(input, 'typescript');
      await user.click(getSearchButton());

      expect(setParams).toHaveBeenCalledWith({ tag: 'typescript', count: null });
    });
  });

  it('рендерит контейнер с ролью search', () => {
    setup();

    expect(screen.getByRole('search')).toBeInTheDocument();
  });
});
