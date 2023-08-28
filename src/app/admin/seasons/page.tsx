import SeasonsTable from '@/src/components/admin/SeasonsTable';
import { authOptions, requireAdmin } from '@/src/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React, { Suspense } from 'react';

const SeasonsPage = async () => {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  return (
    <div>
      <h1>Seasons</h1>
      <p>
        <Link href='/admin/seasons/new'>Create Season</Link>
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <SeasonsTable />
      </Suspense>
    </div>
  );
};

export default SeasonsPage;
