import './globals.css';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from './providers';
import NavBar from '@/src/components/navbar';
import clsx from 'clsx';

export const metadata = {
  title: 'Fantasy OTH',
  description:
    'A fantasy manager pool for the mega fantasy hockey league OldTimeHockey.',
};

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='dark h-full'>
      <body
        className={clsx(inter.variable, 'dark:bg-zinc-900 dark:text-white')}
      >
        <NextAuthProvider>
          <NavBar />
          <main className='container relative mx-auto mt-8 min-h-screen items-center'>
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
