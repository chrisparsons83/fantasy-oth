'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';

// Prisma does not support Edge without the Data Proxy currently
// export const runtime = 'edge'
export const preferredRegion = 'home';
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <p>
        If you're here, you likely already know what OTH is. Go{' '}
        <a
          href='#'
          onClick={() => signIn('discord')}
          className='text-blue-600 hover:text-blue-400'
        >
          log in with your Discord account
        </a>{' '}
        and then fill out{' '}
        <Link href='/my-entry' className='text-blue-600 hover:text-blue-400'>
          an entry
        </Link>
        .
      </p>
      <p>
        If by some reason you ended up here and have no idea what OTH is, go
        check out{' '}
        <a
          href='https://www.roldtimehockey.com'
          className='text-blue-600 hover:text-blue-400'
        >
          Old Time Hockey
        </a>
        .
      </p>
    </>
  );
}
