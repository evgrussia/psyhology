import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Эмоциональный баланс — Admin',
  description: 'Админ-панель (каркас, FEAT-PLT-01).',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
