'use client';

import { TabNav, TextField } from '@radix-ui/themes';
import { Search, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { JobList } from '@/components/JobList/JobList';

import type { JobSource } from '@/api/types';
import styles from './JobsPage.module.scss';

interface JobsPageProps {
  source: JobSource;
}

export function JobsPage({ source }: JobsPageProps) {
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleClearSearch = () => setSearchQuery('');

  return (
    <main className={styles.jobsPage}>
      <section>
        <TabNav.Root size="2" className={styles.tabNav}>
          <TabNav.Link href="/" active={pathname === '/'}>
            Jobicy
          </TabNav.Link>
          <TabNav.Link href="/remoteok" active={pathname === '/remoteok'}>
            RemoteOK
          </TabNav.Link>
        </TabNav.Root>

        <form onSubmit={handleSearchSubmit} role="search" className={styles.searchForm}>
          <TextField.Root
            size="3"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Например: React, Python, дизайнер…"
            className={styles.searchField}
            aria-label="Поиск вакансий"
          >
            <TextField.Slot side="left">
              <Search size={22} aria-hidden="true" />
            </TextField.Slot>

            {searchQuery && (
              <TextField.Slot side="right">
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={handleClearSearch}
                  aria-label="Очистить поиск"
                >
                  <X size={16} />
                </button>
              </TextField.Slot>
            )}
          </TextField.Root>
        </form>

        <JobList source={source} search={searchQuery} />
      </section>
    </main>
  );
}
