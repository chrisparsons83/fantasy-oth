import { authOptions, requireAdmin } from '@/src/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const Page = async () => {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  return <div>Admin</div>;
};

export default Page;
