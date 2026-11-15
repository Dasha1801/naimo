'use client';

import { JobList } from '@/components/JobList/JobList';
import { useState } from 'react';

export default function Home() {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    setSyncing(true);
    setMessage('');

    try {
      const response = await fetch('/api/jobs/sync');
      const data = await response.json();

      if (data.success) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ Ошибка: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Ошибка соединения');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Naimo 🚀</h1>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          onClick={handleSync}
          disabled={syncing}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: syncing ? 'not-allowed' : 'pointer',
            opacity: syncing ? 0.7 : 1,
          }}
        >
          {syncing ? 'Синхронизация...' : 'Синхронизировать с RemoteOK'}
        </button>

        {message && (
          <p style={{ marginTop: '1rem', color: message.includes('✅') ? 'green' : 'red' }}>
            {message}
          </p>
        )}
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Актуальные вакансии</h2>
      <JobList />
    </main>
  );
}
