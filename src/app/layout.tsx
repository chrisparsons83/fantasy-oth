import './globals.css';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from './providers';
import NavBar from '@/src/components/navbar';

export const metadata = {
  title: 'Vercel Postgres Demo with Prisma',
  description:
    'A simple Next.js app with Vercel Postgres as the database and Prisma as the ORM',
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
    <html lang='en' className='h-full'>
      <body className={inter.variable}>
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
