import LeaguesTable from './LeaguesTable';
import { authOptions, requireAdmin } from '@/src/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React, { Suspense } from 'react';

const SeasonsPage = async () => {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  return (
    <div>
      <h1>Leagues</h1>
      <p>
        <Link href='/admin/leagues/new'>Create League</Link>
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <LeaguesTable />
      </Suspense>
    </div>
  );
};

export default SeasonsPage;
