'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useSearchQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = Object.fromEntries(searchParams.entries());

  const setParams = useCallback(
    (newParams: Record<string, string | number | null | undefined>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      router.replace(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const removeParam = useCallback(
    (key: string) => {
      const current = new URLSearchParams(searchParams.toString());
      current.delete(key);
      router.replace(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const resetParams = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { params, setParams, removeParam, resetParams, searchParams };
}
