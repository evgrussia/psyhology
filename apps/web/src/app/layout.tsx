import './globals.css';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Gupter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

const gupter = Gupter({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata = {
  title: 'Эмоциональный баланс',
  description: 'Публичный сайт (каркас, FEAT-PLT-01).',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${gupter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
