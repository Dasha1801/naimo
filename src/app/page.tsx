'use client';

import * as Toast from '@radix-ui/react-toast';
import { TabNav, TextField } from '@radix-ui/themes';
import clsx from 'clsx';
import { RefreshCw, Search, X } from 'lucide-react';
import { useState } from 'react';

import { JobList } from '@/components/JobList/JobList';
import { Wrapper } from '@/components/ui/Wrapper/Wrapper';

import styles from './page.module.scss';

export default function Home() {
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [toast, setToast] = useState({
    open: false,
    title: '',
    description: '',
    variant: 'success' as 'success' | 'error',
  });

  const handleSync = async () => {
    if (syncing) return;

    setSyncing(true);

    try {
      const response = await fetch('/api/jobs/sync');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не удалось синхронизировать вакансии');
      }

      setToast({
        open: true,
        title: 'Синхронизация завершена',
        description: data.message,
        variant: 'success',
      });
    } catch (error) {
      setToast({
        open: true,
        title: 'Ошибка синхронизации',
        description: error instanceof Error ? error.message : 'Ошибка соединения',
        variant: 'error',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleSearchSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Toast.Provider swipeDirection="right">
      <main className={styles.home}>
        <section>
          <TabNav.Root size="2" className={styles.tabNav}>
            <TabNav.Link href="/" active>
              Jobicy
            </TabNav.Link>
            <TabNav.Link href="/remoteok">RemoteOK</TabNav.Link>
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

          <Wrapper gap="md" justify="space-between" align="center" className={styles.header}>
            <h2 className={styles.heading}>Актуальные вакансии</h2>

            <button
              type="button"
              className={styles.syncButton}
              onClick={handleSync}
              disabled={syncing}
              aria-label="Синхронизировать вакансии с RemoteOK"
              title="Синхронизировать с RemoteOK"
            >
              <RefreshCw
                size={20}
                className={clsx(styles.syncIcon, syncing && styles.syncIconLoading)}
              />
            </button>
          </Wrapper>

          <JobList search={searchQuery} />
        </section>
      </main>

      <Toast.Root
        open={toast.open}
        onOpenChange={(open) => setToast((current) => ({ ...current, open }))}
        duration={5000}
        className={clsx(
          styles.toast,
          toast.variant === 'success' ? styles.toastSuccess : styles.toastError,
        )}
      >
        <div className={styles.toastContent}>
          <Toast.Title className={styles.toastTitle}>{toast.title}</Toast.Title>

          <Toast.Description className={styles.toastDescription}>
            {toast.description}
          </Toast.Description>
        </div>

        <Toast.Close className={styles.toastClose} aria-label="Закрыть уведомление">
          <X size={18} />
        </Toast.Close>
      </Toast.Root>

      <Toast.Viewport className={styles.toastViewport} />
    </Toast.Provider>
  );
}
