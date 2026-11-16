import { TanstackQueryProvider } from '@/lib/providers/TanstackQueryProvider';
import '@/styles/globals.scss';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Naimo | AI Job Search',
  description: 'Умная платформа поиска работы с AI-агрегацией',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <TanstackQueryProvider>
          <Theme>{children}</Theme>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
