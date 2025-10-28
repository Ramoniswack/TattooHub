import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthStateProvider from '@/components/providers/AuthStateProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthStateProvider>
            {children}
          </AuthStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
