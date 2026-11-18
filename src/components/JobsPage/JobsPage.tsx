'use client';

import { Flex, IconButton, TabNav, TextField } from '@radix-ui/themes';
import { Search, X } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { JobList } from '@/components/JobList/JobList';

import type { JobSource } from '@/api/types';
import { useSearchQuery } from '@/lib/hooks/useSearchQuery';
import styles from './JobsPage.module.scss';

interface JobsPageProps {
  source: JobSource;
}

export function JobsPage({ source }: JobsPageProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { query: urlQuery, setQuery: setUrlQuery } = useSearchQuery('tag');
  const [inputValue, setInputValue] = useState(urlQuery);

  const handleClearSearch = () => {
    setInputValue('');
    setUrlQuery('');
  };

  const handleSearch = () => setUrlQuery(inputValue);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleSearch();
  };

  const queryString = searchParams.toString();
  const suffix = queryString ? `?${queryString}` : '';

  return (
    <main className={styles.jobsPage}>
      <section>
        <TabNav.Root size="2" className={styles.tabNav}>
          <TabNav.Link href={`/${suffix}`} active={pathname === '/'}>
            Jobicy
          </TabNav.Link>
          <TabNav.Link href={`/remoteok${suffix}`} active={pathname === '/remoteok'}>
            RemoteOK
          </TabNav.Link>
        </TabNav.Root>

        <Flex role="search" className={styles.searchForm}>
          <TextField.Root
            size="3"
            type="search"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Например: React, Python, дизайнер…"
            aria-label="Поиск вакансий"
          >
            {inputValue && (
              <TextField.Slot side="right">
                <IconButton size="2" variant="ghost" onClick={handleClearSearch}>
                  <X size={18} />
                </IconButton>
              </TextField.Slot>
            )}
            {inputValue && (
              <TextField.Slot side="right">
                <IconButton size="2" variant="ghost" onClick={handleSearch}>
                  <Search size={18} aria-hidden="true" />
                </IconButton>
              </TextField.Slot>
            )}
          </TextField.Root>
        </Flex>

        <JobList source={source} />
      </section>
    </main>
  );
}
