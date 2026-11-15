import { JobCard } from '@/components/JobCard/JobCard';

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        Naimo 🚀
      </h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', textAlign: 'center' }}>
        Примеры карточек вакансий
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <JobCard
          title="Frontend Developer (React/Next.js)"
          company="Яндекс"
          salary="от 250 000 ₽"
          remote={true}
        />
        <JobCard
          title="Senior React Developer"
          company="Тинькофф"
          salary="300 000 - 400 000 ₽"
          remote={false}
        />
        <JobCard
          title="Fullstack Developer"
          company="Сбер"
          remote={true}
        />
      </div>
    </main>
  );
}