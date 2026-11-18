import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSearchQuery } from '../useSearchQuery';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

const mockedUseRouter = vi.mocked(useRouter);
const mockedUsePathname = vi.mocked(usePathname);
const mockedUseSearchParams = vi.mocked(useSearchParams);

type SetupOptions = {
  pathname?: string;
  search?: string;
};

function setup({ pathname = '/jobs', search = '' }: SetupOptions = {}) {
  const replace = vi.fn();

  mockedUseRouter.mockReturnValue({ replace } as unknown as ReturnType<typeof useRouter>);
  mockedUsePathname.mockReturnValue(pathname);
  mockedUseSearchParams.mockReturnValue(
    new URLSearchParams(search) as unknown as ReturnType<typeof useSearchParams>,
  );

  const { result, rerender } = renderHook(() => useSearchQuery());

  return { result, rerender, replace };
}

describe('useSearchQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('params', () => {
    it('возвращает объект из searchParams.entries()', () => {
      const { result } = setup({ search: '?tag=react&count=40' });

      expect(result.current.params).toEqual({ tag: 'react', count: '40' });
    });

    it('возвращает пустой объект, если query-строка пустая', () => {
      const { result } = setup();

      expect(result.current.params).toEqual({});
    });
  });

  describe('setParams', () => {
    it('устанавливает новый параметр и вызывает router.replace', () => {
      const { result, replace } = setup({ search: '' });

      act(() => result.current.setParams({ tag: 'react' }));

      expect(replace).toHaveBeenCalledWith('/jobs?tag=react', { scroll: false });
    });

    it('обновляет существующий параметр', () => {
      const { result, replace } = setup({ search: '?tag=react' });

      act(() => result.current.setParams({ tag: 'vue' }));

      expect(replace).toHaveBeenCalledWith('/jobs?tag=vue', { scroll: false });
    });

    it('удаляет параметр при null', () => {
      const { result, replace } = setup({ search: '?tag=react&count=40' });

      act(() => result.current.setParams({ tag: null }));

      expect(replace).toHaveBeenCalledWith('/jobs?count=40', { scroll: false });
    });

    it('удаляет параметр при undefined', () => {
      const { result, replace } = setup({ search: '?tag=react&count=40' });

      act(() => result.current.setParams({ count: undefined }));

      expect(replace).toHaveBeenCalledWith('/jobs?tag=react', { scroll: false });
    });

    it('удаляет параметр при пустой строке', () => {
      const { result, replace } = setup({ search: '?tag=react&count=40' });

      act(() => result.current.setParams({ tag: '' }));

      expect(replace).toHaveBeenCalledWith('/jobs?count=40', { scroll: false });
    });

    it('приводит число к строке', () => {
      const { result, replace } = setup();

      act(() => result.current.setParams({ count: 40 }));

      expect(replace).toHaveBeenCalledWith('/jobs?count=40', { scroll: false });
    });

    it('сохраняет параметры, не указанные в newParams', () => {
      const { result, replace } = setup({ search: '?tag=react&count=40' });

      act(() => result.current.setParams({ count: 60 }));

      expect(replace).toHaveBeenCalledWith('/jobs?tag=react&count=60', { scroll: false });
    });

    it('применяет несколько изменений за один вызов', () => {
      const { result, replace } = setup({ search: '?tag=react&count=40' });

      act(() => result.current.setParams({ tag: 'vue', count: null }));

      expect(replace).toHaveBeenCalledWith('/jobs?tag=vue', { scroll: false });
    });

    it('не падает, если searchParams пуст и всё удаляется', () => {
      const { result, replace } = setup({ search: '' });

      act(() => result.current.setParams({ tag: null }));

      expect(replace).toHaveBeenCalledWith('/jobs?', { scroll: false });
    });
  });

  describe('removeParam', () => {
    it('удаляет указанный ключ и сохраняет остальные', () => {
      const { result, replace } = setup({ search: '?tag=react&count=40' });

      act(() => result.current.removeParam('tag'));

      expect(replace).toHaveBeenCalledWith('/jobs?count=40', { scroll: false });
    });

    it('не падает, если ключа нет', () => {
      const { result, replace } = setup({ search: '?tag=react' });

      act(() => result.current.removeParam('missing'));

      expect(replace).toHaveBeenCalledWith('/jobs?tag=react', { scroll: false });
    });
  });

  describe('resetParams', () => {
    it('вызывает router.replace с чистым pathname', () => {
      const { result, replace } = setup({ search: '?tag=react&count=40' });

      act(() => result.current.resetParams());

      expect(replace).toHaveBeenCalledWith('/jobs', { scroll: false });
    });
  });

  describe('стабильность ссылок', () => {
    it('setParams не пересоздаётся при rerender с теми же зависимостями', () => {
      const { result, rerender } = setup({ search: '?tag=react' });
      const first = result.current.setParams;

      rerender();

      expect(result.current.setParams).toBe(first);
    });

    it('removeParam и resetParams стабильны между рендерами', () => {
      const { result, rerender } = setup({ search: '?tag=react' });
      const removeFirst = result.current.removeParam;
      const resetFirst = result.current.resetParams;

      rerender();

      expect(result.current.removeParam).toBe(removeFirst);
      expect(result.current.resetParams).toBe(resetFirst);
    });
  });
});
