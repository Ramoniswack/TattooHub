import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthStateProvider from '@/components/providers/AuthStateProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TattooHub',
  description: 'Find and book your perfect tattoo artist',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthStateProvider>
          {children}
        </AuthStateProvider>
      </body>
    </html>
  );
}
